/**
 * JSON Cleaner SEO Data
 * SEO content and metadata for JSON Cleaner tool
 */

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

export interface TechnicalSpec {
  feature: string;
  specification: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const jsonCleanerSEO = {
  // Primary Keywords
  primaryKeyword: 'JSON Cleaner Online',
  secondaryKeywords: [
    'clean json data',
    'remove null from json',
    'json transformer',
    'json key converter',
    'sanitize json',
  ],
  
  // Meta Information
  title: 'JSON Cleaner Online - Clean, Transform & Sanitize JSON',
  description: 'Clean and transform JSON data online. Remove nulls, empty values, duplicates. Convert key names, change types, flatten objects. Free JSON cleaner with presets.',
  
  // Hero Section
  heroTitle: 'JSON Cleaner',
  heroSubtitle: 'Clean, Transform & Sanitize JSON',
  heroDescription: 'Clean up messy JSON by removing empty values, transforming keys, and converting types. Multiple presets for common scenarios. 100% browser-based and private.',
  
  // Features
  features: [
    {
      icon: 'fas fa-broom',
      title: 'Remove Empty Values',
      description: 'Remove nulls, empty strings, empty arrays, and empty objects.',
    },
    {
      icon: 'fas fa-key',
      title: 'Key Transformation',
      description: 'Convert keys to camelCase, snake_case, PascalCase, or kebab-case.',
    },
    {
      icon: 'fas fa-exchange-alt',
      title: 'Type Conversion',
      description: 'Convert string numbers to numbers, string booleans to booleans.',
    },
    {
      icon: 'fas fa-compress-arrows-alt',
      title: 'Flatten/Unflatten',
      description: 'Flatten nested objects or unflatten dot-notation keys.',
    },
    {
      icon: 'fas fa-magic',
      title: 'Presets',
      description: 'One-click presets for common cleaning scenarios.',
    },
    {
      icon: 'fas fa-lock',
      title: 'Privacy First',
      description: 'All processing in your browser. No data uploaded.',
    },
  ] as FeatureItem[],
  
  // How-to Steps
  howToSteps: [
    {
      number: 1,
      title: 'Paste Your JSON',
      description: 'Paste your messy JSON into the input editor.',
    },
    {
      number: 2,
      title: 'Configure Options',
      description: 'Select cleaning and transformation options, or choose a preset.',
    },
    {
      number: 3,
      title: 'Clean JSON',
      description: 'Click "Clean JSON" to process your data.',
    },
    {
      number: 4,
      title: 'Export Result',
      description: 'Review the summary and copy or download your cleaned JSON.',
    },
  ] as HowToStep[],
  
  // Educational Content
  educationalContent: [
    {
      title: 'What is JSON Cleaning?',
      content: 'JSON cleaning removes unwanted data like nulls, empty strings, and duplicate values. It can also normalize key naming conventions and convert types to ensure consistency across your data.',
      type: 'info',
    },
    {
      title: 'When to Clean JSON',
      content: 'Clean JSON before API submissions (remove nulls), before storage (minimize size), after data imports (normalize formats), or during data migrations (consistent naming).',
      type: 'explanation',
    },
    {
      title: 'Key Naming Conventions',
      content: 'camelCase (JavaScript, JSON APIs), snake_case (Python, databases), PascalCase (C#, TypeScript interfaces), kebab-case (CSS, URLs).',
      type: 'info',
    },
    {
      title: 'Flattening vs Unflattening',
      content: 'Flatten converts nested objects to flat objects with dot-notation keys. Unflatten does the reverse. Useful for database storage, configuration files, and form handling.',
      type: 'tip',
    },
  ] as EducationalSection[],
  
  // Use Cases
  useCases: [
    {
      title: 'API Preparation',
      description: 'Clean data before sending to APIs. Remove nulls, normalize keys.',
      icon: 'fas fa-server',
    },
    {
      title: 'Storage Optimization',
      description: 'Minimize JSON size by removing empty values for database storage.',
      icon: 'fas fa-database',
    },
    {
      title: 'Data Migration',
      description: 'Normalize JSON from different sources to a consistent format.',
      icon: 'fas fa-exchange-alt',
    },
    {
      title: 'Configuration Files',
      description: 'Clean up config files, flatten for environment variables.',
      icon: 'fas fa-cog',
    },
    {
      title: 'Type Normalization',
      description: 'Convert string numbers/booleans to proper types.',
      icon: 'fas fa-sort-numeric-down',
    },
    {
      title: 'Key Standardization',
      description: 'Convert all keys to your preferred naming convention.',
      icon: 'fas fa-key',
    },
  ] as UseCase[],
  
  // Technical Specifications
  technicalSpecs: [
    { feature: 'Remove Operations', specification: 'Null, empty strings, empty arrays/objects' },
    { feature: 'String Operations', specification: 'Trim whitespace, remove whitespace-only' },
    { feature: 'Array Operations', specification: 'Deduplicate elements' },
    { feature: 'Key Conversion', specification: 'camelCase, snake_case, PascalCase, kebab-case' },
    { feature: 'Type Conversion', specification: 'String↔Number, String↔Boolean, Null→String' },
    { feature: 'Structure', specification: 'Flatten/unflatten with custom separator' },
    { feature: 'Presets', specification: 'Minimal, Standard, Aggressive, API, Storage' },
    { feature: 'Max File Size', specification: '10MB' },
    { feature: 'Processing', specification: '100% browser-based' },
  ] as TechnicalSpec[],
  
  // FAQs
  faq: [
    {
      question: 'What does JSON Cleaner remove?',
      answer: 'You can configure it to remove: null values, empty strings (""), empty arrays ([]), empty objects ({}), undefined values, and whitespace-only strings. Each option is individually controllable.',
    },
    {
      question: 'Will cleaning change my data values?',
      answer: 'Cleaning only removes empty/null values and transforms keys/types as configured. Actual data values are preserved unless you enable type conversion (e.g., "123" to 123).',
    },
    {
      question: 'What key naming conventions are supported?',
      answer: 'We support camelCase (myPropertyName), PascalCase (MyPropertyName), snake_case (my_property_name), kebab-case (my-property-name), and SCREAMING_SNAKE_CASE (MY_PROPERTY_NAME).',
    },
    {
      question: 'What is flatten and unflatten?',
      answer: 'Flatten converts nested objects to flat objects with dot-separated keys: {"user": {"name": "John"}} becomes {"user.name": "John"}. Unflatten does the reverse.',
    },
    {
      question: 'Is my JSON data secure?',
      answer: 'Yes, 100% secure. All cleaning and transformation happens in your browser. No data is sent to any server.',
    },
    {
      question: 'Which preset should I use?',
      answer: 'Minimal for safety, Standard for common cleaning, Aggressive for maximum removal, API Ready for consistent API formatting, Storage for minimum file size.',
    },
    {
      question: 'Can I undo the cleaning?',
      answer: 'The original JSON stays in the input panel. If you need to revert, simply clear the output and start again with different settings.',
    },
    {
      question: 'Does it support nested objects?',
      answer: 'Yes! All operations (cleaning, key transformation, type conversion) work recursively on nested objects and arrays by default.',
    },
  ] as FAQItem[],
  
  // Related Tools
  relatedTools: [
    { name: 'JSON Formatter', url: '/json-formatter', description: 'Beautify JSON' },
    { name: 'JSON Minifier', url: '/json-minifier', description: 'Compress JSON' },
    { name: 'JSON Validator', url: '/json-validator', description: 'Validate syntax' },
    { name: 'JSON Repair', url: '/json-repair', description: 'Fix broken JSON' },
    { name: 'JSON Fixer', url: '/json-fixer', description: 'Debug JSON errors' },
  ],
};
