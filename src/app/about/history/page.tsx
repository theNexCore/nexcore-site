import Image from 'next/image';
import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { ButtonLink } from '@/components/Button';
import { milestones } from '@/data/history';
import { dim } from '@/lib/img';

export const metadata = buildMetadata({
  title: 'History — How One Place Changed So Many',
  description:
    'From a neglected city block in Fox Park in 2017 to South County in 2026 — the milestones behind NexCore, BusinessGPS, ReVitalize St. Louis, and the South County Chamber.',
  path: '/about/history',
});

export default function HistoryPage() {
  return (
    <>
      <PageHero
        eyebrow="HISTORY · OUR STORY"
        title="How One Place"
        accent="Changed So Many"
        lead="Not a timeline. The evidence — day by day — of what happens when you make room for people's biggest ideas."
      />

      {/* Founder framing */}
      <Section width="prose" tone="lift">
        <div className="prose-nex">
          <p>
            We took one neglected city block in Fox Park and made it a place that existed for one
            reason: to help people build what came next.
          </p>
          <p>
            In three years, hundreds of businesses were born here. A community found a home. And
            then, when the world stopped, we closed the doors — and spent six years finding our way
            back.
          </p>
          <p>
            <strong>This is what happened in between. And what happens next.</strong>
          </p>
        </div>
        <p className="mt-6 font-inter text-[14px] text-white/50">— Jim Shelvy, Founder</p>
      </Section>

      {/* Timeline */}
      <Section>
        <ol className="relative space-y-14 border-l border-white/12 pl-6 sm:space-y-20 sm:pl-10">
          {milestones.map((m) => (
            <li key={m.n} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[31px] top-2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-sky bg-ink sm:-left-[47px]"
              />

              <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
                <div>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="font-sora text-[13px] font-semibold tracking-[0.14em] text-sky">
                      {m.n}
                    </span>
                    <time className="font-inter text-[14px] text-white/55">{m.date}</time>
                  </div>

                  <h2 className="mt-2 font-sora text-h3 font-semibold leading-tight text-white">
                    {m.title}
                  </h2>
                  <p className="mt-4 font-sora text-[18px] font-medium leading-snug text-white/85">
                    {m.lead}
                  </p>
                  <p className="mt-4 max-w-2xl font-inter text-[16px] leading-relaxed text-white/65">
                    {m.body}
                  </p>

                  {m.stat && (
                    <p className="mt-5 inline-block rounded-pill border border-sky/40 bg-sky/10 px-4 py-2 font-sora text-[15px] font-semibold text-white">
                      {m.stat}
                    </p>
                  )}

                  {m.followUp && (
                    <div className="mt-6 rounded-card border border-white/10 bg-ink-lift p-5">
                      <p className="font-sora text-[15px] font-semibold text-sky">
                        {m.followUp.title}
                      </p>
                      <p className="mt-2 font-inter text-[15px] leading-relaxed text-white/65">
                        {m.followUp.body}
                      </p>
                      {m.followUp.cta && m.followUp.href && (
                        <a
                          href={m.followUp.href}
                          {...(m.followUp.href.startsWith('http')
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                          className="mt-3 inline-block font-inter text-[14px] font-medium text-sky hover:text-sky-light"
                        >
                          {m.followUp.cta}
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {m.img && (
                  <div className="overflow-hidden rounded-card border border-white/10">
                    <Image
                      src={m.img}
                      alt={m.title}
                      {...dim(m.img)}
                      sizes="(max-width: 1024px) 100vw, 360px"
                      className="h-auto w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="navy" width="prose" className="text-center">
        <h2 className="font-sora text-h2xs font-semibold text-white">
          We didn&rsquo;t build offices.
          <br />
          <span className="o">We built opportunity.</span>
        </h2>
        <p className="mt-5 font-sora text-lg text-white/70">The Starting Point For It All.</p>
        <ButtonLink href="/coworking#memberships" size="lg" className="mt-8">
          Help Us Shape the Future. Join Today.
        </ButtonLink>
      </Section>
    </>
  );
}
