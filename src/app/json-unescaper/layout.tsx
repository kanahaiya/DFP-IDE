import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON String Unescaper Online Free - Unescape Special Characters | DataFormatterPro',
  description: 'Unescape JSON strings with auto-detection. Convert escaped quotes, backslashes, and Unicode sequences back to readable text. Handle multi-layer escaping. 100% client-side processing.',
  keywords: [
    'json unescaper',
    'json string unescape',
    'unescape json online',
    'json unescape tool',
    'unescape quotes json',
    'json unescape characters',
    'javascript string unescape',
    'json unescape quotes',
    'json unescape special characters',
    'json string decoder',
    'unescape json string',
    'json unescape newline',
    'json unescape unicode',
    'multi layer unescape',
    'nested json unescape'
  ],
  openGraph: {
    title: 'JSON String Unescaper Online Free - Unescape Special Characters',
    description: 'Unescape JSON strings with auto-detection. Handle multi-layer escaping. 100% client-side processing.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-unescaper',
    siteName: 'DataFormatterPro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON String Unescaper Online Free - Unescape Special Characters',
    description: 'Unescape JSON strings with auto-detection. Handle multi-layer escaping. 100% client-side processing.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-unescaper',
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

export default function JSONUnescaperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
