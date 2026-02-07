/**
 * JSON to Schema Generator SEO Data
 */

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface HowToStep {
  number: number;
  title: string;
  description: string;
}

export interface EducationalSection {
  title: string;
  content: string;
  type?: 'info' | 'tip' | 'warning';
}

export interface UseCase {
  title: string;
  description: string;
  icon: string;
}

export interface TechnicalSpec {
  feature: string;
  specification: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const jsonToSchemaSEO = {
  primaryKeyword: 'JSON to Schema Generator',
  secondaryKeywords: [
    'json to json schema',
    'json to typescript',
    'json to zod',
    'generate json schema',
    'json schema from example',
  ],
  
  title: 'JSON to Schema Generator Online - TypeScript, Zod, GraphQL & More',
  description: 'Generate schemas from JSON in 10+ formats: JSON Schema, TypeScript, Zod, Yup, GraphQL, Mongoose, Go, Rust, and more. Free online tool with smart type inference.',
  
  heroTitle: 'JSON to Schema Generator',
  heroSubtitle: 'Generate Multiple Schema Formats',
  heroDescription: 'Convert JSON to schemas in 10+ formats with intelligent type inference. Supports JSON Schema, TypeScript, Zod, Yup, GraphQL, Mongoose, Flow, Rust, and Go.',
  
  features: [
    {
      icon: 'fas fa-layer-group',
      title: '10+ Output Formats',
      description: 'Generate JSON Schema, TypeScript, Zod, Yup, GraphQL, Mongoose, Flow, Rust, and Go.',
    },
    {
      icon: 'fas fa-magic',
      title: 'Smart Type Inference',
      description: 'Automatically detects emails, URLs, UUIDs, dates, and other formats.',
    },
    {
      icon: 'fas fa-cog',
      title: 'Customizable',
      description: 'Configure required fields, naming conventions, and output formatting.',
    },
    {
      icon: 'fas fa-bolt',
      title: 'Instant Generation',
      description: 'Real-time schema generation as you type with instant preview.',
    },
    {
      icon: 'fas fa-lock',
      title: 'Privacy First',
      description: 'All processing happens in your browser. Your data never leaves your device.',
    },
    {
      icon: 'fas fa-download',
      title: 'Easy Export',
      description: 'Copy to clipboard or download generated schemas in any format.',
    },
  ] as FeatureItem[],
  
  useCases: [
    {
      title: 'API Development',
      description: 'Generate schemas from API response examples for validation.',
      icon: 'fas fa-server',
    },
    {
      title: 'Type Safety',
      description: 'Create TypeScript interfaces from JSON for type-safe code.',
      icon: 'fas fa-shield-alt',
    },
    {
      title: 'Form Validation',
      description: 'Generate Zod or Yup schemas for runtime form validation.',
      icon: 'fas fa-check-double',
    },
    {
      title: 'Database Models',
      description: 'Create Mongoose schemas or SQL types from JSON data.',
      icon: 'fas fa-database',
    },
  ] as UseCase[],
  
  howToSteps: [
    {
      number: 1,
      title: 'Paste JSON',
      description: 'Enter or paste your JSON data in the input editor.',
    },
    {
      number: 2,
      title: 'Select Format',
      description: 'Choose your desired output format from 10+ options.',
    },
    {
      number: 3,
      title: 'Customize',
      description: 'Adjust settings like required fields and naming conventions.',
    },
    {
      number: 4,
      title: 'Export',
      description: 'Copy the generated schema or download it as a file.',
    },
  ] as HowToStep[],
  
  educationalContent: [
    {
      title: 'What is JSON Schema?',
      content: 'JSON Schema is a vocabulary for validating JSON documents. It describes the structure, constraints, and documentation for JSON data, enabling validation and code generation.',
      type: 'info' as const,
    },
    {
      title: 'Schema vs Types',
      content: 'JSON Schema is for runtime validation while TypeScript types are compile-time only. For full type safety, use both: TypeScript for development and Zod/Yup for runtime.',
      type: 'tip' as const,
    },
    {
      title: 'Type Inference',
      content: 'The generator automatically infers special formats like emails, URLs, UUIDs, and dates from string values, adding appropriate validation constraints to the output.',
      type: 'info' as const,
    },
  ] as EducationalSection[],
  
  technicalSpecs: [
    { feature: 'Output Formats', specification: '12 different formats' },
    { feature: 'Max Input Size', specification: '5 MB' },
    { feature: 'JSON Schema Drafts', specification: 'Draft-07, 2019-09, 2020-12' },
    { feature: 'Type Detection', specification: 'email, uri, uuid, date-time' },
    { feature: 'Nested Support', specification: 'Unlimited depth' },
    { feature: 'Array Handling', specification: 'Infers item types' },
  ] as TechnicalSpec[],
  
  faq: [
    {
      question: 'What formats can I generate?',
      answer: 'We support 12 formats: JSON Schema (3 drafts), TypeScript (interface and type), Zod, Yup, Mongoose, GraphQL, Flow, Rust, and Go.',
    },
    {
      question: 'How does type inference work?',
      answer: 'The generator analyzes string values to detect patterns like emails, URLs, UUIDs, and ISO dates, then adds appropriate format constraints to the output schema.',
    },
    {
      question: 'Can I make all fields required or optional?',
      answer: 'Yes, use the "Make All Required" or "Make All Optional" settings to override the default inference based on null values.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, all schema generation happens entirely in your browser using JavaScript. Your JSON data is never sent to any server.',
    },
    {
      question: 'How are nested objects handled?',
      answer: 'Nested objects are converted to nested schema definitions. For TypeScript, this creates separate interfaces. For JSON Schema, nested object schemas are inline.',
    },
  ] as FAQItem[],
};

export type JsonToSchemaSEOData = typeof jsonToSchemaSEO;
