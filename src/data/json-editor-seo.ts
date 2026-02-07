/**
 * JSON Editor SEO Data
 * Comprehensive SEO content for the JSON Editor tool
 */

/**
 * Educational section interface
 */
export interface EducationalSection {
  title: string;
  content: string;
  type?: 'info' | 'tip' | 'warning';
}

/**
 * Technical specification interface
 */
export interface TechnicalSpec {
  feature: string;
  specification: string;
}

/**
 * FAQ item interface
 */
export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * How-to step interface
 */
export interface HowToStep {
  number: number;
  title: string;
  description: string;
}

/**
 * SEO Metadata
 */
export const JSON_EDITOR_SEO = {
  title: 'JSON Editor Online Free - Visual Tree Editor & Code View',
  description: 'Edit JSON visually with our free online JSON editor. Tree view navigation, in-place editing, undo/redo support, and syntax validation. 100% client-side processing.',
  keywords: [
    'json editor online',
    'visual json editor',
    'json tree editor',
    'edit json online',
    'json editor free',
    'json structure editor',
    'json data editor',
    'online json tool',
    'json viewer editor',
    'json key value editor',
  ],
  canonicalPath: '/json-editor',
  
  // Open Graph
  og: {
    title: 'JSON Editor - Visual Tree Editor for JSON Data',
    description: 'Free online JSON editor with tree view, in-place editing, and undo/redo. No signup required, 100% private.',
    type: 'website',
  },
  
  // Twitter
  twitter: {
    title: 'JSON Editor Online - Visual Tree Editor',
    description: 'Edit JSON visually with tree navigation and real-time validation. Free, private, no signup.',
  },
};

/**
 * Page Header Content
 */
export const JSON_EDITOR_HEADER = {
  title: 'JSON Editor',
  subtitle: 'Visual Tree Editor for JSON Data',
  description: 'Edit JSON data with an intuitive visual interface. Navigate with tree view, edit values in-place, and manage keys easily. Features undo/redo, search, and real-time validation.',
  features: [
    { icon: 'fas fa-sitemap', label: 'Tree View', description: 'Visual tree navigation' },
    { icon: 'fas fa-edit', label: 'In-Place Editing', description: 'Edit values directly' },
    { icon: 'fas fa-undo', label: 'Undo/Redo', description: 'Full history support' },
    { icon: 'fas fa-search', label: 'Search', description: 'Find keys and values' },
    { icon: 'fas fa-check-circle', label: 'Validation', description: 'Real-time syntax check' },
    { icon: 'fas fa-lock', label: 'Privacy', description: '100% client-side' },
  ],
};

/**
 * Educational Content
 */
export const JSON_EDITOR_EDUCATIONAL: EducationalSection[] = [
  {
    title: 'What is a JSON Editor?',
    content: 'A JSON Editor is a tool that helps you view, create, and modify JSON (JavaScript Object Notation) data. Unlike plain text editors, a visual JSON editor displays data in a hierarchical tree structure, making it easier to understand complex nested objects and arrays. Our JSON editor combines tree view navigation with code editing capabilities.',
    type: 'info',
  },
  {
    title: 'Tree View vs Code View',
    content: 'Tree view displays JSON as an expandable/collapsible tree structure, perfect for navigating complex data. Code view shows raw JSON text with syntax highlighting, ideal for copy/paste operations and viewing the exact format. Toggle between views based on your task.',
    type: 'info',
  },
  {
    title: 'JSON Data Types',
    content: 'JSON supports six data types: strings (text in quotes), numbers (integers or decimals), booleans (true/false), null (empty value), objects (key-value pairs in curly braces), and arrays (ordered lists in square brackets). Our editor shows type indicators to help you identify data types at a glance.',
    type: 'info',
  },
  {
    title: 'Tip: Keyboard Shortcuts',
    content: 'Use Ctrl/Cmd+Z to undo and Ctrl/Cmd+Y to redo. Press Delete or Backspace to remove selected nodes. Use Ctrl/Cmd+F to search. Double-click on values to edit them in place.',
    type: 'tip',
  },
  {
    title: 'Warning: Large Files',
    content: 'For very large JSON files (over 10MB), consider using the "Large Files" preset which optimizes performance by reducing validation frequency and history size. You may also want to collapse nodes you are not actively editing.',
    type: 'warning',
  },
];

/**
 * Technical Specifications
 */
export const JSON_EDITOR_SPECS: TechnicalSpec[] = [
  { feature: 'Processing', specification: '100% client-side (browser)' },
  { feature: 'Max File Size', specification: 'Limited by browser memory (~50MB typical)' },
  { feature: 'History Limit', specification: '50 undo/redo steps (configurable)' },
  { feature: 'JSON Standard', specification: 'RFC 8259 compliant (strict mode)' },
  { feature: 'Extended Support', specification: 'JSON5 compatible (lenient mode)' },
  { feature: 'Validation', specification: 'Real-time syntax validation' },
  { feature: 'Data Privacy', specification: 'Never sent to server' },
  { feature: 'Browser Support', specification: 'Chrome, Firefox, Safari, Edge' },
];

