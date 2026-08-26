'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { mainNav } from '@/data/nav';
import { cn } from '@/lib/cn';
import { ButtonLink } from './Button';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const pathname = usePathname();

  // Close the mobile menu on navigation.
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

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) => {
    // Nav hrefs may carry a hash (e.g. /events#calendar); compare paths only.
    const path = href.split('#')[0].split('?')[0];
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-colors duration-300',
        scrolled || open ? 'bg-ink/95 backdrop-blur-md' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-[68px] w-full max-w-wide items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href="/" aria-label="NexCore — home" className="flex shrink-0 items-center">
          <Image
            src="/logo/nexcore-logo-primary.svg"
            alt="NexCore"
            width={188}
            height={47}
            priority
            className="h-[30px] w-auto sm:h-[34px]"
          />
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden items-center gap-1 nav:flex">
          {mainNav.map((item) => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className={cn(
                  'inline-flex items-center gap-1 rounded-pill px-3 py-2 font-inter text-[15px] font-medium',
                  isActive(item.href) ? 'text-sky' : 'text-white/85 hover:text-sky',
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
                    'invisible absolute left-0 top-full min-w-[232px] translate-y-1 rounded-card border',
                    'border-white/10 bg-ink-lift p-2 opacity-0 shadow-xl transition-all duration-200',
                    'group-hover:visible group-hover:translate-y-0 group-hover:opacity-100',
                    'group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100',
                  )}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-lg px-3 py-2 font-inter text-[14px] text-white/80 hover:bg-white/5 hover:text-sky"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden nav:block">
          <ButtonLink href="/coworking#memberships" size="sm">
            Become a Member
          </ButtonLink>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="inline-flex items-center gap-2 rounded-pill px-2 py-2 font-inter text-[15px] font-semibold text-white nav:hidden"
        >
          <span className="relative block h-[2px] w-5 bg-white before:absolute before:left-0 before:top-[-6px] before:block before:h-[2px] before:w-5 before:bg-white after:absolute after:left-0 after:top-[6px] after:block after:h-[2px] after:w-5 after:bg-white" />
          Menu
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          id="mobile-menu"
          className="max-h-[calc(100dvh-68px)] overflow-y-auto border-t border-white/10 bg-ink nav:hidden"
        >
          <nav aria-label="Mobile" className="px-5 pb-8 pt-2">
            {mainNav.map((item) => (
              <div key={item.href} className="border-b border-white/8">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    className={cn(
                      'block flex-1 py-4 font-sora text-[17px] font-medium',
                      isActive(item.href) ? 'text-sky' : 'text-white',
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
                      className="p-3 text-white/60"
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
                        className="block py-2.5 font-inter text-[15px] text-white/70 hover:text-sky"
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
