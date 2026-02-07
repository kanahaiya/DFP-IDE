/**
 * SEO content for JSON Stats tool
 */

import type { FeatureItem } from '@/types';

import type {
  ComparisonRow,
  EducationalSection,
  FAQItem,
  HowToStep,
  RelatedTool,
  TechnicalSpec,
  UseCase,
  WhyChooseItem,
} from '@/data/json-to-openapi-seo';

type TrustBadge = { icon: string; text: string };

export const jsonStatsContent = {
  // Meta
  title: 'JSON Stats - Analyze JSON Structure, Types & Data Quality Online',
  subtitle:
    'Analyze your JSON data instantly with comprehensive statistics. Get structure analysis, type distribution, key frequency, value insights, and data quality scores. 100% client-side - your data never leaves your browser.',
  description:
    'Free online JSON statistics tool. Analyze JSON structure, data types, keys, values, and quality with real-time insights. Client-side processing for maximum privacy.',

  // Trust Badges
  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-shield-alt', text: 'Client-Side' },
    { icon: 'fas fa-chart-pie', text: 'Visual Stats' },
    { icon: 'fas fa-tachometer-alt', text: 'Real-Time' },
    { icon: 'fas fa-file-export', text: 'Export Stats' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
  ] as TrustBadge[],

  // Section Titles (H2 headings)
  howToSectionTitle: 'How to Analyze JSON Data (Step-by-Step)',
  featuresSectionTitle: 'JSON Stats Features',
  whyChooseSectionTitle: 'Why Use This JSON Analyzer?',
  comparisonSectionTitle: 'JSON Analysis Tools Comparison',

  // Key Features
  features: [
    {
      icon: 'fas fa-ruler-combined',
      title: 'Size & Complexity Metrics',
      description:
        'Get detailed size metrics including bytes, characters, lines, and minified size comparison. See exactly how much space your JSON consumes and how much you could save through minification.',
    },
    {
      icon: 'fas fa-sitemap',
      title: 'Structure Analysis',
      description:
        'Understand your JSON structure at a glance. See maximum nesting depth, total objects, arrays, keys, and values. Know if your data is deeply nested or flat, and identify structural patterns.',
    },
    {
      icon: 'fas fa-chart-pie',
      title: 'Type Distribution Chart',
      description:
        'Visualize the distribution of data types in your JSON with an interactive pie chart. See the balance of strings, numbers, booleans, nulls, objects, and arrays in your data.',
    },
    {
      icon: 'fas fa-key',
      title: 'Key Frequency Analysis',
      description:
        'Discover which keys appear most frequently in your JSON. Find duplicate keys, case variations, and naming patterns. Get insights into your data schema consistency.',
    },
    {
      icon: 'fas fa-calculator',
      title: 'Value Statistics',
      description:
        'Deep dive into your values. See string length distributions, number ranges and averages, array sizes, and more. Identify URLs, emails, and dates automatically detected in your strings.',
    },
    {
      icon: 'fas fa-check-double',
      title: 'Data Quality Score',
      description:
        'Get an overall quality score (0-100) for your JSON data. Identify issues like null values, empty strings, empty arrays, and inconsistent types. Receive actionable suggestions for improvement.',
    },
    {
      icon: 'fas fa-file-export',
      title: 'Export Statistics',
      description:
        'Export your analysis results as JSON, CSV, or Markdown. Perfect for documentation, reports, or sharing insights with your team. Customize which sections to include.',
    },
    {
      icon: 'fas fa-lock',
      title: '100% Client-Side Processing',
      description:
        'Your JSON data never leaves your browser. All analysis happens locally using JavaScript. Perfect for sensitive data, API responses, or configuration files.',
    },
  ] as FeatureItem[],

  // How-To Steps
  howToSteps: [
    {
      number: 1,
      title: 'Paste or Upload Your JSON',
      description:
        'Copy your JSON data from any source - API response, config file, database export - and paste it into the input panel. You can also drag-and-drop a .json file or click to upload. The tool handles files up to 10MB.',
    },
    {
      number: 2,
      title: 'View Instant Analysis',
      description:
        'Statistics are calculated in real-time as you type or paste. The overview dashboard shows key metrics: size, structure depth, type distribution, quality score, and more. Processing happens instantly for most files.',
    },
    {
      number: 3,
      title: 'Explore Detailed Sections',
      description:
        'Click on section tabs to dive deeper. Explore Structure for nesting analysis, Types for distribution charts, Keys for frequency data, Values for string/number stats, and Quality for issues and suggestions.',
    },
    {
      number: 4,
      title: 'Review Data Quality',
      description:
        'Check the Quality tab for your data health score. See counts of nulls, empty values, and type inconsistencies. Read suggestions for improving your JSON data quality and consistency.',
    },
    {
      number: 5,
      title: 'Export Your Analysis',
      description:
        'Click Export to save your statistics. Choose JSON for machine-readable data, CSV for spreadsheets, or Markdown for documentation. Select which sections to include. Share insights with your team or include in your documentation.',
    },
  ] as HowToStep[],

  // Educational Content
  educational: [
    {
      title: 'Why Analyze JSON Data?',
      content:
        'JSON analysis helps you understand your data structure, identify potential issues, and optimize your JSON files. Whether you\'re debugging API responses, validating configuration files, or documenting data schemas, statistics provide valuable insights that manual inspection would miss.',
    },
    {
      title: 'Understanding JSON Structure',
      content:
        'JSON (JavaScript Object Notation) consists of objects, arrays, and primitive values (strings, numbers, booleans, null). Nesting depth indicates complexity - deeply nested JSON can be harder to work with and may indicate a need for restructuring. A good balance of objects and arrays typically indicates well-organized data.',
    },
    {
      title: 'Data Quality Best Practices',
      content:
        'High-quality JSON data has consistent types for the same keys, avoids unnecessary null values, and maintains predictable structure. Type consistency is especially important for array elements - mixed types can cause issues in typed languages and data processing pipelines.',
    },
  ] as EducationalSection[],

  // Use Cases
  useCases: [
    {
      icon: 'fas fa-server',
      title: 'API Response Analysis',
      description:
        'Analyze API responses to understand data structure, verify field types, and document schemas. Identify inconsistencies between expected and actual response formats.',
    },
    {
      icon: 'fas fa-bug',
      title: 'Debugging & Troubleshooting',
      description:
        'Debug JSON data issues by examining structure, finding null values, and identifying type mismatches. The quality score highlights potential problems quickly.',
    },
    {
      icon: 'fas fa-book',
      title: 'Schema Documentation',
      description:
        'Generate statistics for documentation purposes. Export as Markdown for README files or as JSON for automated documentation tools.',
    },
    {
      icon: 'fas fa-database',
      title: 'Database Export Validation',
      description:
        'Validate JSON exports from databases before importing elsewhere. Check for expected fields, verify data types, and ensure quality standards are met.',
    },
  ] as UseCase[],

  // Why Choose
  whyChoose: [
    {
      title: 'Comprehensive Analysis',
      description:
        'Get more than basic validation. Our tool provides size metrics, structure analysis, type distribution, key patterns, value statistics, and quality scoring - all in one place.',
    },
    {
      title: 'Visual Insights',
      description:
        'See your data clearly with visual charts for type distribution and organized dashboards. Understanding complex JSON is easier with visual representation.',
    },
    {
      title: 'Complete Privacy',
      description:
        'Your data never touches our servers. Everything happens in your browser using client-side JavaScript. Safe for sensitive data, credentials, and production JSON.',
    },
    {
      title: 'Real-Time Analysis',
      description:
        'No waiting for results. Statistics update instantly as you type or paste. Even large files are analyzed in milliseconds on modern browsers.',
    },
    {
      title: 'Export Flexibility',
      description:
        'Export your analysis in JSON, CSV, or Markdown format. Choose which sections to include. Perfect for reports, documentation, and sharing.',
    },
    {
      title: 'Works Everywhere',
      description:
        'No installation required. Works in any modern browser on desktop or mobile. No signup, no downloads, no plugins needed.',
    },
  ] as WhyChooseItem[],

  // Technical Specifications
  technicalSpecs: [
    { feature: 'Max File Size', specification: '10 MB (browser memory permitting)' },
    { feature: 'Processing Speed', specification: '< 200ms for 1MB files' },
    { feature: 'Export Formats', specification: 'JSON, CSV, Markdown' },
    { feature: 'Analysis Sections', specification: '6 (Size, Structure, Types, Keys, Values, Quality)' },
    { feature: 'Browser Support', specification: 'Chrome, Firefox, Safari, Edge' },
    { feature: 'Data Privacy', specification: '100% client-side processing' },
    { feature: 'Type Detection', specification: 'String, Number, Boolean, Null, Object, Array' },
    { feature: 'Value Detection', specification: 'URLs, Emails, ISO Dates auto-detected' },
  ] as TechnicalSpec[],

  // Comparison Table
  comparison: [
    {
      feature: 'Price',
      ourTool: '100% Free',
      competitorA: 'Freemium',
      competitorB: 'Free',
    },
    {
      feature: 'Privacy',
      ourTool: 'Client-side only',
      competitorA: 'Server processing',
      competitorB: 'Server processing',
    },
    {
      feature: 'Statistics',
      ourTool: 'Comprehensive',
      competitorA: 'Basic',
      competitorB: 'None',
    },
    {
      feature: 'Type Distribution',
      ourTool: 'Visual chart',
      competitorA: 'Not available',
      competitorB: 'Not available',
    },
    {
      feature: 'Quality Score',
      ourTool: 'Yes (0-100)',
      competitorA: 'No',
      competitorB: 'No',
    },
    {
      feature: 'Export Stats',
      ourTool: 'JSON, CSV, Markdown',
      competitorA: 'No',
      competitorB: 'No',
    },
    {
      feature: 'Key Analysis',
      ourTool: 'Frequency, patterns',
      competitorA: 'No',
      competitorB: 'No',
    },
    {
      feature: 'Signup Required',
      ourTool: 'No',
      competitorA: 'For features',
      competitorB: 'No',
    },
  ] as ComparisonRow[],

  // FAQs
  faqs: [
    {
      question: 'What statistics does this tool provide?',
      answer:
        'Our JSON analyzer provides six categories of statistics: Size Metrics (bytes, characters, lines), Structure Analysis (depth, objects, arrays, keys), Type Distribution (counts and percentages of each data type), Key Analysis (frequency, duplicates, patterns), Value Statistics (string lengths, number ranges, array sizes), and Data Quality (score, issues, suggestions).',
    },
    {
      question: 'Is my JSON data secure and private?',
      answer:
        'Yes, 100% private. All analysis happens entirely in your browser using client-side JavaScript. Your JSON data never leaves your computer and is never sent to our servers. This makes it safe for sensitive data, API keys, and production configurations.',
    },
    {
      question: 'What is the Data Quality Score?',
      answer:
        'The quality score (0-100) measures your JSON data health based on several factors: absence of null values, no empty strings/arrays/objects, consistent types for the same keys, and proper structure. A score of 80+ indicates high-quality, consistent data.',
    },
    {
      question: 'Can I analyze invalid JSON?',
      answer:
        'No, the JSON must be valid for analysis. However, when you paste invalid JSON, the tool shows you the exact error location (line and column) so you can fix the syntax issue. For fixing JSON, try our JSON Validator tool.',
    },
    {
      question: 'What export formats are available?',
      answer:
        'You can export statistics in three formats: JSON (for programmatic use), CSV (for spreadsheets and databases), or Markdown (for documentation and README files). You can choose which sections to include in the export.',
    },
    {
      question: 'What types are detected in the Type Distribution?',
      answer:
        'The tool detects all JSON data types: strings, numbers, booleans, null values, objects, and arrays. For strings, it also auto-detects special patterns like URLs, email addresses, and ISO date formats.',
    },
    {
      question: 'How large can my JSON file be?',
      answer:
        'The tool handles JSON files up to 10MB comfortably. Larger files may work depending on your browser\'s available memory. For very large files (>10MB), consider using a command-line tool or splitting the data.',
    },
    {
      question: 'What are "inconsistent types" in the Quality analysis?',
      answer:
        'Inconsistent types occur when the same key has different data types across your JSON. For example, if "age" is sometimes a number and sometimes a string, that\'s flagged as inconsistent. This often causes issues in typed programming languages.',
    },
    {
      question: 'How is nesting depth calculated?',
      answer:
        'Nesting depth counts how many levels deep your JSON structure goes. A flat object like {"a": 1} has depth 1. A nested structure like {"a": {"b": {"c": 1}}} has depth 3. Deep nesting (>5 levels) may indicate overly complex data.',
    },
    {
      question: 'Can I use the statistics in my code or reports?',
      answer:
        'Yes! Export the statistics as JSON to use programmatically in your code. Export as CSV for spreadsheet analysis. Export as Markdown for documentation, README files, or team reports.',
    },
  ] as FAQItem[],

  // Related Tools
  relatedTools: [
    {
      title: 'JSON Minifier',
      description: 'Minify and beautify JSON with compression stats',
      icon: 'fas fa-compress-arrows-alt',
      link: '/json-minifier',
    },
    {
      title: 'JSON Validator',
      description: 'Validate JSON syntax and find errors',
      icon: 'fas fa-check-circle',
      link: '/json-validator',
    },
    {
      title: 'JSON Diff',
      description: 'Compare two JSON documents side by side',
      icon: 'fas fa-not-equal',
      link: '/json-diff',
    },
    {
      title: 'JSON Formatter',
      description: 'Format and beautify JSON with syntax highlighting',
      icon: 'fas fa-indent',
      link: '/json-formatter',
    },
    {
      title: 'JSON Generator',
      description: 'Generate fake JSON test data',
      icon: 'fas fa-database',
      link: '/json-generator',
    },
    {
      title: 'JSON Flattener',
      description: 'Flatten nested JSON to key-value pairs',
      icon: 'fas fa-compress-alt',
      link: '/json-flattener',
    },
  ] as RelatedTool[],
};
