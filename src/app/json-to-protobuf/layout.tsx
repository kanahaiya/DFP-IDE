import type { Metadata } from 'next';
import { jsonToProtobufSEO } from '@/data/json-to-protobuf-seo';

export const metadata: Metadata = {
  title: jsonToProtobufSEO.title,
  description: jsonToProtobufSEO.description,
  keywords: jsonToProtobufSEO.keywords,
  openGraph: {
    title: jsonToProtobufSEO.title,
    description: jsonToProtobufSEO.description,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: jsonToProtobufSEO.title,
    description: jsonToProtobufSEO.description,
  },
  alternates: {
    canonical: '/json-to-protobuf',
  },
};

export default function JsonToProtobufLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
