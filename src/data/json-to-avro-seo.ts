/**
 * JSON to Avro SEO Data
 * SEO content for the Avro converter tool page
 */

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

export interface TechnicalSpec {
  feature: string;
  specification: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const jsonToAvroSEO = {
  title: 'JSON to Avro Converter Online Free - Generate Avro Schemas',
  description: 'Convert JSON to Apache Avro format instantly. Free online JSON to Avro converter with schema generation, logical type inference, and download as .avsc files.',
  keywords: [
    'json to avro',
    'avro schema generator',
    'json to avsc converter',
    'apache avro online',
    'convert json to avro',
    'avro schema from json',
    'json to avro online',
    'generate avro schema',
  ],
  
  heroTitle: 'JSON to Avro Converter',
  heroSubtitle: 'Generate Apache Avro schemas from JSON data with automatic type inference',
  
  howToSteps: [
    {
      number: 1,
      title: 'Paste JSON Data',
      description: 'Enter or paste your JSON object into the input editor. The tool accepts any valid JSON structure.',
    },
    {
      number: 2,
      title: 'Configure Options',
      description: 'Set namespace, record name, and enable logical type inference for dates, timestamps, and UUIDs.',
    },
    {
      number: 3,
      title: 'Generate Schema',
      description: 'Click generate to create your Avro schema with properly inferred types and nested records.',
    },
    {
      number: 4,
      title: 'Download Schema',
      description: 'Copy the generated schema or download it as a .avsc file for your data pipeline.',
    },
  ] as HowToStep[],
  
  educationalContent: [
    {
      title: 'What is Apache Avro?',
      content: 'Apache Avro is a data serialization system that provides rich data structures, a compact binary format, and integration with dynamic languages. It is widely used in big data ecosystems like Kafka, Spark, and Hadoop.',
      type: 'info',
    },
    {
      title: 'Logical Types',
      content: 'Avro supports logical types like date, timestamp-millis, and uuid that provide semantic meaning to primitive types. This converter automatically detects ISO dates, timestamps, and UUID strings.',
      type: 'tip',
    },
    {
      title: 'Schema Evolution',
      content: 'Avro schemas support forward and backward compatibility through schema evolution. Always include default values for optional fields to maintain compatibility.',
      type: 'info',
    },
  ] as EducationalSection[],
  
  technicalSpecs: [
    { feature: 'Schema Format', specification: 'Apache Avro 1.11+ compatible' },
    { feature: 'Logical Types', specification: 'date, timestamp-millis, uuid' },
    { feature: 'Nested Support', specification: 'Unlimited nesting depth' },
    { feature: 'Array Handling', specification: 'Converted to array type' },
    { feature: 'Processing', specification: '100% client-side' },
    { feature: 'File Export', specification: '.avsc file download' },
  ] as TechnicalSpec[],
  
  faq: [
    {
      question: 'Is this JSON to Avro converter free?',
      answer: 'Yes, completely free with no limitations. All processing happens in your browser.',
    },
    {
      question: 'Is my JSON data secure?',
      answer: 'Absolutely. All conversion happens locally in your browser. No data is sent to any server.',
    },
    {
      question: 'What is an .avsc file?',
      answer: 'An .avsc file contains an Avro schema definition in JSON format. It defines the structure of your Avro data.',
    },
    {
      question: 'How are null values handled?',
      answer: 'Null values are converted to union types [null, type] by default, making the field nullable with a null default.',
    },
    {
      question: 'Does it support Kafka Schema Registry?',
      answer: 'Yes, the generated schemas are compatible with Confluent Schema Registry and can be registered directly.',
    },
    {
      question: 'How are nested objects handled?',
      answer: 'Nested objects are converted to nested record types with automatically generated names based on the field path.',
    },
  ] as FAQItem[],
  
  useCases: [
    {
      title: 'Kafka Events',
      description: 'Generate Avro schemas for Kafka event streams with Schema Registry integration.',
      icon: 'fa-stream',
    },
    {
      title: 'Data Lakes',
      description: 'Create schemas for Parquet files in data lakes with proper type mappings.',
      icon: 'fa-database',
    },
    {
      title: 'Spark Processing',
      description: 'Generate schemas for Apache Spark DataFrame processing.',
      icon: 'fa-bolt',
    },
    {
      title: 'Data Pipelines',
      description: 'Define schemas for ETL pipelines with schema evolution support.',
      icon: 'fa-project-diagram',
    },
  ],
};
