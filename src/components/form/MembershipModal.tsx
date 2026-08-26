'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitMembership } from '@/app/actions';
import { idleState } from '@/lib/forms';
import { Button } from '@/components/Button';
import { Input, BotTrap } from './Fields';
import { tiers, foundingDeposit } from '@/data/memberships';
import { cn } from '@/lib/cn';

/**
 * Two-step membership join, matching the old Weebly modal.
 *
 * STEP 1 captures the lead — name, business, email, phone — and submits it
 * through the normal server action (validation, honeypot, rate limit, Resend
 * + Sheet mirror). This has to happen BEFORE payment: previously the tier
 * buttons went straight to Square, so anyone who abandoned checkout was lost
 * entirely.
 *
 * STEP 2 opens the $50 deposit in a Square popup. All three tiers take the
 * same deposit, applied to the first month — that is how the old site worked,
 * and there is only one membership payment link.
 */

const SQUARE_POPUP = 'width=480,height=820,scrollbars=yes,resizable=yes';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="md" disabled={pending} className="w-full">
      {pending ? 'Sending…' : 'Continue to Deposit'}
    </Button>
  );
}

export function MembershipModal({
  openTier,
  onClose,
}: {
  openTier: string | null;
  onClose: () => void;
}) {
  const [state, action] = useActionState(submitMembership, idleState);
  const dialogRef = useRef<HTMLDivElement>(null);
  const tier = tiers.find((t) => t.id === openTier);

  const openSquare = useCallback(() => {
    const w = window.open(foundingDeposit.checkoutUrl, 'nexcore-square-checkout', SQUARE_POPUP);
    if (w) w.focus();
    else window.open(foundingDeposit.checkoutUrl, '_blank', 'noopener,noreferrer');
  }, []);

  // Escape to close, and lock the page behind the dialog.
  useEffect(() => {
    if (!openTier) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openTier, onClose]);

  if (!openTier || !tier) return null;

  const err = state.errors ?? {};
  const captured = state.status === 'success';

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ncmm-title"
        tabIndex={-1}
        className="relative max-h-[92dvh] w-full max-w-modal overflow-y-auto rounded-card border border-sky/35 bg-ink p-7 shadow-2xl outline-none sm:p-9"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <span aria-hidden="true" className="text-2xl leading-none">
            &times;
          </span>
        </button>

        {/* Step indicator */}
        <ol className="mb-6 flex items-center gap-3 font-inter text-[12px] font-semibold tracking-[0.12em]">
          {['1 YOUR DETAILS', '2 DEPOSIT'].map((label, i) => (
            <li
              key={label}
              className={cn(
                'rounded-pill px-3 py-1',
                (i === 0 && !captured) || (i === 1 && captured)
                  ? 'bg-sky/15 text-sky'
                  : 'text-white/35',
              )}
            >
              {label}
            </li>
          ))}
        </ol>

        {!captured ? (
          <>
            <h2 id="ncmm-title" className="font-sora text-2xl font-semibold text-white">
              Let&rsquo;s get you started.
            </h2>
            <p className="mt-2 font-inter text-[15px] leading-relaxed text-white/65">
              {tier.name} — {tier.priceLabel}
              {tier.cadence}. Tell us who you are and we&rsquo;ll take it from there.
            </p>

            <form action={action} noValidate className="relative mt-7">
              <BotTrap />
              {/* Carries the chosen tier through to the notification email. */}
              <input type="hidden" name="tier" value={`${tier.name} — ${tier.priceLabel}${tier.cadence}`} />

              {state.status === 'error' && state.message && (
                <p
                  role="alert"
                  className="mb-5 rounded-field border border-red-bright/40 bg-red/10 px-4 py-3 font-inter text-[14px] text-white"
                >
                  {state.message}
                </p>
              )}

              <div className="grid gap-4">
                <Input
                  name="name"
                  label="Name"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  error={err.name}
                />
                <Input
                  name="business"
                  label="Business"
                  autoComplete="organization"
                  placeholder="Your business or organization"
                  error={err.business}
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
                  label="Phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Your phone number"
                  error={err.phone}
                />
              </div>

              <div className="mt-6">
                <SubmitButton />
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 id="ncmm-title" className="font-sora text-2xl font-semibold text-white">
              Welcome to NexCore.
            </h2>
            <p className="mt-3 font-inter text-[15px] leading-relaxed text-white/70">
              A <strong className="text-white">{foundingDeposit.label}</strong> holds your spot and
              gets applied to your first month. Payment opens in a secure Square window — this page
              stays right here.
            </p>

            <Button onClick={openSquare} size="lg" className="mt-7 w-full">
              Pay Deposit
            </Button>

            <p className="mt-4 font-inter text-[13px] leading-relaxed text-white/45">
              We&rsquo;ve got your details either way — if you&rsquo;d rather pay later, we&rsquo;ll
              follow up.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
