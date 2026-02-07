/**
 * JSON Editor Help Documentation
 * Comprehensive help content for the JSON Editor tool
 */

/**
 * Help section interface
 */
export interface HelpSection {
  id: string;
  title: string;
  content: string;
  subsections?: {
    title: string;
    content: string;
  }[];
}

/**
 * Keyboard shortcut interface
 */
export interface KeyboardShortcut {
  keys: string[];
  description: string;
  category: 'general' | 'editing' | 'navigation' | 'clipboard';
}

/**
 * Help sections
 */
export const JSON_EDITOR_HELP_SECTIONS: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: 'The JSON Editor provides a visual interface for editing JSON data. You can load JSON by pasting it into the editor or by loading a sample. The editor will validate your JSON and display it in a tree structure.',
    subsections: [
      {
        title: 'Loading Data',
        content: 'Paste JSON into the input area or use Code View to type directly. Invalid JSON will show error messages with line numbers and suggestions.',
      },
      {
        title: 'Viewing Modes',
        content: 'Use the Tree/Code toggle to switch between visual tree editing and raw JSON code editing. Both views are synchronized.',
      },
    ],
  },
  {
    id: 'tree-navigation',
    title: 'Tree Navigation',
    content: 'Navigate through your JSON structure using the expandable tree view.',
    subsections: [
      {
        title: 'Expanding/Collapsing',
        content: 'Click the arrow icons to expand or collapse objects and arrays. Use "Expand All" or "Collapse All" buttons for bulk operations.',
      },
      {
        title: 'Selecting Nodes',
        content: 'Click on any node to select it. Selected nodes are highlighted and can be operated on using the toolbar or keyboard shortcuts.',
      },
      {
        title: 'Path Breadcrumb',
        content: 'The breadcrumb at the top shows your current location in the JSON structure. Click on any segment to navigate to that level.',
      },
    ],
  },
  {
    id: 'editing-values',
    title: 'Editing Values',
    content: 'Edit JSON values directly in the tree view.',
    subsections: [
      {
        title: 'In-Place Editing',
        content: 'Double-click on any value to edit it. Press Enter to save or Escape to cancel. The editor preserves the data type automatically.',
      },
      {
        title: 'Changing Types',
        content: 'Right-click on a node and select "Change Type" to convert between string, number, boolean, null, object, and array. Type conversion attempts to preserve the value when possible.',
      },
      {
        title: 'Editing Keys',
        content: 'Double-click on a key name to rename it. Key names must be unique within their parent object.',
      },
    ],
  },
  {
    id: 'managing-structure',
    title: 'Managing Structure',
    content: 'Add, remove, and reorganize JSON properties and array items.',
    subsections: [
      {
        title: 'Adding Properties',
        content: 'Click the "+" button on an object node or use right-click menu → Add Property. Specify the key name and select the initial type.',
      },
      {
        title: 'Adding Array Items',
        content: 'Click the "+" button on an array node to add a new item at the end. Use the "Insert" option to add at a specific position.',
      },
      {
        title: 'Deleting',
        content: 'Select a node and press Delete, or use right-click menu → Delete. By default, deletion requires confirmation (can be disabled in settings).',
      },
      {
        title: 'Duplicating',
        content: 'Right-click → Duplicate to create a copy of a node. For objects, the key will have "_copy" appended.',
      },
      {
        title: 'Reordering',
        content: 'For array items, use the up/down arrows in the toolbar or right-click menu to move items. Object properties maintain insertion order.',
      },
    ],
  },
  {
    id: 'search',
    title: 'Search Functionality',
    content: 'Find specific keys or values in your JSON data.',
    subsections: [
      {
        title: 'Basic Search',
        content: 'Press Ctrl/Cmd+F or click the search icon. Type your query to find matches in keys and/or values.',
      },
      {
        title: 'Search Options',
        content: 'Toggle case sensitivity, whole word matching, and regular expression support. Choose to search keys, values, or both.',
      },
      {
        title: 'Navigating Results',
        content: 'Use the arrow buttons or Enter/Shift+Enter to move between results. The matched node will be selected and expanded.',
      },
    ],
  },
  {
    id: 'undo-redo',
    title: 'Undo & Redo',
    content: 'The editor maintains a history of your changes for easy recovery.',
    subsections: [
      {
        title: 'Using Undo/Redo',
        content: 'Press Ctrl/Cmd+Z to undo and Ctrl/Cmd+Y (or Ctrl/Cmd+Shift+Z) to redo. The toolbar shows buttons with tooltips for available actions.',
      },
      {
        title: 'History Limit',
        content: 'By default, the last 50 actions are saved. This can be adjusted in settings. For large files, consider reducing this to save memory.',
      },
    ],
  },
  {
    id: 'clipboard',
    title: 'Copy, Cut & Paste',
    content: 'Use clipboard operations to move or duplicate data.',
    subsections: [
      {
        title: 'Copy',
        content: 'Select a node and press Ctrl/Cmd+C or use right-click → Copy. The node value (and structure) is copied to the internal clipboard.',
      },
      {
        title: 'Cut',
        content: 'Select a node and press Ctrl/Cmd+X or use right-click → Cut. The node is copied and then deleted.',
      },
      {
        title: 'Paste',
        content: 'Select a target object or array and press Ctrl/Cmd+V. The copied value will be added as a new property.',
      },
    ],
  },
  {
    id: 'code-view',
    title: 'Code View',
    content: 'Edit raw JSON with syntax highlighting.',
    subsections: [
      {
        title: 'Switching Views',
        content: 'Click the Code View toggle to see raw JSON. Changes are validated when switching back to Tree View.',
      },
      {
        title: 'Format & Minify',
        content: 'Use the Format button to beautify JSON with proper indentation. Use Minify to compress by removing whitespace.',
      },
      {
        title: 'Copy All',
        content: 'Click the copy button in Code View to copy the entire JSON to your system clipboard.',
      },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    content: 'Customize the editor behavior.',
    subsections: [
      {
        title: 'Display Settings',
        content: 'Toggle type indicators, path display, and line numbers. Adjust indentation size.',
      },
      {
        title: 'Parse Mode',
        content: 'Use Strict mode for RFC 8259 compliance. Use Lenient mode to allow comments and trailing commas (JSON5).',
      },
      {
        title: 'Presets',
        content: 'Quick configurations for common use cases: Default, Strict, Lenient, Large Files, etc.',
      },
    ],
  },
];

