import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/Section';
import { ButtonLink } from '@/components/Button';
import { Container } from '@/components/Container';
import { Eyebrow } from '@/components/Section';

export const metadata = buildMetadata({
  title: 'The NexCore Foundation',
  description:
    "The NexCore Foundation — this isn't something new. We've been doing this for ten years. Now we're giving it a name.",
  path: '/foundation',
});

export default function FoundationPage() {
  return (
    <>
      <section className="bg-ink-lift">
        <Container className="py-24 text-center md:py-36">
          <Eyebrow className="text-center">COMING SOON</Eyebrow>
          <h1 className="text-balance font-sora text-h2 font-semibold text-white">
            The <span className="o">NexCore Foundation</span>
          </h1>

          <div className="mx-auto mt-10 max-w-xl space-y-3">
            <p className="font-sora text-[20px] font-medium text-white/85">
              This isn&rsquo;t something new.
            </p>
            <p className="font-sora text-[20px] font-medium text-white/85">
              We&rsquo;ve been doing this for ten years.
            </p>
            <p className="font-sora text-[20px] font-semibold text-white">
              Now we&rsquo;re <span className="o">giving it a name</span>.
            </p>
          </div>
        </Container>
      </section>

      <Section width="prose" className="text-center">
        <p className="font-inter text-[17px] leading-relaxed text-white/65">
          More to share soon. In the meantime, the work continues — in the community, in the events,
          and in the businesses being built here every day.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/impact" variant="ghost">
            See the Impact →
          </ButtonLink>
          <ButtonLink href="/contact">Get in Touch</ButtonLink>
        </div>
      </Section>
    </>
  );
}
