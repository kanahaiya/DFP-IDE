/**
 * JSON Schema Validator - Core validation engine
 * Implements JSON Schema validation without external dependencies
 */

import type {
  SchemaValidationResult,
  SchemaValidationError,
  SchemaValidatorSettings,
  SchemaDraft,
  JsonSchema,
} from './types';
import { DEFAULT_SCHEMA_VALIDATOR_SETTINGS } from './types';

/**
 * Detect schema draft from $schema property
 */
function detectDraft(schema: JsonSchema): SchemaDraft {
  const schemaUri = schema.$schema || '';
  
  if (schemaUri.includes('2020-12')) return '2020-12';
  if (schemaUri.includes('2019-09')) return '2019-09';
  if (schemaUri.includes('draft-07')) return 'draft-07';
  if (schemaUri.includes('draft-06')) return 'draft-06';
  if (schemaUri.includes('draft-04')) return 'draft-04';
  
  // Default to draft-07 if not specified
  return 'draft-07';
}

/**
 * Get actual type of a value
 */
function getType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

/**
 * Format validation
 */
const FORMAT_VALIDATORS: Record<string, (value: string) => boolean> = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  uri: (v) => {
    try {
      new URL(v);
      return true;
    } catch {
      return false;
    }
  },
  'uri-reference': (v) => {
    try {
      new URL(v, 'http://example.com');
      return true;
    } catch {
      return false;
    }
  },
  'date-time': (v) => !isNaN(Date.parse(v)) && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v),
  date: (v) => /^\d{4}-\d{2}-\d{2}$/.test(v),
  time: (v) => /^\d{2}:\d{2}:\d{2}/.test(v),
  uuid: (v) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v),
  ipv4: (v) => /^(\d{1,3}\.){3}\d{1,3}$/.test(v) && v.split('.').every(n => parseInt(n) <= 255),
  ipv6: (v) => /^([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/i.test(v),
  hostname: (v) => /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i.test(v),
  'json-pointer': (v) => v === '' || /^\//.test(v),
  regex: (v) => {
    try {
      new RegExp(v);
      return true;
    } catch {
      return false;
    }
  },
};

/**
 * Validate a value against a schema
 */
function validateValue(
  value: unknown,
  schema: JsonSchema,
  path: string,
  errors: SchemaValidationError[],
  settings: SchemaValidatorSettings,
  rootSchema: JsonSchema
): void {
  // Handle $ref
  if (schema.$ref) {
    const refSchema = resolveRef(schema.$ref, rootSchema);
    if (refSchema) {
      validateValue(value, refSchema, path, errors, settings, rootSchema);
    } else {
      errors.push({
        path,
        message: `Cannot resolve reference: ${schema.$ref}`,
        keyword: '$ref',
        schemaPath: path,
        severity: 'error',
      });
    }
    return;
  }

  // Type validation
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const actualType = getType(value);
    
    // Special case: integer is a subset of number
    const typeMatches = types.some(t => {
      if (t === 'integer') {
        return typeof value === 'number' && Number.isInteger(value);
      }
      return t === actualType;
    });
    
    if (!typeMatches) {
      errors.push({
        path,
        message: `Expected type ${types.join(' | ')}, got ${actualType}`,
        keyword: 'type',
        schemaPath: `${path}/type`,
        value,
        expectedType: types.join(' | '),
        actualType,
        severity: 'error',
        suggestion: `Change the value to type ${types[0]}`,
      });
      return; // Stop validation if type doesn't match
    }
  }

  // Enum validation
  if (schema.enum) {
    if (!schema.enum.some(e => JSON.stringify(e) === JSON.stringify(value))) {
      errors.push({
        path,
        message: `Value must be one of: ${schema.enum.map(v => JSON.stringify(v)).join(', ')}`,
        keyword: 'enum',
        schemaPath: `${path}/enum`,
        value,
        severity: 'error',
      });
    }
  }

  // Const validation
  if (schema.const !== undefined) {
    if (JSON.stringify(schema.const) !== JSON.stringify(value)) {
      errors.push({
        path,
        message: `Value must be exactly ${JSON.stringify(schema.const)}`,
        keyword: 'const',
        schemaPath: `${path}/const`,
        value,
        severity: 'error',
      });
    }
  }

  // String validation
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push({
        path,
        message: `String must be at least ${schema.minLength} characters`,
        keyword: 'minLength',
        schemaPath: `${path}/minLength`,
        severity: 'error',
      });
    }
    
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      errors.push({
        path,
        message: `String must be at most ${schema.maxLength} characters`,
        keyword: 'maxLength',
        schemaPath: `${path}/maxLength`,
        severity: 'error',
      });
    }
    
    if (schema.pattern) {
      try {
        const regex = new RegExp(schema.pattern);
        if (!regex.test(value)) {
          errors.push({
            path,
            message: `String does not match pattern: ${schema.pattern}`,
            keyword: 'pattern',
            schemaPath: `${path}/pattern`,
            severity: 'error',
          });
        }
      } catch {
        errors.push({
          path,
          message: `Invalid regex pattern in schema: ${schema.pattern}`,
          keyword: 'pattern',
          schemaPath: `${path}/pattern`,
          severity: 'warning',
        });
      }
    }
    
    if (schema.format && settings.validateFormats) {
      const validator = FORMAT_VALIDATORS[schema.format];
      if (validator && !validator(value)) {
        errors.push({
          path,
          message: `String does not match format: ${schema.format}`,
          keyword: 'format',
          schemaPath: `${path}/format`,
          severity: 'error',
        });
      }
    }
  }

  // Number validation
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) {
      errors.push({
        path,
        message: `Number must be >= ${schema.minimum}`,
        keyword: 'minimum',
        schemaPath: `${path}/minimum`,
        severity: 'error',
      });
    }
    
    if (schema.maximum !== undefined && value > schema.maximum) {
      errors.push({
        path,
        message: `Number must be <= ${schema.maximum}`,
        keyword: 'maximum',
        schemaPath: `${path}/maximum`,
        severity: 'error',
      });
    }
    
    if (schema.exclusiveMinimum !== undefined) {
      const min = typeof schema.exclusiveMinimum === 'number' 
        ? schema.exclusiveMinimum 
        : (schema.exclusiveMinimum ? schema.minimum : undefined);
      if (min !== undefined && value <= min) {
        errors.push({
          path,
          message: `Number must be > ${min}`,
          keyword: 'exclusiveMinimum',
          schemaPath: `${path}/exclusiveMinimum`,
          severity: 'error',
        });
      }
    }
    
    if (schema.exclusiveMaximum !== undefined) {
      const max = typeof schema.exclusiveMaximum === 'number'
        ? schema.exclusiveMaximum
        : (schema.exclusiveMaximum ? schema.maximum : undefined);
      if (max !== undefined && value >= max) {
        errors.push({
          path,
          message: `Number must be < ${max}`,
          keyword: 'exclusiveMaximum',
          schemaPath: `${path}/exclusiveMaximum`,
          severity: 'error',
        });
      }
    }
    
    if (schema.multipleOf !== undefined && value % schema.multipleOf !== 0) {
      errors.push({
        path,
        message: `Number must be a multiple of ${schema.multipleOf}`,
        keyword: 'multipleOf',
        schemaPath: `${path}/multipleOf`,
        severity: 'error',
      });
    }
  }

  // Array validation
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push({
        path,
        message: `Array must have at least ${schema.minItems} items`,
        keyword: 'minItems',
        schemaPath: `${path}/minItems`,
        severity: 'error',
      });
    }
    
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      errors.push({
        path,
        message: `Array must have at most ${schema.maxItems} items`,
        keyword: 'maxItems',
        schemaPath: `${path}/maxItems`,
        severity: 'error',
      });
    }
    
    if (schema.uniqueItems && new Set(value.map(v => JSON.stringify(v))).size !== value.length) {
      errors.push({
        path,
        message: 'Array items must be unique',
        keyword: 'uniqueItems',
        schemaPath: `${path}/uniqueItems`,
        severity: 'error',
      });
    }
    
    // Items validation
    if (schema.items) {
      if (Array.isArray(schema.items)) {
        // Tuple validation (draft-04 to draft-07)
        schema.items.forEach((itemSchema, index) => {
          if (index < value.length) {
            validateValue(value[index], itemSchema, `${path}[${index}]`, errors, settings, rootSchema);
          }
        });
      } else {
        // All items share same schema
        value.forEach((item, index) => {
          validateValue(item, schema.items as JsonSchema, `${path}[${index}]`, errors, settings, rootSchema);
        });
      }
    }
    
    // prefixItems validation (2019-09+)
    if (schema.prefixItems) {
      schema.prefixItems.forEach((itemSchema, index) => {
        if (index < value.length) {
          validateValue(value[index], itemSchema, `${path}[${index}]`, errors, settings, rootSchema);
        }
      });
    }
  }

  // Object validation
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);
    
    // Required properties
    if (schema.required) {
      for (const key of schema.required) {
        if (!(key in obj)) {
          errors.push({
            path: `${path}.${key}`,
            message: `Missing required property: ${key}`,
            keyword: 'required',
            schemaPath: `${path}/required`,
            severity: 'error',
            suggestion: `Add the "${key}" property`,
          });
        }
      }
    }
    
    // Property count
    if (schema.minProperties !== undefined && keys.length < schema.minProperties) {
      errors.push({
        path,
        message: `Object must have at least ${schema.minProperties} properties`,
        keyword: 'minProperties',
        schemaPath: `${path}/minProperties`,
        severity: 'error',
      });
    }
    
    if (schema.maxProperties !== undefined && keys.length > schema.maxProperties) {
      errors.push({
        path,
        message: `Object must have at most ${schema.maxProperties} properties`,
        keyword: 'maxProperties',
        schemaPath: `${path}/maxProperties`,
        severity: 'error',
      });
    }
    
    // Properties validation
    for (const key of keys) {
      let validated = false;
      
      // Check defined properties
      if (schema.properties && key in schema.properties) {
        validateValue(obj[key], schema.properties[key], `${path}.${key}`, errors, settings, rootSchema);
        validated = true;
      }
      
      // Check pattern properties
      if (schema.patternProperties) {
        for (const pattern in schema.patternProperties) {
          if (new RegExp(pattern).test(key)) {
            validateValue(obj[key], schema.patternProperties[pattern], `${path}.${key}`, errors, settings, rootSchema);
            validated = true;
          }
        }
      }
      
      // Check additional properties
      if (!validated && schema.additionalProperties !== undefined) {
        if (schema.additionalProperties === false) {
          errors.push({
            path: `${path}.${key}`,
            message: `Additional property "${key}" is not allowed`,
            keyword: 'additionalProperties',
            schemaPath: `${path}/additionalProperties`,
            severity: 'error',
            suggestion: `Remove the "${key}" property or add it to the schema`,
          });
        } else if (typeof schema.additionalProperties === 'object') {
          validateValue(obj[key], schema.additionalProperties, `${path}.${key}`, errors, settings, rootSchema);
        }
      }
    }
    
    // dependentRequired
    if (schema.dependentRequired) {
      for (const key in schema.dependentRequired) {
        if (key in obj) {
          for (const dep of schema.dependentRequired[key]) {
            if (!(dep in obj)) {
              errors.push({
                path: `${path}.${dep}`,
                message: `Property "${dep}" is required when "${key}" is present`,
                keyword: 'dependentRequired',
                schemaPath: `${path}/dependentRequired`,
                severity: 'error',
              });
            }
          }
        }
      }
    }
  }

  // Combinators
  if (schema.allOf) {
    for (const subSchema of schema.allOf) {
      validateValue(value, subSchema, path, errors, settings, rootSchema);
    }
  }

  if (schema.anyOf) {
    const subErrors: SchemaValidationError[][] = [];
    let anyValid = false;
    
    for (const subSchema of schema.anyOf) {
      const tempErrors: SchemaValidationError[] = [];
      validateValue(value, subSchema, path, tempErrors, settings, rootSchema);
      if (tempErrors.length === 0) {
        anyValid = true;
        break;
      }
      subErrors.push(tempErrors);
    }
    
    if (!anyValid) {
      errors.push({
        path,
        message: 'Value does not match any of the allowed schemas',
        keyword: 'anyOf',
        schemaPath: `${path}/anyOf`,
        severity: 'error',
      });
    }
  }

  if (schema.oneOf) {
    const validCount = schema.oneOf.filter(subSchema => {
      const tempErrors: SchemaValidationError[] = [];
      validateValue(value, subSchema, path, tempErrors, settings, rootSchema);
      return tempErrors.length === 0;
    }).length;
    
    if (validCount !== 1) {
      errors.push({
        path,
        message: validCount === 0 
          ? 'Value does not match any of the schemas in oneOf'
          : `Value matches ${validCount} schemas but must match exactly one`,
        keyword: 'oneOf',
        schemaPath: `${path}/oneOf`,
        severity: 'error',
      });
    }
  }

  if (schema.not) {
    const tempErrors: SchemaValidationError[] = [];
    validateValue(value, schema.not, path, tempErrors, settings, rootSchema);
    if (tempErrors.length === 0) {
      errors.push({
        path,
        message: 'Value should NOT match the schema in "not"',
        keyword: 'not',
        schemaPath: `${path}/not`,
        severity: 'error',
      });
    }
  }

  // Conditional
  if (schema.if) {
    const tempErrors: SchemaValidationError[] = [];
    validateValue(value, schema.if, path, tempErrors, settings, rootSchema);
    
    if (tempErrors.length === 0 && schema.then) {
      validateValue(value, schema.then, path, errors, settings, rootSchema);
    } else if (tempErrors.length > 0 && schema.else) {
      validateValue(value, schema.else, path, errors, settings, rootSchema);
    }
  }
}

