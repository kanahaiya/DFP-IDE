import type { Metadata } from 'next';
import { JSON_EDITOR_SEO, JSON_EDITOR_SCHEMA } from '@/data/json-editor-seo';

export const metadata: Metadata = {
  title: JSON_EDITOR_SEO.title,
  description: JSON_EDITOR_SEO.description,
  keywords: JSON_EDITOR_SEO.keywords,
  openGraph: {
    title: JSON_EDITOR_SEO.og.title,
    description: JSON_EDITOR_SEO.og.description,
    type: 'website',
    url: JSON_EDITOR_SEO.canonicalPath,
  },
  twitter: {
    card: 'summary_large_image',
    title: JSON_EDITOR_SEO.twitter.title,
    description: JSON_EDITOR_SEO.twitter.description,
  },
  alternates: {
    canonical: JSON_EDITOR_SEO.canonicalPath,
  },
};

export default function JsonEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_EDITOR_SCHEMA) }}
      />
      {children}
    </>
  );
}
