import Link from 'next/link';
import { MemberArt } from './MemberArt';
import { MemberEmail } from './MemberEmail';
import { socialIcons, GlobeIcon, PhoneIcon, MapPinIcon } from '@/components/Icons';
import { tierConfig } from '@/data/member-tiers';
import {
  SOCIAL_KEYS,
  hasContact,
  memberSince,
  type ContactBlock,
  type NexMember,
  type SocialKey,
} from '@/lib/members';
import { cn } from '@/lib/cn';

/**
 * The member detail card.
 *
 * Rendered in two places and identical in both, per the brief: inside the
 * directory modal, and as the body of /members/[slug] for sharing. The only
 * difference is the heading level and the permalink, which the modal shows and
 * the page does not need.
 *
 * The sheet gives the business and the named person separate contact blocks,
 * so both are rendered separately. A member who only publishes company details
 * simply gets one block — nothing is invented to fill the other.
 */

/** Display names, which double as the keys into `socialIcons`. */
const SOCIAL_LABELS: Record<SocialKey, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  facebook: 'Facebook',
  x: 'X',
  linkedin: 'LinkedIn',
};

function Socials({ block, owner }: { block: ContactBlock; owner: string }) {
  // Blank socials are dropped during normalisation, so anything still here has
  // a real URL. SOCIAL_KEYS fixes the display order.
  const keys = SOCIAL_KEYS.filter((k) => block.socials[k]);
  if (!keys.length) return null;

  return (
    <ul className="mt-5 flex flex-wrap gap-2.5">
      {keys.map((key) => {
        const label = SOCIAL_LABELS[key];
        const Icon = socialIcons[label];
        return (
          <li key={key}>
            <a
              href={block.socials[key]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${owner} on ${label}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/60 transition-colors hover:border-sky hover:text-sky"
            >
              {Icon ? <Icon /> : <span aria-hidden="true">{label.charAt(0)}</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function ContactDetails({
  block,
  owner,
  emailLabel,
}: {
  block: ContactBlock;
  owner: string;
  emailLabel: string;
}) {
  return (
    <>
      <div className="space-y-3.5">
        {block.address && (
          <p className="flex items-start gap-2.5 font-inter text-[15px] leading-relaxed text-white/70">
            <span className="mt-1 shrink-0 text-white/40">
              <MapPinIcon />
            </span>
            <span>{block.address}</span>
          </p>
        )}

        {block.phoneTel ? (
          <a
            href={`tel:${block.phoneTel}`}
            className="inline-flex items-center gap-2.5 font-inter text-[15px] text-white/70 hover:text-sky"
          >
            <PhoneIcon />
            {block.phone}
          </a>
        ) : (
          block.phone && (
            <p className="flex items-center gap-2.5 font-inter text-[15px] text-white/70">
              <PhoneIcon />
              {block.phone}
            </p>
          )
        )}

        {block.website && (
          <div>
            <a
              href={block.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-inter text-[15px] text-sky hover:text-sky-light"
            >
              <GlobeIcon />
              {block.websiteLabel}
            </a>
          </div>
        )}

        {/* Address is assembled on click — never present in the markup. */}
        {block.emailToken && <MemberEmail token={block.emailToken} label={emailLabel} />}
      </div>

      <Socials block={block} owner={owner} />
    </>
  );
}

export function MemberDetail({
  member,
  as = 'page',
  titleId,
}: {
  member: NexMember;
  /** 'modal' adds the permalink and uses an h2; 'page' uses an h1. */
  as?: 'modal' | 'page';
  titleId?: string;
}) {
  const tier = tierConfig(member.tier);
  const Heading = as === 'modal' ? 'h2' : 'h1';

  const paragraphs = member.desc
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const personName = member.contactName || 'Contact';
  const showPerson = hasContact(member.contact);

  return (
    <div className="grid gap-8 md:grid-cols-[240px_1fr] md:gap-10">
      {/* Photo + logo rail */}
      <div className="space-y-5">
        <div className="overflow-hidden rounded-card border border-white/10 bg-ink">
          <MemberArt
            src={member.photo}
            alt={member.contactName ? `${member.contactName}, ${member.business}` : member.business}
            fallbackLabel={`${member.business} — no photo available`}
            fit="cover"
            priority={as === 'page'}
            sizes="(max-width: 768px) 100vw, 240px"
            className="aspect-[4/5] h-auto w-full"
          />
        </div>

        {member.logo && (
          <div className="flex h-[110px] items-center justify-center rounded-card bg-white p-4">
            <MemberArt
              src={member.logo}
              alt={`${member.business} logo`}
              fallbackLabel={`${member.business} — no logo available`}
              sizes="240px"
              className="h-full w-full"
            />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="min-w-0">
        <p className="flex items-center gap-2 font-inter text-[13px] text-white/50">
          <span aria-hidden="true" className={cn('h-2 w-2 rounded-full', tier.chip)} />
          {tier.label} · {memberSince(member)}
        </p>

        <Heading
          id={titleId}
          className="mt-3 text-balance font-sora text-h2xs font-semibold text-white"
        >
          {member.business}
        </Heading>

        {member.contactName && (
          <p className="mt-2 font-inter text-[17px] text-white/70">
            {member.contactName}
            {member.title && <span className="text-white/45"> · {member.title}</span>}
          </p>
        )}

        {member.categories.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {member.categories.map((c) => (
              <li
                key={c}
                className="rounded-pill border border-white/12 px-3 py-1 font-inter text-[13px] text-white/60"
              >
                {c}
              </li>
            ))}
          </ul>
        )}

        {paragraphs.length > 0 && (
          <div className="prose-nex mt-7 text-[16px]">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}

        {member.funFact && (
          <div className="mt-7 rounded-card border border-sky/25 bg-sky/[0.06] p-5">
            <p className="font-inter text-[12px] font-semibold tracking-[0.12em] text-sky">
              FUN FACT
            </p>
            <p className="mt-2 font-inter text-[15px] leading-relaxed text-white/75">
              {member.funFact}
            </p>
          </div>
        )}

        {/* Company */}
        <div className="mt-8 border-t border-white/10 pt-7">
          <h3 className="mb-4 font-inter text-[13px] font-semibold tracking-[0.08em] text-white/45">
            {member.business}
          </h3>
          <ContactDetails
            block={member.company}
            owner={member.business}
            emailLabel={`Email ${member.business}`}
          />
        </div>

        {/* The named person, when they publish their own details */}
        {showPerson && (
          <div className="mt-8 border-t border-white/10 pt-7">
            <h3 className="mb-4 font-inter text-[13px] font-semibold tracking-[0.08em] text-white/45">
              {personName}
              {member.title && ` · ${member.title}`}
            </h3>
            <ContactDetails
              block={member.contact}
              owner={personName}
              emailLabel={`Email ${personName}`}
            />
          </div>
        )}

        {as === 'modal' && (
          <p className="mt-8 border-t border-white/10 pt-6 font-inter text-[14px] text-white/45">
            <Link href={`/members/${member.slug}`} className="text-sky hover:text-sky-light">
              Open this member&rsquo;s page →
            </Link>{' '}
            to share a direct link.
          </p>
        )}
      </div>
    </div>
  );
}
