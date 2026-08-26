import Image from 'next/image';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { Section, Eyebrow } from '@/components/Section';
import { Container } from '@/components/Container';
import { ButtonLink } from '@/components/Button';
import { InquiryForm } from '@/components/form/InquiryForm';
import { offices, spaces } from '@/data/coworking';
import { tiers, dayPass, amenityGroups } from '@/data/memberships';
import { site } from '@/data/site';
import { dim } from '@/lib/img';
import { cn } from '@/lib/cn';

export const metadata = buildMetadata({
  title: 'Coworking — Offices, Day Passes & Event Space in South County',
  description:
    'Nearly 11,000 square feet in South St. Louis County. Memberships from $99/month, $25 day passes, 18 private offices, and six rentable spaces including a full Event Center.',
  path: '/coworking',
});

const money = (n: number) => `$${n.toLocaleString('en-US')}`;

export default function CoworkingPage() {
  const availableOffices = offices.filter((o) => o.available);

  return (
    <>
      {/* Intro */}
      <Section>
        <div className="max-w-3xl">
          <Eyebrow>COWORKING</Eyebrow>
          <h1 className="text-balance font-sora text-h2 font-semibold text-white">
            Everything You Need. <span className="o">Nothing You Don&rsquo;t.</span>
          </h1>
          <div className="prose-nex mt-7">
            <p>
              Whether you’re building your first company, growing an established business, meeting
              with clients, recording a podcast, or simply looking for a productive place to work,
              NexCore was designed to support the way you work.
            </p>
            <p>
              From high-speed internet and comfortable workspaces to private offices, meeting rooms,
              event space, and community amenities, every part of the building exists for one
              purpose — to help people build something meaningful.
            </p>
            <p>
              If you’re looking for the stories behind the businesses, entrepreneurs, nonprofits, and
              ideas that have grown here, visit our <Link href="/impact">Impact page</Link>. Here,
              we’ll focus on the space itself and everything available to you the moment you walk
              through the door.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#memberships">View Memberships</ButtonLink>
            <ButtonLink href="#tour" variant="ghost">
              Come see the space →
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* Amenities */}
      <Section id="amenities" tone="lift">
        <div className="max-w-2xl">
          <Eyebrow>AMENITIES</Eyebrow>
          <h2 className="font-sora text-h2sm font-semibold text-white">
            Everything you need to work, collaborate, and{' '}
            <span className="o">build your business</span>.
          </h2>
          <p className="mt-5 font-inter text-[17px] text-white/65">
            All included with your membership — 40+ amenities and member benefits.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {amenityGroups.map((g) => (
            <div key={g.title} className="rounded-card border border-white/10 bg-ink p-7">
              <h3 className="font-sora text-lg font-semibold text-white">{g.title}</h3>
              {g.intro && (
                <p className="mt-2 font-inter text-[14px] leading-relaxed text-white/55">
                  {g.intro}
                </p>
              )}
              <ul className="mt-4 space-y-2">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 font-inter text-[15px] leading-relaxed text-white/70"
                  >
                    <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-sky" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Open spaces */}
      <Section id="open-spaces">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>INSIDE NEXCORE</Eyebrow>
            <h2 className="text-balance font-sora text-h2sm font-semibold text-white">
              Nearly <span className="o">11,000 Square Feet</span> of Purposefully Designed Space
            </h2>
            <p className="mt-6 font-inter text-[17px] leading-relaxed text-white/70">
              Inside NexCore, you&rsquo;ll find more than desks. Open coworking seating,
              collaborative areas, quiet work zones, two kitchens, a podcast studio, conference
              rooms, and a purpose-built Event Center.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-6">
              {[
                ['20+', 'workspace configurations'],
                ['24/7', 'member building access'],
                ['18', 'private offices'],
                ['6', 'rentable spaces'],
              ].map(([v, l]) => (
                <div key={l} className="border-t border-white/12 pt-4">
                  <dt className="font-sora text-[30px] font-semibold leading-none text-sky">{v}</dt>
                  <dd className="mt-2 font-inter text-[14px] text-white/60">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              '/img/nexcore-coworking-amenitites1.png',
              '/img/nexcore-coworking-upstairs.jpg',
              '/img/coworking-at-thenexcore.png',
              '/img/bistro1.png',
            ].map((src) => (
              <div key={src} className="overflow-hidden rounded-card border border-white/10">
                <Image
                  src={src}
                  alt=""
                  {...dim(src)}
                  sizes="(max-width: 1024px) 50vw, 280px"
                  className="aspect-[4/3] h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Memberships */}
      <Section id="memberships" tone="lift">
        <div className="max-w-2xl">
          <Eyebrow>MEMBERSHIPS</Eyebrow>
          <h2 className="font-sora text-h2sm font-semibold text-white">
            Choose the membership that fits your business today — with{' '}
            <span className="o">room to grow tomorrow</span>.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.id}
              className={cn(
                'flex flex-col rounded-card border p-8',
                t.featured ? 'border-sky/60 bg-sky/[0.06]' : 'border-white/10 bg-ink',
              )}
            >
              {t.badge && (
                <span className="mb-4 inline-block self-start rounded-pill bg-sky px-3 py-1 font-inter text-[12px] font-semibold text-white">
                  {t.badge}
                </span>
              )}
              <h3 className="font-sora text-xl font-semibold text-white">{t.name}</h3>
              <p className="mt-4">
                <span className="font-sora text-[42px] font-semibold leading-none text-white">
                  {t.priceLabel}
                </span>
                <span className="ml-1 font-inter text-[16px] text-white/50">{t.cadence}</span>
              </p>
              {t.note && <p className="mt-2 font-inter text-[14px] text-sky">{t.note}</p>}
              <p className="mt-4 font-inter text-[15px] leading-relaxed text-white/65">{t.blurb}</p>

              <p className="mt-6 font-inter text-[13px] font-semibold tracking-[0.1em] text-white/45">
                {t.includesLabel}
              </p>
              <ul className="mt-3 flex-1 space-y-2">
                {t.includes.map((i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 font-inter text-[15px] leading-relaxed text-white/75"
                  >
                    <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-sky" />
                    {i}
                  </li>
                ))}
              </ul>

              <ButtonLink
                href={t.cta.href}
                external={t.cta.external}
                variant={t.featured ? 'primary' : 'ghost'}
                className="mt-7 w-full"
              >
                {t.cta.label}
              </ButtonLink>
            </div>
          ))}
        </div>

        {/* Membership enquiry */}
        <div id="membership-enquiry" className="mt-14 rounded-card border border-white/10 bg-ink p-8">
          <h3 className="font-sora text-2xl font-semibold text-white">
            Let&rsquo;s get you started.
          </h3>
          <p className="mt-2 max-w-xl font-inter text-[15px] leading-relaxed text-white/65">
            Tell us which membership fits and we&rsquo;ll take it from there. A {' '}
            <strong className="text-white">$50 deposit</strong> holds your spot and is applied to
            your first month.
          </p>
          <div className="mt-7 max-w-2xl">
            <InquiryForm
              kind="membership"
              submitLabel="Send Enquiry"
              options={tiers.map((t) => ({
                value: `${t.name} — ${t.priceLabel}${t.cadence}`,
                label: `${t.name} — ${t.priceLabel}${t.cadence}`,
              }))}
            />
          </div>
        </div>
      </Section>

      {/* Day pass */}
      <Section id="day-pass">
        <div className="grid items-center gap-10 rounded-card border border-white/10 bg-ink-lift p-8 md:grid-cols-2 md:p-12">
          <div>
            <Eyebrow>DAY PASS</Eyebrow>
            <h2 className="font-sora text-h2xs font-semibold text-white">Pick your day.</h2>
            <p className="mt-5 font-inter text-[16px] leading-relaxed text-white/70">
              {dayPass.blurb}
            </p>
            <p className="mt-6">
              <span className="font-sora text-[44px] font-semibold leading-none text-sky">
                {dayPass.priceLabel}
              </span>
              <span className="ml-2 font-inter text-[15px] text-white/50">per day</span>
            </p>
            <dl className="mt-6 space-y-1 font-inter text-[14px] text-white/55">
              <dt className="font-semibold text-white/70">Open Hours</dt>
              {site.hours.map((h) => (
                <dd key={h.days}>
                  {h.days} {h.time}
                </dd>
              ))}
            </dl>
          </div>

          <div className="rounded-card border border-white/10 bg-ink p-7">
            <p className="font-inter text-[15px] leading-relaxed text-white/70">
              Payment opens in a secure Square window — this page stays right here.
            </p>
            <ButtonLink
              href={dayPass.checkoutUrl}
              external
              size="lg"
              className="mt-6 w-full"
            >
              Pay {dayPass.priceLabel}
            </ButtonLink>
            <p className="mt-4 font-inter text-[13px] text-white/40">
              Questions first?{' '}
              <Link href="/contact" className="text-sky hover:text-sky-light">
                Get in touch
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>

      {/* Private offices */}
      <Section id="offices" tone="lift">
        <div className="max-w-2xl">
          <Eyebrow>PRIVATE OFFICES</Eyebrow>
          <h2 className="font-sora text-h2sm font-semibold text-white">
            Dedicated office space for businesses <span className="o">ready to grow</span>.
          </h2>
          <p className="mt-5 font-inter text-[17px] text-white/65">
            {availableOffices.length} of {offices.length} offices currently available, from{' '}
            {money(Math.min(...availableOffices.map((o) => o.price)))} to{' '}
            {money(Math.max(...offices.map((o) => o.price)))} per month.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {offices.map((o) => (
            <Link
              key={o.id}
              href={`/coworking/offices/${o.id}`}
              className={cn(
                'group flex flex-col overflow-hidden rounded-card border bg-ink transition-colors',
                o.available ? 'border-white/10 hover:border-sky/50' : 'border-white/8 opacity-70',
              )}
            >
              {o.photos[0] && (
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={o.photos[0]}
                    alt=""
                    {...dim(o.photos[0])}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-sora text-lg font-semibold text-white">{o.name}</h3>
                  <span
                    className={cn(
                      'shrink-0 rounded-pill px-2.5 py-1 font-inter text-[12px] font-semibold',
                      o.available ? 'bg-sky/15 text-sky' : 'bg-white/10 text-white/50',
                    )}
                  >
                    {o.available ? 'Available' : 'Occupied'}
                  </span>
                </div>
                <p className="mt-2 font-sora text-[24px] font-semibold text-white">
                  {money(o.price)}
                  <span className="ml-1 font-inter text-[14px] font-normal text-white/45">
                    /month
                  </span>
                </p>
                <p className="mt-3 flex-1 font-inter text-[14px] leading-relaxed text-white/60">
                  {o.desc}
                </p>
                <p className="mt-4 font-inter text-[13px] text-white/45">
                  {o.capacity} · {o.window}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 rounded-card border border-white/10 bg-ink p-8">
          <h3 className="font-sora text-2xl font-semibold text-white">
            Not Sure Which Office Fits Your Business?
          </h3>
          <p className="mt-2 max-w-xl font-inter text-[15px] leading-relaxed text-white/65">
            Tell us what you need and we&rsquo;ll point you to the right room.
          </p>
          <div className="mt-7 max-w-2xl">
            <InquiryForm
              kind="office"
              submitLabel="Reserve your office"
              options={offices
                .filter((o) => o.available)
                .map((o) => ({ value: o.name, label: `${o.name} — ${money(o.price)}/mo` }))}
            />
          </div>
        </div>
      </Section>

      {/* Rentable spaces */}
      <Section id="spaces">
        <div className="max-w-2xl">
          <Eyebrow>RENTABLE SPACES</Eyebrow>
          <h2 className="font-sora text-h2sm font-semibold text-white">
            Professional rooms for meetings, recording, collaboration, and{' '}
            <span className="o">events</span>.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {spaces.map((s) => (
            <Link
              key={s.id}
              href={`/coworking/spaces/${s.id}`}
              className="group flex flex-col overflow-hidden rounded-card border border-white/10 bg-ink-lift transition-colors hover:border-sky/50"
            >
              {s.photos[0] && (
                <div className="aspect-[16/10] overflow-hidden">
                  <Image
                    src={s.photos[0]}
                    alt=""
                    {...dim(s.photos[0])}
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <p className="font-inter text-[12px] font-semibold tracking-[0.1em] text-sky">
                  {s.tag}
                </p>
                <h3 className="mt-2 font-sora text-xl font-semibold text-white">{s.name}</h3>
                <p className="mt-3 flex-1 font-inter text-[14px] leading-relaxed text-white/60">
                  {s.teaser}
                </p>
                <p className="mt-4 font-sora text-[22px] font-semibold text-white">
                  {money(s.rate)}
                  <span className="ml-1 font-inter text-[14px] font-normal text-white/45">
                    /{s.unit}
                  </span>
                  {s.member !== null && (
                    <span className="ml-3 font-inter text-[14px] font-medium text-sky">
                      {money(s.member)}/{s.unit} members
                    </span>
                  )}
                </p>
                {s.min && <p className="mt-1 font-inter text-[13px] text-white/40">{s.min}</p>}
                <p className="mt-3 font-inter text-[13px] text-white/45">{s.capacity}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 rounded-card border border-white/10 bg-ink-lift p-8">
          <h3 className="font-sora text-2xl font-semibold text-white">Reservation Request</h3>
          <p className="mt-2 max-w-xl font-inter text-[15px] leading-relaxed text-white/65">
            Planning something bigger? Tell us what you have in mind and we&rsquo;ll confirm
            availability. For larger events or custom room configurations, contact NexCore for a
            customized quote.
          </p>
          <div className="mt-7 max-w-2xl">
            <InquiryForm
              kind="space"
              submitLabel="Request this space"
              options={spaces.map((s) => ({
                value: s.name,
                label: `${s.name} — ${money(s.rate)}/${s.unit}`,
              }))}
            />
          </div>
        </div>
      </Section>

      {/* Tour */}
      <Section id="tour" tone="navy">
        <Container width="prose" className="!px-0">
          <Eyebrow>TAKE A TOUR</Eyebrow>
          <h2 className="font-sora text-h2xs font-semibold text-white">Come see the space.</h2>
          <p className="mt-4 font-inter text-[16px] leading-relaxed text-white/75">
            The fastest way to understand NexCore is to walk through it. Tell us when works and
            we&rsquo;ll meet you at the door.
          </p>
          <div className="mt-8">
            <InquiryForm kind="tour" submitLabel="Book my tour" />
          </div>
        </Container>
      </Section>
    </>
  );
}
