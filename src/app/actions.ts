'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import {
  contactSchema,
  ideaSchema,
  dayPassSchema,
  tourSchema,
  membershipSchema,
  spaceSchema,
  officeSchema,
  botCheck,
  fieldErrors,
  ONBOARD_SPECIFIC,
  type FormState,
} from '@/lib/forms';
import { postToFormspree } from '@/lib/formspree';
import { check, clientIp } from '@/lib/rate-limit';
import { validateBookingDate } from '@/lib/booking-rules';

const GENERIC_ERROR = 'Something went wrong on our end. Please try again, or call us directly.';

/**
 * Shared submission pipeline:
 *   rate limit -> bot check -> schema validation -> POST to Formspree
 *
 * Every form posts to the same Formspree form; `subject` tells them apart
 * in the inbox.
 */
async function handle<T extends z.ZodTypeAny>({
  schema,
  formData,
  subject,
  bucket,
  toFields,
  allowDeliveryFailure = false,
}: {
  schema: T;
  formData: FormData;
  /** Email subject, and the label used in logs. */
  subject: string;
  bucket: string;
  toFields: (data: z.infer<T>) => Record<string, string | number | boolean>;
  /** Payment paths proceed even if lead capture failed. */
  allowDeliveryFailure?: boolean;
}): Promise<FormState> {
  const raw = Object.fromEntries(formData) as Record<string, unknown>;

  const ip = clientIp(await headers());
  const limited = check(`${bucket}:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!limited.ok) {
    return {
      status: 'error',
      message: `Too many submissions. Please wait about ${Math.ceil(limited.retryAfterSeconds / 60)} minute(s) and try again.`,
    };
  }

  const bot = botCheck(raw);
  if (bot) {
    // Honeypot hits get a success-shaped reply so bots learn nothing.
    if (bot === 'Rejected.') return { status: 'success', message: 'Thanks — we got it.' };
    return { status: 'error', message: bot };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Please check the highlighted fields.',
      errors: fieldErrors(parsed.error),
    };
  }

  const result = await postToFormspree(subject, toFields(parsed.data as z.infer<T>));

  if (!result.ok) {
    console.error(`[form:${subject}] Formspree rejected:`, result.error);
    // On a payment path, blocking checkout because OUR logging failed would
    // cost a sale. Square captures name and email, so the customer is still
    // reachable. Everything else surfaces an honest error.
    if (allowDeliveryFailure) return { status: 'success', message: 'delivery-degraded' };
    return { status: 'error', message: GENERIC_ERROR };
  }

  return { status: 'success' };
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  return handle({
    schema: contactSchema,
    formData,
    subject: 'Contact',
    bucket: 'contact',
    toFields: (d) => ({
      firstName: d.firstName,
      lastName: d.lastName,
      email: d.email,
      phone: d.phone,
      smsConsent: d.smsConsent,
      business: d.business,
      member: d.member ?? '',
      reason: d.reason,
      message: d.message,
    }),
  });
}

export async function submitIdea(_prev: FormState, formData: FormData): Promise<FormState> {
  return handle({
    schema: ideaSchema,
    formData,
    subject: 'Event idea',
    bucket: 'idea',
    toFields: (d) => ({
      firstName: d.firstName,
      lastName: d.lastName,
      email: d.email,
      phone: d.phone,
      smsConsent: d.smsConsent,
      idea: d.idea,
      why: d.why,
    }),
  });
}

/** "2026-10-05T14:30" -> "Mon, Oct 5, 2026, 2:30 PM". Falls back to the raw value. */
function formatOnboardAt(value: string): string {
  const d = new Date(`${value}:00Z`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC', // the value carries no zone; format it exactly as entered
  });
}

export async function submitSpace(_prev: FormState, formData: FormData): Promise<FormState> {
  return handle({
    schema: spaceSchema,
    formData,
    subject: 'Space booking request',
    bucket: 'space',
    toFields: (d) => ({
      name: d.name,
      email: d.email,
      phone: d.phone,
      smsConsent: d.smsConsent,
      space: d.space,
      onboard: d.onboard === ONBOARD_SPECIFIC ? formatOnboardAt(d.onboardAt) : d.onboard,
      message: d.message,
    }),
  });
}

export async function submitTour(_prev: FormState, formData: FormData): Promise<FormState> {
  return handle({
    schema: tourSchema,
    formData,
    subject: 'Tour request',
    bucket: 'tour',
    toFields: (d) => ({
      name: d.name,
      email: d.email,
      phone: d.phone,
      smsConsent: d.smsConsent,
      business: d.business,
      brings: d.brings,
    }),
  });
}

export async function submitMembership(_prev: FormState, formData: FormData): Promise<FormState> {
  return handle({
    schema: membershipSchema,
    formData,
    subject: 'Membership signup',
    bucket: 'membership',
    allowDeliveryFailure: true,
    toFields: (d) => ({
      name: d.name,
      email: d.email,
      phone: d.phone,
      smsConsent: d.smsConsent,
      business: d.business,
      tier: d.tier,
    }),
  });
}

export async function submitDayPass(_prev: FormState, formData: FormData): Promise<FormState> {
  // Authoritative date check — the browser's version is a courtesy only.
  const requested = String(formData.get('date') ?? '');
  if (requested) {
    const problem = validateBookingDate(requested);
    if (problem) {
      return { status: 'error', errors: { date: problem } };
    }
  }

  return handle({
    schema: dayPassSchema,
    formData,
    subject: 'Day pass',
    bucket: 'daypass',
    // Payment path: never block checkout because our own logging failed.
    allowDeliveryFailure: true,
    toFields: (d) => ({
      name: d.name,
      email: d.email,
      phone: d.phone,
      smsConsent: d.smsConsent,
      business: d.business,
      date: d.date,
    }),
  });
}

export async function submitOffice(_prev: FormState, formData: FormData): Promise<FormState> {
  return handle({
    schema: officeSchema,
    formData,
    subject: 'Office enquiry',
    bucket: 'office',
    toFields: (d) => ({
      name: d.name,
      company: d.company,
      email: d.email,
      phone: d.phone,
      smsConsent: d.smsConsent,
      office: d.office,
      notes: d.notes,
    }),
  });
}
