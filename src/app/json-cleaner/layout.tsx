import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Cleaner Online - Clean, Transform & Sanitize JSON',
  description:
    'Clean and transform JSON data online. Remove nulls, empty values, duplicates. Convert key names, change types, flatten objects. Free JSON cleaner with presets.',
  keywords: [
    'json cleaner online',
    'clean json data',
    'remove null from json',
    'json transformer',
    'json key converter',
    'sanitize json',
    'json data cleanup',
    'remove empty json values',
    'convert json keys',
    'flatten json online',
  ],
  openGraph: {
    title: 'JSON Cleaner Online - Clean & Transform JSON',
    description:
      'Clean JSON by removing empty values, transforming keys, and converting types. Free online tool.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-cleaner',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Cleaner Online',
    description:
      'Clean and transform JSON data. Remove nulls, convert keys, flatten objects.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-cleaner',
  },
};

export default function JsonCleanerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
