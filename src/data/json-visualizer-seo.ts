/**
 * JSON Visualizer - SEO Content
 */

import type { FeatureItem } from '@/types';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  number: number;
  title: string;
  description: string;
}

export interface EducationalSection {
  title: string;
  type?: 'info' | 'tip' | 'warning';
  content: string;
}

export interface UseCase {
  icon: string;
  title: string;
  description: string;
}

export interface WhyChooseItem {
  title: string;
  description: string;
  color: string;
}

export interface TechnicalSpec {
  feature: string;
  specification: string;
}

export interface RelatedTool {
  title: string;
  description: string;
  icon: string;
  link: string;
}

export const JSON_VISUALIZER_HEADER = {
  title: 'JSON Visualizer Online - Free 2D & 3D JSON Viewer',
  subtitle: 'Transform complex JSON data into stunning interactive 2D and 3D visualizations. Explore hierarchical structures with tree, force-directed, and radial layouts. 100% free, client-side processing.',
  description: 'Free online JSON visualizer with 2D tree diagrams and 3D interactive graphs. Explore JSON data structures with multiple layout algorithms, search, and export capabilities.',
  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-shield-alt', text: 'Secure & Private' },
    { icon: 'fas fa-cube', text: '2D & 3D Modes' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
    { icon: 'fas fa-project-diagram', text: 'Multiple Layouts' },
    { icon: 'fas fa-download', text: 'Export Options' },
  ],
};

export const JSON_VISUALIZER_FEATURES: FeatureItem[] = [
  {
    icon: 'fas fa-toggle-on',
    title: 'Dual 2D & 3D Visualization Modes',
    description: 'Switch seamlessly between 2D diagrams and immersive 3D visualizations. The 2D mode offers clear hierarchical views using ReactFlow, while the 3D mode provides an interactive Three.js experience with orbit controls, zoom, and auto-rotation. Choose the mode that best suits your data exploration needs.',
  },
  {
    icon: 'fas fa-sitemap',
    title: 'Multiple Layout Algorithms',
    description: 'Visualize your JSON with four powerful layout algorithms: Tree (hierarchical structure), Force-directed (physics-based clustering), Radial (circular arrangement), and Treemap (space-filling rectangles). Each layout reveals different patterns and relationships in your data, helping you understand complex structures.',
  },
  {
    icon: 'fas fa-palette',
    title: 'Color-Coded Data Types',
    description: 'Instantly identify data types through intuitive color coding. Objects, arrays, strings, numbers, booleans, and nulls each have distinct colors, making it easy to spot patterns, identify data anomalies, and understand the composition of your JSON at a glance.',
  },
  {
    icon: 'fas fa-search',
    title: 'Powerful Search & Navigation',
    description: 'Find specific keys or values within large JSON documents using our comprehensive search feature. Navigate search results with keyboard shortcuts, filter by match type, and instantly highlight the path from any node to the root. Perfect for debugging APIs or exploring complex data structures.',
  },
  {
    icon: 'fas fa-expand-arrows-alt',
    title: 'Interactive Expand & Collapse',
    description: 'Control the level of detail in your visualization with expandable nodes. Click to expand or collapse individual nodes, or use bulk actions to expand/collapse all nodes or expand to a specific depth. Ideal for focusing on relevant sections of large JSON documents.',
  },
  {
    icon: 'fas fa-download',
    title: 'Export & Share Visualizations',
    description: 'Export your visualizations as PNG images, SVG vector graphics (2D mode), or share via URL. The shareable URL feature encodes your JSON data, allowing you to share specific visualizations with colleagues without any server storage.',
  },
  {
    icon: 'fas fa-info-circle',
    title: 'Node Details & Statistics',
    description: 'Click any node to see detailed information including its path, value, type, depth, and children count. View overall statistics about your JSON: total nodes, maximum depth, and distribution of data types. Gain insights into your data structure at both macro and micro levels.',
  },
  {
    icon: 'fas fa-user-secret',
    title: '100% Client-Side Processing',
    description: 'Your JSON data never leaves your browser. All parsing, visualization, and export operations happen locally using JavaScript, ensuring complete privacy and security. Perfect for sensitive data, proprietary APIs, and confidential configurations.',
  },
];

export const JSON_VISUALIZER_HOW_TO: HowToStep[] = [
  {
    number: 1,
    title: 'Input Your JSON Data',
    description: 'Paste your JSON into the input editor, upload a .json file from your computer, or load JSON from a URL. The editor provides syntax highlighting and validation to help you work with your data.',
  },
  {
    number: 2,
    title: 'Choose Visualization Mode',
    description: 'Select between 2D and 3D visualization modes using the toggle in the controls panel. 2D mode is ideal for hierarchical analysis, while 3D mode offers an immersive exploration experience.',
  },
  {
    number: 3,
    title: 'Select a Layout Algorithm',
    description: 'Choose from Tree, Force-directed, Radial, or Treemap layouts. Each algorithm presents your data differently - experiment to find the best view for your specific use case.',
  },
  {
    number: 4,
    title: 'Explore & Interact',
    description: 'Click nodes to see details, expand/collapse structures, search for specific data, and navigate using mouse controls. In 3D mode, use orbit controls to rotate, pan, and zoom the visualization.',
  },
  {
    number: 5,
    title: 'Export or Share',
    description: 'Export your visualization as an image (PNG/SVG) or copy a shareable URL to send to colleagues. The URL contains encoded JSON data for easy sharing without server storage.',
  },
];

