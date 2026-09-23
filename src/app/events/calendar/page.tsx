import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { ButtonLink } from '@/components/Button';
import { EventsView } from '@/components/events/EventsView';
import { getAllSeries, getEvents } from '@/lib/events-server';

/**
 * The "Event Calendar" nav tab. Same calendar as the #calendar section on
 * /events, opening on the month grid instead of the list, without the
 * narrative above it.
 *
 * Revalidates like /events so the calendar rolls forward and finished
 * events move under Past.
 */
export const revalidate = 300;

export const metadata = buildMetadata({
  title: 'Event Calendar',
  description:
    'The full NexCore event calendar — workshops, networking, leadership sessions and community gatherings in South St. Louis County. Pick a date and register.',
  path: '/events/calendar',
});

export default async function EventCalendarPage() {
  const { upcoming, past, pastOccurrences } = await getEvents();

  return (
    <>
      <PageHero
        eyebrow="EVENT CALENDAR"
        title="Stay connected with"
        accent="everything happening at NexCore."
        lead="NexCore-hosted, member-hosted, partner-supported, and community events."
      />

      <Section tone="lift">
        <EventsView
          upcoming={upcoming}
          past={past}
          pastOccurrences={pastOccurrences}
          series={getAllSeries()}
          initialView="calendar"
        />
      </Section>

      <Section tone="navy" width="prose" className="text-center">
        <h2 className="font-sora text-h2xs font-semibold text-white">
          Have an idea for an <span className="o">event</span>?
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/events#idea" size="lg">
            Share your idea
          </ButtonLink>
          <ButtonLink href="/events/gallery" variant="ghost" size="lg">
            Event photo gallery
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
