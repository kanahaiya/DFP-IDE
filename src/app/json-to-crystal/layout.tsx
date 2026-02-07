import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to Crystal Converter - Generate Crystal Structs from JSON | DevFormatPro',
  description:
    'Free online JSON to Crystal converter. Generate type-safe Crystal structs and classes from JSON data with JSON::Serializable support, property annotations, and naming conventions.',
  keywords: [
    'json to crystal',
    'crystal struct generator',
    'json to crystal struct',
    'crystal class generator',
    'json serializable crystal',
    'crystal type converter',
    'json parser crystal',
    'crystal model generator',
  ],
  openGraph: {
    title: 'JSON to Crystal Converter - Generate Crystal Structs from JSON',
    description:
      'Free online tool to convert JSON to Crystal structs and classes with JSON::Serializable support.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to Crystal Converter',
    description:
      'Generate type-safe Crystal structs and classes from JSON data instantly.',
  },
  alternates: {
    canonical: '/json-to-crystal',
  },
};

export default function JsonToCrystalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
