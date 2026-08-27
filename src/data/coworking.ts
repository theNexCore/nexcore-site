/**
 * Coworking commercial data.
 * Extracted verbatim from the live site's OFFICES/SPACES arrays
 * (audit/coworking-data.json). Photo URLs remapped to local /img assets.
 */

export interface Office {
  id: string;
  name: string;
  price: number;
  capacity: string;
  window: string;
  guests: string;
  desc: string;
  available: boolean;
  photos: string[];
  /** Present on one office only (FourScopes). */
  feature?: string;
}

export interface SpaceConfig {
  label: string;
  value: string;
}

export interface FeatureGroup {
  title: string;
  items: string[];
}

export interface Space {
  id: string;
  name: string;
  tag: string;
  /** Standard hourly rate. */
  rate: number;
  /** Member hourly rate; null where member pricing does not apply. */
  member: number | null;
  unit: string;
  /** Alternate rate/unit, e.g. a full-day office rental. */
  altRate?: number;
  altUnit?: string;
  minHours?: number;
  /** Human-readable minimum, e.g. "2-hour minimum". */
  min: string | null;
  capacity: string;
  teaser: string;
  desc: string;
  configs?: SpaceConfig[];
  features?: string[];
  featureGroups?: FeatureGroup[];
  quote?: string;
  available: boolean;
  photos: string[];
}

