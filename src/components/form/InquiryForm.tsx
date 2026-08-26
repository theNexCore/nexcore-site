'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitTour, submitMembership, submitOffice, submitSpace } from '@/app/actions';
import { idleState, type FormState } from '@/lib/forms';
import { Button } from '@/components/Button';
import { Input, Textarea, Select, BotTrap } from './Fields';

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
        <Input
          name={kind === 'office' || kind === 'space' ? 'company' : 'business'}
          label="Business (optional)"
          autoComplete="organization"
          placeholder="Your business or organization"
          error={err.business ?? err.company}
        />

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
            <Input name="date" label="Date" type="date" className="sm:col-span-2" error={err.date} />
            <Input name="start" label="Start time" type="time" error={err.start} />
            <Input name="end" label="End time" type="time" error={err.end} />
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

        {(kind === 'office' || kind === 'space') && (
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
