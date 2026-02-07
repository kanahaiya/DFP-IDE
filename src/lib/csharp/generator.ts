/**
 * JSON to C# converter generator
 */

import type { CSharpGeneratorSettings, CSharpGenerationResult } from './types';
import { DEFAULT_CSHARP_SETTINGS } from './types';
import { toPascalCase, toCamelCase, toSnakeCase } from '../code-gen/nameUtils';

interface CSharpClass {
  name: string;
  properties: CSharpProperty[];
}

interface CSharpProperty {
  name: string;
  originalName: string;
  type: string;
  isNullable: boolean;
  isArray: boolean;
}

function getCSharpType(value: unknown, settings: CSharpGeneratorSettings): string {
  if (value === null) {
    return settings.useNullableTypes ? 'object?' : 'object';
  }
  
  const type = typeof value;
  
  switch (type) {
    case 'string':
      return settings.useNullableTypes ? 'string?' : 'string';
    case 'number':
      if (Number.isInteger(value)) {
        return settings.useNullableTypes ? 'int?' : 'int';
      }
      return settings.useNullableTypes ? 'double?' : 'double';
    case 'boolean':
      return settings.useNullableTypes ? 'bool?' : 'bool';
    case 'object':
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return settings.arrayAsIList ? 'IList<object>' : 'List<object>';
        }
        const elementType = getCSharpType(value[0], { ...settings, useNullableTypes: false });
        return settings.arrayAsIList ? `IList<${elementType}>` : `List<${elementType}>`;
      }
      return 'object';
    default:
      return 'object';
  }
}

