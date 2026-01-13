import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to OpenAPI Converter - Free Online Tool',
  description: 'Convert JSON to OpenAPI 3.0 specifications instantly with our free online converter. Smart type detection, multi-endpoint support, and YAML/JSON export. No signup required, 100% client-side processing.',
  keywords: [
    'json to openapi converter',
    'json to openapi',
    'convert json to openapi',
    'openapi generator',
    'json to swagger converter',
    'openapi spec generator',
    'swagger generator',
    'api specification generator',
    'openapi 3.0 generator',
    'free openapi converter online',
    'json to openapi yaml',
    'generate openapi from json'
  ],
  openGraph: {
    title: 'JSON to OpenAPI Converter - Generate API Specs Instantly',
    description: 'Free online tool to convert JSON to OpenAPI 3.0 specifications. Smart type detection, multi-endpoint support, instant results.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-to-openapi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to OpenAPI Converter - Free Tool',
    description: 'Convert JSON to OpenAPI/Swagger specs instantly. Smart detection, multi-endpoint support, no signup required.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-to-openapi',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function JSONToOpenAPILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
