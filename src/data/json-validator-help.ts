/**
 * JSON Validator Help Documentation
 * Help content for JSON Validator tool
 */

export interface HelpSection {
  title: string;
  content: string;
}

export const jsonValidatorHelp: HelpSection[] = [
  {
    title: 'Getting Started',
    content: `The JSON Validator helps you check if your JSON data is syntactically correct.

**Quick Start:**
1. Paste your JSON in the input editor
2. Validation happens automatically
3. Review any errors shown with line numbers
4. Use Auto-Fix for common issues

**Features:**
- Real-time validation as you type
- Detailed error messages with locations
- Auto-fix for common problems
- JSON statistics display`,
  },
  {
    title: 'Validation Modes',
    content: `Choose the validation strictness level:

**Strict (RFC 8259)** - Default
- No trailing commas allowed
- Double quotes required for strings
- No comments allowed
- No unquoted keys

**Lenient (JSON5-like)**
- Allows trailing commas
- Allows single quotes
- Allows comments (// and /* */)
- Allows unquoted keys

**Config Files**
- Allows comments
- Allows trailing commas
- Strict on other rules
- Best for tsconfig.json, package.json, etc.`,
  },
  {
    title: 'Auto-Fix Feature',
    content: `Auto-fix can automatically correct these common errors:

**Fixable Issues:**
- Single quotes → Double quotes
- Trailing commas → Removed
- Comments → Removed
- Unquoted keys → Quoted
- undefined/NaN/Infinity → null

**How to Use:**
1. Click "Auto-Fix" button when errors are detected
2. Review the changes in the preview
3. Click "Apply" to accept the fixes

Note: Some errors cannot be auto-fixed and require manual correction.`,
  },
  {
    title: 'JSON Statistics',
    content: `The statistics panel shows useful information about your JSON:

**Metrics:**
- **Total Keys**: Number of object keys
- **Total Values**: Total value count
- **Depth**: Maximum nesting level
- **Objects**: Number of objects
- **Arrays**: Number of arrays
- **Strings/Numbers/Booleans/Nulls**: Type counts
- **Size**: File size in bytes/KB/MB

Enable/disable statistics in Settings.`,
  },
  {
    title: 'Understanding Errors',
    content: `Error messages include:

**Line & Column**: Exact position of the error
**Message**: Description of what's wrong
**Suggestion**: How to fix the issue
**Severity**: error, warning, or info

**Common Error Types:**
- "Unexpected token" - Syntax error at position
- "Trailing comma" - Extra comma before ] or }
- "Single quotes" - Use double quotes instead
- "Duplicate key" - Same key appears twice`,
  },
  {
    title: 'Keyboard Shortcuts',
    content: `Use these shortcuts for faster workflow:

- **Ctrl/Cmd + V**: Paste JSON
- **Ctrl/Cmd + A**: Select all
- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Shift + Z**: Redo
- **Ctrl/Cmd + F**: Find in editor
- **Ctrl/Cmd + H**: Find and replace`,
  },
];

export const jsonValidatorHelpTitle = 'JSON Validator Help';
