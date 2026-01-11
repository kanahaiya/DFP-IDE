import type { FAQItem, HowToStep } from '@/data/json-to-openapi-seo';

/**
 * Generates comprehensive JSON-LD structured data for SEO
 */

export function generateSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'JSON to OpenAPI Converter',
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
    description: 'Free online JSON to OpenAPI 3.0 and Swagger 2.0 converter with automatic schema inference, multi-endpoint support, and real-time validation.',
    featureList: [
      'Real-time JSON to OpenAPI conversion',
      'Automatic schema inference',
      'Multi-endpoint support',
      'OpenAPI 3.0 and Swagger 2.0 support',
      'Format detection (email, UUID, date-time)',
      'Client-side processing for privacy',
      'Export to JSON and YAML',
      'Built-in Swagger UI preview',
    ],
    screenshot: 'https://dataformatterpro.com/screenshots/json-to-openapi.png',
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

export function generateHowToSchema(steps: HowToStep[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Convert JSON to OpenAPI Specification',
    description: 'Step-by-step guide to converting JSON responses into OpenAPI 3.0 or Swagger 2.0 specifications using our free online tool.',
    totalTime: 'PT5M',
    tool: {
      '@type': 'HowToTool',
      name: 'JSON to OpenAPI Converter',
    },
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.description,
      url: `https://dataformatterpro.com/json-to-openapi#step-${step.number}`,
    })),
  };
}

export function generateBreadcrumbSchema() {
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
        name: 'JSON to OpenAPI Converter',
        item: 'https://dataformatterpro.com/json-to-openapi',
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

export function generateWebPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'JSON to OpenAPI Converter - Free Online Tool',
    description: 'Convert JSON to OpenAPI 3.0 or Swagger 2.0 instantly with automatic schema inference and multi-endpoint support.',
    url: 'https://dataformatterpro.com/json-to-openapi',
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: 'DataFormatterPro',
      url: 'https://dataformatterpro.com',
    },
    breadcrumb: generateBreadcrumbSchema(),
  };
}

export function generateAllSchemas(faqs: FAQItem[], howToSteps: HowToStep[]) {
  return [
    generateSoftwareApplicationSchema(),
    generateFAQSchema(faqs),
    generateHowToSchema(howToSteps),
    generateBreadcrumbSchema(),
    generateOrganizationSchema(),
    generateWebPageSchema(),
  ];
}
