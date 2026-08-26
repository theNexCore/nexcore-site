'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Sticky in-page section nav, mirroring the live coworking page.
 * Sits directly beneath the sticky header.
 */
export function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? '');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const pos = window.scrollY + 160;
      let current = items[0]?.id ?? '';
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= pos) current = item.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [items]);

  return (
    <nav
      aria-label="Page sections"
      className="sticky top-[68px] z-40 border-y border-white/10 bg-navy/95 backdrop-blur-md"
    >
      {/* Mobile: toggle */}
      <div className="nav:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between px-5 py-3 font-inter text-[15px] font-semibold text-white"
        >
          <span>{items.find((i) => i.id === active)?.label ?? 'Sections'}</span>
          <svg
            width="12"
            height="8"
            viewBox="0 0 10 6"
            aria-hidden="true"
            className={cn('transition-transform', open && 'rotate-180')}
          >
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </button>
        {open && (
          <ul className="border-t border-white/10 pb-2">
            {items.map((i) => (
              <li key={i.id}>
                <a
                  href={`#${i.id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'block px-5 py-3 font-inter text-[15px]',
                    active === i.id ? 'text-sky' : 'text-white/75',
                  )}
                >
                  {i.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Desktop: inline */}
      <ul className="mx-auto hidden max-w-wide items-center justify-center gap-1 px-4 nav:flex">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              className={cn(
                'inline-block px-4 py-4 font-inter text-[15px] font-semibold transition-colors',
                active === i.id
                  ? 'text-sky shadow-[inset_0_-3px_0_#27AAE2]'
                  : 'text-white/85 hover:text-sky',
              )}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