export const JSON_VISUALIZER_EDUCATIONAL: EducationalSection[] = [
  {
    title: 'What is JSON Visualization?',
    type: 'info',
    content: 'JSON visualization transforms text-based JSON data into interactive graphical representations. Instead of reading through nested brackets and braces, you can see the hierarchical structure, relationships between data elements, and overall composition at a glance. This makes it significantly easier to understand complex APIs, debug data issues, and communicate data structures to others.',
  },
  {
    title: '2D vs 3D Visualization: When to Use Each',
    type: 'tip',
    content: '<b>2D Mode</b> is best for: Documentation, presentations, hierarchical analysis, quick overviews, and when you need to export clear diagrams. <br/><br/><b>3D Mode</b> is best for: Exploring large datasets, identifying clusters and patterns, immersive data exploration, and when you want to see multiple relationships simultaneously. The depth dimension in 3D can reveal patterns that are hard to see in 2D.',
  },
  {
    title: 'Understanding Layout Algorithms',
    type: 'info',
    content: '<b>Tree Layout:</b> Shows clear parent-child relationships in a hierarchical structure. Best for configuration files and nested objects.<br/><br/><b>Force-directed:</b> Uses physics simulation to cluster related nodes. Reveals natural groupings and frequently connected elements.<br/><br/><b>Radial:</b> Arranges nodes in concentric circles around the root. Great for seeing depth levels and overall structure size.<br/><br/><b>Treemap:</b> Uses nested rectangles sized by children count. Excellent for seeing which parts of your JSON are most complex.',
  },
];

export const JSON_VISUALIZER_USE_CASES: UseCase[] = [
  {
    icon: 'fas fa-bug',
    title: 'API Response Debugging',
    description: 'Quickly understand complex API responses by visualizing their structure. Identify missing fields, unexpected nesting, or data type issues at a glance.',
  },
  {
    icon: 'fas fa-database',
    title: 'Database Schema Exploration',
    description: 'Visualize MongoDB documents, Elasticsearch mappings, or any JSON-based schema to understand relationships and plan queries effectively.',
  },
  {
    icon: 'fas fa-cogs',
    title: 'Configuration Analysis',
    description: 'Analyze complex configuration files for applications, CI/CD pipelines, or cloud infrastructure. See the full scope of settings and their hierarchy.',
  },
  {
    icon: 'fas fa-chalkboard-teacher',
    title: 'Documentation & Education',
    description: 'Create visual documentation for APIs and data formats. Export diagrams for technical documentation or use in presentations to explain data structures.',
  },
];

export const JSON_VISUALIZER_WHY_CHOOSE: WhyChooseItem[] = [
  {
    title: 'Unique 2D & 3D Modes',
    description: 'The only JSON visualizer that offers both flat 2D diagrams and immersive 3D exploration. Switch between modes to gain different perspectives on your data.',
    color: 'indigo',
  },
  {
    title: 'Four Layout Algorithms',
    description: 'More layout options than any competitor. Tree, force-directed, radial, and treemap layouts reveal different patterns and relationships in your data.',
    color: 'emerald',
  },
  {
    title: 'Complete Privacy',
    description: 'All processing happens in your browser. Your sensitive JSON data never touches our servers, making this tool safe for confidential information.',
    color: 'blue',
  },
  {
    title: 'Professional Export',
    description: 'Export publication-quality PNG images or scalable SVG vectors. Create shareable URLs that work without any backend infrastructure.',
    color: 'purple',
  },
];

export const JSON_VISUALIZER_SPECS: TechnicalSpec[] = [
  { feature: 'Visualization Modes', specification: '2D (ReactFlow), 3D (Three.js/R3F)' },
  { feature: 'Layout Algorithms', specification: 'Tree, Force-directed, Radial, Treemap' },
  { feature: 'Input Methods', specification: 'Paste, File Upload, URL Fetch' },
  { feature: 'Export Formats', specification: 'PNG, SVG (2D), JSON, Shareable URL' },
  { feature: 'Processing', specification: '100% Client-side (browser-based)' },
  { feature: 'Search', specification: 'Keys & Values, Case-sensitive, Path highlighting' },
  { feature: 'Max Recommended Size', specification: '5000+ nodes, limited by browser memory' },
  { feature: 'Browser Support', specification: 'Chrome, Firefox, Safari, Edge (latest)' },
  { feature: '3D Controls', specification: 'Orbit, Pan, Zoom, Auto-rotate' },
  { feature: 'Privacy', specification: 'No data sent to servers' },
];

