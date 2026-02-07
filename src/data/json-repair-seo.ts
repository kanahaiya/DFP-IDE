/**
 * JSON Repair SEO Data
 * SEO content and metadata for JSON Repair tool
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

export const jsonRepairSEO = {
  // Primary Keywords
  primaryKeyword: 'JSON Repair Tool',
  secondaryKeywords: [
    'fix broken json',
    'json fixer online',
    'repair invalid json',
    'json syntax error fix',
    'auto fix json',
  ],
  
  // Meta Information
  title: 'JSON Repair Tool - Fix Broken JSON Online Free',
  description: 'Automatically repair broken JSON syntax online. Fix quotes, commas, brackets, and more. Free JSON repair tool with instant results. 100% browser-based and private.',
  
  // Hero Section
  heroTitle: 'JSON Repair Tool',
  heroSubtitle: 'Fix Broken JSON Automatically',
  heroDescription: 'Automatically repair common JSON syntax errors with one click. Fix quotes, commas, brackets, boolean values, and more. Fast, free, and completely private.',
  
  // Features
  features: [
    {
      icon: 'fas fa-magic',
      title: 'One-Click Repair',
      description: 'Automatically fix all common JSON errors with a single click. No manual editing required.',
    },
    {
      icon: 'fas fa-quote-right',
      title: 'Quote Fixing',
      description: 'Convert single quotes to double, fix curly quotes, and add missing quotes to keys.',
    },
    {
      icon: 'fas fa-comma',
      title: 'Punctuation Repair',
      description: 'Fix trailing commas, add missing commas between elements, and correct colon issues.',
    },
    {
      icon: 'fas fa-code',
      title: 'Bracket Matching',
      description: 'Auto-close unclosed brackets and braces, fix mismatched pairs.',
    },
    {
      icon: 'fas fa-robot',
      title: 'LLM Output Mode',
      description: 'Specialized mode for fixing JSON from ChatGPT, Claude, and other AI outputs.',
    },
    {
      icon: 'fas fa-lock',
      title: 'Privacy First',
      description: 'All repairs happen in your browser. No data uploaded to servers.',
    },
  ] as FeatureItem[],
  
  // How-to Steps
  howToSteps: [
    {
      number: 1,
      title: 'Paste Your Broken JSON',
      description: 'Copy and paste your broken JSON into the input editor. You can also upload a file or load from URL.',
    },
    {
      number: 2,
      title: 'Choose Repair Mode',
      description: 'Select a repair mode: Strict for safe fixes, Standard for balanced repair, or Lenient for aggressive fixing.',
    },
    {
      number: 3,
      title: 'Click Repair',
      description: 'Click the "Repair JSON" button to automatically fix all detected syntax errors.',
    },
    {
      number: 4,
      title: 'Review & Copy',
      description: 'Review the repair summary and copy or download your fixed JSON.',
    },
  ] as HowToStep[],
  
  // Educational Content
  educationalContent: [
    {
      title: 'What is JSON Repair?',
      content: 'JSON repair is the process of automatically fixing syntax errors in JSON data. Common errors include missing quotes, trailing commas, and incorrect boolean values. Our tool uses advanced parsing to detect and fix these issues automatically.',
      type: 'info',
    },
    {
      title: 'Common JSON Errors We Fix',
      content: 'Single quotes instead of double quotes, unquoted object keys, trailing commas after the last element, Boolean/null capitalization (True → true, NULL → null), JavaScript comments, JSONP wrappers, and MongoDB extended JSON types.',
      type: 'explanation',
    },
    {
      title: 'When to Use JSON Repair',
      content: 'Use JSON Repair when you receive broken JSON from APIs, copy-paste from documentation, LLM outputs, or manual editing mistakes. It\'s perfect for quick fixes when you need valid JSON fast.',
      type: 'tip',
    },
    {
      title: 'JSON Repair vs JSON Fixer',
      content: 'JSON Repair automatically fixes all errors at once - great for speed. JSON Fixer shows you each error interactively - great for learning and understanding what went wrong.',
      type: 'info',
    },
  ] as EducationalSection[],
  
  // Use Cases
  useCases: [
    {
      title: 'API Response Repair',
      description: 'Fix malformed JSON from buggy API responses or incomplete data transfers.',
      icon: 'fas fa-server',
    },
    {
      title: 'LLM Output Fixing',
      description: 'Repair JSON from ChatGPT, Claude, or other AI tools that sometimes produce invalid JSON.',
      icon: 'fas fa-robot',
    },
    {
      title: 'Copy-Paste Errors',
      description: 'Fix JSON corrupted by word processors that convert quotes to curly quotes.',
      icon: 'fas fa-paste',
    },
    {
      title: 'JavaScript to JSON',
      description: 'Convert JavaScript object notation (with single quotes, unquoted keys) to valid JSON.',
      icon: 'fas fa-js',
    },
    {
      title: 'Configuration Files',
      description: 'Repair JSON config files that have been manually edited with syntax errors.',
      icon: 'fas fa-cog',
    },
    {
      title: 'Data Migration',
      description: 'Fix JSON exports from NoSQL databases that include MongoDB-specific types.',
      icon: 'fas fa-database',
    },
  ] as UseCase[],
  
  // Technical Specifications
  technicalSpecs: [
    { feature: 'Quote Repair', specification: 'Single to double, curly to straight, add missing' },
    { feature: 'Comma Handling', specification: 'Add missing, remove trailing' },
    { feature: 'Bracket Repair', specification: 'Auto-close unclosed brackets and braces' },
    { feature: 'Value Fixing', specification: 'Boolean, null, undefined, NaN, Infinity' },
    { feature: 'Comment Removal', specification: '// and /* */ style comments' },
    { feature: 'JSONP Support', specification: 'Unwrap callback() wrappers' },
    { feature: 'MongoDB Types', specification: 'ObjectId, NumberLong, ISODate, etc.' },
    { feature: 'Max File Size', specification: '10MB' },
    { feature: 'Processing', specification: '100% browser-based' },
    { feature: 'Privacy', specification: 'No data uploaded to servers' },
  ] as TechnicalSpec[],
  
  // FAQs
  faq: [
    {
      question: 'What types of JSON errors can this tool fix?',
      answer: 'Our JSON repair tool fixes quotes (single to double, curly to straight), missing/trailing commas, unclosed brackets, boolean capitalization (True→true), null values (NULL→null, None→null), JavaScript comments, JSONP wrappers, MongoDB types, and more.',
    },
    {
      question: 'Is my JSON data secure?',
      answer: 'Yes, 100% secure. All repair operations happen entirely in your browser using JavaScript. No data is ever sent to our servers or stored anywhere. Your JSON stays completely private.',
    },
    {
      question: 'What is the difference between repair modes?',
      answer: 'Strict Mode only makes safe, obvious fixes. Standard Mode provides balanced repair for most use cases. Lenient Mode aggressively repairs severely broken JSON. LLM Mode is optimized for AI-generated output.',
    },
    {
      question: 'Can this tool repair any broken JSON?',
      answer: 'Our tool can repair most common JSON syntax errors. However, extremely corrupted JSON or data with logical errors (wrong values, missing data) cannot be automatically fixed. In those cases, try our interactive JSON Fixer for manual debugging.',
    },
    {
      question: 'Does the repair change my data values?',
      answer: 'No, the repair tool only fixes syntax errors. Your actual data values remain unchanged. The only changes are structural fixes like quotes, commas, and brackets.',
    },
    {
      question: 'What happens to JavaScript comments in my JSON?',
      answer: 'JSON does not support comments (they are not part of the JSON specification). Our tool removes // and /* */ comments during repair to produce valid JSON.',
    },
    {
      question: 'How do I handle JSON from MongoDB exports?',
      answer: 'Enable MongoDB type fixing in options or use Lenient mode. The tool will convert ObjectId(), NumberLong(), ISODate(), and other MongoDB extended JSON types to standard JSON values.',
    },
    {
      question: 'Can I use this for JSON from ChatGPT or Claude?',
      answer: 'Yes! We have a dedicated LLM Output mode optimized for AI-generated JSON. It handles common issues like trailing commas, incorrect quote styles, and markdown code blocks.',
    },
  ] as FAQItem[],
  
  // Related Tools
  relatedTools: [
    { name: 'JSON Validator', url: '/json-validator', description: 'Validate JSON syntax' },
    { name: 'JSON Fixer', url: '/json-fixer', description: 'Interactive error debugging' },
    { name: 'JSON Formatter', url: '/json-formatter', description: 'Beautify JSON' },
    { name: 'JSON Minifier', url: '/json-minifier', description: 'Compress JSON' },
    { name: 'JSON Cleaner', url: '/json-cleaner', description: 'Clean and transform JSON' },
  ],
};
