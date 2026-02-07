/**
 * SEO content for JSON to Swift converter
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

export const jsonToSwiftContent = {
  title: 'JSON to Swift Converter - Generate Codable Structs & Classes',
  subtitle: 'Convert JSON to Swift structs and classes instantly. Generate Codable-compliant Swift code with CodingKeys, optional support, and SwiftUI ready. 100% client-side processing ensures complete privacy. No signup required.',
  
  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-bolt', text: 'Instant Convert' },
    { icon: 'fas fa-shield-alt', text: 'Client-Side' },
    { icon: 'fas fa-apple-alt', text: 'Swift 5.x' },
    { icon: 'fas fa-mobile-alt', text: 'iOS Ready' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
  ],
  
  howToSectionTitle: 'How to Convert JSON to Swift Code',
  featuresSectionTitle: 'JSON to Swift Converter Features',
  whyChooseSectionTitle: 'Why Choose This JSON to Swift Converter?',
  comparisonSectionTitle: 'JSON to Swift Converter Comparison',
  
  features: [
    {
      icon: 'fas fa-code',
      title: 'Codable-Compliant Swift Code',
      description: 'Generate Swift structs and classes that conform to Codable, Decodable, or Encodable protocols. Works seamlessly with JSONDecoder and JSONEncoder for API integration.'
    },
    {
      icon: 'fas fa-key',
      title: 'Auto-Generated CodingKeys',
      description: 'Automatically generate CodingKeys enum when JSON keys differ from Swift property names. Handles snake_case to camelCase conversion effortlessly.'
    },
    {
      icon: 'fas fa-th-large',
      title: 'Struct or Class Output',
      description: 'Choose between struct, class, or final class based on your needs. Use structs for value types and classes for reference semantics or SwiftUI ObservableObjects.'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'SwiftUI Integration',
      description: 'Generate SwiftUI-ready code with @Published property wrappers for ObservableObject classes. Perfect for building reactive iOS, macOS, and watchOS apps.'
    },
    {
      icon: 'fas fa-question-circle',
      title: 'Optional Type Handling',
      description: 'Intelligently detect nullable fields and generate Swift optionals (Type?). Distinguish between required and optional properties in your API models.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Privacy-First Processing',
      description: 'All conversion happens locally in your browser. Your JSON data and generated Swift code never leave your device—perfect for proprietary APIs.'
    },
    {
      icon: 'fas fa-lock',
      title: 'Access Control Modifiers',
      description: 'Configure access levels: public for framework code, internal for app code, or private for encapsulated types. Follows Swift best practices.'
    },
    {
      icon: 'fas fa-magic',
      title: 'One-Click Presets',
      description: 'Quick presets for common patterns: API Client models, SwiftUI ObservableObjects, Data Transfer Objects, and minimal structs.'
    }
  ] as FeatureItem[],
  
  howToSteps: [
    {
      number: 1,
      title: 'Paste Your JSON',
      description: 'Paste your JSON data into the input editor. Upload a .json file or load a sample template to get started.'
    },
    {
      number: 2,
      title: 'Configure Swift Options',
      description: 'Set your root type name, choose struct vs class, select Codable options, and configure property modifiers (var/let).'
    },
    {
      number: 3,
      title: 'Review Generated Code',
      description: 'The Swift code is generated instantly with syntax highlighting. Review the types, CodingKeys, and optional handling.'
    },
    {
      number: 4,
      title: 'Copy or Download',
      description: 'Copy the Swift code to your clipboard or download as a .swift file ready to add to your Xcode project.'
    }
  ] as HowToStep[],
  
  educationalContent: [
    {
      title: 'Understanding Swift Codable',
      content: 'Codable is a type alias for Encodable & Decodable protocols. Types conforming to Codable can be serialized to/from external representations like JSON. Use Decodable for read-only API responses and Encodable for write-only.',
      type: 'info' as const
    },
    {
      title: 'When to Use CodingKeys',
      content: 'CodingKeys is needed when your JSON keys don\'t match Swift property names. For example, JSON "user_id" becomes Swift "userId" with a CodingKey mapping. The converter auto-detects when CodingKeys are necessary.',
      type: 'tip' as const
    },
    {
      title: 'Struct vs Class in Swift',
      content: 'Use structs (value types) for immutable data models. Use classes for SwiftUI ObservableObjects or when you need reference semantics. Our converter defaults to structs following Swift best practices.',
      type: 'info' as const
    }
  ],
  
  useCases: [
    {
      title: 'iOS App Development',
      description: 'Generate models for REST API responses in iOS apps',
      icon: 'fas fa-mobile-alt'
    },
    {
      title: 'SwiftUI Apps',
      description: 'Create ObservableObject models with @Published properties',
      icon: 'fas fa-laptop-code'
    },
    {
      title: 'macOS Development',
      description: 'Build data models for macOS desktop applications',
      icon: 'fas fa-desktop'
    },
    {
      title: 'Server-Side Swift',
      description: 'Generate Codable types for Vapor or Kitura backends',
      icon: 'fas fa-server'
    },
    {
      title: 'watchOS & tvOS',
      description: 'Create lightweight models for watch and TV apps',
      icon: 'fas fa-clock'
    },
    {
      title: 'Swift Packages',
      description: 'Generate public types for reusable Swift packages',
      icon: 'fas fa-cube'
    }
  ] as UseCase[],
  
  technicalSpecs: [
    { feature: 'Type Mapping', specification: 'string→String, int→Int, float→Double, bool→Bool' },
    { feature: 'Array Support', specification: '[Type] with element type inference' },
    { feature: 'Nested Objects', specification: 'Separate struct/class generation' },
    { feature: 'Protocol Options', specification: 'Codable, Decodable, Encodable, none' },
    { feature: 'Access Modifiers', specification: 'public, internal, private, fileprivate' },
    { feature: 'Output Types', specification: 'struct, class, final class' },
    { feature: 'Swift Version', specification: 'Swift 5.x/6 compatible' },
    { feature: 'Processing', specification: '100% client-side JavaScript' }
  ] as TechnicalSpec[],
  
  comparison: [
    { feature: 'JSON to Swift Conversion', ourTool: true, competitorA: true, competitorB: true },
    { feature: 'Codable Support', ourTool: true, competitorA: true, competitorB: true },
    { feature: 'CodingKeys Generation', ourTool: true, competitorA: true, competitorB: false },
    { feature: 'Struct/Class Toggle', ourTool: true, competitorA: true, competitorB: false },
    { feature: 'Access Modifiers', ourTool: true, competitorA: false, competitorB: false },
    { feature: 'SwiftUI @Published', ourTool: true, competitorA: false, competitorB: false },
    { feature: 'var/let Toggle', ourTool: true, competitorA: false, competitorB: false },
    { feature: 'Init Method Generation', ourTool: true, competitorA: false, competitorB: false },
    { feature: '100% Client-Side', ourTool: true, competitorA: false, competitorB: false },
    { feature: 'One-Click Presets', ourTool: true, competitorA: false, competitorB: false },
    { feature: 'Dark Mode', ourTool: true, competitorA: true, competitorB: false }
  ] as ComparisonRow[],
  
  faqs: [
    {
      question: 'How do I convert JSON to Swift code?',
      answer: 'Paste your JSON into the input editor, configure options like struct vs class and Codable protocol, then copy or download the generated Swift code. Conversion happens instantly.'
    },
    {
      question: 'What is Codable in Swift?',
      answer: 'Codable is a protocol that allows Swift types to be encoded/decoded to external formats like JSON. It\'s a type alias for Encodable & Decodable. Our converter generates Codable-compliant types by default.'
    },
    {
      question: 'Should I use struct or class?',
      answer: 'Use struct for simple data models (value semantics, immutable). Use class for SwiftUI ObservableObjects or when you need reference semantics. Structs are generally preferred in Swift.'
    },
    {
      question: 'How does CodingKeys work?',
      answer: 'CodingKeys is an enum that maps JSON keys to Swift property names. For example, JSON "first_name" can map to Swift "firstName". Our converter auto-generates CodingKeys when needed.'
    },
    {
      question: 'Can I generate SwiftUI models?',
      answer: 'Yes! Select the "SwiftUI Model" preset or enable the @Published option. This generates class types with @Published property wrappers for ObservableObject conformance.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. All conversion happens locally in your browser. Your JSON data never leaves your device—no server uploads, no logging. Perfect for sensitive or proprietary APIs.'
    },
    {
      question: 'What Swift version is supported?',
      answer: 'The generated code is compatible with Swift 5.x and Swift 6. It uses modern Swift features like Codable and optional types.'
    },
    {
      question: 'Can I use this for server-side Swift?',
      answer: 'Yes! The generated Codable types work with Vapor, Kitura, and other server-side Swift frameworks. Use the "public" access modifier for framework code.'
    }
  ] as FAQItem[],
  
  whyChoose: [
    {
      title: 'Swift Best Practices',
      description: 'Generate code following Swift conventions: PascalCase types, camelCase properties, proper optionals.'
    },
    {
      title: 'iOS Development Ready',
      description: 'Output is ready to use in Xcode for iOS, macOS, watchOS, and tvOS app development.'
    },
    {
      title: 'Privacy Guaranteed',
      description: '100% client-side processing. Your API responses and models stay on your device.'
    },
    {
      title: 'SwiftUI Support',
      description: 'Generate ObservableObject classes with @Published for reactive SwiftUI apps.'
    }
  ] as WhyChooseItem[],
  
  relatedTools: [
    {
      title: 'JSON to Go',
      description: 'Convert JSON to Go structs',
      icon: 'fas fa-code',
      link: '/json-to-go'
    },
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
      title: 'JSON to Dart',
      description: 'Convert JSON to Dart classes',
      icon: 'fas fa-feather',
      link: '/json-to-dart'
    }
  ] as RelatedTool[]
};
