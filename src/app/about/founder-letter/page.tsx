import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { ButtonLink } from '@/components/Button';
import { founderLetter, founderSignoff } from '@/data/founder-letter';

export const metadata = buildMetadata({
  title: 'A Letter from the Founder',
  description:
    'Jim Shelvy on why NexCore came back — losing a business, a marriage and a building, and rebuilding a place where people discover what they are capable of.',
  path: '/about/founder-letter',
  type: 'article',
});

export default function FounderLetterPage() {
  return (
    <>
      <PageHero
        eyebrow="FOUNDER LETTER"
        title="A Letter from the"
        accent="Founder"
        lead="There are moments in life that force you to ask questions you never expected to ask."
      />

      <Section width="prose">
        <article className="prose-nex">
          {founderLetter.map((block, i) => {
            if (block.type === 'p') return <p key={i}>{block.text}</p>;
            if (block.type === 'lead')
              return (
                <p
                  key={i}
                  className="my-8 border-l-2 border-sky/50 pl-6 font-sora text-[20px] font-medium leading-snug text-white"
                >
                  {block.text}
                </p>
              );
            return (
              <p key={i} className="my-6 leading-[1.9]">
                {block.lines.map((line, j) => (
                  <span key={j} className="block">
                    {line}
                  </span>
                ))}
              </p>
            );
          })}

          <footer className="mt-14 border-t border-white/10 pt-8 not-italic">
            <p className="font-inter text-[15px] text-white/60">{founderSignoff.closing}</p>
            <p className="mt-3 font-sora text-xl font-semibold text-white">{founderSignoff.name}</p>
            <p className="mt-1 font-inter text-[15px] text-white/60">{founderSignoff.title}</p>
            <p className="mt-1 font-inter text-[15px] text-sky">{founderSignoff.credo}</p>
          </footer>
        </article>

        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonLink href="/about/why-it-exists" variant="ghost">
            Why It Exists →
          </ButtonLink>
          <ButtonLink href="/coworking#memberships">Become Part of NexCore</ButtonLink>
        </div>
      </Section>
    </>
  );
}
