import { buildMetadata } from '@/lib/seo';
import { Section, Eyebrow } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { ButtonLink } from '@/components/Button';

export const metadata = buildMetadata({
  title: 'Our Philosophy',
  description:
    'Hard-earned operating principles behind NexCore — Borrow My Mistakes, Focus10, BusinessGPS, Mastering the Spin, The Art of the Pivot, and The Ecosystem Mindset.',
  path: '/about/philosophy',
});

interface Principle {
  n: string;
  title: string;
  body: string;
  cta: string;
  href?: string;
}

const principles: Principle[] = [
  {
    n: '01',
    title: 'Borrow My Mistakes',
    body: 'The lessons experience teaches you before success ever will — told in full at the top of this page.',
    cta: 'Told above ↑',
    href: '#borrow-my-mistakes',
  },
  {
    n: '02',
    title: 'Focus10',
    body: 'Everything begins with you. Ten focus areas, and a rhythm of checkpoints to assess, evolve, and grow — transforming your life and your business together. Watch the calendar for the Focus10 workshop, coming winter 2026.',
    cta: 'Coming Soon',
  },
  {
    n: '03',
    title: 'BusinessGPS',
    body: 'Business shouldn’t be a lonely journey. How accountability, community, and momentum work together.',
    cta: 'Read this principle →',
    href: '#businessgps',
  },
  {
    n: '04',
    title: 'Mastering the Spin',
    body: 'Life rarely goes according to plan. Success belongs to the people who know how to respond when everything changes. Happiness is awarded to those who can change the way they see it before it has to change.',
    cta: 'Coming Soon',
  },
  {
    n: '05',
    title: 'The Art of the Pivot',
    body: 'Sometimes persistence means changing direction — not giving up. But how? That’s the art. Workshop coming winter 2026.',
    cta: 'Coming Soon',
  },
  {
    n: '06',
    title: 'The Ecosystem Mindset',
    body: 'Businesses don’t grow alone. Communities don’t either. Some philosophies can’t be taught. They must be experienced firsthand. That’s the NexCore ecosystem.',
    cta: 'Join us — take a tour →',
    href: '/contact',
  },
];

export default function PhilosophyPage() {
  return (
    <>
      <PageHero
        eyebrow="THE PHILOSOPHY SECTION"
        title="Why We're"
        accent="Different"
        lead="It isn't the building. It isn't the services. It isn't the technology. It's how we think."
      />

      {/* Borrow My Mistakes */}
      <Section id="borrow-my-mistakes" width="prose">
        <Eyebrow>01 — BORROW MY MISTAKES</Eyebrow>
        <h2 className="font-sora text-h2sm font-semibold text-white">Borrow My Mistakes</h2>

        <div className="prose-nex mt-8">
          <p>People ask me all the time how we’ve built what we’ve built.</p>
          <p>
            The truth is, I’ve made more mistakes than I can count. Some expensive. Some
            embarrassing. Some that nearly ended everything.
          </p>
          <p>
            I’ve also had incredible mentors — people like John Maxwell and Jim Rohn, who challenged
            the way I thought and helped shape the way I lead. And despite learning from them, I
            still made my own mistakes.
          </p>
          <p>
            Eventually I realized something. Every mistake leaves behind a lesson. Every lesson
            becomes a system. Every system becomes something that can help someone else.
          </p>
          <p>That’s what this library is.</p>
        </div>

        <blockquote className="my-10 border-l-2 border-sky/50 pl-6">
          <p className="font-sora text-[20px] font-medium leading-snug text-white">
            I&rsquo;m not asking you to borrow my success. I&rsquo;m asking you to{' '}
            <span className="o">borrow my mistakes</span>.
          </p>
          <p className="mt-4 font-inter text-[16px] leading-relaxed text-white/70">
            God knows I&rsquo;ve made enough of them. You&rsquo;ll make your own — but maybe these
            can save you from making some of mine.
          </p>
          <footer className="mt-4 font-inter text-[14px] text-white/50">
            — Jim Shelvy, Founder
          </footer>
        </blockquote>

        <div className="prose-nex">
          <p>
            Everything we built — from BusinessGPS to Focus10, from the South County Chamber to
            ReVitalize — started with one simple question:
          </p>
        </div>
        <p className="my-6 font-sora text-[22px] font-medium text-white">
          Why did this work? <span className="o">Or why didn&rsquo;t it?</span>
        </p>
        <div className="prose-nex">
          <p>
            Those answers became philosophies. Those philosophies became systems. Those systems
            became the NexCore ecosystem.
          </p>
        </div>
      </Section>

      {/* The Library */}
      <Section tone="lift">
        <div className="max-w-2xl">
          <Eyebrow>THE LIBRARY</Eyebrow>
          <h2 className="font-sora text-h2sm font-semibold text-white">
            Hard-earned <span className="o">operating principles</span>.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {principles.map((p) => (
            <article
              key={p.n}
              className="flex flex-col rounded-card border border-white/10 bg-ink p-7 transition-colors hover:border-sky/40"
            >
              <span className="font-sora text-[28px] font-semibold text-sky/60">{p.n}</span>
              <h3 className="mt-3 font-sora text-xl font-semibold text-white">{p.title}</h3>
              <p className="mt-3 flex-1 font-inter text-[15px] leading-relaxed text-white/65">
                {p.body}
              </p>
              {p.href ? (
                <a
                  href={p.href}
                  className="mt-5 font-inter text-[14px] font-medium text-sky hover:text-sky-light"
                >
                  {p.cta}
                </a>
              ) : (
                <span className="mt-5 font-inter text-[14px] font-medium text-white/40">
                  {p.cta}
                </span>
              )}
            </article>
          ))}
        </div>
      </Section>

      {/* BusinessGPS Weekly */}
      <Section id="businessgps" width="prose">
        <Eyebrow>BUSINESSGPS WEEKLY</Eyebrow>
        <h2 className="font-sora text-h2xs font-semibold text-white">
          Navigate growth, build relationships, <span className="o">create opportunity</span>.
        </h2>
        <div className="prose-nex mt-7">
          <p>
            Growing a business isn’t about collecting business cards. It’s about building meaningful
            relationships that lead to real opportunities.
          </p>
          <p>
            BusinessGPS is a weekly gathering of business owners, entrepreneurs, professionals, and
            community leaders who are committed to growing together through authentic connections,
            practical insights, and intentional collaboration — not forced referrals.
          </p>
          <p>
            <strong>Begins September 10th, 2026.</strong>
          </p>
        </div>
        <ButtonLink href="/events" variant="ghost" className="mt-6">
          See BusinessGPS in action →
        </ButtonLink>
      </Section>

      {/* Closing */}
      <Section tone="navy" width="prose" className="text-center">
        <h2 className="font-sora text-h2xs font-semibold text-white">
          This isn&rsquo;t a collection of theories.
          <br />
          <span className="o">It&rsquo;s a collection of lessons.</span>
        </h2>
        <div className="prose-nex mx-auto mt-7 text-left">
          <p>
            There are a million different lessons we learn over time. These philosophies aren’t just
            what we practice — they’re what we live every single day. Some of them are uniquely ours.
            Some are borrowed from the very best. And some are a combination of the two, refined and
            adapted with our members, their families, and their businesses in mind.
          </p>
          <p>
            These will evolve. They will grow. We’ll keep adding to them. And if one lesson helps you
            avoid one mistake, then every one of those mistakes was worth making.
          </p>
        </div>
        <ButtonLink href="/coworking#memberships" size="lg" className="mt-8">
          Help Us Shape the Future. Join Today.
        </ButtonLink>
      </Section>
    </>
  );
}
