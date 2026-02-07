import type { Metadata } from 'next';
import { jsonMergeContent } from '@/data/json-merge-seo';

export const metadata: Metadata = {
  title: jsonMergeContent.title,
  description: jsonMergeContent.description,
  keywords: [
    'json merge',
    'merge json online',
    'combine json objects',
    'json merge tool',
    'deep merge json',
    'json combiner',
    'merge multiple json files',
    'json concatenation',
    'array union json',
    'online json merger',
    'free json merge tool',
  ],
  openGraph: {
    title: jsonMergeContent.title,
    description: jsonMergeContent.description,
    type: 'website',
    url: '/json-merge',
    siteName: 'DataFormatter Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: jsonMergeContent.title,
    description: jsonMergeContent.description,
  },
  alternates: {
    canonical: '/json-merge',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function JsonMergeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
