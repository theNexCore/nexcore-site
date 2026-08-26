import Script from 'next/script';

/**
 * Analytics placeholder.
 *
 * GA4: set NEXT_PUBLIC_GA4_ID to activate. Renders nothing when unset.
 * Vercel Analytics: install `@vercel/analytics` and uncomment below.
 *   import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
 *
 * Note: googletagmanager.com is already allowed in the CSP script-src.
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
      </Script>
    </>
  );
}
