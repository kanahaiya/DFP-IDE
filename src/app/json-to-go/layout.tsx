import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to Go Struct Converter Free Online - Generate Go Structs',
  description: 'Convert JSON to Go structs instantly with free online tool. Generate production-ready Go code with JSON tags, omitempty, nested struct support. 100% client-side, no signup required.',
  keywords: [
    'json to go',
    'json to go struct',
    'json to golang',
    'go struct generator',
    'convert json to go',
    'json to go converter',
    'golang json parser',
    'go struct from json',
    'json go struct tags',
    'json to go online free',
    'go struct generator online'
  ],
  openGraph: {
    title: 'JSON to Go Struct Converter Free Online - Generate Go Structs',
    description: 'Convert JSON to Go structs instantly. Generate production-ready Go code with JSON tags. 100% client-side.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-to-go',
    siteName: 'DataFormatterPro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to Go Struct Converter Free Online - Generate Go Structs',
    description: 'Convert JSON to Go structs instantly. Generate production-ready Go code with JSON tags. 100% client-side.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-to-go',
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

export default function JSONToGoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
