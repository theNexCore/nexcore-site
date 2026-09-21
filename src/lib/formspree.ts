import 'server-only';

/**
 * Server-side delivery to Formspree.
 *
 * Every form on the site posts to the one form below. `_subject` names the
 * form in the notification email, and `email` becomes its reply-to, so
 * enquiries can be answered straight from the inbox.
 *
 * Submissions go server-side (from the server actions) rather than from the
 * browser, so validation, the honeypot and rate limiting all run first.
 * Formspree only confirms a write with a 2xx and {"ok":true}.
 */

const ENDPOINT = 'https://formspree.io/f/xppwdpzl';

const TIMEOUT_MS = 15_000;

export interface FormspreeResult {
  ok: boolean;
  error?: string;
}

export async function postToFormspree(
  subject: string,
  fields: Record<string, string | number | boolean>,
): Promise<FormspreeResult> {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _subject: subject, ...fields }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });

    const body = await res.text();
    let parsed: { ok?: boolean; error?: string; errors?: { message?: string }[] } = {};
    try {
      parsed = JSON.parse(body);
    } catch {
      return { ok: false, error: `Formspree returned non-JSON (HTTP ${res.status}): ${body.slice(0, 120)}` };
    }

    if (res.ok && parsed.ok !== false) return { ok: true };
    const detail = parsed.errors?.map((e) => e.message).filter(Boolean).join('; ') || parsed.error;
    return { ok: false, error: `Formspree HTTP ${res.status}${detail ? `: ${detail}` : ''}` };
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.name === 'TimeoutError'
          ? `Formspree timed out after ${TIMEOUT_MS}ms`
          : err.message
        : 'Formspree unreachable';
    return { ok: false, error: msg };
  }
}
