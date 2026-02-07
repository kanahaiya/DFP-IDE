/**
 * JSON to Crystal code generator
 */

import type { CrystalGeneratorSettings, CrystalGenerationResult } from './types';
import { DEFAULT_CRYSTAL_SETTINGS } from './types';
import { toPascalCase, toSnakeCase } from '../code-gen/nameUtils';

interface ClassDefinition {
  name: string;
  properties: PropertyDefinition[];
}

interface PropertyDefinition {
  name: string;
  originalName: string;
  type: string;
  isNilable: boolean;
  isArray: boolean;
  isObject: boolean;
  nestedClassName?: string;
}

function inferCrystalType(value: unknown, settings: CrystalGeneratorSettings): string {
  if (value === null) {
    return 'Nil';
  }
  
  if (typeof value === 'string') {
    return 'String';
  }
  
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'Int64' : 'Float64';
  }
  
  if (typeof value === 'boolean') {
    return 'Bool';
  }
  
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'Array(JSON::Any)';
    }
    const elementType = inferCrystalType(value[0], settings);
    return `Array(${elementType})`;
  }
  
  return 'JSON::Any';
}

function convertPropertyName(name: string, settings: CrystalGeneratorSettings): string {
  switch (settings.propertyNaming) {
    case 'camelCase':
      return name.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    case 'PascalCase':
      return toPascalCase(name);
    case 'preserve':
      return name;
    case 'snake_case':
    default:
      return toSnakeCase(name);
  }
}

function convertClassName(name: string): string {
  return toPascalCase(name);
}

function analyzeObject(
  obj: Record<string, unknown>,
  className: string,
  settings: CrystalGeneratorSettings,
  classes: Map<string, ClassDefinition>
): ClassDefinition {
  const properties: PropertyDefinition[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const propertyName = convertPropertyName(key, settings);
    let type = inferCrystalType(value, settings);
    const isNilable = value === null || settings.useNilableTypes;
    const isArray = Array.isArray(value);
    let isObject = false;
    let nestedClassName: string | undefined;
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      isObject = true;
      nestedClassName = convertClassName(key);
      type = nestedClassName;
      
      // Recursively analyze nested object
      const nestedClass = analyzeObject(
        value as Record<string, unknown>,
        nestedClassName,
        settings,
        classes
      );
      classes.set(nestedClassName, nestedClass);
    } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
      isObject = true;
      nestedClassName = convertClassName(key);
      type = `Array(${nestedClassName})`;
      
      // Recursively analyze first array element as template
      const nestedClass = analyzeObject(
        value[0] as Record<string, unknown>,
        nestedClassName,
        settings,
        classes
      );
      classes.set(nestedClassName, nestedClass);
    }
    
    properties.push({
      name: propertyName,
      originalName: key,
      type,
      isNilable,
      isArray,
      isObject,
      nestedClassName,
    });
  }
  
  return { name: className, properties };
}

function generateClassCode(classDef: ClassDefinition, settings: CrystalGeneratorSettings): string {
  const indent = settings.useSpaces ? ' '.repeat(settings.indentSize) : '\t';
  const lines: string[] = [];
  
  // Class/Struct declaration
  const keyword = settings.outputType === 'struct' ? 'struct' : 'class';
  lines.push(`${keyword} ${classDef.name}`);
  
  // Include JSON::Serializable if enabled
  if (settings.useJsonSerializable) {
    lines.push(`${indent}include JSON::Serializable`);
    lines.push('');
  }
  
  // Properties
  for (const prop of classDef.properties) {
    const nilSuffix = prop.isNilable ? '?' : '';
    const typeStr = `${prop.type}${nilSuffix}`;
    
    if (settings.useJsonSerializable && settings.includeJsonKey && prop.name !== prop.originalName) {
      lines.push(`${indent}@[JSON::Field(key: "${prop.originalName}")]`);
    }
    
    lines.push(`${indent}property ${prop.name} : ${typeStr}`);
  }
  
  // Initializer
  if (settings.generateInitializer && !settings.useJsonSerializable) {
    lines.push('');
    const params = classDef.properties
      .map(p => `@${p.name} : ${p.type}${p.isNilable ? '?' : ''}`)
      .join(', ');
    lines.push(`${indent}def initialize(${params})`);
    lines.push(`${indent}end`);
  }
  
  lines.push('end');
  
  return lines.join('\n');
}

export function convertJSONToCrystal(
  jsonString: string,
  settings: Partial<CrystalGeneratorSettings> = {}
): CrystalGenerationResult {
  const mergedSettings: CrystalGeneratorSettings = { ...DEFAULT_CRYSTAL_SETTINGS, ...settings };
  
  try {
    const parsed = JSON.parse(jsonString);
    
    if (typeof parsed !== 'object' || parsed === null) {
      return {
        success: false,
        errors: [{ message: 'Input must be a JSON object or array of objects' }],
      };
    }
    
    const classes = new Map<string, ClassDefinition>();
    let rootData = parsed;
    
    // Handle array of objects
    if (Array.isArray(parsed)) {
      if (parsed.length === 0 || typeof parsed[0] !== 'object') {
        return {
          success: false,
          errors: [{ message: 'Array must contain objects' }],
        };
      }
      rootData = parsed[0];
    }
    
    // Analyze and collect all classes
    const rootClass = analyzeObject(
      rootData as Record<string, unknown>,
      mergedSettings.rootClassName,
      mergedSettings,
      classes
    );
    classes.set(mergedSettings.rootClassName, rootClass);
    
    // Generate code for all classes
    const codeBlocks: string[] = [];
    
    // Add require statement if using JSON::Serializable
    if (mergedSettings.useJsonSerializable) {
      codeBlocks.push('require "json"');
      codeBlocks.push('');
    }
    
    // Generate nested classes first, then root class
    const sortedClasses = Array.from(classes.values()).reverse();
    for (const classDef of sortedClasses) {
      codeBlocks.push(generateClassCode(classDef, mergedSettings));
      codeBlocks.push('');
    }
    
    return {
      success: true,
      code: codeBlocks.join('\n').trim(),
      classCount: classes.size,
    };
  } catch (error) {
    return {
      success: false,
      errors: [{
        message: error instanceof Error ? error.message : 'Failed to parse JSON',
      }],
    };
  }
}
