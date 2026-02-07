/**
 * SEO content for JSON Minifier tool
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

export const jsonMinifierContent = {
  // Meta
  title: 'JSON Minifier - Free Online JSON Minify & Compress Tool',
  subtitle:
    'Minify JSON online instantly with our free JSON minifier. Compress JSON data, reduce file size by up to 70%, and beautify with one click. See real-time compression stats. 100% client-side - your data never leaves your browser.',
  description:
    'Free online JSON minifier. Compress and minify JSON with instant results, compression statistics, and beautify toggle. Client-side processing for maximum privacy.',

  // Trust Badges
  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-shield-alt', text: 'Client-Side' },
    { icon: 'fas fa-bolt', text: 'Instant Results' },
    { icon: 'fas fa-compress-arrows-alt', text: 'Up to 70% Smaller' },
    { icon: 'fas fa-exchange-alt', text: 'Minify & Beautify' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
  ] as TrustBadge[],

  // Section Titles (H2 headings)
  howToSectionTitle: 'How to Minify JSON Online (Step-by-Step)',
  featuresSectionTitle: 'JSON Minifier Features',
  whyChooseSectionTitle: 'Why Use This JSON Minifier?',
  comparisonSectionTitle: 'JSON Minifier Comparison',

  // Key Features
  features: [
    {
      icon: 'fas fa-compress-arrows-alt',
      title: 'Instant JSON Minification',
      description:
        'Compress your JSON in milliseconds. Our minifier removes all unnecessary whitespace, newlines, and indentation while preserving data integrity. See results instantly as you type or paste.',
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Real-Time Compression Stats',
      description:
        'Watch your file size shrink in real-time. See bytes saved, percentage reduction, and compression ratio instantly. Know exactly how much bandwidth and storage you\'re saving.',
    },
    {
      icon: 'fas fa-exchange-alt',
      title: 'One-Click Minify/Beautify Toggle',
      description:
        'Switch between minified and beautified output instantly. No need to re-paste your JSON - just toggle the mode and see results immediately. Perfect for debugging and production workflows.',
    },
    {
      icon: 'fas fa-check-circle',
      title: 'Built-In JSON Validation',
      description:
        'Never minify invalid JSON again. Our validator catches syntax errors before processing and shows you exactly where the problem is with line and column numbers.',
    },
    {
      icon: 'fas fa-sliders-h',
      title: 'Customizable Formatting Options',
      description:
        'Fine-tune your output with options to sort keys alphabetically, remove null values, strip empty strings, and more. Choose 2, 3, or 4 space indentation or tabs for beautified output.',
    },
    {
      icon: 'fas fa-sort-alpha-down',
      title: 'Sort Keys Alphabetically',
      description:
        'Organize your JSON with alphabetically sorted keys at every nesting level. Great for version control - sorted keys produce cleaner diffs and easier code reviews.',
    },
    {
      icon: 'fas fa-broom',
      title: 'Clean Empty Values',
      description:
        'Optionally remove null values, empty strings, empty arrays, and empty objects from your JSON. Reduce file size even further by stripping unnecessary data.',
    },
    {
      icon: 'fas fa-lock',
      title: '100% Client-Side Processing',
      description:
        'Your JSON never leaves your browser. All minification happens locally using JavaScript. Perfect for sensitive configuration files, API keys, or production data.',
    },
  ] as FeatureItem[],

  // How-To Steps
  howToSteps: [
    {
      number: 1,
      title: 'Paste or Upload Your JSON',
      description:
        'Copy your JSON data from any source - API response, config file, or code editor - and paste it into the input panel. You can also drag-and-drop a .json file or click to upload. Our tool handles files up to 10MB with ease.',
    },
    {
      number: 2,
      title: 'Choose Minify or Beautify Mode',
      description:
        'By default, the tool is set to Minify mode. If you want formatted, readable output instead, click the Beautify toggle in the settings panel. You can switch between modes anytime without re-pasting your JSON.',
    },
    {
      number: 3,
      title: 'Configure Optional Settings',
      description:
        'Fine-tune your output with additional options. Enable "Sort Keys" to alphabetize object keys. Toggle "Remove Nulls" to strip null values. For beautify mode, choose your preferred indentation: 2, 3, 4 spaces, or tabs.',
    },
    {
      number: 4,
      title: 'Review Compression Statistics',
      description:
        'Check the stats bar to see your compression results. View the original size, minified size, bytes saved, and percentage reduction. The compression ratio shows you exactly how efficient the minification was.',
    },
    {
      number: 5,
      title: 'Copy or Download Your JSON',
      description:
        'Click "Copy" to copy the processed JSON to your clipboard, or "Download" to save it as a file. Your output is ready for production APIs, config files, or wherever you need compact JSON. Use our <a href="/json-diff">JSON Diff tool</a> to compare changes.',
    },
  ] as HowToStep[],

  // Educational Content
  educational: [
    {
      title: 'What is JSON Minification?',
      content:
        'JSON minification is the process of removing all unnecessary characters from JSON data without changing its meaning. This includes whitespace, newlines, indentation, and sometimes comments. Minified JSON is smaller in file size, which means faster network transfers, lower bandwidth costs, and reduced storage requirements. APIs commonly return minified JSON to optimize response times.',
    },
    {
      title: 'When to Minify vs. Beautify JSON',
      content:
        'Minify JSON when you need to optimize for production - sending API responses, storing config files, or reducing payload sizes. Beautify JSON when you need human-readable output - debugging issues, reviewing code, documenting APIs, or collaborating with team members. Many developers minify for production and beautify for development.',
    },
    {
      title: 'How Much Can You Save?',
      content:
        'Typical beautified JSON can be compressed by 40-70% through minification. The exact savings depend on how the original JSON was formatted. Heavily indented JSON with many nested objects saves the most. JSON that\'s already compact saves less. Our real-time stats show you exactly how much you\'re saving.',
    },
  ] as EducationalSection[],

  // Use Cases
  useCases: [
    {
      icon: 'fas fa-server',
      title: 'API Response Optimization',
      description:
        'Reduce API payload sizes by minifying JSON responses. Smaller payloads mean faster downloads for users, especially on mobile networks. Save bandwidth costs and improve Time to First Byte (TTFB).',
    },
    {
      icon: 'fas fa-database',
      title: 'Database Storage',
      description:
        'Store JSON documents more efficiently in databases like MongoDB, PostgreSQL, or Redis. Minified JSON uses less disk space and memory, reducing storage costs and improving query performance.',
    },
    {
      icon: 'fas fa-cog',
      title: 'Config File Deployment',
      description:
        'Minify configuration files before deploying to production. Smaller configs mean faster container startup times and reduced storage in version control. Perfect for Kubernetes ConfigMaps and environment configs.',
    },
    {
      icon: 'fas fa-code',
      title: 'Frontend Bundle Optimization',
      description:
        'Include JSON data in frontend bundles without bloating file sizes. Minified inline JSON helps keep JavaScript bundles small, improving page load times and Core Web Vitals scores.',
    },
  ] as UseCase[],

  // Why Choose
  whyChoose: [
    {
      title: 'Blazing Fast Performance',
      description:
        'Process multi-megabyte JSON files in milliseconds. Our optimized algorithms handle even the largest files without lag. No waiting, no spinners - just instant results.',
    },
    {
      title: 'Real-Time Preview',
      description:
        'See your minified or beautified JSON update as you type. No need to click a button - changes appear instantly. Toggle between modes without losing your data.',
    },
    {
      title: 'Complete Privacy',
      description:
        'Your data never touches our servers. Everything happens in your browser using client-side JavaScript. Safe for API keys, credentials, and sensitive configuration data.',
    },
    {
      title: 'Detailed Statistics',
      description:
        'Know exactly what you\'re saving. See bytes saved, percentage reduction, compression ratio, line counts, and more. Make informed decisions about your optimization strategy.',
    },
    {
      title: 'Flexible Options',
      description:
        'More than just minification. Sort keys, remove nulls, strip empty values, choose indentation styles. Customize the output to match your exact requirements.',
    },
    {
      title: 'Works Everywhere',
      description:
        'No installation required. Works in any modern browser on desktop or mobile. No signup, no downloads, no plugins. Just paste your JSON and go.',
    },
  ] as WhyChooseItem[],

  // Technical Specifications
  technicalSpecs: [
    { feature: 'Max File Size', specification: '10 MB (browser memory permitting)' },
    { feature: 'Processing Speed', specification: '< 100ms for 1MB files' },
    { feature: 'Indentation Options', specification: '2, 3, 4 spaces, or tabs' },
    { feature: 'Unicode Support', specification: 'Full UTF-8 support' },
    { feature: 'Browser Support', specification: 'Chrome, Firefox, Safari, Edge' },
    { feature: 'Data Privacy', specification: '100% client-side processing' },
    { feature: 'Validation', specification: 'Real-time syntax checking' },
    { feature: 'Export Options', specification: 'Copy to clipboard, download file' },
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
      feature: 'Compression Stats',
      ourTool: 'Real-time detailed',
      competitorA: 'Basic only',
      competitorB: 'None',
    },
    {
      feature: 'Beautify Toggle',
      ourTool: 'Instant toggle',
      competitorA: 'Separate page',
      competitorB: 'Not available',
    },
    {
      feature: 'Sort Keys',
      ourTool: 'Yes',
      competitorA: 'No',
      competitorB: 'Yes',
    },
    {
      feature: 'Remove Nulls',
      ourTool: 'Yes',
      competitorA: 'No',
      competitorB: 'No',
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
      question: 'Is this JSON minifier completely free?',
      answer:
        'Yes, 100% free with no hidden costs, no signup required, and unlimited usage. All features are available to everyone. We believe developer tools should be accessible to all.',
    },
    {
      question: 'Is my JSON data secure and private?',
      answer:
        'Absolutely. All processing happens entirely in your browser using client-side JavaScript. Your JSON data never leaves your computer and is never sent to our servers. This makes it safe for sensitive data like API keys, credentials, and production configurations.',
    },
    {
      question: 'What is the maximum file size I can minify?',
      answer:
        'Our tool handles JSON files up to 10MB comfortably. Larger files may work depending on your browser\'s available memory. For very large files, consider using a command-line tool or splitting the JSON into smaller chunks.',
    },
    {
      question: 'Can I minify invalid JSON?',
      answer:
        'No, the JSON must be valid for minification to work. However, our built-in validator will show you exactly where the syntax error is located, with line and column numbers, so you can fix it quickly.',
    },
    {
      question: 'What is the difference between minify and beautify?',
      answer:
        'Minify removes all unnecessary whitespace to create the smallest possible file size. Beautify adds proper indentation and line breaks to make the JSON human-readable. Both preserve the actual data - only the formatting changes.',
    },
    {
      question: 'Does minification change my JSON data?',
      answer:
        'Standard minification only removes whitespace and does not change any data values. However, if you enable optional cleaning features like "Remove Nulls" or "Remove Empty Strings", those values will be removed from the output.',
    },
    {
      question: 'How much file size reduction can I expect?',
      answer:
        'Typical savings range from 40-70% for beautified JSON. The actual reduction depends on how much whitespace and indentation was in the original file. Our real-time stats show you the exact savings for your specific JSON.',
    },
    {
      question: 'Can I use the minified output in production?',
      answer:
        'Yes! Minified JSON is production-ready and commonly used in APIs, web applications, and configuration files. It\'s syntactically identical to the original - just smaller and faster to transmit.',
    },
    {
      question: 'Does the tool support JSON with comments?',
      answer:
        'Standard JSON does not support comments per the specification. If your file has JavaScript-style comments, they will cause a validation error. You\'ll need to remove comments first or use a tool that supports JSON5 format.',
    },
    {
      question: 'Can I sort the JSON keys alphabetically?',
      answer:
        'Yes! Enable the "Sort Keys" option to alphabetically sort object keys at every nesting level. This is great for version control as it produces consistent output and cleaner diffs when comparing versions.',
    },
  ] as FAQItem[],

  // Related Tools
  relatedTools: [
    {
      title: 'JSON Formatter',
      description: 'Format and beautify JSON with syntax highlighting',
      icon: 'fas fa-indent',
      link: '/json-formatter',
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
      title: 'JSON to YAML',
      description: 'Convert JSON to YAML format',
      icon: 'fas fa-arrow-right',
      link: '/json-to-yaml',
    },
    {
      title: 'JSON Escaper',
      description: 'Escape JSON strings for use in code',
      icon: 'fas fa-shield-alt',
      link: '/json-escaper',
    },
    {
      title: 'JSON Generator',
      description: 'Generate fake JSON test data',
      icon: 'fas fa-database',
      link: '/json-generator',
    },
  ] as RelatedTool[],
};
