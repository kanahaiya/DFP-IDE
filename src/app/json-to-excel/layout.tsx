import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to Excel Converter - Free Online JSON to XLSX Tool',
  description:
    'Convert JSON to Excel (XLSX) online instantly. Handle nested objects, customize columns, preview data before download. 100% client-side - your data stays private.',
  keywords: [
    'json to excel',
    'json to xlsx',
    'convert json to excel',
    'json to spreadsheet',
    'json to excel converter',
    'json to xls',
    'json to csv',
    'export json to excel',
    'json table converter',
    'api response to excel',
  ],
  openGraph: {
    title: 'JSON to Excel Converter - Free Online Tool',
    description:
      'Convert JSON to Excel with nested object flattening, column customization, and live preview. Client-side processing for privacy.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-to-excel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to Excel Converter',
    description:
      'Free online JSON to Excel converter. XLSX, XLS, CSV formats. 100% client-side.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-to-excel',
  },
};

export default function JsonToExcelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
