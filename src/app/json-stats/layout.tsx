import type { Metadata } from 'next';
import { jsonStatsContent } from '@/data/json-stats-seo';

export const metadata: Metadata = {
  title: jsonStatsContent.title,
  description: jsonStatsContent.description,
  keywords: [
    'json stats',
    'json analyzer',
    'analyze json online',
    'json statistics',
    'json structure analyzer',
    'json data types',
    'json quality checker',
    'json analysis tool',
    'json insights',
    'json metrics',
    'online json analyzer',
  ],
  openGraph: {
    title: jsonStatsContent.title,
    description: jsonStatsContent.description,
    type: 'website',
    url: '/json-stats',
    siteName: 'DataFormatter Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: jsonStatsContent.title,
    description: jsonStatsContent.description,
  },
  alternates: {
    canonical: '/json-stats',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function JsonStatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
