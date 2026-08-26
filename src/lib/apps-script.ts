import 'server-only';

/**
 * Server-side bridge to the NexCore Apps Script web app.
 *
 * The same /exec URL the events feed reads from also accepts POSTs. The
 * script logs to the Google Sheet and sends its own notification email via
 * MailApp, so no separate mail provider is involved.
 *
 * This module is server-only: the endpoint URL must never reach client code,
 * or anyone could write rows into the Sheet directly.
 *
 * VERIFIED 2026-08-26 — the script accepts exactly three type values:
 *   contact, idea, space
 * Anything else falls through to its default branch and returns
 * {"ok":false,"error":"RSVP submissions are no longer accepted here."}
 * That is why tour/membership/office are mapped onto `contact` below.
 */

const ENDPOINT =
  process.env.APPS_SCRIPT_URL ??
  process.env.EVENTS_FEED_URL ??
  'https://script.google.com/macros/s/AKfycbxdRxfYdYe9QErC8UfjaI-nnqFYnjuP4YDWkEAN9rwE9SvILVIjrFIVhgNeXG3YT_jY/exec';

const TIMEOUT_MS = 15_000;

export type AppsScriptType = 'contact' | 'idea' | 'space';

export interface AppsScriptResult {
  ok: boolean;
  error?: string;
}

/**
 * POST a typed payload. Returns ok only when the script itself confirms it —
 * the endpoint answers HTTP 200 even when it refuses a write, so the body is
 * what matters, not the status code.
 */
export async function postToAppsScript(
  type: AppsScriptType,
  fields: Record<string, string | number>,
): Promise<AppsScriptResult> {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      // text/plain matches how the previous site posted and avoids a
      // preflight; Apps Script parses the body either way.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ type, ...fields }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });

    const body = await res.text();

    if (!res.ok) {
      return { ok: false, error: `Apps Script returned HTTP ${res.status}` };
    }

    try {
      const parsed = JSON.parse(body) as AppsScriptResult;
      if (parsed.ok) return { ok: true };
      return { ok: false, error: parsed.error ?? 'Apps Script rejected the submission' };
    } catch {
      return { ok: false, error: `Apps Script returned non-JSON: ${body.slice(0, 120)}` };
    }
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.name === 'TimeoutError'
          ? `Apps Script timed out after ${TIMEOUT_MS}ms`
          : err.message
        : 'Apps Script unreachable';
    return { ok: false, error: msg };
  }
}