export const offices: Office[] = [
  {
    "id": "executive-suite",
    "name": "Executive Suite",
    "price": 1395,
    "capacity": "Up to 6 people",
    "window": "Private rear office with natural light",
    "guests": "Up to two guests daily",
    "desc": "Large executive workspace featuring an open front office, private rear office, and room for meetings, collaboration, or executive operations.",
    "available": true,
    "photos": [
      "/img/20260804-190404.jpg",
      "/img/20260804-190446.jpg",
      "/img/20260804-190423.jpg",
      "/img/20260804-190431.jpg",
      "/img/20260804-190411.jpg",
      "/img/executive-office1.png"
    ]
  },
  {
    "id": "lilianas-office",
    "name": "Liliana's Office",
    "price": 1195,
    "capacity": "4–5 people",
    "window": "Two large windows, abundant natural light",
    "guests": "Up to two guests daily",
    "desc": "Private waiting area, reception space, and generous natural light create an ideal client-facing office.",
    "available": false,
    "photos": [
      "/img/20260804-194427.jpg"
    ]
  },
  {
    "id": "left-column-office",
    "name": "Left Column Office",
    "price": 995,
    "capacity": "4–5 people",
    "window": "Small window",
    "guests": "One guest daily",
    "desc": "Comfortable office with natural light, ideal for professionals needing additional space.",
    "available": true,
    "photos": [
      "/img/20260803-134854.jpg",
      "/img/20260803-134832.jpg",
      "/img/20260804-185937.jpg",
      "/img/20260804-185947.jpg",
      "/img/20260804-190002.jpg",
      "/img/20260803-134822.jpg"
    ]
  },
  {
    "id": "right-column-office",
    "name": "Right Column Office",
    "price": 995,
    "capacity": "4–5 people",
    "window": "Small window",
    "guests": "One guest daily",
    "desc": "Bright office with a flexible layout and comfortable workspace for growing businesses.",
    "available": true,
    "photos": [
      "/img/20260804-190021.jpg",
      "/img/20260804-190014.jpg",
      "/img/20260804-190029.jpg"
    ]
  },
  {
    "id": "access-office",
    "name": "Access Office",
    "price": 965,
    "capacity": "4–5 people",
    "window": "No window",
    "guests": "One guest daily",
    "desc": "Spacious interior office with convenient access and room for a growing team.",
    "available": true,
    "photos": [
      "/img/20260804-185904.jpg",
      "/img/20260803-134738.jpg",
      "/img/20260804-185825.jpg",
      "/img/20260804-185916.jpg"
    ]
  },
  {
    "id": "beam-office",
    "name": "Beam Office",
    "price": 945,
    "capacity": "3–4 people",
    "window": "Two large windows, abundant natural light",
    "guests": "One guest daily",
    "desc": "Bright office featuring exposed architectural beams and abundant natural light.",
    "available": true,
    "photos": [
      "/img/20260804-184841.jpg",
      "/img/20260804-184851.jpg",
      "/img/20260804-184858.jpg",
      "/img/20260804-184916.jpg"
    ]
  },
  {
    "id": "corner-office",
    "name": "Corner Office",
    "price": 945,
    "capacity": "3–5 people",
    "window": "Two large windows, lots of natural light",
    "guests": "One guest daily",
    "desc": "Corner location with expansive windows providing one of the brightest offices in the building.",
    "available": true,
    "photos": [
      "/img/20260804-184655.jpg",
      "/img/20260804-184700.jpg",
      "/img/20260804-184709.jpg",
      "/img/20260803-125424.jpg"
    ]
  },
  {
    "id": "window-office",
    "name": "Window Office",
    "price": 945,
    "capacity": "3–5 people",
    "window": "Large window, lots of natural light",
    "guests": "One guest daily",
    "desc": "Popular naturally lit office overlooking the exterior.",
    "available": false,
    "photos": [
      "/img/20260804-201706.jpg"
    ]
  },
  {
    "id": "rear-right-office",
    "name": "Rear Right Office",
    "price": 895,
    "capacity": "2–4 people",
    "window": "One window, lots of natural light",
    "guests": "No guests",
    "desc": "Quiet office with excellent natural lighting.",
    "available": true,
    "photos": [
      "/img/20260804-190327.jpg",
      "/img/20260804-190335.jpg",
      "/img/20260804-190347.jpg"
    ]
  },
  {
    "id": "rear-left-office",
    "name": "Rear Left Office",
    "price": 845,
    "capacity": "1–3 people",
    "window": "One window, lots of natural light",
    "guests": "No guests",
    "desc": "Comfortable office ideal for independent professionals.",
    "available": true,
    "photos": [
      "/img/left-rear-office5.png",
      "/img/left-rear-office1.png",
      "/img/left-rear-office2.png",
      "/img/left-rear-office3.png",
      "/img/left-rear-office4.png"
    ]
  },
  {
    "id": "pool-office",
    "name": "Pool Office",
    "price": 795,
    "capacity": "1–2 people",
    "window": "Natural light",
    "guests": "No guests",
    "desc": "Compact office with natural light, ideal for focused work.",
    "available": true,
    "photos": [
      "/img/20260804-184756.jpg",
      "/img/20260804-184740.jpg",
      "/img/20260804-184748.jpg"
    ]
  },
  {
    "id": "rookie-office",
    "name": "Rookie Office",
    "price": 715,
    "capacity": "1–3 people",
    "window": "No window",
    "guests": "No guests",
    "desc": "Affordable starter office, perfect for entrepreneurs launching a business.",
    "available": true,
    "photos": [
      "/img/20260804-184818.jpg",
      "/img/20260804-184811.jpg",
      "/img/20260804-184831.jpg"
    ]
  },
  {
    "id": "lg-office",
    "name": "LG Office",
    "price": 715,
    "capacity": "1–3 people",
    "window": "No window",
    "guests": "No guests",
    "desc": "Efficient workspace offering privacy and affordability.",
    "available": true,
    "photos": [
      "/img/20260804-184942.jpg",
      "/img/20260804-184933.jpg",
      "/img/20260804-184959.jpg"
    ]
  },
  {
    "id": "arch-office",
    "name": "Arch Office",
    "price": 685,
    "capacity": "1–2 people",
    "window": "No window",
    "guests": "No guests",
    "desc": "Compact private office ideal for solo professionals.",
    "available": false,
    "photos": [
      "/img/20260804-191635.jpg"
    ]
  },
  {
    "id": "fourscopes-office",
    "name": "FourScopes Office",
    "price": 685,
    "capacity": "1–3 people",
    "window": "No window",
    "guests": "No guests",
    "feature": "Abundant electrical outlets for multiple computers and equipment.",
    "desc": "Technology-friendly office designed for equipment-heavy workflows.",
    "available": false,
    "photos": [
      "/img/20260804-192135.jpg"
    ]
  },
  {
    "id": "soco-chamber-office",
    "name": "SoCo Chamber Office",
    "price": 645,
    "capacity": "1–2 people",
    "window": "No window",
    "guests": "No guests",
    "desc": "Quiet interior office suited for focused work.",
    "available": false,
    "photos": [
      "/img/20260804-191813.jpg"
    ]
  },
  {
    "id": "lower-level-office-two",
    "name": "Lower Level Office Two",
    "price": 645,
    "capacity": "1–2 people",
    "window": "No window",
    "guests": "No guests",
    "desc": "Private lower-level office offering affordability and privacy.",
    "available": true,
    "photos": [
      "/img/20260804-191905.jpg",
      "/img/20260804-191920.jpg"
    ]
  },
  {
    "id": "lower-level-office-three",
    "name": "Lower Level Office Three",
    "price": 645,
    "capacity": "1–2 people",
    "window": "No window",
    "guests": "No guests",
    "desc": "Private lower-level office ideal for individual professionals.",
    "available": false,
    "photos": [
      "/img/20260804-192003.jpg"
    ]
  }
];

