import Link from 'next/link';
import { MemberArt } from './MemberArt';
import { tierConfig, type TierId } from '@/data/member-tiers';
import type { NexMember } from '@/lib/members';
import { cn } from '@/lib/cn';

/**
 * A fixed-size wall of spots for a capped tier.
 *
 * Renders every spot the tier declares: claimed ones show the member, the rest
 * show the tier's `emptySlot` copy and link to membership. The count, the
 * copy, and the styling all come from @/data/member-tiers — this component
 * never mentions "Founding", so a second capped tier would work here unchanged.
 *
 * Tiles are deliberately denser than MemberCard: twenty of them need to read
 * as one wall, not as twenty cards.
 */
export function MemberWall({
  tierId,
  members,
  onOpen,
  unavailable = false,
}: {
  tierId: TierId;
  /** The full member list; this filters to the tier itself. */
  members: NexMember[];
  onOpen: (member: NexMember) => void;
  /**
   * True when the feed could not be read. The spots still render — they are a
   * fixed set that exists whether or not the feed answers — but the claimed
   * count is suppressed, because "0 of 20 claimed" during an outage would
   * state something false rather than merely unknown.
   */
  unavailable?: boolean;
}) {
  const tier = tierConfig(tierId);

  // An uncapped tier has no wall.
  if (tier.slots === null) return null;

  const claimed = members.filter((m) => m.tier === tierId);
  // More members than spots must never drop anyone, so the empty count floors at 0.
  const openSpots = Math.max(0, tier.slots - claimed.length);

  return (
    <section aria-labelledby="member-wall-heading">
      <div className="max-w-2xl">
        <h2 id="member-wall-heading" className="font-sora text-h2sm font-semibold text-white">
          {tier.group.heading} <span className="o">{tier.group.accent}</span>
        </h2>
        <p className="mt-5 font-inter text-[17px] leading-relaxed text-white/65">
          {tier.group.blurb}
        </p>
        <p className="mt-4 font-inter text-[14px] text-white/45">
          {unavailable ? (
            <>We couldn&rsquo;t load the current list just now — {tier.slots} spots in total.</>
          ) : (
            <>
              <span className="font-semibold text-sky">{claimed.length}</span> of {tier.slots} spots
              claimed
            </>
          )}
        </p>
      </div>

      <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {claimed.map((m) => (
          <li key={m.slug}>
            <article className={cn('group h-full overflow-hidden rounded-card border transition-colors', tier.card)}>
              <button
                type="button"
                onClick={() => onOpen(m)}
                aria-haspopup="dialog"
                className="flex h-full w-full flex-col items-center gap-3 p-4 text-center"
              >
                <div
                  className={cn(
                    'flex h-[68px] w-full items-center justify-center overflow-hidden rounded-lg p-2',
                    m.logo ? 'bg-white' : 'bg-white/[0.04]',
                  )}
                >
                  <MemberArt
                    src={m.logo}
                    alt={`${m.business} logo`}
                    fallbackLabel={`${m.business} — no logo available`}
                    sizes="(max-width: 640px) 45vw, 200px"
                    className="h-full w-full"
                  />
                </div>
                <h3
                  className={cn(
                    'font-sora text-[14px] font-semibold leading-snug transition-colors',
                    tier.name,
                  )}
                >
                  {m.business}
                </h3>
              </button>
            </article>
          </li>
        ))}

        {tier.emptySlot &&
          Array.from({ length: openSpots }, (_, i) => (
            <li key={`open-${i}`}>
              <Link
                href={tier.emptySlot!.href}
                className="group flex h-full flex-col items-center justify-center gap-2 rounded-card border border-dashed border-white/15 p-4 text-center transition-colors hover:border-sky/60 hover:bg-sky/[0.04]"
              >
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 font-sora text-[18px] leading-none text-white/30 transition-colors group-hover:border-sky group-hover:text-sky"
                >
                  +
                </span>
                <span className="font-inter text-[13px] font-medium text-white/45 transition-colors group-hover:text-white">
                  {tier.emptySlot!.label}
                </span>
                <span className="font-inter text-[12px] text-sky opacity-0 transition-opacity group-hover:opacity-100">
                  {tier.emptySlot!.cta} →
                </span>
              </Link>
            </li>
          ))}
      </ul>
    </section>
  );
}
