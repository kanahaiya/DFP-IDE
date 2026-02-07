/**
 * JSON to Kotlin Generator
 */

import type {
  KotlinGeneratorSettings,
  KotlinGenerationResult,
  KotlinClassDefinition,
  KotlinProperty,
} from './types';
import { DEFAULT_KOTLIN_SETTINGS } from './types';

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
 * Convert class name based on convention
 */
function convertClassName(name: string, convention: string): string {
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
 * Infer Kotlin type from JSON value
 */
function inferKotlinType(value: unknown, settings: KotlinGeneratorSettings): string {
  if (value === null) {
    return 'Any?';
  }

  if (typeof value === 'string') {
    return 'String';
  }

  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'Int' : 'Double';
  }

  if (typeof value === 'boolean') {
    return 'Boolean';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'List<Any>';
    }
    const elementType = inferKotlinType(value[0], settings);
    return `List<${elementType}>`;
  }

  return 'Any';
}

/**
 * Get default value for a type
 */
function getDefaultValue(type: string, isNullable: boolean): string | undefined {
  if (isNullable) {
    return 'null';
  }
  
  switch (type) {
    case 'String':
      return '""';
    case 'Int':
    case 'Long':
      return '0';
    case 'Double':
    case 'Float':
      return '0.0';
    case 'Boolean':
      return 'false';
    default:
      if (type.startsWith('List<')) {
        return 'emptyList()';
      }
      return undefined;
  }
}

/**
 * Analyze object and create class definition
 */
function analyzeObject(
  obj: Record<string, unknown>,
  className: string,
  settings: KotlinGeneratorSettings,
  classDefinitions: Map<string, KotlinClassDefinition>
): string {
  const properties: KotlinProperty[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const propertyName = convertPropertyName(key, settings.propertyNaming);
    let propertyType: string;
    const isNullable = value === null || settings.makePropertiesNullable;

    if (value === null) {
      propertyType = 'Any';
    } else if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        // Array of objects - create nested class
        const nestedClassName = convertClassName(key, settings.classNaming);
        analyzeObject(
          value[0] as Record<string, unknown>,
          nestedClassName,
          settings,
          classDefinitions
        );
        propertyType = `List<${nestedClassName}>`;
      } else {
        propertyType = inferKotlinType(value, settings);
      }
    } else if (typeof value === 'object' && value !== null) {
      // Nested object - create nested class
      const nestedClassName = convertClassName(key, settings.classNaming);
      analyzeObject(
        value as Record<string, unknown>,
        nestedClassName,
        settings,
        classDefinitions
      );
      propertyType = nestedClassName;
    } else {
      propertyType = inferKotlinType(value, settings);
    }

    const property: KotlinProperty = {
      name: propertyName,
      originalName: key,
      type: propertyType,
      isNullable,
    };

    if (settings.addSerialNames && propertyName !== key) {
      property.serialName = key;
    }

    if (settings.addDefaultValues) {
      property.defaultValue = getDefaultValue(propertyType, isNullable);
    }

    properties.push(property);
  }

  const classDefinition: KotlinClassDefinition = {
    name: className,
    properties,
    isDataClass: settings.useDataClass,
  };

  if (settings.addKDoc) {
    classDefinition.kDoc = `Represents the ${className} data structure`;
  }

  classDefinitions.set(className, classDefinition);

  return className;
}

/**
 * Generate Kotlin code from class definitions
 */
