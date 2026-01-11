import type { StructuredData } from '@/types';

interface JsonLdProps {
  data: StructuredData | StructuredData[];
}

/**
 * JSON-LD structured data component for SEO
 */
export function JsonLd({ data }: JsonLdProps) {
  const jsonData = Array.isArray(data) ? data : [data];
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonData.length === 1 ? jsonData[0] : { '@graph': jsonData }),
      }}
    />
  );
}
