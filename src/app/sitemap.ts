import type { MetadataRoute } from 'next';
import { abs } from '@/data/site';
import { offices, spaces } from '@/data/coworking';
import { getEvents } from '@/lib/events';

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: Array<[string, MetadataRoute.Sitemap[number]['changeFrequency'], number]> = [
    ['/', 'weekly', 1],
    ['/coworking', 'weekly', 0.9],
    ['/events', 'daily', 0.9],
    ['/beyond-coworking', 'monthly', 0.8],
    ['/about', 'monthly', 0.8],
    ['/contact', 'monthly', 0.8],
    ['/systems', 'monthly', 0.7],
    ['/community', 'monthly', 0.7],
    ['/impact', 'monthly', 0.7],
    ['/about/founder-letter', 'monthly', 0.7],
    ['/about/philosophy', 'monthly', 0.6],
    ['/about/history', 'monthly', 0.6],
    ['/about/why-it-exists', 'monthly', 0.6],
    ['/impact/bragging-rights', 'monthly', 0.6],
    ['/impact/in-the-news', 'monthly', 0.6],
    ['/events/gallery', 'monthly', 0.6],
    ['/foundation', 'monthly', 0.4],
    ['/terms', 'yearly', 0.2],
    ['/privacy', 'yearly', 0.2],
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map(([path, changeFrequency, priority]) => ({
    url: abs(path),
    lastModified: now,
    changeFrequency,
    priority,
  }));

  for (const o of offices) {
    entries.push({
      url: abs(`/coworking/offices/${o.id}`),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: o.available ? 0.7 : 0.4,
    });
  }

  for (const s of spaces) {
    entries.push({
      url: abs(`/coworking/spaces/${s.id}`),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // Events come from the sheet; a feed outage must not break the sitemap.
  try {
    const { all } = await getEvents();
    for (const e of all) {
      entries.push({
        url: abs(`/events/${e.slug}`),
        lastModified: now,
        changeFrequency: e.isPast ? 'yearly' : 'weekly',
        priority: e.isPast ? 0.3 : 0.8,
      });
    }
  } catch {
    // Static routes still ship.
  }

  return entries;
}
