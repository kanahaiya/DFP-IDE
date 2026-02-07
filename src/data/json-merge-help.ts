/**
 * Help documentation for JSON Merge tool
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

export const jsonMergeHelpSections: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'fas fa-rocket',
    content: 'The JSON Merge tool lets you combine multiple JSON documents into a single output. Start by pasting or uploading your JSON files, choose a merge strategy, and get your merged result instantly.',
    subsections: [
      {
        title: 'Adding JSON Documents',
        content: 'You start with two input panes by default. Paste your JSON directly, drag-and-drop a .json file, or click the upload button. Need more inputs? Click "+ Add Input" to add up to 5 total input panes.',
      },
      {
        title: 'Quick Merge',
        content: 'For a quick merge: 1) Paste JSON into Input 1 and Input 2, 2) Leave the default "Simple Merge" strategy selected, 3) Your merged result appears instantly in the output panel. Copy or download as needed.',
      },
      {
        title: 'Understanding Merge Order',
        content: 'Documents are merged from left to right (Input 1 → Input 2 → Input 3, etc.). When keys conflict, later documents take precedence by default. You can change this behavior in the settings.',
      },
    ],
  },
  {
    id: 'merge-strategies',
    title: 'Merge Strategies',
    icon: 'fas fa-code-branch',
    content: 'Choose how your JSON documents should be combined. Each strategy handles data differently - pick the one that matches your use case.',
    subsections: [
      {
        title: 'Simple Merge (Default)',
        content: 'The simplest approach: when the same key exists in multiple documents, the later value completely overwrites the earlier one. Best for: basic merging where you want clear precedence rules.',
      },
      {
        title: 'Deep Merge',
        content: 'Recursively merges nested objects instead of overwriting them. If Input 1 has {user: {name: "John"}} and Input 2 has {user: {age: 30}}, the result is {user: {name: "John", age: 30}}. Best for: configuration files and nested data structures.',
      },
      {
        title: 'Array Concatenation',
        content: 'When arrays are encountered, they are joined together sequentially. [1, 2] + [3, 4] = [1, 2, 3, 4]. Duplicates are preserved. Best for: combining lists, log entries, or sequential data.',
      },
      {
        title: 'Array Union',
        content: 'Combines arrays while removing duplicate values. [1, 2, 3] + [2, 3, 4] = [1, 2, 3, 4]. Best for: merging unique item lists, tags, or categories.',
      },
      {
        title: 'Nested Array Merge',
        content: 'For arrays of objects, matches elements by a key field (like "id") and merges matching objects. Best for: merging user lists, product catalogs, or any array where objects have unique identifiers.',
      },
      {
        title: 'Custom Rules',
        content: 'Define per-field merge behavior. Specify which fields should use deep merge, which should use simple override, and how specific arrays should be handled. Best for: complex data with mixed requirements.',
      },
    ],
  },
  {
    id: 'input-methods',
    title: 'Input Methods',
    icon: 'fas fa-file-import',
    content: 'Multiple ways to get your JSON into the merge tool.',
    subsections: [
      {
        title: 'Paste JSON',
        content: 'Click in any input pane and paste your JSON (Ctrl+V / Cmd+V). The tool validates syntax immediately and highlights any errors.',
      },
      {
        title: 'File Upload',
        content: 'Click the upload button or drag-and-drop .json or .txt files onto any input pane. Files are read locally - they never leave your browser.',
      },
      {
        title: 'Load Sample',
        content: 'Use the sample templates dropdown to load example JSON for testing. Great for understanding how different merge strategies work.',
      },
      {
        title: 'Multiple Inputs',
        content: 'Click "+ Add Input" to add more input panes (up to 5 total). Click the "×" button on any pane (except the first two) to remove it.',
      },
    ],
  },
  {
    id: 'settings',
    title: 'Settings & Options',
    icon: 'fas fa-cog',
    content: 'Fine-tune merge behavior and output formatting.',
    subsections: [
      {
        title: 'Duplicate Key Handling',
        content: '"Keep First" preserves the value from the earliest document. "Keep Last" uses the value from the last document (default). "Merge" attempts to intelligently combine values when possible.',
      },
      {
        title: 'Null Value Handling',
        content: 'Choose whether null values should be included in the output. You can also configure whether a null in a later document should overwrite non-null values from earlier documents.',
      },
      {
        title: 'Array Ordering',
        content: '"Preserve" maintains the original order. "Sort" orders array elements alphabetically/numerically. "Unique" removes duplicates while preserving order.',
      },
      {
        title: 'Output Indentation',
        content: 'Choose 2, 3, or 4 space indentation, tabs, or minified output. The preview updates in real-time.',
      },
      {
        title: 'Sort Keys',
        content: 'Enable to sort all object keys alphabetically in the output. Useful for consistent output and easier diffing.',
      },
    ],
  },
  {
    id: 'output',
    title: 'Output & Export',
    icon: 'fas fa-file-export',
    content: 'View and export your merged JSON.',
    subsections: [
      {
        title: 'Raw JSON View',
        content: 'The default view shows syntax-highlighted JSON with line numbers. Scroll to explore large outputs.',
      },
      {
        title: 'Tree View',
        content: 'Click "Tree View" to see an interactive, collapsible representation of your merged JSON. Click nodes to expand/collapse. Great for exploring deeply nested structures.',
      },
      {
        title: 'Copy to Clipboard',
        content: 'Click "Copy" to copy the merged JSON to your clipboard. The formatted output respects your indentation settings.',
      },
      {
        title: 'Download File',
        content: 'Click "Download" to save the merged JSON as a .json file. The filename includes a timestamp for easy identification.',
      },
      {
        title: 'Statistics',
        content: 'The stats bar shows character count, line count, and key count of your merged output. Useful for validating merge completeness.',
      },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: 'fas fa-wrench',
    content: 'Common issues and how to resolve them.',
    subsections: [
      {
        title: 'Invalid JSON Error',
        content: 'Red highlighting indicates a syntax error. Common issues: missing commas between properties, unquoted keys, trailing commas, mismatched brackets. Use our JSON Validator for detailed error messages.',
      },
      {
        title: 'Unexpected Merge Result',
        content: 'Check your merge strategy. Simple Merge overwrites entire objects; Deep Merge preserves nested structure. Also verify the duplicate key handling setting matches your expectations.',
      },
      {
        title: 'Arrays Not Merging Correctly',
        content: 'By default, arrays follow the object merge strategy. For specific array handling, use Array Concatenation, Array Union, or Nested Array Merge strategies.',
      },
      {
        title: 'Large File Performance',
        content: 'Files over 5MB may cause slower processing. Consider splitting very large files or using a local tool for files exceeding 10MB combined.',
      },
      {
        title: 'Merge Order Issues',
        content: 'Documents merge left-to-right. Reorder your inputs if needed, or change the duplicate key strategy from "Keep Last" to "Keep First" to reverse precedence.',
      },
    ],
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    icon: 'fas fa-keyboard',
    content: 'Speed up your workflow with keyboard shortcuts.',
    subsections: [
      {
        title: 'General Shortcuts',
        content: 'Ctrl/Cmd + Enter: Trigger merge (if auto-merge disabled)\nCtrl/Cmd + S: Download merged result\nCtrl/Cmd + K: Copy to clipboard',
      },
      {
        title: 'Editor Shortcuts',
        content: 'Ctrl/Cmd + A: Select all in active pane\nCtrl/Cmd + Z: Undo\nCtrl/Cmd + Shift + Z: Redo\nCtrl/Cmd + F: Find in editor',
      },
    ],
  },
];
