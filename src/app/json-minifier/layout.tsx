import type { Metadata } from 'next';
import { jsonMinifierContent } from '@/data/json-minifier-seo';

export const metadata: Metadata = {
  title: jsonMinifierContent.title,
  description: jsonMinifierContent.description,
  keywords: [
    'json minifier',
    'minify json online',
    'json minify tool',
    'compress json online',
    'json compressor',
    'json beautifier',
    'json formatter',
    'minify json free',
    'reduce json size',
    'json minification',
    'online json minifier',
  ],
  openGraph: {
    title: jsonMinifierContent.title,
    description: jsonMinifierContent.description,
    type: 'website',
    url: '/json-minifier',
    siteName: 'DataFormatter Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: jsonMinifierContent.title,
    description: jsonMinifierContent.description,
  },
  alternates: {
    canonical: '/json-minifier',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function JsonMinifierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
