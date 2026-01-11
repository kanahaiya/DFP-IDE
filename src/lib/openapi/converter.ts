/**
 * OpenAPI Converter - Converts JSON to OpenAPI 3.0 / Swagger 2.0 specifications
 * with advanced type inference and format detection
 */

import type { OpenAPISettings, Endpoint } from '@/types';

// Format detection regular expressions
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_TIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const URL_REGEX = /^https?:\/\/.+/;

export interface SchemaObject {
  type?: string;
  format?: string;
  example?: any;
  description?: string;
  items?: SchemaObject;
  properties?: Record<string, SchemaObject>;
  required?: string[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  enum?: any[];
  nullable?: boolean;
  [key: string]: any;
}

export interface OpenAPISpec {
  openapi?: string;
  swagger?: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: Array<{ url: string }>;
  host?: string;
  basePath?: string;
  schemes?: string[];
  paths: Record<string, any>;
  components?: {
    schemas?: Record<string, SchemaObject>;
    securitySchemes?: Record<string, any>;
  };
  definitions?: Record<string, SchemaObject>;
  securityDefinitions?: Record<string, any>;
}

/**
 * Detects the format of a string value
 */
function detectFormat(value: string): string | undefined {
  if (EMAIL_REGEX.test(value)) return 'email';
  if (UUID_REGEX.test(value)) return 'uuid';
  if (DATE_TIME_REGEX.test(value)) return 'date-time';
  if (DATE_REGEX.test(value)) return 'date';
  if (URL_REGEX.test(value)) return 'uri';
  return undefined;
}

/**
 * Infers JSON schema from a value with advanced type detection
 */
function inferSchema(
  value: any,
  settings: OpenAPISettings,
  key?: string
): SchemaObject {
  // Handle null
  if (value === null) {
    return {
      type: 'string',
      nullable: true,
      ...(settings.includeExamples && { example: null }),
    };
  }

  const type = typeof value;

  // String type with format detection
  if (type === 'string') {
    const schema: SchemaObject = { type: 'string' };
    
    if (settings.detectFormats) {
      const format = detectFormat(value);
      if (format) schema.format = format;
    }
    
    if (settings.includeExamples) {
      schema.example = value;
    }
    
    if (settings.addConstraints) {
      schema.minLength = 1;
      schema.maxLength = 1000;
    }
    
    if (settings.addDescriptions && key) {
      schema.description = `The ${key} field`;
    }
    
    return schema;
  }

  // Number type
  if (type === 'number') {
    const schema: SchemaObject = {
      type: Number.isInteger(value) ? 'integer' : 'number',
    };
    
    if (!Number.isInteger(value)) {
      schema.format = 'double';
    }
    
    if (settings.includeExamples) {
      schema.example = value;
    }
    
    if (settings.addConstraints) {
      schema.minimum = 0;
      schema.maximum = Number.isInteger(value) ? 2147483647 : Number.MAX_SAFE_INTEGER;
    }
    
    if (settings.addDescriptions && key) {
      schema.description = `The ${key} field`;
    }
    
    return schema;
  }

  // Boolean type
  if (type === 'boolean') {
    const schema: SchemaObject = { type: 'boolean' };
    
    if (settings.includeExamples) {
      schema.example = value;
    }
    
    if (settings.addDescriptions && key) {
      schema.description = `The ${key} field`;
    }
    
    return schema;
  }

  // Array type
  if (Array.isArray(value)) {
    const schema: SchemaObject = {
      type: 'array',
    };
    
    if (value.length > 0) {
      // Infer items schema from first element
      schema.items = inferSchema(value[0], settings);
    } else {
      schema.items = { type: 'string' };
    }
    
    if (settings.includeExamples) {
      schema.example = value;
    }
    
    if (settings.addConstraints) {
      schema.minItems = 0;
      schema.maxItems = 100;
    }
    
    if (settings.addDescriptions && key) {
      schema.description = `Array of ${key}`;
    }
    
    return schema;
  }

  // Object type
  if (type === 'object') {
    const schema: SchemaObject = {
      type: 'object',
      properties: {},
    };
    
    const required: string[] = [];
    
    for (const [k, v] of Object.entries(value)) {
      schema.properties![k] = inferSchema(v, settings, k);
      
      if (settings.markRequired && v !== null && v !== undefined) {
        required.push(k);
      }
    }
    
    if (required.length > 0) {
      schema.required = required;
    }
    
    if (settings.includeExamples) {
      schema.example = value;
    }
    
    if (settings.addDescriptions && key) {
      schema.description = `The ${key} object`;
    }
    
    return schema;
  }

  // Fallback
  return { type: 'string' };
}

/**
 * Generates a schema name from endpoint path and method
 */
function generateSchemaName(path: string, method: string): string {
  const cleanPath = path
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .replace(/[{}]/g, '')
    .replace(/\//g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '');
  
  const methodCap = method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
  
  return `${methodCap}${cleanPath || 'Root'}Response`;
}

/**
 * Validates an OpenAPI specification
 */
export function validateSpec(spec: OpenAPISpec): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  if (!spec.info) {
    errors.push('Missing required field: info');
  } else {
    if (!spec.info.title) errors.push('Missing required field: info.title');
    if (!spec.info.version) errors.push('Missing required field: info.version');
  }

  if (!spec.paths) {
    errors.push('Missing required field: paths');
  } else if (Object.keys(spec.paths).length === 0) {
    warnings.push('No paths defined in specification');
  }

  // Check version-specific fields
  if (spec.openapi && !spec.servers) {
    warnings.push('OpenAPI 3.0 spec should include servers array');
  }
  if (spec.swagger && !spec.host) {
    warnings.push('Swagger 2.0 spec should include host field');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Generates OpenAPI specification from endpoints and settings
 */
export function generateOpenAPISpec(
  endpoints: Endpoint[],
  settings: OpenAPISettings
): OpenAPISpec {
  const isOpenAPI3 = settings.openAPIVersion === '3.0';

  // Initialize base spec
  let spec: OpenAPISpec;
  
  if (isOpenAPI3) {
    spec = {
      openapi: '3.0.3',
      info: {
        title: settings.title,
        version: settings.version,
      },
      servers: [{ url: settings.serverUrl }],
      paths: {},
    };
    
    if (settings.description) {
      spec.info.description = settings.description;
    }
    
    if (settings.generateComponents) {
      spec.components = { schemas: {} };
    }
  } else {
    // Swagger 2.0
    const serverUrl = new URL(settings.serverUrl);
    
    spec = {
      swagger: '2.0',
      info: {
        title: settings.title,
        version: settings.version,
      },
      host: serverUrl.host,
      basePath: serverUrl.pathname === '/' ? '/' : serverUrl.pathname,
      schemes: [serverUrl.protocol.replace(':', '')],
      paths: {},
    };
    
    if (settings.description) {
      spec.info.description = settings.description;
    }
    
    if (settings.generateComponents) {
      spec.definitions = {};
    }
  }

  // Process each endpoint
  for (const endpoint of endpoints) {
    if (!endpoint.json || !endpoint.json.trim()) continue;

    let jsonData: any;
    try {
      jsonData = JSON.parse(endpoint.json);
    } catch (error) {
      console.error(`Failed to parse JSON for endpoint ${endpoint.path}:`, error);
      continue;
    }

    // Generate schema
    const schema = inferSchema(jsonData, settings);
    const schemaName = generateSchemaName(endpoint.path, endpoint.method);

    // Initialize path if not exists
    if (!spec.paths[endpoint.path]) {
      spec.paths[endpoint.path] = {};
    }

    // Build operation
    const operation: any = {
      operationId: endpoint.operationId || `${endpoint.method}${endpoint.path.replace(/\//g, '_').replace(/[{}]/g, '')}`,
      responses: {},
    };

    if (endpoint.summary) {
      operation.summary = endpoint.summary;
    }

    if (endpoint.description) {
      operation.description = endpoint.description;
    }

    if (endpoint.tags) {
      const tags = endpoint.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t);
      if (tags.length > 0) {
        operation.tags = tags;
      }
    }

    // Add response
    const responseCode = endpoint.responseCode || '200';
    
    if (isOpenAPI3) {
      const responseSchema = settings.generateComponents
        ? { $ref: `#/components/schemas/${schemaName}` }
        : schema;

      operation.responses[responseCode] = {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: responseSchema,
          },
        },
      };

      // Add request body for POST/PUT/PATCH
      if (['post', 'put', 'patch'].includes(endpoint.method.toLowerCase())) {
        operation.requestBody = {
          required: true,
          content: {
            'application/json': {
              schema: responseSchema,
            },
          },
        };
      }

      // Add to components
      if (settings.generateComponents && spec.components) {
        spec.components.schemas![schemaName] = schema;
      }
    } else {
      // Swagger 2.0
      const responseSchema = settings.generateComponents
        ? { $ref: `#/definitions/${schemaName}` }
        : schema;

      operation.responses[responseCode] = {
        description: 'Successful response',
        schema: responseSchema,
      };

      // Add body parameter for POST/PUT/PATCH
      if (['post', 'put', 'patch'].includes(endpoint.method.toLowerCase())) {
        operation.parameters = [
          {
            in: 'body',
            name: 'body',
            required: true,
            schema: responseSchema,
          },
        ];
      }

      // Add to definitions
      if (settings.generateComponents && spec.definitions) {
        spec.definitions[schemaName] = schema;
      }
    }

    spec.paths[endpoint.path][endpoint.method.toLowerCase()] = operation;
  }

  return spec;
}
