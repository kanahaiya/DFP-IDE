/**
 * SEO content for JSON to C# converter page
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

export const jsonToCSharpContent = {
  title: 'JSON to C# Converter',
  subtitle: 'Convert JSON to C# classes with Newtonsoft.Json or System.Text.Json attributes. Free online tool with modern C# support.',
  description: 'Free online JSON to C# converter. Generate strongly-typed C# classes from JSON with support for Newtonsoft.Json and System.Text.Json.',
  
  trustBadges: [
    { icon: 'fas fa-lock', text: '100% Secure' },
    { icon: 'fas fa-bolt', text: 'Instant Conversion' },
    { icon: 'fas fa-laptop-code', text: 'Browser-Based' },
  ] as TrustBadge[],
  
  features: [
    {
      icon: 'fas fa-code',
      title: 'Modern C# Support',
      description: 'Generate classes using modern C# features like records, init-only setters, and nullable reference types.',
    },
    {
      icon: 'fas fa-tags',
      title: 'Serialization Attributes',
      description: 'Support for Newtonsoft.Json and System.Text.Json attributes with proper property mapping.',
    },
    {
      icon: 'fas fa-sitemap',
      title: 'Nested Class Generation',
      description: 'Automatically create nested classes for complex JSON structures with proper type hierarchies.',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Nullable Reference Types',
      description: 'Full support for C# nullable reference types for better null safety.',
    },
    {
      icon: 'fas fa-cube',
      title: 'Record Types',
      description: 'Generate C# 9+ record types with primary constructors for immutable data models.',
    },
    {
      icon: 'fas fa-user-shield',
      title: 'Privacy First',
      description: 'All processing happens in your browser. Your JSON data never leaves your device.',
    },
  ] as Feature[],
  
  howToSectionTitle: 'How to Convert JSON to C#',
  howToSteps: [
    {
      number: 1,
      title: 'Paste or Upload JSON',
      description: 'Enter your JSON data in the input panel or upload a .json file.',
    },
    {
      number: 2,
      title: 'Configure Options',
      description: 'Select serialization library, naming conventions, and C# features to use.',
    },
    {
      number: 3,
      title: 'Generate C# Code',
      description: 'Your C# classes are generated instantly as you type.',
    },
    {
      number: 4,
      title: 'Copy or Download',
      description: 'Copy the generated C# code to clipboard or download as a .cs file.',
    },
  ] as HowToStep[],
  
  featuresSectionTitle: 'Features',
  
  educationalContent: [
    {
      title: 'Newtonsoft.Json vs System.Text.Json',
      content: 'Newtonsoft.Json (Json.NET) is the most popular JSON library with extensive features. System.Text.Json is the built-in .NET JSON library offering better performance for modern .NET applications.',
      type: 'info' as const
    },
    {
      title: 'C# Records',
      content: 'Records in C# 9+ provide a concise syntax for creating immutable reference types. They automatically implement equality, hashing, and provide with-expressions for creating modified copies.',
      type: 'tip' as const
    },
    {
      title: 'Nullable Reference Types',
      content: 'C# 8+ nullable reference types help prevent null reference exceptions by distinguishing between nullable and non-nullable reference types at compile time.',
      type: 'info' as const
    },
  ],
  
  useCases: [
    {
      title: 'ASP.NET Core APIs',
      description: 'Generate model classes for REST API request and response bodies in ASP.NET Core applications.',
      icon: 'fas fa-server',
    },
    {
      title: '.NET MAUI Apps',
      description: 'Create data classes for parsing JSON responses from APIs in cross-platform .NET applications.',
      icon: 'fas fa-mobile-alt',
    },
    {
      title: 'Configuration Binding',
      description: 'Convert JSON configuration files to strongly-typed C# options classes.',
      icon: 'fas fa-cog',
    },
    {
      title: 'Azure Functions',
      description: 'Generate input/output binding types for serverless Azure Functions.',
      icon: 'fas fa-cloud',
    },
  ] as UseCase[],
  
  technicalSpecs: [
    { feature: 'Input Format', specification: 'JSON (RFC 8259)' },
    { feature: 'Output Format', specification: 'C# 8+ compatible' },
    { feature: 'Max Input Size', specification: '10 MB' },
    { feature: 'Serializer Support', specification: 'Newtonsoft.Json, System.Text.Json' },
    { feature: 'Nested Depth', specification: 'Unlimited' },
    { feature: 'Processing', specification: 'Client-side only' },
  ] as TechnicalSpec[],
  
  comparisonSectionTitle: 'Comparison',
  comparison: [
    { feature: 'Real-time conversion', ourTool: true, competitorA: true, competitorB: false },
    { feature: 'C# record support', ourTool: true, competitorA: false, competitorB: false },
    { feature: 'Nullable reference types', ourTool: true, competitorA: false, competitorB: true },
    { feature: 'System.Text.Json support', ourTool: true, competitorA: true, competitorB: false },
    { feature: 'Newtonsoft.Json support', ourTool: true, competitorA: true, competitorB: true },
    { feature: 'Custom namespaces', ourTool: true, competitorA: true, competitorB: true },
    { feature: 'No sign-up required', ourTool: true, competitorA: true, competitorB: false },
    { feature: '100% Client-side', ourTool: true, competitorA: false, competitorB: false },
  ] as ComparisonRow[],
  
  whyChooseSectionTitle: 'Why Choose Our Tool',
  whyChoose: [
    {
      title: 'Modern .NET Ready',
      description: 'Generate code compatible with .NET 6, 7, 8+ and modern C# features.',
      icon: 'fas fa-check-circle',
    },
    {
      title: 'Serializer Flexibility',
      description: 'Choose between Newtonsoft.Json and System.Text.Json based on your needs.',
      icon: 'fas fa-exchange-alt',
    },
    {
      title: 'Type Safety',
      description: 'Generate strongly-typed classes with nullable reference types for better code quality.',
      icon: 'fas fa-shield-alt',
    },
  ],
  
  faqs: [
    {
      question: 'Which .NET version is the output compatible with?',
      answer: 'The generated code is compatible with .NET Core 3.1+ and .NET 5+. Some features like records require .NET 5+ and nullable reference types require C# 8+.',
    },
    {
      question: 'Should I use Newtonsoft.Json or System.Text.Json?',
      answer: 'System.Text.Json is recommended for new projects as it is built into .NET and offers better performance. Use Newtonsoft.Json for legacy projects or when you need its advanced features.',
    },
    {
      question: 'Does it support nested JSON objects?',
      answer: 'Yes, nested JSON objects are automatically converted to nested C# classes with proper type references.',
    },
    {
      question: 'Is my JSON data secure?',
      answer: 'Absolutely. All processing happens in your browser. Your JSON data never leaves your device.',
    },
    {
      question: 'Can I generate C# records instead of classes?',
      answer: 'Yes! Enable the "Use Records" option to generate C# 9+ record types with primary constructors.',
    },
  ] as FAQItem[],
  
  relatedTools: [
    { title: 'JSON to Java', description: 'Convert JSON to Java POJOs', icon: 'fab fa-java', link: '/json-to-java/' },
    { title: 'JSON to Go', description: 'Convert JSON to Go structs', icon: 'fas fa-code', link: '/json-to-go/' },
    { title: 'JSON to Swift', description: 'Convert JSON to Swift Codable', icon: 'fab fa-swift', link: '/json-to-swift/' },
    { title: 'JSON to Python', description: 'Convert JSON to Python classes', icon: 'fab fa-python', link: '/json-to-python/' },
    { title: 'JSON Formatter', description: 'Format and validate JSON', icon: 'fas fa-indent', link: '/json-formatter/' },
  ] as RelatedTool[],
};
