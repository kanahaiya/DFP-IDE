import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to C# Converter Free Online - Generate .NET Classes',
  description: 'Convert JSON to C# classes instantly. Generate classes with Newtonsoft.Json or System.Text.Json attributes. 100% client-side, no signup required.',
  keywords: [
    'json to csharp',
    'json to c#',
    'json to c# class',
    'c# class generator',
    'json2csharp',
    'convert json to csharp',
    'newtonsoft json',
    'system.text.json',
    'dotnet json'
  ],
  openGraph: {
    title: 'JSON to C# Converter Free Online - Generate .NET Classes',
    description: 'Convert JSON to C# classes instantly. Support for Newtonsoft.Json and System.Text.Json. 100% client-side.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-to-csharp',
    siteName: 'DataFormatterPro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to C# Converter Free Online - Generate .NET Classes',
    description: 'Convert JSON to C# classes instantly. Support for Newtonsoft.Json and System.Text.Json. 100% client-side.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-to-csharp',
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

export default function JSONToCSharpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
