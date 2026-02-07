import type { Metadata } from 'next';
import { jsonToFlowSEO } from '@/data/json-to-flow-seo';

export const metadata: Metadata = {
  title: jsonToFlowSEO.title,
  description: jsonToFlowSEO.description,
  keywords: jsonToFlowSEO.keywords,
  openGraph: {
    title: jsonToFlowSEO.title,
    description: jsonToFlowSEO.description,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: jsonToFlowSEO.title,
    description: jsonToFlowSEO.description,
  },
  alternates: {
    canonical: '/json-to-flow',
  },
};

export default function JsonToFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
