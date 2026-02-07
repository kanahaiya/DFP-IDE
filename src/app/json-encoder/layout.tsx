import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Encoder Online Free - URL, Base64, Hex Encoding | DataFormatterPro',
  description: 'Encode JSON to URL, Base64, Hex, HTML entities, and Unicode escape formats. Free online JSON encoder with real-time preview. 100% client-side, no upload required.',
  keywords: [
    'json encoder',
    'json to url encode',
    'json to base64',
    'json to hex',
    'url encode json',
    'base64 encode json',
    'json encoder online',
    'json url encoding',
    'encode json for url',
    'json string encoder',
    'json escape encoder',
    'html entity encode json',
    'unicode escape json',
    'json encoding tool'
  ],
  openGraph: {
    title: 'JSON Encoder Online Free - URL, Base64, Hex Encoding',
    description: 'Encode JSON to URL, Base64, Hex, HTML entities, and Unicode formats. Real-time preview, 100% client-side processing.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-encoder',
    siteName: 'DataFormatterPro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Encoder Online Free - URL, Base64, Hex Encoding',
    description: 'Encode JSON to URL, Base64, Hex, HTML entities, and Unicode formats. Real-time preview, 100% client-side processing.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-encoder',
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

export default function JSONEncoderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
