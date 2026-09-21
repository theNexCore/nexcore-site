/**
 * Day pass booking rules.
 *
 * Static — there is no live availability lookup. Shared by the day pass
 * modal (a courtesy check before submit) and the server action (the
 * authoritative one).
 *
 *   OPEN_DAYS   [1,2,3,4,5,6]  Monday–Saturday; closed Sunday
 *   WINDOW_DAYS 30             how far ahead bookings are accepted
 *   ALLOW_SAME_DAY true        same-day booking is allowed
 */

/** 0 = Sunday. NexCore is closed Sundays. */
export const OPEN_DAYS = [1, 2, 3, 4, 5, 6];
export const WINDOW_DAYS = 30;
export const ALLOW_SAME_DAY = true;

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
 * Validate a requested date. Returns an error message, or null when the
 * date is bookable.
 */
export function validateBookingDate(date: string): string | null {
  const d = parseYmd(date);
  if (!d) return 'Choose a valid date.';

  const { min, max } = bookingWindow();
  if (date < min) return 'That date has passed. Please choose another day.';
  if (date > max) return `We take bookings up to ${WINDOW_DAYS} days ahead. Please choose a nearer day.`;
  if (!OPEN_DAYS.includes(d.getDay())) return "We're closed on Sundays. Please choose another day.";

  return null;
}
