import Image from 'next/image';
import type { MemberImage } from '@/lib/members';
import { cn } from '@/lib/cn';

/**
 * A member's logo or photo, with a branded fallback.
 *
 * `src` is null whenever the build-time Drive ingest could not produce a local
 * copy — an unshared file, a wrong format, an oversized file, a Drive outage.
 * Those cases are logged to audit/member-image-failures.md and render the
 * NexCore panel here, exactly as EventArt does for hotlink-blocked artwork.
 */
export function MemberArt({
  src,
  alt,
  fallbackLabel,
  className,
  imageClassName,
  sizes,
  priority = false,
  /** Logos sit inside their box; photos fill it. */
  fit = 'contain',
}: {
  src: MemberImage | null;
  alt: string;
  /** Accessible description of the placeholder, e.g. "Acme Co — no logo yet". */
  fallbackLabel: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  fit?: 'contain' | 'cover';
}) {
  if (src) {
    return (
      <Image
        src={src.src}
        alt={alt}
        width={src.width}
        height={src.height}
        sizes={sizes}
        priority={priority}
        className={cn(fit === 'contain' ? 'object-contain' : 'object-cover', className, imageClassName)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={fallbackLabel}
      className={cn(
        'flex items-center justify-center bg-gradient-to-br from-navy via-ink-lift to-ink',
        className,
      )}
    >
      <Image
        src="/logo/nexcore-mark-tall.svg"
        alt=""
        width={64}
        height={64}
        className="h-auto w-[34%] max-w-[92px] opacity-45"
      />
    </div>
  );
}
