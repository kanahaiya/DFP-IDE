import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Fixer Online - Interactive JSON Debugging & Error Fixing',
  description:
    'Debug and fix JSON errors interactively with detailed explanations. See all errors at once, understand why they occur, and fix them one by one. Free online JSON fixer.',
  keywords: [
    'json fixer online',
    'json syntax debugger',
    'interactive json fixer',
    'json error finder',
    'fix json errors online',
    'json debugging tool',
    'json error explanation',
    'learn json syntax',
    'json syntax errors',
    'json debug tool',
  ],
  openGraph: {
    title: 'JSON Fixer Online - Interactive JSON Debugging',
    description:
      'Debug and fix JSON errors interactively. See all errors, understand why they occur, and fix them one by one.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-fixer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Fixer Online',
    description:
      'Interactive JSON debugging with error explanations. Fix errors one by one and learn JSON syntax.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-fixer',
  },
};

export default function JsonFixerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
