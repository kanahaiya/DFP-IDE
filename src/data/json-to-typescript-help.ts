/**
 * Help Content for JSON to TypeScript Converter
 */

export interface HelpSection {
  title: string;
  content: string;
  icon?: string;
}

export const jsonToTypeScriptHelp: HelpSection[] = [
  {
    title: 'Overview',
    icon: 'fas fa-info-circle',
    content: 'The JSON to TypeScript converter transforms JSON data into TypeScript interfaces and type aliases. It automatically infers types from your JSON structure, handles nested objects, arrays, and nullable values. Key features include: TypeScript interface or type alias generation, automatic type inference, nested object support with separate interfaces, optional property detection for null values, union types for mixed-type arrays, JSDoc comments and examples, readonly property support, and multiple naming conventions.',
  },
  {
    title: 'JSON Input',
    icon: 'fas fa-file-code',
    content: 'Paste valid JSON into the input editor. The tool accepts JSON objects, arrays, and primitive values. Syntax highlighting and real-time validation help identify any errors. Supported JSON types include: Objects ({ "key": "value" }), Arrays ([1, 2, 3] or [{...}, {...}]), Strings ("hello world"), Numbers (42, 3.14), Booleans (true, false), Null (null), and nested combinations of all above. Use the sample templates dropdown to load example JSON structures.',
  },
  {
    title: 'Output Format',
    icon: 'fas fa-sliders-h',
    content: 'Choose between interfaces and type aliases for your TypeScript output. Interfaces are the standard way to define object shapes in TypeScript (export interface User { id: number; name: string; }) and are best for object types, extendable definitions, and class implementations. Type aliases provide an alternative syntax (export type User = { id: number; name: string; }) and are best for unions, intersections, mapped types, and utility types.',
  },
  {
    title: 'Type Options',
    icon: 'fas fa-cog',
    content: 'Configure how types are generated from your JSON data. Array Notation: Choose between brackets (string[]) which is more concise and commonly used, or Generic (Array<string>) which is explicit and useful for complex types. Optional Properties: When enabled, properties with null values are marked optional (?). Readonly Properties: Mark all properties as readonly for immutable types.',
  },
  {
    title: 'Null Handling',
    icon: 'fas fa-question-circle',
    content: 'Configure how null and undefined values are handled in generated types. Options include: Nullable (string | null), Optional (property?: string), Undefined (string | undefined), and Null or Undefined (string | null | undefined).',
  },
  {
    title: 'Naming Conventions',
    icon: 'fas fa-font',
    content: 'Customize the naming conventions for generated types and properties. Type Names support PascalCase (UserProfile - default, recommended), camelCase (userProfile), and snake_case (user_profile). Property Names support camelCase (firstName - default), PascalCase (FirstName), snake_case (first_name), and preserve (keep original JSON keys).',
  },
  {
    title: 'Advanced Options',
    icon: 'fas fa-tools',
    content: 'Fine-tune the output with advanced configuration options. JSDoc Comments add documentation to interfaces and properties for better IDE support. Include Examples adds @example annotations with sample values from your JSON data. Index Signatures add [key: string]: unknown to interfaces for dynamic property access. Sort Properties alphabetically sorts properties in generated interfaces.',
  },
  {
    title: 'Presets',
    icon: 'fas fa-magic',
    content: 'Use presets to quickly apply common configuration combinations. Available presets include: Default (standard interfaces with sensible defaults), Strict Mode (readonly properties, strict null checks), Type Aliases (use type instead of interface), Documented (JSDoc comments and examples), Minimal (no extras, clean output), Immutable (all properties readonly), API Response (optimized for API data), and Generic Arrays (use Array<T> notation).',
  },
  {
    title: 'Export Options',
    icon: 'fas fa-download',
    content: 'Export your generated TypeScript in various ways. Click the Copy button to copy the generated TypeScript to your clipboard for pasting into your code editor. Click Download to save the output as a .ts file that you can import into your TypeScript project.',
  },
];
