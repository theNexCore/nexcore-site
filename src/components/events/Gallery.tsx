'use client';

import { useState } from 'react';
import Image from 'next/image';
import { dim } from '@/lib/img';
import { Lightbox } from '@/components/Lightbox';

/**
 * Event photo grid. Viewer logic lives in the shared Lightbox, which the
 * office and space room galleries use too.
 */
export function Gallery({ images }: { images: string[] }) {
  const [open, setOpen] = useState<number | null>(null);

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

      <Lightbox
        images={images}
        open={open}
        onClose={() => setOpen(null)}
        onNavigate={setOpen}
        label="NexCore event"
      />
    </>
  );
}
