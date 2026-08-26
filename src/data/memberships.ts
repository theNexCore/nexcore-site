import { site } from './site';

/**
 * Membership tiers, day pass, and amenity groups.
 * Copy transcribed verbatim from the live coworking page.
 */

export interface Tier {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  cadence: string;
  note?: string;
  blurb: string;
  includesLabel: string;
  includes: string[];
  cta: { label: string; tier: string };
  featured?: boolean;
  badge?: string;
}

export const tiers: Tier[] = [
  {
    id: 'virtual',
    name: 'Virtual Membership',
    price: 99,
    priceLabel: '$99',
    cadence: '/month',
    blurb:
      'Perfect for businesses that need a professional business presence without daily office access.',
    includesLabel: 'Includes',
    includes: [
      'Unique professional business address',
      'Dedicated suite number',
      'Google-verifiable business address',
      'Registered Agent service',
      'Mail handling',
      'Mail scanning & email forwarding',
      'One complimentary coworking day pass each month',
    ],
    cta: { label: 'Become a Virtual Member', tier: 'virtual' },
  },
  {
    id: 'nexcore',
    name: 'NexCore Membership',
    price: 279,
    priceLabel: '$279',
    cadence: '/month',
    blurb: 'Unlimited coworking with complete access to the NexCore community.',
    includesLabel: 'Includes',
    includes: [
      'Everything included in the Virtual Membership',
      '24/7 building access',
      'All member amenities',
      'Six hours of Conference Room usage each month',
      'Guest privileges (guest must remain with member)',
      'Member pricing on rentable spaces',
      'Access to member events',
    ],
    cta: { label: 'Become a Coworking Member', tier: 'nexcore' },
  },
  {
    id: 'founding',
    name: 'Founding Member',
    price: 199,
    priceLabel: '$199',
    cadence: '/month',
    note: '$199/month through end of 2027',
    badge: 'Limited Availability',
    featured: true,
    blurb:
      'Help build the next generation of the NexCore community while locking in exclusive founding pricing.',
    includesLabel: 'Everything in the NexCore Membership, plus',
    includes: [
      'Guaranteed $199/month rate through the end of 2027',
      'Prominent placement on the NexCore Founding Member Wall',
      'Featured placement in the Member Directory',
      'Recognition as a Founding Member of NexCore',
    ],
    cta: { label: 'Become a Founding Member', tier: 'founding' },
  },
];

export const dayPass = {
  price: 25,
  priceLabel: '$25',
  title: 'Day Pass',
  blurb:
    'One full day inside NexCore — open coworking seating, high-speed internet, coffee, and every member amenity.',
  checkoutUrl: site.square.dayPass,
};

export const foundingDeposit = {
  amount: 50,
  label: '$50 deposit',
  blurb:
    'A $50 deposit holds your spot and gets applied to your first month. Payment opens in a secure Square window.',
  checkoutUrl: site.square.membershipDeposit,
};

export interface AmenityGroup {
  title: string;
  intro?: string;
  items: string[];
}

export const amenityGroups: AmenityGroup[] = [
  {
    title: 'Access & Security',
    items: [
      '24/7 mobile app access',
      'Secure member-only access',
      'Video surveillance',
      'Professionally monitored facility',
    ],
  },
  {
    title: 'Workspace',
    items: [
      '20+ workspace configurations',
      'Open coworking seating',
      'Collaborative workspaces',
      'Quiet work areas',
      'Lounge seating',
      'High-speed fiber internet',
      'Building-wide Wi-Fi',
      'Convenient power access throughout',
    ],
  },
  {
    title: 'Kitchens & Refreshments',
    items: [
      'One fully equipped kitchen',
      'One kitchenette',
      'Complimentary coffee',
      'Complimentary beverages',
      'Refrigerator access',
      'Microwave',
      'Ice maker',
    ],
  },
  { title: 'Office Services', items: ['Printing', 'Copying', 'Scanning'] },
  {
    title: 'Smart Technology',
    items: [
      'AI-powered workplace technology',
      'Smart lighting',
      'Building-wide music',
      'AI assistance throughout the building',
    ],
  },
  {
    title: 'Meeting & Collaboration',
    items: [
      'Conference Room access',
      'War Room access',
      'Podcast Studio access',
      'Discounted Event Center rentals',
      'Member pricing on rentable spaces',
    ],
  },
  {
    title: 'Community',
    items: [
      'Member directory',
      'Exclusive member events',
      'Entrepreneur community',
      'Networking opportunities',
    ],
  },
  {
    title: 'Turnkey Business Headquarters',
    intro:
      'Everything you need to establish a professional business presence without leasing traditional office space.',
    items: [
      'Unique professional business address with your own dedicated suite number',
      'Google-verifiable business address',
      'Professional mail handling',
      'Registered Agent service',
      'Business support services',
      'Internship opportunities',
      'Discounts on NexCore professional services',
      'Access to the NexCore business ecosystem',
    ],
  },
];
