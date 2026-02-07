/**
 * Zod Schema Generator
 * Generates Zod validation schemas
 */

import type { InferredSchema, InferredProperty, SchemaGeneratorSettings } from '../types';

function toCamelCase(str: string): string {
  return str
    .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, c => c.toLowerCase());
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, c => c.toUpperCase());
}

function mapTypeToZod(type: string): string {
  switch (type) {
    case 'integer':
      return 'z.number().int()';
    case 'number':
      return 'z.number()';
    case 'boolean':
      return 'z.boolean()';
    case 'string':
      return 'z.string()';
    case 'email':
      return 'z.string().email()';
    case 'uri':
      return 'z.string().url()';
    case 'uuid':
      return 'z.string().uuid()';
    case 'date':
      return 'z.string().datetime()';
    case 'null':
      return 'z.null()';
    default:
      return 'z.unknown()';
  }
}

function generatePropertySchema(
  prop: InferredProperty,
  settings: SchemaGeneratorSettings,
  nestedSchemas: string[],
  parentName: string
): string {
  let schemaStr: string;
  
  if (prop.type === 'object' && prop.properties) {
    const nestedName = toCamelCase(parentName) + toPascalCase(prop.name) + 'Schema';
    generateNestedSchema(
      { type: 'object', properties: prop.properties },
      nestedName,
      settings,
      nestedSchemas
    );
    schemaStr = nestedName;
  } else if (prop.type === 'array' && prop.items) {
    if (prop.items.type === 'object' && prop.items.properties) {
      const itemName = toCamelCase(parentName) + toPascalCase(prop.name) + 'ItemSchema';
      generateNestedSchema(prop.items, itemName, settings, nestedSchemas);
      schemaStr = `z.array(${itemName})`;
    } else {
      schemaStr = `z.array(${mapTypeToZod(prop.items.type)})`;
    }
  } else {
    schemaStr = mapTypeToZod(prop.type);
  }
  
  if (prop.isNullable) {
    schemaStr = `${schemaStr}.nullable()`;
  }
  
  if (!prop.isRequired || settings.makeAllOptional) {
    schemaStr = `${schemaStr}.optional()`;
  }
  
  return schemaStr;
}

function generateNestedSchema(
  schema: InferredSchema,
  name: string,
  settings: SchemaGeneratorSettings,
  nestedSchemas: string[]
): void {
  const indent = settings.indentation === 'tab' ? '\t' : ' '.repeat(settings.indentation as number);
  const lines: string[] = [];
  
  lines.push(`const ${name} = z.object({`);
  
  if (schema.properties) {
    const entries = Object.entries(schema.properties);
    entries.forEach(([key, prop], index) => {
      const schemaStr = generatePropertySchema(prop, settings, nestedSchemas, name.replace('Schema', ''));
      const comma = index < entries.length - 1 ? ',' : '';
      lines.push(`${indent}${key}: ${schemaStr}${comma}`);
    });
  }
  
  lines.push('});');
  
  nestedSchemas.push(lines.join('\n'));
}

export function generateZod(
  schema: InferredSchema,
  settings: SchemaGeneratorSettings
): string {
  const nestedSchemas: string[] = [];
  const rootName = toCamelCase(settings.rootName) + 'Schema';
  const indent = settings.indentation === 'tab' ? '\t' : ' '.repeat(settings.indentation as number);
  
  const lines: string[] = [];
  
  // Import statement
  lines.push("import { z } from 'zod';");
  lines.push('');
  
  // Generate nested schemas first
  if (schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      if (prop.type === 'object' && prop.properties) {
        generateNestedSchema(
          { type: 'object', properties: prop.properties },
          toCamelCase(settings.rootName) + toPascalCase(key) + 'Schema',
          settings,
          nestedSchemas
        );
      } else if (prop.type === 'array' && prop.items?.type === 'object' && prop.items.properties) {
        generateNestedSchema(
          prop.items,
          toCamelCase(settings.rootName) + toPascalCase(key) + 'ItemSchema',
          settings,
          nestedSchemas
        );
      }
    }
  }
  
  // Add nested schemas
  if (nestedSchemas.length > 0) {
    lines.push(nestedSchemas.join('\n\n'));
    lines.push('');
  }
  
  // Generate root schema
  lines.push(`export const ${rootName} = z.object({`);
  
  if (schema.properties) {
    const entries = Object.entries(schema.properties);
    entries.forEach(([key, prop], index) => {
      const schemaStr = generatePropertySchema(prop, settings, [], settings.rootName);
      const comma = index < entries.length - 1 ? ',' : '';
      lines.push(`${indent}${key}: ${schemaStr}${comma}`);
    });
  }
  
  lines.push('});');
  lines.push('');
  
  // Export inferred type
  const typeName = toPascalCase(settings.rootName);
  lines.push(`export type ${typeName} = z.infer<typeof ${rootName}>;`);
  
  return lines.join('\n');
}
