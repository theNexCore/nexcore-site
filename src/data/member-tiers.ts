/**
 * Member tier configuration.
 *
 * TIERS ARE DATA, NOT CODE. Every rule that decides how a tier looks, what it
 * is called, and where it sorts lives in this file and nowhere else. No
 * component may branch on a tier name — components read `tierConfig(tier)` and
 * render what it says. Adding a third tier means adding an entry here and
 * changing nothing else.
 *
 * The sheet's `tier` column is matched case-insensitively against `id`;
 * anything unrecognised (including blank) falls back to DEFAULT_TIER, so a
 * typo in the sheet degrades to a normal listing rather than dropping the
 * member from the directory.
 *
 * Headings are split into `heading` + `accent` so the accent word can carry
 * the `.o` class, matching the PageHero convention.
 */

export type TierId = 'Founding' | 'Regular';

export interface TierConfig {
  id: TierId;

  /** Sort bucket. Lower ranks appear first in the directory. */
  rank: number;

  /** Human label, used anywhere the tier itself is named. */
  label: string;

  /** Badge text on the card, or null for no badge. */
  badge: string | null;

  /** Section heading for this tier's block in the directory. */
  group: { heading: string; accent: string; blurb: string };

  /**
   * Fixed number of spots in this tier, or null for an unlimited tier.
   *
   * A tier with `slots` gets a wall at the top of the directory: every spot is
   * rendered, claimed ones showing the member and the rest showing `emptySlot`.
   * Change the number here and the wall resizes — nothing else needs touching.
   *
   * More claimed members than slots is handled, not truncated: every real
   * member still renders and the wall simply shows no empty spots.
   */
  slots: number | null;

  /** Copy for an unclaimed spot. Only read when `slots` is set. */
  emptySlot: { label: string; cta: string; href: string } | null;

  /** Card container classes — border, surface and hover treatment. */
  card: string;

  /** Badge pill classes. Ignored when `badge` is null. */
  badgePill: string;

  /** Applied to the business name on the card. */
  name: string;

  /** Colour chip beside the tier label on the detail card. */
  chip: string;

  /** Filter-strip pill classes when this tier is the active tier filter. */
  activePill: string;
}

export const DEFAULT_TIER: TierId = 'Regular';

const configs: Record<TierId, TierConfig> = {
  Founding: {
    id: 'Founding',
    rank: 0,
    label: 'Founding Member',
    badge: 'Founding Member',
    group: {
      heading: 'Founding',
      accent: 'Members',
      blurb:
        'The businesses who backed NexCore before there was much to back. They were here first, so they sit at the top.',
    },
    slots: 20,
    emptySlot: {
      label: 'Spot available',
      cta: 'Claim a founding spot',
      href: '/coworking#memberships',
    },
    card: 'border-sky/40 bg-ink-lift ring-1 ring-inset ring-sky/10 hover:border-sky',
    badgePill: 'bg-sky/15 text-sky',
    name: 'text-white group-hover:text-sky',
    chip: 'bg-sky',
    activePill: 'bg-sky text-white',
  },
  Regular: {
    id: 'Regular',
    rank: 1,
    label: 'Member',
    badge: null,
    group: {
      heading: 'All',
      accent: 'Members',
      blurb: 'Every other business that calls NexCore home.',
    },
    slots: null,
    emptySlot: null,
    card: 'border-white/10 bg-ink-lift hover:border-sky/50',
    badgePill: 'border border-white/12 text-white/55',
    name: 'text-white group-hover:text-sky',
    chip: 'bg-white/30',
    activePill: 'bg-white text-ink',
  },
};

/** All tiers in display order. */
export const tiers: TierConfig[] = Object.values(configs).sort((a, b) => a.rank - b.rank);

/** Resolve a raw sheet value to a known tier. Never throws. */
export function toTier(raw: unknown): TierId {
  const v = String(raw ?? '').trim().toLowerCase();
  return tiers.find((t) => t.id.toLowerCase() === v)?.id ?? DEFAULT_TIER;
}

export function tierConfig(id: TierId): TierConfig {
  return configs[id] ?? configs[DEFAULT_TIER];
}

/** Sort rank for a tier. Drives the directory ordering. */
export const tierRank = (id: TierId): number => tierConfig(id).rank;
