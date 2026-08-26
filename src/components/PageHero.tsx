import { Container } from './Container';
import { Eyebrow } from './Section';

/** Standard interior page hero. */
export function PageHero({
  eyebrow,
  title,
  accent,
  lead,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  accent?: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b border-white/10 bg-ink-lift">
      <Container className="py-16 md:py-24">
        <div className="max-w-3xl">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="text-balance font-sora text-h2 font-semibold text-white">
            {title}
            {accent && (
              <>
                {' '}
                <span className="o">{accent}</span>
              </>
            )}
          </h1>
          {lead && (
            <p className="mt-6 max-w-2xl font-inter text-[18px] leading-relaxed text-white/70">
              {lead}
            </p>
          )}
          {children}
        </div>
      </Container>
    </section>
  );
}
