import type { MetadataRoute } from 'next';
import { abs } from '@/data/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Server actions and Next internals; nothing here is a real page.
        disallow: ['/api/'],
      },
      // Carried over from the Weebly robots.txt.
      { userAgent: 'NerdyBot', disallow: '/' },
    ],
    sitemap: abs('/sitemap.xml'),
    host: abs('/'),
  };
}
