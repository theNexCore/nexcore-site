import Image from 'next/image';
import { cn } from '@/lib/cn';

/**
 * Event artwork, with a branded fallback.
 *
 * Some sheet rows carry Eventbrite CDN URLs, which are hotlink-blocked (403
 * for every origin). `repairImageUrl` nulls those out, so this renders a
 * NexCore-branded panel instead of a broken image.
 */
export function EventArt({
  src,
  title,
  className,
  priority = false,
  sizes,
  width = 640,
  height = 360,
}: {
  src: string | null;
  title: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={title}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={className}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${title} — no event image available`}
      className={cn(
        'flex items-center justify-center bg-gradient-to-br from-navy via-ink-lift to-ink',
        className,
      )}
    >
      <Image
        src="/logo/nexcore-logo-primary.svg"
        alt=""
        width={200}
        height={50}
        className="h-auto w-[46%] max-w-[220px] opacity-70"
      />
    </div>
  );
}
