import { buildMetadata } from '@/lib/seo';
import { Section, Eyebrow } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { ButtonLink } from '@/components/Button';
import { MembersView } from '@/components/members/MembersView';
import { getMembers } from '@/lib/members-server';
import { getHostedEventsMap } from '@/lib/events-server';

// Hosted events drop off once they pass; match the events pages' refresh.
export const revalidate = 300;

export const metadata = buildMetadata({
  title: 'Member Directory — The businesses behind NexCore',
  description:
    'Browse the businesses and professionals who make up the NexCore community in South St. Louis County. Search by name or category, and get in touch directly.',
  path: '/members',
});

export default async function MembersPage() {
  const { members, categories, letters } = await getMembers();
  const hosting = await getHostedEventsMap();

  return (
    <>
      <PageHero
        eyebrow="MEMBER DIRECTORY"
        title="The businesses"
        accent="behind NexCore."
        lead="Every name here chose to build alongside other people rather than alone. Browse them, find the one you need, and reach out directly — no gatekeeping, no referral fee."
      />

      {/* Renders its own sections: the founding wall, then the directory. */}
      <MembersView
        members={members}
        categories={categories}
        letters={letters}
        hosting={hosting}
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
