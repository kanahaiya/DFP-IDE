/**
 * SEO content for JSON to Objective-C converter page
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

export const jsonToObjCContent = {
  title: 'JSON to Objective-C Converter',
  subtitle: 'Convert JSON to Objective-C classes with NSCoding support. Free online tool for iOS and macOS development.',
  description: 'Free online JSON to Objective-C converter. Generate Objective-C model classes from JSON with init and dictionary methods.',
  
  trustBadges: [
    { icon: 'fas fa-lock', text: '100% Secure' },
    { icon: 'fas fa-bolt', text: 'Instant Conversion' },
    { icon: 'fas fa-laptop-code', text: 'Browser-Based' },
  ] as TrustBadge[],
  
  features: [
    {
      icon: 'fab fa-apple',
      title: 'iOS/macOS Ready',
      description: 'Generate Objective-C classes compatible with iOS and macOS development.',
    },
    {
      icon: 'fas fa-code',
      title: 'Header & Implementation',
      description: 'Output both .h header and .m implementation files.',
    },
    {
      icon: 'fas fa-archive',
      title: 'NSCoding Support',
      description: 'Optional NSCoding/NSSecureCoding conformance for archiving.',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Privacy First',
      description: 'All processing happens in your browser. Your JSON data never leaves your device.',
    },
  ] as Feature[],
  
  howToSectionTitle: 'How to Convert JSON to Objective-C',
  howToSteps: [
    {
      number: 1,
      title: 'Paste or Upload JSON',
      description: 'Enter your JSON data in the input panel or upload a .json file.',
    },
    {
      number: 2,
      title: 'Configure Options',
      description: 'Set class prefix, protocol conformance, and method generation options.',
    },
    {
      number: 3,
      title: 'Generate Objective-C Code',
      description: 'Your Objective-C classes are generated instantly as you type.',
    },
    {
      number: 4,
      title: 'Copy or Download',
      description: 'Copy header and implementation code or download as files.',
    },
  ] as HowToStep[],
  
  featuresSectionTitle: 'Features',
  
  educationalContent: [
    {
      title: 'ARC vs MRC',
      content: 'ARC (Automatic Reference Counting) is the modern memory management approach. MRC (Manual Reference Counting) is for legacy projects. Our converter supports both.',
      type: 'info' as const
    },
    {
      title: 'Nullability Annotations',
      content: 'Modern Objective-C supports nullability annotations (nullable, nonnull) which help Swift interoperability and catch null pointer issues at compile time.',
      type: 'tip' as const
    },
    {
      title: 'NSCoding Protocol',
      content: 'NSCoding allows objects to be encoded and decoded for archiving. NSSecureCoding adds security by requiring class type verification during decoding.',
      type: 'info' as const
    },
  ],
  
  useCases: [
    {
      title: 'Legacy iOS Apps',
      description: 'Generate model classes for existing Objective-C iOS applications.',
      icon: 'fab fa-apple',
    },
    {
      title: 'Mixed Swift/ObjC',
      description: 'Create Objective-C models for use in mixed-language projects.',
      icon: 'fas fa-code-branch',
    },
    {
      title: 'macOS Development',
      description: 'Generate models for macOS Cocoa applications.',
      icon: 'fas fa-desktop',
    },
    {
      title: 'Framework Development',
      description: 'Create public Objective-C interfaces for framework development.',
      icon: 'fas fa-cubes',
    },
  ] as UseCase[],
  
  technicalSpecs: [
    { feature: 'Input Format', specification: 'JSON (RFC 8259)' },
    { feature: 'Output Format', specification: 'Objective-C (ARC/MRC)' },
    { feature: 'Max Input Size', specification: '10 MB' },
    { feature: 'Memory Management', specification: 'ARC or Manual Reference Counting' },
    { feature: 'Nested Depth', specification: 'Unlimited' },
    { feature: 'Processing', specification: 'Client-side only' },
  ] as TechnicalSpec[],
  
  comparisonSectionTitle: 'Comparison',
  comparison: [
    { feature: 'Real-time conversion', ourTool: true, competitorA: true, competitorB: false },
    { feature: 'Header + Implementation', ourTool: true, competitorA: true, competitorB: true },
    { feature: 'NSCoding support', ourTool: true, competitorA: false, competitorB: true },
    { feature: 'Nullability annotations', ourTool: true, competitorA: false, competitorB: false },
    { feature: 'Class prefix option', ourTool: true, competitorA: true, competitorB: true },
    { feature: 'No sign-up required', ourTool: true, competitorA: true, competitorB: false },
    { feature: '100% Client-side', ourTool: true, competitorA: false, competitorB: false },
  ] as ComparisonRow[],
  
  whyChooseSectionTitle: 'Why Choose Our Tool',
  whyChoose: [
    {
      title: 'Complete Output',
      description: 'Generate both header and implementation files ready for your Xcode project.',
      icon: 'fas fa-file-code',
    },
    {
      title: 'Modern Features',
      description: 'Support for nullability annotations and modern Objective-C features.',
      icon: 'fas fa-rocket',
    },
    {
      title: 'Protocol Support',
      description: 'Optional NSCoding, NSCopying, and NSSecureCoding conformance.',
      icon: 'fas fa-check-double',
    },
  ],
  
  faqs: [
    {
      question: 'Does it support ARC?',
      answer: 'Yes! The converter generates ARC-compatible code by default. You can also switch to MRC for legacy projects.',
    },
    {
      question: 'Can I add a class prefix?',
      answer: 'Yes, you can specify a class prefix (like "ABC") that will be added to all generated class names.',
    },
    {
      question: 'Does it generate both header and implementation?',
      answer: 'Yes, both .h header and .m implementation files are generated. You can also choose to generate only one.',
    },
    {
      question: 'Is my JSON data secure?',
      answer: 'Absolutely. All processing happens in your browser. Your JSON data never leaves your device.',
    },
  ] as FAQItem[],
  
  relatedTools: [
    { title: 'JSON to Swift', description: 'Convert JSON to Swift Codable', icon: 'fab fa-swift', link: '/json-to-swift/' },
    { title: 'JSON to Java', description: 'Convert JSON to Java classes', icon: 'fab fa-java', link: '/json-to-java/' },
    { title: 'JSON to C#', description: 'Convert JSON to C# classes', icon: 'fab fa-microsoft', link: '/json-to-csharp/' },
    { title: 'JSON Formatter', description: 'Format and validate JSON', icon: 'fas fa-indent', link: '/json-formatter/' },
  ] as RelatedTool[],
};
