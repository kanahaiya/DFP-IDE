/**
 * JSON to TypeScript Generator
 */

import type {
  TypeScriptGeneratorSettings,
  TypeScriptGenerationResult,
  TypeScriptTypeDefinition,
  TypeScriptProperty,
} from './types';
import { DEFAULT_TYPESCRIPT_SETTINGS } from './types';
import type { ValidationError } from '../code-gen/types';

/**
 * Convert string to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^./, (c) => c.toUpperCase());
}

/**
 * Convert string to camelCase
 */
function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Convert string to snake_case
 */
function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/[-\s]+/g, '_')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * Convert property name based on naming convention
 */
function convertPropertyName(name: string, convention: string): string {
  switch (convention) {
    case 'camelCase':
      return toCamelCase(name);
    case 'PascalCase':
      return toPascalCase(name);
    case 'snake_case':
      return toSnakeCase(name);
    case 'preserve':
    default:
      return name;
  }
}

/**
 * Convert type name based on convention
 */
function convertTypeName(name: string, convention: string): string {
  switch (convention) {
    case 'PascalCase':
      return toPascalCase(name);
    case 'camelCase':
      return toCamelCase(name);
    case 'snake_case':
      return toSnakeCase(name);
    default:
      return toPascalCase(name);
  }
}

/**
 * Infer TypeScript type from JSON value
 */
function inferType(
  value: unknown,
  settings: TypeScriptGeneratorSettings
): string {
  if (value === null) {
    return 'null';
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (typeof value === 'string') {
    return 'string';
  }

  if (typeof value === 'number') {
    return 'number';
  }

  if (typeof value === 'boolean') {
    return 'boolean';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      const anyType = settings.useUnknownInsteadOfAny ? 'unknown' : 'any';
      return settings.arrayNotation === 'brackets' ? `${anyType}[]` : `Array<${anyType}>`;
    }

    // Get unique types from array elements
    const elementTypes = new Set<string>();
    for (const item of value) {
      elementTypes.add(inferType(item, settings));
    }

    const types = Array.from(elementTypes);
    let elementType: string;

    if (types.length === 1) {
      elementType = types[0];
    } else {
      // Union type for mixed arrays
      elementType = `(${types.join(' | ')})`;
    }

    return settings.arrayNotation === 'brackets' ? `${elementType}[]` : `Array<${elementType}>`;
  }

  if (typeof value === 'object') {
    return 'object'; // Will be replaced with actual type name
  }

  return settings.useUnknownInsteadOfAny ? 'unknown' : 'any';
}

/**
 * Check if a value is nullable in the JSON
 */
function isNullableValue(value: unknown): boolean {
  return value === null || value === undefined;
}

/**
 * Analyze object and create type definition
 */
function analyzeObject(
  obj: Record<string, unknown>,
  typeName: string,
  settings: TypeScriptGeneratorSettings,
  typeDefinitions: Map<string, TypeScriptTypeDefinition>
): string {
  const properties: TypeScriptProperty[] = [];

  const entries = Object.entries(obj);
  const sortedEntries = settings.sortProperties
    ? entries.sort((a, b) => a[0].localeCompare(b[0]))
    : entries;

  for (const [key, value] of sortedEntries) {
    const propertyName = convertPropertyName(key, settings.propertyNaming);
    let propertyType: string;

    if (value === null) {
      propertyType = 'null';
    } else if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        // Array of objects - create nested type
        const nestedTypeName = convertTypeName(key, settings.typeNaming);
        analyzeObject(
          value[0] as Record<string, unknown>,
          nestedTypeName,
          settings,
          typeDefinitions
        );
        propertyType = settings.arrayNotation === 'brackets'
          ? `${nestedTypeName}[]`
          : `Array<${nestedTypeName}>`;
      } else {
        propertyType = inferType(value, settings);
      }
    } else if (typeof value === 'object' && value !== null) {
      // Nested object - create nested type
      const nestedTypeName = convertTypeName(key, settings.typeNaming);
      analyzeObject(
        value as Record<string, unknown>,
        nestedTypeName,
        settings,
        typeDefinitions
      );
      propertyType = nestedTypeName;
    } else {
      propertyType = inferType(value, settings);
    }

    // Handle nullable types based on settings
    if (isNullableValue(value) && settings.nullHandling !== 'nullable') {
      if (settings.nullHandling === 'optional') {
        // Will be marked as optional
      } else if (settings.nullHandling === 'undefined') {
        propertyType = propertyType === 'null' ? 'undefined' : `${propertyType} | undefined`;
      } else if (settings.nullHandling === 'null-or-undefined') {
        propertyType = `${propertyType} | null | undefined`;
      }
    }

    const isOptional = settings.markAllOptional || (settings.useOptionalProperties && isNullableValue(value));

    const property: TypeScriptProperty = {
      name: propertyName,
      originalName: key,
      type: propertyType,
      isOptional,
      isReadonly: settings.useReadonly,
    };

    if (settings.generateJSDoc) {
      property.jsDoc = `The ${key} property`;
    }

    if (settings.includeExamples && value !== null && value !== undefined) {
      property.example = JSON.stringify(value);
    }

    properties.push(property);
  }

  const typeDefinition: TypeScriptTypeDefinition = {
    name: typeName,
    properties,
    isExported: settings.exportTypes,
  };

  if (settings.generateJSDoc) {
    typeDefinition.jsDoc = `Represents the ${typeName} type`;
  }

  typeDefinitions.set(typeName, typeDefinition);

  return typeName;
}

/**
 * Generate TypeScript code from type definitions
 */
