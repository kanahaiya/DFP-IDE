import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to Ruby Converter Online Free - Hash, Struct & Class',
  description: 'Convert JSON to Ruby hashes, Structs, and classes instantly. Free online tool supports symbol syntax, hashrockets, OpenStruct, and Data.define.',
  keywords: ['json to ruby', 'json to ruby hash', 'json to ruby struct', 'json to ruby class', 'ruby hash converter', 'json ruby converter'],
  openGraph: { title: 'JSON to Ruby Converter - Hash & Class Generator', description: 'Convert JSON to Ruby code with multiple output modes. Free online tool.', type: 'website', url: 'https://dataformatterpro.com/json-to-ruby' },
  twitter: { card: 'summary_large_image', title: 'JSON to Ruby Converter', description: 'Convert JSON to Ruby hashes and classes instantly. Free online tool.' },
  alternates: { canonical: 'https://dataformatterpro.com/json-to-ruby' },
};

export default function JsonToRubyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
