/**
 * SEO content for JSON Formatter tool
 */

import type { FeatureItem } from '@/types';

import type {
  ComparisonRow,
  FAQItem,
  HowToStep,
  RelatedTool,
  TechnicalSpec,
  UseCase,
  WhyChooseItem,
} from '@/data/json-to-openapi-seo';

type TrustBadge = { icon: string; text: string };
type EducationalSection = { title: string; content: string };

export const jsonFormatterContent = {
  // Meta
  title: 'JSON Formatter & Beautifier - Free Online JSON Pretty Print Tool',
  subtitle:
    'Format and beautify JSON online instantly with our free JSON formatter. Tree view visualization, syntax validation, data manipulation, and export options. 100% client-side processing for maximum privacy.',
  description:
    'Free online JSON formatter and beautifier. Pretty print JSON with syntax highlighting, tree view, validation, and data cleaning options. Client-side processing - your data stays private.',

  // Trust Badges
  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-shield-alt', text: 'Client-Side' },
    { icon: 'fas fa-bolt', text: 'Instant Results' },
    { icon: 'fas fa-tree', text: 'Tree View' },
    { icon: 'fas fa-check-circle', text: 'Validation' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
  ] as TrustBadge[],

  // Section Titles (H2 headings)
  howToSectionTitle: 'How to Format JSON Online (Step-by-Step)',
  featuresSectionTitle: 'JSON Formatter Features',
  whyChooseSectionTitle: 'Why Use This JSON Formatter?',
  comparisonSectionTitle: 'JSON Formatter Comparison',

  // Key Features
  features: [
    {
      icon: 'fas fa-indent',
      title: 'Instant JSON Beautification',
      description:
        'Transform unreadable JSON into beautifully formatted code with proper indentation. Choose from 2, 3, or 4 space indentation or tabs. See results in real-time as you paste or type.',
    },
    {
      icon: 'fas fa-tree',
      title: 'Interactive Tree View',
      description:
        'Visualize your JSON structure with an expandable/collapsible tree view. Navigate complex nested data easily, see data types at a glance, and copy paths to any value.',
    },
    {
      icon: 'fas fa-check-circle',
      title: 'Real-Time Validation',
      description:
        'Catch syntax errors instantly as you type. See precise error locations with line and column numbers. Get helpful error messages that explain what went wrong.',
    },
    {
      icon: 'fas fa-sort-alpha-down',
      title: 'Sort Keys Alphabetically',
      description:
        'Organize your JSON with alphabetically sorted keys at every nesting level. Perfect for version control - sorted keys produce cleaner diffs and easier code reviews.',
    },
    {
      icon: 'fas fa-broom',
      title: 'Data Cleaning Options',
      description:
        'Remove null values, empty strings, empty arrays, and empty objects with one click. Clean up messy data and reduce file size by stripping unnecessary values.',
    },
    {
      icon: 'fas fa-compress-arrows-alt',
      title: 'One-Click Minification',
      description:
        'Switch between beautified and minified output instantly. Compress JSON for production or expand for debugging - all without re-pasting your data.',
    },
    {
      icon: 'fas fa-search',
      title: 'Search & Navigate',
      description:
        'Find any key or value in your JSON with powerful search. Navigate between matches with keyboard shortcuts. Filter large datasets to show only what you need.',
    },
    {
      icon: 'fas fa-lock',
      title: '100% Client-Side Processing',
      description:
        'Your JSON never leaves your browser. All formatting happens locally using JavaScript. Safe for sensitive configuration files, API keys, and production data.',
    },
  ] as FeatureItem[],

  // How-To Steps
  howToSteps: [
    {
      number: 1,
      title: 'Paste or Upload Your JSON',
      description:
        'Copy your JSON data from any source and paste it into the input panel. You can also drag-and-drop a .json file or click to upload. The tool handles files up to 10MB.',
    },
    {
      number: 2,
      title: 'View Instant Validation',
      description:
        'As soon as you paste, the validator checks your JSON syntax in real-time. Valid JSON shows a green checkmark. Errors display with exact line and column numbers.',
    },
    {
      number: 3,
      title: 'Configure Formatting Options',
      description:
        'Choose your preferred indentation (2, 3, 4 spaces or tabs). Enable "Sort Keys" for alphabetical ordering. Toggle cleaning options to remove nulls or empty values.',
    },
    {
      number: 4,
      title: 'Explore with Tree View',
      description:
        'Switch to Tree View to navigate your JSON visually. Expand and collapse nodes, search for specific keys or values, and click any node to copy its path.',
    },
    {
      number: 5,
      title: 'Copy or Download Your JSON',
      description:
        'Click "Copy" to copy the formatted output to your clipboard, or "Download" to save it as a file. Use our <a href="/json-diff">JSON Diff tool</a> to compare versions.',
    },
  ] as HowToStep[],

  // Educational Content
  educational: [
    {
      title: 'What is JSON Formatting?',
      content:
        'JSON formatting (also called pretty printing or beautification) is the process of adding proper indentation, line breaks, and whitespace to make JSON human-readable. Formatted JSON is easier to read, debug, and maintain, while minified JSON is smaller for data transfer.',
    },
    {
      title: 'Why Use a JSON Formatter?',
      content:
        'API responses and database exports often return minified JSON that is hard to read. A JSON formatter makes this data readable by adding structure and indentation. It also validates syntax, helping you catch errors before they cause problems in your application.',
    },
    {
      title: 'Best Practices for JSON',
      content:
        'Always validate JSON before use in production. Use consistent indentation (2 spaces is common). Sort keys for predictable output in version control. Remove unnecessary data (nulls, empty values) to reduce payload sizes. Keep string values properly escaped.',
    },
  ] as EducationalSection[],

  // Use Cases
  useCases: [
    {
      icon: 'fas fa-bug',
      title: 'API Debugging',
      description:
        'Format API responses to quickly understand data structures. Identify missing fields, incorrect types, or unexpected values. Tree view makes navigating complex responses effortless.',
    },
    {
      icon: 'fas fa-code-branch',
      title: 'Version Control',
      description:
        'Sort keys and format JSON consistently before committing to Git. Consistent formatting produces cleaner diffs and makes code reviews easier. Avoid merge conflicts from formatting changes.',
    },
    {
      icon: 'fas fa-file-alt',
      title: 'Documentation',
      description:
        'Format JSON examples for API documentation, tutorials, or technical specifications. Readable JSON helps developers understand your data structures quickly.',
    },
    {
      icon: 'fas fa-database',
      title: 'Data Analysis',
      description:
        'Navigate and explore JSON datasets with tree view. Search for specific values across large files. Clean data by removing nulls and empty values before processing.',
    },
  ] as UseCase[],

  // Why Choose
  whyChoose: [
    {
      title: 'Feature-Rich Interface',
      description:
        'More than just formatting. Tree view visualization, search, validation, data cleaning, and multiple output options all in one tool. No need to switch between multiple sites.',
    },
    {
      title: 'Instant Real-Time Results',
      description:
        'See formatted output and validation results as you type. No clicking buttons or waiting for processing. Changes apply immediately with zero delay.',
    },
    {
      title: 'Complete Privacy',
      description:
        'Your data never touches our servers. Everything happens in your browser using client-side JavaScript. Safe for API keys, credentials, and sensitive configuration data.',
    },
    {
      title: 'Flexible Formatting',
      description:
        'Choose from presets or customize every option. 2, 3, or 4 space indentation, tabs, sorted keys, cleaned data - format JSON exactly how you need it.',
    },
    {
      title: 'Works Everywhere',
      description:
        'No installation required. Works in any modern browser on desktop or mobile. No signup, no downloads, no plugins. Just paste your JSON and go.',
    },
    {
      title: 'Developer-Friendly',
      description:
        'Keyboard shortcuts, copy JSON paths, download files, auto-fix common errors. Built by developers for developers with productivity in mind.',
    },
  ] as WhyChooseItem[],

  // Technical Specifications
  technicalSpecs: [
    { feature: 'Max File Size', specification: '10 MB (browser memory permitting)' },
    { feature: 'Processing Speed', specification: '< 100ms for 1MB files' },
    { feature: 'Indentation Options', specification: '2, 3, 4 spaces, or tabs' },
    { feature: 'View Modes', specification: 'Code view, Tree view, Split view' },
    { feature: 'Unicode Support', specification: 'Full UTF-8 support' },
    { feature: 'Browser Support', specification: 'Chrome, Firefox, Safari, Edge' },
    { feature: 'Data Privacy', specification: '100% client-side processing' },
    { feature: 'Export Options', specification: 'Copy to clipboard, download JSON' },
  ] as TechnicalSpec[],

  // Comparison Table
  comparison: [
    {
      feature: 'Price',
      ourTool: '100% Free',
      competitorA: 'Free with limits',
      competitorB: 'Freemium',
    },
    {
      feature: 'Privacy',
      ourTool: 'Client-side only',
      competitorA: 'Server processing',
      competitorB: 'Server processing',
    },
    {
      feature: 'Tree View',
      ourTool: 'Full tree view',
      competitorA: 'Basic only',
      competitorB: 'Premium feature',
    },
    {
      feature: 'Validation',
      ourTool: 'Real-time',
      competitorA: 'On submit',
      competitorB: 'Real-time',
    },
    {
      feature: 'Data Cleaning',
      ourTool: 'Remove nulls, empty',
      competitorA: 'No',
      competitorB: 'Limited',
    },
    {
      feature: 'Sort Keys',
      ourTool: 'Yes',
      competitorA: 'No',
      competitorB: 'Yes',
    },
    {
      feature: 'Ads',
      ourTool: 'None',
      competitorA: 'Multiple',
      competitorB: 'Some',
    },
    {
      feature: 'Signup Required',
      ourTool: 'No',
      competitorA: 'No',
      competitorB: 'For features',
    },
  ] as ComparisonRow[],

  // FAQs
  faqs: [
    {
      question: 'What is JSON formatting?',
      answer:
        'JSON formatting (or pretty printing) adds proper indentation, line breaks, and spacing to JSON data to make it human-readable. Unformatted JSON is a single line of text, while formatted JSON has clear structure that makes it easy to understand.',
    },
    {
      question: 'Is my JSON data secure?',
      answer:
        'Yes, completely. All processing happens in your browser using JavaScript. Your JSON data never leaves your computer and is never sent to our servers. This makes it safe for sensitive data like API keys and credentials.',
    },
    {
      question: 'What is the maximum file size?',
      answer:
        'Our tool handles JSON files up to 10MB comfortably. Larger files may work depending on your browser\'s available memory. For very large files, consider using a command-line tool or splitting the data.',
    },
    {
      question: 'Can I format invalid JSON?',
      answer:
        'No, the JSON must be valid for formatting to work. However, our validator shows you exactly where the syntax error is located with line and column numbers, so you can fix it quickly.',
    },
    {
      question: 'What indentation should I use?',
      answer:
        '2 spaces is the most common choice and works well for most JSON. 4 spaces provides more visual separation for deeply nested data. Tabs are preferred by some teams for their flexibility. The best choice depends on your project\'s style guide.',
    },
    {
      question: 'What does sorting keys do?',
      answer:
        'Sorting keys arranges all object keys in alphabetical order at every nesting level. This produces consistent output regardless of the original key order, which is helpful for version control and comparing JSON files.',
    },
    {
      question: 'How do I use the tree view?',
      answer:
        'Click on the Tree View tab to see your JSON as an expandable tree. Click nodes to expand or collapse them. Use the search box to find specific keys or values. Click the copy icon next to any node to copy its path.',
    },
    {
      question: 'Can I remove null values from JSON?',
      answer:
        'Yes! Enable the "Remove Null Values" option in the Clean panel. This removes all null values from your JSON output. You can also remove empty strings, empty arrays, and empty objects.',
    },
    {
      question: 'Does the tool work offline?',
      answer:
        'Once the page is loaded, the tool works entirely in your browser. However, you need an internet connection to initially load the page. For fully offline use, consider a desktop JSON editor.',
    },
    {
      question: 'How do I minify JSON?',
      answer:
        'Click the "Minify" button in the toolbar to compress your JSON by removing all whitespace. The minified output is a single line that\'s smaller but harder to read. Use minify for production and beautify for development.',
    },
  ] as FAQItem[],

  // Related Tools
  relatedTools: [
    {
      title: 'JSON Validator',
      description: 'Validate JSON syntax and find errors',
      icon: 'fas fa-check-circle',
      link: '/json-validator',
    },
    {
      title: 'JSON Minifier',
      description: 'Compress JSON by removing whitespace',
      icon: 'fas fa-compress-arrows-alt',
      link: '/json-minifier',
    },
    {
      title: 'JSON Diff',
      description: 'Compare two JSON documents side by side',
      icon: 'fas fa-not-equal',
      link: '/json-diff',
    },
    {
      title: 'JSON to YAML',
      description: 'Convert JSON to YAML format',
      icon: 'fas fa-arrow-right',
      link: '/json-to-yaml',
    },
    {
      title: 'JSON Editor',
      description: 'Visual JSON editor with tree view',
      icon: 'fas fa-edit',
      link: '/json-editor',
    },
    {
      title: 'JSON to Excel',
      description: 'Convert JSON to Excel spreadsheet',
      icon: 'fas fa-file-excel',
      link: '/json-to-excel',
    },
  ] as RelatedTool[],
};
