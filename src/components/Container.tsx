import { cn } from '@/lib/cn';

type Width = 'wide' | 'prose' | 'narrow' | 'tight';

const widths: Record<Width, string> = {
  wide: 'max-w-wide',
  prose: 'max-w-prose',
  narrow: 'max-w-narrow',
  tight: 'max-w-tight',
};

export function Container({
  width = 'wide',
  className,
  children,
}: {
  width?: Width;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('mx-auto w-full px-5 sm:px-6 lg:px-8', widths[width], className)}>
      {children}
    </div>
  );
}
