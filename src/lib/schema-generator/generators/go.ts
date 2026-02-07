/**
 * Go Struct Generator
 * Generates Go structs with JSON tags
 */

import type { InferredSchema, InferredProperty, SchemaGeneratorSettings } from '../types';

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, c => c.toUpperCase());
}

function mapTypeToGo(type: string): string {
  switch (type) {
    case 'integer':
      return 'int64';
    case 'number':
      return 'float64';
    case 'boolean':
      return 'bool';
    case 'string':
    case 'email':
    case 'uri':
    case 'uuid':
    case 'date':
      return 'string';
    default:
      return 'interface{}';
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
      typeStr = `[]${itemName}`;
    } else {
      typeStr = `[]${mapTypeToGo(prop.items.type)}`;
    }
  } else {
    typeStr = mapTypeToGo(prop.type);
  }
  
  // Pointer for optional/nullable fields
  if (!prop.isRequired || prop.isNullable || settings.makeAllOptional) {
    if (!typeStr.startsWith('[]') && typeStr !== 'interface{}') {
      typeStr = `*${typeStr}`;
    }
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
  
  lines.push(`type ${name} struct {`);
  
  if (schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      const fieldName = toPascalCase(key);
      const typeStr = generateFieldType(prop, settings, nestedStructs, name);
      
      // JSON tag
      let jsonTag = key;
      if (!prop.isRequired || prop.isNullable || settings.makeAllOptional) {
        jsonTag += ',omitempty';
      }
      
      lines.push(`${indent}${fieldName} ${typeStr} \`json:"${jsonTag}"\``);
    }
  }
  
  lines.push('}');
  
  nestedStructs.push(lines.join('\n'));
}

export function generateGo(
  schema: InferredSchema,
  settings: SchemaGeneratorSettings
): string {
  const nestedStructs: string[] = [];
  const rootName = toPascalCase(settings.rootName);
  const indent = settings.indentation === 'tab' ? '\t' : ' '.repeat(settings.indentation as number);
  
  const lines: string[] = [];
  
  // Package declaration
  lines.push('package main');
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
  lines.push(`type ${rootName} struct {`);
  
  if (schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      const fieldName = toPascalCase(key);
      const typeStr = generateFieldType(prop, settings, [], rootName);
      
      let jsonTag = key;
      if (!prop.isRequired || prop.isNullable || settings.makeAllOptional) {
        jsonTag += ',omitempty';
      }
      
      lines.push(`${indent}${fieldName} ${typeStr} \`json:"${jsonTag}"\``);
    }
  }
  
  lines.push('}');
  
  return lines.join('\n');
}
