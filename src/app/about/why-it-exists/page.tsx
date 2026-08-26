import { buildMetadata } from '@/lib/seo';
import { Section, Eyebrow } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { ButtonLink } from '@/components/Button';

export const metadata = buildMetadata({
  title: 'Why It Exists',
  description:
    'The whole story behind NexCore, in ten parts — what we observed, what we discovered, and why coworking is only the door into the ecosystem.',
  path: '/about/why-it-exists',
});

interface Chapter {
  n: string;
  kicker: string;
  heading: string;
  body: string[];
  pull?: string;
}

const chapters: Chapter[] = [
  {
    n: '01',
    kicker: 'The Question',
    heading: 'Why does NexCore exist?',
    body: ['Not what we do. Not what we sell. Why we exist at all.'],
    pull: 'Because the honest answer is the only thing that has ever kept us building.',
  },
  {
    n: '02',
    kicker: 'What We Observed',
    heading: 'People rarely fail from a lack of talent.',
    body: [
      'They fail because they were missing something no amount of talent can replace.',
      'Community. Encouragement. Systems. Accountability. Opportunity. Collaboration. Belief. Access.',
    ],
    pull: 'The talent was never the problem. The environment was.',
  },
  {
    n: '03',
    kicker: 'What We Discovered',
    heading: 'So we asked a different question than most organizations ask.',
    body: [
      "What barrier is preventing people from becoming what they're capable of becoming?",
      'Because we believe those missing things can be built on purpose. And when they are — people thrive, businesses grow, and communities become stronger.',
    ],
    pull: 'Find the barrier. Remove the barrier. That is the entire philosophy.',
  },
  {
    n: '04',
    kicker: 'How It Evolved',
    heading: 'None of this was planned. It evolved.',
    body: [
      'The coworking space exposed problems. Businesses needed guidance — so BusinessGPS was created. Communities needed revitalization — so Revitalize St. Louis emerged. People needed places to connect — so events became part of the mission. Organizations needed support — so partnerships formed.',
      'Every time a new need appeared, another system was built.',
      "Until we realized these were never separate businesses. They were expressions of one mission — helping people discover what they're capable of becoming.",
    ],
  },
  {
    n: '05',
    kicker: 'Why Coworking Is Only The Start',
    heading: 'Most people assume NexCore is a coworking space.',
    body: [
      "It isn't.",
      'Coworking is simply the door. Behind it is an ecosystem intentionally designed to make people, businesses, organizations, and communities stronger.',
    ],
    pull: 'The desk was never the point. What happens because of the desk is.',
  },
  {
    n: '06',
    kicker: 'Why Systems Matter',
    heading: "Belief alone doesn't change a life. Structure does.",
    body: [
      'A system is how encouragement becomes progress and how a good intention survives a hard week.',
      'So we build the systems that remove the barriers — not to add more tools to the world, but to remove the friction between a person and their potential.',
    ],
  },
  {
    n: '07',
    kicker: 'Why Community Matters',
    heading: "No one becomes what they're capable of alone.",
    body: [
      'Potential is unlocked in the presence of other people — people who believe in you long enough for you to begin believing in yourself.',
    ],
    pull: 'Belief is contagious. Our job is to build the room where it spreads.',
  },
  {
    n: '08',
    kicker: 'Why Collaboration Beats Competition',
    heading: 'We are surrounded by people already doing extraordinary work.',
    body: [
      "We are not interested in competing with them. We're interested in connecting people to them.",
      "If the best answer already exists, we point you to it. If it doesn't exist, we build it. The goal was never to win. The goal was to move everyone forward together.",
    ],
  },
  {
    n: '09',
    kicker: "Why We Don't Try To Build Everything",
    heading: 'We are not trying to own every solution.',
    body: [
      "Success isn't measured by how many programs we create. It's measured by how many lives become stronger because the right people finally found each other.",
      'Coworking. BusinessGPS. Revitalize St. Louis. Events. Education. Partnerships. Networking. Leadership. Economic development. Entrepreneurship. Community building. Not separate initiatives — one ecosystem, where every piece strengthens every other piece.',
    ],
  },
  {
    n: '10',
    kicker: 'Why We Exist',
    heading: 'Every person has purpose.',
    body: [
      'Every business has potential. Every community deserves people willing to invest in its future.',
      'NexCore exists to become the place where those things happen.',
    ],
    pull: 'We exist to unlock human potential.',
  },
];

export default function WhyItExistsPage() {
  return (
    <>
      <PageHero eyebrow="WHY NEXCORE EXISTS" title="The whole" accent="story." />

      <Section>
        <div className="space-y-16 md:space-y-24">
          {chapters.map((c) => (
            <article key={c.n} className="grid gap-6 md:grid-cols-[120px_1fr] md:gap-10">
              <div>
                <span className="font-sora text-[40px] font-semibold leading-none text-sky/40">
                  {c.n}
                </span>
                <p className="mt-2 font-inter text-[13px] font-semibold tracking-[0.12em] text-sky">
                  {c.kicker}
                </p>
              </div>

              <div className="max-w-2xl">
                <h2 className="text-balance font-sora text-h2xs font-semibold leading-tight text-white">
                  {c.heading}
                </h2>
                <div className="prose-nex mt-5">
                  {c.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                {c.pull && (
                  <p className="mt-6 border-l-2 border-sky/50 pl-5 font-sora text-[19px] font-medium leading-snug text-white">
                    {c.pull}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="navy" width="prose" className="text-center">
        <Eyebrow className="text-center">THE STARTING POINT FOR IT ALL</Eyebrow>
        <h2 className="font-sora text-h2xs font-semibold text-white">
          Become part of <span className="o">NexCore</span>
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/coworking" size="lg">
            Explore Coworking
          </ButtonLink>
          <ButtonLink href="/about/founder-letter" variant="ghost" size="lg">
            Read the founder&rsquo;s letter →
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
