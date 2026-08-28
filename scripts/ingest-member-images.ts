/**
 * Build-time Google Drive image ingest for the member directory.
 *
 *   npm run ingest:members          (also runs automatically via `prebuild`)
 *   npm run ingest:members -- --force
 *
 * The sheet stores member logos and photos as Drive *share links*. Serving
 * those directly would mean hotlinking Google, an origin we do not control,
 * cannot cache, and cannot put behind next/image. So at build time we pull
 * each file down once, write it into public/members/, and record what we
 * wrote in src/data/member-images.json. From then on the site serves its own
 * copy through next/image like any other local asset.
 *
 * Rules this script must never break:
 *
 *   - It never fails the build. Every failure is collected and written to
 *     audit/member-image-failures.md, and the process exits 0 regardless.
 *     A member whose image failed simply renders the branded placeholder.
 *   - Files over MAX_BYTES are rejected, as are files that are not really
 *     jpg/png/webp. The declared Content-Type is not trusted; the magic bytes
 *     are what decide.
 *   - The manifest is the cache. An entry is reused when the Drive file ID is
 *     unchanged and the file is still on disk, which makes a rebuild with an
 *     unchanged sheet do zero downloads. When a file IS fetched, its content
 *     hash decides whether anything is rewritten, so unchanged bytes never
 *     produce a new file or a manifest churn.
 *
 * Dimensions are parsed straight out of the image headers rather than pulling
 * in an image library — the site's convention is that every <Image> carries
 * explicit width/height, and these three formats are cheap to read.
 */

import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  MEMBERS_FEED_URL,
  driveConfirmUrl,
  driveDownloadUrl,
  driveFileId,
  fetchMemberRows,
  memberSlug,
  str,
} from '../src/lib/members-source';
import { measure, sniff, type Ext } from './image-header';

/* ------------------------------------------------------------------ *
 * Configuration
 * ------------------------------------------------------------------ */

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'members');
const MANIFEST_PATH = path.join(ROOT, 'src', 'data', 'member-images.json');
const FAILURES_PATH = path.join(ROOT, 'audit', 'member-image-failures.md');

/** Public path prefix the site serves these from. */
const PUBLIC_PREFIX = '/members';

const MAX_BYTES = 5 * 1024 * 1024;
const DOWNLOAD_TIMEOUT_MS = 20_000;
const CONCURRENCY = 4;

const KINDS = ['logo', 'photo'] as const;
type Kind = (typeof KINDS)[number];

const FORCE = process.argv.includes('--force');

/* ------------------------------------------------------------------ *
 * Manifest
 * ------------------------------------------------------------------ */

interface ManifestEntry {
  /** Site-absolute path, e.g. "/members/acme-co-logo.png". */
  file: string;
  width: number;
  height: number;
  /** sha256 of the bytes on disk, truncated. Detects a changed Drive file. */
  hash: string;
  /** Drive file ID this came from. The cache key. */
  driveId: string;
  ext: Ext;
  bytes: number;
}

/** Keyed `${slug}:${kind}`. */
type Manifest = Record<string, ManifestEntry>;

async function readManifest(): Promise<Manifest> {
  try {
    return JSON.parse(await readFile(MANIFEST_PATH, 'utf8')) as Manifest;
  } catch {
    return {};
  }
}

/* ------------------------------------------------------------------ *
 * Image sniffing
 *
 * Content-Type from Drive is unreliable (it happily says text/html, or
 * application/octet-stream), so the file signature is what decides. See
 * scripts/image-header.ts.
 * ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ *
 * Download
 * ------------------------------------------------------------------ */

class IngestError extends Error {}

/**
 * Read a response body with a hard byte ceiling.
 *
 * Streaming rather than res.arrayBuffer() so an oversized file is abandoned
 * partway instead of being pulled fully into memory just to be rejected.
 */
async function readCapped(res: Response, limit: number): Promise<Buffer> {
  const declared = Number(res.headers.get('content-length') ?? '0');
  if (declared > limit) {
    throw new IngestError(`file is ${fmtBytes(declared)}, over the ${fmtBytes(limit)} limit`);
  }

  if (!res.body) throw new IngestError('response had no body');

  const chunks: Buffer[] = [];
  let total = 0;
  const reader = res.body.getReader();

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limit) {
      await reader.cancel();
      throw new IngestError(`file exceeds the ${fmtBytes(limit)} limit`);
    }
    chunks.push(Buffer.from(value));
  }

  return Buffer.concat(chunks);
}

