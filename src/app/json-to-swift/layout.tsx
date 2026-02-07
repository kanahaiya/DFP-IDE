import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to Swift Converter Free Online - Generate Codable Structs & Classes',
  description: 'Convert JSON to Swift structs and classes instantly. Generate Codable-compliant Swift code with CodingKeys, optional support, and SwiftUI ready. 100% client-side, no signup required.',
  keywords: [
    'json to swift',
    'json to swift struct',
    'json to swift codable',
    'swift model generator',
    'convert json to swift',
    'json swift converter',
    'swift codable generator',
    'json to swift class',
    'ios json parser',
    'swiftui json model'
  ],
  openGraph: {
    title: 'JSON to Swift Converter Free Online - Generate Codable Structs',
    description: 'Convert JSON to Swift Codable structs and classes instantly. 100% client-side.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-to-swift',
    siteName: 'DataFormatterPro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to Swift Converter Free Online - Generate Codable Structs',
    description: 'Convert JSON to Swift Codable structs and classes instantly. 100% client-side.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-to-swift',
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

export default function JSONToSwiftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
