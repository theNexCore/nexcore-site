'use client';

import { useCallback } from 'react';
import { cn } from '@/lib/cn';

/**
 * Opens a Square payment link in a centred popup window rather than a tab,
 * matching the old site's behaviour ("Payment opens in a secure Square
 * window — this page stays right here").
 *
 * Square sends `x-frame-options: SAMEORIGIN`, so the checkout cannot be
 * embedded in an on-page modal. A real popup window is the closest thing,
 * and it keeps this page open behind it.
 *
 * If the popup is blocked — some browsers block even user-initiated ones,
 * and most mobile browsers ignore window features entirely — we fall back
 * to a normal new tab so the purchase is never a dead end.
 */

const POPUP_W = 480;
const POPUP_H = 820;

type Variant = 'primary' | 'secondary' | 'ghost';

const variants: Record<Variant, string> = {
  primary: 'bg-sky text-white hover:bg-sky-light',
  secondary: 'bg-white text-ink hover:bg-white/90',
  ghost: 'border border-white/25 text-white hover:border-sky hover:text-sky',
};

const sizes = {
  sm: 'px-[18px] py-[9px] text-[14px]',
  md: 'px-[22px] py-[11px] text-[15px]',
  lg: 'px-[44px] py-[17px] text-[16px]',
};

export function SquareCheckoutButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: keyof typeof sizes extends never ? never : 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const open = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Let modified clicks (new tab, new window, middle click) behave normally.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

      e.preventDefault();

      // Centre on the screen the browser is actually on, not the primary one.
      const dualLeft = window.screenLeft ?? window.screenX ?? 0;
      const dualTop = window.screenTop ?? window.screenY ?? 0;
      const width = window.outerWidth || document.documentElement.clientWidth;
      const height = window.outerHeight || document.documentElement.clientHeight;

      const w = Math.min(POPUP_W, width);
      const h = Math.min(POPUP_H, height);
      const left = dualLeft + Math.max(0, (width - w) / 2);
      const top = dualTop + Math.max(0, (height - h) / 2);

      const features = `popup=yes,width=${w},height=${h},left=${Math.round(left)},top=${Math.round(top)},scrollbars=yes,resizable=yes`;
      const win = window.open(href, 'nexcore-square-checkout', features);

      if (win) {
        win.focus();
        return;
      }

      // Popup blocked, or a mobile browser that ignores features — do not
      // strand the customer.
      window.open(href, '_blank', 'noopener,noreferrer');
    },
    [href],
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={open}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-pill font-inter font-semibold transition-colors',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </a>
  );
}
