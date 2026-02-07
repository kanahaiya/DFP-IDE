import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to JavaScript Converter Online Free - Object Literals & ES6 Modules',
  description:
    'Convert JSON to JavaScript object literals instantly. Free online tool generates const/let/var declarations, ES6 modules, CommonJS exports, UMD modules. No signup.',
  keywords: [
    'json to javascript',
    'json to javascript converter',
    'json to js',
    'json to javascript object',
    'json to es6 module',
    'json to commonjs',
    'convert json to javascript',
  ],
  openGraph: {
    title: 'JSON to JavaScript Converter - Object Literals & Modules',
    description:
      'Convert JSON to JavaScript object literals with ES6 modules, CommonJS exports, and more. Free online tool.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-to-javascript',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to JavaScript Converter',
    description:
      'Convert JSON to JavaScript instantly. Free online tool with ES6 and CommonJS support.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-to-javascript',
  },
};

export default function JsonToJavaScriptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
