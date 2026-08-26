import { cn } from '@/lib/cn';
import { Container } from './Container';

type Tone = 'ink' | 'lift' | 'navy' | 'light';

const tones: Record<Tone, string> = {
  ink: 'bg-ink text-white',
  lift: 'bg-ink-lift text-white',
  navy: 'bg-navy text-white',
  light: 'bg-surface text-ink',
};

/**
 * Standard page section. Vertical rhythm follows the live site:
 * 120px desktop / 72px mobile.
 */
export function Section({
  id,
  tone = 'ink',
  width = 'wide',
  className,
  innerClassName,
  children,
}: {
  id?: string;
  tone?: Tone;
  width?: 'wide' | 'prose' | 'narrow' | 'tight';
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn(tones[tone], 'py-[72px] md:py-section', className)}>
      <Container width={width} className={innerClassName}>
        {children}
      </Container>
    </section>
  );
}

/** Eyebrow label above a section heading. Literal caps come from the caller. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('mb-4 font-inter text-xs font-semibold tracking-[0.18em] text-sky', className)}>
      {children}
    </p>
  );
}
