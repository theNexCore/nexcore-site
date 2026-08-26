import { abs, site, formattedAddress } from '@/data/site';

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

export type Recurrence = 'none' | 'weekly' | 'monthly';
export type LocationType = 'nexcore' | 'plaza' | 'online' | 'offsite';

export interface NexEvent {
  slug: string;
  title: string;
  /** Start date, YYYY-MM-DD. */
  date: string;
  /** Machine-readable start, YYYY-MM-DDTHH:mm. */
  startTS: string;
  /** Machine-readable end, YYYY-MM-DDTHH:mm. */
  endTS: string;
  /** Optional doors-open time, display string e.g. "9:00 AM". */
  doors: string;
  /** Derived display range e.g. "9:00 AM – 9:00 PM". */
  timeRange: string;
  /** Derived display line e.g. "9:00 AM – 9:00 PM, doors open at 9:00 AM". */
  timeLabel: string;

  recurrence: Recurrence;
  recurrenceEnd: string | null;
  /** True when this row was expanded from a recurring parent. */
  isOccurrence: boolean;

  series: string | null;
  seriesOrder: number | null;

  locationType: LocationType;
  locationName: string;
  locationAddress: string;

  summary: string;
  desc: string;

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

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : v == null ? '' : String(v).trim());

export const slugify = (s: string, max = 60): string =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[‘’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max)
    // Re-trim: slicing can leave a dangling hyphen, which would otherwise
    // produce "...presented-by--2026-09-05" once the date is appended.
    .replace(/-+$/, '');

/** Parse "9:00 AM" / "6:30 PM" / "9 AM" into "HH:mm". Returns null if unparseable. */
function parseClock(input: string): string | null {
  const m = /(\d{1,2})(?::(\d{2}))?\s*([AaPp])\.?[Mm]\.?/.exec(input);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = m[2] ?? '00';
  const pm = m[3].toLowerCase() === 'p';
  if (h === 12) h = pm ? 12 : 0;
  else if (pm) h += 12;
  if (h > 23) return null;
  return `${String(h).padStart(2, '0')}:${min}`;
}

/** "9:00 AM – 9:00 PM" -> ["09:00", "21:00"] */
function parseRange(range: string): [string | null, string | null] {
  const parts = range.split(/[–—-]/);
  if (parts.length < 2) return [parseClock(range), null];
  return [parseClock(parts[0]), parseClock(parts.slice(1).join('-'))];
}

