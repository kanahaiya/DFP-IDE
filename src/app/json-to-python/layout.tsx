import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to Python Converter Free Online - Generate Dataclasses & Pydantic',
  description: 'Convert JSON to Python dataclasses, Pydantic models, TypedDict, and more. Full type hints support. 100% client-side, no signup required.',
  keywords: [
    'json to python',
    'json to dataclass',
    'json to pydantic',
    'python class generator',
    'json to typeddict',
    'convert json to python',
    'pydantic model',
    'python dataclass',
    'python type hints'
  ],
  openGraph: {
    title: 'JSON to Python Converter Free Online - Generate Dataclasses & Pydantic',
    description: 'Convert JSON to Python dataclasses and Pydantic models instantly. Full type hints. 100% client-side.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-to-python',
    siteName: 'DataFormatterPro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to Python Converter Free Online - Generate Dataclasses & Pydantic',
    description: 'Convert JSON to Python dataclasses and Pydantic models instantly. Full type hints. 100% client-side.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-to-python',
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

export default function JSONToPythonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
