/**
 * JSON Repair Help Documentation
 * Help content for JSON Repair tool
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

export const jsonRepairHelp: HelpSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    icon: 'fas fa-info-circle',
    content: 'JSON Repair automatically fixes common syntax errors in your JSON data. Simply paste your broken JSON, choose a repair mode, and click repair to get valid JSON instantly.',
    subsections: [
      {
        title: 'Key Features',
        content: '• One-click automatic repair\n• Multiple repair modes (Strict, Standard, Lenient, LLM)\n• Detailed repair summary\n• 100% browser-based (privacy-first)\n• Support for large files up to 10MB',
      },
      {
        title: 'Best Use Cases',
        content: '• Fixing API responses with syntax errors\n• Repairing AI-generated JSON\n• Converting JavaScript objects to JSON\n• Cleaning copy-pasted JSON from documents\n• Fixing MongoDB exports',
      },
    ],
  },
  {
    id: 'repair-modes',
    title: 'Repair Modes',
    icon: 'fas fa-sliders-h',
    content: 'Choose a repair mode based on your needs. Each mode applies different levels of repair aggressiveness.',
    subsections: [
      {
        title: 'Strict Mode',
        content: 'Only makes safe, obvious fixes that are guaranteed to be correct. Best for production data where accuracy is critical. Fixes: quotes, trailing commas, boolean/null capitalization, comments.',
      },
      {
        title: 'Standard Mode',
        content: 'Balanced repair for general use. Applies most common fixes while maintaining data integrity. This is the default mode for most situations.',
      },
      {
        title: 'Lenient Mode',
        content: 'Aggressive repair for severely broken JSON. Attempts to fix everything possible including missing brackets, unquoted keys, and complex structural issues.',
      },
      {
        title: 'LLM Output Mode',
        content: 'Optimized for JSON from ChatGPT, Claude, and other AI tools. Handles common AI output issues like trailing commas, wrong quote styles, and markdown code blocks.',
      },
    ],
  },
  {
    id: 'common-errors',
    title: 'Errors We Fix',
    icon: 'fas fa-wrench',
    content: 'JSON Repair can fix a wide variety of syntax errors automatically.',
    subsections: [
      {
        title: 'Quote Issues',
        content: "• Single quotes → double quotes: {'name': 'John'} → {\"name\": \"John\"}\n• Curly quotes → straight quotes: \u201Cvalue\u201D → \"value\"\n• Unquoted keys → quoted keys: {name: \"John\"} → {\"name\": \"John\"}",
      },
      {
        title: 'Comma Issues',
        content: '• Trailing commas removed: [1, 2, 3,] → [1, 2, 3]\n• Missing commas added: {"a": 1 "b": 2} → {"a": 1, "b": 2}',
      },
      {
        title: 'Value Issues',
        content: '• Boolean fix: True/FALSE → true/false\n• Null fix: NULL/None/Null → null\n• Undefined fix: undefined → null\n• NaN/Infinity fix: NaN/Infinity → null',
      },
      {
        title: 'Cleanup',
        content: '• JavaScript comments: // and /* */ removed\n• JSONP wrappers: callback({...}) → {...}\n• MongoDB types: ObjectId("...") → "..."',
      },
    ],
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    icon: 'fas fa-keyboard',
    content: 'Use these shortcuts to work faster with JSON Repair.',
    subsections: [
      {
        title: 'Editor Shortcuts',
        content: '• Ctrl/Cmd + V: Paste JSON\n• Ctrl/Cmd + A: Select all\n• Ctrl/Cmd + Z: Undo\n• Ctrl/Cmd + Shift + Z: Redo',
      },
      {
        title: 'Tool Shortcuts',
        content: '• Ctrl/Cmd + Enter: Repair JSON\n• Ctrl/Cmd + Shift + C: Copy output\n• Ctrl/Cmd + S: Download output',
      },
    ],
  },
  {
    id: 'tips',
    title: 'Tips & Best Practices',
    icon: 'fas fa-lightbulb',
    content: 'Get the most out of JSON Repair with these tips.',
    subsections: [
      {
        title: 'Choose the Right Mode',
        content: 'Start with Standard mode for most cases. Use Strict for production data, Lenient for severely broken JSON, and LLM mode for AI outputs.',
      },
      {
        title: 'Review Before Using',
        content: 'Always review the repair summary to understand what changes were made. Check the confidence level - low confidence repairs may need manual verification.',
      },
      {
        title: 'Use with Other Tools',
        content: 'After repair, use JSON Formatter to beautify your JSON, or JSON Validator to verify it meets your requirements. For learning about errors, try JSON Fixer.',
      },
      {
        title: 'Large Files',
        content: 'For files larger than 5MB, the repair may take a few seconds. The tool supports files up to 10MB.',
      },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: 'fas fa-question-circle',
    content: 'Solutions for common issues.',
    subsections: [
      {
        title: 'Repair Failed',
        content: 'If repair fails, your JSON may be too corrupted for automatic repair. Try using our JSON Fixer tool to manually debug and fix errors one by one.',
      },
      {
        title: 'Low Confidence Result',
        content: 'A low confidence result means the tool made significant structural changes. Review the output carefully and compare with your original data.',
      },
      {
        title: 'Unexpected Changes',
        content: 'If you see unexpected changes, try using Strict mode instead. It only makes safe, obvious fixes and preserves more of your original structure.',
      },
      {
        title: 'Data Type Changes',
        content: 'JSON Repair only fixes syntax, not data types. If you need to change "123" to 123 (string to number), use our JSON Cleaner tool instead.',
      },
    ],
  },
];
