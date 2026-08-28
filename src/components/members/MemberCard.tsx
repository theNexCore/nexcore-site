import { MemberFace } from './MemberArt';
import { tierConfig } from '@/data/member-tiers';
import { memberSince, type NexMember } from '@/lib/members';
import { cn } from '@/lib/cn';

/**
 * Directory grid card.
 *
 * A member is a person, so the card leads with their photo and their name,
 * with the business named underneath. A listing with no person named falls
 * back to the business as the headline, so a company-only row still reads
 * correctly rather than showing a blank line.
 *
 * Every tier-dependent class comes from tierConfig — this component never
 * branches on a tier name. See @/data/member-tiers.
 *
 * It renders a <button>, not a <Link>: the click opens the detail modal in
 * place. The member's own /members/[slug] page is reachable from inside that
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

  const hasPerson = Boolean(member.contactName);
  const headline = hasPerson ? member.contactName : member.business;

  return (
    <article className={cn('group overflow-hidden rounded-card border transition-colors', tier.card)}>
      <button
        type="button"
        onClick={() => onOpen(member)}
        aria-haspopup="dialog"
        className="flex h-full w-full flex-col p-6 text-left"
      >
        <div className="flex items-start gap-4">
          <MemberFace
            src={member.photo}
            logo={member.logo}
            business={member.business}
            person={member.contactName}
            sizes="96px"
            className="h-[76px] w-[76px] shrink-0"
          />

          <div className="min-w-0 flex-1">
            {tier.badge && (
              <span
                className={cn(
                  'mb-1.5 inline-block rounded-pill px-2.5 py-0.5 font-inter text-[11px] font-semibold',
                  tier.badgePill,
                )}
              >
                {tier.badge}
              </span>
            )}

            <h3
              className={cn(
                'font-sora text-[17px] font-semibold leading-snug transition-colors',
                tier.name,
              )}
            >
              {headline}
            </h3>

            {hasPerson && (
              <p className="mt-1 font-inter text-[14px] leading-snug text-white/60">
                {member.business}
              </p>
            )}

            {member.title && (
              <p className="mt-0.5 font-inter text-[13px] text-white/40">{member.title}</p>
            )}
          </div>
        </div>

        {shown.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5">
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
