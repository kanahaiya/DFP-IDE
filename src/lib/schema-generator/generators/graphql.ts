/**
 * GraphQL Type Generator
 * Generates GraphQL type definitions
 */

import type { InferredSchema, InferredProperty, SchemaGeneratorSettings } from '../types';

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, c => c.toUpperCase());
}

function mapTypeToGraphQL(type: string): string {
  switch (type) {
    case 'integer':
      return 'Int';
    case 'number':
      return 'Float';
    case 'boolean':
      return 'Boolean';
    case 'string':
    case 'email':
    case 'uri':
    case 'uuid':
    case 'date':
      return 'String';
    default:
      return 'String';
  }
}

function generateFieldType(
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
      typeStr = `[${itemName}]`;
    } else {
      typeStr = `[${mapTypeToGraphQL(prop.items.type)}]`;
    }
  } else {
    typeStr = mapTypeToGraphQL(prop.type);
  }
  
  // Add non-null modifier for required fields
  if (prop.isRequired && !settings.makeAllOptional && !prop.isNullable) {
    typeStr = `${typeStr}!`;
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
  
  lines.push(`type ${name} {`);
  
  if (schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      const typeStr = generateFieldType(prop, settings, nestedTypes, name);
      lines.push(`${indent}${key}: ${typeStr}`);
    }
  }
  
  lines.push('}');
  
  nestedTypes.push(lines.join('\n'));
}

export function generateGraphQL(
  schema: InferredSchema,
  settings: SchemaGeneratorSettings
): string {
  const nestedTypes: string[] = [];
  const rootName = toPascalCase(settings.rootName);
  const indent = settings.indentation === 'tab' ? '\t' : ' '.repeat(settings.indentation as number);
  
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
  
  // Generate root type
  const lines: string[] = [];
  
  // Add nested types
  if (nestedTypes.length > 0) {
    lines.push(nestedTypes.join('\n\n'));
    lines.push('');
  }
  
  lines.push(`type ${rootName} {`);
  
  if (schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      const typeStr = generateFieldType(prop, settings, [], rootName);
      lines.push(`${indent}${key}: ${typeStr}`);
    }
  }
  
  lines.push('}');
  
  return lines.join('\n');
}
