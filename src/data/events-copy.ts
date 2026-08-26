/**
 * Narrative copy for /events.
 *
 * Transcribed verbatim from the old events.html. That page and
 * event-calendar.html shared one calendar widget, so the two routes merged —
 * this narrative sits above the calendar, per Jim (2026-08-26).
 */

export const eventsIntro = [
  "At NexCore, we don't simply host events. We intentionally create opportunities for people to learn, connect, celebrate, collaborate, and strengthen our community.",
  'Every workshop, networking event, ribbon cutting, leadership session, nonprofit initiative, educational program, and community gathering exists for one purpose:',
];

export const eventsIntroLead = 'Helping people move forward.';

export const eventsIntroRest = [
  'Some events are produced by NexCore. Some are hosted by our members. Some are created by our partners. Others are simply events we proudly support because they strengthen our community.',
  'Regardless of who hosts them, they all reflect what NexCore believes:',
];

export const eventsBelief = 'Great communities grow when people come together.';

export interface WayIn {
  n: string;
  title: string;
  body: string;
}

export const waysIn: WayIn[] = [
  {
    n: '01',
    title: 'Personal Development',
    body: 'Becoming a stronger version of who you already are.',
  },
  {
    n: '02',
    title: 'Business Growth',
    body: "Practical strategy to build, protect, and scale what you've built.",
  },
  {
    n: '03',
    title: 'Community Support',
    body: 'Showing up for the neighborhoods and causes around us.',
  },
  {
    n: '04',
    title: 'Partner Events',
    body: 'Built alongside organizations like the South County Chamber and Revitalize St. Louis.',
  },
  {
    n: '05',
    title: 'Member-Only Events',
    body: 'Experiences reserved for the NexCore community.',
  },
  {
    n: '06',
    title: 'Member-Hosted Events',
    body: 'Members sharing what they know with everyone.',
  },
];

/**
 * Flat tag list, exactly as ordered in the source.
 * "yOURNexCore" is rendered with OUR accented, matching the original markup.
 */
export const eventKinds: string[] = [
  'BusinessGPS™',
  'Focus10™',
  'AI Workshops',
  'Marketing & Sales',
  'Leadership & Operations',
  'Business strategy',
  'Business networking',
  'Coffee connections',
  'Industry roundtables',
  'Entrepreneur meetups',
  'Relationship building',
  'Community introductions',
  'Community celebrations',
  'Neighborhood events',
  'Local initiatives',
  'Revitalize St. Louis',
  'Community outreach',
  'Volunteer opportunities',
  'yOURNexCore',
  'Training events',
  'Podcasting',
  'Barbecues',
  'Watch parties',
  'Local government events',
  'Ribbon cuttings',
  'Business grand openings',
  'Community milestone events',
];

export const signatureEvents = [
  'ChangeMakers',
  'The Small Business Independence Day Celebration',
  "What's Next",
];

export const eventsClosing = [
  "At NexCore, events aren't simply something we schedule.",
  "They're opportunities to build relationships, strengthen businesses, celebrate our community, and create momentum.",
  'Because when people come together with purpose…',
];

export const eventsClosingLead = 'We all move forward together.';
