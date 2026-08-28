/**
 * Member types and display helpers.
 *
 * Client-safe by construction: this module must never import the feed, the
 * image manifest, or anything that touches `process.env` or `Buffer`. The
 * directory's card, modal and detail components are client components and
 * import from here, so anything added to this file ships to the browser.
 *
 * Everything that reads the feed lives in members-server.ts, which is marked
 * `server-only` so the Apps Script URL can never be pulled into a client
 * bundle by an accidental import.
 */

import type { TierId } from '@/data/member-tiers';

/** The social networks the directory renders, in display order. */
export const SOCIAL_KEYS = ['instagram', 'tiktok', 'youtube', 'facebook', 'x', 'linkedin'] as const;
export type SocialKey = (typeof SOCIAL_KEYS)[number];

/** A local image written by the build-time Drive ingest. */
export interface MemberImage {
  /** Site-absolute path, e.g. "/members/acme-co-logo.png". */
  src: string;
  width: number;
  height: number;
}

/**
 * A member as the site renders it.
 *
 * NOTE the absence of an `email` field. The raw address never enters this
 * type, so it cannot reach the DOM by accident — `emailToken` is what crosses
 * to the client, and MemberEmail assembles the mailto from it on click. See
 * `encodeEmail` in members-server.ts.
 */
export interface NexMember {
  slug: string;
  business: string;
  firstName: string;
  lastName: string;
  /** "Jane Doe", or "" when the sheet has neither name. */
  contactName: string;

  tier: TierId;
  /** Raw `since` value from the sheet, e.g. "2019" or "2019-04-12". */
  since: string;
  /** Four-digit year pulled out of `since`, or null when unparseable. */
  sinceYear: number | null;

  logo: MemberImage | null;
  photo: MemberImage | null;

  categories: string[];
  address: string;
  /** Display form, exactly as the sheet has it. */
  phone: string;
  /** E.164 form for tel:, e.g. "+13144339330". Null when unparseable. */
  phoneTel: string | null;
  website: string | null;
  /** Website host, for display: "acme.com". */
  websiteLabel: string | null;

  socials: Partial<Record<SocialKey, string>>;
  desc: string;

  /** Obfuscated email. Never the plain address. Null when the sheet is blank. */
  emailToken: string | null;

  /** Sheet ordering weight. Higher sorts first within a tier. */
  weight: number;

  /** First character of the business name, uppercased; "#" for non-letters. */
  letter: string;
}

/** "Member since 2019", or "Member" when the sheet has no usable date. */
export function memberSince(m: NexMember): string {
  return m.sinceYear ? `Member since ${m.sinceYear}` : 'Member';
}
