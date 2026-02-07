/**
 * JSON Cleaner Help Documentation
 * Help content for JSON Cleaner tool
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

export const jsonCleanerHelp: HelpSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    icon: 'fas fa-info-circle',
    content: 'JSON Cleaner helps you clean, transform, and sanitize JSON data. Remove empty values, convert key naming conventions, transform types, and more.',
    subsections: [
      {
        title: 'Key Features',
        content: '• Remove null, empty strings, empty arrays/objects\n• Transform keys (camelCase, snake_case, etc.)\n• Convert types (string to number, etc.)\n• Flatten/unflatten nested objects\n• Deduplicate arrays\n• Sort keys alphabetically',
      },
      {
        title: 'Presets',
        content: 'Use presets for common scenarios:\n• Minimal: Safe, only removes undefined\n• Standard: Common operations\n• Aggressive: Maximum cleaning\n• API Ready: For API responses\n• Storage: Minimum size',
      },
    ],
  },
  {
    id: 'cleaning',
    title: 'Cleaning Options',
    icon: 'fas fa-broom',
    content: 'Control what values are removed from your JSON.',
    subsections: [
      {
        title: 'Remove Empty Values',
        content: '• Remove null: Delete all null values\n• Remove empty strings: Delete "" values\n• Remove empty arrays: Delete [] values\n• Remove empty objects: Delete {} values',
      },
      {
        title: 'String Operations',
        content: '• Trim whitespace: Remove leading/trailing spaces from strings\n• Remove whitespace-only: Delete strings with only spaces',
      },
      {
        title: 'Array & Object Operations',
        content: '• Deduplicate arrays: Remove duplicate items\n• Sort keys: Alphabetically sort object keys',
      },
    ],
  },
  {
    id: 'transform',
    title: 'Transformations',
    icon: 'fas fa-exchange-alt',
    content: 'Transform key names and value types.',
    subsections: [
      {
        title: 'Key Naming Conventions',
        content: '• camelCase: myPropertyName\n• PascalCase: MyPropertyName\n• snake_case: my_property_name\n• kebab-case: my-property-name\n• SCREAMING_SNAKE_CASE: MY_PROPERTY_NAME',
      },
      {
        title: 'Type Conversions',
        content: '• String to Number: "123" → 123\n• String to Boolean: "true" → true\n• Number to String: 123 → "123"\n• Boolean to String: true → "true"\n• Null to String: null → "null"',
      },
      {
        title: 'Structure Transforms',
        content: '• Flatten: Convert nested objects to flat with dot notation\n• Unflatten: Convert dot notation keys back to nested objects\n• Custom separator: Use any character as key separator',
      },
    ],
  },
  {
    id: 'presets',
    title: 'Using Presets',
    icon: 'fas fa-magic',
    content: 'Presets apply pre-configured settings for common use cases.',
    subsections: [
      {
        title: 'Minimal Preset',
        content: 'Safest option. Only removes undefined values. Use when you want to preserve all data except truly invalid values.',
      },
      {
        title: 'Standard Preset',
        content: 'Common cleaning operations. Trims strings and removes whitespace-only values. Good for general use.',
      },
      {
        title: 'Aggressive Preset',
        content: 'Maximum cleaning. Removes all empty values, deduplicates arrays. Use to minimize data size.',
      },
      {
        title: 'API Ready Preset',
        content: 'Prepares JSON for API use. Sorts keys for consistency, converts to camelCase. Keeps nulls for API contracts.',
      },
      {
        title: 'Storage Optimized Preset',
        content: 'Minimum file size. Removes everything unnecessary and minifies output. Best for database storage.',
      },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    icon: 'fas fa-code',
    content: 'Common transformation examples.',
    subsections: [
      {
        title: 'Remove Nulls',
        content: 'Before: {"name": "John", "age": null, "email": null}\nAfter: {"name": "John"}',
      },
      {
        title: 'Key Conversion',
        content: 'Before: {"user_name": "John", "user_email": "john@test.com"}\nAfter (camelCase): {"userName": "John", "userEmail": "john@test.com"}',
      },
      {
        title: 'Flatten',
        content: 'Before: {"user": {"name": "John", "address": {"city": "NYC"}}}\nAfter: {"user.name": "John", "user.address.city": "NYC"}',
      },
      {
        title: 'Type Conversion',
        content: 'Before: {"age": "25", "active": "true"}\nAfter: {"age": 25, "active": true}',
      },
    ],
  },
  {
    id: 'tips',
    title: 'Tips',
    icon: 'fas fa-lightbulb',
    content: 'Best practices for using JSON Cleaner.',
    subsections: [
      {
        title: 'Start Conservative',
        content: 'Begin with minimal settings and add more aggressive options as needed. This helps avoid accidentally removing needed data.',
      },
      {
        title: 'Review Summary',
        content: 'Always check the cleaning summary to see what was removed and how much size was reduced.',
      },
      {
        title: 'Combine Operations',
        content: 'You can combine cleaning and transformation in a single run. Both are applied in sequence.',
      },
      {
        title: 'For APIs',
        content: 'When preparing data for APIs, keep nulls (many APIs expect them) but remove empty strings and convert keys to camelCase.',
      },
    ],
  },
];
