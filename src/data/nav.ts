/**
 * Navigation IA. Mirrors the live Weebly menu structure (audit/PHASE1.md §1),
 * remapped onto the approved flat routes.
 */

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export const mainNav: NavItem[] = [
  {
    label: 'What is NexCore',
    href: '/about',
    children: [
      { label: 'Founder Letter', href: '/about/founder-letter' },
      { label: 'Our Philosophy', href: '/about/philosophy' },
      { label: 'History', href: '/about/history' },
    ],
  },
  // Top-level on the live site, between "What is NexCore" and "Impact".
  // Route stays /about/why-it-exists; the 301 from /why-it-exists.html is unchanged.
  { label: 'Why It Exists', href: '/about/why-it-exists' },
  {
    label: 'Impact',
    href: '/impact',
    children: [
      { label: 'Bragging Rights', href: '/impact/bragging-rights' },
      { label: 'In The News', href: '/impact/in-the-news' },
      { label: 'The NexCore Foundation', href: '/foundation' },
    ],
  },
  {
    label: 'Coworking',
    href: '/coworking',
    children: [
      { label: 'Memberships', href: '/coworking#memberships' },
      { label: 'Buy a Pass', href: '/coworking#day-pass' },
      { label: 'Rent an Office', href: '/coworking#offices' },
      { label: 'Book A Space', href: '/coworking#spaces' },
    ],
  },
  {
    label: 'Beyond Coworking',
    href: '/beyond-coworking',
    children: [
      { label: 'Systems', href: '/systems' },
      { label: 'Community', href: '/community' },
      { label: 'Events', href: '/events' },
      { label: 'Host an Event', href: '/coworking#spaces' },
      { label: 'Event Photo Gallery', href: '/events/gallery' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

/** Footer "Explore" column - matches the live site's footer links. */
export const footerExplore: NavChild[] = [
  { label: 'Event Calendar', href: '/events' },
  { label: 'Become a Member', href: '/coworking#memberships' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'What Is NexCore', href: '/about' },
  { label: 'Our Philosophy', href: '/about/philosophy' },
  { label: 'The NexCore Foundation', href: '/foundation' },
];
