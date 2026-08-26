import Image from 'next/image';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { Section, Eyebrow } from '@/components/Section';
import { Container } from '@/components/Container';
import { ButtonLink } from '@/components/Button';
import { dim } from '@/lib/img';

export const metadata = buildMetadata({
  title: 'NexCore — The Starting Point For It All',
  description:
    'NexCore is a coworking space and business ecosystem in South St. Louis County. Private offices, event space, systems, community, and events built to help businesses grow.',
  path: '/',
});

const HERO = '/img/nexcore-front-profile.png';

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0">
          <Image
            src={HERO}
            alt=""
            {...dim(HERO)}
            priority
            sizes="100vw"
            className="h-full w-full object-cover opacity-[0.28]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/85 to-ink" />
        </div>

        <Container className="relative py-24 md:py-40">
          <div className="max-w-3xl">
            <Eyebrow>ANCHORED IN SOUTH COUNTY</Eyebrow>
            <h1 className="text-balance font-sora text-hero font-semibold text-white">
              The Starting Point
              <br />
              <span className="o">For It All</span>
            </h1>
            <p className="mt-7 max-w-xl font-inter text-lead leading-snug text-white/75">
              Every business deserves the opportunity to thrive.
              <br />
              That&rsquo;s why we built NexCore.
            </p>
            <p className="mt-4 max-w-xl font-inter text-[17px] leading-relaxed text-white/55">
              But over time, we discovered something even bigger&hellip;
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/coworking" size="lg">
                Explore Coworking
              </ButtonLink>
              <ButtonLink href="/about/why-it-exists" variant="ghost" size="lg">
                Why NexCore Exists
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Why NexCore Exists */}
      <Section tone="lift">
        <div className="mx-auto max-w-prose">
          <Eyebrow>WHY NEXCORE EXISTS</Eyebrow>
          <h2 className="text-balance font-sora text-h2 font-semibold text-white">
            Every great idea begins with <span className="o">possibility</span>.
          </h2>

          <div className="prose-nex mt-8">
            <p>But possibility doesn&rsquo;t become reality on its own.</p>
            <p>
              It needs people. It needs collaboration. It needs encouragement. It needs an
              environment where ideas are challenged, refined, and transformed into something greater
              than any one person could create alone.
            </p>
            <p>
              <strong>That&rsquo;s why we built NexCore.</strong> To bridge the gap between
              what&rsquo;s imagined and what&rsquo;s possible. To create the kind of environment
              where people don&rsquo;t have to wait for the right opportunity, the right connection,
              or the right moment to begin.
            </p>
            <p>Because we&rsquo;ve seen what happens when the right people come together.</p>
          </div>

          <ul className="mt-8 space-y-3 border-l-2 border-sky/40 pl-6">
            {[
              'We’ve watched ideas become businesses.',
              'We’ve watched strangers become partners.',
              'We’ve watched encouragement become confidence.',
              'We’ve watched confidence become momentum.',
            ].map((line) => (
              <li key={line} className="font-inter text-[17px] leading-relaxed text-white/75">
                {line}
              </li>
            ))}
            <li className="font-sora text-[19px] font-semibold text-white">
              We&rsquo;ve watched momentum become <span className="o">impact</span>.
            </li>
          </ul>

          <div className="prose-nex mt-8">
            <p>
              Not because we planned every outcome. Not because we wrote the story. But because it
              was written all around us.
            </p>
            <p>
              And when that chapter closed, something still felt unfinished. It reminded us there was
              still work to do.
            </p>
          </div>

          <p className="mt-8 font-sora text-h3 font-semibold leading-tight text-white">
            NexCore Exists&hellip;
            <br />
            <span className="o">To Power What&rsquo;s Next.</span>
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/about/founder-letter" variant="ghost">
              Read the founder&rsquo;s letter →
            </ButtonLink>
            <ButtonLink href="/about/why-it-exists" variant="ghost">
              Read the whole story →
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* More than a building */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>ANCHORED IN SOUTH COUNTY</Eyebrow>
            <h2 className="text-balance font-sora text-h2sm font-semibold text-white">
              More Than a <span className="o">Building</span>.
            </h2>
            <p className="mt-6 font-inter text-[17px] leading-relaxed text-white/70">
              NexCore is an ecosystem of entrepreneurs, businesses, creators, partnerships, ideas,
              and opportunities — all anchored from our flagship South County location.
            </p>
            <p className="mt-6 font-sora text-[19px] font-medium leading-snug text-white">
              The building isn&rsquo;t the product.
              <br />
              <span className="o">The ecosystem is.</span>
              <br />
              The building simply gives it a place to grow.
            </p>
            <ButtonLink href="/about" variant="ghost" className="mt-8">
              What is NexCore →
            </ButtonLink>
          </div>

          <div className="overflow-hidden rounded-card">
            <Image
              src="/img/coworking-at-thenexcore.png"
              alt="Coworking space inside NexCore"
              {...dim('/img/coworking-at-thenexcore.png')}
              sizes="(max-width: 1024px) 100vw, 560px"
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* Where to begin */}
      <Section tone="lift">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow className="text-center">WHERE TO BEGIN</Eyebrow>
          <h2 className="text-balance font-sora text-h2sm font-semibold text-white">
            One ecosystem. <span className="o">Two ways in.</span>
          </h2>
          <p className="mt-5 font-inter text-[17px] leading-relaxed text-white/65">
            Start with the space. Or start with everything it makes possible.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {[
            {
              href: '/coworking',
              img: '/img/nexcore-coworking-amenitites1.png',
              title: 'Coworking',
              body: 'The physical starting point.',
              cta: 'Explore Coworking →',
            },
            {
              href: '/beyond-coworking',
              img: '/img/nexcore-businesssystems.jpg',
              title: 'Beyond Coworking',
              body: 'Systems, community, events, and everything that grows from the space.',
              cta: 'Explore Beyond Coworking →',
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group overflow-hidden rounded-card border border-white/10 bg-ink transition-colors hover:border-sky/50"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <Image
                  src={card.img}
                  alt=""
                  {...dim(card.img)}
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-7">
                <h3 className="font-sora text-2xl font-semibold text-white">{card.title}</h3>
                <p className="mt-3 font-inter text-[15px] leading-relaxed text-white/65">
                  {card.body}
                </p>
                <span className="mt-5 inline-block font-inter text-[15px] font-medium text-sky">
                  {card.cta}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-center font-sora text-lg text-white/60">
          However you enter, <span className="o">everything is connected</span>.
        </p>
      </Section>

      {/* Founding member CTA */}
      <Section tone="navy" width="prose" className="text-center">
        <Eyebrow className="text-center">FOUNDING MEMBER</Eyebrow>
        <h2 className="text-balance font-sora text-h2xs font-semibold text-white">
          Become Part of <span className="o">NexCore</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl font-inter text-[17px] leading-relaxed text-white/75">
          Lock in the founding-member rate of $199/month through the end of 2027, with prominent
          placement on the Founding Member Wall and featured placement in the Member Directory.
          Founding spots are limited.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/coworking#memberships" size="lg">
            View Memberships
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost" size="lg">
            Book a Tour
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
