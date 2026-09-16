import 'server-only';

import { RRule, RRuleSet, type Options, type Weekday as RWeekday } from 'rrule';

import { abs, site, formattedAddress } from '@/data/site';
import { events as records, type EventRecord, type Weekday } from '@/data/events';
import localImages from '@/data/local-images.json';
import type { LocationType, NexEvent } from './events';

/**
 * Server-side event data access: reads @/data/events and expands recurring
 * events into dated occurrences.
 */

/** Every time in @/data/events is wall-clock time here. */
const TIME_ZONE = 'America/Chicago';

/** How far ahead recurring events are expanded, per approved spec. */
const RECURRENCE_HORIZON_WEEKS = 8;

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

const TS_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

/** "HH:mm" -> "9:00 AM" */
function displayClock(hhmm: string): string {
  const [hStr, m] = hhmm.split(':');
  let h = parseInt(hStr, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m} ${suffix}`;
}

const timeOf = (ts: string): string => ts.slice(11, 16);
const dateOf = (ts: string): string => ts.slice(0, 10);

/**
 * rrule works in UTC. The documented way to get wall-clock recurrence is to
 * hand it "floating" times: the local wall clock stored in UTC fields, never
 * converted. Weekdays and times of day then come out exactly as written, and
 * daylight saving can never shift an occurrence by an hour.
 */
function floating(ts: string): Date {
  const [y, mo, d, h, mi] = ts.split(/[-T:]/).map(Number);
  return new Date(Date.UTC(y, mo - 1, d, h, mi));
}

const fromFloating = (d: Date): string => d.toISOString().slice(0, 16);

/** The current wall-clock time at NexCore, as "YYYY-MM-DDTHH:mm". */
function nowLocal(): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

const images = localImages as Record<string, unknown>;

/** A local image path, or null until scripts/images.ts has seen the file in public/. */
function localImage(src: string | undefined): string | null {
  const path = (src ?? '').trim();
  return path && path in images ? path : null;
}

function truncate(s: string, n: number): string {
  const clean = s.replace(/\s+/g, ' ').trim();
  if (clean.length <= n) return clean;
  const cut = clean.slice(0, n - 1);
  const sp = cut.lastIndexOf(' ');
  return `${(sp > n * 0.6 ? cut.slice(0, sp) : cut).trim()}…`;
}

/* ------------------------------------------------------------------ *
 * Recurrence
 * ------------------------------------------------------------------ */

const WEEKDAYS: Record<Weekday, RWeekday> = {
  MO: RRule.MO,
  TU: RRule.TU,
  WE: RRule.WE,
  TH: RRule.TH,
  FR: RRule.FR,
  SA: RRule.SA,
  SU: RRule.SU,
};

const FREQS = { daily: RRule.DAILY, weekly: RRule.WEEKLY, monthly: RRule.MONTHLY } as const;

/** The rule set for a recurring record, `skip` dates excluded. */
function ruleSet(rec: EventRecord): RRuleSet | null {
  const r = rec.repeat;
  if (!r) return null;

  const opts: Partial<Options> = {
    freq: FREQS[r.freq],
    dtstart: floating(rec.start),
    interval: r.interval ?? 1,
  };
  if (r.byWeekday?.length) {
    opts.byweekday = r.byWeekday.map((d) => (r.nth ? WEEKDAYS[d].nth(r.nth) : WEEKDAYS[d]));
  }
  if (r.until) opts.until = floating(`${r.until}T23:59`);
  if (r.count) opts.count = r.count;

  const set = new RRuleSet();
  set.rrule(new RRule(opts));
  for (const day of rec.skip ?? []) set.exdate(floating(`${day}T${timeOf(rec.start)}`));
  return set;
}

/** Event length in minutes, applied to every occurrence. */
const lengthOf = (rec: EventRecord): number =>
  Math.max(0, (floating(rec.end).getTime() - floating(rec.start).getTime()) / 60_000);

function endFor(rec: EventRecord, start: Date): string {
  return fromFloating(new Date(start.getTime() + lengthOf(rec) * 60_000));
}

/**
 * The occurrences to publish for one record: anything not yet finished through
 * the horizon. A series with nothing in that window still shows one date — the
 * next one if it starts later, else its last — so it never silently vanishes.
 */
function occurrences(rec: EventRecord, now: string): NexEvent[] {
  const set = ruleSet(rec);
  if (!set) return [build(rec, rec.slug, rec.start, rec.end, false)];

  const from = new Date(floating(now).getTime() - lengthOf(rec) * 60_000);
  const to = new Date(floating(now).getTime() + RECURRENCE_HORIZON_WEEKS * 7 * 86_400_000);

  let starts = set.between(from, to, true);
  if (!starts.length) {
    const fallback = set.after(to) ?? set.before(from);
    starts = fallback ? [fallback] : [];
  }

  return starts.map((d) => {
    const start = fromFloating(d);
    return build(rec, `${rec.slug}-${dateOf(start)}`, start, endFor(rec, d), true);
  });
}

/**
 * Resolve an occurrence slug outside the published window, so a link to last
 * week's session still opens its page instead of a 404.
 */
function occurrenceBySlug(slug: string): NexEvent | null {
  const m = /^(.+)-(\d{4}-\d{2}-\d{2})$/.exec(slug);
  if (!m) return null;
  const rec = records.find((r) => r.repeat && r.slug === m[1]);
  const set = rec && ruleSet(rec);
  if (!rec || !set) return null;

  const [hit] = set.between(floating(`${m[2]}T00:00`), floating(`${m[2]}T23:59`), true);
  return hit ? build(rec, slug, fromFloating(hit), endFor(rec, hit), true) : null;
}

/* ------------------------------------------------------------------ *
 * Normalisation
 * ------------------------------------------------------------------ */

function build(
  rec: EventRecord,
  slug: string,
  startTS: string,
  endTS: string,
  isOccurrence: boolean,
): NexEvent {
  const doors = (rec.doors ?? '').trim();
  const timeRange = `${displayClock(timeOf(startTS))} – ${displayClock(timeOf(endTS))}`;

  const desc = rec.desc.trim();
  const priceLabel = rec.priceLabel?.trim() || 'Free';
  const priceValue =
    rec.priceValue ??
    (/free/i.test(priceLabel) ? 0 : Number((priceLabel.match(/[\d.]+/) ?? ['0'])[0]) || 0);

  const locationType: LocationType = rec.locationType ?? 'nexcore';
  const locationName =
    rec.locationName ||
    (locationType === 'online'
      ? 'Online'
      : locationType === 'plaza'
        ? 'Plaza 21'
        : locationType === 'offsite'
          ? ''
          : 'NexCore');

  return {
    slug,
    title: rec.title.trim(),
    date: dateOf(startTS),
    startTS,
    endTS,
    doors,
    timeRange,
    timeLabel: doors ? `${timeRange}, doors open at ${doors}` : timeRange,
    isOccurrence,
    series: rec.series || null,
    seriesOrder: rec.seriesOrder ?? null,
    locationType,
    locationName,
    locationAddress: rec.locationAddress || (locationType === 'online' ? '' : formattedAddress),
    summary: rec.summary?.trim() || truncate(desc, 160),
    desc,
    img: localImage(rec.img),
    gallery: (rec.gallery ?? []).map(localImage).filter((u): u is string => u !== null),
    priceLabel,
    priceValue,
    link: rec.link || null,
    linkLabel: rec.linkLabel || 'Get Tickets',
    link2: rec.link2 || null,
    link2Label: rec.link2Label || null,
    isPast: endTS < nowLocal(),
  };
}

/** A record that cannot be placed on a calendar is skipped rather than breaking the page. */
function valid(rec: EventRecord): boolean {
  const ok = Boolean(rec.title?.trim() && rec.slug?.trim() && TS_RE.test(rec.start) && TS_RE.test(rec.end));
  if (!ok) console.warn(`[events] skipping "${rec.title || rec.slug}": needs title, slug, start and end`);
  return ok;
}

/* ------------------------------------------------------------------ *
 * Load
 * ------------------------------------------------------------------ */

export interface EventsPayload {
  upcoming: NexEvent[];
  past: NexEvent[];
  all: NexEvent[];
  seriesMap: Record<string, NexEvent[]>;
}

/**
 * Built from @/data/events relative to the current time. Cheap enough to run
 * on every call, and ISR (revalidate: 300) is what rolls it forward.
 */
export async function getEvents(): Promise<EventsPayload> {
  const now = nowLocal();

  // De-dupe on slug; first entry wins.
  const bySlug = new Map<string, NexEvent>();
  for (const e of records.filter(valid).flatMap((r) => occurrences(r, now))) {
    if (!bySlug.has(e.slug)) bySlug.set(e.slug, e);
  }
  const unique = [...bySlug.values()];

  const upcoming = unique
    .filter((e) => !e.isPast)
    .sort((a, b) => a.startTS.localeCompare(b.startTS));

  const past = unique
    .filter((e) => e.isPast)
    .sort((a, b) => b.startTS.localeCompare(a.startTS));

  const seriesMap: Record<string, NexEvent[]> = {};
  for (const e of unique) {
    if (!e.series) continue;
    (seriesMap[e.series] ??= []).push(e);
  }
  for (const k of Object.keys(seriesMap)) {
    seriesMap[k].sort(
      (a, b) => (a.seriesOrder ?? 999) - (b.seriesOrder ?? 999) || a.startTS.localeCompare(b.startTS),
    );
  }

  return { upcoming, past, all: unique, seriesMap };
}

export async function getEventBySlug(slug: string): Promise<NexEvent | null> {
  const { all } = await getEvents();
  return all.find((e) => e.slug === slug) ?? occurrenceBySlug(slug);
}

/* ------------------------------------------------------------------ *
 * JSON-LD
 * ------------------------------------------------------------------ */

const DEFAULT_STREET = `${site.address.street}, ${site.address.suite}`;

/**
 * Reduce a possibly-full address to just its street line.
 * "11820 Tesson Ferry Road, Ste 1000, St. Louis, MO 63128" -> "11820 Tesson Ferry Road, Ste 1000"
 */
function streetLineOf(address: string): string {
  if (!address) return DEFAULT_STREET;
  const parts = address.split(',').map((p) => p.trim());
  const cityAt = parts.findIndex((p) => p.toLowerCase() === site.address.city.toLowerCase());
  if (cityAt > 0) return parts.slice(0, cityAt).join(', ');
  return address;
}

/** schema.org Event. Location is always emitted, so the payload stays valid. */
export function eventJsonLd(e: NexEvent) {
  const location =
    e.locationType === 'online'
      ? {
          '@type': 'VirtualLocation',
          url: e.link ?? abs(`/events/${e.slug}`),
        }
      : {
          '@type': 'Place',
          name: e.locationName || site.name,
          address: {
            '@type': 'PostalAddress',
            // streetAddress must be the street line only - locality, region and
            // postalCode are separate fields. locationAddress may hold a full
            // one-line address, so strip the trailing parts.
            streetAddress: streetLineOf(e.locationAddress),
            addressLocality: site.address.city,
            addressRegion: site.address.region,
            postalCode: site.address.postalCode,
            addressCountry: site.address.country,
          },
        };

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.title,
    description: e.summary || truncate(e.desc, 300),
    startDate: e.startTS,
    endDate: e.endTS,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode:
      e.locationType === 'online'
        ? 'https://schema.org/OnlineEventAttendanceMode'
        : 'https://schema.org/OfflineEventAttendanceMode',
    location,
    ...(e.img ? { image: [abs(e.img)] } : {}),
    url: abs(`/events/${e.slug}`),
    organizer: { '@type': 'Organization', name: site.name, url: abs('/') },
    offers: {
      '@type': 'Offer',
      price: e.priceValue,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: e.link ?? abs(`/events/${e.slug}`),
      validFrom: `${e.date}T00:00`,
    },
  };
}
