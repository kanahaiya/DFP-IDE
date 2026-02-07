/**
 * SEO content for JSON to Crystal converter page
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

export const jsonToCrystalContent = {
  title: 'JSON to Crystal Converter',
  subtitle: 'Convert JSON to Crystal classes with JSON::Serializable support. Free online tool with instant conversion.',
  description: 'Free online JSON to Crystal converter. Generate Crystal classes from JSON with support for JSON::Serializable macros.',
  
  trustBadges: [
    { icon: 'fas fa-lock', text: '100% Secure' },
    { icon: 'fas fa-bolt', text: 'Instant Conversion' },
    { icon: 'fas fa-laptop-code', text: 'Browser-Based' },
  ] as TrustBadge[],
  
  features: [
    {
      icon: 'fas fa-gem',
      title: 'JSON::Serializable',
      description: 'Generate Crystal classes with JSON::Serializable macro for automatic serialization.',
    },
    {
      icon: 'fas fa-code',
      title: 'Class or Struct',
      description: 'Choose between class and struct output types based on your needs.',
    },
    {
      icon: 'fas fa-sync',
      title: 'Real-time Conversion',
      description: 'See your Crystal code update instantly as you type or paste JSON.',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Privacy First',
      description: 'All processing happens in your browser. Your JSON data never leaves your device.',
    },
  ] as Feature[],
  
  howToSectionTitle: 'How to Convert JSON to Crystal',
  howToSteps: [
    {
      number: 1,
      title: 'Paste or Upload JSON',
      description: 'Enter your JSON data in the input panel or upload a .json file.',
    },
    {
      number: 2,
      title: 'Configure Options',
      description: 'Choose output type (class/struct), JSON::Serializable options, and naming conventions.',
    },
    {
      number: 3,
      title: 'Generate Crystal Code',
      description: 'Your Crystal classes are generated instantly as you type.',
    },
    {
      number: 4,
      title: 'Copy or Download',
      description: 'Copy the generated Crystal code to clipboard or download as a .cr file.',
    },
  ] as HowToStep[],
  
  featuresSectionTitle: 'Features',
  
  educationalContent: [
    {
      title: 'JSON::Serializable in Crystal',
      content: 'The JSON::Serializable module provides macros for automatic JSON serialization and deserialization. Include it in your class to enable parsing and generating JSON with type safety.',
      type: 'info' as const
    },
    {
      title: 'Class vs Struct',
      content: 'In Crystal, classes are reference types while structs are value types. Use structs for small, immutable data and classes for larger objects with identity semantics.',
      type: 'tip' as const
    },
    {
      title: 'Nilable Types',
      content: 'Crystal has strict null safety. Use Type? (nilable) when a field might be missing from JSON input. Non-nilable types require the field to always be present.',
      type: 'info' as const
    },
  ],
  
  useCases: [
    {
      title: 'API Client Development',
      description: 'Generate Crystal models for REST API responses in web applications.',
      icon: 'fas fa-cloud',
    },
    {
      title: 'Lucky Framework',
      description: 'Create data models for Lucky web framework applications.',
      icon: 'fas fa-clover',
    },
    {
      title: 'CLI Tools',
      description: 'Parse configuration files and API responses in Crystal CLI applications.',
      icon: 'fas fa-terminal',
    },
    {
      title: 'Kemal Web Apps',
      description: 'Generate request/response types for Kemal web applications.',
      icon: 'fas fa-server',
    },
  ] as UseCase[],
  
  technicalSpecs: [
    { feature: 'Input Format', specification: 'JSON (RFC 8259)' },
    { feature: 'Output Format', specification: 'Crystal 1.x compatible' },
    { feature: 'Max Input Size', specification: '10 MB' },
    { feature: 'Serialization', specification: 'JSON::Serializable' },
    { feature: 'Nested Depth', specification: 'Unlimited' },
    { feature: 'Processing', specification: 'Client-side only' },
  ] as TechnicalSpec[],
  
  comparisonSectionTitle: 'Comparison',
  comparison: [
    { feature: 'Real-time conversion', ourTool: true, competitorA: false, competitorB: false },
    { feature: 'JSON::Serializable support', ourTool: true, competitorA: false, competitorB: true },
    { feature: 'Struct output', ourTool: true, competitorA: false, competitorB: false },
    { feature: 'Nilable type inference', ourTool: true, competitorA: true, competitorB: true },
    { feature: 'Nested object support', ourTool: true, competitorA: true, competitorB: true },
    { feature: 'No sign-up required', ourTool: true, competitorA: true, competitorB: false },
    { feature: '100% Client-side', ourTool: true, competitorA: false, competitorB: false },
  ] as ComparisonRow[],
  
  whyChooseSectionTitle: 'Why Choose Our Tool',
  whyChoose: [
    {
      title: 'Crystal-Native Output',
      description: 'Generate idiomatic Crystal code with proper type annotations and macros.',
      icon: 'fas fa-gem',
    },
    {
      title: 'JSON::Serializable Ready',
      description: 'Output is ready to use with Crystal\'s built-in JSON serialization.',
      icon: 'fas fa-check-circle',
    },
    {
      title: 'Type Safety',
      description: 'Proper handling of nilable and non-nilable types for Crystal\'s strict type system.',
      icon: 'fas fa-shield-alt',
    },
  ],
  
  faqs: [
    {
      question: 'What Crystal version is the output compatible with?',
      answer: 'The generated code is compatible with Crystal 1.0 and later versions.',
    },
    {
      question: 'Does it support JSON::Serializable macros?',
      answer: 'Yes! The converter generates classes with the JSON::Serializable include directive for automatic serialization.',
    },
    {
      question: 'Can I generate structs instead of classes?',
      answer: 'Yes, you can choose between class and struct output types in the settings.',
    },
    {
      question: 'Is my JSON data secure?',
      answer: 'Absolutely. All processing happens in your browser. Your JSON data never leaves your device.',
    },
  ] as FAQItem[],
  
  relatedTools: [
    { title: 'JSON to Go', description: 'Convert JSON to Go structs', icon: 'fas fa-code', link: '/json-to-go/' },
    { title: 'JSON to Swift', description: 'Convert JSON to Swift Codable', icon: 'fab fa-swift', link: '/json-to-swift/' },
    { title: 'JSON to Dart', description: 'Convert JSON to Dart classes', icon: 'fas fa-mobile-alt', link: '/json-to-dart/' },
    { title: 'JSON Formatter', description: 'Format and validate JSON', icon: 'fas fa-indent', link: '/json-formatter/' },
  ] as RelatedTool[],
};
