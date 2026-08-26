import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { Section, Eyebrow } from '@/components/Section';
import { InquiryForm } from '@/components/form/InquiryForm';
import { spaces } from '@/data/coworking';
import { dim } from '@/lib/img';

export function generateStaticParams() {
  return spaces.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const space = spaces.find((s) => s.id === slug);
  if (!space) return buildMetadata({ title: 'Space', description: '', path: '/coworking' });

  return buildMetadata({
    title: `${space.name} — $${space.rate}/${space.unit}`,
    description: `${space.teaser} ${space.capacity}. Rentable ${space.tag.toLowerCase()} at NexCore in South St. Louis County.`,
    path: `/coworking/spaces/${space.id}`,
    image: space.photos[0] ?? '/og/default.png',
  });
}

export default async function SpacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const space = spaces.find((s) => s.id === slug);
  if (!space) notFound();

  const money = (n: number) => `$${n.toLocaleString('en-US')}`;

  return (
    <Section>
      <Link href="/coworking#spaces" className="font-inter text-[14px] text-sky hover:text-sky-light">
        ← All rentable spaces
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          <Eyebrow>{space.tag.toUpperCase()}</Eyebrow>
          <h1 className="font-sora text-h2sm font-semibold text-white">{space.name}</h1>

          <p className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="font-sora text-[40px] font-semibold leading-none text-sky">
              {money(space.rate)}
              <span className="ml-1 font-inter text-[16px] font-normal text-white/45">
                /{space.unit}
              </span>
            </span>
            {space.member !== null && (
              <span className="font-inter text-[15px] font-medium text-white/70">
                {money(space.member)}/{space.unit} for members
              </span>
            )}
          </p>

          {space.altRate && space.altUnit && (
            <p className="mt-2 font-inter text-[15px] text-white/60">
              Or {money(space.altRate)} per {space.altUnit}.
            </p>
          )}
          {space.min && <p className="mt-2 font-inter text-[14px] text-white/45">{space.min}</p>}

          <p className="mt-6 font-inter text-[17px] leading-relaxed text-white/70">{space.desc}</p>

          <p className="mt-6 font-inter text-[15px] text-white/60">
            <span className="font-semibold text-white/80">Capacity:</span> {space.capacity}
          </p>

          {space.configs && space.configs.length > 0 && (
            <div className="mt-10">
              <h2 className="font-sora text-lg font-semibold text-white">Room configurations</h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {space.configs.map((c) => (
                  <div key={c.label} className="border-t border-white/12 pt-3">
                    <dt className="font-inter text-[14px] text-white/60">{c.label}</dt>
                    <dd className="mt-1 font-sora text-[20px] font-semibold text-white">
                      {c.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {space.features && space.features.length > 0 && (
            <div className="mt-10">
              <h2 className="font-sora text-lg font-semibold text-white">What&rsquo;s included</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {space.features.map((f) => (
                  <li
                    key={f}
                    className="flex gap-2.5 font-inter text-[15px] leading-relaxed text-white/70"
                  >
                    <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-sky" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {space.featureGroups?.map((g) => (
            <div key={g.title} className="mt-10">
              <h2 className="font-sora text-lg font-semibold text-white">{g.title}</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {g.items.map((f) => (
                  <li
                    key={f}
                    className="flex gap-2.5 font-inter text-[15px] leading-relaxed text-white/70"
                  >
                    <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-sky" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {space.quote && (
            <p className="mt-10 rounded-card border border-sky/25 bg-sky/[0.06] p-6 font-inter text-[15px] leading-relaxed text-white/75">
              {space.quote}
            </p>
          )}

          {space.photos.length > 0 && (
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {space.photos.map((src, i) => (
                <div key={src} className="overflow-hidden rounded-card border border-white/10">
                  <Image
                    src={src}
                    alt={`${space.name} — photo ${i + 1}`}
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
            <h2 className="font-sora text-xl font-semibold text-white">Reservation Request</h2>
            <p className="mt-2 font-inter text-[14px] leading-relaxed text-white/60">
              Tell us when you need {space.name} and we&rsquo;ll confirm availability.
            </p>
            <div className="mt-6">
              <InquiryForm
                kind="space"
                submitLabel="Request this space"
                defaultOption={space.name}
                options={spaces.map((s) => ({
                  value: s.name,
                  label: `${s.name} — ${money(s.rate)}/${s.unit}`,
                }))}
              />
            </div>
          </div>
        </aside>
      </div>
    </Section>
  );
}
