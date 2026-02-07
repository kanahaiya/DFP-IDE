/**
 * SEO content for JSON to Python converter page
 */

import type { FAQItem, HowToStep } from './json-to-openapi-seo';

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

export interface TechnicalSpec {
  feature: string;
  specification: string;
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

export const jsonToPythonContent = {
  title: 'JSON to Python Converter',
  subtitle: 'Convert JSON to Python dataclasses, Pydantic models, TypedDict, and more. Free online tool with type hints.',
  description: 'Free online JSON to Python converter. Generate Python dataclasses, Pydantic models, and TypedDict from JSON with full type annotations.',
  
  trustBadges: [
    { icon: 'fas fa-lock', text: '100% Secure' },
    { icon: 'fas fa-bolt', text: 'Instant Conversion' },
    { icon: 'fas fa-laptop-code', text: 'Browser-Based' },
  ] as TrustBadge[],
  
  features: [
    {
      icon: 'fab fa-python',
      title: 'Multiple Output Formats',
      description: 'Generate dataclasses, Pydantic models, TypedDict, attrs, or plain dictionaries.',
    },
    {
      icon: 'fas fa-tags',
      title: 'Full Type Hints',
      description: 'Complete Python type annotations for better IDE support and type checking.',
    },
    {
      icon: 'fas fa-check-double',
      title: 'Pydantic Validation',
      description: 'Generate Pydantic v1 or v2 models with built-in data validation.',
    },
    {
      icon: 'fas fa-sitemap',
      title: 'Nested Object Support',
      description: 'Automatically create nested classes for complex JSON structures.',
    },
    {
      icon: 'fas fa-exchange-alt',
      title: 'Snake Case Conversion',
      description: 'Automatically convert camelCase JSON keys to snake_case Python style.',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Privacy First',
      description: 'All processing happens in your browser. Your JSON data never leaves your device.',
    },
  ] as Feature[],
  
  howToSectionTitle: 'How to Convert JSON to Python',
  howToSteps: [
    {
      number: 1,
      title: 'Paste or Upload JSON',
      description: 'Enter your JSON data in the input panel or upload a .json file.',
    },
    {
      number: 2,
      title: 'Select Output Format',
      description: 'Choose dataclass, Pydantic, TypedDict, or another output format.',
    },
    {
      number: 3,
      title: 'Configure Options',
      description: 'Enable type hints, snake_case conversion, and other settings.',
    },
    {
      number: 4,
      title: 'Copy or Download',
      description: 'Copy the generated Python code to clipboard or download as a .py file.',
    },
  ] as HowToStep[],
  
  featuresSectionTitle: 'Features',
  
  educationalContent: [
    {
      title: 'Python Dataclasses',
      content: 'Dataclasses (Python 3.7+) provide a decorator and functions to automatically add generated special methods to classes. They are ideal for creating data containers with minimal boilerplate.',
      type: 'info' as const
    },
    {
      title: 'Pydantic Models',
      content: 'Pydantic is a data validation library that uses Python type annotations. It validates input data, provides automatic serialization, and integrates well with FastAPI and other frameworks.',
      type: 'tip' as const
    },
    {
      title: 'TypedDict',
      content: 'TypedDict allows you to create dictionary types with specific key-value type annotations. It is useful when you need dictionary syntax but want type checking support.',
      type: 'info' as const
    },
  ],
  
  useCases: [
    {
      title: 'FastAPI Development',
      description: 'Generate Pydantic models for FastAPI request/response validation.',
      icon: 'fas fa-server',
    },
    {
      title: 'Data Science',
      description: 'Create typed data structures for data processing and analysis pipelines.',
      icon: 'fas fa-chart-line',
    },
    {
      title: 'API Integration',
      description: 'Generate Python classes from API JSON responses for better code completion.',
      icon: 'fas fa-plug',
    },
    {
      title: 'Configuration Files',
      description: 'Convert JSON configuration files to validated Pydantic settings classes.',
      icon: 'fas fa-cog',
    },
  ] as UseCase[],
  
  technicalSpecs: [
    { feature: 'Input Format', specification: 'JSON (RFC 8259)' },
    { feature: 'Output Format', specification: 'Python 3.7+ compatible' },
    { feature: 'Max Input Size', specification: '10 MB' },
    { feature: 'Output Types', specification: 'dataclass, Pydantic, TypedDict, attrs' },
    { feature: 'Nested Depth', specification: 'Unlimited' },
    { feature: 'Processing', specification: 'Client-side only' },
  ] as TechnicalSpec[],
  
  comparisonSectionTitle: 'Comparison',
  comparison: [
    { feature: 'Real-time conversion', ourTool: true, competitorA: true, competitorB: false },
    { feature: 'Dataclass output', ourTool: true, competitorA: true, competitorB: true },
    { feature: 'Pydantic v2 support', ourTool: true, competitorA: false, competitorB: false },
    { feature: 'TypedDict output', ourTool: true, competitorA: false, competitorB: true },
    { feature: 'Type hints', ourTool: true, competitorA: true, competitorB: true },
    { feature: 'Snake case conversion', ourTool: true, competitorA: true, competitorB: true },
    { feature: 'No sign-up required', ourTool: true, competitorA: true, competitorB: false },
    { feature: '100% Client-side', ourTool: true, competitorA: false, competitorB: false },
  ] as ComparisonRow[],
  
  whyChooseSectionTitle: 'Why Choose Our Tool',
  whyChoose: [
    {
      title: 'Multiple Formats',
      description: 'Generate dataclasses, Pydantic, TypedDict, attrs, or plain dictionaries.',
      icon: 'fas fa-layer-group',
    },
    {
      title: 'Modern Python',
      description: 'Full support for Python 3.10+ features like union syntax and slots.',
      icon: 'fas fa-rocket',
    },
    {
      title: 'Type Safety',
      description: 'Complete type annotations for better IDE support and mypy compatibility.',
      icon: 'fas fa-shield-alt',
    },
  ],
  
  faqs: [
    {
      question: 'Which Python version is the output compatible with?',
      answer: 'The generated code is compatible with Python 3.7+. Some features like slots in dataclasses require Python 3.10+.',
    },
    {
      question: 'Should I use dataclass or Pydantic?',
      answer: 'Use dataclass for simple data containers. Use Pydantic when you need data validation, serialization, or are building FastAPI applications.',
    },
    {
      question: 'Does it support nested JSON objects?',
      answer: 'Yes, nested JSON objects are automatically converted to nested Python classes with proper type annotations.',
    },
    {
      question: 'Is my JSON data secure?',
      answer: 'Absolutely. All processing happens in your browser. Your JSON data never leaves your device.',
    },
    {
      question: 'Can I use Pydantic v2 features?',
      answer: 'Yes! Select Pydantic v2 from the presets to generate code compatible with the latest Pydantic version.',
    },
  ] as FAQItem[],
  
  relatedTools: [
    { title: 'JSON to Java', description: 'Convert JSON to Java POJOs', icon: 'fab fa-java', link: '/json-to-java/' },
    { title: 'JSON to C#', description: 'Convert JSON to C# classes', icon: 'fab fa-microsoft', link: '/json-to-csharp/' },
    { title: 'JSON to Go', description: 'Convert JSON to Go structs', icon: 'fas fa-code', link: '/json-to-go/' },
    { title: 'JSON to Swift', description: 'Convert JSON to Swift Codable', icon: 'fab fa-swift', link: '/json-to-swift/' },
    { title: 'JSON Formatter', description: 'Format and validate JSON', icon: 'fas fa-indent', link: '/json-formatter/' },
  ] as RelatedTool[],
};
