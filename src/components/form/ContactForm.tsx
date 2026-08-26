'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitContact } from '@/app/actions';
import { idleState } from '@/lib/forms';
import { Button, ButtonLink } from '@/components/Button';
import { Input, Textarea, Select, RadioGroup, BotTrap } from './Fields';
import { site } from '@/data/site';

const REASONS = [
  'I have a question',
  'I have an idea',
  'I want to tour or join',
  'I want to partner or host an event',
  'Recognize someone',
  'Something NexCore should do',
  "I'm a member and need something",
  'Media or press',
  'Other',
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Sending…' : 'Send Message'}
    </Button>
  );
}

export function ContactForm() {
  const [state, action] = useActionState(submitContact, idleState);

  if (state.status === 'success') {
    return (
      <div
        role="status"
        className="rounded-card border border-sky/30 bg-sky/[0.07] p-8 text-center sm:p-10"
      >
        <h3 className="font-sora text-2xl font-semibold text-white">Message sent.</h3>
        <p className="mx-auto mt-3 max-w-md font-inter text-[15px] leading-relaxed text-white/70">
          Thanks for reaching out — we&rsquo;ll be in touch soon.
        </p>
        <ButtonLink href="/contact" variant="ghost" size="sm" className="mt-6">
          Send another message
        </ButtonLink>
      </div>
    );
  }

  const err = state.errors ?? {};

  return (
    <form action={action} noValidate className="relative">
      <BotTrap />

      {state.status === 'error' && state.message && (
        <p
          role="alert"
          className="mb-6 rounded-field border border-red-bright/40 bg-red/10 px-4 py-3 font-inter text-[14px] text-white"
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          name="firstName"
          label="First Name"
          required
          autoComplete="given-name"
          placeholder="Your first name"
          error={err.firstName}
        />
        <Input
          name="lastName"
          label="Last Name"
          required
          autoComplete="family-name"
          placeholder="Your last name"
          error={err.lastName}
        />
        <Input
          name="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          error={err.email}
        />
        <Input
          name="phone"
          label="Phone (optional)"
          type="tel"
          autoComplete="tel"
          placeholder="Your phone number"
          error={err.phone}
        />
        <Input
          name="business"
          label="Business Name (if applicable)"
          autoComplete="organization"
          placeholder="Your business or organization"
          className="sm:col-span-2"
          error={err.business}
        />
      </div>

      <div className="mt-6">
        <RadioGroup
          name="member"
          label="Are you a NexCore member?"
          options={['Yes', 'No', 'Considering joining']}
          error={err.member}
        />
      </div>

      <div className="mt-6 grid gap-5">
        <Select name="reason" label="Why are you reaching out today?" error={err.reason}>
          <option value="">Choose one…</option>
          {REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>

        <Textarea
          name="message"
          label="Message"
          required
          rows={6}
          placeholder="How can we help?"
          error={err.message}
        />
      </div>

      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <SubmitButton />
        <p className="font-inter text-[13px] text-white/45">
          Prefer to call?{' '}
          <a href={`tel:${site.phones[0].tel}`} className="text-sky hover:text-sky-light">
            {site.phones[0].number}
          </a>
        </p>
      </div>
    </form>
  );
}