/**
 * Resolve $ref to actual schema
 */
function resolveRef(ref: string, rootSchema: JsonSchema): JsonSchema | null {
  if (ref.startsWith('#/')) {
    const parts = ref.slice(2).split('/');
    let current: unknown = rootSchema;
    
    for (const part of parts) {
      if (current && typeof current === 'object') {
        current = (current as Record<string, unknown>)[part];
      } else {
        return null;
      }
    }
    
    return current as JsonSchema;
  }
  
  return null;
}

/**
 * Main validation function
 */
export function validateJSONSchema(
  data: string,
  schemaStr: string,
  settings: Partial<SchemaValidatorSettings> = {}
): SchemaValidationResult {
  const startTime = performance.now();
  const config: SchemaValidatorSettings = { ...DEFAULT_SCHEMA_VALIDATOR_SETTINGS, ...settings };
  
  const result: SchemaValidationResult = {
    isValid: false,
    errors: [],
    warnings: [],
    draft: config.draft,
    validationTime: 0,
  };
  
  // Parse schema
  let schema: JsonSchema;
  try {
    schema = JSON.parse(schemaStr);
  } catch (e) {
    result.errors.push({
      path: '',
      message: `Invalid JSON Schema: ${(e as Error).message}`,
      keyword: 'parse',
      schemaPath: '',
      severity: 'error',
      suggestion: 'Check the schema JSON syntax',
    });
    result.validationTime = performance.now() - startTime;
    return result;
  }
  
  // Parse data
  let parsedData: unknown;
  try {
    parsedData = JSON.parse(data);
  } catch (e) {
    result.errors.push({
      path: '',
      message: `Invalid JSON data: ${(e as Error).message}`,
      keyword: 'parse',
      schemaPath: '',
      severity: 'error',
      suggestion: 'Check the JSON data syntax',
    });
    result.validationTime = performance.now() - startTime;
    return result;
  }
  
  // Auto-detect draft
  if (config.autoDetectDraft) {
    result.draft = detectDraft(schema);
  }
  
  // Validate
  const errors: SchemaValidationError[] = [];
  validateValue(parsedData, schema, '', errors, config, schema);
  
  // Separate errors and warnings
  for (const error of errors) {
    if (error.severity === 'warning') {
      result.warnings.push(error);
    } else {
      result.errors.push(error);
    }
  }
  
  result.isValid = result.errors.length === 0;
  result.validationTime = performance.now() - startTime;
  
  return result;
}

/**
 * Validate schema itself
 */
export function validateSchema(schemaStr: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    const schema = JSON.parse(schemaStr);
    
    // Basic schema validation
    if (typeof schema !== 'object' || schema === null) {
      errors.push('Schema must be an object');
    }
    
    // Check type is valid
    if (schema.type) {
      const validTypes = ['string', 'number', 'integer', 'boolean', 'object', 'array', 'null'];
      const types = Array.isArray(schema.type) ? schema.type : [schema.type];
      for (const t of types) {
        if (!validTypes.includes(t)) {
          errors.push(`Invalid type: ${t}`);
        }
      }
    }
    
    return { valid: errors.length === 0, errors };
  } catch (e) {
    return { valid: false, errors: [`Invalid JSON: ${(e as Error).message}`] };
  }
}
