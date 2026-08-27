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

      /**
       * Orphan legacy URLs — live and indexed, but absent from the Weebly
       * sitemap, so the original crawl never saw them.
       *
       * /contact-us.html was linked from nowhere on the site; it surfaced in
       * a search audit still serving the old design and the old phone number.
       * /our-story.html was the Impact page's "Experience Our Story" doorway.
       *
       * Both previously fell through to the catch-all and 301'd to a path
       * that does not exist, i.e. a redirect straight into a 404.
       */
      { source: '/contact-us.html', destination: '/contact', statusCode: 301 },
      { source: '/our-story.html', destination: '/about/history', statusCode: 301 },

      // Common variants of real pages, so near-miss legacy URLs land somewhere.
      { source: '/home.html', destination: '/', statusCode: 301 },
      { source: '/about-us.html', destination: '/about', statusCode: 301 },
      { source: '/co-working.html', destination: '/coworking', statusCode: 301 },
      { source: '/philosophy.html', destination: '/about/philosophy', statusCode: 301 },
      { source: '/nexcore-foundation.html', destination: '/foundation', statusCode: 301 },
      { source: '/membership.html', destination: '/coworking#memberships', statusCode: 301 },
      { source: '/memberships.html', destination: '/coworking#memberships', statusCode: 301 },
      { source: '/day-pass.html', destination: '/coworking#day-pass', statusCode: 301 },
      { source: '/offices.html', destination: '/coworking#offices', statusCode: 301 },
      { source: '/spaces.html', destination: '/coworking#spaces', statusCode: 301 },
      { source: '/tour.html', destination: '/coworking#tour', statusCode: 301 },
      { source: '/schedule-tour.html', destination: '/coworking#tour', statusCode: 301 },

      /**
       * Insurance, not evidence.
       *
       * None of these appear in the Weebly sitemap or in any internal link in
       * the crawled HTML, so they probably never existed. But /contact-us.html
       * and /our-story.html did exist, were indexed, and were absent from both
       * of those sources — so the inventory is demonstrably incomplete, and a
       * redirect for a URL nobody requests costs nothing.
       *
       * Only slugs with one obvious destination are listed. Anything
       * ambiguous (testimonials, partners, sponsors) is deliberately left to
       * 404 rather than guessed at.
       */
      { source: '/rates.html', destination: '/coworking#memberships', statusCode: 301 },
      { source: '/pricing.html', destination: '/coworking#memberships', statusCode: 301 },
      { source: '/pricing-plans.html', destination: '/coworking#memberships', statusCode: 301 },
      { source: '/virtual-office.html', destination: '/coworking#memberships', statusCode: 301 },
      { source: '/virtual-membership.html', destination: '/coworking#memberships', statusCode: 301 },
      { source: '/join.html', destination: '/coworking#memberships', statusCode: 301 },
      { source: '/signup.html', destination: '/coworking#memberships', statusCode: 301 },
      { source: '/sign-up.html', destination: '/coworking#memberships', statusCode: 301 },
      { source: '/register.html', destination: '/coworking#memberships', statusCode: 301 },
      { source: '/amenities.html', destination: '/coworking#amenities', statusCode: 301 },
      { source: '/private-offices.html', destination: '/coworking#offices', statusCode: 301 },
      { source: '/meeting-rooms.html', destination: '/coworking#spaces', statusCode: 301 },
      { source: '/conference-room.html', destination: '/coworking#spaces', statusCode: 301 },
      { source: '/podcast-studio.html', destination: '/coworking#spaces', statusCode: 301 },
      { source: '/event-center.html', destination: '/coworking#spaces', statusCode: 301 },
      { source: '/event-space.html', destination: '/coworking#spaces', statusCode: 301 },
      { source: '/studio.html', destination: '/coworking#spaces', statusCode: 301 },
      { source: '/war-room.html', destination: '/coworking#spaces', statusCode: 301 },
      { source: '/book.html', destination: '/coworking#spaces', statusCode: 301 },
      { source: '/booking.html', destination: '/coworking#spaces', statusCode: 301 },
      { source: '/reserve.html', destination: '/coworking#spaces', statusCode: 301 },
      { source: '/gallery.html', destination: '/events/gallery', statusCode: 301 },
      { source: '/photos.html', destination: '/events/gallery', statusCode: 301 },
      { source: '/businessgps.html', destination: '/about/philosophy', statusCode: 301 },
      { source: '/focus10.html', destination: '/about/philosophy', statusCode: 301 },
      { source: '/changemakers.html', destination: '/about/history', statusCode: 301 },
      { source: '/streamathon.html', destination: '/about/history', statusCode: 301 },
      { source: '/revitalize.html', destination: '/about/history', statusCode: 301 },
      { source: '/soco-chamber.html', destination: '/about/history', statusCode: 301 },
      { source: '/faq.html', destination: '/contact', statusCode: 301 },
      { source: '/support.html', destination: '/contact', statusCode: 301 },
      { source: '/legal.html', destination: '/terms', statusCode: 301 },

      /**
       * Safety net for any remaining .html. Anything whose slug matches a real
       * route resolves; anything else ends in a 404, which is the correct
       * signal for a URL with no equivalent — redirecting unrelated pages to
       * the homepage instead reads to Google as a soft 404.
       */
      { source: '/:slug*.html', destination: '/:slug*', statusCode: 301 },
    ];
  },
};

export default nextConfig;
