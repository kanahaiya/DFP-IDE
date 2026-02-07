/**
 * SEO content for JSON Merge tool
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

export const jsonMergeContent = {
  // Meta
  title: 'JSON Merge Tool - Combine JSON Objects Online Free',
  subtitle:
    'Merge multiple JSON objects and arrays online instantly. Free JSON merge tool with 6 merge strategies including deep merge, array union, and smart conflict resolution. 100% client-side processing - your data never leaves your browser.',
  description:
    'Free online JSON merge tool. Combine 2-5 JSON documents with deep merge, array concatenation, and conflict resolution. Client-side processing for maximum privacy.',

  // Trust Badges
  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-shield-alt', text: 'Client-Side' },
    { icon: 'fas fa-bolt', text: 'Instant Merge' },
    { icon: 'fas fa-layer-group', text: '2-5 Inputs' },
    { icon: 'fas fa-code-branch', text: '6 Strategies' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
  ] as TrustBadge[],

  // Section Titles (H2 headings)
  howToSectionTitle: 'How to Merge JSON Online (Step-by-Step)',
  featuresSectionTitle: 'JSON Merge Tool Features',
  whyChooseSectionTitle: 'Why Use This JSON Merge Tool?',
  comparisonSectionTitle: 'JSON Merge Tool Comparison',

  // Key Features
  features: [
    {
      icon: 'fas fa-code-branch',
      title: '6 Powerful Merge Strategies',
      description:
        'Choose the merge approach that fits your data: Simple Merge (last wins), Deep Merge (recursive), Array Concatenation, Array Union (no duplicates), Nested Array Merge, or Custom Rules. Each strategy handles your data differently.',
    },
    {
      icon: 'fas fa-layer-group',
      title: 'Merge 2-5 JSON Documents at Once',
      description:
        'Unlike basic tools that only handle two inputs, our JSON merger lets you combine up to 5 JSON documents simultaneously. Add or remove input panes as needed, perfect for consolidating API responses or config files.',
    },
    {
      icon: 'fas fa-sitemap',
      title: 'Deep Merge with Nested Object Support',
      description:
        'Deep merge recursively combines nested objects instead of just overwriting them. When both JSONs have the same nested structure, properties are intelligently merged at every level.',
    },
    {
      icon: 'fas fa-list',
      title: 'Smart Array Handling Options',
      description:
        'Arrays are tricky to merge. Choose to concatenate them (combine all elements), union them (remove duplicates), or merge by matching keys. You control exactly how array data gets combined.',
    },
    {
      icon: 'fas fa-exclamation-triangle',
      title: 'Conflict Resolution & Duplicate Key Handling',
      description:
        'When the same key exists in multiple inputs, decide what happens: keep the first value, keep the last value, or attempt to merge them. Clear indicators show where conflicts occurred.',
    },
    {
      icon: 'fas fa-eye',
      title: 'Real-Time Preview with Tree View',
      description:
        'See your merged result instantly as you type or modify settings. Switch between raw JSON view and an interactive tree view to explore nested structures easily.',
    },
    {
      icon: 'fas fa-file-export',
      title: 'Flexible Export Options',
      description:
        'Export your merged JSON with customizable formatting: pretty-printed with 2, 3, or 4 space indentation, tabs, or minified. Sort keys alphabetically and control null value handling.',
    },
    {
      icon: 'fas fa-lock',
      title: '100% Client-Side Processing',
      description:
        'Your JSON data never leaves your browser. All merge operations happen locally using JavaScript. Perfect for sensitive configuration files, API keys, or production data.',
    },
  ] as FeatureItem[],

  // How-To Steps
  howToSteps: [
    {
      number: 1,
      title: 'Add Your JSON Documents',
      description:
        'Start with the two default input panes. Paste your first JSON in the left pane and second JSON in the right. Need more? Click "+ Add Input" to create up to 5 input panes. You can also drag-and-drop .json files or upload them directly.',
    },
    {
      number: 2,
      title: 'Choose Your Merge Strategy',
      description:
        'Select how you want to combine your JSON documents. "Simple Merge" overwrites with later values. "Deep Merge" recursively combines nested objects. For arrays, choose "Array Concatenation" to combine all elements or "Array Union" to remove duplicates.',
    },
    {
      number: 3,
      title: 'Configure Merge Options',
      description:
        'Fine-tune the merge behavior in the settings panel. Set how duplicate keys should be handled (keep first, keep last, or merge). Choose array ordering preferences and decide whether to include or exclude null values in the output.',
    },
    {
      number: 4,
      title: 'Review the Merged Result',
      description:
        'The output panel shows your merged JSON in real-time. Toggle between raw JSON and tree view to inspect the result. The tree view lets you expand/collapse nested objects to verify the merge worked as expected.',
    },
    {
      number: 5,
      title: 'Copy or Download Your Merged JSON',
      description:
        'Click "Copy" to copy the merged JSON to your clipboard, or "Download" to save it as a .json file. Choose your preferred formatting: pretty-printed with your chosen indentation or minified for production use. Use our <a href="/json-diff">JSON Diff tool</a> to compare before and after.',
    },
  ] as HowToStep[],

  // Educational Content
  educational: [
    {
      title: 'What is JSON Merging?',
      content:
        'JSON merging is the process of combining two or more JSON objects or arrays into a single JSON document. This is commonly needed when consolidating API responses, merging configuration files, or combining data from multiple sources. The challenge lies in handling conflicts when the same key exists in multiple documents.',
    },
    {
      title: 'Understanding Merge Strategies',
      content:
        'Different merge strategies handle data combination differently. Simple merge uses "last wins" logic where later values override earlier ones. Deep merge recursively combines nested objects, preserving structure at all levels. Array strategies determine whether arrays should be concatenated (joined together) or unified (deduplicated).',
    },
    {
      title: 'When to Use Deep Merge',
      content:
        'Use deep merge when you have nested JSON structures and want to preserve properties at every level. For example, if merging user profiles where one has {settings: {theme: "dark"}} and another has {settings: {language: "en"}}, deep merge produces {settings: {theme: "dark", language: "en"}} instead of overwriting the entire settings object.',
    },
  ] as EducationalSection[],

  // Use Cases
  useCases: [
    {
      icon: 'fas fa-server',
      title: 'API Response Consolidation',
      description:
        'Combine responses from multiple API endpoints into a single JSON object. Perfect for aggregating data from microservices or merging paginated responses into one complete dataset.',
    },
    {
      icon: 'fas fa-cog',
      title: 'Configuration File Merging',
      description:
        'Merge environment-specific configs (dev, staging, prod) with base configurations. Deep merge ensures nested settings are combined properly without losing important overrides.',
    },
    {
      icon: 'fas fa-database',
      title: 'Data Migration & ETL',
      description:
        'Combine JSON datasets during migration projects. Use array union to merge user lists without duplicates, or concatenate log entries from multiple sources.',
    },
    {
      icon: 'fas fa-code',
      title: 'Package.json Consolidation',
      description:
        'Merge dependencies from multiple package.json files when consolidating JavaScript projects. Deep merge combines scripts, dependencies, and devDependencies intelligently.',
    },
  ] as UseCase[],

  // Why Choose
  whyChoose: [
    {
      title: 'Multiple Merge Strategies, Not Just Simple Override',
      description:
        'Most JSON merge tools offer only basic "last wins" merging. We provide 6 distinct strategies including deep merge and smart array handling, giving you precise control over how your data combines.',
    },
    {
      title: 'Handle Up to 5 Documents Simultaneously',
      description:
        'Why merge in pairs when you can combine 5 JSON documents at once? Our flexible input system lets you add or remove panes as needed, streamlining complex merge operations.',
    },
    {
      title: 'Your Data Stays Private - 100% Client-Side',
      description:
        'Unlike server-based tools, your JSON never leaves your browser. All processing happens locally using JavaScript. Safe for API keys, credentials, and sensitive configurations.',
    },
    {
      title: 'Real-Time Preview with Zero Lag',
      description:
        'See merge results instantly as you type or change settings. No "submit" button needed - changes appear immediately with smart debouncing to keep the interface responsive.',
    },
    {
      title: 'Clear Conflict Resolution Controls',
      description:
        'When keys collide, you decide what happens. Choose to keep the first value, last value, or attempt intelligent merging. Visual indicators show where conflicts were resolved.',
    },
    {
      title: 'Professional Output Formatting',
      description:
        'Export with your preferred formatting: 2, 3, or 4 space indentation, tabs, or minified JSON. Sort keys alphabetically for consistent output and easy diffing.',
    },
  ] as WhyChooseItem[],

  // Technical Specs
  technicalSpecs: [
    { feature: 'Input Panes', specification: '2-5 simultaneous documents' },
    { feature: 'Merge Strategies', specification: '6 (Simple, Deep, Array Concat, Array Union, Nested, Custom)' },
    { feature: 'Max File Size', specification: '10MB total (combined inputs)' },
    { feature: 'Processing', specification: '100% client-side (JavaScript)' },
    { feature: 'Output Formats', specification: 'JSON pretty-printed, minified' },
    { feature: 'Indentation Options', specification: '2, 3, 4 spaces, or tabs' },
    { feature: 'Browser Support', specification: 'Chrome 90+, Firefox 88+, Safari 14+, Edge 90+' },
    { feature: 'Data Privacy', specification: 'No server uploads, no storage' },
  ] as TechnicalSpec[],

  // Comparison Table
  comparison: [
    {
      feature: 'Merge Strategies',
      ourTool: '6 strategies',
      competitorA: '1 (simple)',
      competitorB: '2 (simple, concat)',
    },
    {
      feature: 'Deep Merge',
      ourTool: true,
      competitorA: false,
      competitorB: false,
    },
    {
      feature: 'Multiple Inputs',
      ourTool: '2-5 documents',
      competitorA: '2 only',
      competitorB: '2 only',
    },
    {
      feature: 'Processing',
      ourTool: 'Client-side',
      competitorA: 'Server-side',
      competitorB: 'Server-side',
    },
    {
      feature: 'Real-Time Preview',
      ourTool: true,
      competitorA: false,
      competitorB: false,
    },
    {
      feature: 'Tree View',
      ourTool: true,
      competitorA: false,
      competitorB: false,
    },
    {
      feature: 'Conflict Resolution',
      ourTool: true,
      competitorA: false,
      competitorB: false,
    },
    {
      feature: 'Price',
      ourTool: 'Free',
      competitorA: 'Free (with ads)',
      competitorB: 'Freemium',
    },
  ] as ComparisonRow[],

  // FAQs
  faqs: [
    {
      question: 'What is the difference between simple merge and deep merge?',
      answer:
        'Simple merge overwrites entire properties when keys match - the later value completely replaces the earlier one. Deep merge recursively combines nested objects, preserving properties at every level. For example, if both JSONs have a "settings" object with different nested properties, deep merge combines them while simple merge would replace the entire "settings" object.',
    },
    {
      question: 'How does array merging work?',
      answer:
        'We offer multiple array handling options: Array Concatenation joins all elements together (may include duplicates), Array Union combines elements and removes duplicates based on value equality, and Nested Array Merge matches array elements by a key field before merging. Choose based on your data structure and needs.',
    },
    {
      question: 'Is my JSON data secure?',
      answer:
        'Absolutely. All merge operations happen entirely in your browser using JavaScript. Your JSON data is never uploaded to any server, never stored, and never transmitted over the network. This makes it safe for sensitive data like API keys, credentials, or production configurations.',
    },
    {
      question: 'Can I merge more than 2 JSON files?',
      answer:
        'Yes! Unlike most tools that only support two inputs, our JSON merger handles 2-5 documents simultaneously. Click "+ Add Input" to add more panes. Documents are merged in order from left to right (or top to bottom on mobile).',
    },
    {
      question: 'What happens when the same key exists in multiple JSONs?',
      answer:
        'You control this with the duplicate key strategy setting. "Keep First" preserves the earliest value, "Keep Last" uses the value from the last document containing that key, and "Merge" attempts to intelligently combine values (useful for nested objects and arrays).',
    },
    {
      question: 'How do I handle null values during merge?',
      answer:
        'The settings panel lets you choose whether null values should be included in the merged output or filtered out. You can also choose whether a null value in a later document should overwrite a non-null value from an earlier document.',
    },
    {
      question: 'Can I merge JSON arrays (not just objects)?',
      answer:
        'Yes! If your root elements are arrays, you can concatenate them (combine all elements), union them (remove duplicates), or merge by index position. The merge strategy applies to both root-level and nested arrays throughout your documents.',
    },
    {
      question: 'What file formats are supported for upload?',
      answer:
        'You can upload .json and .txt files containing valid JSON. You can also paste JSON directly into any input pane. Files are read locally in your browser - they are not uploaded to any server.',
    },
    {
      question: 'Is there a file size limit?',
      answer:
        'The combined size of all input documents should be under 10MB for optimal performance. Since all processing happens in your browser, larger files may cause slowdowns depending on your device capabilities.',
    },
    {
      question: 'Can I use this tool offline?',
      answer:
        'Once the page is loaded, most functionality works offline since all processing is client-side. However, you will need an internet connection to initially load the page. For fully offline use, consider a browser extension or desktop tool.',
    },
  ] as FAQItem[],

  // Related Tools
  relatedTools: [
    {
      title: 'JSON Diff',
      description: 'Compare two JSON documents side-by-side with visual highlighting',
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
      title: 'JSON Validator',
      description: 'Validate JSON syntax and structure with detailed error messages',
      icon: 'fas fa-check-circle',
      link: '/json-validator',
    },
    {
      title: 'JSON to YAML',
      description: 'Convert JSON to YAML format for configuration files',
      icon: 'fas fa-arrow-right',
      link: '/json-to-yaml',
    },
    {
      title: 'JSON Flattener',
      description: 'Flatten nested JSON to key-value pairs with dot notation',
      icon: 'fas fa-compress-alt',
      link: '/json-flattener',
    },
    {
      title: 'JSON Generator',
      description: 'Generate fake JSON test data with 50+ data types',
      icon: 'fas fa-database',
      link: '/json-generator',
    },
  ] as RelatedTool[],
};
