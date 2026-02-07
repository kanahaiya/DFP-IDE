/**
 * SEO Content for JSON to TypeScript Converter
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

export const jsonToTypeScriptSEO = {
  title: 'JSON to TypeScript Converter - Generate Interfaces & Types Instantly',
  subtitle: 'Convert JSON to TypeScript interfaces with smart type inference, optional properties, union types, and JSDoc comments. Free online tool with no signup required.',
  description: 'Free online JSON to TypeScript converter with type inference and interface generation',

  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-shield-alt', text: 'Secure & Private' },
    { icon: 'fas fa-bolt', text: 'Instant Results' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
    { icon: 'fas fa-code', text: 'Type Safe' },
    { icon: 'fas fa-magic', text: 'Smart Inference' },
  ] as TrustBadge[],

  features: [
    {
      icon: 'fas fa-code',
      title: 'Interface Generation',
      description: 'Automatically generate TypeScript interfaces from JSON data with proper type annotations for all properties.',
    },
    {
      icon: 'fas fa-sitemap',
      title: 'Nested Type Support',
      description: 'Handle deeply nested JSON structures by creating separate interfaces for each nested object level.',
    },
    {
      icon: 'fas fa-question-circle',
      title: 'Optional Properties',
      description: 'Detect nullable values and mark properties as optional (?) for accurate type definitions.',
    },
    {
      icon: 'fas fa-layer-group',
      title: 'Union Types',
      description: 'Generate union types for arrays with mixed element types, ensuring type safety.',
    },
    {
      icon: 'fas fa-comment-alt',
      title: 'JSDoc Comments',
      description: 'Add JSDoc comments and examples to generated interfaces for better documentation.',
    },
    {
      icon: 'fas fa-lock',
      title: 'Readonly Support',
      description: 'Mark all properties as readonly for immutable data structures.',
    },
  ] as FeatureItem[],

  howToSectionTitle: 'How to Convert JSON to TypeScript',

  howToSteps: [
    {
      number: 1,
      title: 'Paste Your JSON',
      description: 'Copy your JSON data from any source—API response, config file, or database—and paste it into the input editor. The tool validates your JSON in real-time and highlights any syntax errors.',
    },
    {
      number: 2,
      title: 'Configure Options',
      description: 'Choose between interfaces or type aliases, set naming conventions, enable optional properties, and customize the output format. Select presets for common use cases like API responses or strict mode.',
    },
    {
      number: 3,
      title: 'Generate TypeScript',
      description: 'Your TypeScript interfaces are generated instantly as you type. The tool creates separate interfaces for nested objects and properly types arrays.',
    },
    {
      number: 4,
      title: 'Copy or Download',
      description: 'Click Copy to clipboard for quick use in your project, or Download to save as a .ts file. Use the generated types directly in your TypeScript codebase.',
    },
  ] as HowToStep[],

  educationalContent: [
    {
      title: 'What is TypeScript?',
      content: 'TypeScript is a strongly typed programming language that builds on JavaScript. It adds optional static typing and class-based object-oriented programming to the language. TypeScript interfaces define the shape of objects, making your code more predictable and easier to maintain. Converting JSON to TypeScript interfaces helps ensure type safety when working with API responses or configuration data.',
      type: 'info',
    },
    {
      title: 'Why Use TypeScript Interfaces?',
      content: 'TypeScript interfaces provide compile-time type checking, catching errors before runtime. They enable better IDE support with autocompletion, refactoring tools, and inline documentation. When consuming JSON from APIs, interfaces ensure your code handles all expected properties correctly. This is especially valuable in large codebases where data structures evolve over time.',
      type: 'tip',
    },
    {
      title: 'Interface vs Type Alias',
      content: 'Both interfaces and type aliases can describe object shapes in TypeScript. Interfaces are extendable and can be merged, making them ideal for object types. Type aliases are more flexible, supporting unions, intersections, and primitive types. Use interfaces for objects you might extend; use types for unions or when you need more flexibility.',
      type: 'info',
    },
  ] as EducationalSection[],

  useCases: [
    {
      title: 'API Integration',
      description: 'Paste API response JSON, generate TypeScript interfaces, and use them throughout your codebase for type-safe API calls with IntelliSense support.',
      icon: 'fas fa-server',
    },
    {
      title: 'React/Angular Development',
      description: 'Generate interfaces from sample data and use them as prop types for better component contracts and compile-time validation.',
      icon: 'fas fa-mobile-alt',
    },
    {
      title: 'Configuration Files',
      description: 'Convert your JSON config files to interfaces for validated, autocompleted configuration access with full type safety.',
      icon: 'fas fa-cog',
    },
    {
      title: 'Database Schemas',
      description: 'Paste example data and generate interfaces to retrofit type safety when migrating JavaScript projects to TypeScript.',
      icon: 'fas fa-database',
    },
  ] as UseCase[],

  whyChooseSectionTitle: 'Why Choose Our JSON to TypeScript Converter?',

  whyChoose: [
    {
      icon: 'fas fa-brain',
      title: 'Smart Type Inference',
      description: 'Our converter intelligently infers types from your JSON data, detecting strings, numbers, booleans, arrays, and nested objects automatically.',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Privacy First',
      description: 'All processing happens in your browser. Your JSON data never leaves your device—no server uploads, no storage, complete privacy.',
    },
    {
      icon: 'fas fa-sliders-h',
      title: 'Highly Configurable',
      description: 'Customize every aspect: naming conventions, optional properties, readonly modifiers, JSDoc comments, and more.',
    },
    {
      icon: 'fas fa-rocket',
      title: 'Instant Generation',
      description: 'Generate TypeScript interfaces in real-time as you type. No waiting, no submit buttons—just instant results.',
    },
  ] as WhyChooseItem[],

  technicalSpecs: [
    { feature: 'Output Formats', specification: 'Interfaces and Type Aliases' },
    { feature: 'Array Notation', specification: 'T[] and Array<T>' },
    { feature: 'Null Handling', specification: 'nullable, optional, undefined' },
    { feature: 'Nested Depth', specification: 'Unlimited nesting levels' },
    { feature: 'Max File Size', specification: 'Up to 10MB JSON' },
    { feature: 'Processing', specification: '100% client-side' },
    { feature: 'Export Options', specification: '.ts file download' },
    { feature: 'Browser Support', specification: 'Chrome, Firefox, Safari, Edge' },
  ] as TechnicalSpec[],

  comparisonSectionTitle: 'JSON to TypeScript Converter Comparison',

  comparison: [
    { feature: 'Free to Use', ourTool: '✓ Unlimited', competitorA: 'Limited', competitorB: 'Paid' },
    { feature: 'Privacy', ourTool: '✓ Client-side', competitorA: 'Server upload', competitorB: 'Server upload' },
    { feature: 'Real-time', ourTool: '✓ Instant', competitorA: 'Click to convert', competitorB: 'Click to convert' },
    { feature: 'Optional Properties', ourTool: '✓ Auto-detect', competitorA: 'Manual', competitorB: '✓' },
    { feature: 'JSDoc Support', ourTool: '✓', competitorA: '✗', competitorB: '✓' },
    { feature: 'Readonly Option', ourTool: '✓', competitorA: '✗', competitorB: '✗' },
    { feature: 'Custom Naming', ourTool: '✓ Multiple', competitorA: 'Limited', competitorB: '✓' },
    { feature: 'Presets', ourTool: '✓ 8 presets', competitorA: '✗', competitorB: '✗' },
  ] as ComparisonRow[],

  faqs: [
    {
      question: 'What is the difference between interface and type in TypeScript?',
      answer: 'Interfaces are primarily used to define object shapes and can be extended or merged. Types (type aliases) are more versatile—they can represent unions, intersections, primitives, and more. For object shapes, interfaces are generally preferred as they\'re more performant and produce clearer error messages. Our tool lets you choose either approach.',
    },
    {
      question: 'How does the converter handle null and undefined values?',
      answer: 'You can configure null handling in several ways: mark properties as nullable (string | null), optional (property?), or use strict null checks. The default behavior detects null values in your JSON and marks those properties appropriately.',
    },
    {
      question: 'Can I convert nested JSON objects?',
      answer: 'Yes! The converter automatically creates separate interfaces for nested objects, maintaining proper type relationships. Arrays of objects are also handled correctly, with their element types properly defined.',
    },
    {
      question: 'Is my data secure when using this tool?',
      answer: 'Absolutely. All conversion happens in your browser using JavaScript. Your JSON data is never sent to any server—it stays completely on your device. You can even use the tool offline once it\'s loaded.',
    },
    {
      question: 'How do I handle mixed-type arrays?',
      answer: 'When an array contains elements of different types (like strings and numbers), the converter generates a union type. For example, an array containing both "hello" and 42 would be typed as (string | number)[].',
    },
    {
      question: 'Can I add documentation to generated interfaces?',
      answer: 'Yes! Enable the "Generate JSDoc" option to add JSDoc comments to your interfaces. You can also enable "Include Examples" to add @example annotations with sample values from your JSON.',
    },
    {
      question: 'What naming conventions are supported?',
      answer: 'The tool supports camelCase, PascalCase, and snake_case for both type names and property names. You can preserve the original JSON key names or convert them to your preferred convention.',
    },
    {
      question: 'How do I use the generated TypeScript in my project?',
      answer: 'Copy the generated code or download as a .ts file, then import the interfaces in your TypeScript files. Use them for variable declarations, function parameters, API response types, and React/Angular component props.',
    },
  ] as FAQItem[],

  relatedTools: [
    {
      title: 'JSON to JavaScript',
      description: 'Convert JSON to JavaScript object literals and modules',
      icon: 'fab fa-js',
      link: '/json-to-javascript',
    },
    {
      title: 'JSON Formatter',
      description: 'Format and beautify JSON with syntax highlighting',
      icon: 'fas fa-indent',
      link: '/json-formatter',
    },
    {
      title: 'JSON Validator',
      description: 'Validate JSON syntax and structure',
      icon: 'fas fa-check-circle',
      link: '/json-validator',
    },
    {
      title: 'JSON to C#',
      description: 'Generate C# classes from JSON data',
      icon: 'fas fa-code',
      link: '/json-to-csharp',
    },
    {
      title: 'JSON to Go',
      description: 'Convert JSON to Go struct definitions',
      icon: 'fas fa-code',
      link: '/json-to-go',
    },
    {
      title: 'JSON to Python',
      description: 'Generate Python dataclasses from JSON',
      icon: 'fab fa-python',
      link: '/json-to-python',
    },
  ] as RelatedTool[],
};