function generateCode(
  classDefinitions: Map<string, KotlinClassDefinition>,
  settings: KotlinGeneratorSettings
): string {
  const indent = settings.useSpaces ? ' '.repeat(settings.indentSize) : '\t';
  const lines: string[] = [];

  // Package declaration
  if (settings.packageName) {
    lines.push(`package ${settings.packageName}`);
    lines.push('');
  }

  // Imports
  if (settings.addImports) {
    const imports: string[] = [];

    if (settings.serializationLibrary === 'kotlinx') {
      imports.push('import kotlinx.serialization.Serializable');
      if (settings.addSerialNames) {
        imports.push('import kotlinx.serialization.SerialName');
      }
    } else if (settings.serializationLibrary === 'gson') {
      imports.push('import com.google.gson.annotations.SerializedName');
    } else if (settings.serializationLibrary === 'moshi') {
      imports.push('import com.squareup.moshi.Json');
      imports.push('import com.squareup.moshi.JsonClass');
    } else if (settings.serializationLibrary === 'jackson') {
      imports.push('import com.fasterxml.jackson.annotation.JsonProperty');
    }

    if (settings.generateParcelize) {
      imports.push('import android.os.Parcelable');
      imports.push('import kotlinx.parcelize.Parcelize');
    }

    if (imports.length > 0) {
      lines.push(imports.join('\n'));
      lines.push('');
    }
  }

  // Sort class definitions so root class comes last
  const sortedDefs = Array.from(classDefinitions.entries()).sort((a, b) => {
    if (a[0] === settings.rootClassName) return 1;
    if (b[0] === settings.rootClassName) return -1;
    return a[0].localeCompare(b[0]);
  });

  for (const [, classDef] of sortedDefs) {
    // KDoc
    if (settings.addKDoc && classDef.kDoc) {
      lines.push('/**');
      lines.push(` * ${classDef.kDoc}`);
      lines.push(' */');
    }

    // Annotations
    if (settings.serializationLibrary === 'kotlinx') {
      lines.push('@Serializable');
    } else if (settings.serializationLibrary === 'moshi') {
      lines.push('@JsonClass(generateAdapter = true)');
    }

    if (settings.generateParcelize) {
      lines.push('@Parcelize');
    }

    // Class declaration
    const keyword = classDef.isDataClass ? 'data class' : 'class';
    const parcelable = settings.generateParcelize ? ' : Parcelable' : '';
    
    if (classDef.properties.length === 0) {
      lines.push(`${keyword} ${classDef.name}()${parcelable}`);
    } else {
      lines.push(`${keyword} ${classDef.name}(`);

      // Properties
      const propertyLines: string[] = [];
      for (const prop of classDef.properties) {
        const parts: string[] = [];

        // Property annotation
        if (prop.serialName) {
          if (settings.serializationLibrary === 'kotlinx') {
            parts.push(`${indent}@SerialName("${prop.serialName}")`);
          } else if (settings.serializationLibrary === 'gson') {
            parts.push(`${indent}@SerializedName("${prop.serialName}")`);
          } else if (settings.serializationLibrary === 'moshi') {
            parts.push(`${indent}@Json(name = "${prop.serialName}")`);
          } else if (settings.serializationLibrary === 'jackson') {
            parts.push(`${indent}@JsonProperty("${prop.serialName}")`);
          }
        }

        const valOrVar = settings.useValProperties ? 'val' : 'var';
        const nullableSuffix = prop.isNullable ? '?' : '';
        const defaultValue = prop.defaultValue ? ` = ${prop.defaultValue}` : '';

        parts.push(`${indent}${valOrVar} ${prop.name}: ${prop.type}${nullableSuffix}${defaultValue}`);
        propertyLines.push(parts.join('\n'));
      }

      lines.push(propertyLines.join(',\n'));
      lines.push(`)${parcelable}`);
    }

    // Companion object
    if (settings.generateCompanionObject) {
      lines.push(' {');
      lines.push(`${indent}companion object {`);
      lines.push(`${indent}${indent}// Add companion object methods here`);
      lines.push(`${indent}}`);
      lines.push('}');
    }

    lines.push('');
  }

  return lines.join('\n').trim();
}

/**
 * Convert JSON to Kotlin
 */
export function convertJSONToKotlin(
  jsonString: string,
  settings: KotlinGeneratorSettings = DEFAULT_KOTLIN_SETTINGS
): KotlinGenerationResult {
  try {
    const json = JSON.parse(jsonString);

    if (typeof json !== 'object' || json === null) {
      return {
        success: false,
        errors: [{ message: 'Input JSON must be an object or array of objects', type: 'syntax' }],
      };
    }

    const classDefinitions = new Map<string, KotlinClassDefinition>();

    if (Array.isArray(json)) {
      if (json.length === 0) {
        return {
          success: false,
          errors: [{ message: 'Input JSON array is empty', type: 'syntax' }],
        };
      }

      // Analyze first element for array of objects
      if (typeof json[0] === 'object' && json[0] !== null) {
        analyzeObject(
          json[0] as Record<string, unknown>,
          convertClassName(settings.rootClassName, settings.classNaming),
          settings,
          classDefinitions
        );
      } else {
        return {
          success: false,
          errors: [{ message: 'Array must contain objects', type: 'syntax' }],
        };
      }
    } else {
      analyzeObject(
        json as Record<string, unknown>,
        convertClassName(settings.rootClassName, settings.classNaming),
        settings,
        classDefinitions
      );
    }

    const code = generateCode(classDefinitions, settings);

    return {
      success: true,
      code,
      classes: Array.from(classDefinitions.values()),
      classCount: classDefinitions.size,
    };
  } catch (error) {
    return {
      success: false,
      errors: [
        {
          message: error instanceof Error ? error.message : 'Unknown error during conversion',
          type: 'syntax',
        },
      ],
    };
  }
}
