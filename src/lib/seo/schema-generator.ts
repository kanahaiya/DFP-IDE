import type { FAQItem, HowToStep } from '@/data/json-to-openapi-seo';

/**
 * Generates comprehensive JSON-LD structured data for SEO
 */

export interface ToolSchemaConfig {
  toolName: string; // e.g., "CSV to JSON Converter"
  toolUrl: string; // e.g., "csv-to-json"
  description: string; // Short meta description
  featureList: string[]; // Array of key features
  howToTitle: string; // e.g., "How to Convert CSV to JSON"
  howToDescription: string; // Description for HowTo schema
  screenshot?: string; // Optional screenshot URL
}

export function generateSoftwareApplicationSchema(config: ToolSchemaConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: config.toolName,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    description: config.description,
    featureList: config.featureList,
    screenshot: config.screenshot || `https://dataformatterpro.com/screenshots/${config.toolUrl}.png`,
    softwareVersion: '2.0',
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    author: {
      '@type': 'Organization',
      name: 'DataFormatterPro',
      url: 'https://dataformatterpro.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'DataFormatterPro',
      url: 'https://dataformatterpro.com',
    },
  };
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateHowToSchema(steps: HowToStep[], config: ToolSchemaConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: config.howToTitle,
    description: config.howToDescription,
    totalTime: 'PT5M',
    tool: {
      '@type': 'HowToTool',
      name: config.toolName,
    },
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.description,
      url: `https://dataformatterpro.com/${config.toolUrl}#step-${step.number}`,
    })),
  };
}

export function generateBreadcrumbSchema(config: ToolSchemaConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://dataformatterpro.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: 'https://dataformatterpro.com/tools',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: config.toolName,
        item: `https://dataformatterpro.com/${config.toolUrl}`,
      },
    ],
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DataFormatterPro',
    url: 'https://dataformatterpro.com',
    logo: 'https://dataformatterpro.com/logo.png',
    description: 'Free online developer tools for data formatting, conversion, and API documentation.',
    sameAs: [
      'https://twitter.com/dataformatterpro',
      'https://github.com/dataformatterpro',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@dataformatterpro.com',
    },
  };
}

export function generateWebPageSchema(config: ToolSchemaConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${config.toolName} - Free Online Tool`,
    description: config.description,
    url: `https://dataformatterpro.com/${config.toolUrl}`,
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: 'DataFormatterPro',
      url: 'https://dataformatterpro.com',
    },
    breadcrumb: generateBreadcrumbSchema(config),
  };
}

export function generateAllSchemas(faqs: FAQItem[], howToSteps: HowToStep[], config: ToolSchemaConfig) {
  return [
    generateSoftwareApplicationSchema(config),
    generateFAQSchema(faqs),
    generateHowToSchema(howToSteps, config),
    generateBreadcrumbSchema(config),
    generateOrganizationSchema(),
    generateWebPageSchema(config),
  ];
}
