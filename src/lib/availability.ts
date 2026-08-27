import 'server-only';

/**
 * Booking availability.
 *
 * The old site's day-pass calendar called a second Apps Script web app to
 * find blocked days before letting anyone pick one. A bare GET returns:
 *
 *   {"result":"success","busy":["2026-09-14", ...]}
 *
 * Server-only: the endpoint URL must never reach client code. The browser
 * talks to /api/availability instead, which returns only the derived rules.
 *
 * Rules carried over verbatim from the old modal's config:
 *   OPEN_DAYS   [1,2,3,4,5,6]  Monday–Saturday; closed Sunday
 *   WINDOW_DAYS 30             how far ahead bookings are accepted
 *   NO_SAME_DAY false          same-day booking is allowed
 */

const ENDPOINT =
  process.env.AVAILABILITY_URL ??
  'https://script.google.com/macros/s/AKfycbxGPBuQ35i7uKWEMOrl_OOTvOXID7hIkxdPPvZFo5mF9X4oD2QCg91sharlzA7r8KLT/exec';

const TIMEOUT_MS = 8_000;

/** 0 = Sunday. NexCore is closed Sundays. */
export const OPEN_DAYS = [1, 2, 3, 4, 5, 6];
export const WINDOW_DAYS = 30;
export const ALLOW_SAME_DAY = true;

export interface Availability {
  /** Dates that cannot be booked, "YYYY-MM-DD". */
  busy: string[];
  /** Earliest bookable date, "YYYY-MM-DD". */
  min: string;
  /** Latest bookable date, "YYYY-MM-DD". */
  max: string;
  openDays: number[];
  /** Set when the upstream check failed; callers should degrade, not block. */
  error?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Parse "YYYY-MM-DD" as a local date, avoiding the UTC off-by-one. */
export function parseYmd(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function bookingWindow() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const first = new Date(today);
  if (!ALLOW_SAME_DAY) first.setDate(first.getDate() + 1);
  const last = new Date(today);
  last.setDate(last.getDate() + WINDOW_DAYS);
  return { min: ymd(first), max: ymd(last) };
}

/**
 * Validate a requested date against the same rules the UI applies.
 * This is the authoritative check — the browser's version is a courtesy.
 * Returns an error message, or null when the date is bookable.
 */
export function validateBookingDate(date: string, busy: string[] = []): string | null {
  const d = parseYmd(date);
  if (!d) return 'Choose a valid date.';

  const { min, max } = bookingWindow();
  if (date < min) return 'That date has passed. Please choose another day.';
  if (date > max) return `We take bookings up to ${WINDOW_DAYS} days ahead. Please choose a nearer day.`;
  if (!OPEN_DAYS.includes(d.getDay())) return "We're closed on Sundays. Please choose another day.";
  if (busy.includes(date)) return "That day is fully booked. Please choose another.";

  return null;
}

/**
 * Fetch blocked dates. A failure returns an empty list with `error` set —
 * an availability outage must never stop someone booking.
 */
export async function getAvailability(): Promise<Availability> {
  const { min, max } = bookingWindow();
  const base: Availability = { busy: [], min, max, openDays: OPEN_DAYS };

  try {
    const res = await fetch(ENDPOINT, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });
    if (!res.ok) return { ...base, error: `Availability returned HTTP ${res.status}` };

    const text = await res.text();
    if (!text.trimStart().startsWith('{')) {
      return { ...base, error: 'Availability did not return JSON' };
    }

    const parsed = JSON.parse(text) as { result?: string; busy?: unknown; message?: string };
    if (parsed.result !== 'success') {
      return { ...base, error: parsed.message ?? 'Availability check failed' };
    }

    const busy = Array.isArray(parsed.busy)
      ? parsed.busy.filter((d): d is string => typeof d === 'string')
      : [];

    return { ...base, busy };
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.name === 'TimeoutError'
          ? `Availability timed out after ${TIMEOUT_MS}ms`
          : err.message
        : 'Availability unreachable';
    return { ...base, error: msg };
  }
}
