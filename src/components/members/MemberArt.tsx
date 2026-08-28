import Image from 'next/image';
import type { MemberImage } from '@/lib/members';
import { cn } from '@/lib/cn';

/**
 * The member's face: their photo, in a standardised square.
 *
 * A member is a person, so the person's picture is what identifies them in the
 * directory. Photos arrive at whatever size and crop the member supplied, so
 * the box is a fixed square and the image covers it — every tile in a grid is
 * then the same shape and size regardless of the source.
 *
 * Falling back in order: photo, then the logo (contained on its white plate,
 * never cover-cropped, which would slice a wordmark in half), then the branded
 * placeholder. `className` supplies the size, e.g. "h-[84px] w-[84px]".
 */
export function MemberFace({
  src,
  logo,
  business,
  person,
  className,
  sizes,
  priority = false,
}: {
  src: MemberImage | null;
  logo?: MemberImage | null;
  business: string;
  /** The person's name, used for the alt text when there is one. */
  person?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={cn('overflow-hidden rounded-lg bg-ink', className)}>
        <Image
          src={src.src}
          alt={person ? `${person}, ${business}` : business}
          width={src.width}
          height={src.height}
          sizes={sizes}
          priority={priority}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (logo) {
    return (
      <div className={cn('flex items-center justify-center rounded-lg bg-white p-2', className)}>
        <Image
          src={logo.src}
          alt={`${business} logo`}
          width={logo.width}
          height={logo.height}
          sizes={sizes}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`${person || business} — no photo available`}
      className={cn(
        'flex items-center justify-center rounded-lg bg-gradient-to-br from-navy via-ink-lift to-ink',
        className,
      )}
    >
      <Image
        src="/logo/nexcore-mark-tall.svg"
        alt=""
        width={64}
        height={64}
        className="h-1/2 w-auto opacity-40"
      />
    </div>
  );
}

/**
 * A member's logo on its white plate.
 *
 * The plate is sized by HEIGHT only and its width hugs the artwork, so it
 * takes the logo's own proportions: a square logo gets a square plate, a wide
 * wordmark gets a wide one. Fixing both dimensions instead would strand a
 * square logo in the middle of a rectangle of white — which is exactly what a
 * full-width plate did to the first real member's 2000x2000 logo.
 *
 * The plate is white because member logos arrive as whatever the business
 * has: dark artwork on a baked-in white background, or dark artwork on
 * transparency. Both need a light ground on this dark theme. A logo with no
 * artwork falls back to a square dark tile instead, so the branded
 * placeholder is never framed in white.
 *
 * `className` supplies the height, e.g. "h-[84px]".
 */
export function MemberLogo({
  src,
  business,
  className,
  sizes,
}: {
  src: MemberImage | null;
  business: string;
  className?: string;
  sizes?: string;
}) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={`${business} — no logo available`}
        className={cn(
          'flex aspect-square items-center justify-center rounded-lg bg-white/[0.04]',
          className,
        )}
      >
        <Image
          src="/logo/nexcore-mark-tall.svg"
          alt=""
          width={64}
          height={64}
          className="h-1/2 w-auto opacity-40"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex w-auto max-w-full items-center justify-center rounded-lg bg-white p-2',
        className,
      )}
    >
      <Image
        src={src.src}
        alt={`${business} logo`}
        width={src.width}
        height={src.height}
        sizes={sizes}
        className="h-full w-auto max-w-full object-contain"
      />
    </div>
  );
}