function convertPropertyName(name: string, settings: CSharpGeneratorSettings): string {
  switch (settings.propertyNaming) {
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

function convertClassName(name: string): string {
  return toPascalCase(name);
}

function generateJsonAttribute(
  originalName: string,
  propertyName: string,
  settings: CSharpGeneratorSettings
): string {
  if (!settings.addJsonPropertyAttributes) return '';
  if (!settings.preserveOriginalNames && originalName === propertyName) return '';
  
  if (settings.serializerLibrary === 'newtonsoft') {
    return `[JsonProperty("${originalName}")]`;
  } else if (settings.serializerLibrary === 'system.text.json') {
    return `[JsonPropertyName("${originalName}")]`;
  }
  
  return '';
}

function analyzeObject(
  obj: Record<string, unknown>,
  className: string,
  settings: CSharpGeneratorSettings,
  classes: CSharpClass[]
): CSharpClass {
  const properties: CSharpProperty[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const propertyName = convertPropertyName(key, settings);
    let propertyType: string;
    let isArray = false;
    
    if (value === null) {
      propertyType = settings.useNullableTypes ? 'object?' : 'object';
    } else if (Array.isArray(value)) {
      isArray = true;
      if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null && !Array.isArray(value[0])) {
        const nestedClassName = convertClassName(key);
        analyzeObject(value[0] as Record<string, unknown>, nestedClassName, settings, classes);
        propertyType = settings.arrayAsIList ? `IList<${nestedClassName}>` : `List<${nestedClassName}>`;
      } else {
        propertyType = getCSharpType(value, settings);
      }
    } else if (typeof value === 'object') {
      const nestedClassName = convertClassName(key);
      analyzeObject(value as Record<string, unknown>, nestedClassName, settings, classes);
      propertyType = settings.useNullableTypes ? `${nestedClassName}?` : nestedClassName;
    } else {
      propertyType = getCSharpType(value, settings);
    }
    
    properties.push({
      name: propertyName,
      originalName: key,
      type: propertyType,
      isNullable: value === null || settings.useNullableTypes,
      isArray,
    });
  }
  
  const csharpClass: CSharpClass = { name: className, properties };
  classes.push(csharpClass);
  return csharpClass;
}

function generateProperty(
  property: CSharpProperty,
  settings: CSharpGeneratorSettings,
  indent: string
): string {
  const lines: string[] = [];
  
  // JSON attribute
  const attribute = generateJsonAttribute(property.originalName, property.name, settings);
  if (attribute) {
    lines.push(`${indent}${attribute}`);
  }
  
  // Property declaration
  const requiredModifier = settings.useRequiredModifier ? 'required ' : '';
  
  if (settings.useInitOnlySetters) {
    lines.push(`${indent}public ${requiredModifier}${property.type} ${property.name} { get; init; }`);
  } else {
    lines.push(`${indent}public ${requiredModifier}${property.type} ${property.name} { get; set; }`);
  }
  
  return lines.join('\n');
}

function generateRecord(
  csharpClass: CSharpClass,
  settings: CSharpGeneratorSettings
): string {
  const lines: string[] = [];
  const indent = settings.useSpaces ? ' '.repeat(settings.indentSize) : '\t';
  
  // Record with primary constructor
  const sealedModifier = settings.sealClasses ? 'sealed ' : '';
  const partialModifier = settings.generatePartialClasses ? 'partial ' : '';
  
  if (settings.usePrimaryConstructor) {
    const params = csharpClass.properties.map(p => {
      const attr = generateJsonAttribute(p.originalName, p.name, settings);
      return attr ? `${attr} ${p.type} ${p.name}` : `${p.type} ${p.name}`;
    }).join(', ');
    
    lines.push(`public ${sealedModifier}${partialModifier}record ${csharpClass.name}(${params});`);
  } else {
    lines.push(`public ${sealedModifier}${partialModifier}record ${csharpClass.name}`);
    lines.push('{');
    
    for (const property of csharpClass.properties) {
      lines.push(generateProperty(property, settings, indent));
    }
    
    lines.push('}');
  }
  
  return lines.join('\n');
}

function generateClass(
  csharpClass: CSharpClass,
  settings: CSharpGeneratorSettings
): string {
  if (settings.useRecords) {
    return generateRecord(csharpClass, settings);
  }
  
  const lines: string[] = [];
  const indent = settings.useSpaces ? ' '.repeat(settings.indentSize) : '\t';
  
  // Class declaration
  const sealedModifier = settings.sealClasses ? 'sealed ' : '';
  const partialModifier = settings.generatePartialClasses ? 'partial ' : '';
  
  lines.push(`public ${sealedModifier}${partialModifier}class ${csharpClass.name}`);
  lines.push('{');
  
  for (let i = 0; i < csharpClass.properties.length; i++) {
    if (i > 0) lines.push('');
    lines.push(generateProperty(csharpClass.properties[i], settings, indent));
  }
  
  lines.push('}');
  
  return lines.join('\n');
}

export function convertJSONToCSharp(
  jsonInput: string,
  userSettings?: Partial<CSharpGeneratorSettings>
): CSharpGenerationResult {
  const settings: CSharpGeneratorSettings = { ...DEFAULT_CSHARP_SETTINGS, ...userSettings };
  
  try {
    const parsed = JSON.parse(jsonInput);
    
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {
        success: false,
        errors: [{ message: 'Input must be a JSON object' }],
      };
    }
    
    const classes: CSharpClass[] = [];
    analyzeObject(parsed, settings.rootClassName, settings, classes);
    
    // Reverse to have root class first
    classes.reverse();
    
    const output: string[] = [];
    
    // Using directives
    const usings: string[] = [];
    usings.push('using System;');
    usings.push('using System.Collections.Generic;');
    
    if (settings.serializerLibrary === 'newtonsoft') {
      usings.push('using Newtonsoft.Json;');
    } else if (settings.serializerLibrary === 'system.text.json') {
      usings.push('using System.Text.Json.Serialization;');
    }
    
    if (settings.useImmutableCollections) {
      usings.push('using System.Collections.Immutable;');
    }
    
    output.push(...usings);
    output.push('');
    
    // Namespace
    if (settings.fileScopedNamespace) {
      output.push(`namespace ${settings.namespace};`);
      output.push('');
      
      // Generate classes
      for (const cls of classes) {
        output.push(generateClass(cls, settings));
        output.push('');
      }
    } else {
      output.push(`namespace ${settings.namespace}`);
      output.push('{');
      
      const indent = settings.useSpaces ? ' '.repeat(settings.indentSize) : '\t';
      
      // Generate classes
      for (const cls of classes) {
        const classCode = generateClass(cls, settings);
        const indentedCode = classCode.split('\n').map(line => indent + line).join('\n');
        output.push(indentedCode);
        output.push('');
      }
      
      output.push('}');
    }
    
    return {
      success: true,
      code: output.join('\n'),
      classCount: classes.length,
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
