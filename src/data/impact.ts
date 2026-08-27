/**
 * Impact metrics and press coverage.
 * Copy transcribed verbatim from /bragging-rights.html and /in-the-news.html.
 */

export interface Stat {
  value: string;
  label: string;
}

export interface StatGroup {
  title: string;
  stats: Stat[];
}

export const statGroups: StatGroup[] = [
  {
    title: 'The Businesses',
    stats: [
      {
        value: '550+',
        label: 'new businesses, partnerships, collaborations, projects, and community initiatives',
      },
      { value: '275', label: 'of those, brand-new businesses launched' },
      { value: '1,000+', label: 'businesses and nonprofits housed over three years' },
      { value: '500+', label: 'businesses managed at a time, every aspect handled' },
      { value: '200+', label: 'businesses served as registered agent' },
      { value: '500+', label: 'websites built for our partners' },
    ],
  },
  {
    title: 'The Work Behind Them',
    stats: [
      { value: '67,000+', label: 'phone calls answered for our partners every year' },
      { value: '89,696', label: 'hours on the phone on their behalf' },
      { value: '2 Million+', label: 'tasks completed for our business partners' },
      { value: '5 Million+', label: 'documents stored and managed' },
      { value: '1 Million+', label: 'messages received, answered and shared' },
      { value: '1,000+', label: 'social media accounts and 300 email accounts managed' },
    ],
  },
  {
    title: 'The Community',
    stats: [
      { value: '1,000', label: 'events hosted in four years' },
      { value: '7,000+', label: 'videos produced to help them tell their story' },
      { value: '25,000+', label: 'hours of film documenting the journey' },
      { value: '30 Million+', label: 'views across that film' },
      { value: '400+', label: 'people interviewed' },
      {
        value: '15',
        label: 'kid-owned businesses, 6 fitness centers, 3 restaurants moved out on their own',
      },
    ],
  },
];

export interface PressItem {
  outlet: string;
  year?: string;
  title: string;
  url: string;
}

export const press: PressItem[] = [
  {
    outlet: 'St. Louis Business Journal',
    year: '2026',
    title: 'South County Chamber launches under Jim Shelvy',
    url: 'https://www.bizjournals.com/stlouis/news/2026/07/17/south-county-chamber-jim-shelvy-stlouis.html',
  },
  {
    outlet: 'St. Louis Business Journal',
    year: '2026',
    title: 'NexCore coworking opens new chapter in South St. Louis County',
    url: 'https://www.bizjournals.com/stlouis/news/2026/07/17/nexcore-coworking-south-st-louis-county-jim-shelvy.html',
  },
  {
    outlet: 'PRLog',
    year: '2026',
    title: 'NexCore Returns: Proven Model for Building Businesses, Partnerships & Community',
    url: 'https://www.prlog.org/13158647-nexcore-returns-proven-model-for-building-businesses-partnerships-community-opens-new-chapter.html',
  },
  {
    outlet: 'STLtoday',
    year: '2017',
    title: 'New co-working space coming to Fox Park',
    url: 'https://www.stltoday.com/business/local/new-co-working-space-coming-to-fox-park/article_454b2428-5583-5211-8f74-d6069f4d7da0.html',
  },
  {
    outlet: 'St. Louis Magazine',
    year: '2017',
    title: 'In Fox Park, co-working space NexCore takes a block-by-block approach',
    url: 'https://www.stlmag.com/news/in-fox-park-co-working-space-nexcore-takes-a-block-by-block-/',
  },
  {
    outlet: 'STLtoday',
    year: '2017',
    title: 'St. Louis welcomes NexCore, a full-service co-working community',
    url: 'https://www.stltoday.com/pr/business/st-louis-welcomes-nexcore-a-full-service-co-working-community-with-services-designed-to-enhance/article_f80481ca-5a91-11e7-930d-308d99b27af4.html',
  },
  {
    outlet: 'KSDK 5 On Your Side',
    year: '2020',
    title: 'Virtual stream to raise money for St. Louis small businesses',
    url: 'https://www.ksdk.com/article/news/local/virtual-stream-raise-money-small-businesses-st-louis/63-a009f1df-9072-445d-a99f-4c831c689547',
  },
  {
    outlet: 'STLtoday',
    year: '2020',
    title: 'StreamathonSTL to award $100,000 in aid to local business',
    url: 'https://www.stltoday.com/pr/business/streamathonstl-to-award-100-000-in-aid-to-local-business/article_903d1600-7849-11ea-b35d-5cb9017b8d9f.html',
  },
  {
    outlet: 'St. Louis Business Journal',
    year: '2020',
    title: 'NexCore coworking closing, relocating',
    url: 'https://www.bizjournals.com/stlouis/news/2020/09/09/nexcore-coworking-closing-relocating.html',
  },
  {
    outlet: 'Explore St. Louis',
    title: 'St. Louis Champions: Civic Pride',
    url: 'https://explorestlouis.com/civic-pride/champions/',
  },
  {
    outlet: 'The Free Library',
    title: "NexCore donates $14,200 to McKinley Classical Leadership Academy's athletics",
    url: 'https://www.thefreelibrary.com/Nexcore+Donates+%2414%2C200+to+McKinley+Classical+Leadership+Academy%27s...-a0513761353',
  },
  {
    outlet: 'BioSTL',
    year: '2020',
    title: 'Anti-Racism in STEM',
    url: 'https://www.biostl.org/news-and-media/home/anti-racism-in-stem',
  },
];
