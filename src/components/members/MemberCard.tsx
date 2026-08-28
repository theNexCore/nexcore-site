import { MemberArt } from './MemberArt';
import { tierConfig } from '@/data/member-tiers';
import { memberSince, type NexMember } from '@/lib/members';
import { cn } from '@/lib/cn';

/**
 * Directory grid card: logo, business name, categories, "Member since {year}".
 *
 * Every tier-dependent class comes from tierConfig — this component never
 * branches on a tier name. See @/data/member-tiers.
 *
 * It renders a <button>, not a <Link>: the click opens the detail modal in
 * place. The card's own /members/[slug] page is reachable from inside that
 * modal and from the sitemap, so the shareable URL still exists.
 */
export function MemberCard({
  member,
  onOpen,
}: {
  member: NexMember;
  onOpen: (member: NexMember) => void;
}) {
  const tier = tierConfig(member.tier);
  const shown = member.categories.slice(0, 3);
  const extra = member.categories.length - shown.length;

  return (
    <article className={cn('group overflow-hidden rounded-card border transition-colors', tier.card)}>
      <button
        type="button"
        onClick={() => onOpen(member)}
        aria-haspopup="dialog"
        className="flex h-full w-full flex-col p-6 text-left"
      >
        <div
          className={cn(
            'flex h-[84px] items-center justify-center overflow-hidden rounded-lg p-3',
            member.logo ? 'bg-white' : 'bg-white/[0.04]',
          )}
        >
          <MemberArt
            src={member.logo}
            alt={`${member.business} logo`}
            fallbackLabel={`${member.business} — no logo available`}
            sizes="(max-width: 640px) 45vw, 260px"
            className="h-full w-full"
          />
        </div>

        {tier.badge && (
          <span
            className={cn(
              'mt-5 inline-block self-start rounded-pill px-2.5 py-0.5 font-inter text-[11px] font-semibold',
              tier.badgePill,
            )}
          >
            {tier.badge}
          </span>
        )}

        <h3
          className={cn(
            'mt-3 font-sora text-[17px] font-semibold leading-snug transition-colors',
            tier.name,
          )}
        >
          {member.business}
        </h3>

        {shown.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {shown.map((c) => (
              <li
                key={c}
                className="rounded-pill border border-white/12 px-2.5 py-1 font-inter text-[12px] text-white/55"
              >
                {c}
              </li>
            ))}
            {extra > 0 && (
              <li className="rounded-pill px-1 py-1 font-inter text-[12px] text-white/35">
                +{extra} more
              </li>
            )}
          </ul>
        )}

        <p className="mt-4 flex-1 font-inter text-[13px] text-white/45">{memberSince(member)}</p>

        <span
          aria-hidden="true"
          className="mt-4 font-inter text-[13px] font-semibold text-sky opacity-0 transition-opacity group-hover:opacity-100"
        >
          View details →
        </span>
      </button>
    </article>
  );
}
