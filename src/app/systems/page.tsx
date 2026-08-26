import { buildMetadata } from '@/lib/seo';
import { Section, Eyebrow } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { ButtonLink } from '@/components/Button';

export const metadata = buildMetadata({
  title: 'Systems — How We Build',
  description:
    'Find, test, refine, curate. The systems behind NexCore — AI, Google Workspace, BusinessGPS™, Focus10™, trusted partners, and member-built innovations.',
  path: '/systems',
});

const library = [
  {
    n: '01',
    title: 'AI That Actually Helps',
    body: 'Not AI for the sake of AI. Practical tools that remove repetitive work and help businesses move faster.',
  },
  {
    n: '02',
    title: 'BusinessGPS™',
    body: 'A framework built around accountability, momentum, and surrounding yourself with the right people.',
  },
  {
    n: '03',
    title: 'Focus10™',
    body: 'Everything begins with understanding yourself before trying to grow your business.',
  },
  {
    n: '04',
    title: 'Google Workspace',
    body: 'Building a business shouldn’t require fighting your technology. We’ll show you how we configure systems that simply work.',
  },
  {
    n: '05',
    title: 'Trusted Partners',
    body: 'Some of the best systems weren’t built by NexCore. They were built by people we trust — partners, technologies, and service providers that have earned a place inside our ecosystem.',
  },
  {
    n: '06',
    title: 'Community Innovations',
    body: 'Some of our best ideas didn’t start with us. They came from members solving real problems — systems, tools, and ideas being built inside the NexCore community.',
  },
];

export default function SystemsPage() {
  return (
    <>
      <PageHero
        eyebrow="THE SYSTEMS SECTION"
        title="How We"
        accent="Build"
        lead="Business owners don't need another hundred tools. They need the right ones."
      />

      <Section width="prose">
        <div className="prose-nex">
          <p>
            We&rsquo;re not interested in building software just because it doesn&rsquo;t exist.
            We&rsquo;re interested in solving problems.
          </p>
          <p>
            Sometimes that means creating something ourselves. Sometimes it means partnering with the
            best people already doing it. And sometimes the next great idea comes from one of our own
            members.
          </p>
          <p>
            Virtually every system we touch is a direct result of the relationships we&rsquo;ve
            built. NexCore members have helped shape it, and reshape it, over time.
          </p>
          <p>
            <strong>
              Our responsibility is simple: find the best solution, then earn your trust with it.
            </strong>
          </p>
        </div>

        <p className="mt-10 font-sora text-[22px] font-semibold text-white">
          Find <span className="text-white/30">·</span> Test <span className="text-white/30">·</span>{' '}
          Refine <span className="text-white/30">·</span> <span className="o">Curate</span>
        </p>

        <div className="prose-nex mt-8">
          <p>Every system inside NexCore exists for one reason:</p>
        </div>
        <p className="mt-4 border-l-2 border-sky/50 pl-6 font-sora text-[20px] font-medium leading-snug text-white">
          To remove friction so people can focus on building what matters.
        </p>
        <div className="prose-nex mt-8">
          <p>
            Whether it&rsquo;s AI, Google Workspace, BusinessGPS, Focus10, community partnerships, or
            technologies we haven&rsquo;t announced yet — every system earns its place. Nothing
            exists simply because it&rsquo;s new. Everything exists because it creates momentum.
          </p>
        </div>
      </Section>

      <Section tone="lift">
        <div className="max-w-2xl">
          <Eyebrow>THE LIBRARY</Eyebrow>
          <h2 className="font-sora text-h2sm font-semibold text-white">
            Building the NexCore <span className="o">System Library</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {library.map((item) => (
            <article
              key={item.n}
              className="rounded-card border border-white/10 bg-ink p-7 transition-colors hover:border-sky/40"
            >
              <span className="font-sora text-[26px] font-semibold text-sky/60">{item.n}</span>
              <h3 className="mt-3 font-sora text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 font-inter text-[15px] leading-relaxed text-white/65">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section width="prose">
        <Eyebrow>A GRADUAL UNVEILING</Eyebrow>
        <div className="prose-nex">
          <p>
            Over the coming months, NexCore will begin introducing the technologies, service
            providers, strategic partnerships, member-built solutions, operational frameworks, and AI
            systems that already power our ecosystem.
          </p>
          <p>
            Most of what you&rsquo;ll see here has already been tested and curated inside our own
            community — some of it quietly serving our members for years. Others are being launched
            for the first time. Each announcement is another piece of the ecosystem becoming
            available to everyone.
          </p>
          <p>
            <strong>
              This isn&rsquo;t a product launch. It&rsquo;s the gradual unveiling of the operating
              system behind NexCore.
            </strong>
          </p>
        </div>

        <p className="mt-10 font-sora text-h3 font-semibold leading-tight text-white">
          The best systems don&rsquo;t demand your attention.
          <br />
          <span className="o">They quietly make everything else work better.</span>
        </p>
        <p className="mt-6 font-inter text-[17px] leading-relaxed text-white/65">
          That&rsquo;s what we&rsquo;re building. And over the coming months, we&rsquo;ll begin
          opening that system to the entire NexCore community.
        </p>

        <ButtonLink href="/coworking#memberships" size="lg" className="mt-9">
          Help Us Shape the Future. Join Today.
        </ButtonLink>
      </Section>
    </>
  );
}
