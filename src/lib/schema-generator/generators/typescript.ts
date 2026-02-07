/**
 * TypeScript Generator
 * Generates TypeScript interfaces and type aliases
 */

import type { InferredSchema, InferredProperty, SchemaGeneratorSettings } from '../types';

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, c => c.toUpperCase());
}

function mapTypeToTS(type: string): string {
  switch (type) {
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'string':
    case 'email':
    case 'uri':
    case 'uuid':
    case 'date':
      return 'string';
    case 'null':
      return 'null';
    case 'array':
      return 'unknown[]';
    case 'object':
      return 'Record<string, unknown>';
    default:
      return 'unknown';
  }
}

function generatePropertyType(
  prop: InferredProperty,
  settings: SchemaGeneratorSettings,
  nestedTypes: string[],
  parentName: string
): string {
  let typeStr: string;
  
  if (prop.type === 'object' && prop.properties) {
    // Generate nested interface
    const nestedName = toPascalCase(parentName) + toPascalCase(prop.name);
    const nestedInterface = generateInterface(
      { type: 'object', properties: prop.properties, title: nestedName },
      nestedName,
      settings,
      nestedTypes
    );
    nestedTypes.push(nestedInterface);
    typeStr = nestedName;
  } else if (prop.type === 'array' && prop.items) {
    if (prop.items.type === 'object' && prop.items.properties) {
      const itemName = toPascalCase(parentName) + toPascalCase(prop.name) + 'Item';
      const nestedInterface = generateInterface(
        prop.items,
        itemName,
        settings,
        nestedTypes
      );
      nestedTypes.push(nestedInterface);
      typeStr = `${itemName}[]`;
    } else {
      typeStr = `${mapTypeToTS(prop.items.type)}[]`;
    }
  } else {
    typeStr = mapTypeToTS(prop.type);
  }
  
  if (prop.isNullable) {
    typeStr = `${typeStr} | null`;
  }
  
  return typeStr;
}

function generateInterface(
  schema: InferredSchema,
  name: string,
  settings: SchemaGeneratorSettings,
  nestedTypes: string[]
): string {
  const indent = settings.indentation === 'tab' ? '\t' : ' '.repeat(settings.indentation as number);
  const lines: string[] = [];
  
  lines.push(`export interface ${name} {`);
  
  if (schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      const optional = !prop.isRequired || settings.makeAllOptional ? '?' : '';
      const typeStr = generatePropertyType(prop, settings, nestedTypes, name);
      lines.push(`${indent}${key}${optional}: ${typeStr};`);
    }
  }
  
  lines.push('}');
  
  return lines.join('\n');
}

function generateType(
  schema: InferredSchema,
  name: string,
  settings: SchemaGeneratorSettings,
  nestedTypes: string[]
): string {
  const indent = settings.indentation === 'tab' ? '\t' : ' '.repeat(settings.indentation as number);
  const lines: string[] = [];
  
  lines.push(`export type ${name} = {`);
  
  if (schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      const optional = !prop.isRequired || settings.makeAllOptional ? '?' : '';
      const typeStr = generatePropertyType(prop, settings, nestedTypes, name);
      lines.push(`${indent}${key}${optional}: ${typeStr};`);
    }
  }
  
  lines.push('};');
  
  return lines.join('\n');
}

export function generateTypeScript(
  schema: InferredSchema,
  settings: SchemaGeneratorSettings
): string {
  const nestedTypes: string[] = [];
  const rootName = toPascalCase(settings.rootName);
  
  let rootType: string;
  if (settings.format === 'typescript-type') {
    rootType = generateType(schema, rootName, settings, nestedTypes);
  } else {
    rootType = generateInterface(schema, rootName, settings, nestedTypes);
  }
  
  // Combine nested types (in reverse order so dependencies come first)
  const allTypes = [...nestedTypes.reverse(), rootType];
  
  return allTypes.join('\n\n');
}