export const JSON_VISUALIZER_FAQ: FAQItem[] = [
  {
    question: 'What is the JSON Visualizer and how does it work?',
    answer: 'Our JSON Visualizer is a free online tool that transforms JSON text data into interactive graphical diagrams. It parses your JSON, builds a node graph representing the data structure, and renders it using either 2D (ReactFlow) or 3D (Three.js) visualization libraries. All processing happens in your browser, ensuring your data remains private.',
  },
  {
    question: 'Is my JSON data secure when using this tool?',
    answer: 'Absolutely. Your JSON data never leaves your browser. All parsing, visualization, and export operations are performed client-side using JavaScript. We don\'t send your data to any server, store it, or have any way to access it. This makes our tool safe for sensitive or proprietary data.',
  },
  {
    question: 'What is the difference between 2D and 3D visualization modes?',
    answer: '2D mode renders your JSON as flat diagrams ideal for clear hierarchical views and documentation. 3D mode creates an immersive three-dimensional graph that you can rotate, zoom, and explore from any angle. 3D is particularly useful for large datasets where you want to see patterns and clusters that might be hidden in a flat view.',
  },
  {
    question: 'How large a JSON file can I visualize?',
    answer: 'The practical limit depends on your browser and computer resources. We recommend JSON files resulting in under 5,000 nodes for smooth performance. Larger files will still work but may experience slower rendering. The tool includes a node count display to help you monitor complexity.',
  },
  {
    question: 'Can I export my visualization?',
    answer: 'Yes! You can export as PNG (both modes), SVG (2D mode only), or JSON data. You can also generate a shareable URL that encodes your JSON, allowing others to see the exact same visualization without needing to share the raw data file.',
  },
  {
    question: 'What are the different layout algorithms?',
    answer: 'We offer four layouts: <b>Tree</b> shows hierarchical parent-child relationships; <b>Force-directed</b> uses physics to cluster related nodes; <b>Radial</b> arranges nodes in circles around the root; <b>Treemap</b> (2D only) uses nested rectangles sized by complexity. Each reveals different aspects of your data structure.',
  },
  {
    question: 'Can I search within my JSON visualization?',
    answer: 'Yes, our search feature lets you find specific keys or values across your entire JSON. Results are highlighted in the visualization, and clicking a result will select that node and show its path from the root. You can navigate between results using keyboard shortcuts.',
  },
  {
    question: 'Does this tool work offline?',
    answer: 'Once the page is loaded, the tool works without an internet connection. You can paste JSON, switch modes, change layouts, and explore your data completely offline. Only the URL fetch feature requires internet access.',
  },
];

export const JSON_VISUALIZER_RELATED_TOOLS: RelatedTool[] = [
  {
    title: 'JSON Editor',
    description: 'Edit JSON with tree view and code editor.',
    icon: 'fas fa-edit',
    link: '/json-editor',
  },
  {
    title: 'JSON Formatter',
    description: 'Pretty-print and format JSON data.',
    icon: 'fas fa-indent',
    link: '/json-formatter',
  },
  {
    title: 'JSON Validator',
    description: 'Validate JSON syntax and structure.',
    icon: 'fas fa-check-circle',
    link: '/json-validator',
  },
  {
    title: 'JSONPath Tester',
    description: 'Query JSON data with JSONPath expressions.',
    icon: 'fas fa-search',
    link: '/jsonpath-tester',
  },
  {
    title: 'JSON to Flow',
    description: 'Simple flowchart visualization.',
    icon: 'fas fa-project-diagram',
    link: '/json-to-flow',
  },
  {
    title: 'JSON to YAML',
    description: 'Convert JSON to YAML format.',
    icon: 'fas fa-file-alt',
    link: '/json-to-yaml',
  },
];

export const jsonVisualizerSEO = {
  title: JSON_VISUALIZER_HEADER.title,
  subtitle: JSON_VISUALIZER_HEADER.subtitle,
  trustBadges: JSON_VISUALIZER_HEADER.trustBadges,
  features: JSON_VISUALIZER_FEATURES,
  howToSteps: JSON_VISUALIZER_HOW_TO,
  educationalContent: JSON_VISUALIZER_EDUCATIONAL,
  useCases: JSON_VISUALIZER_USE_CASES,
  whyChoose: JSON_VISUALIZER_WHY_CHOOSE,
  technicalSpecs: JSON_VISUALIZER_SPECS,
  faqs: JSON_VISUALIZER_FAQ,
  relatedTools: JSON_VISUALIZER_RELATED_TOOLS,
  howToSectionTitle: 'How to Visualize JSON Online',
  featuresSectionTitle: 'Powerful Visualization Features',
  whyChooseSectionTitle: 'Why Choose Our JSON Visualizer?',
  comparisonSectionTitle: 'Technical Specifications',
};
