'use client';

import { useActionState, useCallback, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitDayPass } from '@/app/actions';
import { idleState } from '@/lib/forms';
import { Button } from '@/components/Button';
import { Input, BotTrap } from './Fields';
import { dayPass } from '@/data/memberships';
import { site } from '@/data/site';
import { cn } from '@/lib/cn';

/**
 * Two-step day pass, matching the old Weebly ncdm modal.
 *
 * STEP 1 "Your Day" — pick a date and give contact details.
 * STEP 2 "Payment"  — $25 opens in a Square popup.
 *
 * The button previously went straight to Square, so anyone who abandoned
 * checkout left no trace. Capture happens first now, as it did before.
 */

const SQUARE_POPUP = 'width=480,height=820,scrollbars=yes,resizable=yes';

interface Rules { busy: string[]; min: string; max: string; openDays: number[] }

/** Parse "YYYY-MM-DD" as a local date, avoiding the UTC off-by-one. */
function parseYmd(s: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
}

/** Mirrors the server check so people find out before they submit. */
function dateProblem(value: string, rules: Rules | null): string | null {
  if (!value || !rules) return null;
  const d = parseYmd(value);
  if (!d) return null;
  if (value < rules.min) return 'That date has passed. Please choose another day.';
  if (value > rules.max) return 'We take bookings up to 30 days ahead. Please choose a nearer day.';
  if (!rules.openDays.includes(d.getDay())) return "We're closed on Sundays. Please choose another day.";
  if (rules.busy.includes(value)) return 'That day is fully booked. Please choose another.';
  return null;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="md" disabled={pending} className="w-full">
      {pending ? 'Sending…' : 'Continue to Payment'}
    </Button>
  );
}

export function DayPassModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [state, action] = useActionState(submitDayPass, idleState);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [rules, setRules] = useState<Rules | null>(null);
  const [chosen, setChosen] = useState('');

  // Booking rules come from /api/availability so the Apps Script URL stays
  // server-side. A failure leaves rules null — the server still validates.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch('/api/availability')
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setRules(d as Rules);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open]);

  const openSquare = useCallback(() => {
    const w = window.open(dayPass.checkoutUrl, 'nexcore-square-checkout', SQUARE_POPUP);
    if (w) w.focus();
    else window.open(dayPass.checkoutUrl, '_blank', 'noopener,noreferrer');
  }, []);

  useEffect(() => {
    if (!open) return;
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
  }, [open, onClose]);

  if (!open) return null;

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
        aria-labelledby="ncdm-title"
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

        <ol className="mb-6 flex items-center gap-3 font-inter text-[12px] font-semibold tracking-[0.12em]">
          {['1 YOUR DAY', '2 PAYMENT'].map((label, i) => (
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
            <h2 id="ncdm-title" className="font-sora text-2xl font-semibold text-white">
              Pick your day.
            </h2>

            <form action={action} noValidate className="relative mt-6">
              <BotTrap />

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
                  name="date"
                  label="Choose a day"
                  type="date"
                  required
                  min={rules?.min}
                  max={rules?.max}
                  value={chosen}
                  onChange={(e) => setChosen(e.target.value)}
                  error={err.date ?? dateProblem(chosen, rules) ?? undefined}
                />

                <div className="rounded-field border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="font-inter text-[12px] font-semibold tracking-[0.1em] text-white/45">
                    OPEN HOURS
                  </p>
                  {site.hours.map((h) => (
                    <p key={h.days} className="mt-1 font-inter text-[14px] text-white/70">
                      {h.days} {h.time}
                    </p>
                  ))}
                  <p className="mt-2 font-inter text-[13px] text-white/45">
                    Closed Sundays. Bookings up to 30 days ahead.
                  </p>
                </div>

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
            <h2 id="ncdm-title" className="font-sora text-2xl font-semibold text-white">
              You&rsquo;re all set.
            </h2>
            <p className="mt-3 font-inter text-[15px] leading-relaxed text-white/70">
              Your day pass is <strong className="text-white">{dayPass.priceLabel}</strong>. Payment
              opens in a secure Square window — this page stays right here.
            </p>

            <Button onClick={openSquare} size="lg" className="mt-7 w-full">
              Pay {dayPass.priceLabel}
            </Button>

            <p className="mt-4 font-inter text-[13px] leading-relaxed text-white/45">
              Once Square confirms your payment, come back to this window and finish up.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
