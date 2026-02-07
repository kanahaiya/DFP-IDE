/**
 * JSON Schema Generator
 * Generates JSON Schema Draft-07, 2019-09, and 2020-12
 */

import type { InferredSchema, InferredProperty, SchemaGeneratorSettings, SchemaFormat } from '../types';
import { toJsonSchemaType, getFormatForType } from '../inference';

interface JsonSchemaOutput {
  $schema: string;
  $id?: string;
  title?: string;
  description?: string;
  type: string;
  properties?: Record<string, unknown>;
  required?: string[];
  items?: unknown;
  additionalProperties?: boolean;
}

function getSchemaUri(format: SchemaFormat): string {
  switch (format) {
    case 'json-schema-2020-12':
      return 'https://json-schema.org/draft/2020-12/schema';
    case 'json-schema-2019-09':
      return 'https://json-schema.org/draft/2019-09/schema';
    default:
      return 'http://json-schema.org/draft-07/schema#';
  }
}

function convertProperty(prop: InferredProperty, settings: SchemaGeneratorSettings): unknown {
  const result: Record<string, unknown> = {};
  
  // Handle basic type
  const jsonType = toJsonSchemaType(prop.type);
  
  if (prop.isNullable) {
    result.type = [jsonType, 'null'];
  } else {
    result.type = jsonType;
  }
  
  // Add format for special types
  const format = getFormatForType(prop.type) || prop.format;
  if (format) {
    result.format = format;
  }
  
  // Handle nested objects
  if (prop.type === 'object' && prop.properties) {
    const properties: Record<string, unknown> = {};
    const required: string[] = [];
    
    for (const [key, nestedProp] of Object.entries(prop.properties)) {
      properties[key] = convertProperty(nestedProp, settings);
      if (nestedProp.isRequired && !settings.makeAllOptional) {
        required.push(key);
      }
    }
    
    result.properties = properties;
    if (required.length > 0) {
      result.required = required;
    }
  }
  
  // Handle arrays
  if (prop.type === 'array' && prop.items) {
    result.items = convertSchema(prop.items, settings, false);
  }
  
  // Handle enums
  if (prop.enum && prop.enum.length > 0) {
    result.enum = prop.enum;
  }
  
  // Add description
  if (settings.addDescriptions && prop.description) {
    result.description = prop.description;
  }
  
  return result;
}

function convertSchema(schema: InferredSchema, settings: SchemaGeneratorSettings, isRoot: boolean): unknown {
  if (schema.type === 'object' && schema.properties) {
    const properties: Record<string, unknown> = {};
    const required: string[] = [];
    
    for (const [key, prop] of Object.entries(schema.properties)) {
      properties[key] = convertProperty(prop, settings);
      if (prop.isRequired && !settings.makeAllOptional) {
        required.push(key);
      }
    }
    
    const result: Record<string, unknown> = {
      type: 'object',
      properties,
    };
    
    if (required.length > 0) {
      result.required = required;
    }
    
    if (isRoot && schema.title) {
      result.title = schema.title;
    }
    
    return result;
  }
  
  if (schema.type === 'array' && schema.items) {
    return {
      type: 'array',
      items: convertSchema(schema.items, settings, false),
    };
  }
  
  return { type: toJsonSchemaType(schema.type) };
}

export function generateJsonSchema(
  schema: InferredSchema,
  settings: SchemaGeneratorSettings
): string {
  const output: JsonSchemaOutput = {
    $schema: getSchemaUri(settings.format),
    title: settings.rootName,
    type: toJsonSchemaType(schema.type),
  };
  
  if (schema.type === 'object' && schema.properties) {
    const properties: Record<string, unknown> = {};
    const required: string[] = [];
    
    for (const [key, prop] of Object.entries(schema.properties)) {
      properties[key] = convertProperty(prop, settings);
      if (prop.isRequired && !settings.makeAllOptional) {
        required.push(key);
      }
    }
    
    output.properties = properties;
    if (required.length > 0) {
      output.required = required;
    }
  }
  
  if (schema.type === 'array' && schema.items) {
    output.items = convertSchema(schema.items, settings, false);
  }
  
  const indent = settings.indentation === 'tab' ? '\t' : settings.indentation;
  return JSON.stringify(output, null, indent);
}
