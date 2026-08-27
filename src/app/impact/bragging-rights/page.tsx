import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { ButtonLink } from '@/components/Button';
import { statGroups, headlineStat } from '@/data/impact';

export const metadata = buildMetadata({
  title: 'Bragging Rights — The Numbers Behind The Work',
  description:
    '553 new businesses, partnerships, projects and community initiatives and counting. 275 brand-new businesses launched, 1,000+ housed, 502 websites built, 67,000+ calls answered a year.',
  path: '/impact/bragging-rights',
});

export default function BraggingRightsPage() {
  return (
    <>
      <PageHero
        eyebrow="BRAGGING RIGHTS"
        title="The Numbers Behind"
        accent="The Work"
        lead="Still counting. Below that, three years in Fox Park — what it looked like, measured."
      />

      {/* Running total. Lives above the fixed historical figures because it is
          still climbing — the value and date in headlineStat are the only two
          things that change as it grows. */}
      <Section tone="lift" className="!pb-0">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-sora text-[clamp(72px,14vw,148px)] font-semibold leading-[0.9] tracking-[-0.03em] text-red">
            {headlineStat.value}
          </p>
          <p className="mt-3 font-sora text-lead font-medium text-white">
            {headlineStat.tail}
          </p>
          <p className="mx-auto mt-6 max-w-xl text-balance font-inter text-[17px] leading-relaxed text-white/75">
            {headlineStat.label}
          </p>
          <p className="mt-5 font-inter text-[13px] tracking-[0.08em] text-white/45">
            AS OF {headlineStat.asOf.toUpperCase()}
          </p>
        </div>
      </Section>

      <Section>
        <div className="space-y-16">
          {statGroups.map((group) => (
            <div key={group.title}>
              <h2 className="font-sora text-h3 font-semibold text-white">{group.title}</h2>
              <dl className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {group.stats.map((s) => (
                  <div key={s.label} className="border-t border-white/12 pt-5">
                    <dt className="font-sora text-[38px] font-semibold leading-none text-sky sm:text-[44px]">
                      {s.value}
                    </dt>
                    <dd className="mt-3 font-inter text-[15px] leading-relaxed text-white/65">
                      {s.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <p className="mt-16 border-l-2 border-sky/50 pl-6 font-sora text-[20px] font-medium text-white">
          And every number here is a <span className="o">person we backed</span>.
        </p>
      </Section>

      <Section tone="navy" width="prose" className="text-center">
        <p className="font-sora text-h3 font-semibold leading-tight text-white">
          Three years in Fox Park.
          <br />
          Six years finding our way back.
          <br />
          <span className="o">And now we do it all again.</span>
        </p>
        <p className="mt-6 font-sora text-lg text-white/70">To Power What&rsquo;s Next.</p>
        <ButtonLink href="/coworking#memberships" size="lg" className="mt-8">
          Become Part of NexCore
        </ButtonLink>
      </Section>
    </>
  );
}
