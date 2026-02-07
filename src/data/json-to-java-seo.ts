/**
 * SEO content for JSON to Java converter page
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

export const jsonToJavaContent = {
  title: 'JSON to Java Converter',
  subtitle: 'Convert JSON to Java POJO classes with Jackson, Gson, or Lombok annotations. Free online tool with instant conversion.',
  description: 'Free online JSON to Java converter. Generate Java POJO classes from JSON with support for Jackson, Gson, and Lombok annotations.',
  
  trustBadges: [
    { icon: 'fas fa-lock', text: '100% Secure' },
    { icon: 'fas fa-bolt', text: 'Instant Conversion' },
    { icon: 'fas fa-laptop-code', text: 'Browser-Based' },
  ] as TrustBadge[],
  
  features: [
    {
      icon: 'fas fa-coffee',
      title: 'Java POJO Generation',
      description: 'Generate clean Java classes with private fields, getters, setters, and constructors following JavaBean conventions.',
    },
    {
      icon: 'fas fa-tags',
      title: 'Multiple Annotation Styles',
      description: 'Support for Jackson, Gson, and Lombok annotations. Choose the library that fits your project.',
    },
    {
      icon: 'fas fa-sitemap',
      title: 'Nested Object Support',
      description: 'Automatically create inner classes or separate classes for nested JSON structures.',
    },
    {
      icon: 'fas fa-list',
      title: 'Collection Handling',
      description: 'Convert JSON arrays to List<T> or ArrayList<T> with proper generic types.',
    },
    {
      icon: 'fas fa-magic',
      title: 'Lombok Integration',
      description: 'Generate @Data, @Builder, @NoArgsConstructor, and more Lombok annotations.',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Privacy First',
      description: 'All processing happens in your browser. Your JSON data never leaves your device.',
    },
  ] as Feature[],
  
  howToSectionTitle: 'How to Convert JSON to Java',
  howToSteps: [
    {
      number: 1,
      title: 'Paste or Upload JSON',
      description: 'Enter your JSON data in the input panel or upload a .json file.',
    },
    {
      number: 2,
      title: 'Configure Options',
      description: 'Select annotation style (Jackson, Gson, Lombok), naming conventions, and other settings.',
    },
    {
      number: 3,
      title: 'Generate Java Code',
      description: 'Your Java POJO classes are generated instantly as you type.',
    },
    {
      number: 4,
      title: 'Copy or Download',
      description: 'Copy the generated Java code to clipboard or download as a .java file.',
    },
  ] as HowToStep[],
  
  featuresSectionTitle: 'Features',
  
  educationalContent: [
    {
      title: 'What is a POJO?',
      content: 'A Plain Old Java Object (POJO) is a simple Java class that contains private fields with public getters and setters. POJOs are used to model data and are the standard way to represent JSON objects in Java applications.',
      type: 'info' as const
    },
    {
      title: 'Jackson vs Gson',
      content: 'Jackson and Gson are the two most popular JSON libraries for Java. Jackson is more feature-rich and is the default in Spring Boot, while Gson is simpler and lightweight. Both use annotations to customize serialization.',
      type: 'tip' as const
    },
    {
      title: 'Why Use Lombok?',
      content: 'Lombok is a Java library that reduces boilerplate code. Instead of writing getters, setters, constructors, and other methods manually, Lombok generates them at compile time using annotations like @Data and @Builder.',
      type: 'info' as const
    },
  ],
  
  useCases: [
    {
      title: 'REST API Development',
      description: 'Generate model classes for REST API request and response bodies in Spring Boot applications.',
      icon: 'fas fa-server',
    },
    {
      title: 'Android Development',
      description: 'Create data classes for parsing JSON responses from APIs in Android apps.',
      icon: 'fas fa-mobile-alt',
    },
    {
      title: 'Configuration Files',
      description: 'Convert JSON configuration files to type-safe Java classes.',
      icon: 'fas fa-cog',
    },
    {
      title: 'Data Migration',
      description: 'Generate Java models from JSON schemas for data migration projects.',
      icon: 'fas fa-database',
    },
  ] as UseCase[],
  
  technicalSpecs: [
    { feature: 'Input Format', specification: 'JSON (RFC 8259)' },
    { feature: 'Output Format', specification: 'Java 8+ compatible' },
    { feature: 'Max Input Size', specification: '10 MB' },
    { feature: 'Annotation Support', specification: 'Jackson, Gson, Lombok' },
    { feature: 'Nested Depth', specification: 'Unlimited' },
    { feature: 'Processing', specification: 'Client-side only' },
  ] as TechnicalSpec[],
  
  comparisonSectionTitle: 'Comparison',
  comparison: [
    { feature: 'Real-time conversion', ourTool: true, competitorA: true, competitorB: false },
    { feature: 'Jackson annotations', ourTool: true, competitorA: true, competitorB: true },
    { feature: 'Gson annotations', ourTool: true, competitorA: true, competitorB: false },
    { feature: 'Lombok support', ourTool: true, competitorA: false, competitorB: false },
    { feature: 'Custom naming', ourTool: true, competitorA: false, competitorB: true },
    { feature: 'Nested class handling', ourTool: true, competitorA: true, competitorB: true },
    { feature: 'No sign-up required', ourTool: true, competitorA: true, competitorB: false },
    { feature: '100% Client-side', ourTool: true, competitorA: false, competitorB: false },
  ] as ComparisonRow[],
  
  whyChooseSectionTitle: 'Why Choose Our Tool',
  whyChoose: [
    {
      title: 'Production-Ready Code',
      description: 'Generate clean, well-formatted Java code ready for your project.',
      icon: 'fas fa-check-circle',
    },
    {
      title: 'Framework Support',
      description: 'Built-in support for Jackson, Gson, and Lombok annotations.',
      icon: 'fas fa-plug',
    },
    {
      title: 'Customizable Output',
      description: 'Control every aspect: naming, access modifiers, constructors, and more.',
      icon: 'fas fa-sliders-h',
    },
  ],
  
  faqs: [
    {
      question: 'What Java version is the output compatible with?',
      answer: 'The generated Java code is compatible with Java 8 and later versions. Some features like records require Java 14+.',
    },
    {
      question: 'Can I generate classes with Jackson annotations?',
      answer: 'Yes! Select "Jackson" from the annotation style dropdown to generate classes with @JsonProperty annotations.',
    },
    {
      question: 'Does it support nested JSON objects?',
      answer: 'Yes, nested JSON objects are automatically converted to inner classes or separate classes based on your settings.',
    },
    {
      question: 'Is my JSON data secure?',
      answer: 'Absolutely. All processing happens in your browser. Your JSON data never leaves your device.',
    },
    {
      question: 'Can I use this for commercial projects?',
      answer: 'Yes, the generated code is free to use for any purpose, including commercial projects.',
    },
  ] as FAQItem[],
  
  relatedTools: [
    { title: 'JSON to Go', description: 'Convert JSON to Go structs', icon: 'fas fa-code', link: '/json-to-go/' },
    { title: 'JSON to Swift', description: 'Convert JSON to Swift Codable', icon: 'fab fa-swift', link: '/json-to-swift/' },
    { title: 'JSON to Dart', description: 'Convert JSON to Dart classes', icon: 'fas fa-mobile-alt', link: '/json-to-dart/' },
    { title: 'JSON to C#', description: 'Convert JSON to C# classes', icon: 'fab fa-microsoft', link: '/json-to-csharp/' },
    { title: 'JSON Formatter', description: 'Format and validate JSON', icon: 'fas fa-indent', link: '/json-formatter/' },
  ] as RelatedTool[],
};