function generateCode(
  typeDefinitions: Map<string, TypeScriptTypeDefinition>,
  settings: TypeScriptGeneratorSettings
): string {
  const indent = settings.useSpaces ? ' '.repeat(settings.indentSize) : '\t';
  const lines: string[] = [];

  // Sort type definitions so root type comes last
  const sortedDefs = Array.from(typeDefinitions.entries()).sort((a, b) => {
    if (a[0] === settings.rootTypeName) return 1;
    if (b[0] === settings.rootTypeName) return -1;
    return a[0].localeCompare(b[0]);
  });

  for (const [, typeDef] of sortedDefs) {
    // Add JSDoc if enabled
    if (settings.generateJSDoc && typeDef.jsDoc) {
      lines.push('/**');
      lines.push(` * ${typeDef.jsDoc}`);
      lines.push(' */');
    }

    // Determine keyword
    const keyword = settings.useTypeKeyword ? 'type' : 'interface';
    const exportKeyword = typeDef.isExported ? 'export ' : '';
    const equals = settings.useTypeKeyword ? ' = ' : ' ';
    const openBrace = settings.useTypeKeyword ? '{' : '{';

    lines.push(`${exportKeyword}${keyword} ${typeDef.name}${equals}${openBrace}`);

    // Generate properties
    for (const prop of typeDef.properties) {
      // Property JSDoc
      if (settings.generateJSDoc && prop.jsDoc) {
        lines.push(`${indent}/**`);
        lines.push(`${indent} * ${prop.jsDoc}`);
        if (settings.includeExamples && prop.example) {
          lines.push(`${indent} * @example ${prop.example}`);
        }
        lines.push(`${indent} */`);
      }

      const readonlyPrefix = prop.isReadonly ? 'readonly ' : '';
      const optionalSuffix = prop.isOptional ? '?' : '';
      const comma = settings.addTrailingComma ? ';' : '';

      // Handle property name that needs quoting
      const needsQuotes = /[^a-zA-Z0-9_$]/.test(prop.name) || /^\d/.test(prop.name);
      const propName = needsQuotes ? `"${prop.originalName}"` : prop.name;

      lines.push(`${indent}${readonlyPrefix}${propName}${optionalSuffix}: ${prop.type}${comma}`);
    }

    // Add index signature if enabled
    if (settings.addIndexSignature) {
      const indexType = settings.useUnknownInsteadOfAny ? 'unknown' : 'any';
      lines.push(`${indent}[key: string]: ${indexType};`);
    }

    lines.push('}');
    lines.push('');
  }

  return lines.join('\n').trim();
}

/**
 * Convert JSON to TypeScript
 */
export function convertJSONToTypeScript(
  jsonString: string,
  settings: TypeScriptGeneratorSettings = DEFAULT_TYPESCRIPT_SETTINGS
): TypeScriptGenerationResult {
  try {
    const json = JSON.parse(jsonString);

    if (typeof json !== 'object' || json === null) {
      // Handle primitive types
      const primitiveType = inferType(json, settings);
      const exportKeyword = settings.exportTypes ? 'export ' : '';
      const keyword = settings.useTypeKeyword ? 'type' : 'type';
      const code = `${exportKeyword}${keyword} ${settings.rootTypeName} = ${primitiveType};`;

      return {
        success: true,
        code,
        typeCount: 1,
      };
    }

    const typeDefinitions = new Map<string, TypeScriptTypeDefinition>();

    if (Array.isArray(json)) {
      if (json.length === 0) {
        const anyType = settings.useUnknownInsteadOfAny ? 'unknown' : 'any';
        const exportKeyword = settings.exportTypes ? 'export ' : '';
        const code = `${exportKeyword}type ${settings.rootTypeName} = ${anyType}[];`;

        return {
          success: true,
          code,
          typeCount: 1,
        };
      }

      // Analyze first element for array of objects
      if (typeof json[0] === 'object' && json[0] !== null) {
        const elementTypeName = settings.rootTypeName.replace(/s$/, '') || 'Item';
        analyzeObject(
          json[0] as Record<string, unknown>,
          elementTypeName,
          settings,
          typeDefinitions
        );

        // Add root type as array
        const arrayType = settings.arrayNotation === 'brackets'
          ? `${elementTypeName}[]`
          : `Array<${elementTypeName}>`;

        const exportKeyword = settings.exportTypes ? 'export ' : '';
        const code = generateCode(typeDefinitions, settings);
        const rootTypeCode = `${exportKeyword}type ${settings.rootTypeName} = ${arrayType};`;

        return {
          success: true,
          code: code + '\n\n' + rootTypeCode,
          interfaces: Array.from(typeDefinitions.values()),
          typeCount: typeDefinitions.size + 1,
        };
      } else {
        // Array of primitives
        const elementType = inferType(json[0], settings);
        const arrayType = settings.arrayNotation === 'brackets'
          ? `${elementType}[]`
          : `Array<${elementType}>`;

        const exportKeyword = settings.exportTypes ? 'export ' : '';
        const code = `${exportKeyword}type ${settings.rootTypeName} = ${arrayType};`;

        return {
          success: true,
          code,
          typeCount: 1,
        };
      }
    }

    // Object
    analyzeObject(
      json as Record<string, unknown>,
      convertTypeName(settings.rootTypeName, settings.typeNaming),
      settings,
      typeDefinitions
    );

    const code = generateCode(typeDefinitions, settings);

    return {
      success: true,
      code,
      interfaces: Array.from(typeDefinitions.values()),
      typeCount: typeDefinitions.size,
    };
  } catch (error) {
    const errors: ValidationError[] = [
      {
        message: error instanceof Error ? error.message : 'Unknown error during conversion',
        type: 'syntax',
      },
    ];

    return {
      success: false,
      errors,
    };
  }
}
