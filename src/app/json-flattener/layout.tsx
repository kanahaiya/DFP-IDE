import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Flattener Online Free - Flatten Nested JSON to Key-Value Pairs | DataFormatterPro',
  description: 'Free online JSON flattener tool. Convert nested JSON objects to flat key-value pairs with dot, bracket, underscore, or custom notation. 100% client-side processing, no data upload required.',
  keywords: [
    'json flattener',
    'json flatten online',
    'flatten json online',
    'nested json to flat',
    'json to dot notation',
    'json flatten tool',
    'convert nested json',
    'json key value pairs',
    'flatten json object',
    'json path notation',
    'json flatten converter',
    'nested to flat json',
    'json bracket notation',
    'json underscore notation',
    'free json flattener'
  ],
  openGraph: {
    title: 'JSON Flattener Online Free - Flatten Nested JSON to Key-Value Pairs',
    description: 'Convert nested JSON to flat key-value pairs with dot, bracket, or custom notation. Free, instant, 100% client-side.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-flattener',
    siteName: 'DataFormatterPro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Flattener Online Free - Flatten Nested JSON to Key-Value Pairs',
    description: 'Convert nested JSON to flat key-value pairs with dot, bracket, or custom notation. Free, instant, 100% client-side.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-flattener',
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

export default function JSONFlattenerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
