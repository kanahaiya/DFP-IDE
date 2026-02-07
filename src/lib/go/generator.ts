/**
 * Go struct generator from JSON
 */

import type { GoGeneratorSettings, GoConversionResult } from './types';
import type { InferredType, GeneratedClass, FieldInfo } from '../code-gen/types';
import { parseAndValidateJSON, analyzeStructure } from '../code-gen/typeInference';
import { toPascalCase, sanitizeIdentifier } from '../code-gen/nameUtils';

/**
 * Convert JSON to Go structs
 */
export function convertJSONToGo(
  jsonString: string,
  settings: GoGeneratorSettings
): GoConversionResult {
  // Validate and parse JSON
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
    return { success: true, code: '', structCount: 0 };
  }
  
  try {
    // Analyze JSON structure
    const { allClasses } = analyzeStructure(
      parseResult.value,
      toPascalCase(settings.rootClassName)
    );
    
    // Generate Go code
    const code = generateGoCode(allClasses, settings);
    
    return {
      success: true,
      code,
      structCount: allClasses.length
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
 * Generate Go code from analyzed classes
 */
function generateGoCode(
  classes: GeneratedClass[],
  settings: GoGeneratorSettings
): string {
  const indent = settings.indentation === 'tab' ? '\t' : ' '.repeat(settings.indentation as number);
  const lines: string[] = [];
  
  // Generate each struct
  for (const cls of classes) {
    if (settings.addComments) {
      lines.push(`// ${cls.name} represents the ${cls.name.toLowerCase()} structure`);
    }
    
    lines.push(`type ${cls.name} struct {`);
    
    // Sort fields if requested
    let fields = [...cls.fields];
    if (settings.sortFields) {
      fields = fields.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    for (const field of fields) {
      const fieldLine = generateFieldLine(field, classes, settings, indent);
      lines.push(fieldLine);
    }
    
    lines.push('}');
    lines.push('');
  }
  
  return lines.join('\n').trim();
}

/**
 * Generate a single field line
 */
function generateFieldLine(
  field: FieldInfo,
  allClasses: GeneratedClass[],
  settings: GoGeneratorSettings,
  indent: string
): string {
  const fieldName = sanitizeIdentifier(field.name, 'go', 'pascal');
  const goType = inferGoType(field.type, field.name, allClasses, settings);
  const tags = generateTags(field.originalName, field.type.isNullable, settings);
  
  return `${indent}${fieldName} ${goType}${tags ? ' ' + tags : ''}`;
}

/**
 * Infer Go type from JSON type
 */
function inferGoType(
  type: InferredType,
  fieldName: string,
  allClasses: GeneratedClass[],
  settings: GoGeneratorSettings
): string {
  let goType: string;
  
  switch (type.type) {
    case 'string':
      goType = 'string';
      break;
      
    case 'int':
      goType = settings.preferInt64 ? 'int64' : 'int';
      break;
      
    case 'float':
      goType = settings.useFloat32 ? 'float32' : 'float64';
      break;
      
    case 'boolean':
      goType = 'bool';
      break;
      
    case 'null':
      goType = 'interface{}';
      break;
      
    case 'array':
      if (type.arrayElementType) {
        const elementType = inferGoType(type.arrayElementType, fieldName, allClasses, settings);
        goType = `[]${elementType}`;
      } else {
        goType = '[]interface{}';
      }
      break;
      
    case 'object':
      // Find matching class
      const className = toPascalCase(fieldName);
      const matchingClass = allClasses.find(c => 
        c.name === className || 
        c.name.endsWith(className) ||
        className.endsWith(c.name)
      );
      goType = matchingClass ? matchingClass.name : toPascalCase(fieldName);
      break;
      
    case 'mixed':
    default:
      goType = 'interface{}';
  }
  
  // Add pointer for nullable types if enabled
  if (settings.usePointerForNullable && type.isNullable && type.type !== 'null') {
    goType = '*' + goType;
  }
  
  return goType;
}

/**
 * Generate struct tags
 */
function generateTags(
  originalKey: string,
  isNullable: boolean,
  settings: GoGeneratorSettings
): string {
  const tags: string[] = [];
  
  // JSON tag
  if (settings.includeJsonTags) {
    let jsonTag = `json:"${originalKey}`;
    if (settings.includeOmitempty) {
      jsonTag += ',omitempty';
    }
    jsonTag += '"';
    tags.push(jsonTag);
  }
  
  // YAML tag
  if (settings.includeYamlTags) {
    let yamlTag = `yaml:"${originalKey}`;
    if (settings.includeOmitempty) {
      yamlTag += ',omitempty';
    }
    yamlTag += '"';
    tags.push(yamlTag);
  }
  
  // XML tag
  if (settings.includeXmlTags) {
    tags.push(`xml:"${originalKey}"`);
  }
  
  // BSON tag
  if (settings.includeBsonTags) {
    let bsonTag = `bson:"${originalKey}`;
    if (settings.includeOmitempty) {
      bsonTag += ',omitempty';
    }
    bsonTag += '"';
    tags.push(bsonTag);
  }
  
  if (tags.length === 0) {
    return '';
  }
  
  return '`' + tags.join(' ') + '`';
}
