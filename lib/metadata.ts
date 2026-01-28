import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://glimitstudio.com';
const siteName = 'G-Limit Studio';
const siteDescription = 'Professional photography services for weddings, portraits, events, and products. Capturing your special moments with elegance and style.';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Professional Photography`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'photography',
    'professional photographer',
    'wedding photography',
    'portrait photography',
    'event photography',
    'product photography',
    'photo studio',
    'photography services',
    'commercial photography',
    'fashion photography',
    'family portraits',
    'corporate photography',
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: `${siteName} | Professional Photography`,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${siteName} - Professional Photography Services`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} | Professional Photography`,
    description: siteDescription,
    images: [`${siteUrl}/og-image.jpg`],
    creator: '@glimitstudio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png' },
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  category: 'photography',
};

// JSON-LD Structured Data for Organization
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${siteUrl}/#organization`,
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/og-image.jpg`,
  description: siteDescription,
  telephone: '+1-234-567-8900', // Update with real phone
  email: 'info@glimitstudio.com', // Update with real email
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Photography Lane',
    addressLocality: 'Your City',
    addressRegion: 'State',
    postalCode: '12345',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '40.7128',
    longitude: '-74.0060',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '10:00',
      closes: '16:00',
    },
  ],
  sameAs: [
    'https://www.facebook.com/glimitstudio',
    'https://www.instagram.com/glimitstudio',
    'https://twitter.com/glimitstudio',
    'https://www.linkedin.com/company/glimitstudio',
  ],
  priceRange: '$$',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '127',
  },
};

// JSON-LD for Website
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: siteName,
  description: siteDescription,
  publisher: {
    '@id': `${siteUrl}/#organization`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

// JSON-LD for Breadcrumb List (use on specific pages)
export const getBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${siteUrl}${item.url}`,
  })),
});

// Service Schema
export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Photography',
  provider: {
    '@id': `${siteUrl}/#organization`,
  },
  areaServed: {
    '@type': 'Country',
    name: 'United States',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Photography Services',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Wedding Photography',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Wedding Photography Package',
            },
          },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: 'Portrait Photography',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Portrait Photography Session',
            },
          },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: 'Event Photography',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Event Photography Coverage',
            },
          },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: 'Product Photography',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Product Photography',
            },
          },
        ],
      },
    ],
  },
};