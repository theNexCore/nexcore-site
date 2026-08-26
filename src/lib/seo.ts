import type { Metadata } from 'next';
import { SITE_URL, abs, site, formattedAddress } from '@/data/site';

/**
 * Build page metadata. Canonical and OG URLs are always absolute,
 * per project convention.
 */
export function buildMetadata({
  title,
  description,
  path,
  image = '/og/default.png',
  type = 'website',
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}): Metadata {
  const url = abs(path);
  const img = image.startsWith('http') ? image : abs(image);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type,
      locale: 'en_US',
      images: [{ url: img, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [img],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

/** Organization + LocalBusiness graph for the root layout. */
export function organizationJsonLd() {
  const address = {
    '@type': 'PostalAddress',
    streetAddress: `${site.address.street}, ${site.address.suite}`,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: site.name,
        legalName: site.legalName,
        url: abs('/'),
        logo: {
          '@type': 'ImageObject',
          url: abs('/logo/nexcore-logo-primary.svg'),
        },
        description: site.description,
        email: site.email,
        telephone: site.phones[0].tel,
        address,
        sameAs: site.social.map((s) => s.url),
        founder: { '@type': 'Person', name: 'Jim Shelvy' },
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/#localbusiness`,
        name: site.name,
        url: abs('/'),
        image: abs('/logo/nexcore-logo-primary.svg'),
        description: site.description,
        email: site.email,
        telephone: site.phones[0].tel,
        address,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: site.geo.lat,
          longitude: site.geo.lng,
        },
        hasMap: site.directionsUrl,
        priceRange: '$$',
        openingHoursSpecification: site.openingHours.map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.days,
          opens: h.opens,
          closes: h.closes,
        })),
        parentOrganization: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: abs('/'),
        name: site.name,
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en-US',
      },
    ],
  };
}

export { formattedAddress };
