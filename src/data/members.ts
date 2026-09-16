/**
 * Member directory — the single source of truth for /members.
 *
 * Edit this file to add, change or remove a member; the directory, each
 * member's own page and the sitemap all read from it. Snapshot migrated from
 * the Apps Script feed on 2026-09-16.
 *
 * SERVER-ONLY DATA. Emails are stored raw here, so this file must only ever be
 * imported by src/lib/members-server.ts (which obfuscates them) and by
 * scripts/images.ts. Importing it from a client component would ship every
 * address to the browser.
 *
 * Images live in public/members/ and are referenced site-absolute:
 *   logo   /members/<company-name>-logo.png     e.g. /members/datotel-logo.png
 *   photo  /members/<firstname-lastname>.jpg    e.g. /members/blake-mueller.jpg
 * A path whose file is not in public/ yet renders the branded placeholder, and
 * `npm run images` lists every missing file. Use '' for "no image".
 *
 * Every other string field may be '' when a member has not published it.
 * Socials take a full URL or a bare/@handle.
 */

import type { TierId } from './member-tiers';

export interface MemberSocials {
  instagram: string;
  tiktok: string;
  youtube: string;
  facebook: string;
  x: string;
  linkedin: string;
}

export interface MemberRecord {
  /** URL segment: /members/<slug>. Changing it breaks existing links. */
  slug: string;
  business: string;
  firstName: string;
  lastName: string;
  /** The person's role, e.g. "Owner". */
  title: string;
  tier: TierId;
  /** Year joined, e.g. "2019". */
  since: string;
  logo: string;
  photo: string;
  categories: string[];
  company: {
    address: string;
    phone: string;
    email: string;
    website: string;
    socials: MemberSocials;
  };
  contact: {
    phone: string;
    email: string;
    socials: MemberSocials;
  };
  desc: string;
  funFact: string;
  /** Ordering weight. Higher sorts first within a tier. */
  weight: number;
}

