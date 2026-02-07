import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON String Escaper Online Free - Escape Special Characters | DataFormatterPro',
  description: 'Escape JSON strings for JavaScript, HTML, URL, and more. Free online JSON escaper with real-time preview. Properly escape quotes, backslashes, and special characters. 100% client-side processing.',
  keywords: [
    'json escaper',
    'json string escape',
    'escape json online',
    'json escape tool',
    'escape quotes json',
    'json escape characters',
    'javascript string escape',
    'url safe json',
    'html safe json',
    'json escape quotes',
    'json escape special characters',
    'json string encoder',
    'escape json for javascript',
    'json escape newline',
    'json escape unicode'
  ],
  openGraph: {
    title: 'JSON String Escaper Online Free - Escape Special Characters',
    description: 'Escape JSON strings for JavaScript, HTML, URL. Real-time preview, 100% client-side processing.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-escaper',
    siteName: 'DataFormatterPro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON String Escaper Online Free - Escape Special Characters',
    description: 'Escape JSON strings for JavaScript, HTML, URL. Real-time preview, 100% client-side processing.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-escaper',
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

export default function JSONEscaperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
