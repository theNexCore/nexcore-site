/** @type {import('next').NextConfig} */

// Content-Security-Policy.
// Eventbrite and Square are LINK-OUT only (no iframes), so neither needs a
// frame-src entry. script.google.com is fetched server-side at build/ISR time
// and from the client only for the coworking availability lookup.
const csp = [
  "default-src 'self'",
  // Next.js requires 'unsafe-inline' for its bootstrap script and
  // 'unsafe-eval' in dev only.
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.thenexcore.com",
  "font-src 'self' data:",
  "connect-src 'self' https://script.google.com https://script.googleusercontent.com https://www.google-analytics.com https://va.vercel-scripts.com",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()',
  },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.thenexcore.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },

  /**
   * 301 redirect table from audit/PHASE1.md §5.
   *
   * NOTE: statusCode 301 is used deliberately rather than `permanent: true`,
   * which Next emits as 308. The migration spec calls for 301.
   * Approved by Jim 2026-08-26:
   *   - /member-login.html   -> /contact  (removed)
   *   - /photo-resources.html-> /         (retired; was a Weebly asset workaround)
   *   - /event-graphics.html -> /events   (retired; page was empty)
   */
  async redirects() {
    return [
      { source: '/index.html', destination: '/', statusCode: 301 },
      { source: '/coworking.html', destination: '/coworking', statusCode: 301 },
      { source: '/beyond-coworking.html', destination: '/beyond-coworking', statusCode: 301 },
      { source: '/systems.html', destination: '/systems', statusCode: 301 },
      { source: '/community.html', destination: '/community', statusCode: 301 },
      { source: '/events.html', destination: '/events', statusCode: 301 },
      { source: '/event-calendar.html', destination: '/events', statusCode: 301 },
      { source: '/event-photo-gallery.html', destination: '/events/gallery', statusCode: 301 },
      { source: '/event-graphics.html', destination: '/events', statusCode: 301 },
      { source: '/what-is-nexcore.html', destination: '/about', statusCode: 301 },
      { source: '/founder-letter.html', destination: '/about/founder-letter', statusCode: 301 },
      { source: '/our-philosophy.html', destination: '/about/philosophy', statusCode: 301 },
      { source: '/history.html', destination: '/about/history', statusCode: 301 },
      { source: '/why-it-exists.html', destination: '/about/why-it-exists', statusCode: 301 },
      { source: '/impact.html', destination: '/impact', statusCode: 301 },
      { source: '/bragging-rights.html', destination: '/impact/bragging-rights', statusCode: 301 },
      { source: '/in-the-news.html', destination: '/impact/in-the-news', statusCode: 301 },
      { source: '/the-nexcore-foundation.html', destination: '/foundation', statusCode: 301 },
      { source: '/contact.html', destination: '/contact', statusCode: 301 },
      { source: '/member-login.html', destination: '/contact', statusCode: 301 },
      { source: '/photo-resources.html', destination: '/', statusCode: 301 },
      // Safety net for any stray Weebly .html URL not listed above.
      { source: '/:slug*.html', destination: '/:slug*', statusCode: 301 },
    ];
  },
};

export default nextConfig;
