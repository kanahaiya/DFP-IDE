/**
 * Help documentation for JSON to Excel tool
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

export const jsonToExcelHelp: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'fas fa-play-circle',
    content:
      'The JSON to Excel Converter transforms JSON data into downloadable Excel files. All processing happens in your browser for maximum privacy.',
    subsections: [
      {
        title: 'Quick Start',
        content:
          '1. Paste your JSON into the input panel\n2. Preview appears automatically\n3. Adjust columns if needed\n4. Click "Download Excel" to save',
      },
      {
        title: 'Supported Structures',
        content:
          '• Arrays of objects (most common)\n• Single objects\n• Arrays of primitives\n• Nested objects (automatically flattened)',
      },
    ],
  },
  {
    id: 'file-formats',
    title: 'File Formats',
    icon: 'fas fa-file-excel',
    content:
      'Choose the output format that best fits your needs.',
    subsections: [
      {
        title: 'XLSX (Recommended)',
        content:
          'Modern Excel format (2007+). Supports all features, smaller file size, and better compatibility. Use this for most cases.',
      },
      {
        title: 'XLS (Legacy)',
        content:
          'Older Excel format (2003 and earlier). Use only if recipients have very old Excel versions that cannot open XLSX files.',
      },
      {
        title: 'CSV',
        content:
          'Simple text format that works everywhere. Good for compatibility but loses Excel features like multiple sheets and formatting.',
      },
    ],
  },
  {
    id: 'nested-objects',
    title: 'Handling Nested Objects',
    icon: 'fas fa-layer-group',
    content:
      'Nested JSON objects are flattened to create tabular data suitable for spreadsheets.',
    subsections: [
      {
        title: 'How Flattening Works',
        content:
          'Nested objects are converted using dot notation. For example:\n{user: {name: "John", address: {city: "NYC"}}}\nbecomes columns:\n• user.name = "John"\n• user.address.city = "NYC"',
      },
      {
        title: 'Flattening Depth',
        content:
          'Control how deep to flatten with the "Max Depth" setting. Higher values flatten more levels. Objects deeper than the limit are converted to JSON strings.',
      },
      {
        title: 'Disable Flattening',
        content:
          'Turn off "Flatten Nested Objects" to keep nested objects as JSON strings in cells. Useful if you need to preserve the original structure.',
      },
    ],
  },
  {
    id: 'columns',
    title: 'Column Management',
    icon: 'fas fa-columns',
    content:
      'Customize which columns appear in your Excel file and how they are presented.',
    subsections: [
      {
        title: 'Select Columns',
        content:
          'Check/uncheck columns to include or exclude them from the export. Deselected columns will not appear in the downloaded file.',
      },
      {
        title: 'Rename Columns',
        content:
          'Click on a column name to rename it. The new name will appear as the header in your Excel file. The original key is preserved.',
      },
      {
        title: 'Reorder Columns',
        content:
          'Drag columns up or down to change their order in the output. The preview updates to show your new column arrangement.',
      },
    ],
  },
  {
    id: 'preview',
    title: 'Using Preview',
    icon: 'fas fa-eye',
    content:
      'The preview shows exactly how your data will appear in the Excel file.',
    subsections: [
      {
        title: 'Preview Limits',
        content:
          'Preview shows the first 100 rows. This ensures fast rendering even for large datasets. The full data is exported when you download.',
      },
      {
        title: 'Data Summary',
        content:
          'Check the summary panel to see total rows, columns, detected structure type, and any warnings about your data.',
      },
    ],
  },
  {
    id: 'formatting',
    title: 'Excel Formatting',
    icon: 'fas fa-palette',
    content:
      'Add professional formatting to your Excel output.',
    subsections: [
      {
        title: 'Auto-fit Columns',
        content:
          'Automatically adjusts column widths based on content. Makes data easier to read without manual resizing.',
      },
      {
        title: 'Bold Headers',
        content:
          'Makes the header row bold for better visual distinction. Recommended for most exports.',
      },
      {
        title: 'Freeze Headers',
        content:
          'Keeps the header row visible when scrolling through large datasets. Very useful for tables with many rows.',
      },
      {
        title: 'Auto-Filter',
        content:
          'Adds filter dropdowns to header cells. Allows recipients to sort and filter data in Excel.',
      },
    ],
  },
  {
    id: 'arrays',
    title: 'Array Handling',
    icon: 'fas fa-list',
    content:
      'Understanding how different array types are converted.',
    subsections: [
      {
        title: 'Arrays of Objects',
        content:
          'Each object becomes a row. Object keys become columns. This is the most common JSON structure for conversion.',
      },
      {
        title: 'Arrays of Primitives',
        content:
          'Each value becomes a row with a single "value" column. Numbers, strings, and booleans are preserved.',
      },
      {
        title: 'Nested Arrays',
        content:
          'Arrays within objects are converted to JSON strings by default. Enable deeper flattening to expand them.',
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
        title: 'No preview showing',
        content:
          'Check if your JSON is valid. Invalid JSON cannot be converted. Look for error messages below the input area.',
      },
      {
        title: 'Missing columns',
        content:
          'Check the Columns tab. Columns may be deselected. Click "Select All" to include all detected columns.',
      },
      {
        title: 'Nested data as strings',
        content:
          'Enable "Flatten Nested Objects" in settings. Increase the "Max Depth" if nested objects still appear as strings.',
      },
      {
        title: 'Large file is slow',
        content:
          'Files over 5MB may take longer to process. Processing happens in your browser, so performance depends on your device.',
      },
      {
        title: 'Download not starting',
        content:
          'Check that at least one column is selected. The "Download Excel" button is disabled if no columns are chosen.',
      },
    ],
  },
];

/**
 * Get help section by ID
 */
export function getHelpSection(id: string): HelpSection | undefined {
  return jsonToExcelHelp.find(section => section.id === id);
}

/**
 * Search help content
 */
export function searchHelp(query: string): HelpSection[] {
  const lowercaseQuery = query.toLowerCase();
  return jsonToExcelHelp.filter(section => {
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
