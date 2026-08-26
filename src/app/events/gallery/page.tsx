import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { ButtonLink } from '@/components/Button';
import { Gallery } from '@/components/events/Gallery';
import { galleryImages } from '@/data/gallery';

export const metadata = buildMetadata({
  title: 'Event Photo Gallery',
  description:
    'Photos from events at NexCore — the grand opening, networking nights, workshops, and community gatherings in South St. Louis County.',
  path: '/events/gallery',
  image: galleryImages[0] ?? '/og/default.png',
});

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="EVENT PHOTO GALLERY"
        title="The room,"
        accent="full."
        lead="Grand openings, networking nights, workshops, and the people who showed up."
      />

      <Section>
        <Gallery images={galleryImages} />
      </Section>

      <Section tone="navy" width="prose" className="text-center">
        <h2 className="font-sora text-h2xs font-semibold text-white">
          Want to be in the <span className="o">next one</span>?
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/events" size="lg">
            See upcoming events
          </ButtonLink>
          <ButtonLink href="/coworking#spaces" variant="ghost" size="lg">
            Host an event
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
