import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Decoder Online Free - URL, Base64, Hex Decoding | DataFormatterPro',
  description: 'Decode URL-encoded, Base64, Hex, HTML entities, and escaped JSON strings. Auto-detection, recursive decoding, and JSON formatting. 100% client-side, no upload required.',
  keywords: [
    'json decoder',
    'url decode json',
    'base64 decode json',
    'hex decode json',
    'json decoder online',
    'decode json string',
    'unescape json',
    'json string decoder',
    'decode encoded json',
    'json url decoder',
    'base64 to json',
    'hex to json',
    'html entity decode json',
    'unicode decode json'
  ],
  openGraph: {
    title: 'JSON Decoder Online Free - URL, Base64, Hex Decoding',
    description: 'Decode URL, Base64, Hex, HTML entities, and escaped JSON with auto-detection. Real-time preview, 100% client-side.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-decoder',
    siteName: 'DataFormatterPro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Decoder Online Free - URL, Base64, Hex Decoding',
    description: 'Decode URL, Base64, Hex, HTML entities, and escaped JSON with auto-detection. Real-time preview, 100% client-side.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-decoder',
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

export default function JSONDecoderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
