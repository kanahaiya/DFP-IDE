/**
 * SEO Content for JSON to Ruby Converter
 */

export interface TrustBadge {
  icon: string;
  text: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

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

export interface UseCase {
  title: string;
  description: string;
  icon: string;
}

export interface WhyChooseItem {
  icon: string;
  title: string;
  description: string;
}

export interface TechnicalSpec {
  feature: string;
  specification: string;
}

export interface ComparisonRow {
  feature: string;
  ourTool: string;
  competitorA: string;
  competitorB: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface RelatedTool {
  title: string;
  description: string;
  icon: string;
  link: string;
}

export const jsonToRubySEO = {
  title: 'JSON to Ruby Converter - Hash, Struct & Class Generator',
  subtitle: 'Convert JSON to Ruby hashes, Structs, OpenStruct, and classes instantly. Support for modern symbol syntax, hashrockets, and Rails conventions.',
  description: 'Free online JSON to Ruby converter with hash syntax options, class generation, and Rails-style output.',

  trustBadges: [
    { icon: 'fas fa-gem', text: 'Ruby Style' },
    { icon: 'fas fa-code', text: 'Multiple Formats' },
    { icon: 'fas fa-shield-alt', text: 'Private & Secure' },
    { icon: 'fas fa-bolt', text: 'Instant Results' },
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
  ] as TrustBadge[],

  features: [
    {
      icon: 'fas fa-hashtag',
      title: 'Hash Syntax Options',
      description: 'Choose modern symbol syntax (key:), hashrockets (=>), or string keys.',
    },
    {
      icon: 'fas fa-cube',
      title: 'Multiple Output Modes',
      description: 'Generate Hash literals, Struct, OpenStruct, Data.define, or full classes.',
    },
    {
      icon: 'fas fa-train',
      title: 'Rails Conventions',
      description: 'Follow Ruby on Rails naming and style conventions.',
    },
    {
      icon: 'fas fa-snowflake',
      title: 'Frozen String Literal',
      description: 'Add frozen_string_literal pragma for performance.',
    },
    {
      icon: 'fas fa-exchange-alt',
      title: 'JSON Serialization',
      description: 'Generate to_json and from_json methods for classes.',
    },
    {
      icon: 'fas fa-lock',
      title: 'Immutable Data',
      description: 'Use Ruby 3.2+ Data.define for immutable value objects.',
    },
  ] as FeatureItem[],

  howToSectionTitle: 'How to Convert JSON to Ruby',

  howToSteps: [
    {
      number: 1,
      title: 'Paste Your JSON',
      description: 'Copy your JSON data from an API, config file, or any source and paste it into the input editor.',
    },
    {
      number: 2,
      title: 'Choose Output Mode',
      description: 'Select Hash, Struct, OpenStruct, Data.define, or Class based on your needs.',
    },
    {
      number: 3,
      title: 'Configure Syntax',
      description: 'Pick hash syntax style, string quotes, and additional options like frozen string literal.',
    },
    {
      number: 4,
      title: 'Copy or Download',
      description: 'Click Copy to clipboard or Download as a .rb file to use in your Ruby project.',
    },
  ] as HowToStep[],

  educationalContent: [
    {
      title: 'Ruby Hash Syntax Styles',
      content: "Ruby supports multiple hash syntax styles. Modern Ruby (1.9+) uses symbol keys with colon syntax (key: value). Classic Ruby uses hashrockets (:key => value or 'key' => value). Choose based on your project's Ruby version and style guide.",
      type: 'info',
    },
    {
      title: 'Choosing the Right Data Structure',
      content: 'Use Hash for simple key-value data. Struct for lightweight objects with named attributes. Class when you need custom methods or inheritance. Data.define (Ruby 3.2+) for immutable value objects.',
      type: 'tip',
    },
    {
      title: 'frozen_string_literal',
      content: "Adding '# frozen_string_literal: true' at the top of Ruby files makes all string literals frozen by default, improving performance and preventing accidental mutations. It's recommended for all new Ruby code.",
      type: 'info',
    },
  ] as EducationalSection[],

  useCases: [
    {
      title: 'Rails Development',
      description: 'Convert API responses to Ruby hashes or model-like classes for Ruby on Rails applications.',
      icon: 'fas fa-train',
    },
    {
      title: 'Configuration Files',
      description: 'Transform JSON configs into Ruby hash syntax for initializers and YAML alternatives.',
      icon: 'fas fa-cog',
    },
    {
      title: 'API Clients',
      description: 'Generate Ruby classes to represent API response objects with serialization methods.',
      icon: 'fas fa-cloud',
    },
    {
      title: 'Testing & Fixtures',
      description: 'Create Ruby hash fixtures from JSON test data for RSpec or Minitest.',
      icon: 'fas fa-vial',
    },
  ] as UseCase[],

  whyChooseSectionTitle: 'Why Choose Our JSON to Ruby Converter?',

  whyChoose: [
    {
      icon: 'fas fa-gem',
      title: 'Ruby-Idiomatic Output',
      description: 'Generate clean, idiomatic Ruby code that follows community conventions.',
    },
    {
      icon: 'fas fa-sliders-h',
      title: 'Flexible Output Modes',
      description: 'Choose from Hash, Struct, OpenStruct, Data.define, or full class definitions.',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Privacy First',
      description: 'All processing happens in your browser. Your JSON never leaves your device.',
    },
    {
      icon: 'fas fa-rocket',
      title: 'Instant Generation',
      description: 'Real-time conversion as you type. No waiting, no submit buttons.',
    },
  ] as WhyChooseItem[],

  technicalSpecs: [
    { feature: 'Output Modes', specification: 'Hash, Struct, OpenStruct, Class, Data.define' },
    { feature: 'Hash Syntax', specification: 'Symbol keys, hashrockets, string keys' },
    { feature: 'String Quotes', specification: 'Single or double quotes' },
    { feature: 'Ruby Versions', specification: 'Ruby 1.9+ (Data.define requires 3.2+)' },
    { feature: 'Max File Size', specification: 'Up to 10MB JSON' },
    { feature: 'Processing', specification: '100% client-side' },
    { feature: 'Export Options', specification: '.rb file download' },
    { feature: 'Browser Support', specification: 'Chrome, Firefox, Safari, Edge' },
  ] as TechnicalSpec[],

  comparisonSectionTitle: 'JSON to Ruby Converter Comparison',

  comparison: [
    { feature: 'Free to Use', ourTool: '✓ Unlimited', competitorA: 'Limited', competitorB: 'Paid' },
    { feature: 'Privacy', ourTool: '✓ Client-side', competitorA: 'Server upload', competitorB: 'Server upload' },
    { feature: 'Hash Output', ourTool: '✓', competitorA: '✓', competitorB: '✓' },
    { feature: 'Struct Output', ourTool: '✓', competitorA: '✗', competitorB: '✓' },
    { feature: 'Class Generation', ourTool: '✓', competitorA: '✗', competitorB: '✗' },
    { feature: 'Data.define', ourTool: '✓', competitorA: '✗', competitorB: '✗' },
    { feature: 'Syntax Options', ourTool: '✓ 4 styles', competitorA: '1', competitorB: '2' },
    { feature: 'Presets', ourTool: '✓ 6 presets', competitorA: '✗', competitorB: '✗' },
  ] as ComparisonRow[],

  faqs: [
    {
      question: 'What is the difference between Hash and Struct in Ruby?',
      answer: 'A Hash is a key-value collection accessed with brackets (hash[:key]). A Struct is a class with named attributes accessed with methods (struct.attribute). Structs are faster and provide better encapsulation.',
    },
    {
      question: 'When should I use OpenStruct vs Struct?',
      answer: 'Use Struct when you know the attributes ahead of time - it\'s faster and more memory efficient. Use OpenStruct when you need dynamic attributes or are prototyping. OpenStruct is slower due to method_missing.',
    },
    {
      question: 'What is Data.define in Ruby?',
      answer: 'Data.define (introduced in Ruby 3.2) creates immutable value objects similar to Struct but with true immutability. Great for representing JSON data where mutations should be prevented.',
    },
    {
      question: 'Should I use symbol or string hash keys?',
      answer: 'Use symbols (:key) for internal Ruby code - they\'re faster and more memory efficient. Use strings when keys come from external sources like JSON or might contain special characters.',
    },
    {
      question: 'What is frozen_string_literal?',
      answer: 'Adding "# frozen_string_literal: true" makes all string literals in the file frozen (immutable). This improves performance by allowing Ruby to reuse string objects and prevents accidental mutations.',
    },
    {
      question: 'Is my data secure when using this tool?',
      answer: 'Yes. All conversion happens entirely in your browser using JavaScript. Your JSON data is never sent to any server—it stays completely on your device.',
    },
  ] as FAQItem[],

  relatedTools: [
    {
      title: 'JSON to Python',
      description: 'Generate Python dataclasses from JSON',
      icon: 'fab fa-python',
      link: '/json-to-python',
    },
    {
      title: 'JSON Formatter',
      description: 'Format and beautify JSON data',
      icon: 'fas fa-indent',
      link: '/json-formatter',
    },
    {
      title: 'JSON to YAML',
      description: 'Convert JSON to YAML format',
      icon: 'fas fa-file-code',
      link: '/json-to-yaml',
    },
    {
      title: 'JSON to TypeScript',
      description: 'Generate TypeScript interfaces',
      icon: 'fas fa-code',
      link: '/json-to-typescript',
    },
    {
      title: 'JSON Validator',
      description: 'Validate JSON syntax and structure',
      icon: 'fas fa-check-circle',
      link: '/json-validator',
    },
    {
      title: 'JSON to Crystal',
      description: 'Generate Crystal structs from JSON',
      icon: 'fas fa-gem',
      link: '/json-to-crystal',
    },
  ] as RelatedTool[],
};
