import type { Metadata } from 'next';
import { jsonToAvroSEO } from '@/data/json-to-avro-seo';

export const metadata: Metadata = {
  title: jsonToAvroSEO.title,
  description: jsonToAvroSEO.description,
  keywords: jsonToAvroSEO.keywords,
  openGraph: {
    title: jsonToAvroSEO.title,
    description: jsonToAvroSEO.description,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: jsonToAvroSEO.title,
    description: jsonToAvroSEO.description,
  },
  alternates: {
    canonical: '/json-to-avro',
  },
};

export default function JsonToAvroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
