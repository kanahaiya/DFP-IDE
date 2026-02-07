/**
 * Swift code generator from JSON
 */

import type { SwiftGeneratorSettings, SwiftConversionResult } from './types';
import type { InferredType, GeneratedClass, FieldInfo } from '../code-gen/types';
import { parseAndValidateJSON, analyzeStructure } from '../code-gen/typeInference';
import { toPascalCase, toCamelCase, sanitizeIdentifier } from '../code-gen/nameUtils';

/**
 * Convert JSON to Swift code
 */
export function convertJSONToSwift(
  jsonString: string,
  settings: SwiftGeneratorSettings
): SwiftConversionResult {
  const parseResult = parseAndValidateJSON(jsonString);
  
  if (!parseResult.success) {
    return {
      success: false,
      errors: [{
        message: parseResult.error?.message || 'Invalid JSON',
        line: parseResult.error?.line,
        column: parseResult.error?.column,
        type: 'syntax'
      }]
    };
  }
  
  if (!parseResult.value || (typeof parseResult.value === 'object' && Object.keys(parseResult.value).length === 0)) {
    return { success: true, code: '', typeCount: 0 };
  }
  
  try {
    const { allClasses } = analyzeStructure(
      parseResult.value,
      toPascalCase(settings.rootClassName)
    );
    
    const code = generateSwiftCode(allClasses, settings);
    
    return {
      success: true,
      code,
      typeCount: allClasses.length
    };
  } catch (error) {
    return {
      success: false,
      errors: [{
        message: error instanceof Error ? error.message : 'Conversion failed',
        type: 'type'
      }]
    };
  }
}

/**
 * Generate Swift code from analyzed classes
 */
function generateSwiftCode(
  classes: GeneratedClass[],
  settings: SwiftGeneratorSettings
): string {
  const indent = settings.indentation === 'tab' ? '\t' : ' '.repeat(settings.indentation as number);
  const lines: string[] = [];
  
  // Add import if needed
  if (settings.codableOption !== 'none') {
    lines.push('import Foundation');
    lines.push('');
  }
  
  // Generate each type
  for (const cls of classes) {
    const typeCode = generateSwiftType(cls, classes, settings, indent);
    lines.push(typeCode);
    lines.push('');
  }
  
  return lines.join('\n').trim();
}

/**
 * Generate a single Swift type (struct/class)
 */
function generateSwiftType(
  cls: GeneratedClass,
  allClasses: GeneratedClass[],
  settings: SwiftGeneratorSettings,
  indent: string
): string {
  const lines: string[] = [];
  
  // Comment
  if (settings.addComments) {
    lines.push(`// MARK: - ${cls.name}`);
  }
  
  // Type declaration
  const accessMod = settings.accessModifier === 'internal' ? '' : settings.accessModifier + ' ';
  const typeKeyword = settings.outputType === 'struct' 
    ? 'struct' 
    : settings.outputType === 'finalClass' 
      ? 'final class' 
      : 'class';
  
  // Protocol conformance
  const protocols: string[] = [];
  if (settings.codableOption === 'codable') {
    protocols.push('Codable');
  } else if (settings.codableOption === 'decodable') {
    protocols.push('Decodable');
  } else if (settings.codableOption === 'encodable') {
    protocols.push('Encodable');
  }
  
  const conformance = protocols.length > 0 ? `: ${protocols.join(', ')}` : '';
  
  lines.push(`${accessMod}${typeKeyword} ${cls.name}${conformance} {`);
  
  // Properties
  for (const field of cls.fields) {
    const propertyLine = generatePropertyLine(field, allClasses, settings, indent);
    lines.push(propertyLine);
  }
  
  // CodingKeys enum
  if (settings.generateCodingKeys && settings.codableOption !== 'none') {
    const needsCodingKeys = cls.fields.some(f => 
      toCamelCase(f.originalName) !== f.originalName
    );
    
    if (needsCodingKeys) {
      lines.push('');
      lines.push(`${indent}enum CodingKeys: String, CodingKey {`);
      for (const field of cls.fields) {
        const swiftName = sanitizeIdentifier(field.name, 'swift', 'camel');
        if (swiftName !== field.originalName) {
          lines.push(`${indent}${indent}case ${swiftName} = "${field.originalName}"`);
        } else {
          lines.push(`${indent}${indent}case ${swiftName}`);
        }
      }
      lines.push(`${indent}}`);
    }
  }
  
  // Init method
  if (settings.generateInit) {
    lines.push('');
    lines.push(generateInitMethod(cls, allClasses, settings, indent));
  }
  
  lines.push('}');
  
  return lines.join('\n');
}

/**
 * Generate a property line
 */
function generatePropertyLine(
  field: FieldInfo,
  allClasses: GeneratedClass[],
  settings: SwiftGeneratorSettings,
  indent: string
): string {
  const propName = sanitizeIdentifier(field.name, 'swift', 'camel');
  const swiftType = inferSwiftType(field.type, field.name, allClasses, settings);
  const keyword = settings.useVar ? 'var' : 'let';
  const published = settings.addPublished ? '@Published ' : '';
  
  return `${indent}${published}${keyword} ${propName}: ${swiftType}`;
}

/**
 * Infer Swift type from JSON type
 */
function inferSwiftType(
  type: InferredType,
  fieldName: string,
  allClasses: GeneratedClass[],
  settings: SwiftGeneratorSettings
): string {
  let swiftType: string;
  
  switch (type.type) {
    case 'string':
      swiftType = 'String';
      break;
      
    case 'int':
      swiftType = 'Int';
      break;
      
    case 'float':
      swiftType = 'Double';
      break;
      
    case 'boolean':
      swiftType = 'Bool';
      break;
      
    case 'null':
      swiftType = 'Any';
      break;
      
    case 'array':
      if (type.arrayElementType) {
        const elementType = inferSwiftType(type.arrayElementType, fieldName, allClasses, settings);
        swiftType = `[${elementType}]`;
      } else {
        swiftType = '[Any]';
      }
      break;
      
    case 'object':
      const className = toPascalCase(fieldName);
      const matchingClass = allClasses.find(c => 
        c.name === className || 
        c.name.endsWith(className) ||
        className.endsWith(c.name)
      );
      swiftType = matchingClass ? matchingClass.name : toPascalCase(fieldName);
      break;
      
    case 'mixed':
    default:
      swiftType = 'Any';
  }
  
  // Add optional marker
  if (settings.markOptional && type.isNullable) {
    swiftType += '?';
  }
  
  return swiftType;
}

/**
 * Generate init method
 */
function generateInitMethod(
  cls: GeneratedClass,
  allClasses: GeneratedClass[],
  settings: SwiftGeneratorSettings,
  indent: string
): string {
  const lines: string[] = [];
  const params: string[] = [];
  
  for (const field of cls.fields) {
    const propName = sanitizeIdentifier(field.name, 'swift', 'camel');
    const swiftType = inferSwiftType(field.type, field.name, allClasses, settings);
    params.push(`${propName}: ${swiftType}`);
  }
  
  lines.push(`${indent}init(${params.join(', ')}) {`);
  
  for (const field of cls.fields) {
    const propName = sanitizeIdentifier(field.name, 'swift', 'camel');
    lines.push(`${indent}${indent}self.${propName} = ${propName}`);
  }
  
  lines.push(`${indent}}`);
  
  return lines.join('\n');
}
