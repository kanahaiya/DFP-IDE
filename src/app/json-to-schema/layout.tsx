import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to Schema Generator Online - TypeScript, Zod, GraphQL & More',
  description:
    'Generate schemas from JSON in 10+ formats: JSON Schema, TypeScript, Zod, Yup, GraphQL, Mongoose, Go, Rust, and more. Free online tool with smart type inference.',
  keywords: [
    'json to schema',
    'json to json schema',
    'json to typescript',
    'json to zod',
    'json schema generator',
    'generate json schema from json',
    'json to graphql',
    'json to mongoose',
    'infer json schema',
  ],
  openGraph: {
    title: 'JSON to Schema Generator - Multiple Output Formats',
    description:
      'Generate schemas from JSON in 10+ formats with smart type inference. Free online tool.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-to-schema',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to Schema Generator',
    description:
      'Generate JSON Schema, TypeScript, Zod, GraphQL and more from JSON. Free online tool.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-to-schema',
  },
};

export default function JsonToSchemaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
