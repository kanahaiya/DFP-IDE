/**
 * Help documentation for JSON Minifier tool
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

export const jsonMinifierHelp: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'fas fa-play-circle',
    content:
      'The JSON Minifier helps you compress JSON data by removing unnecessary whitespace, or beautify it for readability. All processing happens in your browser - your data never leaves your computer.',
    subsections: [
      {
        title: 'Quick Start',
        content:
          '1. Paste your JSON into the input panel on the left\n2. The minified output appears instantly on the right\n3. Click Copy or Download to save your result',
      },
      {
        title: 'Input Methods',
        content:
          '• Paste directly into the editor\n• Drag and drop a .json file\n• Click the upload button to select a file\n• Use keyboard shortcut Ctrl/Cmd + V to paste',
      },
    ],
  },
  {
    id: 'modes',
    title: 'Minify vs Beautify',
    icon: 'fas fa-exchange-alt',
    content:
      'Toggle between two modes using the Mode selector in the settings panel.',
    subsections: [
      {
        title: 'Minify Mode',
        content:
          'Removes all unnecessary whitespace, newlines, and indentation. Creates the smallest possible valid JSON output. Use for production, APIs, and storage optimization.',
      },
      {
        title: 'Beautify Mode',
        content:
          'Adds proper indentation and line breaks for human readability. Choose from 2, 3, or 4 space indentation, or tabs. Use for debugging, code review, and documentation.',
      },
    ],
  },
  {
    id: 'formatting',
    title: 'Formatting Options',
    icon: 'fas fa-sliders-h',
    content:
      'Customize your output with various formatting options available in the Format panel.',
    subsections: [
      {
        title: 'Indentation',
        content:
          'When in Beautify mode, choose how many spaces to use for indentation:\n• 2 Spaces - Compact, common default\n• 3 Spaces - Medium spacing\n• 4 Spaces - More readable\n• Tabs - Traditional tab character',
      },
      {
        title: 'Sort Keys',
        content:
          'Enable to sort object keys alphabetically at every level. Benefits:\n• Consistent output for version control\n• Easier to compare JSON files\n• Better diff readability',
      },
    ],
  },
  {
    id: 'cleaning',
    title: 'Cleaning Options',
    icon: 'fas fa-broom',
    content:
      'Remove unwanted values to reduce file size further. Available in the Options panel.',
    subsections: [
      {
        title: 'Remove Nulls',
        content:
          'Strips all null values from the output. Useful when null values add no meaning to your data.',
      },
      {
        title: 'Remove Empty Strings',
        content:
          'Removes keys with empty string values (""). Helps clean up incomplete data.',
      },
      {
        title: 'Remove Empty Arrays',
        content:
          'Removes keys with empty array values ([]). Reduces noise in the output.',
      },
      {
        title: 'Remove Empty Objects',
        content:
          'Removes keys with empty object values ({}). Cleans up placeholder objects.',
      },
    ],
  },
  {
    id: 'compression-stats',
    title: 'Compression Statistics',
    icon: 'fas fa-chart-bar',
    content:
      'The stats bar shows real-time compression metrics.',
    subsections: [
      {
        title: 'Metrics Explained',
        content:
          '• Original Size - Size of your input JSON in bytes/KB\n• Output Size - Size after processing\n• Bytes Saved - How many bytes were removed\n• Reduction % - Percentage of size reduction\n• Compression Ratio - Original:Minified ratio (e.g., 2.5:1)',
      },
      {
        title: 'Typical Results',
        content:
          'Beautified JSON typically compresses by 40-70%. Already minified JSON shows minimal reduction. The stats update in real-time as you modify input or settings.',
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
        title: 'Production',
        content:
          'Standard minification for production use. Removes all whitespace while preserving data.',
      },
      {
        title: 'Compact & Clean',
        content:
          'Minified output with nulls and empty values removed. Maximum file size reduction.',
      },
      {
        title: 'Readable',
        content:
          'Beautified with 2-space indentation. Good for debugging and documentation.',
      },
      {
        title: 'Sorted Keys',
        content:
          'Beautified output with alphabetically sorted keys. Great for version control.',
      },
    ],
  },
  {
    id: 'validation',
    title: 'Error Handling',
    icon: 'fas fa-exclamation-triangle',
    content:
      'The tool validates your JSON before processing and highlights any errors.',
    subsections: [
      {
        title: 'Syntax Errors',
        content:
          'If your JSON has syntax errors, the editor will highlight the problem location. The error message shows the line and column number where the issue was detected.',
      },
      {
        title: 'Common Errors',
        content:
          '• Missing commas between properties\n• Trailing comma after last property\n• Unquoted keys (JSON requires double quotes)\n• Single quotes instead of double quotes\n• Unclosed brackets or braces',
      },
      {
        title: 'Auto-Fix',
        content:
          'Click the Auto-Fix button to attempt automatic repair of common JSON errors like trailing commas and single quotes.',
      },
    ],
  },
  {
    id: 'export',
    title: 'Exporting Results',
    icon: 'fas fa-download',
    content:
      'Multiple ways to use your processed JSON.',
    subsections: [
      {
        title: 'Copy to Clipboard',
        content:
          'Click the Copy button or use Ctrl/Cmd + C when focused on the output panel. A confirmation message appears when copied successfully.',
      },
      {
        title: 'Download File',
        content:
          'Click Download to save as a .json file. The filename includes the processing mode (minified or beautified).',
      },
    ],
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    icon: 'fas fa-keyboard',
    content:
      'Speed up your workflow with keyboard shortcuts.',
    subsections: [
      {
        title: 'Available Shortcuts',
        content:
          '• Ctrl/Cmd + V - Paste JSON\n• Ctrl/Cmd + C - Copy output\n• Ctrl/Cmd + S - Download output\n• Ctrl/Cmd + M - Toggle mode (minify/beautify)\n• Escape - Clear input',
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
          'Check if your JSON is valid. Invalid JSON cannot be processed. Look for error highlights in the input panel.',
      },
      {
        title: 'Large file is slow',
        content:
          'Very large files (>5MB) may take longer to process. Processing happens in your browser, so performance depends on your device.',
      },
      {
        title: 'Unexpected output',
        content:
          'Check your settings. If cleaning options are enabled, values may be removed from output. Disable all cleaning options to preserve all data.',
      },
      {
        title: 'Copy not working',
        content:
          'Some browsers require HTTPS for clipboard access. Make sure you\'re using the site over a secure connection.',
      },
    ],
  },
];

/**
 * Get help section by ID
 */
export function getHelpSection(id: string): HelpSection | undefined {
  return jsonMinifierHelp.find(section => section.id === id);
}

/**
 * Search help content
 */
export function searchHelp(query: string): HelpSection[] {
  const lowercaseQuery = query.toLowerCase();
  return jsonMinifierHelp.filter(section => {
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
