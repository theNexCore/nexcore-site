import Link from 'next/link';
import { EventArt } from './EventArt';
import type { NexEvent } from '@/lib/events';
import { eventDateParts } from '@/lib/events';
import { cn } from '@/lib/cn';

const locationLabel = (e: NexEvent) =>
  e.locationType === 'online' ? 'Online' : e.locationName || 'NexCore';

export function EventCard({ event, past = false }: { event: NexEvent; past?: boolean }) {
  const d = eventDateParts(event.startTS);

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-card border bg-ink-lift transition-colors',
        past ? 'border-white/8 opacity-80 hover:opacity-100' : 'border-white/10 hover:border-sky/50',
      )}
    >
      <Link href={`/events/${event.slug}`} className="flex flex-1 flex-col">
        <div className="aspect-[16/9] overflow-hidden bg-ink">
          <EventArt
            src={event.img}
            title={event.title}
            sizes="(max-width: 768px) 100vw, 380px"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-start gap-4">
            <div
              aria-hidden="true"
              className="shrink-0 rounded-lg border border-white/12 bg-ink px-3 py-2 text-center"
            >
              <span className="block font-inter text-[11px] font-semibold tracking-[0.1em] text-sky">
                {d.month}
              </span>
              <span className="block font-sora text-[22px] font-semibold leading-none text-white">
                {d.day}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              {event.series && (
                <span className="mb-1.5 inline-block rounded-pill bg-sky/15 px-2.5 py-0.5 font-inter text-[11px] font-semibold text-sky">
                  {event.series}
                  {event.seriesOrder ? ` · ${event.seriesOrder}` : ''}
                </span>
              )}
              <h3 className="font-sora text-[17px] font-semibold leading-snug text-white transition-colors group-hover:text-sky">
                {event.title}
              </h3>
              <p className="mt-1.5 font-inter text-[13px] text-white/50">
                <time dateTime={event.startTS}>
                  {d.weekday}, {d.month} {d.day}, {d.year}
                </time>
                {event.timeRange && ` · ${event.timeRange}`}
              </p>
            </div>
          </div>

          <p className="mt-4 flex-1 font-inter text-[14px] leading-relaxed text-white/60">
            {event.summary}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-pill border border-white/12 px-2.5 py-1 font-inter text-[12px] text-white/55">
              {locationLabel(event)}
            </span>
            <span
              className={cn(
                'rounded-pill px-2.5 py-1 font-inter text-[12px] font-medium',
                event.priceValue === 0 ? 'bg-sky/15 text-sky' : 'border border-white/12 text-white/70',
              )}
            >
              {event.priceLabel}
            </span>
            {event.isOccurrence && (
              <span className="rounded-pill border border-white/12 px-2.5 py-1 font-inter text-[12px] text-white/45">
                Recurring
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Ticket link is a plain outbound anchor - no embeds, per project spec. */}
      {!past && event.link && (
        <div className="border-t border-white/10 p-4">
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-pill bg-sky px-5 py-2.5 font-inter text-[14px] font-semibold text-white transition-colors hover:bg-sky-light"
          >
            {event.linkLabel}
          </a>
        </div>
      )}
    </article>
  );
}
