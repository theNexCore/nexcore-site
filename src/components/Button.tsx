import Link from 'next/link';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'red';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-sky text-white hover:bg-sky-light',
  secondary: 'bg-white text-ink hover:bg-white/90',
  ghost: 'border border-white/25 text-white hover:border-sky hover:text-sky',
  red: 'bg-red text-white hover:bg-red-bright',
};

// Padding values lifted from the live site's button CSS.
const sizes: Record<Size, string> = {
  sm: 'px-[18px] py-[9px] text-[14px]',
  md: 'px-[22px] py-[11px] text-[15px]',
  lg: 'px-[44px] py-[17px] text-[16px]',
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-pill font-inter font-semibold ' +
  'transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60';

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

interface LinkProps extends CommonProps {
  href: string;
  /** Set for outbound links; adds target and rel automatically. */
  external?: boolean;
}

export function ButtonLink({
  href,
  external,
  variant = 'primary',
  size = 'md',
  className,
  children,
}: LinkProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}
