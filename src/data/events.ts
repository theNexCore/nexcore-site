/**
 * Events calendar — the single source of truth for /events.
 *
 * Edit this file to add, change or remove an event; the calendar, each event's
 * own page and the sitemap all read from it. Migrated from the Google Sheet
 * feed on 2026-09-16.
 *
 * All times are NexCore local time (America/Chicago), written "YYYY-MM-DDTHH:mm"
 * on a 24-hour clock: 6:30 PM is "18:30".
 *
 * ONE-OFF EVENT
 *   {
 *     slug: 'pizza-night-2026-11-05',
 *     title: 'Pizza Night',
 *     start: '2026-11-05T18:00',
 *     end: '2026-11-05T20:00',
 *     img: '/events/pizza-night.jpg',
 *     desc: 'Plain text. Blank lines separate paragraphs.',
 *   }
 *
 * RECURRING EVENT — add `repeat`. `start`/`end` are the FIRST occurrence; every
 * later one keeps the same time of day and length. Occurrences are generated
 * 8 weeks ahead and published as /events/<slug>-<YYYY-MM-DD>.
 *   {
 *     slug: 'coffee-connect',
 *     title: 'Coffee Connect',
 *     start: '2026-09-17T08:00',
 *     end: '2026-09-17T09:00',
 *     repeat: {
 *       freq: 'weekly',          // 'daily' | 'weekly' | 'monthly'
 *       byWeekday: ['TH'],       // MO TU WE TH FR SA SU
 *       interval: 2,             // optional: every 2nd week
 *       nth: 1,                  // optional, monthly only: 1 = first, -1 = last
 *       until: '2026-12-31',     // optional: last possible date
 *       count: 10,               // optional: stop after 10 occurrences
 *     },
 *     skip: ['2026-11-26'],      // optional: dates to leave out
 *     desc: '…',
 *   }
 *   "First Tuesday of every month": { freq: 'monthly', byWeekday: ['TU'], nth: 1 }
 *
 * SERIES — group events under an entry in `eventSeries` (below the types) by
 * setting `series: '<id>'` on each event. Every series gets a page at
 * /events/<id> listing its events. With `collapse: true`, the list view on
 * /events shows the whole series as one card linking to that page instead of
 * a card per date; the calendar view always shows every date.
 *
 * Images live in public/events/ as /events/<event-name>.jpg. A path whose file
 * is not in public/ yet renders the branded fallback, and `npm run images`
 * lists every missing file.
 */

export type Weekday = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';

export interface EventRepeat {
  freq: 'daily' | 'weekly' | 'monthly';
  byWeekday?: Weekday[];
  interval?: number;
  nth?: number;
  until?: string;
  count?: number;
}

export interface EventRecord {
  /**
   * URL segment. One-off: the full slug, /events/<slug>. Recurring: the base,
   * with each occurrence's date appended. Changing it breaks existing links.
   */
  slug: string;
  title: string;
  start: string;
  end: string;
  repeat?: EventRepeat;
  /** Recurring only: occurrence dates (YYYY-MM-DD) to leave out. */
  skip?: string[];
  /** Doors-open time as displayed, e.g. "5:30 PM". */
  doors?: string;

  /** Defaults to 'nexcore'. */
  locationType?: 'nexcore' | 'plaza' | 'online' | 'offsite';
  locationName?: string;
  locationAddress?: string;

  /** Card blurb. Defaults to the start of `desc`. */
  summary?: string;
  desc: string;

  img?: string;
  gallery?: string[];

  /** Defaults to "Free". */
  priceLabel?: string;
  /** Numeric price for search engines. Defaults to 0 for "Free". */
  priceValue?: number;

  link?: string;
  /** Defaults to "Get Tickets". */
  linkLabel?: string;
  link2?: string;
  link2Label?: string;

  /** The `id` of an entry in `eventSeries`. */
  series?: string;
  /** Position within the series, shown as "Part N". */
  seriesOrder?: number;
}

export interface EventSeries {
  /** Page URL, /events/<id>, and the value events put in `series`. */
  id: string;
  name: string;
  /** One or two sentences, shown on the collapsed card and the series page. */
  summary: string;
  /** Square-ish logo in public/events/series/. */
  logo?: string;
  /** CSS colour behind the logo, matching its artwork's edge. Defaults to white. */
  logoBg?: string;
  /** Show the series as a single card in the /events list view. */
  collapse?: boolean;
}

export const eventSeries: EventSeries[] = [
  {
    id: 'businessgps',
    name: 'BusinessGPS',
    summary:
      'A weekly Thursday-morning gathering of business owners and professionals building real relationships, not swapping cards. One seat per industry, and visiting is always free.',
    logo: '/events/series/businessgps-logo.png',
    logoBg: '#dce8fc',
    collapse: true,
  },
];

