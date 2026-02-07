import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Validator Online Free - Syntax Checker & Auto-Fix',
  description:
    'Validate JSON syntax instantly with detailed error messages. Free online JSON validator with auto-fix, line numbers, and RFC 8259 compliance. No signup required.',
  keywords: [
    'json validator online',
    'validate json',
    'json syntax checker',
    'json lint online',
    'json validator free',
    'json error checker',
    'json format validator',
    'check json syntax',
    'json verification tool',
    'rfc 8259 json validator',
  ],
  openGraph: {
    title: 'JSON Validator Online - Validate & Fix JSON Syntax',
    description:
      'Validate JSON syntax instantly with detailed error messages and auto-fix. Free online tool.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-validator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Validator Online',
    description:
      'Validate JSON syntax with detailed errors and auto-fix capabilities. Free online tool.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-validator',
  },
};

export default function JsonValidatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
