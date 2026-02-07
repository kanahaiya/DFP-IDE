/**
 * Type inference engine for JSON to Code converters
 */

import type { JsonValue, JsonObject, JsonArray, InferredType, FieldInfo, GeneratedClass } from './types';
import { toPascalCase, singularize, generateClassName } from './nameUtils';

/**
 * Check if a value is a plain object
 */
function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Check if a number is an integer
 */
function isInteger(num: number): boolean {
  return Number.isInteger(num) && num >= Number.MIN_SAFE_INTEGER && num <= Number.MAX_SAFE_INTEGER;
}

/**
 * Infer the type of a JSON value
 */
export function inferType(value: JsonValue, key?: string): InferredType {
  if (value === null) {
    return { type: 'null', isNullable: true };
  }
  
  if (typeof value === 'string') {
    return { type: 'string', isNullable: false, originalKey: key };
  }
  
  if (typeof value === 'boolean') {
    return { type: 'boolean', isNullable: false, originalKey: key };
  }
  
  if (typeof value === 'number') {
    return {
      type: isInteger(value) ? 'int' : 'float',
      isNullable: false,
      originalKey: key
    };
  }
  
  if (Array.isArray(value)) {
    return inferArrayType(value, key);
  }
  
  if (isPlainObject(value)) {
    return inferObjectType(value, key);
  }
  
  return { type: 'mixed', isNullable: false, originalKey: key };
}

/**
 * Infer the type of an array
 */
function inferArrayType(arr: JsonArray, key?: string): InferredType {
  if (arr.length === 0) {
    return {
      type: 'array',
      isNullable: false,
      arrayElementType: { type: 'mixed', isNullable: false },
      originalKey: key
    };
  }
  
  // Check all element types
  const elementTypes = arr.map(item => inferType(item));
  const mergedType = mergeTypes(elementTypes);
  
  return {
    type: 'array',
    isNullable: false,
    arrayElementType: mergedType,
    originalKey: key
  };
}

/**
 * Infer the type of an object
 */
function inferObjectType(obj: JsonObject, key?: string): InferredType {
  const fields: Record<string, InferredType> = {};
  
  for (const [fieldKey, fieldValue] of Object.entries(obj)) {
    fields[fieldKey] = inferType(fieldValue, fieldKey);
  }
  
  return {
    type: 'object',
    isNullable: false,
    objectFields: fields,
    originalKey: key
  };
}

/**
 * Merge multiple types (for array element inference)
 */
function mergeTypes(types: InferredType[]): InferredType {
  if (types.length === 0) {
    return { type: 'mixed', isNullable: false };
  }
  
  if (types.length === 1) {
    return types[0];
  }
  
  // Check if all types are the same primitive
  const nonNullTypes = types.filter(t => t.type !== 'null');
  const nullableCount = types.filter(t => t.type === 'null').length;
  const isNullable = nullableCount > 0;
  
  if (nonNullTypes.length === 0) {
    return { type: 'null', isNullable: true };
  }
  
  const uniqueTypes = new Set(nonNullTypes.map(t => t.type));
  
  if (uniqueTypes.size === 1) {
    const baseType = nonNullTypes[0];
    
    // If all are objects, merge their fields
    if (baseType.type === 'object') {
      const mergedFields: Record<string, InferredType> = {};
      const fieldOccurrences: Record<string, number> = {};
      
      for (const t of nonNullTypes) {
        if (t.objectFields) {
          for (const [fieldKey, fieldType] of Object.entries(t.objectFields)) {
            if (!mergedFields[fieldKey]) {
              mergedFields[fieldKey] = fieldType;
              fieldOccurrences[fieldKey] = 1;
            } else {
              // Merge field types
              mergedFields[fieldKey] = mergeTypes([mergedFields[fieldKey], fieldType]);
              fieldOccurrences[fieldKey]++;
            }
          }
        }
      }
      
      // Mark fields that don't appear in all objects as nullable
      const totalObjects = nonNullTypes.length;
      for (const [fieldKey, count] of Object.entries(fieldOccurrences)) {
        if (count < totalObjects) {
          mergedFields[fieldKey] = { ...mergedFields[fieldKey], isNullable: true };
        }
      }
      
      return {
        type: 'object',
        isNullable,
        objectFields: mergedFields
      };
    }
    
    return { ...baseType, isNullable };
  }
  
  // Handle int/float mixture
  if (uniqueTypes.has('int') && uniqueTypes.has('float') && uniqueTypes.size === 2) {
    return { type: 'float', isNullable };
  }
  
  // Mixed types
  return { type: 'mixed', isNullable };
}

/**
 * Analyze JSON and extract all class definitions
 */
