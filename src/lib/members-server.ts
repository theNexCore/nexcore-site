import 'server-only';

import { abs, site } from '@/data/site';
import { toTier, tierRank } from '@/data/member-tiers';
import { slugify } from './slug';
import {
  SOCIAL_KEYS,
  type ContactBlock,
  type MemberImage,
  type NexMember,
  type SocialKey,
} from './members';
import { members as records, type MemberRecord } from '@/data/members';
import localImages from '@/data/local-images.json';

/**
 * Server-side member data access.
 *
 * `server-only` is the point of this file: @/data/members holds raw email
 * addresses, so the module that reads it refuses to be bundled for the
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

const str = (v: string | undefined): string => (v ?? '').trim();

const images = localImages as Record<string, { width: number; height: number }>;

/**
 * Look up a local image. Returns null when the file is not in public/ yet
 * (scripts/images.ts only lists files that exist), which is what MemberFace
 * renders the branded placeholder for.
 */
function imageFor(src: string): MemberImage | null {
  const path = src.trim();
  const hit = path ? images[path] : undefined;
  return hit ? { src: path, width: hit.width, height: hit.height } : null;
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

/** Per-network profile root, used when the data holds a handle not a URL. */
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

/**
 * Filing name: surname first, the way a directory of people is filed, so
 * Taylor Miller files under M.
 *
 * Returned as "Miller Taylor" rather than just the surname so two members who
 * share a surname still sort against each other by first name. Only the first
 * character is ever shown — it drives the A-Z bucket — so the reversed order
 * is never read by anyone.
 *
 * Falls back down the chain when a member publishes no person: surname, then
 * first name, then the business with any leading article stripped ("The South
 * County Chamber" files under S), then the raw business name so a company
 * literally called "The" still sorts somewhere.
 */
function fileAs(business: string, firstName: string, lastName: string): string {
  if (lastName) return `${lastName} ${firstName}`.trim();
  if (firstName) return firstName;
  return business.replace(/^(the|a|an)\s+/i, '').trim() || business;
}

/** Bucket for the A-Z strip. Non-letters go to "#". */
function firstLetter(sortName: string): string {
  const ch = sortName.charAt(0).toUpperCase();
  return /[A-Z]/.test(ch) ? ch : '#';
}

/* ------------------------------------------------------------------ *
 * Normalisation
 *
 * Tolerant by design: a member with a business name is publishable and every
 * other field may be blank.
 * ------------------------------------------------------------------ */

/** Build one contact block. The person's block has no address or website. */
function contactBlock(src: {
  address?: string;
  phone: string;
  email: string;
  website?: string;
  socials: MemberRecord['company']['socials'];
}): ContactBlock {
  const phone = str(src.phone);
  const website = toUrl(str(src.website));

  const socials: Partial<Record<SocialKey, string>> = {};
  for (const key of SOCIAL_KEYS) {
    // Blank fields must not render, so only resolved URLs are kept.
    const url = toSocial(key, str(src.socials[key]));
    if (url) socials[key] = url;
  }

  return {
    address: str(src.address),
    phone,
    phoneTel: toTel(phone),
    emailToken: encodeEmail(str(src.email)),
    website,
    websiteLabel: website ? hostLabel(website) : null,
    socials,
  };
}

function normalise(raw: MemberRecord): NexMember | null {
  const business = str(raw.business);
  if (!business) return null;

  const slug = slugify(str(raw.slug)) || slugify(business);
  if (!slug) return null;

  const firstName = str(raw.firstName);
  const lastName = str(raw.lastName);

  const since = str(raw.since);
  const yearMatch = /(\d{4})/.exec(since);
  const sinceYear = yearMatch ? Number(yearMatch[1]) : null;

  const categories = [...new Set(raw.categories.map(str).filter(Boolean).map(normaliseCategory))].sort((a, b) =>
    a.localeCompare(b),
  );

  const sortName = fileAs(business, firstName, lastName);

  const weight = Number(raw.weight) || 0;

  return {
    slug,
    business,
    firstName,
    lastName,
    contactName: [firstName, lastName].filter(Boolean).join(' '),
    title: str(raw.title),
    tier: toTier(raw.tier),
    since,
    sinceYear,
    logo: imageFor(raw.logo),
    photo: imageFor(raw.photo),
    categories,
    company: contactBlock(raw.company),
    contact: contactBlock(raw.contact),
    desc: str(raw.desc),
    funFact: str(raw.funFact),
    weight,
    sortName,
    letter: firstLetter(sortName),
  };
}

/* ------------------------------------------------------------------ *
 * Ordering
 *
 * Tier rank first (Founding above Regular — see @/data/member-tiers), then
 * weight descending, then filing name A-Z — the same surname-first name the
 * A-Z strip buckets on, so the strip and the list can never disagree about
 * where a member sits. `numeric` so "Studio 10" sorts after "Studio 9".
 * ------------------------------------------------------------------ */

export function compareMembers(a: NexMember, b: NexMember): number {
  return (
    tierRank(a.tier) - tierRank(b.tier) ||
    b.weight - a.weight ||
    a.sortName.localeCompare(b.sortName, 'en', { numeric: true, sensitivity: 'base' })
  );
}

/* ------------------------------------------------------------------ *
 * Load
 * ------------------------------------------------------------------ */

export interface MembersPayload {
  members: NexMember[];
  /** Every category present in the data, A-Z. Drives the category filter. */
  categories: string[];
  /** Every first letter present, A-Z with "#" last. Drives the A-Z strip. */
  letters: string[];
}

let cached: MembersPayload | null = null;

/** Built once per process from @/data/members. */
export async function getMembers(): Promise<MembersPayload> {
  return (cached ??= load());
}

function load(): MembersPayload {
  const seen = new Set<string>();
  const members: NexMember[] = [];
  for (const row of records) {
    const m = normalise(row);
    // De-dupe on slug; two entries with the same slug would otherwise collide
    // on /members/[slug]. First entry wins.
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

  return { members, categories, letters };
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
  const socialUrls = Object.values(m.company.socials);
  const sameAs = m.company.website ? [m.company.website, ...socialUrls] : socialUrls;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: m.business,
    url: abs(`/members/${m.slug}`),
    ...(m.desc ? { description: m.desc } : {}),
    ...(m.logo ? { logo: abs(m.logo.src) } : {}),
    ...(m.photo ? { image: abs(m.photo.src) } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(m.company.phoneTel ? { telephone: m.company.phoneTel } : {}),
    ...(m.company.address
      ? { address: { '@type': 'PostalAddress', streetAddress: m.company.address } }
      : {}),
    ...(m.contactName
      ? {
          employee: {
            '@type': 'Person',
            name: m.contactName,
            ...(m.title ? { jobTitle: m.title } : {}),
          },
        }
      : {}),
    memberOf: { '@type': 'Organization', name: site.name, url: abs('/') },
  };
}
