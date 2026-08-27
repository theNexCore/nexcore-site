'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { DayPassModal } from './form/DayPassModal';
import { dayPass } from '@/data/memberships';
import { site } from '@/data/site';
import { Eyebrow } from './Section';

/**
 * Day pass block. The button opens the two-step modal — details and chosen
 * day first, then the $25 Square popup — rather than jumping straight to
 * checkout, which left no record of anyone who abandoned payment.
 */
export function DayPassCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="grid items-center gap-10 rounded-card border border-white/10 bg-ink-lift p-8 md:grid-cols-2 md:p-12">
        <div>
          <Eyebrow>DAY PASS</Eyebrow>
          <h2 className="font-sora text-h2xs font-semibold text-white">Pick your day.</h2>
          <p className="mt-5 font-inter text-[16px] leading-relaxed text-white/70">
            {dayPass.blurb}
          </p>
          <p className="mt-6">
            <span className="font-sora text-[44px] font-semibold leading-none text-sky">
              {dayPass.priceLabel}
            </span>
            <span className="ml-2 font-inter text-[15px] text-white/50">per day</span>
          </p>
          <dl className="mt-6 space-y-1 font-inter text-[14px] text-white/55">
            <dt className="font-semibold text-white/70">Open Hours</dt>
            {site.hours.map((h) => (
              <dd key={h.days}>
                {h.days} {h.time}
              </dd>
            ))}
          </dl>
        </div>

        <div className="rounded-card border border-white/10 bg-ink p-7">
          <p className="font-inter text-[15px] leading-relaxed text-white/70">
            Choose your day and tell us who you are. Payment then opens in a secure Square window —
            this page stays right here.
          </p>
          <Button onClick={() => setOpen(true)} size="lg" className="mt-6 w-full">
            Buy a Day Pass
          </Button>
          <p className="mt-4 font-inter text-[13px] text-white/40">
            Questions first?{' '}
            <Link href="/contact" className="text-sky hover:text-sky-light">
              Get in touch
            </Link>
            .
          </p>
        </div>
      </div>

      <DayPassModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
