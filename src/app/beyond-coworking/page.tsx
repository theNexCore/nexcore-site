import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { ButtonLink } from '@/components/Button';

export const metadata = buildMetadata({
  title: 'Beyond Coworking',
  description:
    'Coworking is just the beginning. Beyond the offices and meeting rooms is an ecosystem of systems, community, and events built to help businesses and people move forward together.',
  path: '/beyond-coworking',
});

const pillars = [
  {
    n: '01',
    title: 'Systems',
    lead: 'The right tools — wherever they come from.',
    body: [
      "Business owners don't need another hundred tools. They need the right ones. We aren't interested in building software just because it doesn't exist yet — we evaluate, test, build, refine, and curate the best systems available, whether they come from NexCore, a member, a trusted partner, or an industry leader.",
      'Sometimes we develop the solution ourselves. Sometimes we discover a better one. Sometimes the next great idea comes from within our own community. Our job is simple: find the best solution — from AI and Google Workspace to frameworks like Focus10™ and BusinessGPS™ — and make it accessible to every member.',
    ],
    cta: 'Explore Systems →',
    href: '/systems',
  },
  {
    n: '02',
    title: 'Community',
    lead: 'Business grows where community exists.',
    body: [
      "Great businesses aren't built in isolation. They're built through relationships. NexCore intentionally creates connections between members, nonprofits, local organizations, community leaders, strategic partners, and businesses — extending far beyond the walls of our building.",
      "You'll see it in Revitalize St. Louis, the South County Chamber, ZentryPass, Square, local business partners, and The 314 Store (Coming Soon) — examples of community, not the definition of it.",
    ],
    cta: 'Explore Community →',
    href: '/community',
  },
  {
    n: '03',
    title: 'Events',
    lead: 'Learn. Connect. Grow.',
    body: [
      "We don't simply host events. We intentionally curate experiences that create conversations, relationships, education, and opportunities — workshops, networking, leadership sessions, business education, and community gatherings.",
      'Some are produced by NexCore. Others are member-hosted or partner events. Together they create opportunities to learn, connect, collaborate, and build meaningful relationships.',
    ],
    cta: 'Explore Events →',
    href: '/events',
  },
];

export default function BeyondCoworkingPage() {
  return (
    <>
      <PageHero
        eyebrow="BEYOND COWORKING"
        title="Coworking is just"
        accent="the beginning."
        lead="Most coworking spaces provide a place to work. NexCore was intentionally built to provide a place to grow."
      />

      <Section width="prose">
        <div className="prose-nex">
          <p>
            Beyond the offices, meeting rooms, and shared workspaces is an ecosystem designed to help
            entrepreneurs, professionals, nonprofits, creators, and organizations build stronger
            businesses, meaningful relationships, and lasting impact.
          </p>
          <p>
            Through thoughtfully designed <strong>systems</strong>, authentic{' '}
            <strong>community</strong>, and transformational <strong>events</strong>, we&rsquo;re
            creating something much bigger than coworking.
          </p>
          <p>
            We&rsquo;re building the environment where people — and businesses — move forward
            together.
          </p>
          <p>
            When you become a NexCore member, you&rsquo;re not just joining a coworking space.
            You&rsquo;re arriving at <strong>The Starting Point For It All</strong>.
          </p>
          <p>
            Beyond Coworking is how we fulfill that promise — through better systems, stronger
            community, and experiences that keep <strong>Powering What&rsquo;s Next</strong>.
          </p>
        </div>
      </Section>

      <Section tone="lift">
        <div className="space-y-14 md:space-y-20">
          {pillars.map((p) => (
            <article key={p.n} className="grid gap-6 md:grid-cols-[110px_1fr] md:gap-10">
              <span className="font-sora text-[44px] font-semibold leading-none text-sky/40">
                {p.n}
              </span>

              <div className="max-w-2xl">
                <h2 className="font-sora text-h3 font-semibold text-white">{p.title}</h2>
                <p className="mt-3 font-sora text-[19px] font-medium text-white/85">{p.lead}</p>
                <div className="prose-nex mt-5">
                  {p.body.map((t, i) => (
                    <p key={i}>{t}</p>
                  ))}
                </div>
                <Link
                  href={p.href}
                  className="mt-4 inline-block font-inter text-[15px] font-medium text-sky hover:text-sky-light"
                >
                  {p.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="navy" width="prose" className="text-center">
        <h2 className="font-sora text-h2xs font-semibold text-white">
          Start with the space. Or start with{' '}
          <span className="o">everything it makes possible</span>.
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/coworking" size="lg">
            Explore Coworking
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost" size="lg">
            Book a Tour
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
