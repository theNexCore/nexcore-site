/**
 * Timeline for /about/history.
 * Copy transcribed verbatim from /history.html.
 */

export interface Milestone {
  n: string;
  date: string;
  title: string;
  lead: string;
  body: string;
  img?: string;
  /** Forward-looking callout attached to some milestones. */
  followUp?: { title: string; body: string; cta?: string; href?: string };
  stat?: string;
}

export const milestones: Milestone[] = [
  {
    n: '01',
    date: 'August 21, 2017',
    title: 'NexCore Opens Its Doors',
    lead: 'A full city block in Fox Park — vacant, neglected, a mile south of downtown — became the starting point for it all.',
    body: 'The search led here and the doors opened. The first member walked in. The first business began. Everything that follows started on this day.',
    img: '/img/august-21-2017-nexcore-opens.png',
  },
  {
    n: '02',
    date: 'October 5, 2017',
    title: 'BusinessGPS Launches',
    lead: 'A system to help people find their way — not just a desk, but a direction.',
    body: 'BusinessGPS gave entrepreneurs the map they’d been missing: how to start, how to build, how to keep going. It became the engine underneath everything NexCore did for its members.',
    img: '/img/bgps.png',
    followUp: {
      title: 'Returning September 2026',
      body: 'BusinessGPS comes back to guide the next wave of businesses.',
      cta: 'See the calendar →',
      href: '/events',
    },
  },
  {
    n: '03',
    date: 'October 12, 2017',
    title: 'Powering the Community',
    lead: 'NexCore became the hub of Fox Park — and only grew from there.',
    body: 'Nonprofits. Schools. Neighborhood associations. Community leaders. NexCore didn’t just host them — it powered them, giving the whole neighborhood a place to build what came next.',
    img: '/img/powering-communities.png',
    followUp: {
      title: 'We’re doing it again',
      body: 'The same work begins anew — for the South County neighborhood.',
    },
  },
  {
    n: '04',
    date: 'January 1, 2019',
    title: 'ReVitalize St. Louis',
    lead: 'NexCore joined the ReVitalize board — in a big way.',
    body: 'The mission widened beyond the block. Revitalizing St. Louis meant investing in the people and places the city had overlooked — the same belief that started Fox Park, scaled to a whole region.',
    img: '/img/rvstl.png',
  },
  {
    n: '05',
    date: 'November 18, 2019',
    title: 'Money Talk Mondays',
    lead: 'Dr. Lance McCarthy launched it — and a community learned to build wealth together.',
    body: 'Every Monday, real conversations about money, ownership, and independence. It was proof of the NexCore idea: give someone a room and a reason, and they’ll change the people around them.',
    img: '/img/dr-lance-mccarth-global-1000.png',
  },
  {
    n: '06',
    date: 'December 17, 2019',
    title: 'The 6th Ward Santa',
    lead: 'Cedric Redmond served the children of Fox Park — with NexCore behind him.',
    body: 'Not a program on a brochure. A neighbor who wanted to give the kids of his ward a Christmas, and a place that made room for him to do it. This is what powering the community actually looked like.',
    img: '/img/6th-ward-santa.png',
    followUp: {
      title: 'The tradition continues',
      body: 'In Cedric’s tradition, the work goes on — launched as the South County Chamber’s SOCO Cares.',
      cta: 'Visit the SOCO Chamber →',
      href: 'https://thesocochamber.org',
    },
  },
  {
    n: '07',
    date: 'April 10–11, 2020',
    title: 'Streamathon',
    lead: 'When COVID closed doors everywhere, Fox Park did something about it.',
    body: 'Thirty-two hours straight. A livestream to keep local businesses alive — raising real aid, reaching millions, drawing national attention. In the hardest year, the community proved what it was made of.',
    img: '/img/streamathon.png',
    stat: '$100,000 in aid awarded to local business',
  },
  {
    n: '08',
    date: 'July 9–12, 2020',
    title: 'Small Business Independence Day',
    lead: 'Three days celebrating the businesses that refused to quit.',
    body: 'A weekend built around perseverance — honoring the owners who held on through the hardest stretch anyone could remember, and the community that held on with them.',
    followUp: {
      title: 'Returning July 2027',
      body: 'The celebration of small-business perseverance comes back.',
      cta: 'See the calendar →',
      href: '/events',
    },
  },
  {
    n: '09',
    date: 'September 27, 2020',
    title: 'Changing of the Guard',
    lead: 'NexCore closed its doors — and on the way out, opened one for someone else.',
    body: 'Fox Park went quiet. But before the lights went off, NexCore handed the work forward — opening the door for the Whitfield Foundation to carry the mission on. Not an end. A hand-off.',
    img: '/img/changing-of-the-guard.png',
  },
  {
    n: '10',
    date: 'June 2, 2021',
    title: 'ReVitalize Becomes a Social Enterprise',
    lead: 'The mission took a durable new form — built to sustain the work, not just fund it.',
    body: 'ReVitalize grew into a social enterprise, carrying the belief that started Fox Park into a lasting structure. And its story isn’t over.',
    followUp: {
      title: 'Returning January 2027, ReImagined',
      body: 'ReVitalize comes back — rebuilt for what St. Louis needs next.',
      cta: 'See the calendar →',
      href: '/events',
    },
  },
  {
    n: '11',
    date: 'November 16–18, 2021',
    title: 'ChangeMakers21',
    lead: 'NexCore and ReVitalize spent three days celebrating heroes from around the world.',
    body: 'People who’d changed their corners of the world, gathered in one place. It was the NexCore belief on a global stage: human potential, given room, changes everything.',
    img: '/img/changemakers.png',
    followUp: {
      title: 'ChangeMakers27 is scheduled',
      body: 'The celebration of global changemakers returns.',
      cta: 'See the calendar →',
      href: '/events',
    },
  },
  {
    n: '12',
    date: 'May 1, 2023',
    title: 'What’s Next Takes Shape',
    lead: 'NexCore signed a new lease in South County. The comeback began on paper.',
    body: 'Six years after Fox Park, the same idea found a new block: Plaza 21. What had ended wasn’t over — it was getting ready to do it all again.',
    img: '/img/nexcore-soco-is-imagined.png',
  },
  {
    n: '13',
    date: 'September 18, 2024',
    title: 'ReVitalize Completes Its Work',
    lead: 'The 501(c)(3) was formally dissolved — its mission carried forward in new hands.',
    body: 'Every chapter closes so the next can open. Thank you for all the memories.',
  },
  {
    n: '14',
    date: '2026',
    title: 'The South County Chamber Is Formed',
    lead: 'A new institution, built to power what’s next for an entire region.',
    body: 'The South County Chamber brought businesses together under one banner — the same instinct that built Fox Park, now organized to lift a whole community. Its own ribbon cutting comes October 17.',
    img: '/img/thesouthcountychamberlaunchpad.png',
  },
  {
    n: '15',
    date: 'July 23, 2026',
    title: 'NexCore Opens Again',
    lead: 'South County. Ribbon cut. The doors open once more.',
    body: 'Taylor Miller, our founding Chief Impact Officer, led the ceremony. Six years after Fox Park went quiet, NexCore stood open again — same belief, new block. Not an ending. Another beginning.',
    img: '/img/nexcore-grand-opening-photo-courtesy-of-debbie-langanke-4.jpg',
  },
];
