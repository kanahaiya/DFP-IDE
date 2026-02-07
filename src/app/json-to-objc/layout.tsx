import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to Objective-C Converter - Generate ObjC Models from JSON | DevFormatPro',
  description:
    'Free online JSON to Objective-C converter. Generate NSObject model classes with property declarations, initializers, and dictionary conversion methods.',
  keywords: [
    'json to objective-c',
    'json to objc',
    'objective-c model generator',
    'json to nsobject',
    'objc class generator',
    'ios model generator',
    'json parser objective-c',
    'objc codegen',
  ],
  openGraph: {
    title: 'JSON to Objective-C Converter - Generate ObjC Models from JSON',
    description:
      'Free online tool to convert JSON to Objective-C model classes with header and implementation files.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to Objective-C Converter',
    description:
      'Generate Objective-C model classes from JSON data for iOS/macOS development.',
  },
  alternates: {
    canonical: '/json-to-objc',
  },
};

export default function JsonToObjCLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
