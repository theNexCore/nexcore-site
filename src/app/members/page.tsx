import { buildMetadata } from '@/lib/seo';
import { Section, Eyebrow } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { ButtonLink } from '@/components/Button';
import { MembersView } from '@/components/members/MembersView';
import { getMembers } from '@/lib/members-server';

/**
 * ISR: the members feed is fetched at build and revalidated every 300s.
 * It is never fetched per-request, and the feed URL never reaches the client.
 */
export const revalidate = 300;

export const metadata = buildMetadata({
  title: 'Member Directory — The businesses behind NexCore',
  description:
    'Browse the businesses and professionals who make up the NexCore community in South St. Louis County. Search by name or category, and get in touch directly.',
  path: '/members',
});

export default async function MembersPage() {
  const { members, categories, letters, error } = await getMembers();

  return (
    <>
      <PageHero
        eyebrow="MEMBER DIRECTORY"
        title="The businesses"
        accent="behind NexCore."
        lead="Every name here chose to build alongside other people rather than alone. Browse them, find the one you need, and reach out directly — no gatekeeping, no referral fee."
      />

      {/* Renders its own sections: the founding wall, then the directory.
          The wall stays up even on a feed failure — its spots are a fixed set
          that exists whether or not the feed answers. */}
      <MembersView
        members={members}
        categories={categories}
        letters={letters}
        error={error}
      />

      <Section tone="navy" width="prose" className="text-center">
        <Eyebrow>JOIN THEM</Eyebrow>
        <h2 className="text-balance font-sora text-h2sm font-semibold text-white">
          Your name belongs <span className="o">on this list</span>.
        </h2>
        <p className="mt-5 font-inter text-[17px] leading-relaxed text-white/75">
          Membership puts you in the room with everyone above — and puts your business in front of
          everyone who comes looking.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/coworking#memberships" size="lg">
            See memberships
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost" size="lg">
            Ask a question
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
