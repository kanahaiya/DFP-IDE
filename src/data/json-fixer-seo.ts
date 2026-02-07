/**
 * JSON Fixer SEO Data
 * SEO content and metadata for JSON Fixer tool
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

export const jsonFixerSEO = {
  // Primary Keywords
  primaryKeyword: 'JSON Fixer Online',
  secondaryKeywords: [
    'json syntax debugger',
    'interactive json fixer',
    'json error finder',
    'fix json errors online',
    'json debugging tool',
  ],
  
  // Meta Information
  title: 'JSON Fixer Online - Interactive JSON Debugging & Error Fixing',
  description: 'Debug and fix JSON errors interactively with detailed explanations. See all errors at once, understand why they occur, and fix them one by one. Free online JSON fixer.',
  
  // Hero Section
  heroTitle: 'JSON Fixer',
  heroSubtitle: 'Interactive JSON Debugging',
  heroDescription: 'Debug JSON errors interactively with detailed explanations. See all errors at once, understand why each occurs, and fix them one by one. Learn JSON syntax while fixing.',
  
  // Features
  features: [
    {
      icon: 'fas fa-list',
      title: 'See All Errors',
      description: 'View every JSON error in one list with line numbers and descriptions.',
    },
    {
      icon: 'fas fa-graduation-cap',
      title: 'Educational Mode',
      description: 'Learn JSON syntax through detailed explanations of each error type.',
    },
    {
      icon: 'fas fa-mouse-pointer',
      title: 'Click to Navigate',
      description: 'Click any error to jump directly to its location in the editor.',
    },
    {
      icon: 'fas fa-eye',
      title: 'Fix Preview',
      description: 'See before/after comparison before applying any fix.',
    },
    {
      icon: 'fas fa-filter',
      title: 'Filter by Severity',
      description: 'Focus on critical errors first by filtering by severity level.',
    },
    {
      icon: 'fas fa-lock',
      title: '100% Private',
      description: 'All processing happens in your browser. No data leaves your device.',
    },
  ] as FeatureItem[],
  
  // How-to Steps
  howToSteps: [
    {
      number: 1,
      title: 'Paste Your JSON',
      description: 'Paste your broken JSON into the editor. Errors are detected automatically.',
    },
    {
      number: 2,
      title: 'Review Errors',
      description: 'See all errors listed with severity levels, locations, and explanations.',
    },
    {
      number: 3,
      title: 'Fix One by One',
      description: 'Click on any error to see its location. Click Fix to apply the suggested correction.',
    },
    {
      number: 4,
      title: 'Learn & Export',
      description: 'Read explanations to learn JSON syntax. Copy your fixed JSON when done.',
    },
  ] as HowToStep[],
  
  // Educational Content
  educationalContent: [
    {
      title: 'What is JSON Fixer?',
      content: 'JSON Fixer is an interactive debugging tool that shows ALL JSON syntax errors at once, explains each error type, and lets you fix them one by one with preview. Perfect for learning JSON syntax while fixing your data.',
      type: 'info',
    },
    {
      title: 'JSON Fixer vs JSON Repair',
      content: 'JSON Fixer shows errors interactively so you can learn and fix them manually. JSON Repair automatically fixes everything with one click. Use Fixer when you want to learn; use Repair when you just need quick results.',
      type: 'explanation',
    },
    {
      title: 'Error Severity Levels',
      content: 'Critical: Prevents parsing entirely (missing brackets). High: Major syntax errors (wrong quotes). Medium: Common issues (wrong capitalization). Low: Minor issues (trailing commas).',
      type: 'info',
    },
    {
      title: 'Learning JSON Syntax',
      content: 'Enable "Show Explanations" in settings to see detailed information about each error type. The explanations include examples of correct vs incorrect syntax.',
      type: 'tip',
    },
  ] as EducationalSection[],
  
  // Use Cases
  useCases: [
    {
      title: 'Learning JSON',
      description: 'Understand JSON syntax through interactive error explanations and examples.',
      icon: 'fas fa-graduation-cap',
    },
    {
      title: 'Debugging APIs',
      description: 'Find and fix specific errors in API responses systematically.',
      icon: 'fas fa-bug',
    },
    {
      title: 'Code Review',
      description: 'Review JSON files for errors before committing to version control.',
      icon: 'fas fa-code-branch',
    },
    {
      title: 'Data Quality',
      description: 'Identify patterns of errors in JSON data from various sources.',
      icon: 'fas fa-chart-line',
    },
    {
      title: 'Teaching',
      description: 'Demonstrate JSON syntax rules and common mistakes to students.',
      icon: 'fas fa-chalkboard-teacher',
    },
    {
      title: 'Precision Fixing',
      description: 'Fix specific errors while preserving others for testing purposes.',
      icon: 'fas fa-crosshairs',
    },
  ] as UseCase[],
  
  // Technical Specifications
  technicalSpecs: [
    { feature: 'Error Detection', specification: 'All syntax errors found simultaneously' },
    { feature: 'Severity Levels', specification: 'Critical, High, Medium, Low' },
    { feature: 'Error Categories', specification: 'Syntax, Structure, Value, Formatting, Encoding, Semantic' },
    { feature: 'Fix Preview', specification: 'Before/after comparison' },
    { feature: 'Fix Confidence', specification: 'High, Medium, Low' },
    { feature: 'Auto-Detection', specification: 'Real-time with 300ms debounce' },
    { feature: 'Max File Size', specification: '10MB' },
    { feature: 'Processing', specification: '100% browser-based' },
  ] as TechnicalSpec[],
  
  // FAQs
  faq: [
    {
      question: 'What is the difference between JSON Fixer and JSON Repair?',
      answer: 'JSON Fixer is interactive - it shows you all errors and lets you fix them one by one with explanations. JSON Repair automatically fixes everything with one click. Use Fixer to learn and understand errors; use Repair for quick automated fixing.',
    },
    {
      question: 'How do I use JSON Fixer to learn JSON syntax?',
      answer: 'Enable "Show Explanations" in the settings panel. Each error type will display a detailed explanation with examples of correct vs incorrect JSON syntax. This helps you understand why each error occurs and how to avoid it.',
    },
    {
      question: 'Can I fix all errors at once?',
      answer: 'Yes! Click "Fix All (High Confidence)" to automatically apply all fixes that the tool is highly confident about. For complex or ambiguous errors, you can review and fix them individually.',
    },
    {
      question: 'Why are some fixes marked as low confidence?',
      answer: 'Some errors have multiple possible fixes. For example, a bracket mismatch could be fixed by adding or removing brackets. The tool marks these as low confidence so you can review and choose the correct fix.',
    },
    {
      question: 'Is my JSON data secure?',
      answer: 'Yes, completely secure. All error detection and fixing happens in your browser using JavaScript. No data is ever sent to any server.',
    },
    {
      question: 'What error categories does JSON Fixer detect?',
      answer: 'We detect six categories: Syntax (quotes, commas), Structure (brackets, braces), Value (booleans, nulls), Formatting (trailing commas, comments), Encoding (escape sequences), and Semantic (duplicate keys).',
    },
  ] as FAQItem[],
  
  // Related Tools
  relatedTools: [
    { name: 'JSON Repair', url: '/json-repair', description: 'Auto-fix all errors' },
    { name: 'JSON Validator', url: '/json-validator', description: 'Validate JSON syntax' },
    { name: 'JSON Formatter', url: '/json-formatter', description: 'Beautify JSON' },
    { name: 'JSON Cleaner', url: '/json-cleaner', description: 'Clean and transform' },
  ],
};
