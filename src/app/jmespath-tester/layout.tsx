import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JMESPath Tester Online Free - AWS CLI Query Tester',
  description:
    'Test and debug JMESPath queries against JSON data with instant results. Perfect for AWS CLI --query parsing. Free online JMESPath tester with syntax reference, query history, and examples. 100% client-side processing.',
  keywords: [
    'jmespath tester',
    'jmespath online',
    'test jmespath query',
    'aws cli query',
    'jmespath playground',
    'jmespath evaluator',
    'aws jmespath',
    'json query tool',
    'jmespath expression tester',
    'aws cli output parsing',
  ],
  openGraph: {
    title: 'JMESPath Tester - Test AWS CLI JSON Queries Online',
    description:
      'Test JMESPath queries against JSON data with real-time results. Perfect for AWS CLI --query flag. Free tool with syntax reference.',
    type: 'website',
    url: 'https://dataformatterpro.com/jmespath-tester',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JMESPath Tester Online - AWS CLI Compatible',
    description:
      'Test JMESPath queries against JSON data in real-time. AWS CLI compatible with built-in functions.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/jmespath-tester',
  },
};

export default function JMESPathTesterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
