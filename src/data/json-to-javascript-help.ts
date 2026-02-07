/**
 * Help Content for JSON to JavaScript Converter
 */

export interface HelpSection {
  title: string;
  content: string;
  icon?: string;
}

export const jsonToJavaScriptHelp: HelpSection[] = [
  {
    title: 'Overview',
    icon: 'fas fa-info-circle',
    content: 'The JSON to JavaScript converter transforms JSON data into valid JavaScript object literals. It supports multiple output formats including ES6 modules, CommonJS, and UMD. Key features include: variable declaration options (const/let/var), multiple export formats, customizable quote styles, trailing comma support, Object.freeze for immutability, and various formatting options.',
  },
  {
    title: 'JSON Input',
    icon: 'fas fa-file-code',
    content: 'Paste valid JSON into the input editor. The tool accepts any valid JSON including objects, arrays, and primitive values. Syntax highlighting and real-time validation help identify errors. Use the sample templates dropdown to load example JSON structures for testing.',
  },
  {
    title: 'Variable Declaration',
    icon: 'fas fa-code',
    content: 'Choose how to declare your JavaScript variable. Options: const - recommended for data that won\'t be reassigned (most common), let - for variables that may be reassigned, var - legacy option with function scope (avoid in modern code), none - output only the object literal without a variable.',
  },
  {
    title: 'Export Formats',
    icon: 'fas fa-file-export',
    content: 'Configure how your code is exported. Options: None - plain variable declaration, ES6 Default - export default syntax for modern JavaScript, ES6 Named - named export syntax, CommonJS - module.exports for Node.js, UMD - Universal Module Definition for browser and Node.js compatibility.',
  },
  {
    title: 'Formatting Options',
    icon: 'fas fa-sliders-h',
    content: 'Customize the output formatting. Quote Style: single (\') or double (") quotes. Quote Keys: always quote object keys or only when necessary. Trailing Commas: add commas after the last item in arrays/objects. Semicolons: include or omit semicolons. Indentation: spaces (2 or 4) or tabs.',
  },
  {
    title: 'Advanced Options',
    icon: 'fas fa-tools',
    content: 'Additional options for specialized needs. Object.freeze: wrap the object in Object.freeze() for immutability. Add Comments: include JSDoc-style comments above the code. Property Naming: convert property names to camelCase, snake_case, or preserve original.',
  },
  {
    title: 'Presets',
    icon: 'fas fa-magic',
    content: 'Use presets to quickly apply common configurations. Available presets: Default (const with single quotes), ES6 Module (default export), CommonJS (module.exports), UMD Module, Double Quotes, No Semicolons, Immutable (with freeze), Legacy (var with double quotes), Raw Object (no variable).',
  },
  {
    title: 'Export Options',
    icon: 'fas fa-download',
    content: 'Export your generated JavaScript. Click Copy to copy the code to your clipboard for pasting into your editor. Click Download to save as a .js file. The filename uses your variable name (e.g., data.js).',
  },
];