async function fetchDriveFile(id: string): Promise<Buffer> {
  const attempts = [driveDownloadUrl(id), driveConfirmUrl(id)];
  let lastError = 'unreachable';

  for (const url of attempts) {
    let res: Response;
    try {
      res = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
        // Drive answers plain fetches with the scan interstitial more often
        // than it answers a browser-shaped request.
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NexCoreSiteBuild/1.0)' },
      });
    } catch (err) {
      lastError =
        err instanceof Error && err.name === 'TimeoutError'
          ? `download timed out after ${DOWNLOAD_TIMEOUT_MS}ms`
          : err instanceof Error
            ? err.message
            : 'download failed';
      continue;
    }

    if (!res.ok) {
      lastError = `Drive returned ${res.status}${res.status === 404 ? ' (not found, or not shared publicly)' : ''}`;
      continue;
    }

    const buf = await readCapped(res, MAX_BYTES);

    // The virus-scan / permissions interstitial comes back as HTML. The next
    // attempt uses the confirm host, which serves the bytes directly.
    if (sniff(buf) === null && looksLikeHtml(buf)) {
      lastError = permissionHint(buf);
      continue;
    }

    return buf;
  }

  throw new IngestError(lastError);
}

function looksLikeHtml(buf: Buffer): boolean {
  return /^\s*(<!doctype html|<html)/i.test(buf.toString('utf8', 0, 200));
}

function permissionHint(buf: Buffer): string {
  const body = buf.toString('utf8', 0, 4000);
  if (/sign in|request access|permission/i.test(body)) {
    return 'Drive returned a sign-in page — the file is not shared with "Anyone with the link"';
  }
  return 'Drive returned an HTML interstitial instead of the file';
}

/* ------------------------------------------------------------------ *
 * Per-file ingest
 * ------------------------------------------------------------------ */

interface Job {
  slug: string;
  business: string;
  kind: Kind;
  raw: string;
}

interface Failure {
  business: string;
  slug: string;
  kind: Kind;
  raw: string;
  reason: string;
}

interface Outcome {
  key: string;
  entry: ManifestEntry | null;
  failure: Failure | null;
  /** Reused from the manifest without a network round trip. */
  cached: boolean;
  /** Downloaded, but the bytes were identical to what was already on disk. */
  unchanged: boolean;
}

async function ingestOne(job: Job, previous: Manifest): Promise<Outcome> {
  const key = `${job.slug}:${job.kind}`;
  const fail = (reason: string): Outcome => ({
    key,
    entry: null,
    cached: false,
    unchanged: false,
    failure: { business: job.business, slug: job.slug, kind: job.kind, raw: job.raw, reason },
  });

  const id = driveFileId(job.raw);
  if (!id) return fail('not a recognisable Google Drive share link');

  const prior = previous[key];

  // Cache hit: same Drive file, and our copy is still on disk. No request.
  if (
    !FORCE &&
    prior &&
    prior.driveId === id &&
    existsSync(path.join(ROOT, 'public', prior.file.replace(/^\//, '')))
  ) {
    return { key, entry: prior, failure: null, cached: true, unchanged: true };
  }

  let buf: Buffer;
  try {
    buf = await fetchDriveFile(id);
  } catch (err) {
    return fail(err instanceof Error ? err.message : 'download failed');
  }

  const ext = sniff(buf);
  if (!ext) {
    return fail(
      looksLikeHtml(buf)
        ? permissionHint(buf)
        : 'not a JPG, PNG or WebP (checked by file signature, not by extension)',
    );
  }
  if (buf.length > MAX_BYTES) {
    return fail(`file is ${fmtBytes(buf.length)}, over the ${fmtBytes(MAX_BYTES)} limit`);
  }

  const dims = measure(buf, ext);
  if (!dims) return fail(`could not read image dimensions from the ${ext.toUpperCase()} header`);

  const hash = createHash('sha256').update(buf).digest('hex').slice(0, 16);
  const file = `${PUBLIC_PREFIX}/${job.slug}-${job.kind}.${ext}`;
  const target = path.join(OUT_DIR, path.basename(file));

  // Content hash decides whether anything is rewritten. Identical bytes leave
  // the file, its mtime, and the manifest entry exactly as they were.
  const unchanged = prior?.hash === hash && prior.ext === ext && existsSync(target);
  if (!unchanged) {
    await writeFile(target, buf);
  }

  return {
    key,
    entry: { file, width: dims.width, height: dims.height, hash, driveId: id, ext, bytes: buf.length },
    failure: null,
    cached: false,
    unchanged,
  };
}

/* ------------------------------------------------------------------ *
 * Reporting
 * ------------------------------------------------------------------ */

function fmtBytes(n: number): string {
  return n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)}MB` : `${Math.round(n / 1024)}KB`;
}

async function writeFailureReport(failures: Failure[], feedError: string | null): Promise<void> {
  const stamp = new Date().toISOString().replace('T', ' ').slice(0, 16);

  if (!failures.length && !feedError) {
    // Leave a green report rather than a stale red one from a previous run.
    await writeFile(
      FAILURES_PATH,
      `# Member image failures\n\n_Last run ${stamp} UTC._\n\nNo failures. Every logo and photo in the members feed was ingested.\n`,
    );
    return;
  }

  const lines = [
    '# Member image failures',
    '',
    `_Last run ${stamp} UTC._`,
    '',
    'Generated by `scripts/ingest-member-images.ts`. Each row is an image the',
    'build could not turn into a local asset; those members render the branded',
    'NexCore placeholder instead. Nothing here breaks the build.',
    '',
  ];

  if (feedError) {
    lines.push('## Feed', '', `**The members feed itself failed: ${feedError}**`, '');
    lines.push(
      'No images could be checked. Existing files in `public/members/` and the',
      'entries in `src/data/member-images.json` were left untouched.',
      '',
    );
  }

  if (failures.length) {
    lines.push(
      `## Images (${failures.length})`,
      '',
      '| Member | Field | Reason | Source |',
      '| --- | --- | --- | --- |',
    );
    for (const f of failures) {
      lines.push(
        `| ${md(f.business)} <br><code>${f.slug}</code> | ${f.kind} | ${md(f.reason)} | ${md(truncate(f.raw, 70))} |`,
      );
    }
    lines.push('', '### Most common causes', '');
    lines.push(
      '- The Drive file is not shared as **Anyone with the link**.',
      '- The cell holds a folder link, or a link to a Google Doc rather than an image file.',
      '- The file is a HEIC, GIF, SVG or PDF. Only JPG, PNG and WebP are accepted.',
      `- The file is larger than ${fmtBytes(MAX_BYTES)}.`,
      '',
    );
  }

  await writeFile(FAILURES_PATH, `${lines.join('\n')}\n`);
}

