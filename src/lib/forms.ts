import { z } from 'zod';

/**
 * Shared form plumbing: schemas, honeypot, delivery.
 * Every schema is validated server-side; the client never decides validity.
 */

/** Honeypot field name. Hidden from users; bots that fill it are rejected. */
export const HONEYPOT = 'company_website';

/** Minimum seconds between render and submit. Faster than this reads as a bot. */
const MIN_FILL_SECONDS = 2;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => v || '');

export const baseFields = {
  [HONEYPOT]: z.string().max(0, 'Rejected.').optional().default(''),
  /** Client-rendered timestamp, used for the timing check. */
  _t: z.string().optional().default(''),
};

export const contactSchema = z.object({
  ...baseFields,
  firstName: z.string().trim().min(1, 'First name is required.').max(80),
  lastName: z.string().trim().min(1, 'Last name is required.').max(80),
  email: z.string().trim().email('Enter a valid email address.').max(160),
  phone: optionalText(40),
  business: optionalText(120),
  member: z.enum(['Yes', 'No', 'Considering joining']).optional(),
  reason: optionalText(80),
  message: z.string().trim().min(5, 'Please tell us a little more.').max(4000),
});

export const tourSchema = z.object({
  ...baseFields,
  name: z.string().trim().min(1, 'Name is required.').max(120),
  email: z.string().trim().email('Enter a valid email address.').max(160),
  phone: z.string().trim().min(7, 'Phone number is required.').max(40),
  business: optionalText(120),
  brings: optionalText(2000),
});

export const membershipSchema = z.object({
  ...baseFields,
  name: z.string().trim().min(1, 'Name is required.').max(120),
  email: z.string().trim().email('Enter a valid email address.').max(160),
  phone: optionalText(40),
  business: optionalText(120),
  tier: optionalText(80),
});

export const spaceSchema = z.object({
  ...baseFields,
  name: z.string().trim().min(1, 'Name is required.').max(120),
  email: z.string().trim().email('Enter a valid email address.').max(160),
  phone: optionalText(40),
  company: optionalText(120),
  space: optionalText(80),
  date: optionalText(20),
  start: optionalText(10),
  end: optionalText(10),
  notes: optionalText(2000),
});

export const officeSchema = z.object({
  ...baseFields,
  name: z.string().trim().min(1, 'Name is required.').max(120),
  email: z.string().trim().email('Enter a valid email address.').max(160),
  phone: optionalText(40),
  company: optionalText(120),
  office: optionalText(80),
  notes: optionalText(2000),
});

export type FormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  /** Field-level errors, keyed by field name. */
  errors?: Record<string, string>;
};

export const idleState: FormState = { status: 'idle' };

/**
 * Bot checks that run before validation.
 * Returns an error message, or null when the submission looks human.
 */
export function botCheck(data: Record<string, unknown>): string | null {
  const trap = String(data[HONEYPOT] ?? '');
  if (trap.length > 0) return 'Rejected.';

  const t = Number(data._t);
  if (Number.isFinite(t) && t > 0) {
    const elapsed = (Date.now() - t) / 1000;
    if (elapsed < MIN_FILL_SECONDS) return 'That was a little too quick — please try again.';
  }

  return null;
}

/** Flatten a ZodError into a field->message record. */
export function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? '_');
    out[key] ??= issue.message;
  }
  return out;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  );

/**
 * Deliver a submission.
 *
 * 1. Email via Resend (primary).
 * 2. Mirror to the existing Apps Script / Google Sheet when
 *    FORMS_SHEET_MIRROR_URL is set, so the historical record is preserved.
 *
 * A mirror failure never fails the submission — the email is the system of record.
 */
export async function deliver({
  subject,
  formName,
  fields,
}: {
  subject: string;
  formName: string;
  fields: Record<string, string>;
}): Promise<{ ok: boolean; error?: string }> {
  const rows = Object.entries(fields)
    .filter(([, v]) => v !== '')
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#6B7280;font:500 13px/1.5 system-ui;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td><td style="padding:6px 0;color:#0b1220;font:400 14px/1.6 system-ui">${escapeHtml(v).replace(/\n/g, '<br>')}</td></tr>`,
    )
    .join('');

  const html = `<div style="background:#f6f7f9;padding:24px"><div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;padding:28px"><p style="margin:0 0 4px;font:600 12px/1 system-ui;letter-spacing:.14em;color:#27AAE2">NEXCORE — ${escapeHtml(formName)}</p><h1 style="margin:0 0 20px;font:600 20px/1.3 system-ui;color:#001018">${escapeHtml(subject)}</h1><table style="width:100%;border-collapse:collapse">${rows}</table></div></div>`;

  const text = Object.entries(fields)
    .filter(([, v]) => v !== '')
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.FORM_TO_EMAIL;
  const from = process.env.FORM_FROM_EMAIL;

  let emailOk = false;
  let emailError: string | undefined;

  if (apiKey && to && from) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(apiKey);
      const result = await resend.emails.send({
        from: `NexCore Website <${from}>`,
        to: [to],
        replyTo: fields.Email || undefined,
        subject,
        html,
        text,
      });
      if (result.error) emailError = result.error.message;
      else emailOk = true;
    } catch (err) {
      emailError = err instanceof Error ? err.message : 'Email delivery failed.';
    }
  } else {
    emailError = 'Email is not configured (RESEND_API_KEY / FORM_TO_EMAIL / FORM_FROM_EMAIL).';
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[form:${formName}] Resend not configured. Payload:\n${text}`);
      emailOk = true; // Do not block local development.
    }
  }

  // Mirror to the existing Sheet. Best effort - never blocks the response.
  const mirror = process.env.FORMS_SHEET_MIRROR_URL;
  if (mirror) {
    try {
      await fetch(mirror, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: formName, ...fields }),
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      // Intentionally swallowed.
    }
  }

  return emailOk ? { ok: true } : { ok: false, error: emailError };
}
