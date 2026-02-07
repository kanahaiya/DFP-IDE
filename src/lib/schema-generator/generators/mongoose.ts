/**
 * Mongoose Schema Generator
 * Generates MongoDB Mongoose schemas
 */

import type { InferredSchema, InferredProperty, SchemaGeneratorSettings } from '../types';

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, c => c.toUpperCase());
}

function mapTypeToMongoose(type: string): string {
  switch (type) {
    case 'integer':
    case 'number':
      return 'Number';
    case 'boolean':
      return 'Boolean';
    case 'string':
    case 'email':
    case 'uri':
    case 'uuid':
      return 'String';
    case 'date':
      return 'Date';
    default:
      return 'Schema.Types.Mixed';
  }
}

function generatePropertyDefinition(
  prop: InferredProperty,
  settings: SchemaGeneratorSettings,
  indent: string,
  depth: number
): string {
  const currentIndent = indent.repeat(depth);
  const nextIndent = indent.repeat(depth + 1);
  
  if (prop.type === 'object' && prop.properties) {
    const lines: string[] = ['{'];
    
    const entries = Object.entries(prop.properties);
    entries.forEach(([key, nestedProp], index) => {
      const propDef = generatePropertyDefinition(nestedProp, settings, indent, depth + 1);
      const comma = index < entries.length - 1 ? ',' : '';
      lines.push(`${nextIndent}${key}: ${propDef}${comma}`);
    });
    
    lines.push(`${currentIndent}}`);
    return lines.join('\n');
  }
  
  if (prop.type === 'array' && prop.items) {
    if (prop.items.type === 'object' && prop.items.properties) {
      const nestedDef = generatePropertyDefinition(
        { ...prop.items, name: prop.name, isRequired: false, isNullable: false } as InferredProperty,
        settings,
        indent,
        depth
      );
      return `[${nestedDef}]`;
    }
    return `[${mapTypeToMongoose(prop.items.type)}]`;
  }
  
  // Simple type with options
  const options: string[] = [];
  options.push(`type: ${mapTypeToMongoose(prop.type)}`);
  
  if (prop.isRequired && !settings.makeAllOptional) {
    options.push('required: true');
  }
  
  if (prop.type === 'email') {
    options.push('match: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/');
  }
  
  if (options.length === 1) {
    return mapTypeToMongoose(prop.type);
  }
  
  return `{ ${options.join(', ')} }`;
}

export function generateMongoose(
  schema: InferredSchema,
  settings: SchemaGeneratorSettings
): string {
  const indent = settings.indentation === 'tab' ? '\t' : ' '.repeat(settings.indentation as number);
  const modelName = toPascalCase(settings.rootName);
  
  const lines: string[] = [];
  
  // Import statement
  lines.push("const mongoose = require('mongoose');");
  lines.push('const { Schema } = mongoose;');
  lines.push('');
  
  // Schema definition
  lines.push(`const ${modelName}Schema = new Schema({`);
  
  if (schema.properties) {
    const entries = Object.entries(schema.properties);
    entries.forEach(([key, prop], index) => {
      const propDef = generatePropertyDefinition(prop, settings, indent, 1);
      const comma = index < entries.length - 1 ? ',' : '';
      lines.push(`${indent}${key}: ${propDef}${comma}`);
    });
  }
  
  lines.push('}, {');
  lines.push(`${indent}timestamps: true`);
  lines.push('});');
  lines.push('');
  
  // Model export
  lines.push(`const ${modelName} = mongoose.model('${modelName}', ${modelName}Schema);`);
  lines.push('');
  lines.push(`module.exports = ${modelName};`);
  
  return lines.join('\n');
}
