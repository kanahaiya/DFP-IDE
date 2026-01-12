/**
 * Smart type inference for JSON values
 * Detects special formats like email, UUID, date, URL, etc.
 */

export interface InferredType {
  type: string;
  format?: string;
  pattern?: string;
  enum?: unknown[];
  items?: InferredType;
  properties?: Record<string, InferredType>;
  required?: string[];
  nullable?: boolean;
}

/**
 * Infer JSON schema type from a value
 */
export function inferType(value: unknown, key?: string): InferredType {
  if (value === null) {
    return { type: 'string', nullable: true };
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { type: 'array', items: { type: 'string' } };
    }
    // Infer from first item (could be improved to merge all items)
    const itemType = inferType(value[0]);
    return { type: 'array', items: itemType };
  }

  if (typeof value === 'object') {
    const properties: Record<string, InferredType> = {};
    const required: string[] = [];

    for (const [k, v] of Object.entries(value)) {
      properties[k] = inferType(v, k);
      if (v !== null && v !== undefined) {
        required.push(k);
      }
    }

    return {
      type: 'object',
      properties,
      required: required.length > 0 ? required : undefined,
    };
  }

  if (typeof value === 'string') {
    return inferStringType(value, key);
  }

  if (typeof value === 'number') {
    return inferNumberType(value);
  }

  if (typeof value === 'boolean') {
    return { type: 'boolean' };
  }

  return { type: 'string' };
}

/**
 * Infer specific string format
 */
function inferStringType(value: string, key?: string): InferredType {
  const lowerKey = key?.toLowerCase() || '';

  // Email
  if (lowerKey.includes('email') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return { type: 'string', format: 'email' };
  }

  // UUID
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
    return { type: 'string', format: 'uuid' };
  }

  // Date-time (ISO 8601)
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    return { type: 'string', format: 'date-time' };
  }

  // Date
  if (/^\d{4}-\d{2}-\d{2}$/.test(value) && lowerKey.includes('date')) {
    return { type: 'string', format: 'date' };
  }

  // URL
  if (lowerKey.includes('url') || lowerKey.includes('link') || 
      /^https?:\/\/.+\..+/.test(value)) {
    return { type: 'string', format: 'uri' };
  }

  // URI
  if (lowerKey.includes('uri')) {
    return { type: 'string', format: 'uri' };
  }

  return { type: 'string' };
}

/**
 * Infer number type (integer vs float)
 */
function inferNumberType(value: number): InferredType {
  if (Number.isInteger(value)) {
    return { type: 'integer', format: 'int64' };
  }
  return { type: 'number', format: 'double' };
}

/**
 * Merge two inferred types (for handling multiple examples)
 */
export function mergeTypes(type1: InferredType, type2: InferredType): InferredType {
  // If types are different, use the more generic one
  if (type1.type !== type2.type) {
    return { type: 'string' }; // Fallback to string for conflicts
  }

  if (type1.type === 'object' && type2.type === 'object') {
    const properties: Record<string, InferredType> = {};
    const allKeys = new Set([
      ...Object.keys(type1.properties || {}),
      ...Object.keys(type2.properties || {}),
    ]);

    for (const key of allKeys) {
      const prop1 = type1.properties?.[key];
      const prop2 = type2.properties?.[key];

      if (prop1 && prop2) {
        properties[key] = mergeTypes(prop1, prop2);
      } else {
        properties[key] = prop1 || prop2 || { type: 'string' };
      }
    }

    const required1 = new Set(type1.required || []);
    const required2 = new Set(type2.required || []);
    const required = Array.from(allKeys).filter(k => required1.has(k) && required2.has(k));

    return {
      type: 'object',
      properties,
      required: required.length > 0 ? required : undefined,
    };
  }

  if (type1.type === 'array' && type2.type === 'array') {
    const items = type1.items && type2.items 
      ? mergeTypes(type1.items, type2.items)
      : type1.items || type2.items || { type: 'string' };
    return { type: 'array', items };
  }

  // For primitive types, prefer the one with format
  if (type1.format) return type1;
  if (type2.format) return type2;

  return type1;
}
