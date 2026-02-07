/**
 * JSON to Protobuf Schema Generator
 * Converts JSON data to Protocol Buffer schema definitions
 */

import type {
  ProtoFieldType,
  ProtoField,
  ProtoMessage,
  ProtoFile,
  ProtobufGeneratorSettings,
  ProtobufGenerationResult,
} from './types';
import { DEFAULT_PROTOBUF_SETTINGS } from './types';

// Reserved Protobuf keywords
const RESERVED_WORDS = new Set([
  'syntax', 'import', 'weak', 'public', 'package', 'option', 'message',
  'enum', 'service', 'extend', 'extensions', 'reserved', 'to', 'max',
  'oneof', 'map', 'repeated', 'optional', 'required', 'group', 'returns',
  'rpc', 'stream', 'true', 'false', 'inf', 'nan',
]);

/**
 * Convert string to snake_case
 */
function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * Convert string to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, c => c.toUpperCase());
}

/**
 * Sanitize field name for Protobuf
 */
function sanitizeFieldName(name: string, useSnakeCase: boolean): string {
  let sanitized = useSnakeCase ? toSnakeCase(name) : name;
  
  // Replace invalid characters
  sanitized = sanitized.replace(/[^a-zA-Z0-9_]/g, '_');
  
  // Must start with letter or underscore
  if (/^[0-9]/.test(sanitized)) {
    sanitized = '_' + sanitized;
  }
  
  // Handle reserved words
  if (RESERVED_WORDS.has(sanitized.toLowerCase())) {
    sanitized = sanitized + '_field';
  }
  
  return sanitized;
}

/**
 * Sanitize message name for Protobuf
 */
function sanitizeMessageName(name: string): string {
  let sanitized = toPascalCase(name);
  
  // Replace invalid characters
  sanitized = sanitized.replace(/[^a-zA-Z0-9_]/g, '');
  
  // Must start with letter
  if (/^[0-9]/.test(sanitized)) {
    sanitized = 'M' + sanitized;
  }
  
  // Handle reserved words
  if (RESERVED_WORDS.has(sanitized.toLowerCase())) {
    sanitized = sanitized + 'Message';
  }
  
  return sanitized;
}

/**
 * Infer Protobuf type from JSON value
 */
function inferType(value: unknown, settings: ProtobufGeneratorSettings): ProtoFieldType | string {
  if (value === null || value === undefined) {
    return 'string'; // Default for null
  }
  
  const type = typeof value;
  
  switch (type) {
    case 'boolean':
      return 'bool';
    case 'number':
      if (Number.isInteger(value)) {
        const num = value as number;
        // Check if it's a large number that needs int64
        if (settings.inferInt64ForLargeNumbers && (num > 2147483647 || num < -2147483648)) {
          return 'int64';
        }
        return 'int32';
      }
      return 'double';
    case 'string':
      return 'string';
    case 'object':
      if (Array.isArray(value)) {
        // Will be handled as repeated
        return 'string';
      }
      // Nested object - return placeholder, actual type determined later
      return 'MESSAGE';
    default:
      return 'string';
  }
}

/**
 * Analyze JSON structure and generate messages
 */
function analyzeStructure(
  data: unknown,
  messageName: string,
  settings: ProtobufGeneratorSettings,
  messages: Map<string, ProtoMessage>,
  fieldNumber: { current: number }
): ProtoMessage {
  const fields: ProtoField[] = [];
  const nestedMessages: ProtoMessage[] = [];
  
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    // Not an object, return empty message
    return {
      name: sanitizeMessageName(messageName),
      fields: [],
      nestedMessages: [],
      nestedEnums: [],
    };
  }
  
  const obj = data as Record<string, unknown>;
  const entries = Object.entries(obj);
  
  // Optionally sort fields
  if (settings.sortFields) {
    entries.sort(([a], [b]) => a.localeCompare(b));
  }
  
  let localFieldNumber = 1;
  
  for (const [key, value] of entries) {
    const fieldName = sanitizeFieldName(key, settings.useSnakeCase);
    let fieldType: ProtoFieldType | string;
    let repeated = false;
    let optional = value === null;
    
    if (Array.isArray(value)) {
      repeated = true;
      if (value.length > 0) {
        const firstItem = value[0];
        if (typeof firstItem === 'object' && firstItem !== null && !Array.isArray(firstItem)) {
          // Array of objects - create nested message
          const nestedName = sanitizeMessageName(key) + 'Item';
          const nestedMessage = analyzeStructure(
            firstItem,
            nestedName,
            settings,
            messages,
            fieldNumber
          );
          nestedMessages.push(nestedMessage);
          fieldType = nestedName;
        } else {
          fieldType = inferType(firstItem, settings);
        }
      } else {
        // Empty array - default to string
        fieldType = 'string';
      }
    } else if (typeof value === 'object' && value !== null) {
      // Nested object - create nested message
      const nestedName = sanitizeMessageName(key);
      const nestedMessage = analyzeStructure(
        value,
        nestedName,
        settings,
        messages,
        fieldNumber
      );
      nestedMessages.push(nestedMessage);
      fieldType = nestedName;
    } else {
      fieldType = inferType(value, settings);
      optional = value === null && settings.useOptionalForNullable;
    }
    
    const field: ProtoField = {
      name: fieldName,
      type: fieldType,
      number: localFieldNumber++,
      repeated,
      optional: settings.syntax === 'proto3' ? optional : false,
    };
    
    if (settings.includeJsonName && fieldName !== key) {
      field.jsonName = key;
    }
    
    if (settings.generateComments) {
      field.comment = `Original JSON key: ${key}`;
    }
    
    fields.push(field);
  }
  
  const message: ProtoMessage = {
    name: sanitizeMessageName(messageName),
    fields,
    nestedMessages,
    nestedEnums: [],
  };
  
  messages.set(message.name, message);
  return message;
}

