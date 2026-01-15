import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to XML Converter Online Free - Transform JSON to XML Instantly',
  description: 'Convert JSON to XML online instantly with our free converter. Customize root elements, indentation, array handling, and CDATA wrapping. 100% client-side, no upload required.',
  keywords: [
    'json to xml',
    'json to xml converter',
    'convert json to xml',
    'json to xml online',
    'json xml converter',
    'json to xml tool',
    'json to xml online free',
    'json to xml converter online free',
    'convert json to xml online',
    'json array to xml',
    'json to xml with cdata',
    'json to rss xml',
    'json to xml sitemap'
  ],
  openGraph: {
    title: 'JSON to XML Converter Online Free - Transform JSON to XML Instantly',
    description: 'Convert JSON to XML instantly with custom formatting, CDATA support, and presets for RSS, Sitemap, SOAP. 100% client-side.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-to-xml',
    siteName: 'DataFormatterPro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to XML Converter Online Free - Transform JSON to XML Instantly',
    description: 'Convert JSON to XML instantly with custom formatting, CDATA support, and presets for RSS, Sitemap, SOAP. 100% client-side.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-to-xml',
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

export default function JSONToXMLLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
