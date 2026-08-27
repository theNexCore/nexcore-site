import { z } from 'zod';

/**
 * Shared form plumbing: schemas, honeypot, bot checks.
 *
 * Delivery lives in lib/apps-script.ts — the Apps Script web app logs to the
 * Sheet and sends its own notification email, so there is no mail provider
 * dependency here.
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

export const ideaSchema = z.object({
  ...baseFields,
  firstName: z.string().trim().min(1, 'First name is required.').max(80),
  lastName: z.string().trim().min(1, 'Last name is required.').max(80),
  email: z.string().trim().email('Enter a valid email address.').max(160),
  phone: optionalText(40),
  idea: z.string().trim().min(3, 'Tell us the idea.').max(2000),
  why: optionalText(2000),
});

export const dayPassSchema = z.object({
  ...baseFields,
  name: z.string().trim().min(1, 'Name is required.').max(120),
  email: z.string().trim().email('Enter a valid email address.').max(160),
  phone: optionalText(40),
  business: optionalText(120),
  date: z.string().trim().min(1, 'Choose a day.').max(20),
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
