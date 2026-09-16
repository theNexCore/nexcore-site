import Image from 'next/image';
import Link from 'next/link';
import type { EventSeriesInfo, NexEvent } from '@/lib/events';
import { eventDateParts } from '@/lib/events';

/**
 * One card standing in for every upcoming date of a collapsed series, so a
 * weekly event does not fill the list view. Sits in the grid at the position
 * of the series' next date.
 */
export function SeriesCard({
  series,
  next,
  count,
}: {
  series: EventSeriesInfo;
  /** The series' next upcoming occurrence. */
  next: NexEvent;
  /** Upcoming occurrences in the series. */
  count: number;
}) {
  const d = eventDateParts(next.startTS);

  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-white/10 bg-ink-lift transition-colors hover:border-sky/50">
      <Link href={`/events/${series.id}`} className="flex flex-1 flex-col">
        <div
          className="flex aspect-[16/9] items-center justify-center overflow-hidden"
          style={{ backgroundColor: series.logoBg }}
        >
          {series.logo ? (
            <Image
              src={series.logo}
              alt={`${series.name} logo`}
              width={400}
              height={400}
              sizes="220px"
              className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <span className="font-sora text-[28px] font-semibold text-navy">{series.name}</span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <span className="mb-1.5 inline-block self-start rounded-pill bg-sky/15 px-2.5 py-0.5 font-inter text-[11px] font-semibold text-sky">
            Event series
          </span>
          <h3 className="font-sora text-[17px] font-semibold leading-snug text-white transition-colors group-hover:text-sky">
            {series.name}
          </h3>
          <p className="mt-1.5 font-inter text-[13px] text-white/50">
            Next: {d.weekday}, {d.month} {d.day}
            {next.timeRange && ` · ${next.timeRange}`}
          </p>

          <p className="mt-4 flex-1 font-inter text-[14px] leading-relaxed text-white/60">
            {series.summary}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-pill border border-white/12 px-2.5 py-1 font-inter text-[12px] text-white/55">
              {count} upcoming {count === 1 ? 'date' : 'dates'}
            </span>
          </div>
        </div>

        <div className="border-t border-white/10 p-4">
          <span className="inline-flex w-full items-center justify-center rounded-pill border border-sky/60 px-5 py-2.5 font-inter text-[14px] font-semibold text-sky transition-colors group-hover:bg-sky group-hover:text-white">
            See all {series.name} events
          </span>
        </div>
      </Link>
    </article>
  );
}
