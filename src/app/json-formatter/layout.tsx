import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Formatter & Beautifier - Free Online JSON Pretty Print Tool',
  description:
    'Format and beautify JSON online instantly with our free JSON formatter. Tree view visualization, syntax validation, data manipulation, and export options. 100% client-side processing.',
  keywords: [
    'json formatter',
    'json beautifier',
    'json pretty print',
    'format json online',
    'json validator',
    'json tree view',
    'beautify json',
    'json indentation',
    'json viewer',
    'pretty json',
  ],
  openGraph: {
    title: 'JSON Formatter & Beautifier - Free Online Tool',
    description:
      'Format and beautify JSON online with tree view, validation, and data cleaning options. Client-side processing for privacy.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-formatter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Formatter & Beautifier',
    description:
      'Free online JSON formatter with tree view, validation, and beautification. 100% client-side.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-formatter',
  },
};

export default function JsonFormatterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