export const members: MemberRecord[] = [
  {
    slug: "the-south-county-chamber",
    business: "The South County Chamber",
    firstName: "Taylor",
    lastName: "Miller",
    title: "Chief Impact Officer",
    tier: "Founding",
    since: "2018",
    logo: "/members/the-south-county-chamber-logo.png",
    photo: "/members/taylor-miller.jpg",
    categories: ["Community Organization","Grant Writer"],
    company: {
      address: "11820 Tesson Ferry Rd, Suite 1408, St. Louis, MO 63128",
      phone: "314.380.5755",
      email: "welcome@thesocochamber.org",
      website: "https://thesocochamber.org",
      socials: {
        instagram: "https://www.instagram.com/thesocochamber/",
        tiktok: "",
        youtube: "",
        facebook: "https://www.facebook.com/TheSOCOChamber",
        x: "https://x.com/search?q=the%20soco%20chamber&src=typed_query",
        linkedin: "https://www.linkedin.com/company/thesocochamber/",
      },
    },
    contact: {
      phone: "314.717.2598",
      email: "Taylor@thesocochamber.org",
      socials: {
        instagram: "",
        tiktok: "",
        youtube: "",
        facebook: "",
        x: "",
        linkedin: "",
      },
    },
    desc: "The South County Chamber is a Social Enterprise dedicated to the betterment of South County and raising the standard for all businesses.",
    funFact: "Taylor was a NexCore employee in 2018 and never left (in spirit). Now she is back to Lead the South County Chamber.",
    weight: 0,
  },
  {
    slug: "4-scopes",
    business: "Four Scopes",
    firstName: "Rich",
    lastName: "Schaub",
    title: "Head of Four Scopes Quality Control-All Scopes/Master Electrician",
    tier: "Founding",
    since: "2026",
    logo: "/members/four-scopes-logo.png",
    photo: "/members/rich-schaub.jpg",
    categories: ["Electrical Contractor"],
    company: {
      address: "11820 Tesson Ferry Rd, Suite 1404, St. Louis, MO 63128",
      phone: "314.624.0070",
      email: "contact@fourscopes.com",
      website: "https://fourscopes.com/",
      socials: {
        instagram: "https://www.instagram.com/follow4scopes/",
        tiktok: "https://www.tiktok.com/search?lang=en&q=follow4scopes&t=1789258562763",
        youtube: "",
        facebook: "https://www.facebook.com/Follow4Scopes",
        x: "https://x.com/Follow4scopes",
        linkedin: "https://www.linkedin.com/company/follow4scopes",
      },
    },
    contact: {
      phone: "314.624.0070",
      email: "Rich@fourscopes.com",
      socials: {
        instagram: "",
        tiktok: "",
        youtube: "",
        facebook: "",
        x: "",
        linkedin: "",
      },
    },
    desc: "EVERYTHING YOU NEED. WHEREVER YOU NEED IT. Electrical, home automation, handyman services, property repairs and cleaning for the St. Louis metro area.",
    funFact: "",
    weight: 0,
  },
  {
    slug: "liliana-s-italian-kitchen",
    business: "Liliana's Italian Kitchen",
    firstName: "Tim",
    lastName: "Peri",
    title: "Owner",
    tier: "Founding",
    since: "2026",
    logo: "/members/lilianas-italian-kitchen-logo.png",
    photo: "/members/tim-peri.jpg",
    categories: ["Restaurant","Catering"],
    company: {
      address: "11836 Tesson Ferry Rd, St. Louis, MO 63128",
      phone: "314.729.1800",
      email: "",
      website: "https://www.lilianasitaliankitchen.com/",
      socials: {
        instagram: "https://www.instagram.com/lilianascottleville",
        tiktok: "https://www.tiktok.com/@pizzababble/video/7366230252630166827?q=liliana%27s%20italian%20kitchen&t=1789263360001",
        youtube: "",
        facebook: "https://www.facebook.com/LilianasCottleville",
        x: "https://x.com/LilianasKitchen",
        linkedin: "",
      },
    },
    contact: {
      phone: "314.729.1800",
      email: "",
      socials: {
        instagram: "",
        tiktok: "",
        youtube: "",
        facebook: "",
        x: "",
        linkedin: "",
      },
    },
    desc: "",
    funFact: "",
    weight: 0,
  },
  {
    slug: "overmann-all-around",
    business: "Overmann All Around Services",
    firstName: "Matt",
    lastName: "Overmann",
    title: "Owner",
    tier: "Founding",
    since: "2026",
    logo: "/members/overmann-all-around-services-logo.png",
    photo: "/members/matt-overmann.jpg",
    categories: ["Construction Services"],
    company: {
      address: "11820 Tesson Ferry Rd, Suite 1505, St. Louis, MO 63128",
      phone: "314.685.6997",
      email: "overmannallaround@gmail.com",
      website: "",
      socials: {
        instagram: "",
        tiktok: "",
        youtube: "",
        facebook: "https://www.facebook.com/p/Overmann-All-Around-Handyman-Services-100071320583713/",
        x: "",
        linkedin: "",
      },
    },
    contact: {
      phone: "314.685.6997",
      email: "overmannallaround@gmail.com",
      socials: {
        instagram: "",
        tiktok: "",
        youtube: "",
        facebook: "",
        x: "",
        linkedin: "",
      },
    },
    desc: "",
    funFact: "",
    weight: 0,
  },
  {
    slug: "datotel",
    business: "Datotel",
    firstName: "Blake",
    lastName: "Mueller",
    title: "Lead Senior Support Engineer",
    tier: "Founding",
    since: "2026",
    logo: "/members/datotel-logo.png",
    photo: "/members/blake-mueller.jpg",
    categories: ["IT Services","Managed IT"],
    company: {
      address: "11820 Tesson Ferry Rd, Suite 1500, St. Louis, MO 63128",
      phone: "314.241.9101",
      email: "services@datotel.com",
      website: "https://www.datotel.com/",
      socials: {
        instagram: "",
        tiktok: "",
        youtube: "https://www.youtube.com/datotel",
        facebook: "https://www.facebook.com/datotel/",
        x: "https://x.com/Datotel?fbclid=IwY2xjawUS9ZtwZG9mBWV4dG4DYWVtAjEwAGJyaWQRMVVvOEQwVHRDQmRES29odVFzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEeSunH3pJDXLG66AKZiHV37AP_BuefcrcPjPcGMpydmwL6giPf3KHAIcUcqSw_aem_8uLeh9BRF4ax4vM-RBJHmA",
        linkedin: "https://www.linkedin.com/in/blakemueller093/",
      },
    },
    contact: {
      phone: "",
      email: "",
      socials: {
        instagram: "",
        tiktok: "",
        youtube: "",
        facebook: "",
        x: "",
        linkedin: "",
      },
    },
    desc: "Datotel is a provider of Cloud Computing Environments, Hosted Managed Services, Colocation and Outsourcing",
    funFact: "",
    weight: 0,
  },
  {
    slug: "swipe-aras",
    business: "Swipe ARAS",
    firstName: "Simon",
    lastName: "Yost",
    title: "VP Product & Engineering",
    tier: "Founding",
    since: "2026",
    logo: "/members/swipe-aras-logo.png",
    photo: "/members/simon-yost.jpg",
    categories: ["Payment Processing","FinTech"],
    company: {
      address: "",
      phone: "402.598.9074",
      email: "info@swipearas.com",
      website: "https://swipearas.com/",
      socials: {
        instagram: "",
        tiktok: "",
        youtube: "",
        facebook: "",
        x: "",
        linkedin: "",
      },
    },
    contact: {
      phone: "",
      email: "",
      socials: {
        instagram: "",
        tiktok: "",
        youtube: "",
        facebook: "",
        x: "",
        linkedin: "https://www.linkedin.com/in/simonyost/",
      },
    },
    desc: "Swipe ARAS is the fintech partner PE firms and enterprise companies trust to modernize payments, recover margin, and unlock new revenue.\nServices include enterprise-grade payment processing with transparent pricing, branded Visa card issuing, embedded banking, lending and working capital, custom ERP integrations (NetSuite, Sage and legacy systems), and the Forge platform for real-time reporting and split payouts.\nFounded by operators, not consultants: they get in the system, solve the integration problems, and stay until the numbers prove it worked.",
    funFact: "Simon was the first member of NexCore South County, and one of the members of the original NexCore in Fox Park.",
    weight: 0,
  },
];
