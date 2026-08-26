import { buildMetadata } from '@/lib/seo';
import { Section, Eyebrow } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { ButtonLink } from '@/components/Button';
import { EventsView } from '@/components/events/EventsView';
import { IdeaForm } from '@/components/form/IdeaForm';
import { getEvents } from '@/lib/events';
import {
  eventsIntro,
  eventsIntroLead,
  eventsIntroRest,
  waysIn,
  eventKinds,
  signatureEvents,
  eventsClosing,
} from '@/data/events-copy';

/**
 * ISR: the events feed is fetched at build and revalidated every 300s.
 * It is never fetched per-request.
 */
export const revalidate = 300;

export const metadata = buildMetadata({
  title: 'Events — More than a calendar. A catalyst for growth.',
  description:
    'Workshops, networking, leadership sessions, ribbon cuttings and community gatherings at NexCore in South St. Louis County. Browse the full calendar and register.',
  path: '/events',
});

/** "yOURNexCore" carries an accent on OUR, matching the original markup. */
function EventKind({ label }: { label: string }) {
  if (label !== 'yOURNexCore') return <>{label}</>;
  return (
    <>
      y<span className="o">OUR</span>NexCore
    </>
  );
}

export default async function EventsPage() {
  const { upcoming, past, error } = await getEvents();

  return (
    <>
      <PageHero
        eyebrow="EVENTS"
        title="More than a calendar."
        accent="A catalyst for growth."
      />

      {/* Narrative — carried over from the old events.html */}
      <Section width="prose">
        <div className="prose-nex">
          {eventsIntro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <p className="my-8 border-l-2 border-sky/50 pl-6 font-sora text-[22px] font-semibold leading-snug text-white">
          {eventsIntroLead}
        </p>

        <div className="prose-nex">
          {eventsIntroRest.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <p className="mt-8 font-sora text-h3 font-semibold leading-tight text-white">
          Great communities grow when <span className="o">people come together</span>.
        </p>
      </Section>

      {/* Ways in */}
      <Section tone="lift">
        <div className="max-w-2xl">
          <Eyebrow>WAYS IN</Eyebrow>
          <h2 className="text-balance font-sora text-h2sm font-semibold text-white">
            One event can mean <span className="o">six different things</span>.
          </h2>
          <p className="mt-5 font-inter text-[17px] leading-relaxed text-white/65">
            These aren&rsquo;t separate calendars — they&rsquo;re the different reasons people walk
            through our doors. You decide which one an event is for you.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {waysIn.map((w) => (
            <article
              key={w.n}
              className="rounded-card border border-white/10 bg-ink p-7 transition-colors hover:border-sky/40"
            >
              <span className="font-sora text-[26px] font-semibold text-sky/60">{w.n}</span>
              <h3 className="mt-3 font-sora text-lg font-semibold text-white">{w.title}</h3>
              <p className="mt-3 font-inter text-[15px] leading-relaxed text-white/65">{w.body}</p>
            </article>
          ))}
        </div>

        {/* Kinds of events */}
        <div className="mt-16">
          <h3 className="font-sora text-xl font-semibold text-white">
            The kinds of events you&rsquo;ll find here
          </h3>
          <ul className="mt-6 flex flex-wrap gap-2">
            {eventKinds.map((k) => (
              <li
                key={k}
                className="rounded-pill border border-white/12 px-4 py-2 font-inter text-[14px] text-white/70"
              >
                <EventKind label={k} />
              </li>
            ))}
          </ul>
        </div>

        {/* Idea CTA */}
        <div className="mt-14 rounded-card border border-sky/25 bg-sky/[0.06] p-8">
          <h3 className="font-sora text-xl font-semibold text-white">
            Got an event idea? Tell us.
          </h3>
          <p className="mt-2 max-w-xl font-inter text-[15px] leading-relaxed text-white/70">
            The best events often start as someone&rsquo;s offhand idea. If you&rsquo;ve got one, we
            want to hear it.
          </p>
          <div className="mt-7">
            <IdeaForm />
          </div>
        </div>
      </Section>

      {/* Signature events */}
      <Section width="prose">
        <Eyebrow>SIGNATURE EVENTS</Eyebrow>
        <h2 className="font-sora text-h2sm font-semibold text-white">
          The experiences <span className="o">unique to NexCore</span>.
        </h2>
        <p className="mt-5 font-inter text-[17px] leading-relaxed text-white/65">
          A handful of initiatives we build and host ourselves — the ones that carry the NexCore
          name.
        </p>

        <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
          {signatureEvents.map((s) => (
            <li key={s} className="py-5 font-sora text-[19px] font-medium text-white">
              {s}
            </li>
          ))}
        </ul>
      </Section>

      {/* Calendar — merged from events.html + event-calendar.html */}
      <Section id="calendar" tone="lift">
        <div className="max-w-2xl">
          <Eyebrow>UPCOMING EVENTS</Eyebrow>
          <h2 className="font-sora text-h2sm font-semibold text-white">
            Stay connected with <span className="o">everything happening</span> at NexCore.
          </h2>
          <p className="mt-5 font-inter text-[17px] leading-relaxed text-white/65">
            Below is our complete calendar of NexCore-hosted, member-hosted, partner-supported, and
            community events.
          </p>
        </div>

        <div className="mt-12">
          {error ? (
            <div
              role="alert"
              className="rounded-card border border-red-bright/30 bg-red/10 p-8 text-center"
            >
              <p className="font-sora text-lg font-semibold text-white">
                We couldn&rsquo;t load the calendar just now.
              </p>
              <p className="mt-2 font-inter text-[15px] text-white/65">
                Please try again shortly, or{' '}
                <a href="/contact" className="text-sky hover:text-sky-light">
                  get in touch
                </a>{' '}
                and we&rsquo;ll help.
              </p>
            </div>
          ) : (
            <EventsView upcoming={upcoming} past={past} />
          )}
        </div>
      </Section>

      {/* Gallery */}
      <Section width="prose">
        <Eyebrow>EVENT GALLERY</Eyebrow>
        <h2 className="font-sora text-h2xs font-semibold text-white">
          Every event tells a <span className="o">story</span>.
        </h2>
        <p className="mt-5 font-inter text-[17px] leading-relaxed text-white/65">
          Browse moments from workshops, celebrations, networking events, ribbon cuttings, community
          outreach, leadership sessions, and the experiences that continue to shape NexCore.
        </p>
        <ButtonLink href="/events/gallery" variant="ghost" className="mt-7">
          View the photo gallery →
        </ButtonLink>
      </Section>

      {/* Closing */}
      <Section tone="navy" width="prose" className="text-center">
        <div className="space-y-4">
          {eventsClosing.map((p, i) => (
            <p key={i} className="font-inter text-[17px] leading-relaxed text-white/75">
              {p}
            </p>
          ))}
        </div>
        <p className="mt-8 font-sora text-h3 font-semibold leading-tight text-white">
          We all <span className="o">move forward together</span>.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/coworking#spaces" size="lg">
            Host an event
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost" size="lg">
            Share an idea
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
