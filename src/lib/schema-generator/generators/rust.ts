/**
 * Rust Struct Generator
 * Generates Rust structs with serde
 */

import type { InferredSchema, InferredProperty, SchemaGeneratorSettings } from '../types';

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, c => c.toUpperCase());
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

function mapTypeToRust(type: string): string {
  switch (type) {
    case 'integer':
      return 'i64';
    case 'number':
      return 'f64';
    case 'boolean':
      return 'bool';
    case 'string':
    case 'email':
    case 'uri':
    case 'uuid':
    case 'date':
      return 'String';
    default:
      return 'serde_json::Value';
  }
}

function generateFieldType(
  prop: InferredProperty,
  settings: SchemaGeneratorSettings,
  nestedStructs: string[],
  parentName: string
): string {
  let typeStr: string;
  
  if (prop.type === 'object' && prop.properties) {
    const nestedName = toPascalCase(parentName) + toPascalCase(prop.name);
    generateNestedStruct(
      { type: 'object', properties: prop.properties, title: nestedName },
      nestedName,
      settings,
      nestedStructs
    );
    typeStr = nestedName;
  } else if (prop.type === 'array' && prop.items) {
    if (prop.items.type === 'object' && prop.items.properties) {
      const itemName = toPascalCase(parentName) + toPascalCase(prop.name) + 'Item';
      generateNestedStruct(prop.items, itemName, settings, nestedStructs);
      typeStr = `Vec<${itemName}>`;
    } else {
      typeStr = `Vec<${mapTypeToRust(prop.items.type)}>`;
    }
  } else {
    typeStr = mapTypeToRust(prop.type);
  }
  
  // Wrap in Option for optional/nullable fields
  if (!prop.isRequired || prop.isNullable || settings.makeAllOptional) {
    typeStr = `Option<${typeStr}>`;
  }
  
  return typeStr;
}

function generateNestedStruct(
  schema: InferredSchema,
  name: string,
  settings: SchemaGeneratorSettings,
  nestedStructs: string[]
): void {
  const indent = settings.indentation === 'tab' ? '\t' : ' '.repeat(settings.indentation as number);
  const lines: string[] = [];
  
  lines.push('#[derive(Debug, Clone, Serialize, Deserialize)]');
  lines.push(`pub struct ${name} {`);
  
  if (schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      const snakeKey = toSnakeCase(key);
      const typeStr = generateFieldType(prop, settings, nestedStructs, name);
      
      // Add serde rename if key differs
      if (snakeKey !== key) {
        lines.push(`${indent}#[serde(rename = "${key}")]`);
      }
      
      // Add skip_serializing_if for optional fields
      if (!prop.isRequired || prop.isNullable || settings.makeAllOptional) {
        lines.push(`${indent}#[serde(skip_serializing_if = "Option::is_none")]`);
      }
      
      lines.push(`${indent}pub ${snakeKey}: ${typeStr},`);
    }
  }
  
  lines.push('}');
  
  nestedStructs.push(lines.join('\n'));
}

export function generateRust(
  schema: InferredSchema,
  settings: SchemaGeneratorSettings
): string {
  const nestedStructs: string[] = [];
  const rootName = toPascalCase(settings.rootName);
  const indent = settings.indentation === 'tab' ? '\t' : ' '.repeat(settings.indentation as number);
  
  const lines: string[] = [];
  
  // Imports
  lines.push('use serde::{Deserialize, Serialize};');
  lines.push('');
  
  // Generate nested structs first
  if (schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      if (prop.type === 'object' && prop.properties) {
        generateNestedStruct(
          { type: 'object', properties: prop.properties },
          rootName + toPascalCase(key),
          settings,
          nestedStructs
        );
      } else if (prop.type === 'array' && prop.items?.type === 'object' && prop.items.properties) {
        generateNestedStruct(
          prop.items,
          rootName + toPascalCase(key) + 'Item',
          settings,
          nestedStructs
        );
      }
    }
  }
  
  // Add nested structs
  if (nestedStructs.length > 0) {
    lines.push(nestedStructs.join('\n\n'));
    lines.push('');
  }
  
  // Generate root struct
  lines.push('#[derive(Debug, Clone, Serialize, Deserialize)]');
  lines.push(`pub struct ${rootName} {`);
  
  if (schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      const snakeKey = toSnakeCase(key);
      const typeStr = generateFieldType(prop, settings, [], rootName);
      
      if (snakeKey !== key) {
        lines.push(`${indent}#[serde(rename = "${key}")]`);
      }
      
      if (!prop.isRequired || prop.isNullable || settings.makeAllOptional) {
        lines.push(`${indent}#[serde(skip_serializing_if = "Option::is_none")]`);
      }
      
      lines.push(`${indent}pub ${snakeKey}: ${typeStr},`);
    }
  }
  
  lines.push('}');
  
  return lines.join('\n');
}
