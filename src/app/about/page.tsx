import Image from 'next/image';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { Section, Eyebrow } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { ButtonLink } from '@/components/Button';
import { dim } from '@/lib/img';

export const metadata = buildMetadata({
  title: 'What is NexCore',
  description:
    'NexCore is an intentionally designed ecosystem — spaces, people, access, systems, learning, and opportunities — where every part strengthens every other part.',
  path: '/about',
});

const pillars = [
  {
    title: 'Spaces',
    body: 'Purpose-built environments designed to inspire focus, collaboration and growth.',
    img: '/img/nexcore-spaces.png',
    href: '/coworking',
    cta: 'Explore the space →',
  },
  {
    title: 'People',
    body: 'Everything meaningful begins with the people around you.',
    img: '/img/nexcore-people.png',
    href: '/community',
  },
  {
    title: 'Access',
    body: 'Access to people, ideas and connections that move you forward.',
    img: '/img/nexcore-access.png',
    href: '/beyond-coworking',
  },
  {
    title: 'Systems',
    body: 'Connected systems working quietly behind everything we do.',
    img: '/logo/nexcore-illustration.svg',
    href: '/systems',
  },
  {
    title: 'Learning',
    body: 'Knowledge shared. Experience applied.',
    img: '/img/nexcore-learning.png',
    href: '/about/philosophy',
  },
  {
    title: 'Opportunities',
    body: "Action opens the door to creating what's next.",
    img: '/img/nexcore-opportunity.png',
    href: '/events',
  },
];

const chain = [
  'A workspace became a community.',
  'A community created access.',
  'Access inspired learning.',
  'Learning demanded systems.',
  'Systems created opportunities.',
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="WHAT IS NEXCORE"
        title="It's where the answers"
        accent="begin to appear."
        lead="It's an intentionally designed environment — not just amenities, but the conditions that make growth more likely."
      />

      <Section width="prose">
        <div className="prose-nex">
          <p>
            The NexCore ecosystem isn’t a collection of spaces, services, or resources. It’s a living
            system where every part strengthens every other part, creating outcomes that couldn’t
            happen alone. That’s why the answers begin to appear&hellip;here.
          </p>
        </div>

        <h2 className="mt-14 font-sora text-h2sm font-semibold text-white">
          The NexCore <span className="o">Ecosystem</span>
        </h2>

        <p className="mt-6 font-sora text-[19px] font-medium leading-snug text-white/85">
          An ecosystem isn&rsquo;t created all at once.
          <br />
          And it is never created alone.
          <br />
          <span className="o">It emerges when every piece strengthens the next.</span>
        </p>

        <div className="prose-nex mt-8">
          <p>
            NexCore opened as a workspace. But a workspace wasn’t enough. The people who walked
            through our doors wanted more than a place to work. They wanted relationships they could
            trust, knowledge they could apply, systems that removed friction, and opportunities they
            couldn’t create alone.
          </p>
          <p>
            <strong>So every time someone needed something next, we built it.</strong>
          </p>
        </div>

        <ol className="my-10 space-y-3 border-l-2 border-sky/40 pl-6">
          {chain.map((line) => (
            <li key={line} className="font-sora text-[18px] font-medium text-white/85">
              {line}
            </li>
          ))}
          <li className="font-sora text-[18px] font-semibold text-white">
            Every new piece made every other piece <span className="o">stronger</span>.
          </li>
        </ol>

        <div className="prose-nex">
          <p>
            We never set out to build an ecosystem. We simply kept building what people needed next.
            Every solution revealed another opportunity. Every opportunity uncovered another need.
            Before long, the individual pieces were no longer standing on their own — they were
            strengthening one another.
          </p>
          <p>
            Today, that ecosystem helps every person who becomes part of it discover, build, and
            power what’s next.
          </p>
        </div>

        <p className="mt-10 font-sora text-h3 font-semibold leading-tight text-white">
          NexCore is still a place.
          <br />
          But it became something more.
          <br />
          <span className="o">It became a feeling.</span>
        </p>
        <p className="mt-5 font-inter text-[17px] text-white/60">
          That&rsquo;s what an ecosystem feels like.
        </p>

        <ButtonLink href="/impact" variant="ghost" className="mt-8">
          See What The Ecosystem Has Accomplished →
        </ButtonLink>
      </Section>

      {/* Six pillars */}
      <Section tone="lift">
        <div className="max-w-2xl">
          <Eyebrow>THE ECOSYSTEM</Eyebrow>
          <h2 className="font-sora text-h2sm font-semibold text-white">
            Six parts. <span className="o">One system.</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="group overflow-hidden rounded-card border border-white/10 bg-ink transition-colors hover:border-sky/50"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  src={p.img}
                  alt=""
                  {...dim(p.img)}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-6">
                <h3 className="font-sora text-xl font-semibold text-white">{p.title}</h3>
                <p className="mt-2 font-inter text-[15px] leading-relaxed text-white/65">{p.body}</p>
                {p.cta && (
                  <span className="mt-4 inline-block font-inter text-[14px] font-medium text-sky">
                    {p.cta}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="navy" width="prose" className="text-center">
        <h2 className="font-sora text-h2xs font-semibold text-white">
          Come see <span className="o">NexCore</span>.
        </h2>
        <p className="mt-5 font-inter text-[17px] leading-relaxed text-white/75">
          It begins the moment you walk in. You don&rsquo;t just enter a building. You step into an
          ecosystem built to help you build what&rsquo;s next.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/contact" size="lg">
            See NexCore for yourself
          </ButtonLink>
          <ButtonLink href="/coworking" variant="ghost" size="lg">
            Explore Coworking
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
