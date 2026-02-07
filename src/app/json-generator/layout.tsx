import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Generator Online Free - Generate Fake Test Data Instantly',
  description: 'Generate realistic fake JSON data for testing, prototyping, and development. Free online JSON generator with 50+ data types, custom schemas, bulk generation up to 10,000 records. 100% client-side, no signup required.',
  keywords: [
    'json generator',
    'fake json generator',
    'json data generator',
    'mock json generator',
    'json test data generator',
    'generate fake json data',
    'random json generator',
    'json faker online',
    'sample json generator',
    'bulk json generator',
  ],
  openGraph: {
    title: 'JSON Generator - Free Online Fake Data Tool',
    description: 'Generate realistic fake JSON data instantly with 50+ data types, custom schemas, and bulk generation. 100% client-side, secure, and free forever.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-generator',
    siteName: 'Data Formatter Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Generator - Free Online Fake Data Tool',
    description: 'Generate realistic fake JSON data instantly with 50+ data types, custom schemas, and bulk generation. 100% client-side, secure, and free forever.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-generator',
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
};

// JSON-LD Schema for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JSON Generator',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description: 'Generate realistic fake JSON data for testing, prototyping, and development. Free online JSON generator with 50+ data types and custom schemas.',
  url: 'https://dataformatterpro.com/json-generator',
  featureList: [
    '50+ realistic data types',
    'Visual schema builder',
    'Bulk generation up to 10,000 records',
    'Export to JSON, JSONL, CSV, TypeScript',
    'Seed-based reproducible generation',
    'Multiple locale support',
    '100% client-side processing',
    'No signup required',
  ],
  screenshot: 'https://dataformatterpro.com/screenshots/json-generator.png',
  softwareVersion: '1.0.0',
  author: {
    '@type': 'Organization',
    name: 'Data Formatter Pro',
    url: 'https://dataformatterpro.com',
  },
};

export default function JsonGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
