'use client';

import { useState } from 'react';
import { tiers } from '@/data/memberships';
import { cn } from '@/lib/cn';
import { Button, ButtonLink } from './Button';
import { MembershipModal } from './form/MembershipModal';

/**
 * Membership cards. Each CTA opens the two-step join modal pre-set to that
 * tier — details first, deposit second — matching the old site's
 * #join-virtual / #join-nexcore / #join-founding anchors.
 */
export function MembershipTiers() {
  const [openTier, setOpenTier] = useState<string | null>(null);

  return (
    <>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.id}
            className={cn(
              'relative flex flex-col rounded-card border p-8',
              t.featured
                ? 'border-sky/60 bg-sky/[0.06] lg:-my-4 lg:pt-12'
                : 'border-white/10 bg-ink',
            )}
          >
            {t.badge && (
              <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-pill border border-sky/50 bg-ink-deep px-4 py-1.5 font-inter text-[11px] font-semibold tracking-[0.16em] text-sky">
                FOUNDING MEMBER
              </span>
            )}

            <div className="border-b border-white/10 pb-6">
              <h3 className="font-sora text-xl font-semibold text-white">{t.name}</h3>
              <p className="mt-4">
                <span className="font-sora text-[42px] font-semibold leading-none text-white">
                  {t.priceLabel}
                </span>
                <span className="ml-1 font-inter text-[16px] text-white/50">{t.cadence}</span>
              </p>
              {t.badge && (
                <>
                  <p className="mt-3 font-inter text-[13px] font-bold tracking-[0.16em] text-sky">
                    LIMITED AVAILABILITY
                  </p>
                  <p className="mt-2 font-inter text-[14px] font-semibold leading-relaxed text-red">
                    Once all founding spots are filled, this price is gone for good.
                  </p>
                </>
              )}
              <p className="mt-4 font-inter text-[15px] leading-relaxed text-white/70">{t.blurb}</p>
            </div>

            <div className="flex-1 py-6">
              <p className="font-inter text-[12px] font-semibold tracking-[0.15em] text-white/50">
                {t.includesLabel.toUpperCase() === t.includesLabel
                  ? t.includesLabel
                  : t.includesLabel}
              </p>
              <ul className="mt-4 space-y-3">
                {t.includes.map((i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 font-inter text-[15px] leading-relaxed text-white/80"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-sky"
                    />
                    {i}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              onClick={() => setOpenTier(t.id)}
              variant={t.featured ? 'primary' : 'ghost'}
              className="w-full"
            >
              {t.cta.label}
            </Button>
          </div>
        ))}
      </div>

      <p className="mt-12 text-center font-inter text-[15px] text-white/50">
        All memberships are month-to-month.
      </p>

      {/* Ready to Experience NexCore? */}
      <div className="mt-16 border-t border-white/10 pt-12 text-center">
        <h3 className="font-sora text-h2xs font-semibold text-white">
          Ready to Experience NexCore?
        </h3>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <ButtonLink href="#tour" size="lg" className="min-w-[250px]">
            Schedule a Tour
          </ButtonLink>
          <Button
            onClick={() => setOpenTier('founding')}
            variant="ghost"
            size="lg"
            className="min-w-[250px]"
          >
            Become a Member
          </Button>
        </div>
      </div>

      <MembershipModal openTier={openTier} onClose={() => setOpenTier(null)} />
    </>
  );
}
