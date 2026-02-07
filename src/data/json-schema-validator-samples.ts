/**
 * JSON Schema Validator Sample Templates
 * Re-exports example schemas from the library
 */

import { EXAMPLE_SCHEMAS, type ExampleSchema } from '@/lib/schema-validator';

export interface SampleTemplate {
  name: string;
  description: string;
  content: string;
  icon?: string;
  iconColor?: string;
}

// Convert example schemas to sample templates
export const jsonSchemaValidatorSamples: SampleTemplate[] = EXAMPLE_SCHEMAS.map(schema => ({
  name: schema.name,
  description: schema.description,
  content: schema.sampleData,
  icon: schema.icon,
  iconColor: 'text-blue-500',
}));

export { EXAMPLE_SCHEMAS, type ExampleSchema };

export const defaultSample = jsonSchemaValidatorSamples[0];