/** "HH:mm" -> "9:00 AM" */
function displayClock(hhmm: string): string {
  const [hStr, m] = hhmm.split(':');
  let h = parseInt(hStr, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m} ${suffix}`;
}

const timeOf = (ts: string): string => (ts.includes('T') ? ts.split('T')[1].slice(0, 5) : '');
const dateOf = (ts: string): string => (ts.includes('T') ? ts.split('T')[0] : ts);

/** Local-time Date from "YYYY-MM-DDTHH:mm" (avoids UTC shift from Date parsing). */
function toDate(ts: string): Date {
  const [d, t = '00:00'] = ts.split('T');
  const [y, mo, da] = d.split('-').map(Number);
  const [h, mi] = t.split(':').map(Number);
  return new Date(y, (mo || 1) - 1, da || 1, h || 0, mi || 0);
}

function addDays(ts: string, days: number): string {
  const d = toDate(ts);
  d.setDate(d.getDate() + days);
  return fmtTS(d);
}

function addMonths(ts: string, months: number): string {
  const d = toDate(ts);
  d.setMonth(d.getMonth() + months);
  return fmtTS(d);
}

function fmtTS(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function splitList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(str).filter(Boolean);
  const s = str(v);
  if (!s) return [];
  return s
    .split(/[\n,]+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

/**
 * Repair and vet an image URL from the sheet.
 *
 * Two real problems in the live data:
 *
 * 1. Some rows hold a URL copied out of Eventbrite's own Next.js image
 *    optimiser, which resolved as a relative path against eventbrite.com:
 *      https://www.eventbrite.com/e/_next/image?url=<encoded real url>
 *    We unwrap the nested `url` parameter to recover the real target.
 *
 * 2. Eventbrite's CDN (img.evbuc.com / cdn.evbuc.com) blocks hotlinking and
 *    returns 403 to every origin, browsers included. Those URLs can never
 *    render, so we treat them as "no image" and let the UI show a branded
 *    fallback rather than a broken box.
 */
export function repairImageUrl(raw: string): string | null {
  let url = raw.trim();
  if (!url) return null;

  // Unwrap nested /_next/image?url=… (repeat in case of double wrapping).
  for (let i = 0; i < 3 && /\/_next\/image\?/.test(url); i++) {
    const m = /[?&]url=([^&]+)/.exec(url);
    if (!m) break;
    try {
      url = decodeURIComponent(m[1]);
    } catch {
      break;
    }
  }

  if (!/^https?:\/\//i.test(url)) return null;

  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }

  // Hotlink-blocked hosts: unusable, so report no image.
  if (host.endsWith('evbuc.com') || host.endsWith('eventbrite.com')) return null;

  return url;
}

function truncate(s: string, n: number): string {
  const clean = s.replace(/\s+/g, ' ').trim();
  if (clean.length <= n) return clean;
  const cut = clean.slice(0, n - 1);
  const sp = cut.lastIndexOf(' ');
  return `${(sp > n * 0.6 ? cut.slice(0, sp) : cut).trim()}…`;
}

/* ------------------------------------------------------------------ *
 * Normalisation
 *
 * Tolerant by design. The sheet is mid-migration to the approved schema
 * (audit/EVENTS-SHEET-SCHEMA.md); until every column is backfilled this
 * derives the new fields from the legacy ones so the site stays correct.
 * ------------------------------------------------------------------ */

function normalise(raw: Record<string, unknown>): NexEvent | null {
  const title = str(raw.title);
  const date = str(raw.date);
  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;

  const legacyRange = str(raw.timeRange);
  const [rangeStart, rangeEnd] = parseRange(legacyRange);

  // startTS: prefer the real column, else derive from timeRange, else midnight.
  let startTS = str(raw.startTS);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(startTS)) {
    startTS = `${date}T${rangeStart ?? '00:00'}`;
  }

  let endTS = str(raw.endTS);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(endTS)) {
    endTS = `${date}T${rangeEnd ?? '23:59'}`;
  }

  const doors = str(raw.doors);
  const startClock = timeOf(startTS);
  const endClock = timeOf(endTS);
  const timeRange =
    legacyRange ||
    (startClock && endClock ? `${displayClock(startClock)} – ${displayClock(endClock)}` : '');
  const timeLabel = timeRange
    ? doors
      ? `${timeRange}, doors open at ${doors}`
      : timeRange
    : '';

  const desc = str(raw.desc);
  const summary = str(raw.summary) || truncate(desc, 160);

  // priceLabel/priceValue replace the legacy `type` column.
  const legacyType = str(raw.type).toLowerCase();
  const priceLabel = str(raw.priceLabel) || (legacyType === 'free' ? 'Free' : legacyType ? legacyType : 'Free');
  const rawPrice = raw.priceValue;
  const priceValue =
    rawPrice === '' || rawPrice == null
      ? /free/i.test(priceLabel)
        ? 0
        : Number((priceLabel.match(/[\d.]+/) ?? ['0'])[0]) || 0
      : Number(rawPrice) || 0;

  const lt = str(raw.locationType).toLowerCase();
  const locationType: LocationType =
    lt === 'plaza' || lt === 'online' || lt === 'offsite' || lt === 'nexcore'
      ? (lt as LocationType)
      : 'nexcore';

  const locationName =
    str(raw.locationName) ||
    (locationType === 'online'
      ? 'Online'
      : locationType === 'plaza'
        ? 'Plaza 21'
        : locationType === 'offsite'
          ? ''
          : 'NexCore');

  const locationAddress =
    str(raw.locationAddress) || (locationType === 'online' ? '' : formattedAddress);

  const recRaw = str(raw.recurrence).toLowerCase();
  const recurrence: Recurrence = recRaw === 'weekly' || recRaw === 'monthly' ? recRaw : 'none';

  const seriesOrderRaw = raw.seriesOrder;
  const link = str(raw.link) || null;

  return {
    slug: str(raw.slug) || `${slugify(title)}-${date}`,
    title,
    date,
    startTS,
    endTS,
    doors,
    timeRange,
    timeLabel,
    recurrence,
    recurrenceEnd: str(raw.recurrenceEnd) || null,
    isOccurrence: false,
    series: str(raw.series) || null,
    seriesOrder:
      seriesOrderRaw === '' || seriesOrderRaw == null ? null : Number(seriesOrderRaw) || null,
    locationType,
    locationName,
    locationAddress,
    summary,
    desc,
    img: repairImageUrl(str(raw.img)),
    gallery: splitList(raw.gallery).map(repairImageUrl).filter((u): u is string => u !== null),
    priceLabel,
    priceValue,
    link,
    linkLabel: str(raw.linkLabel) || 'Get Tickets',
    link2: str(raw.link2) || null,
    link2Label: str(raw.link2Label) || null,
    isPast: false,
  };
}

/* ------------------------------------------------------------------ *
 * Recurrence expansion - capped at 8 weeks ahead, per approved spec.
 * ------------------------------------------------------------------ */

const RECURRENCE_HORIZON_WEEKS = 8;

function expand(ev: NexEvent, now: Date): NexEvent[] {
  if (ev.recurrence === 'none') return [ev];

  const horizon = new Date(now);
  horizon.setDate(horizon.getDate() + RECURRENCE_HORIZON_WEEKS * 7);
  const hardStop = ev.recurrenceEnd ? toDate(`${ev.recurrenceEnd}T23:59`) : null;

  const out: NexEvent[] = [];
  let startTS = ev.startTS;
  let endTS = ev.endTS;
  let i = 0;

  // Generous iteration bound; the horizon/hardStop checks below do the real work.
  while (i < 200) {
    const startDate = toDate(startTS);
    if (hardStop && startDate > hardStop) break;
    if (startDate > horizon) break;

    const d = dateOf(startTS);
    out.push({
      ...ev,
      slug: i === 0 ? ev.slug : `${slugify(ev.title)}-${d}`,
      date: d,
      startTS,
      endTS,
      isOccurrence: i > 0,
    });

    i += 1;
    startTS = ev.recurrence === 'weekly' ? addDays(startTS, 7) : addMonths(startTS, 1);
    endTS = ev.recurrence === 'weekly' ? addDays(endTS, 7) : addMonths(endTS, 1);
  }

  // Always keep at least the seed row so a fully-past recurring event still
  // appears under Past Events rather than vanishing.
  return out.length ? out : [ev];
}

/* ------------------------------------------------------------------ *
 * Fetch
 * ------------------------------------------------------------------ */

const FEED_URL =
  process.env.EVENTS_FEED_URL ??
  'https://script.google.com/macros/s/AKfycbxdRxfYdYe9QErC8UfjaI-nnqFYnjuP4YDWkEAN9rwE9SvILVIjrFIVhgNeXG3YT_jY/exec';

export interface EventsPayload {
  upcoming: NexEvent[];
  past: NexEvent[];
  all: NexEvent[];
  seriesMap: Record<string, NexEvent[]>;
  error: string | null;
}

/**
 * Fetched at build time and revalidated by ISR every 300s.
 * Never fetched per-request.
 */
export async function getEvents(): Promise<EventsPayload> {
  const empty: EventsPayload = { upcoming: [], past: [], all: [], seriesMap: {}, error: null };

  let rows: unknown;
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 300 } });
    if (!res.ok) return { ...empty, error: `Events feed returned ${res.status}` };
    rows = await res.json();
  } catch (err) {
    return { ...empty, error: err instanceof Error ? err.message : 'Events feed unreachable' };
  }

  if (!Array.isArray(rows)) return { ...empty, error: 'Events feed did not return an array' };

  const now = new Date();

  const all = rows
    .filter((r): r is Record<string, unknown> => !!r && typeof r === 'object')
    .map(normalise)
    .filter((e): e is NexEvent => e !== null)
    .flatMap((e) => expand(e, now))
    .map((e) => ({ ...e, isPast: toDate(e.endTS) < now }));

  // De-dupe on slug; a recurring expansion can collide with a hand-written row.
  const bySlug = new Map<string, NexEvent>();
  for (const e of all) if (!bySlug.has(e.slug)) bySlug.set(e.slug, e);
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

  return { upcoming, past, all: unique, seriesMap, error: null };
}

export async function getEventBySlug(slug: string): Promise<NexEvent | null> {
  const { all } = await getEvents();
  return all.find((e) => e.slug === slug) ?? null;
}

/* ------------------------------------------------------------------ *
 * Display + JSON-LD
 * ------------------------------------------------------------------ */

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
            // postalCode are separate fields. The sheet's locationAddress may
            // hold a full one-line address, so strip the trailing parts.
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
    ...(e.img ? { image: [e.img] } : {}),
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
