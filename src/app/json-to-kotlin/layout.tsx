import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to Kotlin Converter Online Free - Data Classes & Serialization',
  description:
    'Convert JSON to Kotlin data classes instantly. Free online tool generates Kotlinx Serialization, Gson, Moshi, Jackson annotations. Perfect for Android development.',
  keywords: [
    'json to kotlin',
    'json to kotlin converter',
    'json to kotlin data class',
    'json to kotlinx serialization',
    'json to kotlin gson',
    'json to kotlin moshi',
    'kotlin data class generator',
  ],
  openGraph: {
    title: 'JSON to Kotlin Converter - Data Classes & Serialization',
    description:
      'Convert JSON to Kotlin data classes with serialization annotations. Free online tool for Android development.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-to-kotlin',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to Kotlin Converter',
    description:
      'Convert JSON to Kotlin data classes instantly. Free online tool with serialization support.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-to-kotlin',
  },
};

export default function JsonToKotlinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
