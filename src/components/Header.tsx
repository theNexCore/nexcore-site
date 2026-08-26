'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { mainNav } from '@/data/nav';
import { site } from '@/data/site';
import { cn } from '@/lib/cn';
import { ButtonLink } from './Button';
import { socialIcons, PhoneIcon, MapPinIcon } from './Icons';

/**
 * Site header — white at all times.
 *
 * The logo is the unaltered brand lockup, including the "The Starting Point
 * For It All" tagline. It is drawn in navy/sky/red with no white, so it is
 * used exactly as supplied — no recolouring and no CSS filters.
 *
 * NOTE: nexcore-wordmark-alt.svg is also NC_ASSETS.logo inside the Energy
 * Core engine. Do not rename that file.
 *
 * The bar is tall at rest so the logo can be large, and condenses on scroll
 * to give the viewport back.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const compact = scrolled && !open;

  const isActive = (href: string) => {
    const path = href.split('#')[0].split('?')[0];
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-white text-ink transition-shadow duration-300',
        compact && 'shadow-[0_1px_16px_rgba(0,16,24,0.10)]',
      )}
    >
      {/* ---------- Utility bar: socials, phone, directions ---------- */}
      <div
        className={cn(
          'overflow-hidden border-b border-ink/10 transition-all duration-300',
          compact ? 'max-h-0 border-b-0 opacity-0' : 'max-h-20 opacity-100',
        )}
      >
        <div className="mx-auto flex w-full max-w-wide items-center justify-between gap-4 px-5 py-2 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-1">
            {site.social.map((s) => {
              const Icon = socialIcons[s.name];
              return (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`NexCore on ${s.name}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink/55 transition-colors hover:bg-ink/5 hover:text-navy"
                  >
                    {Icon ? <Icon /> : s.name}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1 sm:gap-3">
            <a
              href={`tel:${site.phones[0].tel}`}
              className="inline-flex items-center gap-2 rounded-pill px-2.5 py-1.5 font-inter text-[14px] font-semibold text-navy transition-colors hover:bg-ink/5 sm:px-3"
            >
              <PhoneIcon />
              <span>{site.phones[0].number}</span>
            </a>

            <a
              href={site.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-pill px-2.5 py-1.5 font-inter text-[14px] font-medium text-ink/70 transition-colors hover:bg-ink/5 hover:text-navy sm:px-3"
            >
              <MapPinIcon />
              <span className="hidden sm:inline">Directions</span>
              <span className="sr-only sm:hidden">Directions</span>
            </a>
          </div>
        </div>
      </div>

      {/* ---------- Logo, centred and large ---------- */}
      <div
        className={cn(
          'mx-auto flex w-full max-w-wide items-center justify-center px-5 transition-all duration-300 sm:px-6 lg:px-8',
          compact ? 'pb-1 pt-2' : 'pb-3 pt-4',
        )}
      >
        <Link href="/" aria-label="NexCore — The Starting Point For It All" className="inline-block">
          <Image
            src="/logo/nexcore-wordmark-alt.svg"
            alt="NexCore — The Starting Point For It All"
            width={10517}
            height={3307}
            priority
            className={cn(
              'w-auto transition-all duration-300',
              compact ? 'h-[34px] sm:h-[38px]' : 'h-[56px] sm:h-[68px] lg:h-[82px]',
            )}
          />
        </Link>
      </div>

      {/* ---------- Main navigation ---------- */}
      <div className="mx-auto w-full max-w-wide px-5 sm:px-6 lg:px-8">
        <nav aria-label="Main" className="hidden items-center justify-center pb-2 nav:flex">
          {mainNav.map((item) => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className={cn(
                  'inline-flex items-center gap-1 rounded-pill px-2.5 py-2 font-inter text-[14px] font-medium transition-colors xl:px-3 xl:text-[15px]',
                  isActive(item.href) ? 'text-navy' : 'text-ink/75 hover:text-navy',
                )}
              >
                {item.label}
                {item.children && (
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    aria-hidden="true"
                    className="mt-[2px] opacity-60"
                  >
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                )}
              </Link>

              {item.children && (
                <div
                  className={cn(
                    'invisible absolute left-1/2 top-full z-10 min-w-[228px] -translate-x-1/2 translate-y-1 rounded-card border border-ink/10 bg-white p-2 opacity-0 shadow-xl transition-all duration-200',
                    'group-hover:visible group-hover:translate-y-0 group-hover:opacity-100',
                    'group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100',
                  )}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-lg px-3 py-2 font-inter text-[14px] text-ink/75 transition-colors hover:bg-ink/5 hover:text-navy"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <ButtonLink href="/coworking#memberships" size="sm" className="ml-2 shrink-0 xl:ml-3">
            Become a Member
          </ButtonLink>
        </nav>

        {/* Mobile toggle */}
        <div className="flex justify-center pb-3 nav:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="inline-flex items-center gap-2 rounded-pill border border-ink/15 px-5 py-2 font-inter text-[15px] font-semibold text-ink transition-colors hover:border-navy"
          >
            <span className="relative block h-[2px] w-5 bg-current before:absolute before:left-0 before:top-[-6px] before:block before:h-[2px] before:w-5 before:bg-current after:absolute after:left-0 after:top-[6px] after:block after:h-[2px] after:w-5 after:bg-current" />
            Menu
          </button>
        </div>
      </div>

      {/* ---------- Mobile drawer ---------- */}
      {open && (
        <div
          id="mobile-menu"
          className="max-h-[calc(100dvh-160px)] overflow-y-auto border-t border-ink/10 bg-white nav:hidden"
        >
          <nav aria-label="Mobile" className="px-5 pb-8 pt-2">
            {mainNav.map((item) => (
              <div key={item.href} className="border-b border-ink/10">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    className={cn(
                      'block flex-1 py-4 font-sora text-[17px] font-medium',
                      isActive(item.href) ? 'text-navy' : 'text-ink',
                    )}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      type="button"
                      aria-label={`Toggle ${item.label} submenu`}
                      aria-expanded={openGroup === item.href}
                      onClick={() => setOpenGroup(openGroup === item.href ? null : item.href)}
                      className="p-3 text-ink/50"
                    >
                      <svg
                        width="14"
                        height="9"
                        viewBox="0 0 10 6"
                        aria-hidden="true"
                        className={cn(
                          'transition-transform duration-200',
                          openGroup === item.href && 'rotate-180',
                        )}
                      >
                        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      </svg>
                    </button>
                  )}
                </div>

                {item.children && openGroup === item.href && (
                  <div className="pb-3 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block py-2.5 font-inter text-[15px] text-ink/70 hover:text-navy"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <ButtonLink href="/coworking#memberships" className="mt-6 w-full" size="md">
              Become a Member
            </ButtonLink>
          </nav>
        </div>
      )}
    </header>
  );
}
