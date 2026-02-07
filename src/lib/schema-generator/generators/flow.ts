/**
 * Flow Type Generator
 * Generates Flow type annotations
 */

import type { InferredSchema, InferredProperty, SchemaGeneratorSettings } from '../types';

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, c => c.toUpperCase());
}

function mapTypeToFlow(type: string): string {
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
    default:
      return 'mixed';
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
    const nestedName = toPascalCase(parentName) + toPascalCase(prop.name);
    generateNestedType(
      { type: 'object', properties: prop.properties, title: nestedName },
      nestedName,
      settings,
      nestedTypes
    );
    typeStr = nestedName;
  } else if (prop.type === 'array' && prop.items) {
    if (prop.items.type === 'object' && prop.items.properties) {
      const itemName = toPascalCase(parentName) + toPascalCase(prop.name) + 'Item';
      generateNestedType(prop.items, itemName, settings, nestedTypes);
      typeStr = `Array<${itemName}>`;
    } else {
      typeStr = `Array<${mapTypeToFlow(prop.items.type)}>`;
    }
  } else {
    typeStr = mapTypeToFlow(prop.type);
  }
  
  if (prop.isNullable) {
    typeStr = `?${typeStr}`;
  }
  
  return typeStr;
}

function generateNestedType(
  schema: InferredSchema,
  name: string,
  settings: SchemaGeneratorSettings,
  nestedTypes: string[]
): void {
  const indent = settings.indentation === 'tab' ? '\t' : ' '.repeat(settings.indentation as number);
  const lines: string[] = [];
  
  lines.push(`export type ${name} = {|`);
  
  if (schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      const optional = !prop.isRequired || settings.makeAllOptional ? '?' : '';
      const typeStr = generatePropertyType(prop, settings, nestedTypes, name);
      lines.push(`${indent}${key}${optional}: ${typeStr},`);
    }
  }
  
  lines.push('|};');
  
  nestedTypes.push(lines.join('\n'));
}

export function generateFlow(
  schema: InferredSchema,
  settings: SchemaGeneratorSettings
): string {
  const nestedTypes: string[] = [];
  const rootName = toPascalCase(settings.rootName);
  const indent = settings.indentation === 'tab' ? '\t' : ' '.repeat(settings.indentation as number);
  
  const lines: string[] = [];
  
  // Flow annotation
  lines.push('// @flow');
  lines.push('');
  
  // Generate nested types first
  if (schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      if (prop.type === 'object' && prop.properties) {
        generateNestedType(
          { type: 'object', properties: prop.properties },
          rootName + toPascalCase(key),
          settings,
          nestedTypes
        );
      } else if (prop.type === 'array' && prop.items?.type === 'object' && prop.items.properties) {
        generateNestedType(
          prop.items,
          rootName + toPascalCase(key) + 'Item',
          settings,
          nestedTypes
        );
      }
    }
  }
  
  // Add nested types
  if (nestedTypes.length > 0) {
    lines.push(nestedTypes.join('\n\n'));
    lines.push('');
  }
  
  // Generate root type (exact object type with |})
  lines.push(`export type ${rootName} = {|`);
  
  if (schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      const optional = !prop.isRequired || settings.makeAllOptional ? '?' : '';
      const typeStr = generatePropertyType(prop, settings, [], rootName);
      lines.push(`${indent}${key}${optional}: ${typeStr},`);
    }
  }
  
  lines.push('|};');
  
  return lines.join('\n');
}
