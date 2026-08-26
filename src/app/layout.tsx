import type { Metadata, Viewport } from 'next';
import { Sora, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { Analytics } from '@/components/Analytics';
import { organizationJsonLd } from '@/lib/seo';
import { SITE_URL, site } from '@/data/site';

// Weights verified against the live site's Google Fonts requests.
const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sora',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'NexCore — Coworking & Business Ecosystem in South St. Louis County',
    template: '%s | NexCore',
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: 'NexCore' }],
  creator: 'NexCore',
  publisher: 'NexCore',
  formatDetection: { telephone: true, address: true, email: true },
  // Generated from the NexCore "CO" mark. favicon.ico carries 16/32/48px
  // frames for legacy tabs; the PNGs cover modern browsers and PWA installs.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = {
  themeColor: '#001018',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col bg-ink">
        <JsonLd data={organizationJsonLd()} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-pill focus:bg-sky focus:px-4 focus:py-2 focus:font-inter focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>

        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