export function analyzeStructure(
  json: JsonValue,
  rootName: string = 'Root'
): { rootClass: GeneratedClass; allClasses: GeneratedClass[] } {
  const allClasses: GeneratedClass[] = [];
  const usedNames = new Set<string>();
  
  function processValue(
    value: JsonValue,
    className: string,
    parentName?: string
  ): { fieldType: InferredType; generatedClass?: GeneratedClass } {
    const inferredType = inferType(value);
    
    if (inferredType.type === 'object' && isPlainObject(value)) {
      const uniqueClassName = generateClassName(className, parentName, usedNames);
      const generatedClass = processObject(value, uniqueClassName);
      allClasses.push(generatedClass);
      
      return {
        fieldType: { ...inferredType, originalKey: className },
        generatedClass
      };
    }
    
    if (inferredType.type === 'array' && Array.isArray(value)) {
      const elementType = inferredType.arrayElementType;
      
      if (elementType?.type === 'object' && value.length > 0) {
        // Find first non-null object in array
        const firstObject = value.find(v => isPlainObject(v)) as JsonObject | undefined;
        if (firstObject) {
          const singularName = singularize(className);
          const uniqueClassName = generateClassName(singularName, parentName, usedNames);
          
          // Merge all objects in array to get complete field set
          const mergedType = inferType(value) as InferredType;
          const mergedObjectType = mergedType.arrayElementType;
          
          if (mergedObjectType?.objectFields) {
            const fields: FieldInfo[] = Object.entries(mergedObjectType.objectFields).map(
              ([key, type]) => ({
                name: key,
                originalName: key,
                type,
                isRequired: !type.isNullable
              })
            );
            
            // Process nested objects in fields
            const processedFields: FieldInfo[] = [];
            const nestedClasses: GeneratedClass[] = [];
            
            for (const field of fields) {
              if (field.type.type === 'object') {
                const nestedValue = firstObject[field.originalName];
                if (isPlainObject(nestedValue)) {
                  const result = processValue(nestedValue, toPascalCase(field.name), uniqueClassName);
                  processedFields.push({
                    ...field,
                    type: { ...field.type, originalKey: field.originalName }
                  });
                  if (result.generatedClass) {
                    nestedClasses.push(result.generatedClass);
                  }
                } else {
                  processedFields.push(field);
                }
              } else if (field.type.type === 'array' && field.type.arrayElementType?.type === 'object') {
                const nestedArray = firstObject[field.originalName];
                if (Array.isArray(nestedArray) && nestedArray.length > 0) {
                  const firstNestedObj = nestedArray.find(v => isPlainObject(v));
                  if (firstNestedObj) {
                    processValue(nestedArray, toPascalCase(field.name), uniqueClassName);
                  }
                }
                processedFields.push(field);
              } else {
                processedFields.push(field);
              }
            }
            
            const generatedClass: GeneratedClass = {
              name: uniqueClassName,
              fields: processedFields,
              nestedClasses
            };
            allClasses.push(generatedClass);
            
            return {
              fieldType: {
                type: 'array',
                isNullable: false,
                arrayElementType: { type: 'object', isNullable: false, originalKey: singularName }
              }
            };
          }
        }
      }
    }
    
    return { fieldType: inferredType };
  }
  
  function processObject(obj: JsonObject, className: string): GeneratedClass {
    const fields: FieldInfo[] = [];
    const nestedClasses: GeneratedClass[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const fieldClassName = toPascalCase(key);
      const result = processValue(value, fieldClassName, className);
      
      fields.push({
        name: key,
        originalName: key,
        type: result.fieldType,
        isRequired: !result.fieldType.isNullable
      });
      
      if (result.generatedClass) {
        nestedClasses.push(result.generatedClass);
      }
    }
    
    return {
      name: className,
      fields,
      nestedClasses
    };
  }
  
  // Handle root value
  if (isPlainObject(json)) {
    usedNames.add(rootName);
    const rootClass = processObject(json, rootName);
    allClasses.unshift(rootClass);
    return { rootClass, allClasses };
  }
  
  if (Array.isArray(json) && json.length > 0) {
    const firstObject = json.find(v => isPlainObject(v)) as JsonObject | undefined;
    if (firstObject) {
      usedNames.add(rootName);
      processValue(json, rootName);
      const rootClass = allClasses[allClasses.length - 1] || {
        name: rootName,
        fields: [],
        nestedClasses: []
      };
      return { rootClass, allClasses };
    }
  }
  
  // Fallback for non-object/array root
  const rootClass: GeneratedClass = {
    name: rootName,
    fields: [{
      name: 'value',
      originalName: 'value',
      type: inferType(json),
      isRequired: true
    }],
    nestedClasses: []
  };
  allClasses.push(rootClass);
  
  return { rootClass, allClasses };
}

/**
 * Validate JSON string and return parsed value
 */
export function parseAndValidateJSON(jsonString: string): {
  success: boolean;
  value?: JsonValue;
  error?: { message: string; line?: number; column?: number };
} {
  if (!jsonString.trim()) {
    return { success: true, value: {} };
  }
  
  try {
    const value = JSON.parse(jsonString) as JsonValue;
    return { success: true, value };
  } catch (e) {
    const error = e as SyntaxError;
    const match = error.message.match(/position (\d+)/);
    let line = 1;
    let column = 1;
    
    if (match) {
      const position = parseInt(match[1], 10);
      const lines = jsonString.substring(0, position).split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }
    
    return {
      success: false,
      error: {
        message: error.message,
        line,
        column
      }
    };
  }
}
