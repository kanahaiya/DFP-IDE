import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to TypeScript Converter Online Free - Generate Interfaces & Types',
  description:
    'Convert JSON to TypeScript interfaces instantly. Free online tool generates types, interfaces with optional properties, union types, JSDoc comments. No signup required.',
  keywords: [
    'json to typescript',
    'json to typescript converter',
    'json to typescript interface',
    'convert json to typescript',
    'json to ts',
    'typescript interface generator',
    'json to typescript online',
    'generate typescript types from json',
  ],
  openGraph: {
    title: 'JSON to TypeScript Converter - Generate Interfaces & Types',
    description:
      'Convert JSON to TypeScript interfaces with smart type inference, optional properties, and union types. Free online tool.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-to-typescript',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to TypeScript Converter',
    description:
      'Convert JSON to TypeScript interfaces instantly. Free online tool with type inference.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-to-typescript',
  },
};

export default function JsonToTypeScriptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
