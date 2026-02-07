import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to Java Converter Free Online - Generate POJO Classes',
  description: 'Convert JSON to Java POJO classes instantly. Generate classes with Jackson, Gson, or Lombok annotations. 100% client-side, no signup required.',
  keywords: [
    'json to java',
    'json to pojo',
    'json to java class',
    'java class generator',
    'pojo generator',
    'convert json to java',
    'jackson json',
    'gson json',
    'lombok java'
  ],
  openGraph: {
    title: 'JSON to Java Converter Free Online - Generate POJO Classes',
    description: 'Convert JSON to Java POJO classes instantly. Support for Jackson, Gson, and Lombok. 100% client-side.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-to-java',
    siteName: 'DataFormatterPro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to Java Converter Free Online - Generate POJO Classes',
    description: 'Convert JSON to Java POJO classes instantly. Support for Jackson, Gson, and Lombok. 100% client-side.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-to-java',
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

export default function JSONToJavaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
