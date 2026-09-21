'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitTour, submitMembership, submitOffice, submitSpace } from '@/app/actions';
import { idleState, ONBOARD_ASAP, ONBOARD_SPECIFIC, type FormState } from '@/lib/forms';
import { Button } from '@/components/Button';
import { Input, Textarea, Select, RadioGroup, BotTrap, SmsConsent } from './Fields';

type Kind = 'tour' | 'membership' | 'office' | 'space';

const actions: Record<Kind, (s: FormState, f: FormData) => Promise<FormState>> = {
  tour: submitTour,
  membership: submitMembership,
  office: submitOffice,
  space: submitSpace,
};

const successCopy: Record<Kind, { title: string; body: string }> = {
  tour: {
    title: "You're on the calendar.",
    body: "We'll be in touch shortly to confirm a time that works for you.",
  },
  membership: {
    title: 'Welcome to NexCore.',
    body: "Thanks — we'll reach out with next steps for your membership.",
  },
  office: {
    title: "We've got it.",
    body: "Thanks — we'll follow up about the office you're interested in.",
  },
  space: {
    title: "You're all set.",
    body: "Thanks — we'll confirm availability and get right back to you.",
  },
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="md" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Sending…' : label}
    </Button>
  );
}

export function InquiryForm({
  kind,
  submitLabel,
  options,
  defaultOption,
}: {
  kind: Kind;
  submitLabel: string;
  /** Choices for the tier / office / space selector. */
  options?: { value: string; label: string }[];
  defaultOption?: string;
}) {
  const [state, action] = useActionState(actions[kind], idleState);
  const [onboard, setOnboard] = useState('');

  if (state.status === 'success') {
    const copy = successCopy[kind];
    return (
      <div
        role="status"
        className="rounded-card border border-sky/30 bg-sky/[0.07] p-7 text-center"
      >
        <h3 className="font-sora text-xl font-semibold text-white">{copy.title}</h3>
        <p className="mt-2 font-inter text-[15px] leading-relaxed text-white/70">{copy.body}</p>
      </div>
    );
  }

  const err = state.errors ?? {};
  const selectName = kind === 'membership' ? 'tier' : kind === 'office' ? 'office' : 'space';
  const selectLabel =
    kind === 'membership' ? 'Membership' : kind === 'office' ? 'Office' : 'Space';

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
          name="name"
          label="Name"
          required
          autoComplete="name"
          placeholder="Your name"
          error={err.name}
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
          label={kind === 'tour' ? 'Phone' : 'Phone (optional)'}
          type="tel"
          required={kind === 'tour'}
          autoComplete="tel"
          placeholder="Your phone number"
          error={err.phone}
        />
        {kind !== 'space' && (
          <Input
            name={kind === 'office' ? 'company' : 'business'}
            label="Business (optional)"
            autoComplete="organization"
            placeholder="Your business or organization"
            error={err.business ?? err.company}
          />
        )}
        {/* Full width, so it sits directly under the phone field on mobile and
            spans the phone/business row on desktop. */}
        <SmsConsent className="sm:col-span-2" />

        {options && options.length > 0 && (
          <Select
            name={selectName}
            label={selectLabel}
            defaultValue={defaultOption}
            className="sm:col-span-2"
            error={err[selectName]}
          >
            <option value="">Choose one…</option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        )}

        {kind === 'space' && (
          <>
            <div className="sm:col-span-2">
              <RadioGroup
                name="onboard"
                label="When would you like to onboard?"
                options={[ONBOARD_ASAP, ONBOARD_SPECIFIC]}
                error={err.onboard}
                onValueChange={setOnboard}
              />
            </div>
            {onboard === ONBOARD_SPECIFIC && (
              <Input
                name="onboardAt"
                label="Date and time"
                type="datetime-local"
                required
                className="sm:col-span-2"
                error={err.onboardAt}
              />
            )}
            <Textarea
              name="message"
              label="Message (optional)"
              rows={4}
              className="sm:col-span-2"
              error={err.message}
            />
          </>
        )}

        {kind === 'tour' && (
          <Textarea
            name="brings"
            label="What brings you to NexCore? (optional)"
            rows={4}
            className="sm:col-span-2"
            error={err.brings}
          />
        )}

        {kind === 'office' && (
          <Textarea
            name="notes"
            label="Notes (optional)"
            rows={4}
            className="sm:col-span-2"
            error={err.notes}
          />
        )}
      </div>

      <div className="mt-6">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
