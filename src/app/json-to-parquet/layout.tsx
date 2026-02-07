import type { Metadata } from 'next';
import { jsonToParquetSEO } from '@/data/json-to-parquet-seo';

export const metadata: Metadata = {
  title: jsonToParquetSEO.title,
  description: jsonToParquetSEO.description,
  keywords: jsonToParquetSEO.keywords,
  openGraph: {
    title: jsonToParquetSEO.title,
    description: jsonToParquetSEO.description,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: jsonToParquetSEO.title,
    description: jsonToParquetSEO.description,
  },
  alternates: {
    canonical: '/json-to-parquet',
  },
};

export default function JsonToParquetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
