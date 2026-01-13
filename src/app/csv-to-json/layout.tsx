import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CSV to JSON Converter Free - Convert Instantly',
  description: 'Convert CSV to JSON online instantly with our free tool. Parse CSV files with smart type detection, transform CSV data to JSON with multiple output formats, 100% client-side processing. No upload required.',
  keywords: [
    'csv to json converter',
    'convert csv to json',
    'csv to json online',
    'csv to json free',
    'parse csv to json',
    'transform csv to json',
    'csv file to json',
    'csv json converter',
    'csv to json array of objects',
    'csv to json tool',
  ],
  openGraph: {
    title: 'CSV to JSON Converter - Free Online Tool',
    description: 'Convert CSV files to JSON format instantly with advanced parsing options. 100% client-side, secure, and free forever.',
    type: 'website',
    url: 'https://dataformatterpro.com/csv-to-json',
    siteName: 'Data Formatter Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CSV to JSON Converter - Free Online Tool',
    description: 'Convert CSV files to JSON format instantly with advanced parsing options. 100% client-side, secure, and free forever.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/csv-to-json',
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

export default function CSVToJSONLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
