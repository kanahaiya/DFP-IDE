/**
 * JSON Fixer Help Documentation
 * Help content for JSON Fixer tool
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

export const jsonFixerHelp: HelpSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    icon: 'fas fa-info-circle',
    content: 'JSON Fixer is an interactive debugging tool that helps you find and fix JSON syntax errors one by one. Unlike automatic repair tools, it shows you each error with explanations so you can learn and make informed decisions.',
    subsections: [
      {
        title: 'Key Features',
        content: '• See ALL errors at once\n• Click to navigate to error location\n• Preview fixes before applying\n• Learn from detailed explanations\n• Filter by severity and category\n• 100% browser-based (private)',
      },
      {
        title: 'When to Use JSON Fixer',
        content: '• When you want to understand what\'s wrong\n• When learning JSON syntax\n• When you need selective fixing\n• When debugging specific errors\n• When teaching JSON concepts',
      },
    ],
  },
  {
    id: 'error-panel',
    title: 'Error Panel',
    icon: 'fas fa-list',
    content: 'The error panel shows all detected errors in your JSON. Each error displays its type, location, and a fix button if available.',
    subsections: [
      {
        title: 'Error Information',
        content: '• Error type (e.g., "Single Quote", "Trailing Comma")\n• Line and column number\n• Error message description\n• Fix button (if fixable)\n• Click to select and see explanation',
      },
      {
        title: 'Navigating Errors',
        content: '• Click an error to select it\n• The editor will scroll to that location\n• Selected errors show their explanation\n• Use keyboard arrows to move between errors',
      },
    ],
  },
  {
    id: 'severity-levels',
    title: 'Severity Levels',
    icon: 'fas fa-exclamation-triangle',
    content: 'Errors are classified by severity to help you prioritize fixing.',
    subsections: [
      {
        title: 'Critical (Red)',
        content: 'Errors that completely prevent JSON parsing. Examples: unclosed brackets, missing colons, unexpected end of input. Fix these first!',
      },
      {
        title: 'High (Orange)',
        content: 'Major syntax errors that break the JSON. Examples: wrong quote types, unquoted keys, missing quotes. Usually easy to fix.',
      },
      {
        title: 'Medium (Yellow)',
        content: 'Common errors that affect validity. Examples: wrong boolean/null capitalization, undefined values. Simple fixes.',
      },
      {
        title: 'Low (Green)',
        content: 'Minor issues or warnings. Examples: trailing commas, comments, duplicate keys. May be intentional in some contexts.',
      },
    ],
  },
  {
    id: 'fixing-errors',
    title: 'Fixing Errors',
    icon: 'fas fa-wrench',
    content: 'Learn how to apply fixes to your JSON errors.',
    subsections: [
      {
        title: 'Individual Fixes',
        content: '1. Click an error to select it\n2. Click the "Fix" button\n3. Review the before/after preview\n4. Click "Apply Fix" to confirm',
      },
      {
        title: 'Bulk Fixing',
        content: 'Click "Fix All (High Confidence)" to apply all fixes that the tool is confident about. Low confidence fixes require manual review.',
      },
      {
        title: 'Undo',
        content: 'Click "Undo" to revert the last fix. You can undo multiple times to restore earlier states.',
      },
    ],
  },
  {
    id: 'filtering',
    title: 'Filtering Errors',
    icon: 'fas fa-filter',
    content: 'Use filters to focus on specific types of errors.',
    subsections: [
      {
        title: 'By Severity',
        content: 'Click severity buttons to show/hide errors of that level. Useful for focusing on critical errors first.',
      },
      {
        title: 'By Category',
        content: '• Syntax: Quote and punctuation errors\n• Structure: Bracket and brace issues\n• Value: Boolean, null, undefined errors\n• Formatting: Commas, comments\n• Encoding: Escape sequences\n• Semantic: Duplicate keys',
      },
    ],
  },
  {
    id: 'learning-mode',
    title: 'Learning JSON',
    icon: 'fas fa-graduation-cap',
    content: 'JSON Fixer is designed to help you learn JSON syntax.',
    subsections: [
      {
        title: 'Enable Explanations',
        content: 'Turn on "Show Explanations" in settings. When you click an error, you\'ll see:\n• Why the error occurs\n• Examples of correct syntax\n• Tips for avoiding the error',
      },
      {
        title: 'Common Mistakes',
        content: '• Single quotes (JavaScript style)\n• Trailing commas (allowed in JS)\n• Comments (not supported)\n• Unquoted keys (JS object literal)\n• Python booleans (True/False)',
      },
    ],
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    icon: 'fas fa-keyboard',
    content: 'Use these shortcuts for faster navigation.',
    subsections: [
      {
        title: 'Navigation',
        content: '• ↑/↓: Move between errors\n• Enter: Apply fix for selected error\n• Escape: Deselect error',
      },
      {
        title: 'Actions',
        content: '• Ctrl/Cmd + Z: Undo last fix\n• Ctrl/Cmd + Shift + F: Fix all high confidence\n• Ctrl/Cmd + D: Detect errors again',
      },
    ],
  },
];
