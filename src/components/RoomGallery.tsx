'use client';

import { useState } from 'react';
import Image from 'next/image';
import { dim } from '@/lib/img';
import { Lightbox } from './Lightbox';

/**
 * Photo gallery for a single room — an office or a rentable space.
 *
 * Counts vary from 1 to 21, so the layout adapts: one photo renders as a
 * plain lead image, more than one gets a lead plus a thumbnail strip. Every
 * photo opens the shared lightbox.
 *
 * The old site opened room photos in a lightbox on the coworking page; the
 * rebuild gives each room its own indexable page, and this restores the
 * viewer within it.
 */
export function RoomGallery({ photos, name }: { photos: string[]; name: string }) {
  const [open, setOpen] = useState<number | null>(null);

  if (photos.length === 0) return null;

  const [lead, ...rest] = photos;

  return (
    <section className="mt-12">
      <h2 className="sr-only">{name} photos</h2>

      <button
        type="button"
        onClick={() => setOpen(0)}
        aria-label={`View ${name} photos, starting at 1 of ${photos.length}`}
        className="group block w-full overflow-hidden rounded-card border border-white/10 transition-colors hover:border-sky/50 focus-visible:border-sky"
      >
        <Image
          src={lead}
          alt={`${name} — photo 1 of ${photos.length}`}
          {...dim(lead)}
          sizes="(max-width: 1024px) 100vw, 760px"
          className="aspect-[16/10] h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </button>

      {rest.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {rest.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setOpen(i + 1)}
                aria-label={`View ${name} photo ${i + 2} of ${photos.length}`}
                className="block w-full overflow-hidden rounded-lg border border-white/10 transition-colors hover:border-sky/50 focus-visible:border-sky"
              >
                <Image
                  src={src}
                  alt={`${name} — photo ${i + 2} of ${photos.length}`}
                  {...dim(src)}
                  sizes="(max-width: 640px) 33vw, 160px"
                  className="aspect-square h-full w-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 font-inter text-[13px] text-white/45">
        {photos.length === 1
          ? 'Tap the photo to enlarge.'
          : `${photos.length} photos — tap any to enlarge.`}
      </p>

      <Lightbox
        images={photos}
        open={open}
        onClose={() => setOpen(null)}
        onNavigate={setOpen}
        label={name}
      />
    </section>
  );
}
