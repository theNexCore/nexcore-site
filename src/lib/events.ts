/**
 * Event types and display helpers.
 *
 * Client-safe by construction: EventsView and EventCard are client components
 * and import from here, so anything added to this file ships to the browser.
 * Loading @/data/events and expanding recurrences lives in events-server.ts,
 * which keeps the event data and the rrule library out of the client bundle.
 */

export { slugify } from './slug';

export type LocationType = 'nexcore' | 'plaza' | 'online' | 'offsite';

export interface NexEvent {
  slug: string;
  title: string;
  /** Start date, YYYY-MM-DD. */
  date: string;
  /** Machine-readable start, YYYY-MM-DDTHH:mm, NexCore local time. */
  startTS: string;
  /** Machine-readable end, YYYY-MM-DDTHH:mm, NexCore local time. */
  endTS: string;
  /** Optional doors-open time, display string e.g. "9:00 AM". */
  doors: string;
  /** Derived display range e.g. "9:00 AM – 9:00 PM". */
  timeRange: string;
  /** Derived display line e.g. "9:00 AM – 9:00 PM, doors open at 9:00 AM". */
  timeLabel: string;

  /** True when this is one occurrence of a recurring event. */
  isOccurrence: boolean;

  /** Series id (see EventSeriesInfo), or null. */
  seriesId: string | null;
  /** Series display name, or null. */
  series: string | null;
  seriesOrder: number | null;

  /** Slugs of the members who lead the event. */
  hosts: string[];

  locationType: LocationType;
  locationName: string;
  locationAddress: string;

  summary: string;
  desc: string;

  /** Local image path, or null when none is set or the file is not in public/ yet. */
  img: string | null;
  gallery: string[];

  priceLabel: string;
  priceValue: number;

  link: string | null;
  linkLabel: string;
  link2: string | null;
  link2Label: string | null;

  /** True once endTS is in the past. */
  isPast: boolean;
}

/** The slice of an event a member's directory modal needs. */
export interface HostedEvent {
  slug: string;
  title: string;
  startTS: string;
}

export interface EventSeriesInfo {
  id: string;
  name: string;
  summary: string;
  /** Local logo path, or null when none is set or the file is not in public/ yet. */
  logo: string | null;
  /** CSS colour behind the logo. */
  logoBg: string;
  collapse: boolean;
}

/** Local-time Date from "YYYY-MM-DDTHH:mm" (avoids UTC shift from Date parsing). */
export function toDate(ts: string): Date {
  const [d, t = '00:00'] = ts.split('T');
  const [y, mo, da] = d.split('-').map(Number);
  const [h, mi] = t.split(':').map(Number);
  return new Date(y, (mo || 1) - 1, da || 1, h || 0, mi || 0);
}

export function formatEventDate(ts: string, opts: Intl.DateTimeFormatOptions = {}): string {
  return toDate(ts).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    ...opts,
  });
}

export const eventDateParts = (ts: string) => {
  const d = toDate(ts);
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }),
    day: d.getDate(),
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
    year: d.getFullYear(),
  };
};
