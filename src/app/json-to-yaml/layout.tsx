import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to YAML Converter Free Online - Kubernetes & Docker Presets',
  description: 'Convert JSON to YAML instantly with free online tool. Kubernetes, Docker Compose, Ansible presets. Client-side, no signup required.',
  keywords: [
    'json to yaml',
    'json to yaml converter',
    'json yaml converter',
    'yaml converter online',
    'json to yml',
    'convert json to yaml',
    'kubernetes yaml',
    'docker compose yaml',
    'json yaml tool',
    'yaml formatter',
    'json to yaml online free',
    'kubernetes json to yaml'
  ],
  openGraph: {
    title: 'JSON to YAML Converter Free Online - Kubernetes & Docker Presets',
    description: 'Convert JSON to YAML instantly with Kubernetes, Docker, Ansible presets. 100% client-side.',
    type: 'website',
    url: 'https://dataformatterpro.com/json-to-yaml',
    siteName: 'DataFormatterPro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to YAML Converter Free Online - Kubernetes & Docker Presets',
    description: 'Convert JSON to YAML instantly with Kubernetes, Docker, Ansible presets. 100% client-side.',
  },
  alternates: {
    canonical: 'https://dataformatterpro.com/json-to-yaml',
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

export default function JSONToYAMLLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
