/**
 * JSON to Schema Generator Library
 * Public API exports
 */

import type { SchemaGenerationResult, SchemaGeneratorSettings, InferredSchema } from './types';
import { inferSchema } from './inference';
import {
  generateJsonSchema,
  generateTypeScript,
  generateZod,
  generateYup,
  generateMongoose,
  generateGraphQL,
  generateFlow,
  generateRust,
  generateGo,
} from './generators';

export * from './types';
export { inferSchema } from './inference';
export * from './generators';
export { SCHEMA_GENERATOR_PRESETS, applySchemaGeneratorPreset, getSchemaGeneratorPresetById } from './presets';

/**
 * Main schema generation function
 */
export function generateSchema(
  json: string,
  settings: SchemaGeneratorSettings
): SchemaGenerationResult {
  const errors: string[] = [];
  
  // Parse and infer schema
  let schema: InferredSchema;
  try {
    schema = inferSchema(json, settings);
  } catch (e) {
    return {
      success: false,
      output: '',
      errors: [`Failed to parse JSON: ${(e as Error).message}`],
      format: settings.format,
    };
  }
  
  // Generate output based on format
  let output: string;
  try {
    switch (settings.format) {
      case 'json-schema-draft-07':
      case 'json-schema-2019-09':
      case 'json-schema-2020-12':
        output = generateJsonSchema(schema, settings);
        break;
      case 'typescript-interface':
      case 'typescript-type':
        output = generateTypeScript(schema, settings);
        break;
      case 'zod':
        output = generateZod(schema, settings);
        break;
      case 'yup':
        output = generateYup(schema, settings);
        break;
      case 'mongoose':
        output = generateMongoose(schema, settings);
        break;
      case 'graphql':
        output = generateGraphQL(schema, settings);
        break;
      case 'flow':
        output = generateFlow(schema, settings);
        break;
      case 'rust':
        output = generateRust(schema, settings);
        break;
      case 'go':
        output = generateGo(schema, settings);
        break;
      default:
        return {
          success: false,
          output: '',
          errors: [`Unsupported format: ${settings.format}`],
          format: settings.format,
        };
    }
  } catch (e) {
    return {
      success: false,
      output: '',
      errors: [`Failed to generate schema: ${(e as Error).message}`],
      format: settings.format,
    };
  }
  
  return {
    success: true,
    output,
    errors,
    format: settings.format,
  };
}
