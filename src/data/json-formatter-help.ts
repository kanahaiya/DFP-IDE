/**
 * Help documentation for JSON Formatter tool
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

export const jsonFormatterHelp: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'fas fa-play-circle',
    content:
      'The JSON Formatter helps you beautify, validate, and explore JSON data. All processing happens in your browser for maximum privacy.',
    subsections: [
      {
        title: 'Quick Start',
        content:
          '1. Paste your JSON into the input panel\n2. Formatted output appears instantly\n3. Use the toolbar to copy, download, or switch views',
      },
      {
        title: 'Input Methods',
        content:
          '• Paste directly into the editor\n• Drag and drop a .json file\n• Click Upload to select a file\n• Use Ctrl/Cmd + V to paste',
      },
    ],
  },
  {
    id: 'formatting',
    title: 'Formatting Options',
    icon: 'fas fa-indent',
    content:
      'Customize how your JSON is formatted using options in the Format panel.',
    subsections: [
      {
        title: 'Indentation',
        content:
          'Choose your preferred indentation style:\n• 2 Spaces - Most common, compact\n• 3 Spaces - Medium spacing\n• 4 Spaces - Maximum readability\n• Tabs - Traditional tab character',
      },
      {
        title: 'Sort Keys',
        content:
          'Enable to sort all object keys alphabetically at every nesting level. Benefits:\n• Consistent output for version control\n• Easier to compare JSON files\n• Cleaner git diffs',
      },
      {
        title: 'Trailing Newline',
        content:
          'Adds a newline character at the end of the output. Some tools and editors expect files to end with a newline.',
      },
    ],
  },
  {
    id: 'cleaning',
    title: 'Data Cleaning',
    icon: 'fas fa-broom',
    content:
      'Remove unwanted values from your JSON using the Clean panel options.',
    subsections: [
      {
        title: 'Remove Nulls',
        content:
          'Strips all null values from the output. Useful when null values are placeholders that add no meaning.',
      },
      {
        title: 'Remove Empty Strings',
        content:
          'Removes keys with empty string values (""). Helps clean up incomplete data.',
      },
      {
        title: 'Remove Empty Arrays/Objects',
        content:
          'Removes keys with empty arrays ([]) or empty objects ({}). Reduces noise in the output.',
      },
    ],
  },
  {
    id: 'tree-view',
    title: 'Tree View',
    icon: 'fas fa-tree',
    content:
      'The Tree View provides a visual way to explore your JSON structure.',
    subsections: [
      {
        title: 'Navigation',
        content:
          '• Click a node to select it\n• Click the arrow to expand/collapse\n• Use Expand All/Collapse All buttons\n• Scroll to navigate large trees',
      },
      {
        title: 'Search',
        content:
          '• Type in the search box to find keys or values\n• Matched nodes are highlighted\n• Use up/down arrows to navigate matches\n• Press Enter to jump to next match',
      },
      {
        title: 'Copy Paths',
        content:
          'Click the copy icon next to any node to copy its path (e.g., user.address.city). Use this path in code to access that specific value.',
      },
    ],
  },
  {
    id: 'validation',
    title: 'Validation',
    icon: 'fas fa-check-circle',
    content:
      'The tool validates your JSON in real-time and shows errors immediately.',
    subsections: [
      {
        title: 'Error Display',
        content:
          'Errors show with line and column numbers. Click an error to jump to that location in the editor. Error types help you understand what went wrong.',
      },
      {
        title: 'Common Errors',
        content:
          '• Missing commas between properties\n• Trailing comma after last property\n• Unquoted keys (JSON requires double quotes)\n• Single quotes instead of double quotes\n• Unclosed brackets or braces',
      },
    ],
  },
  {
    id: 'presets',
    title: 'Using Presets',
    icon: 'fas fa-magic',
    content:
      'One-click presets configure multiple settings at once for common use cases.',
    subsections: [
      {
        title: 'Available Presets',
        content:
          '• Readable - 2-space indentation, standard formatting\n• Expanded - 4-space indentation for deep nesting\n• Compact - Minimal whitespace\n• Sorted Keys - Alphabetically sorted with 2 spaces\n• Clean Data - Remove nulls and empty values\n• Tab Indented - Use tabs for indentation',
      },
    ],
  },
  {
    id: 'export',
    title: 'Export Options',
    icon: 'fas fa-download',
    content:
      'Multiple ways to use your formatted JSON.',
    subsections: [
      {
        title: 'Copy to Clipboard',
        content:
          'Click Copy or use Ctrl/Cmd + C when focused on output. A confirmation message appears when copied.',
      },
      {
        title: 'Download File',
        content:
          'Click Download to save as a .json file. The file is named based on the formatting mode (formatted.json or minified.json).',
      },
    ],
  },
  {
    id: 'shortcuts',
    title: 'Keyboard Shortcuts',
    icon: 'fas fa-keyboard',
    content:
      'Speed up your workflow with keyboard shortcuts.',
    subsections: [
      {
        title: 'Available Shortcuts',
        content:
          '• Ctrl/Cmd + V - Paste JSON\n• Ctrl/Cmd + C - Copy output\n• Ctrl/Cmd + S - Download output\n• Ctrl/Cmd + F - Search (in tree view)\n• Escape - Clear search',
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
        title: 'No output appearing',
        content:
          'Check if your JSON is valid. Invalid JSON cannot be formatted. Look for error messages in the validation panel.',
      },
      {
        title: 'Large file is slow',
        content:
          'Very large files (>5MB) may take longer to process. Tree view may be slow for files with many nodes. Try using code view for large files.',
      },
      {
        title: 'Unexpected changes',
        content:
          'Check your settings. If cleaning options are enabled, values may be removed. Sort Keys will change key order. Disable these to preserve original data.',
      },
    ],
  },
];

/**
 * Get help section by ID
 */
export function getHelpSection(id: string): HelpSection | undefined {
  return jsonFormatterHelp.find(section => section.id === id);
}

/**
 * Search help content
 */
export function searchHelp(query: string): HelpSection[] {
  const lowercaseQuery = query.toLowerCase();
  return jsonFormatterHelp.filter(section => {
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
