/**
 * JSON to Protobuf SEO Data
 * SEO content for the Protobuf converter tool page
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

export const jsonToProtobufSEO = {
  title: 'JSON to Protobuf Converter Online Free - Generate .proto Files',
  description: 'Convert JSON to Protocol Buffer schemas instantly. Free online JSON to Protobuf converter with proto2/proto3 support. Generate .proto files from JSON data structures.',
  keywords: [
    'json to protobuf',
    'json to proto converter',
    'protobuf schema generator',
    'convert json to proto',
    'protocol buffers online',
    'json to proto3',
    'generate proto from json',
    'protobuf online tool',
  ],
  
  heroTitle: 'JSON to Protobuf Converter',
  heroSubtitle: 'Generate Protocol Buffer schemas from JSON data instantly',
  
  howToSteps: [
    {
      number: 1,
      title: 'Paste JSON Data',
      description: 'Enter or paste your JSON object into the input editor. The tool accepts any valid JSON structure.',
    },
    {
      number: 2,
      title: 'Configure Options',
      description: 'Select proto2 or proto3 syntax, set package name, and customize field naming conventions.',
    },
    {
      number: 3,
      title: 'Generate Schema',
      description: 'Click generate to create your .proto schema with properly inferred types and field numbers.',
    },
    {
      number: 4,
      title: 'Download Proto File',
      description: 'Copy the generated schema or download it as a .proto file for your project.',
    },
  ] as HowToStep[],
  
  educationalContent: [
    {
      title: 'What is Protocol Buffers?',
      content: 'Protocol Buffers (Protobuf) is a language-neutral, platform-neutral extensible mechanism for serializing structured data, developed by Google. It is smaller, faster, and simpler than XML and JSON for data serialization.',
      type: 'info',
    },
    {
      title: 'Proto2 vs Proto3',
      content: 'Proto3 is the latest version with simplified syntax - all fields are optional by default, and required fields are removed. Proto2 is still used for legacy systems and offers more explicit control over field requirements.',
      type: 'tip',
    },
    {
      title: 'Type Inference',
      content: 'The converter automatically infers Protobuf types from JSON values: strings become string, integers become int32/int64, floats become double, booleans become bool, and nested objects become nested messages.',
      type: 'info',
    },
  ] as EducationalSection[],
  
  technicalSpecs: [
    { feature: 'Supported Syntax', specification: 'Proto2, Proto3' },
    { feature: 'Type Inference', specification: 'Automatic from JSON values' },
    { feature: 'Nested Support', specification: 'Unlimited nesting depth' },
    { feature: 'Array Handling', specification: 'Converted to repeated fields' },
    { feature: 'Processing', specification: '100% client-side' },
    { feature: 'File Export', specification: '.proto file download' },
  ] as TechnicalSpec[],
  
  faq: [
    {
      question: 'Is this JSON to Protobuf converter free?',
      answer: 'Yes, completely free with no limitations. All processing happens in your browser.',
    },
    {
      question: 'Is my JSON data secure?',
      answer: 'Absolutely. All conversion happens locally in your browser. No data is sent to any server.',
    },
    {
      question: 'What Protobuf syntax versions are supported?',
      answer: 'Both proto2 and proto3 syntax are supported. Proto3 is recommended for new projects.',
    },
    {
      question: 'How are JSON arrays converted?',
      answer: 'JSON arrays are converted to repeated fields in Protobuf. For arrays of objects, nested message types are generated.',
    },
    {
      question: 'Can I customize field numbers?',
      answer: 'Field numbers are automatically assigned starting from 1. The generated schema can be manually edited for custom numbering.',
    },
    {
      question: 'How are null values handled?',
      answer: 'Null values are converted to optional fields in proto3. The default type string is used when type cannot be inferred.',
    },
  ] as FAQItem[],
  
  useCases: [
    {
      title: 'API Development',
      description: 'Generate Protobuf schemas from JSON API responses for gRPC service definitions.',
      icon: 'fa-server',
    },
    {
      title: 'Data Serialization',
      description: 'Convert JSON data models to efficient Protobuf format for storage and transmission.',
      icon: 'fa-database',
    },
    {
      title: 'Microservices',
      description: 'Create shared message definitions for inter-service communication.',
      icon: 'fa-network-wired',
    },
    {
      title: 'Mobile Development',
      description: 'Generate efficient data schemas for mobile apps using Protocol Buffers.',
      icon: 'fa-mobile-alt',
    },
  ],
};