const md = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
const truncate = (s: string, n: number) => (s.length <= n ? s : `${s.slice(0, n - 1)}…`);

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

async function main(): Promise<void> {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.dirname(FAILURES_PATH), { recursive: true });

  const previous = await readManifest();

  if (!MEMBERS_FEED_URL) {
    console.warn(
      '[members] MEMBERS_FEED_URL is not set — skipping image ingest.\n' +
        '[members] The directory will build and render placeholders. Set it in .env.local (see .env.example).',
    );
    await writeFailureReport([], 'MEMBERS_FEED_URL is not set');
    return;
  }

  const { rows, error } = await fetchMemberRows({ cache: 'no-store' });

  if (error) {
    // Keep whatever we already have. A feed outage must not wipe the images
    // that are on disk and working.
    console.warn(`[members] feed failed: ${error} — keeping the existing manifest.`);
    await writeFailureReport([], error);
    return;
  }

  const jobs: Job[] = [];
  const slugs = new Set<string>();

  for (const row of rows) {
    const slug = memberSlug(row);
    const business = str(row.business);
    // Mirrors the site's own de-dupe: first row for a slug wins.
    if (!slug || !business || slugs.has(slug)) continue;
    slugs.add(slug);

    for (const kind of KINDS) {
      const raw = str(row[kind]);
      if (raw) jobs.push({ slug, business, kind, raw });
    }
  }

  console.log(`[members] ${slugs.size} members, ${jobs.length} images to check`);

  const outcomes: Outcome[] = [];
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, jobs.length) }, async () => {
      for (;;) {
        const i = cursor++;
        if (i >= jobs.length) return;
        outcomes.push(await ingestOne(jobs[i], previous));
      }
    }),
  );

  const manifest: Manifest = {};
  const failures: Failure[] = [];
  for (const o of outcomes) {
    if (o.entry) manifest[o.key] = o.entry;
    if (o.failure) failures.push(o.failure);
  }

  // Deterministic key order, so the committed manifest does not churn.
  const sorted: Manifest = {};
  for (const key of Object.keys(manifest).sort()) sorted[key] = manifest[key];

  await writeFile(MANIFEST_PATH, `${JSON.stringify(sorted, null, 2)}\n`);

  // Drop files for members and fields that are no longer in the feed. Scoped
  // to our own naming pattern so nothing else in public/members is touched.
  const keep = new Set(Object.values(sorted).map((e) => path.basename(e.file)));
  let pruned = 0;
  for (const name of await readdir(OUT_DIR)) {
    if (!/-(logo|photo)\.(jpg|png|webp)$/.test(name) || keep.has(name)) continue;
    await rm(path.join(OUT_DIR, name), { force: true });
    pruned += 1;
  }

  await writeFailureReport(failures, null);

  const fetched = outcomes.filter((o) => !o.cached && o.entry);
  const written = fetched.filter((o) => !o.unchanged).length;
  console.log(
    `[members] ${outcomes.filter((o) => o.cached).length} cached, ` +
      `${fetched.length} fetched (${written} written, ${fetched.length - written} unchanged), ` +
      `${pruned} pruned, ${failures.length} failed`,
  );
  if (failures.length) {
    console.warn(`[members] see audit/member-image-failures.md`);
  }
}

// Never fail the build. An unexpected throw here is still just missing
// artwork, and the site renders placeholders for it.
main().catch((err: unknown) => {
  console.error('[members] image ingest failed, continuing the build:', err);
  process.exitCode = 0;
});
