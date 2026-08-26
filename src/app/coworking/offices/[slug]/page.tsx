import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { Section, Eyebrow } from '@/components/Section';
import { InquiryForm } from '@/components/form/InquiryForm';
import { offices } from '@/data/coworking';
import { dim } from '@/lib/img';

export function generateStaticParams() {
  return offices.map((o) => ({ slug: o.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const office = offices.find((o) => o.id === slug);
  if (!office) return buildMetadata({ title: 'Office', description: '', path: '/coworking' });

  return buildMetadata({
    title: `${office.name} — $${office.price.toLocaleString('en-US')}/month`,
    description: `${office.desc} ${office.capacity}. ${office.window}. Private office at NexCore in South St. Louis County.`,
    path: `/coworking/offices/${office.id}`,
    image: office.photos[0] ?? '/og/default.png',
  });
}

export default async function OfficePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const office = offices.find((o) => o.id === slug);
  if (!office) notFound();

  const money = (n: number) => `$${n.toLocaleString('en-US')}`;

  return (
    <>
      <Section>
        <Link
          href="/coworking#offices"
          className="font-inter text-[14px] text-sky hover:text-sky-light"
        >
          ← All private offices
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_380px]">
          <div>
            <Eyebrow>PRIVATE OFFICE</Eyebrow>
            <h1 className="font-sora text-h2sm font-semibold text-white">{office.name}</h1>

            <div className="mt-6 flex flex-wrap items-baseline gap-4">
              <p className="font-sora text-[40px] font-semibold leading-none text-sky">
                {money(office.price)}
                <span className="ml-1 font-inter text-[16px] font-normal text-white/45">
                  /month
                </span>
              </p>
              <span
                className={
                  office.available
                    ? 'rounded-pill bg-sky/15 px-3 py-1 font-inter text-[13px] font-semibold text-sky'
                    : 'rounded-pill bg-white/10 px-3 py-1 font-inter text-[13px] font-semibold text-white/50'
                }
              >
                {office.available ? 'Available' : 'Currently occupied'}
              </span>
            </div>

            <p className="mt-6 font-inter text-[17px] leading-relaxed text-white/70">
              {office.desc}
            </p>
            {office.feature && (
              <p className="mt-4 font-inter text-[16px] leading-relaxed text-white/70">
                {office.feature}
              </p>
            )}

            <dl className="mt-8 grid gap-5 sm:grid-cols-3">
              {[
                ['Capacity', office.capacity],
                ['Natural light', office.window],
                ['Guests', office.guests],
              ].map(([label, value]) => (
                <div key={label} className="border-t border-white/12 pt-4">
                  <dt className="font-inter text-[13px] font-semibold tracking-[0.08em] text-white/45">
                    {label}
                  </dt>
                  <dd className="mt-2 font-inter text-[15px] leading-relaxed text-white/80">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            {office.photos.length > 0 && (
              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                {office.photos.map((src, i) => (
                  <div
                    key={src}
                    className="overflow-hidden rounded-card border border-white/10"
                  >
                    <Image
                      src={src}
                      alt={`${office.name} — photo ${i + 1}`}
                      {...dim(src)}
                      priority={i === 0}
                      sizes="(max-width: 640px) 100vw, 420px"
                      className="h-auto w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-[100px] lg:self-start">
            <div className="rounded-card border border-white/10 bg-ink-lift p-7">
              <h2 className="font-sora text-xl font-semibold text-white">
                {office.available ? 'Reserve your office.' : 'Ask about availability.'}
              </h2>
              <p className="mt-2 font-inter text-[14px] leading-relaxed text-white/60">
                {office.available
                  ? 'Send us a note and we’ll walk you through next steps.'
                  : 'This office is currently occupied — tell us what you need and we’ll let you know when something opens up.'}
              </p>
              <div className="mt-6">
                <InquiryForm
                  kind="office"
                  submitLabel="Send enquiry"
                  defaultOption={office.name}
                  options={offices.map((o) => ({
                    value: o.name,
                    label: `${o.name} — ${money(o.price)}/mo${o.available ? '' : ' (occupied)'}`,
                  }))}
                />
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
