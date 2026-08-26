import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { ButtonLink } from '@/components/Button';
import { press } from '@/data/impact';

export const metadata = buildMetadata({
  title: 'In The News — The Coverage',
  description:
    'NexCore in the press — St. Louis Business Journal, STLtoday, St. Louis Magazine, KSDK, PRLog and more, from Fox Park in 2017 to South County in 2026.',
  path: '/impact/in-the-news',
});

export default function InTheNewsPage() {
  return (
    <>
      <PageHero
        eyebrow="NEXCORE IN THE NEWS"
        title="The"
        accent="Coverage"
        lead="From a derelict block in Fox Park to a new chapter in South County — here's how the story was told."
      />

      <Section>
        <ul className="divide-y divide-white/10 border-y border-white/10">
          {press.map((item) => (
            <li key={item.url}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-3 py-7 sm:flex-row sm:items-baseline sm:gap-8"
              >
                <div className="shrink-0 sm:w-64">
                  <span className="font-inter text-[14px] font-medium text-sky">{item.outlet}</span>
                  {item.year && (
                    <span className="ml-2 font-inter text-[14px] text-white/40">{item.year}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="font-sora text-[19px] font-medium leading-snug text-white transition-colors group-hover:text-sky">
                    {item.title}
                  </h2>
                  <span className="mt-2 inline-block font-inter text-[14px] text-white/45">
                    Read the coverage →
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="navy" width="prose" className="text-center">
        <h2 className="font-sora text-h2xs font-semibold text-white">
          The story is <span className="o">still being written</span>.
        </h2>
        <ButtonLink href="/coworking#memberships" size="lg" className="mt-8">
          Become Part of NexCore
        </ButtonLink>
      </Section>
    </>
  );
}
