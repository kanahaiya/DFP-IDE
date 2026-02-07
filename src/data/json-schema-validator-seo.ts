/**
 * JSON Schema Validator SEO Data
 * SEO content and metadata for JSON Schema Validator tool
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

export const jsonSchemaValidatorSEO = {
  // Primary Keywords
  primaryKeyword: 'JSON Schema Validator',
  secondaryKeywords: [
    'validate json schema',
    'json schema online',
    'json schema validation tool',
    'json schema checker',
    'json schema draft 7',
  ],
  
  // Meta Information
  title: 'JSON Schema Validator Online Free - Draft 2020-12 Support',
  description: 'Validate JSON data against custom JSON Schema definitions. Free online validator supports Draft-04 to 2020-12 with detailed error messages. No signup required.',
  
  // Hero Section
  heroTitle: 'JSON Schema Validator',
  heroSubtitle: 'Validate Data Against Schema',
  heroDescription: 'Validate JSON data against JSON Schema definitions with support for all major drafts. Get detailed error messages with paths and suggestions.',
  
  // Features
  features: [
    {
      icon: 'fas fa-file-alt',
      title: 'Dual Editor',
      description: 'Side-by-side editors for schema and data with syntax highlighting.',
    },
    {
      icon: 'fas fa-layer-group',
      title: 'Multi-Draft Support',
      description: 'Supports Draft-04, Draft-06, Draft-07, 2019-09, and 2020-12.',
    },
    {
      icon: 'fas fa-search',
      title: 'Detailed Errors',
      description: 'Get precise error paths, expected types, and fix suggestions.',
    },
    {
      icon: 'fas fa-book',
      title: 'Schema Library',
      description: '8 pre-built schemas for common use cases to get started quickly.',
    },
    {
      icon: 'fas fa-lock',
      title: 'Privacy First',
      description: 'All validation happens in your browser. Your data never leaves your device.',
    },
    {
      icon: 'fas fa-magic',
      title: 'Auto-Detect Draft',
      description: 'Automatically detects schema draft from $schema property.',
    },
  ] as FeatureItem[],
  
  // Use Cases
  useCases: [
    {
      title: 'API Development',
      description: 'Validate API request and response payloads against OpenAPI schemas.',
      icon: 'fas fa-server',
    },
    {
      title: 'Data Validation',
      description: 'Ensure data integrity before processing or storing.',
      icon: 'fas fa-database',
    },
    {
      title: 'Schema Testing',
      description: 'Test your JSON Schema definitions with sample data.',
      icon: 'fas fa-vial',
    },
    {
      title: 'Documentation',
      description: 'Generate documentation from schemas with validation examples.',
      icon: 'fas fa-book-open',
    },
  ] as UseCase[],
  
  // How To Steps
  howToSteps: [
    {
      number: 1,
      title: 'Enter Schema',
      description: 'Paste your JSON Schema in the left editor or select from examples.',
    },
    {
      number: 2,
      title: 'Enter Data',
      description: 'Paste the JSON data you want to validate in the right editor.',
    },
    {
      number: 3,
      title: 'View Results',
      description: 'Validation runs automatically with detailed error messages.',
    },
    {
      number: 4,
      title: 'Fix Issues',
      description: 'Use error paths and suggestions to fix validation issues.',
    },
  ] as HowToStep[],
  
  // Educational Content
  educationalContent: [
    {
      title: 'What is JSON Schema?',
      content: 'JSON Schema is a vocabulary for annotating and validating JSON documents. It describes the structure, constraints, and documentation for JSON data.',
      type: 'info' as const,
    },
    {
      title: 'Schema Drafts',
      content: 'JSON Schema has evolved through multiple drafts. Draft-07 is widely used, while Draft 2020-12 is the latest version with new features like prefixItems and $dynamicRef.',
      type: 'tip' as const,
    },
    {
      title: 'Common Validation Keywords',
      content: 'Key validation keywords include: type, properties, required, minimum/maximum, minLength/maxLength, pattern, enum, format, and allOf/anyOf/oneOf combinators.',
      type: 'info' as const,
    },
  ] as EducationalSection[],
  
  // Technical Specifications
  technicalSpecs: [
    { feature: 'Schema Drafts', specification: 'Draft-04 to 2020-12' },
    { feature: 'Max Input Size', specification: '5 MB each' },
    { feature: 'Validation Speed', specification: '< 50ms typical' },
    { feature: 'Format Validation', specification: 'email, uri, date-time, uuid, etc.' },
    { feature: 'Error Detail', specification: 'Path, keyword, suggestion' },
    { feature: 'Example Schemas', specification: '8 pre-built templates' },
  ] as TechnicalSpec[],
  
  // FAQ
  faq: [
    {
      question: 'Which JSON Schema drafts are supported?',
      answer: 'We support Draft-04, Draft-06, Draft-07, Draft 2019-09, and Draft 2020-12. The validator auto-detects the draft from the $schema property.',
    },
    {
      question: 'What format validations are available?',
      answer: 'We validate common formats including: email, uri, uri-reference, date-time, date, time, uuid, ipv4, ipv6, hostname, json-pointer, and regex.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, all validation happens entirely in your browser using JavaScript. Your schema and data are never sent to any server.',
    },
    {
      question: 'Can I use custom schemas?',
      answer: 'Absolutely! You can paste any valid JSON Schema. We also provide 8 pre-built example schemas for common patterns like user profiles, API responses, and configuration files.',
    },
    {
      question: 'What error information is provided?',
      answer: 'Each error includes: the JSON path where the error occurred, the validation keyword that failed, the expected vs actual type, and a suggestion for how to fix the issue.',
    },
  ] as FAQItem[],
};

export type JsonSchemaValidatorSEOData = typeof jsonSchemaValidatorSEO;
