'use client';

import { useCallback, useEffect } from 'react';
import Image from 'next/image';
import { dim } from '@/lib/img';

/**
 * Shared full-screen image viewer.
 *
 * Used by the event photo gallery and by the room galleries on office and
 * space pages. Keyboard-driven: Escape closes, arrows move. Wraps at both
 * ends so it never dead-ends.
 *
 * `open` is the index of the visible image, or null when closed.
 */
export function Lightbox({
  images,
  open,
  onClose,
  onNavigate,
  label = 'Photo',
}: {
  images: string[];
  open: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  /** Used in the accessible name, e.g. "Executive Suite". */
  label?: string;
}) {
  const step = useCallback(
    (delta: number) => {
      if (open === null) return;
      onNavigate((open + delta + images.length) % images.length);
    },
    [open, images.length, onNavigate],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose, step]);

  if (open === null) return null;

  const single = images.length < 2;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${label} — photo ${open + 1} of ${images.length}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm sm:p-8"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 rounded-pill border border-white/20 px-4 py-2 font-inter text-[14px] text-white transition-colors hover:border-sky hover:text-sky"
      >
        Close
      </button>

      {!single && (
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous photo"
          className="absolute left-3 z-10 rounded-pill border border-white/20 px-4 py-3 font-inter text-white transition-colors hover:border-sky hover:text-sky sm:left-6"
        >
          ←
        </button>
      )}

      <figure className="m-0 flex max-h-full flex-col items-center gap-4">
        <Image
          src={images[open]}
          alt={`${label} — photo ${open + 1} of ${images.length}`}
          {...dim(images[open])}
          sizes="90vw"
          className="max-h-[80dvh] w-auto max-w-full rounded-card object-contain"
        />
        {!single && (
          <figcaption className="font-inter text-[13px] tabular-nums text-white/55">
            {open + 1} / {images.length}
          </figcaption>
        )}
      </figure>

      {!single && (
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next photo"
          className="absolute right-3 z-10 rounded-pill border border-white/20 px-4 py-3 font-inter text-white transition-colors hover:border-sky hover:text-sky sm:right-6"
        >
          →
        </button>
      )}
    </div>
  );
}
