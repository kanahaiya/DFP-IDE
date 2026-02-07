import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to Elm Converter Online Free - Types, Decoders & Encoders',
  description: 'Convert JSON to Elm type aliases with Json.Decode and Json.Encode functions. Free online tool supports pipeline-style decoders.',
  keywords: ['json to elm', 'elm decoder', 'elm encoder', 'elm type alias', 'json decode pipeline', 'elm json converter'],
  openGraph: { title: 'JSON to Elm Converter - Types & Decoders', description: 'Convert JSON to Elm code with decoders and encoders. Free online tool.', type: 'website', url: 'https://dataformatterpro.com/json-to-elm' },
  twitter: { card: 'summary_large_image', title: 'JSON to Elm Converter', description: 'Convert JSON to Elm types and decoders instantly. Free online tool.' },
  alternates: { canonical: 'https://dataformatterpro.com/json-to-elm' },
};

export default function JsonToElmLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
