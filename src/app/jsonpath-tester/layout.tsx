import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSONPath Tester Online Free - Test JSON Queries in Real-Time',
  description:
    'Test and debug JSONPath expressions against JSON data with instant results. Free online JSONPath tester with query history, syntax reference, and multiple result views. 100% client-side processing.',
  keywords: [
    'jsonpath tester',
    'jsonpath online',
    'test jsonpath expression',
    'jsonpath query',
    'json query tool',
    'jsonpath playground',
    'jsonpath evaluator',
    'jsonpath filter',
    'json data extraction',
    'jsonpath syntax',
  ],
  openGraph: {
    title: 'JSONPath Tester - Test JSON Query Expressions Online',
    description:
      'Test JSONPath expressions against JSON data with real-time results. Free online tool with syntax reference and examples.',
    type: 'website',
    url: 'https://dataformatterpro.com/jsonpath-tester',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSONPath Tester Online',
    description:
      'Test JSONPath queries against JSON data in real-time. Free tool with query history and multiple result views.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/jsonpath-tester',
  },
};

export default function JSONPathTesterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
