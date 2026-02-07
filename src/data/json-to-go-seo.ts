/**
 * SEO content for JSON to Go converter
 */

import type { FeatureItem } from '@/types';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  number: number;
  title: string;
  description: string;
}

export interface TechnicalSpec {
  feature: string;
  specification: string;
}

export interface WhyChooseItem {
  title: string;
  description: string;
}

export interface UseCase {
  title: string;
  description: string;
  icon: string;
}

export interface ComparisonRow {
  feature: string;
  ourTool: string | boolean;
  competitorA: string | boolean;
  competitorB: string | boolean;
}

export interface RelatedTool {
  title: string;
  description: string;
  icon: string;
  link: string;
}

export const jsonToGoContent = {
  // Hero Section
  title: 'JSON to Go Struct Converter - Free Online Tool',
  subtitle: 'Convert JSON to Go structs instantly with our free online converter. Generate production-ready Go code with proper JSON tags, nested struct support, omitempty options, and intelligent type inference. 100% client-side processing ensures complete privacy. No signup required.',
  
  // Trust Badges
  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-bolt', text: 'Instant Convert' },
    { icon: 'fas fa-shield-alt', text: 'Client-Side' },
    { icon: 'fas fa-code', text: 'Go Ready' },
    { icon: 'fas fa-tags', text: 'JSON Tags' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
  ],
  
  // Section Titles
  howToSectionTitle: 'How to Convert JSON to Go Structs',
  featuresSectionTitle: 'JSON to Go Converter Features',
  whyChooseSectionTitle: 'Why Choose This JSON to Go Converter?',
  comparisonSectionTitle: 'JSON to Go Converter Comparison',
  
  // Key Features
  features: [
    {
      icon: 'fas fa-arrow-right',
      title: 'Instant JSON to Go Struct Conversion',
      description: 'Convert JSON to Go structs in real-time as you type. Our converter analyzes your JSON structure and generates properly formatted Go code with correct type mappings, field names, and JSON tags automatically.'
    },
    {
      icon: 'fas fa-tags',
      title: 'Comprehensive Tag Support',
      description: 'Generate Go structs with JSON tags by default, plus optional YAML, XML, and BSON tags for MongoDB. Include omitempty for optional fields and customize tag output to match your project requirements.'
    },
    {
      icon: 'fas fa-sitemap',
      title: 'Nested Struct Generation',
      description: 'Automatically detect and generate separate structs for nested JSON objects. Handle complex hierarchies with proper type references and maintain clean, organized Go code structure.'
    },
    {
      icon: 'fas fa-check-circle',
      title: 'Smart Type Inference',
      description: 'Intelligent type detection maps JSON types to appropriate Go types: strings to string, integers to int/int64, decimals to float64, booleans to bool, and arrays to slices with proper element types.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: '100% Client-Side Processing',
      description: 'All JSON to Go conversion happens in your browser. Your data never leaves your computer—no server uploads, no logging, no data retention. Perfect for sensitive API responses and private configurations.'
    },
    {
      icon: 'fas fa-sliders-h',
      title: 'Customizable Output Options',
      description: 'Configure pointer types for nullable fields, choose between int and int64, add comments, sort fields alphabetically, and select your preferred indentation style (tabs or spaces).'
    },
    {
      icon: 'fas fa-magic',
      title: 'One-Click Presets',
      description: 'Apply pre-configured settings for common use cases: API responses, MongoDB models, config files, and XML APIs. Each preset optimizes tags and options for specific scenarios.'
    },
    {
      icon: 'fas fa-copy',
      title: 'Easy Export Options',
      description: 'Copy generated Go code to clipboard with one click or download as a .go file. Syntax-highlighted output makes it easy to review before using in your project.'
    }
  ] as FeatureItem[],
  
  // How-to Steps
  howToSteps: [
    {
      number: 1,
      title: 'Paste Your JSON',
      description: 'Paste your JSON data into the input editor. You can also upload a .json file or load a sample template to get started quickly.'
    },
    {
      number: 2,
      title: 'Configure Options',
      description: 'Set your root struct name, choose which tags to include (JSON, YAML, XML, BSON), and enable options like omitempty or pointer types for nullable fields.'
    },
    {
      number: 3,
      title: 'Review Generated Code',
      description: 'The Go structs are generated instantly in the output panel. Review the generated code with syntax highlighting to ensure it matches your needs.'
    },
    {
      number: 4,
      title: 'Copy or Download',
      description: 'Click Copy to copy the Go code to your clipboard, or Download to save it as a .go file ready to use in your project.'
    }
  ] as HowToStep[],
  
  // Educational Content
  educationalContent: [
    {
      title: 'Understanding Go Struct Tags',
      content: 'Go struct tags are string annotations that provide metadata about struct fields. The json tag tells Go\'s encoding/json package how to map JSON keys to struct fields. For example, `json:"user_id"` maps the struct field to the JSON key "user_id". The omitempty option excludes fields with zero values from JSON output.',
      type: 'info' as const
    },
    {
      title: 'When to Use Pointer Types',
      content: 'Use pointer types (*string, *int) when you need to distinguish between a zero value and a missing field. For example, an integer field with value 0 might mean "zero" or "not provided". With a pointer, nil means "not provided" while *0 means the value is explicitly zero.',
      type: 'tip' as const
    },
    {
      title: 'Naming Conventions in Go',
      content: 'Go uses PascalCase for exported (public) identifiers. When converting JSON keys like "user_name" to Go field names, we convert to "UserName". The original JSON key is preserved in the struct tag for proper serialization/deserialization.',
      type: 'info' as const
    }
  ],
  
  // Use Cases
  useCases: [
    {
      title: 'REST API Integration',
      description: 'Convert API JSON responses to Go structs for type-safe API clients',
      icon: 'fas fa-cloud'
    },
    {
      title: 'Configuration Parsing',
      description: 'Generate structs for JSON/YAML config files in Go applications',
      icon: 'fas fa-cog'
    },
    {
      title: 'MongoDB Models',
      description: 'Create Go models with BSON tags for MongoDB document mapping',
      icon: 'fas fa-database'
    },
    {
      title: 'Microservices',
      description: 'Define data transfer objects for inter-service communication',
      icon: 'fas fa-network-wired'
    },
    {
      title: 'Testing & Mocking',
      description: 'Generate structs for test fixtures and mock data',
      icon: 'fas fa-vial'
    },
    {
      title: 'Data Transformation',
      description: 'Create intermediate structs for JSON data processing pipelines',
      icon: 'fas fa-exchange-alt'
    }
  ] as UseCase[],
  
  // Technical Specifications
  technicalSpecs: [
    { feature: 'Type Mapping', specification: 'string→string, int→int/int64, float→float64, bool→bool' },
    { feature: 'Array Support', specification: '[]Type with element type inference' },
    { feature: 'Nested Objects', specification: 'Automatic separate struct generation' },
    { feature: 'Tag Types', specification: 'JSON, YAML, XML, BSON' },
    { feature: 'Nullable Fields', specification: 'Optional pointer type generation' },
    { feature: 'Max JSON Size', specification: 'Up to 10MB (browser dependent)' },
    { feature: 'Processing', specification: '100% client-side JavaScript' },
    { feature: 'Output Format', specification: 'Go 1.x compatible syntax' }
  ] as TechnicalSpec[],
  
  // Comparison Table
  comparison: [
    { feature: 'JSON to Go Conversion', ourTool: true, competitorA: true, competitorB: true },
    { feature: 'Nested Struct Support', ourTool: true, competitorA: true, competitorB: true },
    { feature: 'JSON Tags', ourTool: true, competitorA: true, competitorB: true },
    { feature: 'omitempty Option', ourTool: true, competitorA: false, competitorB: true },
    { feature: 'Pointer Types', ourTool: true, competitorA: false, competitorB: true },
    { feature: 'YAML/XML/BSON Tags', ourTool: true, competitorA: false, competitorB: false },
    { feature: 'One-Click Presets', ourTool: true, competitorA: false, competitorB: false },
    { feature: 'Sample Templates', ourTool: true, competitorA: false, competitorB: false },
    { feature: '100% Client-Side', ourTool: true, competitorA: true, competitorB: false },
    { feature: 'File Upload', ourTool: true, competitorA: false, competitorB: true },
    { feature: 'Dark Mode', ourTool: true, competitorA: false, competitorB: true }
  ] as ComparisonRow[],
  
  // FAQs
  faqs: [
    {
      question: 'How do I convert JSON to Go structs?',
      answer: 'Simply paste your JSON into the input editor, and the Go structs are generated automatically in real-time. You can customize the root struct name, enable/disable tags, and configure other options in the settings panel.'
    },
    {
      question: 'What Go types are generated from JSON?',
      answer: 'JSON strings map to Go string, integers to int (or int64 with option), decimals to float64, booleans to bool, arrays to slices, and nested objects to separate structs. Null values can optionally use pointer types.'
    },
    {
      question: 'Can I add YAML or XML tags alongside JSON tags?',
      answer: 'Yes! Enable YAML, XML, or BSON tags in the settings to generate structs with multiple tag types. This is useful for applications that need to serialize to different formats.'
    },
    {
      question: 'What does omitempty do in JSON tags?',
      answer: 'The omitempty option tells Go\'s JSON encoder to omit fields with zero values (empty strings, 0, false, nil) from the output. Enable this option for optional fields that shouldn\'t appear when empty.'
    },
    {
      question: 'Is my JSON data secure?',
      answer: 'Absolutely. All conversion happens locally in your browser using JavaScript. Your JSON data never leaves your computer—no server uploads, no data logging, complete privacy.'
    },
    {
      question: 'How are nested JSON objects handled?',
      answer: 'Nested objects are automatically converted to separate Go structs. The parent struct references the nested struct by type name, maintaining a clean and organized code structure.'
    },
    {
      question: 'Can I use pointer types for nullable fields?',
      answer: 'Yes, enable the "Use pointer for nullable" option to generate pointer types (*string, *int, etc.) for fields that can be null. This helps distinguish between zero values and missing fields.'
    },
    {
      question: 'What presets are available?',
      answer: 'We offer presets for common scenarios: Default (standard JSON tags), API Response (with omitempty and pointers), MongoDB (with BSON tags), Config File (JSON + YAML), XML API, and Minimal (no tags).'
    }
  ] as FAQItem[],
  
  // Why Choose Items
  whyChoose: [
    {
      title: 'Production-Ready Output',
      description: 'Generate clean, properly formatted Go code that follows Go conventions and compiles without modification.'
    },
    {
      title: 'Privacy-First Approach',
      description: 'All processing happens in your browser. Your sensitive API responses and configurations stay completely private.'
    },
    {
      title: 'Developer-Friendly',
      description: 'Intuitive interface with real-time conversion, syntax highlighting, and easy copy/download options.'
    },
    {
      title: 'Flexible Configuration',
      description: 'Customize every aspect of the generated code, from tag types to field naming and pointer usage.'
    }
  ] as WhyChooseItem[],
  
  // Related Tools
  relatedTools: [
    {
      title: 'JSON to YAML',
      description: 'Convert JSON to YAML format',
      icon: 'fas fa-file-code',
      link: '/json-to-yaml'
    },
    {
      title: 'JSON Formatter',
      description: 'Format and beautify JSON',
      icon: 'fas fa-indent',
      link: '/json-formatter'
    },
    {
      title: 'JSON Validator',
      description: 'Validate JSON syntax',
      icon: 'fas fa-check-circle',
      link: '/json-validator'
    },
    {
      title: 'JSON to OpenAPI',
      description: 'Generate OpenAPI specs from JSON',
      icon: 'fas fa-file-invoice',
      link: '/json-to-openapi'
    }
  ] as RelatedTool[]
};
