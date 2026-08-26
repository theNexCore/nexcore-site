import { buildMetadata } from '@/lib/seo';
import { Section, Eyebrow } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { ContactForm } from '@/components/form/ContactForm';
import { site } from '@/data/site';

export const metadata = buildMetadata({
  title: 'Contact NexCore',
  description:
    'Call, visit, or send us a message. NexCore is at 11820 Tesson Ferry Road, Ste 1000, St. Louis, MO 63128. Phone 314.433.9330.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="CONTACT US"
        title="Get in"
        accent="Touch"
        lead="Call, visit, or send us a message — whatever's easiest. We'd love to hear from you."
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[340px_1fr]">
          {/* Details */}
          <div className="space-y-10">
            <div>
              <Eyebrow>CALL</Eyebrow>
              <ul className="space-y-3">
                {site.phones.map((p) => (
                  <li key={p.tel}>
                    <a
                      href={`tel:${p.tel}`}
                      className="font-sora text-[20px] font-semibold text-white hover:text-sky"
                    >
                      {p.number}
                    </a>
                    <span className="block font-inter text-[14px] text-white/50">{p.label}</span>
                  </li>
                ))}
              </ul>
              <a
                href={`mailto:${site.email}`}
                className="mt-4 inline-block font-inter text-[16px] text-sky hover:text-sky-light"
              >
                {site.email}
              </a>
            </div>

            <div>
              <Eyebrow>VISIT</Eyebrow>
              <address className="space-y-1 font-inter text-[16px] not-italic leading-relaxed text-white/80">
                <div>{site.address.street}</div>
                <div>{site.address.suite}</div>
                <div>
                  {site.address.city}, {site.address.region} {site.address.postalCode}
                </div>
              </address>
              <a
                href={site.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block font-inter text-[15px] text-sky hover:text-sky-light"
              >
                Get directions →
              </a>
            </div>

            <div>
              <Eyebrow>OPEN HOURS</Eyebrow>
              <dl className="space-y-1 font-inter text-[15px] text-white/70">
                {site.hours.map((h) => (
                  <div key={h.days} className="flex gap-3">
                    <dt className="w-16 shrink-0 text-white/50">{h.days}</dt>
                    <dd>{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <Eyebrow>FOLLOW</Eyebrow>
              <ul className="flex flex-wrap gap-2">
                {site.social.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-pill border border-white/15 px-4 py-2 font-inter text-[14px] text-white/75 hover:border-sky hover:text-sky"
                    >
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-card border border-white/10 bg-ink-lift p-7 sm:p-10">
            <h2 className="font-sora text-2xl font-semibold text-white">Send us a message</h2>
            <p className="mt-2 font-inter text-[15px] text-white/60">
              We&rsquo;ll get back to you as soon as we can.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
