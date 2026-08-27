'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import {
  contactSchema,
  ideaSchema,
  tourSchema,
  membershipSchema,
  spaceSchema,
  officeSchema,
  botCheck,
  fieldErrors,
  type FormState,
} from '@/lib/forms';
import { postToAppsScript, type AppsScriptType } from '@/lib/apps-script';
import { check, clientIp } from '@/lib/rate-limit';
import { spaces } from '@/data/coworking';

const GENERIC_ERROR = 'Something went wrong on our end. Please try again, or call us directly.';

/**
 * Shared submission pipeline:
 *   rate limit -> bot check -> schema validation -> POST to Apps Script
 *
 * The Apps Script logs to the Sheet and sends its own notification email,
 * so there is no separate mail provider.
 */
async function handle<T extends z.ZodTypeAny>({
  schema,
  formData,
  formName,
  bucket,
  type,
  toFields,
  fallback,
  allowDeliveryFailure = false,
}: {
  schema: T;
  formData: FormData;
  formName: string;
  bucket: string;
  type: AppsScriptType;
  toFields: (data: z.infer<T>) => Record<string, string | number>;
  /** Used if the script does not recognise `type` yet. */
  fallback?: { type: AppsScriptType; toFields: (data: z.infer<T>) => Record<string, string | number> };
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

  const data = parsed.data as z.infer<T>;
  const result = await postToAppsScript(
    type,
    toFields(data),
    fallback ? { type: fallback.type, fields: fallback.toFields(data) } : undefined,
  );

  if (!result.ok) {
    console.error(`[form:${formName}] Apps Script rejected:`, result.error);
    // On a payment path, blocking checkout because OUR logging failed would
    // cost a sale. Square captures name and email, so the customer is still
    // reachable. Everything else surfaces an honest error.
    if (allowDeliveryFailure) return { status: 'success', message: 'delivery-degraded' };
    return { status: 'error', message: GENERIC_ERROR };
  }

  return { status: 'success' };
}

/* ------------------------------------------------------------------ *
 * type: "contact"
 * ------------------------------------------------------------------ */

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  return handle({
    schema: contactSchema,
    formData,
    formName: 'Contact',
    bucket: 'contact',
    type: 'contact',
    toFields: (d) => ({
      firstName: d.firstName,
      lastName: d.lastName,
      email: d.email,
      phone: d.phone,
      business: d.business,
      member: d.member ?? '',
      reason: d.reason,
      message: d.message,
    }),
  });
}

/* ------------------------------------------------------------------ *
 * type: "idea"
 * ------------------------------------------------------------------ */

export async function submitIdea(_prev: FormState, formData: FormData): Promise<FormState> {
  return handle({
    schema: ideaSchema,
    formData,
    formName: 'Event idea',
    bucket: 'idea',
    type: 'idea',
    toFields: (d) => ({
      firstName: d.firstName,
      lastName: d.lastName,
      email: d.email,
      phone: d.phone,
      idea: d.idea,
      why: d.why,
    }),
  });
}

/* ------------------------------------------------------------------ *
 * type: "space"
 * ------------------------------------------------------------------ */

/** Decimal hours between two "HH:mm" values; 0 when either is missing. */
function hoursBetween(start: string, end: string): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  if ([sh, sm, eh, em].some((n) => Number.isNaN(n))) return 0;
  const mins = eh * 60 + em - (sh * 60 + sm);
  return mins > 0 ? Math.round((mins / 60) * 100) / 100 : 0;
}

export async function submitSpace(_prev: FormState, formData: FormData): Promise<FormState> {
  return handle({
    schema: spaceSchema,
    formData,
    formName: 'Space reservation request',
    bucket: 'space',
    type: 'space',
    toFields: (d) => {
      const hours = hoursBetween(d.start, d.end);
      const match = spaces.find((s) => s.name === d.space);
      return {
        name: d.name,
        company: d.company,
        email: d.email,
        phone: d.phone,
        space: d.space,
        date: d.date,
        start: d.start,
        end: d.end,
        hours,
        estPublic: match ? Math.round(match.rate * hours * 100) / 100 : 0,
        estMember: match?.member ? Math.round(match.member * hours * 100) / 100 : 0,
        notes: d.notes,
      };
    },
  });
}

/* ------------------------------------------------------------------ *
 * Tour, membership and office
 *
 * These send their own type first. If the script has not been taught it yet
 * it answers with its unknown-type error, and lib/apps-script retries as
 * `contact` with the specifics carried in `reason` and `message`.
 *
 * That means this works either side of the script being updated, with no
 * coordinated deploy and no lead dropped in between. Once the script handles
 * these natively, the fallback simply stops firing — nothing here changes.
 * ------------------------------------------------------------------ */

const splitName = (full: string) => {
  const parts = full.trim().split(/\s+/);
  return { firstName: parts[0] ?? '', lastName: parts.slice(1).join(' ') };
};

export async function submitTour(_prev: FormState, formData: FormData): Promise<FormState> {
  return handle({
    schema: tourSchema,
    formData,
    formName: 'Tour request',
    bucket: 'tour',
    type: 'tour',
    toFields: (d) => ({
      name: d.name,
      email: d.email,
      phone: d.phone,
      business: d.business,
      brings: d.brings,
    }),
    fallback: {
      type: 'contact',
      toFields: (d) => ({
        ...splitName(d.name),
        email: d.email,
        phone: d.phone,
        business: d.business,
        member: 'Considering joining',
        reason: 'I want to tour or join',
        message: `TOUR REQUEST\n\nWhat brings you to NexCore: ${d.brings || '(not given)'}`,
      }),
    },
  });
}

export async function submitMembership(_prev: FormState, formData: FormData): Promise<FormState> {
  return handle({
    schema: membershipSchema,
    formData,
    formName: 'Membership enquiry',
    bucket: 'membership',
    type: 'membership',
    allowDeliveryFailure: true,
    toFields: (d) => ({
      name: d.name,
      email: d.email,
      phone: d.phone,
      business: d.business,
      tier: d.tier,
    }),
    fallback: {
      type: 'contact',
      toFields: (d) => ({
        ...splitName(d.name),
        email: d.email,
        phone: d.phone,
        business: d.business,
        member: 'Considering joining',
        reason: 'I want to tour or join',
        message: `MEMBERSHIP ENQUIRY\n\nTier: ${d.tier || '(not given)'}\nNext step: $50 deposit via Square.`,
      }),
    },
  });
}

export async function submitOffice(_prev: FormState, formData: FormData): Promise<FormState> {
  return handle({
    schema: officeSchema,
    formData,
    formName: 'Office enquiry',
    bucket: 'office',
    type: 'office',
    toFields: (d) => ({
      name: d.name,
      company: d.company,
      email: d.email,
      phone: d.phone,
      office: d.office,
      notes: d.notes,
    }),
    fallback: {
      type: 'contact',
      toFields: (d) => ({
        ...splitName(d.name),
        email: d.email,
        phone: d.phone,
        business: d.company,
        member: 'Considering joining',
        reason: 'I want to tour or join',
        message: `PRIVATE OFFICE ENQUIRY\n\nOffice: ${d.office || '(not specified)'}\n\nNotes: ${d.notes || '(none)'}`,
      }),
    },
  });
}
