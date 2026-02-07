/**
 * JSON Validator SEO Data
 * SEO content and metadata for JSON Validator tool
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

export const jsonValidatorSEO = {
  // Primary Keywords
  primaryKeyword: 'JSON Validator Online',
  secondaryKeywords: [
    'validate json',
    'json syntax checker',
    'json lint online',
    'json error checker',
    'json format validator',
  ],
  
  // Meta Information
  title: 'JSON Validator Online Free - Syntax Checker & Auto-Fix',
  description: 'Validate JSON syntax instantly with detailed error messages. Free online JSON validator with auto-fix, line numbers, and RFC 8259 compliance. No signup required.',
  
  // Hero Section
  heroTitle: 'JSON Validator',
  heroSubtitle: 'Validate & Fix JSON Syntax Online',
  heroDescription: 'Instantly validate your JSON with detailed error reporting, auto-fix capabilities, and statistics. RFC 8259 compliant with support for multiple standards.',
  
  // Features
  features: [
    {
      icon: 'fas fa-check-circle',
      title: 'Instant Validation',
      description: 'Real-time JSON syntax validation with 300ms debounce for smooth performance.',
    },
    {
      icon: 'fas fa-exclamation-triangle',
      title: 'Detailed Errors',
      description: 'Get precise error locations with line numbers, columns, and helpful suggestions.',
    },
    {
      icon: 'fas fa-magic',
      title: 'Auto-Fix',
      description: 'Automatically fix common errors like trailing commas, single quotes, and comments.',
    },
    {
      icon: 'fas fa-chart-bar',
      title: 'Statistics',
      description: 'View JSON stats including depth, key count, type distribution, and file size.',
    },
    {
      icon: 'fas fa-lock',
      title: 'Privacy First',
      description: 'All validation happens in your browser. Your data never leaves your device.',
    },
    {
      icon: 'fas fa-code',
      title: 'Multiple Standards',
      description: 'Support for RFC 8259, RFC 7159, and ECMA-404 validation modes.',
    },
  ] as FeatureItem[],
  
  // Use Cases
  useCases: [
    {
      title: 'API Development',
      description: 'Validate API responses and request payloads before integration.',
      icon: 'fas fa-server',
    },
    {
      title: 'Configuration Files',
      description: 'Check JSON config files for syntax errors before deployment.',
      icon: 'fas fa-cog',
    },
    {
      title: 'Data Migration',
      description: 'Validate JSON data exports before importing to new systems.',
      icon: 'fas fa-database',
    },
    {
      title: 'Debugging',
      description: 'Find and fix JSON errors in logs and debug output.',
      icon: 'fas fa-bug',
    },
  ] as UseCase[],
  
  // How To Steps
  howToSteps: [
    {
      number: 1,
      title: 'Paste Your JSON',
      description: 'Enter or paste your JSON data into the editor on the left side.',
    },
    {
      number: 2,
      title: 'View Results',
      description: 'Validation results appear instantly showing any errors with line numbers.',
    },
    {
      number: 3,
      title: 'Fix Errors',
      description: 'Use auto-fix to correct common issues or fix manually with suggestions.',
    },
    {
      number: 4,
      title: 'Copy Valid JSON',
      description: 'Once valid, copy the formatted JSON or download for use.',
    },
  ] as HowToStep[],
  
  // Educational Content
  educationalContent: [
    {
      title: 'What is JSON?',
      content: 'JSON (JavaScript Object Notation) is a lightweight data interchange format that is easy for humans to read and write. It is widely used in web APIs, configuration files, and data storage.',
      type: 'info' as const,
    },
    {
      title: 'Common JSON Errors',
      content: 'The most common JSON errors include: trailing commas after the last item, using single quotes instead of double quotes, unquoted keys, JavaScript comments, and missing closing brackets.',
      type: 'warning' as const,
    },
    {
      title: 'JSON Standards',
      content: 'RFC 8259 is the current JSON standard (2017). RFC 7159 was the previous version (2014). ECMA-404 is the ECMA International standard. All define the same core JSON syntax.',
      type: 'tip' as const,
    },
  ] as EducationalSection[],
  
  // Technical Specifications
  technicalSpecs: [
    { feature: 'Max Input Size', specification: '10 MB' },
    { feature: 'Validation Speed', specification: '< 100ms for 1MB' },
    { feature: 'Supported Standards', specification: 'RFC 8259, RFC 7159, ECMA-404' },
    { feature: 'Browser Support', specification: 'All modern browsers' },
    { feature: 'Error Precision', specification: 'Line and column level' },
    { feature: 'Auto-Fix Types', specification: '5 common error patterns' },
  ] as TechnicalSpec[],
  
  // FAQ
  faq: [
    {
      question: 'What JSON errors can be auto-fixed?',
      answer: 'The auto-fix feature can correct: single quotes to double quotes, trailing commas, JavaScript comments, unquoted keys, and JavaScript values like undefined and NaN.',
    },
    {
      question: 'Is my JSON data secure?',
      answer: 'Yes, all validation happens entirely in your browser. Your JSON data is never sent to any server or stored anywhere.',
    },
    {
      question: 'What is RFC 8259?',
      answer: 'RFC 8259 is the current Internet standard for JSON. It defines the strict syntax rules that valid JSON must follow, including double quotes for strings and no trailing commas.',
    },
    {
      question: 'Can I validate large JSON files?',
      answer: 'Yes, the validator handles files up to 10MB efficiently. For very large files, validation may take a few seconds.',
    },
    {
      question: 'What do the different validation modes do?',
      answer: 'Strict mode (RFC 8259) enforces all JSON rules. Lenient mode allows common extensions like comments and trailing commas. Config mode is optimized for configuration files.',
    },
  ] as FAQItem[],
};

export type JsonValidatorSEOData = typeof jsonValidatorSEO;
