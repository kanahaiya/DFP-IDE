import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to Dart Converter Free Online - Generate Flutter Model Classes',
  description: 'Convert JSON to Dart classes instantly. Generate null-safe Flutter models with fromJson/toJson, Freezed, and JSON Serializable support. 100% client-side, no signup required.',
  keywords: [
    'json to dart',
    'json to dart class',
    'json to dart converter',
    'flutter json parser',
    'dart model generator',
    'convert json to dart',
    'flutter model from json',
    'json serializable dart',
    'freezed dart',
    'dart fromjson'
  ],
  openGraph: {
    title: 'JSON to Dart Converter Free Online - Generate Flutter Models',
    description: 'Convert JSON to Dart classes instantly. Generate Flutter models with null safety. 100% client-side.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-to-dart',
    siteName: 'DataFormatterPro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to Dart Converter Free Online - Generate Flutter Models',
    description: 'Convert JSON to Dart classes instantly. Generate Flutter models with null safety. 100% client-side.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-to-dart',
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

export default function JSONToDartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