/**
 * FAQ Content
 */
export const JSON_EDITOR_FAQ: FAQItem[] = [
  {
    question: 'Is my data safe when using this JSON editor?',
    answer: 'Yes, absolutely. All processing happens in your browser. Your JSON data never leaves your device and is never sent to any server. This makes our tool ideal for editing sensitive configuration files or private data.',
  },
  {
    question: 'What is the maximum file size I can edit?',
    answer: 'The practical limit depends on your browser and device memory, typically around 50MB for most modern browsers. For very large files, we recommend using the "Large Files" preset which optimizes performance.',
  },
  {
    question: 'Can I edit JSON files with comments?',
    answer: 'Yes! Enable "Lenient Mode" in settings to support JSON5 features including single-line (//) and multi-line (/* */) comments, trailing commas, and unquoted keys.',
  },
  {
    question: 'How do I add a new property to an object?',
    answer: 'Click the "+" button on any object node or right-click and select "Add Property". You can then specify the key name and choose the value type (string, number, boolean, null, object, or array).',
  },
  {
    question: 'Can I undo my changes?',
    answer: 'Yes! The editor maintains a full history of your changes. Use Ctrl/Cmd+Z to undo and Ctrl/Cmd+Y to redo. By default, the last 50 actions are saved (configurable in settings).',
  },
  {
    question: 'How do I reorder array items?',
    answer: 'Select an array item and use the up/down arrow buttons in the toolbar, or right-click and select "Move Up" or "Move Down". You can also drag and drop items in tree view.',
  },
  {
    question: 'What is the difference between Tree View and Code View?',
    answer: 'Tree View displays JSON as an interactive hierarchical tree, making it easy to navigate and edit complex structures visually. Code View shows the raw JSON text with syntax highlighting, useful for copy/paste operations or when you need to see the exact format.',
  },
  {
    question: 'Can I search within my JSON data?',
    answer: 'Yes! Press Ctrl/Cmd+F or click the search icon to open the search panel. You can search keys, values, or both. Use the options to match case, match whole words, or use regular expressions.',
  },
];

/**
 * How-To Steps
 */
export const JSON_EDITOR_HOW_TO: HowToStep[] = [
  {
    number: 1,
    title: 'Load Your JSON',
    description: 'Paste your JSON data into the editor or click "Load Sample" to start with example data. The editor will validate the JSON and display any syntax errors.',
  },
  {
    number: 2,
    title: 'Navigate the Tree',
    description: 'Click the expand/collapse arrows to navigate through nested objects and arrays. Use the search function to quickly find specific keys or values.',
  },
  {
    number: 3,
    title: 'Edit Values',
    description: 'Double-click on any value to edit it in place. The editor will automatically detect and preserve the correct data type (string, number, boolean, etc.).',
  },
  {
    number: 4,
    title: 'Manage Structure',
    description: 'Use the context menu (right-click) or toolbar buttons to add, delete, duplicate, or reorder properties. You can also change the type of a value.',
  },
  {
    number: 5,
    title: 'Export Your Data',
    description: 'Copy the formatted JSON using the copy button, or switch to Code View to select and copy specific portions. Use the format/minify buttons as needed.',
  },
];

/**
 * Related Tools
 */
export const JSON_EDITOR_RELATED_TOOLS = [
  {
    title: 'JSON Formatter',
    link: '/json-formatter',
    description: 'Format and beautify JSON with customizable indentation',
    icon: 'fas fa-indent',
  },
  {
    title: 'JSON Validator',
    link: '/json-validator',
    description: 'Validate JSON syntax and structure against RFC standards',
    icon: 'fas fa-check-double',
  },
  {
    title: 'JSON to YAML',
    link: '/json-to-yaml',
    description: 'Convert JSON data to YAML format',
    icon: 'fas fa-exchange-alt',
  },
  {
    title: 'JSON Diff',
    link: '/json-diff',
    description: 'Compare two JSON documents and highlight differences',
    icon: 'fas fa-code-compare',
  },
  {
    title: 'JSON Minifier',
    link: '/json-minifier',
    description: 'Compress JSON by removing whitespace',
    icon: 'fas fa-compress',
  },
  {
    title: 'JSON to TypeScript',
    link: '/json-to-typescript',
    description: 'Generate TypeScript interfaces from JSON',
    icon: 'fab fa-js-square',
  },
];

/**
 * Schema.org structured data
 */
export const JSON_EDITOR_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JSON Editor Online',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description: 'Free online JSON editor with visual tree view, in-place editing, undo/redo, and real-time validation.',
  featureList: [
    'Visual tree view navigation',
    'In-place value editing',
    'Undo/redo support',
    'Search functionality',
    'Real-time validation',
    'Code view toggle',
    '100% client-side processing',
    'JSON5 support',
  ],
};
