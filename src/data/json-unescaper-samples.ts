/**
 * Sample templates for the JSON Unescaper tool
 */

export interface UnescaperSample {
  id: string;
  name: string;
  description: string;
  content: string;
}

export const UNESCAPER_SAMPLES: UnescaperSample[] = [
  {
    id: 'simple-escaped',
    name: 'Simple Escaped',
    description: 'Basic escaped JSON string',
    content: '"{\\\"name\\\":\\\"John Doe\\\",\\\"email\\\":\\\"john@example.com\\\",\\\"active\\\":true}"',
  },
  {
    id: 'double-escaped',
    name: 'Double Escaped',
    description: 'JSON escaped twice',
    content: '"\\\"{\\\\\\\"name\\\\\\\":\\\\\\\"John\\\\\\\",\\\\\\\"count\\\\\\\":42}\\\""',
  },
  {
    id: 'newlines-tabs',
    name: 'Newlines & Tabs',
    description: 'Escaped string with whitespace',
    content: '"Line 1\\nLine 2\\nLine 3\\n\\tIndented line"',
  },
  {
    id: 'unicode-escaped',
    name: 'Unicode Escaped',
    description: 'String with Unicode escape sequences',
    content: '"Caf\\u00e9 r\\u00e9sum\\u00e9 \\u00a9 2026 \\u2764"',
  },
  {
    id: 'api-response',
    name: 'API Response',
    description: 'Escaped API response payload',
    content: '"{\\\"status\\\":\\\"success\\\",\\\"data\\\":{\\\"id\\\":12345,\\\"message\\\":\\\"Hello\\\\nWorld\\\"},\\\"timestamp\\\":\\\"2026-01-15T10:30:00Z\\\"}"',
  },
  {
    id: 'config-object',
    name: 'Config Object',
    description: 'Escaped configuration JSON',
    content: '"{\\\"database\\\":{\\\"host\\\":\\\"localhost\\\",\\\"port\\\":5432,\\\"path\\\":\\\"C:\\\\\\\\Users\\\\\\\\Admin\\\\\\\\data\\\"},\\\"debug\\\":true}"',
  },
  {
    id: 'html-content',
    name: 'HTML Content',
    description: 'Escaped JSON containing HTML',
    content: '"{\\\"title\\\":\\\"My \\\\\\\"Bold\\\\\\\" Title\\\",\\\"content\\\":\\\"<div>Hello</div>\\\"}"',
  },
  {
    id: 'triple-escaped',
    name: 'Triple Escaped',
    description: 'Deeply nested escaped string',
    content: '"\\\"\\\\\\\"\\\\\\\\\\\\\\\"test\\\\\\\\\\\\\\\"\\\\\\\"\\\"',
  },
];
