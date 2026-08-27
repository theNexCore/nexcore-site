import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { ButtonLink } from '@/components/Button';
import { statGroups } from '@/data/impact';

export const metadata = buildMetadata({
  title: 'Bragging Rights — The Numbers Behind The Work',
  description:
    '550+ new businesses, partnerships and community initiatives, 275 brand-new businesses launched, 1,000+ housed, 67,000+ calls answered a year. Three years in Fox Park, measured.',
  path: '/impact/bragging-rights',
});

export default function BraggingRightsPage() {
  return (
    <>
      <PageHero
        eyebrow="BRAGGING RIGHTS"
        title="The Numbers Behind"
        accent="The Work"
        lead="Three years in Fox Park. This is what it looked like, measured."
      />

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
