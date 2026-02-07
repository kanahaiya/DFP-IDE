/**
 * Help documentation for JSON Stats tool
 */

export interface HelpSection {
  id: string;
  title: string;
  icon: string;
  content: string;
  subsections?: {
    title: string;
    content: string;
  }[];
}

export const jsonStatsHelp: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'fas fa-play-circle',
    content:
      'The JSON Stats tool analyzes your JSON data and provides comprehensive statistics about structure, types, keys, values, and data quality. All processing happens in your browser.',
    subsections: [
      {
        title: 'Quick Start',
        content:
          '1. Paste your JSON into the input panel on the left\n2. View instant statistics in the dashboard on the right\n3. Click section tabs to explore detailed metrics\n4. Export your analysis as JSON, CSV, or Markdown',
      },
      {
        title: 'Input Methods',
        content:
          '• Paste directly into the editor\n• Drag and drop a .json file\n• Click the upload button to select a file\n• Use keyboard shortcut Ctrl/Cmd + V to paste',
      },
    ],
  },
  {
    id: 'overview',
    title: 'Overview Dashboard',
    icon: 'fas fa-tachometer-alt',
    content:
      'The Overview section shows key metrics at a glance.',
    subsections: [
      {
        title: 'Key Metrics',
        content:
          '• File Size - Original and minified size comparison\n• Structure - Depth, objects, arrays count\n• Types - Most common data type\n• Quality - Overall quality score (0-100)',
      },
      {
        title: 'Understanding the Dashboard',
        content:
          'The dashboard updates in real-time as you edit. Green indicators suggest healthy data, yellow may need attention, red indicates potential issues.',
      },
    ],
  },
  {
    id: 'structure',
    title: 'Structure Analysis',
    icon: 'fas fa-sitemap',
    content:
      'The Structure section analyzes how your JSON is organized.',
    subsections: [
      {
        title: 'Metrics Explained',
        content:
          '• Max Depth - Deepest nesting level (e.g., a.b.c = depth 3)\n• Total Objects - Count of all {} in your JSON\n• Total Arrays - Count of all [] in your JSON\n• Total Keys - Number of object properties\n• Root Type - Whether root is object, array, or primitive',
      },
      {
        title: 'What the Numbers Mean',
        content:
          'Depth > 5 may indicate overly complex structure. Many objects relative to arrays suggests document-style data. Many arrays suggests list-heavy or tabular data.',
      },
    ],
  },
  {
    id: 'types',
    title: 'Type Distribution',
    icon: 'fas fa-chart-pie',
    content:
      'The Types section shows the distribution of data types in your JSON.',
    subsections: [
      {
        title: 'Detected Types',
        content:
          '• String - Text values ("hello")\n• Number - Integers and decimals (42, 3.14)\n• Boolean - true or false\n• Null - null values\n• Object - {} containers\n• Array - [] lists',
      },
      {
        title: 'Reading the Chart',
        content:
          'The pie chart shows percentage breakdown. Most JSON has strings as the dominant type. High null percentage may indicate incomplete data. Many objects/arrays indicate nested structure.',
      },
    ],
  },
  {
    id: 'keys',
    title: 'Key Analysis',
    icon: 'fas fa-key',
    content:
      'The Keys section analyzes object property names in your JSON.',
    subsections: [
      {
        title: 'Key Metrics',
        content:
          '• Unique Keys - Number of distinct key names\n• Total Instances - How many times keys appear\n• Average Length - Average character length of keys\n• Top Keys - Most frequently used keys',
      },
      {
        title: 'Duplicate Keys',
        content:
          'Shows keys that appear multiple times. This is normal in arrays of objects. Duplicate keys at the same object level is invalid JSON (though this tool still shows which are common).',
      },
      {
        title: 'Case Variations',
        content:
          'Identifies keys that differ only by case (e.g., "userId" vs "userid"). This often indicates inconsistency that should be standardized.',
      },
    ],
  },
  {
    id: 'values',
    title: 'Value Statistics',
    icon: 'fas fa-calculator',
    content:
      'The Values section provides detailed statistics for each data type.',
    subsections: [
      {
        title: 'String Statistics',
        content:
          '• Count - Total string values\n• Length Range - Min and max string lengths\n• Average Length - Mean string length\n• Empty Strings - Count of "" values\n• Special Types - URLs, emails, dates detected',
      },
      {
        title: 'Number Statistics',
        content:
          '• Count - Total number values\n• Range - Min and max values\n• Average - Mean value\n• Sum - Total of all numbers\n• Types - Integer vs float count',
      },
      {
        title: 'Array Statistics',
        content:
          '• Count - Total arrays\n• Length Range - Smallest and largest arrays\n• Average Length - Mean elements per array\n• Empty Arrays - Count of [] values\n• Total Elements - Sum of all array items',
      },
    ],
  },
  {
    id: 'quality',
    title: 'Data Quality',
    icon: 'fas fa-check-double',
    content:
      'The Quality section evaluates your JSON data health.',
    subsections: [
      {
        title: 'Quality Score',
        content:
          'Score ranges from 0-100:\n• 90-100: Excellent - clean, consistent data\n• 70-89: Good - minor issues to address\n• 50-69: Fair - some quality concerns\n• Below 50: Poor - significant issues',
      },
      {
        title: 'Issue Types',
        content:
          '• Null Values - null instead of actual data\n• Empty Strings - "" values\n• Empty Arrays - [] with no elements\n• Empty Objects - {} with no properties\n• Inconsistent Types - Same key with different types',
      },
      {
        title: 'Suggestions',
        content:
          'Read the generated suggestions for actionable improvements. These are based on common JSON best practices and your specific data patterns.',
      },
    ],
  },
  {
    id: 'export',
    title: 'Exporting Results',
    icon: 'fas fa-download',
    content:
      'Export your analysis results in multiple formats.',
    subsections: [
      {
        title: 'Export Formats',
        content:
          '• JSON - Machine-readable format for programmatic use\n• CSV - Spreadsheet-compatible format\n• Markdown - Documentation-ready format',
      },
      {
        title: 'Export Options',
        content:
          'Choose which sections to include in the export. Toggle Size, Structure, Types, Keys, Values, and Quality sections individually.',
      },
      {
        title: 'Using Exports',
        content:
          'JSON exports work great in code or APIs. CSV exports open directly in Excel/Google Sheets. Markdown exports paste directly into GitHub READMEs or documentation.',
      },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: 'fas fa-question-circle',
    content:
      'Solutions to common issues.',
    subsections: [
      {
        title: 'No statistics showing',
        content:
          'Check if your JSON is valid. Invalid JSON cannot be analyzed. Look for error messages in the input panel.',
      },
      {
        title: 'Large file is slow',
        content:
          'Very large files (>5MB) may take longer to analyze. Processing happens in your browser, so performance depends on your device.',
      },
      {
        title: 'Unexpected results',
        content:
          'Make sure you understand what each metric measures. Refer to this help documentation for definitions. Some results (like type distribution) count nested values.',
      },
      {
        title: 'Export not working',
        content:
          'Try a different browser if downloads are blocked. Some browsers require HTTPS for downloads. Make sure you have stats to export (valid JSON required).',
      },
    ],
  },
];

/**
 * Get help section by ID
 */
export function getHelpSection(id: string): HelpSection | undefined {
  return jsonStatsHelp.find(section => section.id === id);
}

/**
 * Search help content
 */
export function searchHelp(query: string): HelpSection[] {
  const lowercaseQuery = query.toLowerCase();
  return jsonStatsHelp.filter(section => {
    const titleMatch = section.title.toLowerCase().includes(lowercaseQuery);
    const contentMatch = section.content.toLowerCase().includes(lowercaseQuery);
    const subsectionMatch = section.subsections?.some(
      sub =>
        sub.title.toLowerCase().includes(lowercaseQuery) ||
        sub.content.toLowerCase().includes(lowercaseQuery)
    );
    return titleMatch || contentMatch || subsectionMatch;
  });
}
