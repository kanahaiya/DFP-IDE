/**
 * JSON to Flow SEO Data
 * SEO content for the Flow visualization tool page
 */

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

export interface TechnicalSpec {
  feature: string;
  specification: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const jsonToFlowSEO = {
  title: 'JSON Visualizer Online Free - Interactive Flowchart Diagram Generator',
  description:
    'Visualize JSON data as interactive flowchart diagrams. Free online JSON visualizer with zoom, search, and export. Perfect for understanding complex JSON structures.',
  keywords: [
    'json visualizer',
    'json to flowchart',
    'json tree viewer',
    'visualize json online',
    'json diagram generator',
    'json structure viewer',
    'interactive json viewer',
    'json hierarchy viewer',
  ],

  heroTitle: 'JSON Visualizer',
  heroSubtitle: 'Convert JSON data into interactive flowchart diagrams instantly',

  howToSteps: [
    {
      number: 1,
      title: 'Paste JSON Data',
      description:
        'Enter or paste your JSON object into the input editor. The tool accepts any valid JSON structure.',
    },
    {
      number: 2,
      title: 'Explore the Diagram',
      description:
        'Use zoom, pan, and click to explore. Expand/collapse nodes to focus on specific sections.',
    },
    {
      number: 3,
      title: 'Search and Navigate',
      description:
        'Use the search bar to find specific keys or values. Matching nodes are highlighted.',
    },
    {
      number: 4,
      title: 'Export or Share',
      description:
        'Export the diagram as PNG, SVG, or JPEG for documentation or sharing with your team.',
    },
  ] as HowToStep[],

  educationalContent: [
    {
      title: 'Why Visualize JSON?',
      content:
        'Visualizing JSON helps you understand complex nested structures at a glance. It is especially useful for debugging APIs, exploring database schemas, and documenting data models.',
      type: 'info',
    },
    {
      title: 'Color-Coded Types',
      content:
        'Nodes are color-coded by type: Blue for objects, Purple for arrays, Green for strings, Amber for numbers, Red for booleans, and Gray for null values.',
      type: 'tip',
    },
    {
      title: 'Interactive Features',
      content:
        'Click nodes to expand/collapse. Use mouse wheel to zoom. Drag to pan. Double-click to fit the view.',
      type: 'info',
    },
  ] as EducationalSection[],

  technicalSpecs: [
    { feature: 'Layout Algorithms', specification: 'Tree, Horizontal, Radial' },
    { feature: 'Max Depth', specification: 'Configurable (default: 10)' },
    { feature: 'Search', specification: 'Keys, values, and paths' },
    { feature: 'Export Formats', specification: 'PNG, SVG, JPEG' },
    { feature: 'Processing', specification: '100% client-side' },
    { feature: 'Interaction', specification: 'Zoom, pan, expand/collapse' },
  ] as TechnicalSpec[],

  faq: [
    {
      question: 'Is this JSON visualizer free?',
      answer: 'Yes, completely free with no limitations. All processing happens in your browser.',
    },
    {
      question: 'Is my JSON data secure?',
      answer:
        'Absolutely. All visualization happens locally in your browser. No data is sent to any server.',
    },
    {
      question: 'What is the maximum JSON size?',
      answer:
        'There is no hard limit, but very large JSON files (>10MB) may affect browser performance.',
    },
    {
      question: 'Can I export the diagram?',
      answer:
        'Yes, you can export to PNG, SVG, or JPEG. SVG is best for scalable graphics in documentation.',
    },
    {
      question: 'How do I navigate large diagrams?',
      answer:
        'Use the minimap for overview, mouse wheel to zoom, drag to pan, and search to find specific nodes.',
    },
    {
      question: 'Can I customize the colors?',
      answer:
        'Yes, use the theme presets to switch between default, colorful, monochrome, or dark themes.',
    },
  ] as FAQItem[],

  useCases: [
    {
      title: 'API Debugging',
      description: 'Visualize API responses to understand data structure quickly.',
      icon: 'fa-bug',
    },
    {
      title: 'Documentation',
      description: 'Export diagrams for technical documentation and wikis.',
      icon: 'fa-file-alt',
    },
    {
      title: 'Data Exploration',
      description: 'Explore complex nested JSON from databases or logs.',
      icon: 'fa-search',
    },
    {
      title: 'Teaching',
      description: 'Explain JSON structure visually to students or team members.',
      icon: 'fa-chalkboard-teacher',
    },
  ],
};