export const events: EventRecord[] = [
  {
    slug: "a-taste-of-plaza21-2026-10-17",
    title: "A Taste of Plaza21",
    start: "2026-10-17T09:00",
    end: "2026-10-17T21:00",
    doors: "9:00 AM",
    img: "/events/a-taste-of-plaza21.jpg",
    priceLabel: "Free",
    link: "https://www.eventbrite.com/e/nexcore-the-soco-chamber-present-a-taste-of-plaza-21-tickets-1994936214921?aff=ebdssbdestsearch",
    link2: "https://www.eventbrite.com/e/nexcore-the-soco-chamber-present-a-taste-of-plaza-21-tickets-1994936214921?aff=ebdssbdestsearch",
    link2Label: "Vendor Tickets ($25 REFUNDABLE DEPOSIT)",
    desc: "Overview\nA Taste of Plaza 21 Presented by NexCore & The South County SOCO Chamber! A full day of food, music, shopping, and community!\n\nA Taste of Plaza 21\n\nPresented by NexCore • Co-Presented by The South County SOCO Chamber\nA full day of food, music, shopping, and community—all in one place!\n\nJoin us for the inaugural Taste of Plaza 21, a free community celebration showcasing the incredible businesses, entrepreneurs, restaurants, and organizations that make Plaza 21 a destination for South County.\n\nSpend the day exploring local businesses, meeting entrepreneurs, discovering unique products, enjoying delicious food, and experiencing live entertainment while supporting our local business community.\n\nWhether you're looking to shop early for the holidays, discover a new favorite business, enjoy great music, or simply spend the day with family and friends, there's something for everyone.\n\nEvent Highlights\n🎵 Live Music\n\nCameron Novak and The Party begins at 6:30pm and goes until 9pm\n🛍️ Pop-Up Vendor Marketplace\n\n9:15 AM – 6:00 PM\nShop local artisans, makers, retailers, and small businesses\nVendor booths are FREE with advance registration and a $25 refundable deposit.\n🍴 Food & Beverage\n\nEnjoy offerings from Plaza 21 businesses and local food vendors\n🏢 Explore Plaza 21\n\nVisit participating businesses throughout the plaza\nMeet business owners\nDiscover exclusive specials and promotions\n🎉 Family-Friendly Activities\n\nFun for all ages\nAdditional activities and entertainment to be announced\nEvent Information\nDate: Saturday, October 17\n\nTime: 9:00 AM – 9:00 PM\n\nLocation: Plaza 21 (in front of the NexCore building)\n\nAdmission: FREE\n\nVendor Registration\nInterested in showcasing your business?\n\nVendor booths are FREE, but registration is required. Reserve your space early, as availability is limited. There will be limited availability. a $25 deposit will taken per booth, booths are 9'x8'. Registration fee will be refunded at the conclusion of the event via the method you paid. No shows will not be refunded.\n\nVendor check in and setup will be available the morning of the event.\n\nGeneral Admission\nAdmission is free, but we encourage attendees to register so they can receive event updates, participating business announcements, entertainment schedules, and special promotions leading up to the event.\n\nCome experience the best of South County and celebrate the businesses that make our South County community thrive!\n\n\n\nSponsorship Opportunities for this event: There are sponsorship opportunities for this event. Event Sponsors will be added to all communication, featured on the electronic signage and on the large banner for the event, and added to the vendor welcome pack. Additionally sponsors will be featured in social media campags as supporting and providing the resources for this event.",
  },
  {
    slug: "nexcore-returns-grand-opening-celebration-2026-07-23",
    title: "NexCore Returns! Grand Opening Celebration",
    start: "2026-07-23T18:30",
    end: "2026-07-23T21:00",
    doors: "5:45 PM",
    img: "/events/nexcore-returns-grand-opening.jpg",
    priceLabel: "Free",
    desc: "Overview\nNexCore Returns! is back in action—get ready to reconnect, recharge, and dive into the future together!\n\nFOR IMMEDIATE RELEASE NexCore Returns: A Proven Model for Building Businesses, Partnerships, and Community Opens a New Chapter\n\nAfter helping launch more than 550 businesses, partnerships, projects, collaborations, and community focused initiatives—and creating nationally recognized initiatives including Streamathon for Small Business, ChangeMakers21, and the St. Louis Small Business Independence Day Celebration—NexCore returns with a new headquarters and a renewed commitment to helping organizations grow.\nST. LOUIS, MO. — For nearly a decade, NexCore has quietly been building businesses, launching ideas, strengthening nonprofits, and bringing people together across the St. Louis region.\n\nOn Thursday, July 23, that work begins again.\n\nWhen the pandemic threatened thousands of local businesses, NexCore refused to stand still. Instead, it created Streamathon for Small Business, a marathon live-streaming event that united entrepreneurs, community leaders, volunteers, entertainers, professional athletes, and supporters to rally behind small businesses when they needed it most. The effort drew support from former St. Louis Mayor Lyda Krewson, the St. Louis Battlehawks, actor Jon Hamm, and countless community leaders. During the event, Jon Hamm purchased $5,000 worth of pizza for healthcare workers at SSM, becoming one of many memorable moments that demonstrated the generosity and resilience of the St. Louis community.\n\nBut Streamathon was only one chapter in the NexCore story.\n\nFounded in 2017, NexCore began with a vision to prove that investing in people could transform far more than buildings. Inside a collection of long-vacant and neglected properties in St. Louis' Fox Park neighborhood, NexCore built one of the region's most vibrant entrepreneurial communities.\n\nWhat followed exceeded every expectation.\n\nMore than 1,000 businesses and nonprofit organizations called NexCore home while more than 550 businesses, strategic partnerships, collaborative projects, entrepreneurial ventures, community initiatives, and transformative ideas were launched, strengthened, or supported through the NexCore community.\n\nNearly 1,000 events filled the calendar, welcoming entrepreneurs, artists, students, neighborhood residents, elected officials, nonprofit leaders, and business professionals from across the region.\n\nNexCore became known not only for helping businesses grow, but for creating experiences that brought people together. Signature initiatives included Streamathon for Small Business, ChangeMakers21, the St. Louis Small Business Independence Day Celebration, entrepreneur development workshops, financial literacy programs, networking events, business launch classes, community meetings, youth initiatives, nonprofit fundraisers, and countless collaborations that inspired new partnerships throughout the region.\n\nBehind every event was the same mission: create opportunities, build relationships, and leave the community stronger than it was before.\n\nThe impact extended well beyond the walls of the building. Businesses expanded into locations of their own. Nonprofits established permanent homes. Artists found audiences. Entrepreneurs found mentors. Community leaders emerged. Partnerships were formed. Ideas became organizations. Even today, NexCore's former Fox Park campus continues serving the community through an organization that first found its footing inside NexCore—proof that investing in people creates a legacy that continues long after the ribbon is cut.\n\nThe need for places where entrepreneurs, nonprofits, creators, and business leaders can genuinely collaborate has never been greater.\n\nNow, that proven model returns.\n\nOn Thursday, July 23, NexCore will celebrate the grand opening of its new headquarters at 11820 Tesson Ferry Road in South St. Louis County.\n\nThe new campus has been intentionally designed to bring people together. It features a flexible event center, multiple conference and meeting rooms, private executive offices, open coworking space, professional podcast and recording studios, a photography and content creation studio, training rooms, and collaborative environments built to help organizations connect, create, and grow.\n\nGuests attending the Grand Opening Celebration will enjoy an evening of connection, conversation, and discovery as they tour the new NexCore facility, meet the team behind the vision, and connect with entrepreneurs, business owners, nonprofit leaders, creators, and community partners from across the region. Complimentary beverages and refreshments will be served, featuring local favorites from Liliana's, Baskin-Robbins, and the iconic Merb's Candies. Guests will also receive a first look at the workshops, networking opportunities, educational programming, and signature initiatives that will define the next chapter of NexCore.\n\nBut the celebration doesn't end when the ribbon is cut.\n\nBeginning Monday, July 27, and continuing through July 31, NexCore is opening its doors for Experience NexCore Week. Entrepreneurs, freelancers, remote workers, startups, nonprofit organizations, creators, and business professionals are invited to experience the NexCore community free of charge and discover what makes it unlike any other.\n\n\"If you're 99% convinced you should be here, I'm 100% convinced you shouldn't be.\"\n\nEntrepreneur and mixologist Anthony Stewart remembers the moment he knew he belonged.\n\n\"I walked through, and all the people were interacting in the kitchen. And I thought, 'I'm here. I'm in. I'm done.'\"\n\nHaley Johnston described her first impression simply:\n\n\"When you walk through the door, you're treated like family.\"\n\nFor Kristy Jackson, NexCore represented something even bigger.\n\n\"The mission, the passion, and the heart that's demonstrated from NexCore is one that I have not yet seen. The founder of NexCore is accessible. Here. This really shows the passion behind building a business, but also building a community at the same time.\"\n\nFox Park proved what was possible.\n\nOn July 23, NexCore begins proving it again.\n\nThe community is invited to celebrate NexCore's return, experience the new headquarters firsthand, and discover why so many entrepreneurs, organizations, creators, and community leaders have called NexCore home. Whether you're launching a business, growing an organization, producing your next podcast, hosting your next event, or simply looking for a community built on collaboration, NexCore invites you to walk through the doors and experience it for yourself.\n\n\n\n\n\nGrand Opening Celebration\nThursday, July 23, 2026\n\n5:45pm - 6:30pm Networking\n\n6:30pm – 7:00pm Announcements and Programming\n\n7:00pm - 7:10pm Ribbon Cutting\n\n7:10pm - 9:00 pm Your NexCore (Take a stroll or have a guided tour)\n\nJoin us as we celebrate the return of NexCore and the beginning of an exciting new chapter.\n\nThe evening will begin with the official ribbon-cutting ceremony hosted by the SOCO Chamber, followed by guided tours of the new NexCore headquarters. Guests will have the opportunity to explore the coworking spaces, conference rooms, podcast and recording studios, photography studio, event center, and collaborative workspaces while meeting entrepreneurs, nonprofit leaders, creators, business owners, and community partners from across the St. Louis region.\n\nComplimentary beverages and refreshments will be served throughout the evening, featuring local favorites from Liliana's, Baskin-Robbins, and the iconic Merb's Candies.\n\nGuests will also receive a preview of the workshops, networking opportunities, educational programming, and signature initiatives that will define the next chapter of NexCore.\n\nExperience NexCore Week\nThe celebration doesn't end on opening night.\n\nBeginning Monday, July 27, and continuing through Friday, July 31, NexCore is opening its coworking community to the public at no cost.\n\nEntrepreneurs, freelancers, remote workers, startups, nonprofit organizations, creators, and business professionals are invited to spend a day—or the entire week—working from NexCore, meeting fellow members of the community, attending select programming, and discovering what makes NexCore unlike any other place to work, collaborate, and grow.\n\nEvent Location\nNexCore\n\n11820 Tesson Ferry Road\n\nSt. Louis, Missouri 63128\n\nLocated at the corner of Tesson Ferry Road and Baptist Church Road.\n\nJust look for the big blue lights on the building—you won't miss it.\n\nAdmission is free and open to the public.\n\nRSVP: HERE ON EVENTBRITE\n\n\n\n\n\nAbout NexCore\nFounded in 2017, NexCore creates environments where entrepreneurs, businesses, nonprofits, creators, and community organizations connect, collaborate, and grow. Through innovative workspaces, educational programming, strategic partnerships, business support services, and community engagement, NexCore helps transform ideas into action, relationships into partnerships, and opportunities into lasting success.",
  },
  {
    slug: "experience-nexcore-week-2026-07-27",
    title: "EXPERIENCE NexCore Week!",
    start: "2026-07-27T08:00",
    end: "2026-07-27T18:00",
    doors: "8:00 AM",
    img: "/events/experience-nexcore-week.jpg",
    priceLabel: "Free",
    desc: "Overview\nExperience NexCore for Yourself: For one week only, we're opening our doors and inviting the entire community to experience everything!\n\nExperience NexCore Week\nJuly 27–31, 2026 | Daily from 8:00 AM – 6:00 PM\nNexCore Coworking\n11820 Tesson Ferry Rd. | St. Louis, MO 63128\n\nExperience NexCore for Yourself\nFor one week only, we're opening our doors and inviting the entire community to experience everything NexCore has to offer—completely free.\n\nWhether you're an entrepreneur, remote worker, startup founder, creative professional, nonprofit leader, student, or simply curious about what we're building, this is your opportunity to explore one of St. Louis' newest business and innovation hubs.\n\nCome spend an hour—or stay all day—and discover why NexCore is becoming The Starting Point For It All.\n\nDuring Experience NexCore Week, you'll have access to:\nNearly 6,000 square feet of modern coworking space\nNearly 20 private offices available for rent\nA fully equipped podcast studio\nA professional recording studio\nA dedicated photography studio\nMultiple meeting and conference rooms\nA versatile event center\nOutdoor seating and collaboration space\nComplimentary coffee and member amenities\nHigh-speed internet and productive workspaces\nOpportunities to network with entrepreneurs, business owners, and community leaders\nThis isn't a sales event—it's an opportunity to experience the NexCore community firsthand. Work for the day, hold a meeting, record a podcast, tour the facility, meet our members, and discover how NexCore can help power what's next for you or your business.\n\nWhether you're looking for a professional workspace, a place to collaborate, create content, host events, or simply connect with other professionals, you'll find it here.\n\nAdmission is FREE. Just RSVP Here\nNo membership required.\nJust stop in anytime between 8:00 AM and 6:00 PM, July 27–31.\n\nBe among the first to experience what's next.\nWhile you're here, you'll also get a preview of the exciting workshops, leadership events, networking opportunities, ribbon cuttings, community initiatives, and special events coming to NexCore throughout the coming year—including the return of St. Louis Small Business Independence Day in 2027.\n\nPowering What's Next starts here.",
  },
  {
    slug: "community-event-sponsored-by-nexcore-grand-opening-of-media-2026-10-17",
    title: "Community Event Sponsored by NexCore:  Grand Opening of Media Cavern presented by The SOCO Chamber",
    start: "2026-10-17T17:00",
    end: "2026-10-17T21:00",
    doors: "5:00 PM",
    img: "/events/media-cavern-grand-opening.jpg",
    priceLabel: "Free",
    link: "https://www.eventbrite.com/e/grand-opening-of-media-cavern-presented-by-the-soco-chamber-tickets-1995329293630?aff=oddtdtcreator&keep_tld=true",
    desc: "Overview\nCelebrate Media Cavern's grand opening with a ribbon cutting, live music, and the story behind a South County institution.\n\nSome \"grand openings\" celebrate a beginning.\n\nThis one celebrates survival, passion, and a story that's been building for decades.\n\nLong before Media Cavern, this location was home to CD Warehouse, a destination for music lovers across St. Louis. Cameron \"Cam\" Novack worked there for close to 5 years, until one day the owner simply walked away.\n\nRather than let that space and community disappear, Cam stepped in and built Media Cavern, driven by a love of physical media and the people who collect it.\n\nThere was no grand plan.\n\nNo sign change.\n\nNo big launch.\n\nJust heart.\n\nNow, in partnership with the South County Chamber, Media Cavern is celebrating its first official grand opening and the launch of The Media Cavern website (goes live August 6th) at this long overdue celebration.\n\nJoin us.\n\nSaturday, September 5, at 5p.m., for a ribbon cutting ceremony, presented by the South County Chamber, followed by a live concert featuring Cameron Novack and other musical guests.\n\nExplore the collections, feel the nostalgia, and be part of the next chapter.\n\nFree admission. (PLEASE RSVP HERE)\n\nAll are welcome.",
  },
  {
    slug: "businessgps-weekly-networking-event-returns",
    title: "BusinessGPS Weekly Networking Event (RETURNS!)",
    start: "2026-09-17T09:30",
    end: "2026-09-17T10:30",
    repeat: { freq: 'weekly', byWeekday: ['TH'] },
    series: 'businessgps',
    doors: "9:30 AM",
    img: "/events/businessgps-weekly-networking.jpg",
    priceLabel: "Free",
    link: "https://www.eventbrite.com/e/businessgps-weekly-networking-event-returns-tickets-1994934859868?aff=oddtdtcreator&keep_tld=true",
    desc: "Growing a business isn't about collecting business cards—it's about building meaningful relationships that lead to real opportunities.\n\nBusinessGPS Weekly\nNavigate Growth. Build Relationships. Create Opportunity.\n\nGrowing a business isn't about collecting business cards—it's about building meaningful relationships that lead to real opportunities.\n\nBusinessGPS is a weekly gathering of business owners, entrepreneurs, professionals, and community leaders who are committed to growing together through authentic connections, practical insights, and intentional collaboration.\n\nEach one-hour session is designed to help you:\n\nBuild meaningful business relationships\nShare ideas and solve real challenges\nDiscover new opportunities through trusted connections\nGrow as a leader while helping others succeed\nWhether you're launching a new venture, scaling an established business, or looking to expand your network with purpose, BusinessGPS provides a welcoming environment where relationships come first and growth follows.\n\n\n\nCome for the conversations. Leave with new relationships, fresh ideas, and opportunities to move your business forward.",
  },
  {
    slug: "changemakers27-night-1-online-2027-02-09",
    title: "Changemakers27: Night 1 (Online)",
    start: "2027-02-09T19:00",
    end: "2027-02-09T20:30",
    img: "/events/changemakers27.jpg",
    priceLabel: "Free",
    link: "https://www.eventbrite.com/e/changemakers27-night-1-online-tickets-1994938637166?aff=erelpanelorg",
    desc: "Overview\nSome of the most inspiring people you'll ever meet aren't celebrities; Changemakers27 celebrates those Everyday Heroes!\n\nChangemakers27\n\nPresented by NexCore\nEvent Description\nSome of the most inspiring people you'll ever meet aren't celebrities—they're your neighbors.\n\nEvery day, individuals across our communities are quietly changing lives, building stronger neighborhoods, launching impactful organizations, supporting those in need, mentoring future leaders, and creating opportunities where none existed before.\n\nChangemakers27 is a four-part experience dedicated to celebrating those individuals.\n\nOver three consecutive Tuesday evenings, you'll meet remarkable people whose stories remind us that real change begins with ordinary people willing to do extraordinary things. Each online session features inspiring conversations with community leaders, nonprofit founders, entrepreneurs, educators, advocates, volunteers, and innovators who are making a lasting impact.\n\nThen, join us for the culminating live celebration as we gather in person to recognize these incredible individuals, continue the conversations, and connect with others who believe that positive change starts with people.\n\nWhether you're looking for inspiration, new connections, fresh ideas, or simply want to celebrate the good happening in our communities, Changemakers27 is an experience you won't want to miss.\n\nEvent Schedule\n💻 Online Series\nTuesday, February 9, 2027\n\nTuesday, February 16, 2027\n\nTuesday, February 23, 2027\n\n\n\nEach Event is from 7pm - 8:30pm Online\n\nEach evening features inspiring stories, meaningful conversations, and extraordinary people making an extraordinary difference.\n\n🎉 Live Celebration (Meet the Changemakers)\nThursday, March 4, 2027\n\n6:00pm to 8pm\n\nNexCore\n11820 Tesson Ferry Road\nSt. Louis, MO 63128\n\nMeet the featured Changemakers, network with fellow community leaders, and celebrate the people shaping a better tomorrow.\n\nWho Should Attend?\nCommunity leaders\nNonprofit professionals\nBusiness owners\nVolunteers\nEducators\nEntrepreneurs\nStudents\nAnyone who believes one person can make a difference\nWhy Attend?\nHear powerful stories of impact from real people.\nDiscover organizations and initiatives changing our communities.\nConnect with leaders and innovators making a difference.\nCelebrate hope, collaboration, and positive change.\nLeave inspired to make your own impact.\nBecause every community has heroes. It's time we celebrated them.",
  },
  {
    slug: "changemakers27-night-2-online-2027-02-16",
    title: "Changemakers27: Night 2 (Online)",
    start: "2027-02-16T19:00",
    end: "2027-02-16T20:30",
    img: "/events/changemakers27.jpg",
    priceLabel: "Free",
    link: "https://www.eventbrite.com/e/changemakers27-night-3-online-tickets-1994940146681?aff=oddtdtcreator&keep_tld=true",
    desc: "Overview\nSome of the most inspiring people you'll ever meet aren't celebrities; Changemakers27 celebrates those Everyday Heroes!\n\nChangemakers27\n\nPresented by NexCore\nEvent Description\nSome of the most inspiring people you'll ever meet aren't celebrities—they're your neighbors.\n\nEvery day, individuals across our communities are quietly changing lives, building stronger neighborhoods, launching impactful organizations, supporting those in need, mentoring future leaders, and creating opportunities where none existed before.\n\nChangemakers27 is a four-part experience dedicated to celebrating those individuals.\n\nOver three consecutive Tuesday evenings, you'll meet remarkable people whose stories remind us that real change begins with ordinary people willing to do extraordinary things. Each online session features inspiring conversations with community leaders, nonprofit founders, entrepreneurs, educators, advocates, volunteers, and innovators who are making a lasting impact.\n\nThen, join us for the culminating live celebration as we gather in person to recognize these incredible individuals, continue the conversations, and connect with others who believe that positive change starts with people.\n\nWhether you're looking for inspiration, new connections, fresh ideas, or simply want to celebrate the good happening in our communities, Changemakers27 is an experience you won't want to miss.\n\nEvent Schedule\n💻 Online Series\nTuesday, February 9, 2027\n\nTuesday, February 16, 2027\n\nTuesday, February 23, 2027\n\n\n\nEach Event is from 7pm - 8:30pm Online\n\nEach evening features inspiring stories, meaningful conversations, and extraordinary people making an extraordinary difference.\n\n🎉 Live Celebration (Meet the Changemakers)\nThursday, March 4, 2027\n\n6:00pm to 8pm\n\nNexCore\n11820 Tesson Ferry Road\nSt. Louis, MO 63128\n\nMeet the featured Changemakers, network with fellow community leaders, and celebrate the people shaping a better tomorrow.\n\nWho Should Attend?\nCommunity leaders\nNonprofit professionals\nBusiness owners\nVolunteers\nEducators\nEntrepreneurs\nStudents\nAnyone who believes one person can make a difference\nWhy Attend?\nHear powerful stories of impact from real people.\nDiscover organizations and initiatives changing our communities.\nConnect with leaders and innovators making a difference.\nCelebrate hope, collaboration, and positive change.\nLeave inspired to make your own impact.\nBecause every community has heroes. It's time we celebrated them.",
  },
  {
    slug: "changemakers27-night-3-online-2027-02-23",
    title: "Changemakers27: Night 3 (Online)",
    start: "2027-02-23T19:00",
    end: "2027-02-23T20:30",
    img: "/events/changemakers27.jpg",
    priceLabel: "Free",
    link: "https://www.eventbrite.com/e/changemakers27-night-3-online-tickets-1994940146681?aff=oddtdtcreator&keep_tld=true",
    desc: "Overview\nSome of the most inspiring people you'll ever meet aren't celebrities; Changemakers27 celebrates those Everyday Heroes!\n\nChangemakers27\n\nPresented by NexCore\nEvent Description\nSome of the most inspiring people you'll ever meet aren't celebrities—they're your neighbors.\n\nEvery day, individuals across our communities are quietly changing lives, building stronger neighborhoods, launching impactful organizations, supporting those in need, mentoring future leaders, and creating opportunities where none existed before.\n\nChangemakers27 is a four-part experience dedicated to celebrating those individuals.\n\nOver three consecutive Tuesday evenings, you'll meet remarkable people whose stories remind us that real change begins with ordinary people willing to do extraordinary things. Each online session features inspiring conversations with community leaders, nonprofit founders, entrepreneurs, educators, advocates, volunteers, and innovators who are making a lasting impact.\n\nThen, join us for the culminating live celebration as we gather in person to recognize these incredible individuals, continue the conversations, and connect with others who believe that positive change starts with people.\n\nWhether you're looking for inspiration, new connections, fresh ideas, or simply want to celebrate the good happening in our communities, Changemakers27 is an experience you won't want to miss.\n\nEvent Schedule\n💻 Online Series\nTuesday, February 9, 2027\n\nTuesday, February 16, 2027\n\nTuesday, February 23, 2027\n\n\n\nEach Event is from 7pm - 8:30pm Online\n\nEach evening features inspiring stories, meaningful conversations, and extraordinary people making an extraordinary difference.\n\n🎉 Live Celebration (Meet the Changemakers)\nThursday, March 4, 2027\n\n6:00pm to 8pm\n\nNexCore\n11820 Tesson Ferry Road\nSt. Louis, MO 63128\n\nMeet the featured Changemakers, network with fellow community leaders, and celebrate the people shaping a better tomorrow.\n\nWho Should Attend?\nCommunity leaders\nNonprofit professionals\nBusiness owners\nVolunteers\nEducators\nEntrepreneurs\nStudents\nAnyone who believes one person can make a difference\nWhy Attend?\nHear powerful stories of impact from real people.\nDiscover organizations and initiatives changing our communities.\nConnect with leaders and innovators making a difference.\nCelebrate hope, collaboration, and positive change.\nLeave inspired to make your own impact.\nBecause every community has heroes. It's time we celebrated them.",
  },
  {
    slug: "changemakers27-live-celebration-meet-the-changemakers-2027-03-04",
    title: "Changemakers27: Live Celebration (Meet the Changemakers)",
    start: "2027-03-04T18:00",
    end: "2027-03-04T20:00",
    doors: "5:30 PM",
    img: "/events/changemakers27.jpg",
    priceLabel: "Free",
    link: "https://www.eventbrite.com/e/changemakers27-live-nexcore-tickets-1994940498734?aff=oddtdtcreator&keep_tld=true",
    desc: "Overview\nSome of the most inspiring people you'll ever meet aren't celebrities; Changemakers27 celebrates those Everyday Heroes!\n\nChangemakers27\n\nPresented by NexCore\nEvent Description\nSome of the most inspiring people you'll ever meet aren't celebrities—they're your neighbors.\n\nEvery day, individuals across our communities are quietly changing lives, building stronger neighborhoods, launching impactful organizations, supporting those in need, mentoring future leaders, and creating opportunities where none existed before.\n\nChangemakers27 is a four-part experience dedicated to celebrating those individuals.\n\nOver three consecutive Tuesday evenings, you'll meet remarkable people whose stories remind us that real change begins with ordinary people willing to do extraordinary things. Each online session features inspiring conversations with community leaders, nonprofit founders, entrepreneurs, educators, advocates, volunteers, and innovators who are making a lasting impact.\n\nThen, join us for the culminating live celebration as we gather in person to recognize these incredible individuals, continue the conversations, and connect with others who believe that positive change starts with people.\n\nWhether you're looking for inspiration, new connections, fresh ideas, or simply want to celebrate the good happening in our communities, Changemakers27 is an experience you won't want to miss.\n\nEvent Schedule\n💻 Online Series\nTuesday, February 9, 2027\n\nTuesday, February 16, 2027\n\nTuesday, February 23, 2027\n\n\n\nEach Event is from 7pm - 8:30pm Online\n\nEach evening features inspiring stories, meaningful conversations, and extraordinary people making an extraordinary difference.\n\n🎉 Live Celebration (Meet the Changemakers)\nThursday, March 4, 2027\n\n6:00pm to 8pm\n\nNexCore\n11820 Tesson Ferry Road\nSt. Louis, MO 63128\n\nMeet the featured Changemakers, network with fellow community leaders, and celebrate the people shaping a better tomorrow.\n\nWho Should Attend?\nCommunity leaders\nNonprofit professionals\nBusiness owners\nVolunteers\nEducators\nEntrepreneurs\nStudents\nAnyone who believes one person can make a difference\nWhy Attend?\nHear powerful stories of impact from real people.\nDiscover organizations and initiatives changing our communities.\nConnect with leaders and innovators making a difference.\nCelebrate hope, collaboration, and positive change.\nLeave inspired to make your own impact.\nBecause every community has heroes. It's time we celebrated them.",
  },
  {
    slug: "the-south-county-chamber-launchpad-take-your-seat-at-the-tab-2026-09-10",
    title: "The South County Chamber Launchpad: Take Your Seat at the Table",
    start: "2026-09-10T18:00",
    end: "2026-09-10T19:30",
    doors: "5:30 PM",
    img: "/events/soco-chamber-launchpad.jpg",
    priceLabel: "Free",
    link: "https://www.eventbrite.com/e/the-south-county-chamber-launchpad-take-your-seat-at-the-table-tickets-1995842640063?aff=oddtdtcreator&keep_tld=true",
    desc: "Overview\nSouth County is full of people who care. It's time to bring them together. Join us for the launch of the SOCO Chamber and find your place.\n\nSouth County is full of people who care. Now it's time to bring them together. Join us for the launch of the South County Chamber and find your place in shaping what's next. Take your seat at the table.\n\n\n\nSouth County Chamber Launchpad\nTake Your Seat at the Table\nSouth County deserves more than another Chamber of Commerce.\n\nIt deserves a movement.\n\nA movement of business owners, nonprofits, educators, civic leaders, entrepreneurs, and residents who believe our community deserves better—and are willing to help build it.\n\nThat's why we created the South County Chamber.\n\nThis evening isn't about sitting through another networking event or listening to another presentation.\n\nIt's about seeing what's possible when people come together around a shared purpose.\n\nYou'll hear the vision behind the South County Chamber, explore the initiatives already taking shape, meet the people leading them, and discover the many ways you can make an impact—whether that's volunteering, serving on a committee, becoming an ambassador, helping lead an initiative, partnering with other organizations, or supporting the movement through membership.\n\nThis isn't about asking, \"What can the Chamber do for me?\"\n\nIt's about asking,\n\n\"What can we accomplish together?\"\n\nIf you've been looking for a way to make a meaningful difference in South County...\n\nIf you've wanted to meet people who believe in collaboration over competition...\n\nIf you believe stronger businesses create stronger communities...\n\nThen your seat is waiting.\n\nCome hear the vision.\n\nMeet the people.\n\nFind your place.\n\nJoin the movement.\n\nBecause the future of South County won't be built by one organization.\n\nIt will be built by all of us.\n\nTake your seat at the table.",
  },
  {
    slug: "nexcore-sessions-episode-1-your-videos-dont-have-to-suck-2026-09-08",
    title: "NexCore Sessions Episode 1: Your Videos Don't Have To Suck!",
    start: "2026-09-08T18:00",
    end: "2026-09-08T20:00",
    doors: "5:30 PM",
    img: "/events/nexcore-sessions-episode-1.jpg",
    priceLabel: "Free",
    link: "https://www.eventbrite.com/e/1998492265163?aff=oddtdtcreator",
    desc: "YOUR VIDEOS DON’T HAVE TO SUCK.\n\nLet’s make them better.\n\nShort-form video is everywhere.\n\nInstagram. TikTok. LinkedIn. YouTube. Facebook.\n\nAnd whether you're building a business, creating content, promoting your work, or trying to grow a brand, video has become one of the most effective ways to get attention and engage the people you want to reach.\n\nBut there’s a problem:\n\nMost people know they should be creating video. They just don’t know where to start.\n\nThat’s where this session comes in.\n\nLEARN HOW TO CREATE BETTER CONTENT.\n\nJoin Karly Lamm, Founder & CEO of Zentry Pass, technology entrepreneur, and current Arch Grants finalist, for a practical, hands-on session focused on the fundamentals of creating short-form video.\n\nKarly will walk through the basics of creating content for today’s major social platforms and show you how to use readily available technology to create videos that look better, communicate your ideas, and increase engagement.\n\nCapCut will be part of the conversation—but this isn't about learning one particular piece of software.\n\nIt's about understanding the tools available to you and knowing how to use them.\n\nBecause the technology changes.\n\nThe need to get noticed doesn't.\n\nTHIS IS FOR YOU IF...\n\nYou’ve ever thought:\n\n“I should be making more videos.”\n\n“I have no idea how people make these.”\n\n“I know I need better content, but I don't have time to figure it all out.”\n\nOr maybe you've already started creating videos and simply want to get better.\n\nWhether you're an entrepreneur, creator, artist, professional, marketer, small business owner, or someone building a brand, this session is designed to give you practical skills you can put to work immediately.\n\nMEET KARLY LAMM\n\nKarly Lamm is the Founder & CEO of Zentry Pass, a technology entrepreneur, and a current Arch Grants finalist.\n\nShe understands technology, but more importantly, she knows how to put it to work.\n\nCome learn from someone who is actually using these tools—not someone standing in front of a room telling you what they think you should be doing.\n\nBRING YOUR GEAR.\n\nBring your laptop.\nBring your camera.\nBring your phone.\nBring your questions.\n\nCome ready to learn, experiment, and create.\n\nYou don't need to be an expert.\n\nThat's why we're doing this.\n\nNEXCORE SESSIONS\n\nThis event kicks off a new series of practical sessions at NexCore designed to help people understand the tools, ideas, and opportunities shaping how we work, create, connect, and build brands.\n\nWe're bringing knowledgeable people into the building and giving you an opportunity to learn from them, ask questions, meet other people, and put new ideas to work.\n\nNo fluff. No unnecessary jargon. Just useful information and real conversations.\n\nAnd throughout the remainder of 2026, NexCore Sessions are complimentary.\n\nWe're new. We're building something.\n\nAnd we want you in the building.\n\nEVENT DETAILS\n\nTuesday, September 8, 2026\n\n5:30 PM — Doors Open\n\nCome early for networking, conversation, and connections.\n\n6:00 PM — Session Begins\n\nLOCATION\n\nNexCore\n11820 Tesson Ferry Road\nSt. Louis, MO 63128\n\nAt the corner of Baptist Church Road & Tesson Ferry Road.",
  },
  {
    slug: "one-decision-away-2026-10-22",
    title: "One Decision Away - a Free AI Working Session",
    start: "2026-10-22T18:00",
    end: "2026-10-22T20:00",
    doors: "5:30 PM",
    img: "/events/one-decision-away.jpg",
    priceLabel: "Free",
    link: "https://www.eventbrite.com/e/2001272624292?aff=oddtdtcreator",
    summary: "Bring one business decision you keep circling. Leave with a sharper way to work it forward.",
    desc: "Overview\nBring one business decision you keep circling. Leave with a sharper way to work it forward.\n\nAI didn't change business fundamentals. It just removed the excuses.\n\nResearch is cheap now. Drafting is cheap. First versions of almost anything are cheap. What's still scarce is the work of actually deciding — and that's the part nobody can hand off.\n\nThis free session is the opening of One Decision Away, a NexCore series for founders and solopreneurs who want to use AI as an orchestrator — a tool that works the problem with you — instead of a magic trick they watch from the sidelines.\n\nIn two hours you'll get:\nThe five fundamentals that separate people getting real leverage from AI from people getting confident nonsense\nA working method you can apply to a live decision the same night\nA room full of founders working the same way — not an audience watching a demo\n\nYou stay in the driver's seat the whole time. The AI never decides for you. It makes your thinking sharper, faster, and harder to fool.\n\nLed by Simon Yost at the NexCore building. Simon is VP Product & Engineering at Swipe ARAS, the first member of NexCore South County, and one of the members of the original NexCore in Fox Park.\n\nBring one decision you keep circling. That's the only prep.\n\nEVENT DETAILS\n\nThursday, October 22, 2026\n\n5:30 PM — Doors Open\n\n6:00 PM – 8:00 PM — Session\n\nAges 16+. Free parking. Admission is free.\n\nLOCATION\n\nNexCore\n11820 Tesson Ferry Road\nSt. Louis, MO 63128\n\nAt the corner of Baptist Church Road & Tesson Ferry Road.",
  },
];