/**
 * Keyboard shortcuts
 */
export const JSON_EDITOR_SHORTCUTS: KeyboardShortcut[] = [
  // General
  { keys: ['Ctrl/Cmd', 'Z'], description: 'Undo last action', category: 'general' },
  { keys: ['Ctrl/Cmd', 'Y'], description: 'Redo last undone action', category: 'general' },
  { keys: ['Ctrl/Cmd', 'Shift', 'Z'], description: 'Redo (alternate)', category: 'general' },
  { keys: ['Ctrl/Cmd', 'F'], description: 'Open search', category: 'general' },
  { keys: ['Escape'], description: 'Close dialogs / Cancel editing', category: 'general' },
  
  // Editing
  { keys: ['Enter'], description: 'Confirm edit / Open selected', category: 'editing' },
  { keys: ['Delete'], description: 'Delete selected node', category: 'editing' },
  { keys: ['Backspace'], description: 'Delete selected node', category: 'editing' },
  { keys: ['F2'], description: 'Edit selected node', category: 'editing' },
  
  // Navigation
  { keys: ['↑'], description: 'Move selection up', category: 'navigation' },
  { keys: ['↓'], description: 'Move selection down', category: 'navigation' },
  { keys: ['←'], description: 'Collapse node / Move to parent', category: 'navigation' },
  { keys: ['→'], description: 'Expand node / Move to first child', category: 'navigation' },
  { keys: ['Home'], description: 'Go to first node', category: 'navigation' },
  { keys: ['End'], description: 'Go to last visible node', category: 'navigation' },
  
  // Clipboard
  { keys: ['Ctrl/Cmd', 'C'], description: 'Copy selected node', category: 'clipboard' },
  { keys: ['Ctrl/Cmd', 'X'], description: 'Cut selected node', category: 'clipboard' },
  { keys: ['Ctrl/Cmd', 'V'], description: 'Paste into selected node', category: 'clipboard' },
  { keys: ['Ctrl/Cmd', 'D'], description: 'Duplicate selected node', category: 'clipboard' },
];

/**
 * Quick tips
 */
export const JSON_EDITOR_QUICK_TIPS = [
  'Double-click on values to edit them in place',
  'Right-click on nodes for a context menu with all available actions',
  'Use the search function to quickly find keys or values in large files',
  'Press Ctrl/Cmd+Z repeatedly to undo multiple changes',
  'Enable Lenient mode to edit JSON with comments',
  'Use keyboard arrows to navigate the tree quickly',
  'Click the path breadcrumb to navigate to parent nodes',
  'Use presets to quickly switch between different editing configurations',
];

/**
 * Error message explanations
 */
export const JSON_EDITOR_ERROR_EXPLANATIONS: Record<string, string> = {
  'Unexpected token': 'The JSON contains an invalid character or syntax. Check for missing quotes, commas, or brackets.',
  'Unexpected end of JSON input': 'The JSON is incomplete. Check for missing closing brackets or quotes.',
  'Duplicate key': 'The same key appears twice in an object. Each key must be unique within its object.',
  'Invalid number': 'The number format is incorrect. JSON numbers cannot have leading zeros (except for 0.x) and cannot be NaN or Infinity.',
  'Invalid string': 'The string contains invalid characters or escape sequences. Strings must be enclosed in double quotes.',
  'Maximum depth exceeded': 'The JSON is too deeply nested. Consider flattening the structure.',
};
