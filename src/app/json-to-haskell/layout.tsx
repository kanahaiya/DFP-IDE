import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to Haskell Converter Online Free - Records & Aeson Instances',
  description: 'Convert JSON to Haskell data types with Aeson FromJSON/ToJSON instances. Free online tool supports Generic deriving and Template Haskell.',
  keywords: ['json to haskell', 'haskell aeson', 'haskell json', 'haskell records', 'derivegeneric', 'fromjson tojson'],
  openGraph: { title: 'JSON to Haskell Converter - Records & Aeson', description: 'Convert JSON to Haskell types with Aeson instances. Free online tool.', type: 'website', url: 'https://dataformatterpro.com/json-to-haskell' },
  twitter: { card: 'summary_large_image', title: 'JSON to Haskell Converter', description: 'Convert JSON to Haskell record types instantly. Free online tool.' },
  alternates: { canonical: 'https://dataformatterpro.com/json-to-haskell' },
};

export default function JsonToHaskellLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