export const spaces: Space[] = [
  {
    "id": "event-center",
    "name": "Event Center",
    "tag": "Multifunction Event Center",
    "rate": 150,
    "member": 75,
    "unit": "hour",
    "minHours": 2,
    "min": "2-hour minimum",
    "capacity": "20 boardroom · up to 80 theater",
    "teaser": "A custom-built venue that transforms for presentations, workshops, celebrations, and community events.",
    "desc": "The Event Center was designed to transform for nearly any type of event—from business presentations and networking functions to workshops, training sessions, celebrations, and community gatherings.",
    "configs": [
      {
        "label": "Large Boardroom",
        "value": "20"
      },
      {
        "label": "Classroom",
        "value": "30–36"
      },
      {
        "label": "Rounds",
        "value": "40–48"
      },
      {
        "label": "Theater",
        "value": "Up to 80"
      }
    ],
    "features": [
      "Custom-built event venue",
      "Concert-quality Bose sound system",
      "Full professional AV system",
      "Wireless microphones",
      "DJ controls",
      "Cast-enabled 75\" display",
      "Dual-zone lighting",
      "6000K presentation lighting",
      "4500K ambient event lighting",
      "Rear registration/check-in table",
      "Exterior registration/check-in station",
      "Premium seating options",
      "Flexible room configurations"
    ],
    "quote": "For larger events or custom room configurations, contact NexCore for a customized quote.",
    "available": true,
    "photos": [
      "/img/screenshot-2026-08-04-214608.png",
      "/img/20260728-171854.jpg",
      "/img/20260728-171916-0.jpg",
      "/img/20260728-171916.jpg",
      "/img/chatgpt-image-aug-1-2026-08-49-57-pm.png",
      "/img/screenshot-2026-08-02-174823.png",
      "/img/screenshot-2026-08-04-214728.png",
      "/img/screenshot-2026-08-04-214854.png",
      "/img/ec-colors.png",
      "/img/ec-colors-3.png",
      "/img/ec-colors-2.png",
      "/img/20260804-221640.jpg",
      "/img/20260804-221648.jpg",
      "/img/20260804-221659.jpg",
      "/img/20260804-221719.jpg",
      "/img/20260804-221746.jpg",
      "/img/nexcore-events-presentation.png",
      "/img/nexcore-learning.png"
    ]
  },
  {
    "id": "studio",
    "name": "The Studio",
    "tag": "Multipurpose Studio",
    "rate": 75,
    "member": 35,
    "unit": "hour",
    "min": null,
    "capacity": "Photo, video, podcast & livestream",
    "teaser": "A creative media studio for photography, videography, podcasting, interviews, and livestreaming.",
    "desc": "Designed for photography, videography, podcasting, interviews, livestreaming, product photography, and creative media production. Bring your laptop and create.",
    "featureGroups": [
      {
        "title": "Photography",
        "items": [
          "Canon DSLR camera",
          "Multiple professional lenses",
          "Professional lighting",
          "Product display boxes",
          "Green screen",
          "Black backdrop"
        ]
      },
      {
        "title": "Podcast",
        "items": [
          "Two oversized reclining faux leather chairs",
          "Oversized faux leather couch",
          "Cast-enabled television",
          "On-Air signage",
          "Professional mixer",
          "18 microphone options",
          "Fully prewired"
        ]
      }
    ],
    "available": true,
    "photos": [
      "/img/podcast1.png",
      "/img/podcast6.png",
      "/img/podcast5.png",
      "/img/podcast4.png",
      "/img/podcast3.png",
      "/img/podcast2.png",
      "/img/20260804-135247.jpg",
      "/img/20260804-135235.jpg",
      "/img/20260804-135231.jpg",
      "/img/20260804-135212.jpg",
      "/img/20260804-135207.jpg",
      "/img/20260804-135201.jpg",
      "/img/20260804-135159.jpg",
      "/img/20260804-135150.jpg",
      "/img/20260804-135039.jpg",
      "/img/20260804-135035.jpg",
      "/img/20260804-135032.jpg",
      "/img/20260804-135026.jpg",
      "/img/20260804-135020.jpg",
      "/img/20260804-135016.jpg",
      "/img/32.png"
    ]
  },
  {
    "id": "war-room",
    "name": "War Room",
    "tag": "Strategy & Planning",
    "rate": 55,
    "member": 25,
    "unit": "hour",
    "min": null,
    "capacity": "14–18 people",
    "teaser": "Built for planning, leadership retreats, strategic sessions, and high-level collaboration.",
    "desc": "Built specifically for planning, leadership retreats, strategic sessions, and high-level collaboration.",
    "features": [
      "Cast-enabled television",
      "Two black planning boards",
      "Beverage station",
      "Large open wall space for strategy planning, Post-it sessions, brainstorming, and collaborative workshops"
    ],
    "available": true,
    "photos": [
      "/img/20260804-185732.jpg",
      "/img/20260804-185742.jpg",
      "/img/20260804-185751.jpg",
      "/img/20260804-185807.jpg"
    ]
  },
  {
    "id": "west-conference",
    "name": "West Conference Room",
    "tag": "Meeting Room",
    "rate": 40,
    "member": 20,
    "unit": "hour",
    "min": null,
    "capacity": "5–8 people",
    "teaser": "Ideal for client meetings, interviews, presentations, and team collaboration.",
    "desc": "Ideal for client meetings, interviews, presentations, and team collaboration.",
    "features": [
      "Cast-enabled TV",
      "Whiteboard",
      "Conference seating",
      "Professional meeting environment"
    ],
    "available": true,
    "photos": [
      "/img/20260804-190530.jpg",
      "/img/20260804-190545.jpg",
      "/img/20260804-190557.jpg"
    ]
  },
  {
    "id": "east-conference",
    "name": "East Conference Room",
    "tag": "Meeting Room",
    "rate": 40,
    "member": 20,
    "unit": "hour",
    "min": null,
    "capacity": "4–6 people",
    "teaser": "Perfect for small meetings, coaching sessions, interviews, and focused collaboration.",
    "desc": "Perfect for small meetings, coaching sessions, interviews, and focused collaboration.",
    "features": [
      "Cast-enabled TV",
      "Whiteboard",
      "Conference seating",
      "Professional meeting environment"
    ],
    "available": true,
    "photos": [
      "/img/20260804-190623.jpg",
      "/img/20260804-190605.jpg",
      "/img/20260804-190616.jpg"
    ]
  },
  {
    "id": "daily-office",
    "name": "Office Rental",
    "tag": "Private Office, Hourly / Daily",
    "rate": 55,
    "member": null,
    "unit": "hour",
    "altRate": 150,
    "altUnit": "day",
    "min": null,
    "capacity": "Available while inventory permits",
    "teaser": "Need a private office for the day? Available whenever inventory allows.",
    "desc": "Need a private office for the day? Multiple private offices are available for daily rental whenever inventory allows. Perfect for remote workers, traveling professionals, confidential meetings, or simply needing a quiet workspace.",
    "features": [
      "Available only while inventory permits",
      "Automatically removed once permanently leased"
    ],
    "available": true,
    "photos": [
      "/img/left-rear-office5.png"
    ]
  }
];

