/**
 * JSON Fixer Error Explanations
 * Educational content explaining JSON errors
 */

import type { ErrorType } from './types';

/**
 * Detailed explanations for each error type
 */
export const ERROR_EXPLANATIONS: Record<ErrorType, string> = {
  missing_quote: `JSON requires all strings (including object keys) to be wrapped in double quotes ("). This includes property names and string values. Example:
  
Wrong: { name: "John" }
Right: { "name": "John" }`,

  single_quote: `JSON only accepts double quotes ("), not single quotes ('). Single quotes are valid in JavaScript, but not in JSON. This is a common mistake when copying JavaScript objects.

Wrong: { 'name': 'John' }
Right: { "name": "John" }`,

  curly_quote: `JSON requires straight quotes ("), not curly/smart quotes (""). Curly quotes often appear when copying JSON from word processors, emails, or web pages that auto-format text.

Wrong: { "name": "John" }
Right: { "name": "John" }`,

  unquoted_key: `In JSON, all object keys must be quoted strings. Unlike JavaScript objects, you cannot use unquoted identifiers as keys.

Wrong: { name: "John", age: 30 }
Right: { "name": "John", "age": 30 }`,

  unquoted_value: `String values in JSON must be wrapped in double quotes. Numbers, booleans (true/false), and null don't need quotes, but text strings do.

Wrong: { "status": active }
Right: { "status": "active" }`,

  missing_comma: `JSON requires commas to separate elements in arrays and properties in objects. Each element/property (except the last) must be followed by a comma.

Wrong: { "a": 1 "b": 2 }
Right: { "a": 1, "b": 2 }`,

  trailing_comma: `JSON does not allow trailing commas after the last element in an array or object. While JavaScript allows this, JSON is stricter.

Wrong: { "items": [1, 2, 3,] }
Right: { "items": [1, 2, 3] }`,

  missing_colon: `Object properties in JSON must have a colon (:) between the key and value. The format is "key": value.

Wrong: { "name" "John" }
Right: { "name": "John" }`,

  unclosed_bracket: `Every opening bracket [ must have a matching closing bracket ]. Array elements are contained between these brackets.

Wrong: { "items": [1, 2, 3 }
Right: { "items": [1, 2, 3] }`,

  unclosed_brace: `Every opening brace { must have a matching closing brace }. Objects and their properties are contained between these braces.

Wrong: { "user": { "name": "John" }
Right: { "user": { "name": "John" } }`,

  extra_bracket: `Found a closing bracket ] without a matching opening bracket [. Check your array structure for mismatched brackets.`,

  extra_brace: `Found a closing brace } without a matching opening brace {. Check your object structure for mismatched braces.`,

  invalid_boolean: `JSON boolean values must be lowercase: true or false. Other variations like True, TRUE, False, FALSE are not valid JSON.

Wrong: { "active": True, "verified": FALSE }
Right: { "active": true, "verified": false }`,

  invalid_null: `JSON null value must be lowercase: null. Variations like NULL, Null, or None (Python style) are not valid JSON.

Wrong: { "data": None, "error": NULL }
Right: { "data": null, "error": null }`,

  invalid_value: `JSON values must be one of: string, number, object, array, boolean (true/false), or null. Other types like functions, dates, or undefined are not valid.`,

  undefined_value: `"undefined" is a JavaScript concept and is not valid in JSON. Use "null" instead to represent missing or unknown values.

Wrong: { "data": undefined }
Right: { "data": null }`,

  nan_value: `NaN (Not a Number) is not a valid JSON value. If you need to represent invalid numbers, use null or a string like "NaN".

Wrong: { "result": NaN }
Right: { "result": null } or { "result": "NaN" }`,

  infinity_value: `Infinity and -Infinity are not valid JSON values. JSON numbers must be finite. Use null or a string representation instead.

Wrong: { "limit": Infinity }
Right: { "limit": null } or { "limit": "Infinity" }`,

  comment: `JSON does not support comments. Unlike JavaScript, you cannot use // or /* */ comments in JSON. If you need to document your JSON, use a "_comment" property instead.

Wrong: { "name": "John" /* user name */ }
Right: { "_comment": "user name", "name": "John" }`,

  invalid_escape: `JSON strings support specific escape sequences: \\\\ (backslash), \\/ (forward slash), \\" (quote), \\b (backspace), \\f (form feed), \\n (newline), \\r (carriage return), \\t (tab), and \\uXXXX (unicode). Other escape sequences are invalid.`,

  control_character: `JSON strings cannot contain unescaped control characters (characters with code 0-31). These must be escaped using \\uXXXX notation.`,

  duplicate_key: `While not strictly invalid, duplicate keys in a JSON object are problematic. Most parsers will use only the last value, which may cause unexpected behavior.

{ "name": "John", "name": "Jane" }  // "name" will be "Jane"`,

  unexpected_token: `The parser encountered a character or token that doesn't belong in this position. This often indicates a typo, missing punctuation, or incorrect structure.`,

  unexpected_end: `The JSON ended unexpectedly, usually because of unclosed brackets, braces, or strings. Make sure all opened elements are properly closed.`,

  unknown: `An unspecified JSON syntax error occurred. Check your JSON structure carefully for any issues with quotes, brackets, commas, or values.`,
};

/**
 * Get explanation for an error type
 */
export function getErrorExplanation(type: ErrorType): string {
  return ERROR_EXPLANATIONS[type] || ERROR_EXPLANATIONS.unknown;
}

/**
 * Get a short tip for an error type
 */
export function getErrorTip(type: ErrorType): string {
  const tips: Partial<Record<ErrorType, string>> = {
    single_quote: 'Tip: Use your editor\'s find-and-replace to change all \' to "',
    trailing_comma: 'Tip: Many editors have a "format JSON" feature that removes trailing commas',
    comment: 'Tip: Move comments to a "_comment" property or separate documentation file',
    invalid_boolean: 'Tip: JSON booleans are always lowercase: true, false',
    invalid_null: 'Tip: JSON null is always lowercase: null',
  };
  
  return tips[type] || '';
}

/**
 * Get learning resources for JSON syntax
 */
export function getLearningResources(): Array<{ title: string; url: string; description: string }> {
  return [
    {
      title: 'JSON.org',
      url: 'https://www.json.org/',
      description: 'Official JSON specification and grammar',
    },
    {
      title: 'MDN JSON Guide',
      url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON',
      description: 'Mozilla\'s comprehensive JSON tutorial',
    },
    {
      title: 'RFC 8259',
      url: 'https://datatracker.ietf.org/doc/html/rfc8259',
      description: 'The official JSON Internet Standard',
    },
  ];
}
