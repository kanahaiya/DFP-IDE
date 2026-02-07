import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Unflattener Online Free - Convert Flat JSON to Nested Structure | DataFormatterPro',
  description: 'Free online JSON unflattener tool. Convert flattened JSON with dot notation back to nested hierarchical structure. Auto-detect arrays, handle conflicts, preserve types. 100% client-side processing.',
  keywords: [
    'json unflattener',
    'json unflattener online',
    'unflatten json online',
    'flat json to nested',
    'dot notation to json',
    'json unflattener tool',
    'convert flat json',
    'json expand nested',
    'unflatten json object',
    'json reconstruct nested',
    'json unflattener converter',
    'flat to nested json',
    'json bracket unflatten',
    'json underscore unflatten',
    'free json unflattener'
  ],
  openGraph: {
    title: 'JSON Unflattener Online Free - Convert Flat JSON to Nested Structure',
    description: 'Convert flattened JSON back to nested structure with auto-detection. Free, instant, 100% client-side.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-unflattener',
    siteName: 'DataFormatterPro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Unflattener Online Free - Convert Flat JSON to Nested Structure',
    description: 'Convert flattened JSON back to nested structure with auto-detection. Free, instant, 100% client-side.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-unflattener',
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

export default function JSONUnflattenerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
