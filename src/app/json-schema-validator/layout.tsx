import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Schema Validator Online Free - Draft 2020-12 Support',
  description:
    'Validate JSON data against custom JSON Schema definitions. Free online validator supports Draft-04 to 2020-12 with detailed error messages. No signup required.',
  keywords: [
    'json schema validator',
    'validate json schema',
    'json schema online',
    'json schema validation tool',
    'json schema checker',
    'json schema draft 7',
    'json schema 2020-12',
    'validate json against schema',
  ],
  openGraph: {
    title: 'JSON Schema Validator - Validate Data Against Schema',
    description:
      'Validate JSON data against JSON Schema definitions with support for all major drafts. Free online tool.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-schema-validator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Schema Validator Online',
    description:
      'Validate JSON against JSON Schema with detailed error messages. Supports Draft-04 to 2020-12.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-schema-validator',
  },
};

export default function JsonSchemaValidatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
