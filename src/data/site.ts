/**
 * Single source of truth for NAP, social, and site-wide constants.
 * Values transcribed from the live site footer (audit/PHASE1.md §2).
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thenexcore.com'
).replace(/\/$/, '');

/** Build an absolute URL. Canonical, OG, and JSON-LD fields must all be absolute. */
export const abs = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

export const site = {
  name: 'NexCore',
  legalName: 'NexCore',
  tagline: 'The Starting Point For It All',
  description:
    'NexCore is a coworking space and business ecosystem in South St. Louis County — offices, event spaces, systems, community, and events built to help businesses grow.',

  address: {
    street: '11820 Tesson Ferry Road',
    suite: 'Ste 1000',
    city: 'St. Louis',
    region: 'MO',
    postalCode: '63128',
    country: 'US',
  },

  /** Approximate coordinates for 11820 Tesson Ferry Rd, St. Louis MO 63128. */
  geo: { lat: 38.4906, lng: -90.3548 },

  phones: [
    { label: 'NexCore CoWorking', number: '314.433.9330', tel: '+13144339330' },
    { label: 'NexCore Solutions', number: '314.433.9550', tel: '+13144339550' },
  ],

  // Cloudflare-obfuscated as "[email protected]" in the Weebly source.
  email: 'hello@thenexcore.com',

  directionsUrl: 'https://maps.app.goo.gl/aEBwvNjvnYjM1cgB9',

  hours: [
    { days: 'Mon–Fri', time: '9:00 AM – 6:00 PM' },
    { days: 'Sat', time: '9:00 AM – 1:00 PM' },
  ],

  /** schema.org openingHoursSpecification form. */
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' },
    { days: ['Saturday'], opens: '09:00', closes: '13:00' },
  ],

  social: [
    { name: 'Facebook', url: 'https://www.facebook.com/NexCoreCoworking/' },
    { name: 'Instagram', url: 'https://www.instagram.com/thenexcore' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/thenexcore/' },
    { name: 'X', url: 'https://x.com/thenexcore' },
  ],

  /** Square payment links. Coworking only - events ticket via Eventbrite. */
  square: {
    membershipDeposit: 'https://square.link/u/1bUKPibu',
    dayPass: 'https://square.link/u/ozTP4Yh0',
  },
} as const;

export const formattedAddress = `${site.address.street}, ${site.address.suite}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;
