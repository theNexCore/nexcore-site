import Link from 'next/link';
import Image from 'next/image';
import { site, formattedAddress } from '@/data/site';
import { footerExplore } from '@/data/nav';
import { socialIcons, PhoneIcon, MapPinIcon } from './Icons';

/** Footer copy transcribed verbatim from the live site (audit/PHASE1.md §2). */
export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink text-white">
      <div className="mx-auto w-full max-w-wide px-5 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Contact */}
          <div>
            <h4 className="mb-4 font-sora text-[15px] font-semibold tracking-[0.06em] text-white">
              Contact
            </h4>
            <ul className="space-y-2 font-inter text-[15px] text-white/70">
              {site.phones.map((p) => (
                <li key={p.tel}>
                  <a href={`tel:${p.tel}`} className="inline-flex items-center gap-2 hover:text-sky">
                    <PhoneIcon />
                    {p.number}
                  </a>{' '}
                  <span className="text-white/45">{p.label}</span>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-sky">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Visit */}
          <div>
            <h4 className="mb-4 font-sora text-[15px] font-semibold tracking-[0.06em] text-white">
              Visit
            </h4>
            <address className="space-y-1 font-inter text-[15px] not-italic text-white/70">
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
              className="mt-3 inline-flex items-center gap-2 font-inter text-[15px] text-sky hover:text-sky-light"
            >
              <MapPinIcon />
              Get directions
            </a>
            <dl className="mt-5 space-y-1 font-inter text-[14px] text-white/55">
              {site.hours.map((h) => (
                <div key={h.days} className="flex gap-2">
                  <dt className="w-16 shrink-0">{h.days}</dt>
                  <dd>{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-4 font-sora text-[15px] font-semibold tracking-[0.06em] text-white">
              Explore
            </h4>
            <ul className="space-y-2 font-inter text-[15px] text-white/70">
              {footerExplore.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-sky">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h4 className="mb-4 font-sora text-[15px] font-semibold tracking-[0.06em] text-white">
              Follow
            </h4>
            <ul className="space-y-2 font-inter text-[15px] text-white/70">
              {site.social.map((s) => {
                const Icon = socialIcons[s.name];
                return (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 hover:text-sky"
                    >
                      {Icon && <Icon />}
                      {s.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Brand lockup with the tagline.
            This asset is a solid black rectangle with a white glow — no alpha —
            so on the near-black footer (#001018) it would read as a faint box.
            `mix-blend-mode: screen` drops the black to nothing and keeps the
            glow and brand colours, so no edge shows. */}
        <div className="mt-16 flex justify-center">
          <Image
            src="/img/nexcore-logo-2026-1.png"
            alt="NexCore — The Starting Point For It All"
            width={2172}
            height={724}
            sizes="(max-width: 640px) 88vw, 460px"
            className="h-auto w-[min(460px,88vw)] mix-blend-screen"
          />
        </div>

        <div className="mt-10 border-t border-white/10 pt-8">
          <p className="max-w-prose font-inter text-[13px] leading-relaxed text-white/45">
            Content, including images, displayed on this website is protected by copyright laws.
            Downloading, republication, retransmission or reproduction of content on this website is
            strictly prohibited.{' '}
            <Link href="/terms" className="text-white/60 underline underline-offset-2 hover:text-sky">
              Terms of Use
            </Link>{' '}
            |{' '}
            <Link
              href="/privacy"
              className="text-white/60 underline underline-offset-2 hover:text-sky"
            >
              Privacy Policy
            </Link>
          </p>
          <p className="mt-4 font-inter text-[13px] text-white/35">
            <span className="sr-only">{formattedAddress}. </span>Site powered by NexCore
          </p>
        </div>
      </div>
    </footer>
  );
}
