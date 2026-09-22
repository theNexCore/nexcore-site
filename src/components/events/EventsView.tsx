'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { EventSeriesInfo, NexEvent } from '@/lib/events';
import { EventCard } from './EventCard';
import { SeriesCard } from './SeriesCard';
import { cn } from '@/lib/cn';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Parse "YYYY-MM-DD" as a local date (avoids UTC off-by-one). */
function localDate(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d);
}

type ListItem =
  | { kind: 'event'; event: NexEvent }
  | { kind: 'series'; series: EventSeriesInfo; next: NexEvent; count: number };

/**
 * Collapse every series marked `collapse` into one card, placed where its
 * next date would have been. Everything else stays one card per event.
 */
function toListItems(events: NexEvent[], series: EventSeriesInfo[]): ListItem[] {
  const collapsible = new Map(series.filter((s) => s.collapse).map((s) => [s.id, s]));
  const counts = new Map<string, number>();
  for (const e of events) {
    if (e.seriesId && collapsible.has(e.seriesId)) {
      counts.set(e.seriesId, (counts.get(e.seriesId) ?? 0) + 1);
    }
  }

  const items: ListItem[] = [];
  const placed = new Set<string>();
  for (const e of events) {
    const s = e.seriesId ? collapsible.get(e.seriesId) : undefined;
    if (!s) {
      items.push({ kind: 'event', event: e });
    } else if (!placed.has(s.id)) {
      placed.add(s.id);
      items.push({ kind: 'series', series: s, next: e, count: counts.get(s.id) ?? 1 });
    }
  }
  return items;
}

/**
 * Native calendar + list view. No third-party calendar library, no embeds.
 *
 * The calendar shows every date. The list collapses series marked `collapse`
 * (see eventSeries in @/data/events) into a single card each.
 */
export function EventsView({
  upcoming,
  past,
  series = [],
  initialView = 'list',
}: {
  upcoming: NexEvent[];
  past: NexEvent[];
  series?: EventSeriesInfo[];
  /** /events opens on the list; /events/calendar opens on the calendar. */
  initialView?: 'list' | 'calendar';
}) {
  const [view, setView] = useState<'list' | 'calendar'>(initialView);
  const listItems = useMemo(() => toListItems(upcoming, series), [upcoming, series]);

  // Anchor the calendar on the first upcoming event, else today.
  const initial = upcoming[0] ? localDate(upcoming[0].date) : new Date();
  const [cursor, setCursor] = useState({ y: initial.getFullYear(), m: initial.getMonth() });

  const byDate = useMemo(() => {
    const map = new Map<string, NexEvent[]>();
    for (const e of upcoming) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return map;
  }, [upcoming]);

  const grid = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
    const cells: (string | null)[] = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const ymd = `${cursor.y}-${String(cursor.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push(ymd);
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const step = (delta: number) => {
    setCursor((c) => {
      const d = new Date(c.y, c.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };

  const todayYmd = (() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
  })();

  return (
    <>
      {/* View toggle */}
      <div
        role="group"
        aria-label="Event view"
        className="mb-10 inline-flex rounded-pill border border-white/15 p-1"
      >
        {(['list', 'calendar'] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            aria-pressed={view === v}
            className={cn(
              'rounded-pill px-5 py-2 font-inter text-[14px] font-semibold transition-colors',
              view === v ? 'bg-sky text-white' : 'text-white/65 hover:text-white',
            )}
          >
            {v === 'list' ? 'List' : 'Calendar'}
          </button>
        ))}
      </div>

      {view === 'calendar' ? (
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-sora text-xl font-semibold text-white">
              {MONTHS[cursor.m]} {cursor.y}
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous month"
                className="rounded-pill border border-white/15 px-4 py-2 font-inter text-[14px] text-white/75 hover:border-sky hover:text-sky"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next month"
                className="rounded-pill border border-white/15 px-4 py-2 font-inter text-[14px] text-white/75 hover:border-sky hover:text-sky"
              >
                →
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-7 gap-px border-b border-white/10 pb-2">
                {DOW.map((d) => (
                  <div
                    key={d}
                    className="px-2 font-inter text-[12px] font-semibold tracking-[0.08em] text-white/40"
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-px bg-white/8">
                {grid.map((ymd, i) => {
                  const events = ymd ? (byDate.get(ymd) ?? []) : [];
                  return (
                    <div
                      key={i}
                      className={cn(
                        'min-h-[104px] bg-ink p-2',
                        ymd === todayYmd && 'ring-1 ring-inset ring-sky/50',
                      )}
                    >
                      {ymd && (
                        <>
                          <span
                            className={cn(
                              'font-inter text-[13px]',
                              events.length ? 'font-semibold text-white' : 'text-white/35',
                            )}
                          >
                            {Number(ymd.slice(-2))}
                          </span>
                          <ul className="mt-1 space-y-1">
                            {events.map((e) => (
                              <li key={e.slug}>
                                <Link
                                  href={`/events/${e.slug}`}
                                  className="block rounded bg-sky/15 px-1.5 py-1 font-inter text-[11px] leading-tight text-sky hover:bg-sky/25"
                                >
                                  {e.title.length > 38 ? `${e.title.slice(0, 38)}…` : e.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {upcoming.length === 0 ? (
            <p className="rounded-card border border-white/10 bg-ink-lift p-8 text-center font-inter text-[16px] text-white/60">
              No upcoming events are scheduled right now. Check back soon.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listItems.map((item) =>
                item.kind === 'series' ? (
                  <SeriesCard
                    key={`series-${item.series.id}`}
                    series={item.series}
                    next={item.next}
                    count={item.count}
                  />
                ) : (
                  <EventCard key={item.event.slug} event={item.event} />
                ),
              )}
            </div>
          )}
        </>
      )}

      {past.length > 0 && (
        <section className="mt-20">
          <h2 className="font-sora text-h3 font-semibold text-white">
            Past <span className="o">Events</span>
          </h2>
          <p className="mt-3 max-w-2xl font-inter text-[16px] text-white/60">
            Every completed event moves here automatically. Photos are added as they become
            available.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((e) => (
              <EventCard key={e.slug} event={e} past />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
