import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { Section, Eyebrow } from '@/components/Section';
import { JsonLd } from '@/components/JsonLd';
import { EventArt } from '@/components/events/EventArt';
import { ButtonLink } from '@/components/Button';
import { getEvents, getEventBySlug, eventJsonLd, formatEventDate } from '@/lib/events';
import { site, formattedAddress } from '@/data/site';

export const revalidate = 300;

export async function generateStaticParams() {
  const { all } = await getEvents();
  return all.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) {
    return buildMetadata({ title: 'Event not found', description: '', path: '/events', noIndex: true });
  }

  return buildMetadata({
    title: event.title,
    description: event.summary,
    path: `/events/${event.slug}`,
    image: event.img ?? '/og/default.png',
    type: 'article',
  });
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const { seriesMap } = await getEvents();
  const siblings = event.series ? (seriesMap[event.series] ?? []).filter((e) => e.slug !== event.slug) : [];

  // Sheet descriptions arrive as plain text with newlines.
  const paragraphs = event.desc.split(/\n{1,}/).map((p) => p.trim()).filter(Boolean);

  const locationLine =
    event.locationType === 'online'
      ? 'Online'
      : [event.locationName, event.locationAddress || formattedAddress].filter(Boolean).join(' · ');

  return (
    <>
      <JsonLd data={eventJsonLd(event)} />

      <Section>
        <Link href="/events" className="font-inter text-[14px] text-sky hover:text-sky-light">
          ← All events
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_360px]">
          <article>
            {event.series && (
              <span className="mb-4 inline-block rounded-pill bg-sky/15 px-3 py-1 font-inter text-[13px] font-semibold text-sky">
                {event.series}
                {event.seriesOrder ? ` · Part ${event.seriesOrder}` : ''}
              </span>
            )}

            {event.isPast && (
              <p className="mb-4 inline-block rounded-pill border border-white/15 px-3 py-1 font-inter text-[13px] text-white/55">
                This event has passed
              </p>
            )}

            <h1 className="text-balance font-sora text-h2sm font-semibold text-white">
              {event.title}
            </h1>

            <p className="mt-5 font-inter text-[17px] leading-relaxed text-white/70">
              {event.summary}
            </p>

            <div className="mt-9 overflow-hidden rounded-card border border-white/10">
              <EventArt
                src={event.img}
                title={event.title}
                width={1200}
                height={675}
                priority
                sizes="(max-width: 1024px) 100vw, 760px"
                className="aspect-[16/9] h-auto w-full object-cover"
              />
            </div>

            {paragraphs.length > 0 && (
              <div className="prose-nex mt-10">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}

            {event.gallery.length > 0 && (
              <section className="mt-14">
                <h2 className="font-sora text-h3 font-semibold text-white">Photos</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {event.gallery.map((src, i) => (
                    <div key={src} className="overflow-hidden rounded-card border border-white/10">
                      <Image
                        src={src}
                        alt={`${event.title} — photo ${i + 1}`}
                        width={800}
                        height={600}
                        sizes="(max-width: 640px) 100vw, 420px"
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {siblings.length > 0 && (
              <section className="mt-14">
                <h2 className="font-sora text-h3 font-semibold text-white">
                  More in <span className="o">{event.series}</span>
                </h2>
                <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
                  {siblings.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/events/${s.slug}`}
                        className="group flex items-baseline justify-between gap-4 py-4"
                      >
                        <span className="font-sora text-[16px] font-medium text-white group-hover:text-sky">
                          {s.seriesOrder ? `${s.seriesOrder}. ` : ''}
                          {s.title}
                        </span>
                        <time className="shrink-0 font-inter text-[13px] text-white/45">
                          {formatEventDate(s.startTS, { weekday: undefined })}
                        </time>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>

          {/* Details rail */}
          <aside className="lg:sticky lg:top-[100px] lg:self-start">
            <div className="rounded-card border border-white/10 bg-ink-lift p-7">
              <Eyebrow>DETAILS</Eyebrow>

              <dl className="space-y-5">
                <div>
                  <dt className="font-inter text-[13px] font-semibold tracking-[0.08em] text-white/45">
                    Date
                  </dt>
                  <dd className="mt-1 font-inter text-[15px] text-white/85">
                    <time dateTime={event.startTS}>{formatEventDate(event.startTS)}</time>
                  </dd>
                </div>

                {event.timeLabel && (
                  <div>
                    <dt className="font-inter text-[13px] font-semibold tracking-[0.08em] text-white/45">
                      Time
                    </dt>
                    <dd className="mt-1 font-inter text-[15px] text-white/85">{event.timeLabel}</dd>
                  </div>
                )}

                <div>
                  <dt className="font-inter text-[13px] font-semibold tracking-[0.08em] text-white/45">
                    Location
                  </dt>
                  <dd className="mt-1 font-inter text-[15px] leading-relaxed text-white/85">
                    {locationLine}
                  </dd>
                  {event.locationType !== 'online' && (
                    <a
                      href={site.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block font-inter text-[14px] text-sky hover:text-sky-light"
                    >
                      Get directions →
                    </a>
                  )}
                </div>

                <div>
                  <dt className="font-inter text-[13px] font-semibold tracking-[0.08em] text-white/45">
                    Admission
                  </dt>
                  <dd className="mt-1 font-inter text-[15px] text-white/85">{event.priceLabel}</dd>
                </div>
              </dl>

              {/* Outbound ticket links only - no iframe embeds. */}
              {!event.isPast && (event.link || event.link2) && (
                <div className="mt-7 space-y-3">
                  {event.link && (
                    <ButtonLink href={event.link} external className="w-full">
                      {event.linkLabel}
                    </ButtonLink>
                  )}
                  {event.link2 && (
                    <ButtonLink href={event.link2} external variant="ghost" className="w-full">
                      {event.link2Label ?? 'More tickets'}
                    </ButtonLink>
                  )}
                  <p className="font-inter text-[12px] leading-relaxed text-white/40">
                    Registration opens in a new tab.
                  </p>
                </div>
              )}

              {event.isPast && (
                <ButtonLink href="/events" variant="ghost" className="mt-7 w-full">
                  See upcoming events
                </ButtonLink>
              )}
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
