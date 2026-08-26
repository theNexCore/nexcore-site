'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import {
  contactSchema,
  tourSchema,
  membershipSchema,
  spaceSchema,
  officeSchema,
  botCheck,
  fieldErrors,
  deliver,
  type FormState,
} from '@/lib/forms';
import { check, clientIp } from '@/lib/rate-limit';

const GENERIC_ERROR = 'Something went wrong on our end. Please try again, or call us directly.';

/**
 * Shared submission pipeline:
 *   rate limit -> bot check -> schema validation -> deliver
 */
async function handle<T extends z.ZodTypeAny>({
  schema,
  formData,
  formName,
  bucket,
  subject,
  toFields,
}: {
  schema: T;
  formData: FormData;
  formName: string;
  bucket: string;
  subject: (data: z.infer<T>) => string;
  toFields: (data: z.infer<T>) => Record<string, string>;
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
  const result = await deliver({
    subject: subject(data),
    formName,
    fields: toFields(data),
  });

  if (!result.ok) {
    console.error(`[form:${formName}] delivery failed:`, result.error);
    return { status: 'error', message: GENERIC_ERROR };
  }

  return { status: 'success' };
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  return handle({
    schema: contactSchema,
    formData,
    formName: 'Contact',
    bucket: 'contact',
    subject: (d) => `Contact form — ${d.firstName} ${d.lastName}`,
    toFields: (d) => ({
      Name: `${d.firstName} ${d.lastName}`,
      Email: d.email,
      Phone: d.phone,
      Business: d.business,
      'NexCore member': d.member ?? '',
      'Reason for reaching out': d.reason,
      Message: d.message,
    }),
  });
}

export async function submitTour(_prev: FormState, formData: FormData): Promise<FormState> {
  return handle({
    schema: tourSchema,
    formData,
    formName: 'Tour request',
    bucket: 'tour',
    subject: (d) => `Tour request — ${d.name}`,
    toFields: (d) => ({
      Name: d.name,
      Email: d.email,
      Phone: d.phone,
      Business: d.business,
      'What brings you to NexCore': d.brings,
    }),
  });
}

export async function submitMembership(_prev: FormState, formData: FormData): Promise<FormState> {
  return handle({
    schema: membershipSchema,
    formData,
    formName: 'Membership enquiry',
    bucket: 'membership',
    subject: (d) => `Membership enquiry — ${d.name}`,
    toFields: (d) => ({
      Name: d.name,
      Email: d.email,
      Phone: d.phone,
      Business: d.business,
      'Membership tier': d.tier,
    }),
  });
}

export async function submitSpace(_prev: FormState, formData: FormData): Promise<FormState> {
  return handle({
    schema: spaceSchema,
    formData,
    formName: 'Space reservation request',
    bucket: 'space',
    subject: (d) => `Space request — ${d.space || 'unspecified'} — ${d.name}`,
    toFields: (d) => ({
      Name: d.name,
      Email: d.email,
      Phone: d.phone,
      Company: d.company,
      Space: d.space,
      Date: d.date,
      'Start time': d.start,
      'End time': d.end,
      Notes: d.notes,
    }),
  });
}

export async function submitOffice(_prev: FormState, formData: FormData): Promise<FormState> {
  return handle({
    schema: officeSchema,
    formData,
    formName: 'Office enquiry',
    bucket: 'office',
    subject: (d) => `Office enquiry — ${d.office || 'unspecified'} — ${d.name}`,
    toFields: (d) => ({
      Name: d.name,
      Email: d.email,
      Phone: d.phone,
      Company: d.company,
      Office: d.office,
      Notes: d.notes,
    }),
  });
}
