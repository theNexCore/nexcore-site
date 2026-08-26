import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/Section';
import { PageHero } from '@/components/PageHero';

export const metadata = buildMetadata({
  title: 'Impact — The work speaks for itself',
  description:
    'Some stories are measured in numbers. Others in people. Explore the numbers behind NexCore, the history, the press coverage, and the Foundation.',
  path: '/impact',
});

const doorways = [
  {
    n: '01',
    kicker: 'Measured Impact',
    title: 'Bragging Rights',
    body: 'The numbers behind the work.',
    tags: [
      'Businesses launched',
      'Phone calls answered',
      'Websites built',
      'Documents managed',
      'Videos produced',
      'Millions of interactions',
    ],
    question: 'How much impact did NexCore actually have?',
    cta: 'Explore the Numbers →',
    href: '/impact/bragging-rights',
  },
  {
    n: '02',
    kicker: 'Our Story',
    title: 'History',
    body: 'Every ecosystem has a beginning.',
    tags: ['Fox Park', 'BusinessGPS', 'Community', 'COVID', 'Streamathon', 'The return'],
    question: 'How did NexCore become what it is today?',
    cta: 'Experience Our Story →',
    href: '/about/history',
  },
  {
    n: '03',
    kicker: 'Through Their Eyes',
    title: 'In The News',
    body: 'Independent media. Television. Recognition.',
    tags: ['Business Journal', 'STLtoday', 'St. Louis Magazine', 'KSDK', 'PRLog', 'BioSTL'],
    question: 'How did others see the work?',
    cta: 'Read the Coverage →',
    href: '/impact/in-the-news',
  },
  {
    n: '04',
    kicker: 'What Comes Next',
    title: 'The NexCore Foundation',
    body: "This isn't something new. We've been doing this for ten years.",
    tags: ['Community', 'Giving', 'Partnership'],
    question: 'Where is the momentum heading?',
    cta: 'See What’s Coming →',
    href: '/foundation',
  },
];

export default function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="THE IMPACT SECTION"
        title="The work speaks"
        accent="for itself."
        lead="Some stories are measured in numbers. Others are measured in people. Others are measured by what happens years later."
      />

      <Section width="prose">
        <p className="font-inter text-[17px] leading-relaxed text-white/70">
          There isn&rsquo;t just one way to measure what a place is worth. Every doorway below tells a
          different part of the same story — the numbers, the history, the way others saw it, and the
          momentum still building today.
        </p>
      </Section>

      <Section tone="lift" className="!pt-0">
        <div className="grid gap-6 md:grid-cols-2">
          {doorways.map((d) => (
            <Link
              key={d.n}
              href={d.href}
              className="group flex flex-col rounded-card border border-white/10 bg-ink p-8 transition-colors hover:border-sky/50"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-sora text-[32px] font-semibold leading-none text-sky/50">
                  {d.n}
                </span>
                <span className="font-inter text-[13px] font-semibold tracking-[0.12em] text-sky">
                  {d.kicker}
                </span>
              </div>

              <h2 className="mt-4 font-sora text-2xl font-semibold text-white">{d.title}</h2>
              <p className="mt-2 font-inter text-[15px] text-white/65">{d.body}</p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {d.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-pill border border-white/12 px-3 py-1 font-inter text-[13px] text-white/55"
                  >
                    {t}
                  </li>
                ))}
              </ul>

              <p className="mt-6 flex-1 font-inter text-[14px] italic text-white/45">
                This page answers &ldquo;{d.question}&rdquo;
              </p>
              <span className="mt-5 font-inter text-[15px] font-medium text-sky">{d.cta}</span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
