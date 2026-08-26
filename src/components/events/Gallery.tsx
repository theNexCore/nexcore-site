'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { dim } from '@/lib/img';

/**
 * Photo grid with a keyboard-accessible lightbox.
 * No third-party lightbox library.
 */
export function Gallery({ images }: { images: string[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpen((i) => (i === null ? null : (i + delta + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, step]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open photo ${i + 1} of ${images.length}`}
              className="block w-full overflow-hidden rounded-card border border-white/10 transition-colors hover:border-sky/50 focus-visible:border-sky"
            >
              <Image
                src={src}
                alt=""
                {...dim(src)}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
                className="aspect-square h-full w-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${open + 1} of ${images.length}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-pill border border-white/20 px-4 py-2 font-inter text-[14px] text-white hover:border-sky hover:text-sky"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous photo"
            className="absolute left-3 rounded-pill border border-white/20 px-4 py-3 font-inter text-white hover:border-sky hover:text-sky sm:left-6"
          >
            ←
          </button>

          <Image
            src={images[open]}
            alt={`Photo ${open + 1} of ${images.length}`}
            {...dim(images[open])}
            sizes="90vw"
            className="max-h-[85dvh] w-auto max-w-full rounded-card object-contain"
          />

          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next photo"
            className="absolute right-3 rounded-pill border border-white/20 px-4 py-3 font-inter text-white hover:border-sky hover:text-sky sm:right-6"
          >
            →
          </button>
        </div>
      )}
    </>
  );
}
