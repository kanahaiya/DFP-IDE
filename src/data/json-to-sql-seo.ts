/**
 * SEO content for JSON to SQL converter page
 */

import type { FAQItem, HowToStep, TechnicalSpec, ComparisonRow, RelatedTool } from './json-to-openapi-seo';

export interface TrustBadge {
  icon: string;
  text: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface UseCase {
  title: string;
  description: string;
  icon: string;
}

export const jsonToSqlContent = {
  title: 'JSON to SQL Converter',
  subtitle: 'Convert JSON to SQL CREATE TABLE and INSERT statements. Support for PostgreSQL, MySQL, SQLite, and more.',
  description: 'Free online JSON to SQL converter. Generate CREATE TABLE and INSERT statements from JSON data for PostgreSQL, MySQL, SQLite.',
  
  trustBadges: [
    { icon: 'fas fa-lock', text: '100% Secure' },
    { icon: 'fas fa-bolt', text: 'Instant Conversion' },
    { icon: 'fas fa-laptop-code', text: 'Browser-Based' },
  ] as TrustBadge[],
  
  features: [
    {
      icon: 'fas fa-database',
      title: 'Multiple Dialects',
      description: 'Support for PostgreSQL, MySQL, SQLite, SQL Server, and Oracle syntax.',
    },
    {
      icon: 'fas fa-table',
      title: 'CREATE TABLE',
      description: 'Generate CREATE TABLE statements with proper column types and constraints.',
    },
    {
      icon: 'fas fa-plus',
      title: 'INSERT Statements',
      description: 'Generate INSERT statements for your data with batch insert support.',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Privacy First',
      description: 'All processing happens in your browser. Your JSON data never leaves your device.',
    },
  ] as Feature[],
  
  howToSectionTitle: 'How to Convert JSON to SQL',
  howToSteps: [
    {
      number: 1,
      title: 'Paste or Upload JSON',
      description: 'Enter your JSON data (object or array of objects) in the input panel.',
    },
    {
      number: 2,
      title: 'Select SQL Dialect',
      description: 'Choose your database: PostgreSQL, MySQL, SQLite, SQL Server, or Oracle.',
    },
    {
      number: 3,
      title: 'Configure Options',
      description: 'Set table name, primary key options, and output mode (CREATE/INSERT/both).',
    },
    {
      number: 4,
      title: 'Copy or Download',
      description: 'Copy the generated SQL to clipboard or download as a .sql file.',
    },
  ] as HowToStep[],
  
  featuresSectionTitle: 'Features',
  
  educationalContent: [
    {
      title: 'SQL Dialect Differences',
      content: 'Different databases have different syntax. PostgreSQL uses SERIAL for auto-increment, MySQL uses AUTO_INCREMENT, and SQLite uses INTEGER PRIMARY KEY.',
      type: 'info' as const
    },
    {
      title: 'Type Inference',
      content: 'The converter automatically infers SQL types from JSON values: strings become VARCHAR, numbers become INT or DOUBLE, booleans become BOOLEAN, and objects become JSON/JSONB.',
      type: 'tip' as const
    },
    {
      title: 'Batch Inserts',
      content: 'For large datasets, batch inserts combine multiple rows into a single INSERT statement, which is more efficient than individual statements.',
      type: 'info' as const
    },
  ],
  
  useCases: [
    {
      title: 'Database Migration',
      description: 'Convert JSON exports to SQL for database migration projects.',
      icon: 'fas fa-exchange-alt',
    },
    {
      title: 'Data Import',
      description: 'Generate INSERT statements to import JSON data into your database.',
      icon: 'fas fa-upload',
    },
    {
      title: 'Schema Design',
      description: 'Quickly prototype database schemas from sample JSON data.',
      icon: 'fas fa-project-diagram',
    },
    {
      title: 'Testing',
      description: 'Create test fixtures and seed data from JSON for database testing.',
      icon: 'fas fa-vial',
    },
  ] as UseCase[],
  
  technicalSpecs: [
    { feature: 'Input Format', specification: 'JSON object or array of objects' },
    { feature: 'SQL Dialects', specification: 'PostgreSQL, MySQL, SQLite, SQL Server, Oracle' },
    { feature: 'Max Input Size', specification: '10 MB' },
    { feature: 'Type Inference', specification: 'Automatic from JSON values' },
    { feature: 'Batch Size', specification: 'Up to 1000 rows per INSERT' },
    { feature: 'Processing', specification: 'Client-side only' },
  ] as TechnicalSpec[],
  
  comparisonSectionTitle: 'Comparison',
  comparison: [
    { feature: 'Real-time conversion', ourTool: true, competitorA: true, competitorB: false },
    { feature: 'Multiple SQL dialects', ourTool: true, competitorA: false, competitorB: true },
    { feature: 'Batch INSERT support', ourTool: true, competitorA: false, competitorB: true },
    { feature: 'Type inference', ourTool: true, competitorA: true, competitorB: true },
    { feature: 'Primary key options', ourTool: true, competitorA: false, competitorB: false },
    { feature: 'No sign-up required', ourTool: true, competitorA: true, competitorB: false },
    { feature: '100% Client-side', ourTool: true, competitorA: false, competitorB: false },
  ] as ComparisonRow[],
  
  whyChooseSectionTitle: 'Why Choose Our Tool',
  whyChoose: [
    {
      title: 'Multi-Database Support',
      description: 'Generate SQL for PostgreSQL, MySQL, SQLite, SQL Server, and Oracle.',
      icon: 'fas fa-database',
    },
    {
      title: 'Smart Type Detection',
      description: 'Automatically infers appropriate SQL types from your JSON data.',
      icon: 'fas fa-magic',
    },
    {
      title: 'Flexible Output',
      description: 'Generate CREATE TABLE, INSERT statements, or both based on your needs.',
      icon: 'fas fa-sliders-h',
    },
  ],
  
  faqs: [
    {
      question: 'Which databases are supported?',
      answer: 'We support PostgreSQL, MySQL, SQLite, SQL Server, and Oracle. Each dialect generates appropriate syntax for that database.',
    },
    {
      question: 'Can I generate INSERT statements for multiple rows?',
      answer: 'Yes! Provide a JSON array of objects, and we\'ll generate INSERT statements for each row. Enable batch mode for efficient multi-row inserts.',
    },
    {
      question: 'How are types inferred?',
      answer: 'We analyze JSON values to determine SQL types: strings → VARCHAR, integers → INT, decimals → DOUBLE, booleans → BOOLEAN, objects/arrays → JSON.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. All processing happens in your browser. Your JSON data never leaves your device.',
    },
  ] as FAQItem[],
  
  relatedTools: [
    { title: 'JSON Formatter', description: 'Format and validate JSON', icon: 'fas fa-indent', link: '/json-formatter/' },
    { title: 'CSV to JSON', description: 'Convert CSV data to JSON', icon: 'fas fa-file-csv', link: '/csv-to-json/' },
    { title: 'JSON to YAML', description: 'Convert JSON to YAML format', icon: 'fas fa-exchange-alt', link: '/json-to-yaml/' },
    { title: 'JSON Diff', description: 'Compare JSON documents', icon: 'fas fa-code-compare', link: '/json-diff/' },
  ] as RelatedTool[],
};
