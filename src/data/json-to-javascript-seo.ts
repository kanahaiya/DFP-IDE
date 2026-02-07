/**
 * SEO Content for JSON to JavaScript Converter
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

export const jsonToJavaScriptSEO = {
  title: 'JSON to JavaScript Converter - Generate Object Literals & Modules',
  subtitle: 'Convert JSON to JavaScript object literals instantly. Generate const/let/var declarations, ES6 modules, CommonJS exports, and UMD modules. Free online tool.',
  description: 'Free online JSON to JavaScript converter with ES6 modules and object literal generation',

  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-shield-alt', text: 'Secure & Private' },
    { icon: 'fas fa-bolt', text: 'Instant Results' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
    { icon: 'fab fa-js', text: 'ES6+ Support' },
    { icon: 'fas fa-code', text: 'Multiple Formats' },
  ] as TrustBadge[],

  features: [
    {
      icon: 'fas fa-code',
      title: 'Object Literals',
      description: 'Convert JSON to clean JavaScript object literals with proper formatting and syntax.',
    },
    {
      icon: 'fab fa-js',
      title: 'Variable Declarations',
      description: 'Generate const, let, or var declarations with your preferred variable name.',
    },
    {
      icon: 'fas fa-file-export',
      title: 'ES6 Modules',
      description: 'Export as default or named ES6 modules for modern JavaScript projects.',
    },
    {
      icon: 'fab fa-node',
      title: 'CommonJS Support',
      description: 'Generate module.exports for Node.js and CommonJS environments.',
    },
    {
      icon: 'fas fa-globe',
      title: 'UMD Modules',
      description: 'Universal Module Definition for browser and Node.js compatibility.',
    },
    {
      icon: 'fas fa-snowflake',
      title: 'Object.freeze',
      description: 'Optionally freeze objects for immutable data structures.',
    },
  ] as FeatureItem[],

  howToSectionTitle: 'How to Convert JSON to JavaScript',

  howToSteps: [
    {
      number: 1,
      title: 'Paste Your JSON',
      description: 'Copy your JSON data from any source—API response, config file, or database—and paste it into the input editor. Real-time validation highlights any syntax errors.',
    },
    {
      number: 2,
      title: 'Configure Output',
      description: 'Choose your variable declaration (const/let/var), export format (ES6, CommonJS, UMD), quote style, and formatting preferences.',
    },
    {
      number: 3,
      title: 'Generate JavaScript',
      description: 'Your JavaScript code is generated instantly as you type. The converter handles all formatting, escaping, and module syntax.',
    },
    {
      number: 4,
      title: 'Copy or Download',
      description: 'Click Copy to clipboard or Download as a .js file. Use the generated code directly in your JavaScript project.',
    },
  ] as HowToStep[],

  educationalContent: [
    {
      title: 'JSON vs JavaScript Objects',
      content: 'JSON (JavaScript Object Notation) is a text format for data interchange, while JavaScript objects are actual language constructs. JSON requires double-quoted string keys and doesn\'t support functions, undefined, or trailing commas. This converter transforms JSON into valid JavaScript object literals, handling these differences automatically.',
      type: 'info',
    },
    {
      title: 'Module Formats Explained',
      content: 'ES6 modules use import/export syntax and are the modern standard for JavaScript modules. CommonJS (module.exports) is used in Node.js. UMD (Universal Module Definition) works in both browser and Node.js environments. Choose the format that matches your project\'s module system.',
      type: 'tip',
    },
    {
      title: 'When to Use Object.freeze',
      content: 'Object.freeze() makes an object immutable, preventing property additions, deletions, or modifications. Use it for configuration objects or constants that should never change. Note that freeze is shallow—nested objects remain mutable unless also frozen.',
      type: 'info',
    },
  ] as EducationalSection[],

  useCases: [
    {
      title: 'Configuration Files',
      description: 'Convert JSON configuration into JavaScript modules for use in your application, with proper exports for import statements.',
      icon: 'fas fa-cog',
    },
    {
      title: 'Mock Data',
      description: 'Transform API response JSON into JavaScript objects for unit tests, storybook stories, or development fixtures.',
      icon: 'fas fa-database',
    },
    {
      title: 'Seed Data',
      description: 'Convert database seed data from JSON to JavaScript modules for use in migration scripts or test setups.',
      icon: 'fas fa-seedling',
    },
    {
      title: 'Static Data',
      description: 'Generate JavaScript constants from JSON data like country codes, currency lists, or other reference data.',
      icon: 'fas fa-list',
    },
  ] as UseCase[],

  whyChooseSectionTitle: 'Why Choose Our JSON to JavaScript Converter?',

  whyChoose: [
    {
      icon: 'fas fa-magic',
      title: 'Smart Formatting',
      description: 'Automatically formats output with proper indentation, quotes, and trailing commas based on your preferences.',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Privacy First',
      description: 'All processing happens in your browser. Your data never leaves your device—complete privacy guaranteed.',
    },
    {
      icon: 'fas fa-sliders-h',
      title: 'Flexible Output',
      description: 'Choose between ES6 modules, CommonJS, UMD, or plain object literals with customizable formatting.',
    },
    {
      icon: 'fas fa-rocket',
      title: 'Instant Generation',
      description: 'Real-time conversion as you type. No waiting, no submit buttons—just instant JavaScript output.',
    },
  ] as WhyChooseItem[],

  technicalSpecs: [
    { feature: 'Variable Types', specification: 'const, let, var, none' },
    { feature: 'Export Formats', specification: 'ES6, CommonJS, UMD' },
    { feature: 'Quote Styles', specification: 'Single or double quotes' },
    { feature: 'Trailing Commas', specification: 'Optional' },
    { feature: 'Max File Size', specification: 'Up to 10MB JSON' },
    { feature: 'Processing', specification: '100% client-side' },
    { feature: 'Export Options', specification: '.js file download' },
    { feature: 'Browser Support', specification: 'Chrome, Firefox, Safari, Edge' },
  ] as TechnicalSpec[],

  comparisonSectionTitle: 'JSON to JavaScript Converter Comparison',

  comparison: [
    { feature: 'Free to Use', ourTool: '✓ Unlimited', competitorA: 'Limited', competitorB: 'Paid' },
    { feature: 'Privacy', ourTool: '✓ Client-side', competitorA: 'Server upload', competitorB: 'Server upload' },
    { feature: 'ES6 Modules', ourTool: '✓', competitorA: '✗', competitorB: '✓' },
    { feature: 'CommonJS', ourTool: '✓', competitorA: '✓', competitorB: '✗' },
    { feature: 'UMD', ourTool: '✓', competitorA: '✗', competitorB: '✗' },
    { feature: 'Object.freeze', ourTool: '✓', competitorA: '✗', competitorB: '✗' },
    { feature: 'Quote Options', ourTool: '✓ Both', competitorA: 'Single only', competitorB: 'Double only' },
    { feature: 'Presets', ourTool: '✓ 10 presets', competitorA: '✗', competitorB: '✗' },
  ] as ComparisonRow[],

  faqs: [
    {
      question: 'What is the difference between JSON and a JavaScript object?',
      answer: 'JSON is a text-based data format used for data interchange, while a JavaScript object is a data structure in the JavaScript language. JSON requires double-quoted keys, doesn\'t allow trailing commas, and can\'t contain functions or undefined values. JavaScript objects are more flexible and are actual code constructs.',
    },
    {
      question: 'Should I use const, let, or var?',
      answer: 'Use const for values that won\'t be reassigned (most common for data). Use let if you need to reassign the variable later. Avoid var in modern JavaScript—it has function scope instead of block scope and can lead to bugs.',
    },
    {
      question: 'What\'s the difference between ES6 and CommonJS modules?',
      answer: 'ES6 modules use import/export syntax and are the modern JavaScript standard, supported natively in browsers and Node.js 14+. CommonJS uses require()/module.exports and is the traditional Node.js module system. ES6 modules support static analysis and tree-shaking.',
    },
    {
      question: 'When should I use UMD format?',
      answer: 'Use UMD (Universal Module Definition) when you need your code to work in multiple environments—AMD loaders, CommonJS (Node.js), and browser globals. It\'s useful for libraries that need to support various consumption methods.',
    },
    {
      question: 'Why would I use Object.freeze?',
      answer: 'Object.freeze() prevents modifications to an object, making it immutable. Use it for configuration objects, constants, or any data that shouldn\'t change at runtime. It helps catch accidental mutations and can improve code reliability.',
    },
    {
      question: 'Is my data secure when using this tool?',
      answer: 'Yes. All conversion happens entirely in your browser using JavaScript. Your JSON data is never sent to any server—it stays completely on your device. You can even use the tool offline once it\'s loaded.',
    },
    {
      question: 'Can I customize the output formatting?',
      answer: 'Yes! You can choose quote style (single or double), whether to quote all keys, trailing commas, semicolons, indentation size (spaces or tabs), and whether to add comments. Presets are available for common configurations.',
    },
    {
      question: 'How do I use the generated JavaScript in my project?',
      answer: 'Copy the generated code or download as a .js file. For ES6 modules, import it using import syntax. For CommonJS, use require(). For plain objects, include the file and reference the variable name.',
    },
  ] as FAQItem[],

  relatedTools: [
    {
      title: 'JSON to TypeScript',
      description: 'Generate TypeScript interfaces from JSON',
      icon: 'fas fa-code',
      link: '/json-to-typescript',
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
      title: 'JSON to YAML',
      description: 'Convert JSON to YAML configuration format',
      icon: 'fas fa-file-alt',
      link: '/json-to-yaml',
    },
    {
      title: 'JSON Minifier',
      description: 'Compress JSON by removing whitespace',
      icon: 'fas fa-compress-alt',
      link: '/json-minifier',
    },
    {
      title: 'JSON to Python',
      description: 'Generate Python dataclasses from JSON',
      icon: 'fab fa-python',
      link: '/json-to-python',
    },
  ] as RelatedTool[],
};
