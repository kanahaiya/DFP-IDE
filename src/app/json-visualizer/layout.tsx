import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Visualizer Online - Free 2D & 3D JSON Viewer | DFP IDE',
  description:
    'Free online JSON visualizer with 2D tree diagrams and 3D interactive graphs. Explore JSON data structures with multiple layout algorithms, search, and export capabilities. 100% client-side processing.',
  keywords: [
    'json visualizer',
    'json viewer',
    'json tree view',
    'json 3d visualization',
    'json diagram',
    'json graph',
    'json explorer',
    'json structure viewer',
    'interactive json viewer',
    'json data visualization',
    'online json visualizer',
    'free json viewer',
  ],
  openGraph: {
    title: 'JSON Visualizer Online - Free 2D & 3D JSON Viewer',
    description:
      'Transform complex JSON data into stunning interactive 2D and 3D visualizations. Explore hierarchical structures with tree, force-directed, and radial layouts.',
    type: 'website',
    url: '/json-visualizer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Visualizer Online - Free 2D & 3D JSON Viewer',
    description:
      'Transform complex JSON data into stunning interactive 2D and 3D visualizations. Multiple layouts, search, and export options.',
  },
  alternates: {
    canonical: '/json-visualizer',
  },
};

export default function JsonVisualizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
