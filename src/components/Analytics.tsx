import Script from 'next/script';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';

/**
 * Analytics.
 *
 * Vercel Analytics: always on. Only reports from Vercel deployments where the
 * project has Analytics enabled; a no-op locally.
 * GA4: set NEXT_PUBLIC_GA4_ID to activate. Renders nothing when unset.
 *
 * Note: googletagmanager.com and va.vercel-scripts.com are both already
 * allowed in the CSP script-src.
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;

  return (
    <>
      <VercelAnalytics />

      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}
    </>
  );
}
