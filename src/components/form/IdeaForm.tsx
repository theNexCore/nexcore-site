'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitIdea } from '@/app/actions';
import { idleState } from '@/lib/forms';
import { Button } from '@/components/Button';
import { Input, Textarea, BotTrap } from './Fields';

/**
 * Event idea submission. Posts type:"idea" to the Apps Script, which logs to
 * the Event Ideas tab and sends its own notification.
 */

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="md" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Sending…' : 'Send the idea'}
    </Button>
  );
}

export function IdeaForm() {
  const [state, action] = useActionState(submitIdea, idleState);

  if (state.status === 'success') {
    return (
      <div role="status" className="rounded-card border border-sky/30 bg-sky/[0.07] p-7">
        <h3 className="font-sora text-xl font-semibold text-white">Got it — thank you.</h3>
        <p className="mt-2 font-inter text-[15px] leading-relaxed text-white/70">
          The best events often start exactly this way. We&rsquo;ll be in touch if we want to build
          on it.
        </p>
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
          className="mb-5 rounded-field border border-red-bright/40 bg-red/10 px-4 py-3 font-inter text-[14px] text-white"
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
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
        <Textarea
          name="idea"
          label="The idea"
          required
          rows={4}
          placeholder="What should we host?"
          className="sm:col-span-2"
          error={err.idea}
        />
        <Textarea
          name="why"
          label="Why it matters (optional)"
          rows={3}
          placeholder="Who is it for, and what would it change?"
          className="sm:col-span-2"
          error={err.why}
        />
      </div>

      <div className="mt-6">
        <SubmitButton />
      </div>
    </form>
  );
}
