/**
 * SEO content for JSON to Dart converter
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

export const jsonToDartContent = {
  title: 'JSON to Dart Converter - Generate Flutter Model Classes',
  subtitle: 'Convert JSON to Dart classes instantly. Generate null-safe Flutter models with fromJson/toJson, Freezed, and JSON Serializable support. 100% client-side processing ensures complete privacy. No signup required.',
  
  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-bolt', text: 'Instant Convert' },
    { icon: 'fas fa-shield-alt', text: 'Client-Side' },
    { icon: 'fas fa-feather', text: 'Dart 3.x' },
    { icon: 'fas fa-mobile-alt', text: 'Flutter Ready' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
  ],
  
  howToSectionTitle: 'How to Convert JSON to Dart Classes',
  featuresSectionTitle: 'JSON to Dart Converter Features',
  whyChooseSectionTitle: 'Why Choose This JSON to Dart Converter?',
  comparisonSectionTitle: 'JSON to Dart Converter Comparison',
  
  features: [
    {
      icon: 'fas fa-code',
      title: 'Null-Safe Dart Classes',
      description: 'Generate Dart 3.x null-safe classes with proper nullable type annotations (?). Automatically detect nullable fields from JSON structure and apply correct types.'
    },
    {
      icon: 'fas fa-exchange-alt',
      title: 'fromJson/toJson Methods',
      description: 'Auto-generate factory constructors for parsing JSON and toJson methods for serialization. Handle nested objects and lists with proper type casting.'
    },
    {
      icon: 'fas fa-snowflake',
      title: 'Freezed Package Support',
      description: 'Generate immutable classes using the Freezed package with @freezed annotations, sealed unions, and generated code for copyWith, equality, and JSON serialization.'
    },
    {
      icon: 'fas fa-file-code',
      title: 'JSON Serializable Support',
      description: 'Generate classes with @JsonSerializable annotations for build_runner code generation. Includes @JsonKey for custom field mapping.'
    },
    {
      icon: 'fas fa-copy',
      title: 'copyWith Method',
      description: 'Optional copyWith method generation for creating modified copies of immutable objects. Essential for Flutter state management patterns.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Privacy-First Processing',
      description: 'All conversion happens locally in your browser. Your API responses and data models never leave your device—perfect for proprietary Flutter apps.'
    },
    {
      icon: 'fas fa-equals',
      title: 'Equality & toString',
      description: 'Generate equality operators and toString methods for debugging. Proper hashCode implementation for use in Maps and Sets.'
    },
    {
      icon: 'fas fa-magic',
      title: 'Flutter Presets',
      description: 'One-click presets for common Flutter patterns: standard models, Freezed immutable, JSON Serializable, and full-featured models with all methods.'
    }
  ] as FeatureItem[],
  
  howToSteps: [
    {
      number: 1,
      title: 'Paste Your JSON',
      description: 'Paste your JSON data or API response into the input editor. Upload a .json file or load a sample template.'
    },
    {
      number: 2,
      title: 'Configure Dart Options',
      description: 'Set your root class name, choose code style (plain, Freezed, JSON Serializable), and select which methods to generate.'
    },
    {
      number: 3,
      title: 'Review Generated Code',
      description: 'The Dart classes are generated instantly with syntax highlighting. Review fromJson/toJson, copyWith, and other methods.'
    },
    {
      number: 4,
      title: 'Copy or Download',
      description: 'Copy the Dart code to your clipboard or download as a .dart file ready to add to your Flutter project.'
    }
  ] as HowToStep[],
  
  educationalContent: [
    {
      title: 'Dart Null Safety',
      content: 'Dart 3.x uses null safety by default. Types without ? are non-nullable and must have values. Types with ? (like String?) can be null. Our converter automatically detects which fields should be nullable based on your JSON structure.',
      type: 'info' as const
    },
    {
      title: 'Freezed vs JSON Serializable',
      content: 'Freezed generates immutable classes with copyWith, equality, and pattern matching. JSON Serializable is simpler with just serialization. Choose Freezed for complex state management, JSON Serializable for basic API models.',
      type: 'tip' as const
    },
    {
      title: 'Final Properties',
      content: 'Using final properties makes your Dart objects immutable after construction. This is a best practice for Flutter state management and helps prevent accidental mutations.',
      type: 'info' as const
    }
  ],
  
  useCases: [
    {
      title: 'Flutter App Development',
      description: 'Generate models for REST API responses in Flutter apps',
      icon: 'fas fa-mobile-alt'
    },
    {
      title: 'State Management',
      description: 'Create immutable models for BLoC, Riverpod, or Provider',
      icon: 'fas fa-sitemap'
    },
    {
      title: 'Firebase Integration',
      description: 'Generate Dart classes for Firestore documents',
      icon: 'fas fa-database'
    },
    {
      title: 'GraphQL Clients',
      description: 'Create type-safe models for GraphQL responses',
      icon: 'fas fa-project-diagram'
    },
    {
      title: 'Backend Development',
      description: 'Build server-side Dart models with Shelf or Dart Frog',
      icon: 'fas fa-server'
    },
    {
      title: 'Package Development',
      description: 'Create data classes for reusable Dart packages',
      icon: 'fas fa-cube'
    }
  ] as UseCase[],
  
  technicalSpecs: [
    { feature: 'Type Mapping', specification: 'string→String, int→int, float→double, bool→bool' },
    { feature: 'List Support', specification: 'List<Type> with element type inference' },
    { feature: 'Nested Objects', specification: 'Separate class generation with fromJson' },
    { feature: 'Code Styles', specification: 'Plain, Freezed, JSON Serializable' },
    { feature: 'Null Safety', specification: 'Dart 3.x sound null safety' },
    { feature: 'Methods', specification: 'fromJson, toJson, copyWith, toString, equals' },
    { feature: 'Dart Version', specification: 'Dart 3.x compatible' },
    { feature: 'Processing', specification: '100% client-side JavaScript' }
  ] as TechnicalSpec[],
  
  comparison: [
    { feature: 'JSON to Dart Conversion', ourTool: true, competitorA: true, competitorB: true },
    { feature: 'Null Safety', ourTool: true, competitorA: true, competitorB: 'Limited' },
    { feature: 'fromJson/toJson', ourTool: true, competitorA: true, competitorB: true },
    { feature: 'Freezed Support', ourTool: true, competitorA: false, competitorB: false },
    { feature: 'JSON Serializable', ourTool: true, competitorA: true, competitorB: false },
    { feature: 'copyWith Method', ourTool: true, competitorA: false, competitorB: false },
    { feature: 'Equality/hashCode', ourTool: true, competitorA: false, competitorB: false },
    { feature: 'Final Properties', ourTool: true, competitorA: false, competitorB: false },
    { feature: '100% Client-Side', ourTool: true, competitorA: true, competitorB: false },
    { feature: 'One-Click Presets', ourTool: true, competitorA: false, competitorB: false },
    { feature: 'Dark Mode', ourTool: true, competitorA: false, competitorB: true }
  ] as ComparisonRow[],
  
  faqs: [
    {
      question: 'How do I convert JSON to Dart classes?',
      answer: 'Paste your JSON into the input editor, configure options like code style and methods, then copy or download the generated Dart code. Conversion happens instantly.'
    },
    {
      question: 'What is Dart null safety?',
      answer: 'Null safety means types cannot be null unless explicitly marked with ?. For example, String cannot be null, but String? can. Our converter auto-detects nullable fields from your JSON.'
    },
    {
      question: 'Should I use Freezed or JSON Serializable?',
      answer: 'Use Freezed for complex apps needing immutable classes, copyWith, and pattern matching. Use JSON Serializable for simpler API models. Plain Dart is fine for basic use cases.'
    },
    {
      question: 'How does fromJson work?',
      answer: 'The fromJson factory constructor parses a Map<String, dynamic> (from JSON.decode) into a typed Dart object. Nested objects and lists are recursively parsed.'
    },
    {
      question: 'What is copyWith?',
      answer: 'copyWith creates a new instance with some properties changed while keeping others. Essential for immutable state management: newUser = user.copyWith(name: "New Name")'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes! All conversion happens locally in your browser. Your JSON data never leaves your device—no server uploads, no logging, complete privacy.'
    },
    {
      question: 'Can I use this for Firebase/Firestore?',
      answer: 'Absolutely! The generated fromJson/toJson methods work perfectly with Firestore\'s snapshot.data() and setData() methods.'
    },
    {
      question: 'Does it work with Flutter web?',
      answer: 'Yes, the generated Dart code works on all Flutter platforms: iOS, Android, web, desktop, and embedded.'
    }
  ] as FAQItem[],
  
  whyChoose: [
    {
      title: 'Flutter Optimized',
      description: 'Purpose-built for Flutter development with Freezed and JSON Serializable support.'
    },
    {
      title: 'Full Null Safety',
      description: 'Dart 3.x sound null safety with automatic nullable type detection.'
    },
    {
      title: 'Privacy First',
      description: '100% client-side processing. Your API data stays on your device.'
    },
    {
      title: 'Complete Methods',
      description: 'fromJson, toJson, copyWith, equals, hashCode, and toString generation.'
    }
  ] as WhyChooseItem[],
  
  relatedTools: [
    {
      title: 'JSON to Swift',
      description: 'Convert JSON to Swift Codable',
      icon: 'fas fa-apple-alt',
      link: '/json-to-swift'
    },
    {
      title: 'JSON to Go',
      description: 'Convert JSON to Go structs',
      icon: 'fas fa-code',
      link: '/json-to-go'
    },
    {
      title: 'JSON Formatter',
      description: 'Format and beautify JSON',
      icon: 'fas fa-indent',
      link: '/json-formatter'
    },
    {
      title: 'JSON to YAML',
      description: 'Convert JSON to YAML format',
      icon: 'fas fa-file-code',
      link: '/json-to-yaml'
    }
  ] as RelatedTool[]
};
