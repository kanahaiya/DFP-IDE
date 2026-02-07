import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Repair Tool - Fix Broken JSON Online Free',
  description:
    'Automatically repair broken JSON syntax online. Fix quotes, commas, brackets, and more. Free JSON repair tool with instant results. 100% browser-based and private.',
  keywords: [
    'json repair tool',
    'fix broken json',
    'json fixer online',
    'repair invalid json',
    'json syntax error fix',
    'auto fix json',
    'json repair online free',
    'fix json quotes',
    'json repair free',
    'fix malformed json',
  ],
  openGraph: {
    title: 'JSON Repair Tool - Fix Broken JSON Online',
    description:
      'Automatically repair broken JSON syntax. Fix quotes, commas, brackets, and more with one click.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-repair',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Repair Tool',
    description:
      'Fix broken JSON automatically. Repair quotes, commas, brackets, and common syntax errors.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-repair',
  },
};

export default function JsonRepairLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
