import { NextResponse } from 'next/server';
import { getAvailability } from '@/lib/availability';

/**
 * Booking rules for the browser: blocked dates, the bookable window, and
 * which weekdays are open.
 *
 * This exists so the client never sees the Apps Script URL. It returns only
 * derived rules — no endpoint, no credentials — and is disallowed in
 * robots.txt because it is machinery, not a page.
 */

export const dynamic = 'force-dynamic';

export async function GET() {
  const { busy, min, max, openDays, error } = await getAvailability();

  if (error) {
    // Log for us; the caller still gets usable rules and degrades to
    // weekday/window checks rather than being blocked from booking.
    console.error('[availability]', error);
  }

  return NextResponse.json(
    { busy, min, max, openDays, degraded: Boolean(error) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
