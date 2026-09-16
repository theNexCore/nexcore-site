import Image from 'next/image';
import Link from 'next/link';
import { Section, Eyebrow } from '@/components/Section';
import { EventCard } from './EventCard';
import type { EventSeriesInfo, NexEvent } from '@/lib/events';

/**
 * /events/<series-id>: every date of one series, in the normal grid. Recurring
 * events arrive already expanded into their upcoming occurrences.
 */
export function SeriesPage({ series, events }: { series: EventSeriesInfo; events: NexEvent[] }) {
  const upcoming = events.filter((e) => !e.isPast);
  const past = events.filter((e) => e.isPast).reverse();

  return (
    <>
      <Section>
        <Link href="/events#calendar" className="font-inter text-[14px] text-sky hover:text-sky-light">
          ← All events
        </Link>

        <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-center">
          {series.logo && (
            <div
              className="w-40 shrink-0 overflow-hidden rounded-card sm:w-48"
              style={{ backgroundColor: series.logoBg }}
            >
              <Image
                src={series.logo}
                alt={`${series.name} logo`}
                width={400}
                height={400}
                priority
                sizes="192px"
                className="h-auto w-full"
              />
            </div>
          )}
          <div className="max-w-2xl">
            <Eyebrow>EVENT SERIES</Eyebrow>
            <h1 className="text-balance font-sora text-h2sm font-semibold text-white">
              {series.name}
            </h1>
            <p className="mt-5 font-inter text-[17px] leading-relaxed text-white/70">
              {series.summary}
            </p>
          </div>
        </div>
      </Section>

      <Section tone="lift">
        <Eyebrow>UPCOMING DATES</Eyebrow>
        {upcoming.length === 0 ? (
          <p className="mt-6 rounded-card border border-white/10 bg-ink p-8 text-center font-inter text-[16px] text-white/60">
            No upcoming {series.name} dates are scheduled right now. Check back soon.
          </p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        )}

        {past.length > 0 && (
          <div className="mt-16">
            <h2 className="font-sora text-h3 font-semibold text-white">
              Past <span className="o">dates</span>
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((e) => (
                <EventCard key={e.slug} event={e} past />
              ))}
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
