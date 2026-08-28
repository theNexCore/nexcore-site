import 'server-only';

import { abs, site } from '@/data/site';
import { toTier, tierRank } from '@/data/member-tiers';
import { slugify } from './slug';
import { str, memberSlug, fetchMemberRows } from './members-source';
import { SOCIAL_KEYS, type MemberImage, type NexMember, type SocialKey } from './members';
import manifest from '@/data/member-images.json';

/**
 * Server-side member data access.
 *
 * `server-only` is the point of this file: the members feed URL must never
 * reach client code, so the module that reads it refuses to be bundled for the
 * browser. Client components import types and display helpers from
 * ./members instead, which has no such dependency.
 */

/* ------------------------------------------------------------------ *
 * Email protection
 *
 * The brief: do not put the raw address in the DOM. So the server ships a
 * reversed-then-base64 token, and MemberEmail reverses the transform inside
 * the click handler.
 *
 * This is obfuscation, not encryption — a scraper that executes JS and clicks
 * still gets there. It defeats the overwhelming majority, which harvest raw
 * `mailto:` hrefs and @-shaped text out of static HTML, and that is the goal.
 * ------------------------------------------------------------------ */

const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}$/i;

/** Reverse, then base64. Decoded by MemberEmail with atob + reverse. */
function encodeEmail(email: string): string | null {
  const clean = email.trim();
  if (!EMAIL_RE.test(clean)) return null;
  const reversed = [...clean].reverse().join('');
  return Buffer.from(reversed, 'utf8').toString('base64');
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

type ImageManifest = Record<string, { file: string; width: number; height: number }>;
const images = manifest as ImageManifest;

/**
 * Look up an ingested image. Returns null when the ingest skipped or failed on
 * this file, which is what MemberArt renders the branded placeholder for.
 */
function imageFor(slug: string, kind: 'logo' | 'photo'): MemberImage | null {
  const hit = images[`${slug}:${kind}`];
  return hit ? { src: hit.file, width: hit.width, height: hit.height } : null;
}

function splitList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(str).filter(Boolean);
  const s = str(v);
  if (!s) return [];
  return s
    .split(/[\n,;|]+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

/**
 * Fold a category to one canonical spelling so "REAL ESTATE", "Real Estate"
 * and "real estate" produce a single filter chip rather than three.
 * Short all-caps words (LLC, IT, CPA) keep their casing.
 */
function normaliseCategory(raw: string): string {
  return raw
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((w) =>
      w.length <= 3 && w === w.toUpperCase() ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
    )
    .join(' ');
}

/** "(314) 433-9330" -> "+13144339330". Null when there are not enough digits. */
function toTel(raw: string): string | null {
  const hasPlus = raw.trim().startsWith('+');
  const digits = raw.replace(/\D/g, '');
  if (hasPlus && digits.length >= 8) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}

/** Accept a bare "acme.com" as well as a full URL. Rejects anything non-http. */
function toUrl(raw: string): string | null {
  if (!raw) return null;
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const u = new URL(withScheme);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    return u.toString();
  } catch {
    return null;
  }
}

function hostLabel(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/** Per-network profile root, used when the sheet holds a handle not a URL. */
const SOCIAL_BASE: Record<SocialKey, string> = {
  instagram: 'https://www.instagram.com/',
  tiktok: 'https://www.tiktok.com/@',
  youtube: 'https://www.youtube.com/@',
  facebook: 'https://www.facebook.com/',
  x: 'https://x.com/',
  linkedin: 'https://www.linkedin.com/in/',
};

/** Accepts a full URL, an @handle, or a bare handle. Blank stays blank. */
function toSocial(key: SocialKey, raw: string): string | null {
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw) || /^[\w-]+\.[\w.-]+\//.test(raw)) return toUrl(raw);
  const handle = raw.replace(/^@+/, '').trim();
  if (!handle || /[\s/]/.test(handle)) return null;
  return `${SOCIAL_BASE[key]}${handle}`;
}

/** Bucket for the A-Z strip. Leading articles are ignored; non-letters go to "#". */
function firstLetter(business: string): string {
  const ch = business.replace(/^(the|a|an)\s+/i, '').trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(ch) ? ch : '#';
}

/* ------------------------------------------------------------------ *
 * Normalisation
 *
 * Tolerant by design, matching the events feed: a member with a business name
 * is publishable and every other column is optional.
 * ------------------------------------------------------------------ */

function normalise(raw: Record<string, unknown>): NexMember | null {
  const business = str(raw.business);
  if (!business) return null;

  const slug = memberSlug(raw) || slugify(business);
  if (!slug) return null;

  const firstName = str(raw.firstName);
  const lastName = str(raw.lastName);

  const since = str(raw.since);
  const yearMatch = /(\d{4})/.exec(since);
  const sinceYear = yearMatch ? Number(yearMatch[1]) : null;

  const phone = str(raw.phone);
  const website = toUrl(str(raw.website));

  const rawSocials =
    raw.socials && typeof raw.socials === 'object' ? (raw.socials as Record<string, unknown>) : {};
  const socials: Partial<Record<SocialKey, string>> = {};
  for (const key of SOCIAL_KEYS) {
    // Blank cells must not render, so only resolved URLs are kept.
    const url = toSocial(key, str(rawSocials[key]));
    if (url) socials[key] = url;
  }

  const categories = [...new Set(splitList(raw.categories).map(normaliseCategory))].sort((a, b) =>
    a.localeCompare(b),
  );

  const weightRaw = raw.weight;
  const weight = weightRaw === '' || weightRaw == null ? 0 : Number(weightRaw) || 0;

  return {
    slug,
    business,
    firstName,
    lastName,
    contactName: [firstName, lastName].filter(Boolean).join(' '),
    tier: toTier(raw.tier),
    since,
    sinceYear,
    logo: imageFor(slug, 'logo'),
    photo: imageFor(slug, 'photo'),
    categories,
    address: str(raw.address),
    phone,
    phoneTel: toTel(phone),
    website,
    websiteLabel: website ? hostLabel(website) : null,
    socials,
    desc: str(raw.desc),
    emailToken: encodeEmail(str(raw.email)),
    weight,
    letter: firstLetter(business),
  };
}

/* ------------------------------------------------------------------ *
 * Ordering
 *
 * Tier rank first (Founding above Regular — see @/data/member-tiers), then
 * weight descending, then business name A-Z. `numeric` so "Studio 10" sorts
 * after "Studio 9" rather than before it.
 * ------------------------------------------------------------------ */

export function compareMembers(a: NexMember, b: NexMember): number {
  return (
    tierRank(a.tier) - tierRank(b.tier) ||
    b.weight - a.weight ||
    a.business.localeCompare(b.business, 'en', { numeric: true, sensitivity: 'base' })
  );
}

/* ------------------------------------------------------------------ *
 * Fetch
 * ------------------------------------------------------------------ */

export interface MembersPayload {
  members: NexMember[];
  /** Every category present in the data, A-Z. Drives the category filter. */
  categories: string[];
  /** Every first letter present, A-Z with "#" last. Drives the A-Z strip. */
  letters: string[];
  error: string | null;
}

/**
 * Short-lived in-process memo, for the same reason events.ts has one:
 * getMembers() is called from generateStaticParams, generateMetadata, every
 * member page body, /members and the sitemap. That is dozens of calls per
 * build worker, and hammering Apps Script gets the endpoint throttled.
 *
 * The TTL sits far below the 300s ISR window, so this only ever collapses a
 * burst — it never holds stale data past a revalidation.
 */
const MEMO_TTL_MS = 30_000;
let memo: { at: number; value: MembersPayload } | null = null;
let inflight: Promise<MembersPayload> | null = null;

/**
 * Fetched at build time and revalidated by ISR every 300s. Never per-request.
 *
 * A feed failure degrades to an empty payload with `error` set — it must never
 * fail the build, because that would take the whole site down over one
 * third-party outage.
 */
export async function getMembers(): Promise<MembersPayload> {
  const now = Date.now();
  if (memo && now - memo.at < MEMO_TTL_MS) return memo.value;
  if (inflight) return inflight;

  inflight = load().then((value) => {
    memo = { at: Date.now(), value };
    inflight = null;
    return value;
  });

  return inflight;
}

async function load(): Promise<MembersPayload> {
  const { rows, error } = await fetchMemberRows({ next: { revalidate: 300 } });
  if (error) return { members: [], categories: [], letters: [], error };

  const seen = new Set<string>();
  const members: NexMember[] = [];
  for (const row of rows) {
    const m = normalise(row);
    // De-dupe on slug; two rows with the same business name would otherwise
    // collide on /members/[slug]. First row wins, as in the events feed.
    if (!m || seen.has(m.slug)) continue;
    seen.add(m.slug);
    members.push(m);
  }

  members.sort(compareMembers);

  const categories = [...new Set(members.flatMap((m) => m.categories))].sort((a, b) =>
    a.localeCompare(b),
  );

  const letters = [...new Set(members.map((m) => m.letter))].sort((a, b) =>
    a === '#' ? 1 : b === '#' ? -1 : a.localeCompare(b),
  );

  return { members, categories, letters, error: null };
}

export async function getMemberBySlug(slug: string): Promise<NexMember | null> {
  const { members } = await getMembers();
  return members.find((m) => m.slug === slug) ?? null;
}

/* ------------------------------------------------------------------ *
 * JSON-LD
 * ------------------------------------------------------------------ */

/**
 * schema.org Organization for a member's own page.
 *
 * `email` is deliberately omitted: JSON-LD is rendered into the DOM, so
 * including it would undo the obfuscation the detail card exists to provide.
 */
export function memberJsonLd(m: NexMember) {
  const socialUrls = Object.values(m.socials);
  const sameAs = m.website ? [m.website, ...socialUrls] : socialUrls;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: m.business,
    url: abs(`/members/${m.slug}`),
    ...(m.desc ? { description: m.desc } : {}),
    ...(m.logo ? { logo: abs(m.logo.src) } : {}),
    ...(m.photo ? { image: abs(m.photo.src) } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(m.phoneTel ? { telephone: m.phoneTel } : {}),
    ...(m.address ? { address: { '@type': 'PostalAddress', streetAddress: m.address } } : {}),
    ...(m.contactName ? { employee: { '@type': 'Person', name: m.contactName } } : {}),
    memberOf: { '@type': 'Organization', name: site.name, url: abs('/') },
  };
}