/**
 * Generate Protobuf schema string from ProtoFile
 */
function generateProtoString(protoFile: ProtoFile, settings: ProtobufGeneratorSettings): string {
  const indent = ' '.repeat(settings.indentation);
  const lines: string[] = [];
  
  // Syntax declaration
  lines.push(`syntax = "${protoFile.syntax}";`);
  lines.push('');
  
  // Package
  if (protoFile.package) {
    lines.push(`package ${protoFile.package};`);
    lines.push('');
  }
  
  // Imports
  for (const imp of protoFile.imports) {
    lines.push(`import "${imp}";`);
  }
  if (protoFile.imports.length > 0) {
    lines.push('');
  }
  
  // Options
  for (const [key, value] of Object.entries(protoFile.options)) {
    lines.push(`option ${key} = "${value}";`);
  }
  if (Object.keys(protoFile.options).length > 0) {
    lines.push('');
  }
  
  // Generate message definitions
  function generateMessage(message: ProtoMessage, depth: number): void {
    const baseIndent = indent.repeat(depth);
    const fieldIndent = indent.repeat(depth + 1);
    
    if (message.comment) {
      lines.push(`${baseIndent}// ${message.comment}`);
    }
    
    lines.push(`${baseIndent}message ${message.name} {`);
    
    // Nested enums
    for (const enumDef of message.nestedEnums) {
      lines.push(`${fieldIndent}enum ${enumDef.name} {`);
      for (const value of enumDef.values) {
        lines.push(`${indent.repeat(depth + 2)}${value.name} = ${value.number};`);
      }
      lines.push(`${fieldIndent}}`);
      lines.push('');
    }
    
    // Nested messages
    for (const nested of message.nestedMessages) {
      generateMessage(nested, depth + 1);
      lines.push('');
    }
    
    // Fields
    for (const field of message.fields) {
      if (field.comment) {
        lines.push(`${fieldIndent}// ${field.comment}`);
      }
      
      let fieldLine = fieldIndent;
      
      if (protoFile.syntax === 'proto3' && field.optional) {
        fieldLine += 'optional ';
      }
      
      if (field.repeated) {
        fieldLine += 'repeated ';
      }
      
      fieldLine += `${field.type} ${field.name} = ${field.number}`;
      
      // Field options
      const options: string[] = [];
      if (field.jsonName) {
        options.push(`json_name = "${field.jsonName}"`);
      }
      
      if (options.length > 0) {
        fieldLine += ` [${options.join(', ')}]`;
      }
      
      fieldLine += ';';
      lines.push(fieldLine);
    }
    
    lines.push(`${baseIndent}}`);
  }
  
  // Generate all messages
  for (const message of protoFile.messages) {
    generateMessage(message, 0);
    lines.push('');
  }
  
  return lines.join('\n').trim() + '\n';
}

/**
 * Main function to convert JSON to Protobuf schema
 */
export function jsonToProtobuf(
  json: string,
  settings: Partial<ProtobufGeneratorSettings> = {}
): ProtobufGenerationResult {
  const fullSettings: ProtobufGeneratorSettings = {
    ...DEFAULT_PROTOBUF_SETTINGS,
    ...settings,
  };
  
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Parse JSON
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch (e) {
    return {
      success: false,
      output: '',
      messages: [],
      errors: [`Invalid JSON: ${(e as Error).message}`],
      warnings: [],
    };
  }
  
  // Handle arrays at root level
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return {
        success: false,
        output: '',
        messages: [],
        errors: ['Cannot generate schema from empty array'],
        warnings: [],
      };
    }
    // Use first element as template
    data = data[0];
    warnings.push('Root array detected. Using first element as template.');
  }
  
  if (typeof data !== 'object' || data === null) {
    return {
      success: false,
      output: '',
      messages: [],
      errors: ['JSON must be an object or array of objects'],
      warnings: [],
    };
  }
  
  // Analyze and generate messages
  const messages = new Map<string, ProtoMessage>();
  const rootMessage = analyzeStructure(
    data,
    fullSettings.rootMessageName,
    fullSettings,
    messages,
    { current: 1 }
  );
  
  // Create ProtoFile
  const protoFile: ProtoFile = {
    syntax: fullSettings.syntax,
    package: fullSettings.packageName || undefined,
    imports: [],
    options: {},
    messages: [rootMessage],
    enums: [],
  };
  
  // Generate output
  const output = generateProtoString(protoFile, fullSettings);
  
  return {
    success: true,
    output,
    messages: [rootMessage],
    errors,
    warnings,
  };
}

/**
 * Validate Protobuf schema syntax
 */
export function validateProtoSchema(schema: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Basic syntax checks
  if (!schema.includes('syntax =')) {
    errors.push('Missing syntax declaration');
  }
  
  if (!schema.includes('message ')) {
    errors.push('No message definitions found');
  }
  
  // Check for balanced braces
  const openBraces = (schema.match(/{/g) || []).length;
  const closeBraces = (schema.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push('Unbalanced braces in schema');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
