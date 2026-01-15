import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Diff - Compare JSON Documents | DevForge Pro',
  description: 'Professional JSON diff tool with visual comparison, tree view, and detailed reports. Compare JSON documents side-by-side with syntax highlighting and change detection.',
  keywords: [
    'json diff',
    'json compare',
    'compare json online',
    'json comparison tool',
    'json patch',
    'unified diff',
    'api response diff',
    'config diff',
    'json change report',
    'json merge',
  ],
};

export default function JSONDiffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
