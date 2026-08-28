/**
 * The parts of the members pipeline that both the Next app and the build-time
 * image ingest need.
 *
 * Deliberately free of `@/` path aliases, JSON imports and React: the ingest
 * script (scripts/ingest-member-images.ts) runs under tsx, outside Next's
 * resolver, and imports this file by relative path. Keeping the feed URL, the
 * slug rule and the Drive-link parser here means the script and the site can
 * never disagree about which member a downloaded file belongs to.
 */

import { slugify } from './slug';

/** Trim any sheet cell down to a clean string. */
export const str = (v: unknown): string =>
  typeof v === 'string' ? v.trim() : v == null ? '' : String(v).trim();

/**
 * Members feed. Server-side only — this URL must never reach client code, or
 * anyone could read the directory source directly.
 *
 * There is no hard-coded fallback: an unset variable is a configuration
 * problem we want to see reported, not paper over with a stale endpoint.
 *
 * Read through a function, not a module-scope const, deliberately. The ingest
 * script has to call loadEnvConfig() to pick up .env.local (tsx does not do it
 * the way `next` does), and a const would have been frozen to '' at import
 * time — ESM hoists imports above anything the script body can run first.
 */
export const membersFeedUrl = (): string => process.env.MEMBERS_FEED_URL?.trim() ?? '';

/** Hard ceiling on the feed request. Next kills a static export at 60s. */
export const FEED_TIMEOUT_MS = 12_000;

/** The slug a member is published under. Sheet value wins; else the business name. */
export const memberSlug = (raw: Record<string, unknown>): string =>
  slugify(str(raw.slug)) || slugify(str(raw.business));

/**
 * Extract a Google Drive file ID from any of the share-link shapes the sheet
 * collects. Returns null for anything that is not a Drive link, so a member
 * who pasted a plain https image URL is reported as a failure rather than
 * silently downloaded from an unexpected host.
 *
 *   https://drive.google.com/file/d/<ID>/view?usp=sharing
 *   https://drive.google.com/open?id=<ID>
 *   https://drive.google.com/uc?export=download&id=<ID>
 *   https://docs.google.com/uc?id=<ID>
 *   <ID>                                (bare, as pasted from the Drive UI)
 */
export function driveFileId(input: unknown): string | null {
  const s = str(input);
  if (!s) return null;

  const patterns = [/\/file\/d\/([A-Za-z0-9_-]{10,})/, /\/d\/([A-Za-z0-9_-]{10,})/, /[?&]id=([A-Za-z0-9_-]{10,})/];
  for (const re of patterns) {
    const m = re.exec(s);
    if (m) return m[1];
  }

  // A bare ID pasted straight out of the Drive UI.
  if (/^[A-Za-z0-9_-]{20,}$/.test(s)) return s;

  return null;
}

/** Direct-download URL for a Drive file ID. */
export const driveDownloadUrl = (id: string): string =>
  `https://drive.google.com/uc?export=download&id=${id}`;

/**
 * Drive serves large or scan-deferred files behind an HTML interstitial. This
 * host answers the same file directly and is the documented way past it.
 */
export const driveConfirmUrl = (id: string): string =>
  `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;

export interface FeedResult {
  rows: Record<string, unknown>[];
  error: string | null;
}

/**
 * Fetch the raw feed. Shared so the ingest script and the site parse identical
 * rows. `revalidate` is passed through to Next's fetch cache when called from
 * the app; the script passes nothing and gets a plain fetch.
 */
export async function fetchMemberRows(init?: RequestInit): Promise<FeedResult> {
  const url = membersFeedUrl();
  if (!url) {
    return { rows: [], error: 'MEMBERS_FEED_URL is not set' };
  }

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(FEED_TIMEOUT_MS),
      ...init,
    });
    if (!res.ok) return { rows: [], error: `Members feed returned ${res.status}` };

    const text = await res.text();
    // Google sometimes answers with an HTML interstitial instead of JSON.
    if (!text.trimStart().startsWith('[')) {
      return { rows: [], error: 'Members feed did not return JSON (likely a Google interstitial)' };
    }

    const parsed: unknown = JSON.parse(text);
    if (!Array.isArray(parsed)) return { rows: [], error: 'Members feed did not return an array' };

    return {
      rows: parsed.filter((r): r is Record<string, unknown> => !!r && typeof r === 'object'),
      error: null,
    };
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.name === 'TimeoutError'
          ? `Members feed timed out after ${FEED_TIMEOUT_MS}ms`
          : err.message
        : 'Members feed unreachable';
    return { rows: [], error: msg };
  }
}
