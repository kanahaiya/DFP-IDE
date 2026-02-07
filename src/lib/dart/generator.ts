/**
 * Dart code generator from JSON
 */

import type { DartGeneratorSettings, DartConversionResult } from './types';
import type { InferredType, GeneratedClass } from '../code-gen/types';
import { parseAndValidateJSON, analyzeStructure } from '../code-gen/typeInference';
import { toPascalCase, sanitizeIdentifier } from '../code-gen/nameUtils';

/**
 * Convert JSON to Dart code
 */
export function convertJSONToDart(
  jsonString: string,
  settings: DartGeneratorSettings
): DartConversionResult {
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
    return { success: true, code: '', classCount: 0 };
  }
  
  try {
    const { allClasses } = analyzeStructure(
      parseResult.value,
      toPascalCase(settings.rootClassName)
    );
    
    const code = generateDartCode(allClasses, settings);
    
    return {
      success: true,
      code,
      classCount: allClasses.length
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
 * Generate Dart code from analyzed classes
 */
function generateDartCode(
  classes: GeneratedClass[],
  settings: DartGeneratorSettings
): string {
  const indent = settings.indentation === 'tab' ? '\t' : ' '.repeat(settings.indentation as number);
  const lines: string[] = [];
  
  // Add imports based on code style
  if (settings.codeStyle === 'freezed') {
    lines.push("import 'package:freezed_annotation/freezed_annotation.dart';");
    lines.push('');
    lines.push(`part '${settings.rootClassName.toLowerCase()}.freezed.dart';`);
    lines.push(`part '${settings.rootClassName.toLowerCase()}.g.dart';`);
    lines.push('');
  } else if (settings.codeStyle === 'jsonSerializable') {
    lines.push("import 'package:json_annotation/json_annotation.dart';");
    lines.push('');
    lines.push(`part '${settings.rootClassName.toLowerCase()}.g.dart';`);
    lines.push('');
  }
  
  // Generate each class
  for (const cls of classes) {
    const classCode = generateDartClass(cls, classes, settings, indent);
    lines.push(classCode);
    lines.push('');
  }
  
  return lines.join('\n').trim();
}

/**
 * Generate a single Dart class
 */
function generateDartClass(
  cls: GeneratedClass,
  allClasses: GeneratedClass[],
  settings: DartGeneratorSettings,
  indent: string
): string {
  if (settings.codeStyle === 'freezed') {
    return generateFreezedClass(cls, allClasses, settings, indent);
  } else if (settings.codeStyle === 'jsonSerializable') {
    return generateJsonSerializableClass(cls, allClasses, settings, indent);
  }
  return generatePlainClass(cls, allClasses, settings, indent);
}

/**
 * Generate plain Dart class
 */
function generatePlainClass(
  cls: GeneratedClass,
  allClasses: GeneratedClass[],
  settings: DartGeneratorSettings,
  indent: string
): string {
  const lines: string[] = [];
  
  if (settings.addComments) {
    lines.push(`/// ${cls.name} class`);
  }
  
  lines.push(`class ${cls.name} {`);
  
  // Properties
  for (const field of cls.fields) {
    const propName = sanitizeIdentifier(field.name, 'dart', 'camel');
    const dartType = inferDartType(field.type, field.name, allClasses, settings);
    const final_ = settings.useFinal ? 'final ' : '';
    lines.push(`${indent}${final_}${dartType} ${propName};`);
  }
  
  lines.push('');
  
  // Constructor
  const ctorParams = cls.fields.map(field => {
    const propName = sanitizeIdentifier(field.name, 'dart', 'camel');
    const required = settings.useRequired && !field.type.isNullable ? 'required ' : '';
    return `${required}this.${propName}`;
  });
  
  lines.push(`${indent}${cls.name}({`);
  for (const param of ctorParams) {
    lines.push(`${indent}${indent}${param},`);
  }
  lines.push(`${indent}});`);
  
  // fromJson factory
  if (settings.generateFromJson) {
    lines.push('');
    lines.push(`${indent}factory ${cls.name}.fromJson(Map<String, dynamic> json) {`);
    lines.push(`${indent}${indent}return ${cls.name}(`);
    for (const field of cls.fields) {
      const propName = sanitizeIdentifier(field.name, 'dart', 'camel');
      const jsonKey = field.originalName;
      const dartType = inferDartType(field.type, field.name, allClasses, settings);
      const fromJsonExpr = getFromJsonExpression(field.type, field.name, jsonKey, allClasses, settings, dartType);
      lines.push(`${indent}${indent}${indent}${propName}: ${fromJsonExpr},`);
    }
    lines.push(`${indent}${indent});`);
    lines.push(`${indent}}`);
  }
  
  // toJson method
  if (settings.generateToJson) {
    lines.push('');
    lines.push(`${indent}Map<String, dynamic> toJson() {`);
    lines.push(`${indent}${indent}return {`);
    for (const field of cls.fields) {
      const propName = sanitizeIdentifier(field.name, 'dart', 'camel');
      const jsonKey = field.originalName;
      const toJsonExpr = getToJsonExpression(field.type, propName);
      lines.push(`${indent}${indent}${indent}'${jsonKey}': ${toJsonExpr},`);
    }
    lines.push(`${indent}${indent}};`);
    lines.push(`${indent}}`);
  }
  
  // copyWith
  if (settings.generateCopyWith) {
    lines.push('');
    const copyParams = cls.fields.map(field => {
      const propName = sanitizeIdentifier(field.name, 'dart', 'camel');
      const dartType = inferDartType(field.type, field.name, allClasses, settings);
      return `${dartType}? ${propName}`;
    });
    lines.push(`${indent}${cls.name} copyWith({`);
    for (const param of copyParams) {
      lines.push(`${indent}${indent}${param},`);
    }
    lines.push(`${indent}}) {`);
    lines.push(`${indent}${indent}return ${cls.name}(`);
    for (const field of cls.fields) {
      const propName = sanitizeIdentifier(field.name, 'dart', 'camel');
      lines.push(`${indent}${indent}${indent}${propName}: ${propName} ?? this.${propName},`);
    }
    lines.push(`${indent}${indent});`);
    lines.push(`${indent}}`);
  }
  
  // toString
  if (settings.generateToString) {
    lines.push('');
    const props = cls.fields.map(f => sanitizeIdentifier(f.name, 'dart', 'camel'));
    lines.push(`${indent}@override`);
    lines.push(`${indent}String toString() {`);
    lines.push(`${indent}${indent}return '${cls.name}(${props.map(p => `${p}: \$${p}`).join(', ')})';`);
    lines.push(`${indent}}`);
  }
  
  // Equality
  if (settings.generateEquality) {
    lines.push('');
    lines.push(`${indent}@override`);
    lines.push(`${indent}bool operator ==(Object other) {`);
    lines.push(`${indent}${indent}if (identical(this, other)) return true;`);
    lines.push(`${indent}${indent}return other is ${cls.name}`);
    for (const field of cls.fields) {
      const propName = sanitizeIdentifier(field.name, 'dart', 'camel');
      lines.push(`${indent}${indent}${indent}&& other.${propName} == ${propName}`);
    }
    lines.push(`${indent}${indent};`);
    lines.push(`${indent}}`);
    lines.push('');
    lines.push(`${indent}@override`);
    lines.push(`${indent}int get hashCode {`);
    const props = cls.fields.map(f => sanitizeIdentifier(f.name, 'dart', 'camel'));
    lines.push(`${indent}${indent}return Object.hash(${props.join(', ')});`);
    lines.push(`${indent}}`);
  }
  
  lines.push('}');
  
  return lines.join('\n');
}

/**
 * Generate Freezed class
 */
function generateFreezedClass(
  cls: GeneratedClass,
  allClasses: GeneratedClass[],
  settings: DartGeneratorSettings,
  indent: string
): string {
  const lines: string[] = [];
  
  lines.push('@freezed');
  lines.push(`class ${cls.name} with _\$${cls.name} {`);
  lines.push(`${indent}const factory ${cls.name}({`);
  
  for (const field of cls.fields) {
    const propName = sanitizeIdentifier(field.name, 'dart', 'camel');
    const dartType = inferDartType(field.type, field.name, allClasses, settings);
    const jsonKey = field.originalName;
    const required = !field.type.isNullable ? 'required ' : '';
    
    if (propName !== jsonKey) {
      lines.push(`${indent}${indent}@JsonKey(name: '${jsonKey}')`);
    }
    lines.push(`${indent}${indent}${required}${dartType} ${propName},`);
  }
  
  lines.push(`${indent}}) = _${cls.name};`);
  lines.push('');
  lines.push(`${indent}factory ${cls.name}.fromJson(Map<String, dynamic> json) => _\$${cls.name}FromJson(json);`);
  lines.push('}');
  
  return lines.join('\n');
}

/**
 * Generate JSON Serializable class
 */
function generateJsonSerializableClass(
  cls: GeneratedClass,
  allClasses: GeneratedClass[],
  settings: DartGeneratorSettings,
  indent: string
): string {
  const lines: string[] = [];
  
  lines.push('@JsonSerializable()');
  lines.push(`class ${cls.name} {`);
  
  // Properties
  for (const field of cls.fields) {
    const propName = sanitizeIdentifier(field.name, 'dart', 'camel');
    const dartType = inferDartType(field.type, field.name, allClasses, settings);
    const jsonKey = field.originalName;
    const final_ = settings.useFinal ? 'final ' : '';
    
    if (propName !== jsonKey) {
      lines.push(`${indent}@JsonKey(name: '${jsonKey}')`);
    }
    lines.push(`${indent}${final_}${dartType} ${propName};`);
  }
  
  lines.push('');
  
  // Constructor
  const ctorParams = cls.fields.map(field => {
    const propName = sanitizeIdentifier(field.name, 'dart', 'camel');
    const required = settings.useRequired && !field.type.isNullable ? 'required ' : '';
    return `${required}this.${propName}`;
  });
  
  lines.push(`${indent}${cls.name}({`);
  for (const param of ctorParams) {
    lines.push(`${indent}${indent}${param},`);
  }
  lines.push(`${indent}});`);
  
  lines.push('');
  lines.push(`${indent}factory ${cls.name}.fromJson(Map<String, dynamic> json) => _\$${cls.name}FromJson(json);`);
  lines.push(`${indent}Map<String, dynamic> toJson() => _\$${cls.name}ToJson(this);`);
  
  lines.push('}');
  
  return lines.join('\n');
}

/**
 * Infer Dart type from JSON type
 */
function inferDartType(
  type: InferredType,
  fieldName: string,
  allClasses: GeneratedClass[],
  settings: DartGeneratorSettings
): string {
  let dartType: string;
  
  switch (type.type) {
    case 'string':
      dartType = 'String';
      break;
    case 'int':
      dartType = 'int';
      break;
    case 'float':
      dartType = 'double';
      break;
    case 'boolean':
      dartType = 'bool';
      break;
    case 'null':
      dartType = 'dynamic';
      break;
    case 'array':
      if (type.arrayElementType) {
        const elementType = inferDartType(type.arrayElementType, fieldName, allClasses, settings);
        dartType = `List<${elementType}>`;
      } else {
        dartType = 'List<dynamic>';
      }
      break;
    case 'object':
      const className = toPascalCase(fieldName);
      const matchingClass = allClasses.find(c => 
        c.name === className || 
        c.name.endsWith(className) ||
        className.endsWith(c.name)
      );
      dartType = matchingClass ? matchingClass.name : toPascalCase(fieldName);
      break;
    case 'mixed':
    default:
      dartType = 'dynamic';
  }
  
  if (settings.useNullableTypes && type.isNullable && dartType !== 'dynamic') {
    dartType += '?';
  }
  
  return dartType;
}

/**
 * Get fromJson expression for a field
 */
function getFromJsonExpression(
  type: InferredType,
  fieldName: string,
  jsonKey: string,
  allClasses: GeneratedClass[],
  settings: DartGeneratorSettings,
  dartType: string
): string {
  const accessor = `json['${jsonKey}']`;
  
  if (type.type === 'object') {
    const className = toPascalCase(fieldName);
    if (type.isNullable) {
      return `${accessor} != null ? ${className}.fromJson(${accessor} as Map<String, dynamic>) : null`;
    }
    return `${className}.fromJson(${accessor} as Map<String, dynamic>)`;
  }
  
  if (type.type === 'array' && type.arrayElementType?.type === 'object') {
    const elementClass = toPascalCase(fieldName);
    const mapExpr = `(v) => ${elementClass}.fromJson(v as Map<String, dynamic>)`;
    if (type.isNullable) {
      return `(${accessor} as List<dynamic>?)?.map(${mapExpr}).toList()`;
    }
    return `(${accessor} as List<dynamic>).map(${mapExpr}).toList()`;
  }
  
  if (type.type === 'array') {
    const baseType = dartType.replace('List<', '').replace('>', '').replace('?', '');
    if (type.isNullable) {
      return `(${accessor} as List<dynamic>?)?.cast<${baseType}>()`;
    }
    return `(${accessor} as List<dynamic>).cast<${baseType}>()`;
  }
  
  // Simple cast
  return `${accessor} as ${dartType}`;
}

/**
 * Get toJson expression for a field
 */
function getToJsonExpression(
  type: InferredType,
  propName: string
): string {
  if (type.type === 'object') {
    if (type.isNullable) {
      return `${propName}?.toJson()`;
    }
    return `${propName}.toJson()`;
  }
  
  if (type.type === 'array' && type.arrayElementType?.type === 'object') {
    if (type.isNullable) {
      return `${propName}?.map((v) => v.toJson()).toList()`;
    }
    return `${propName}.map((v) => v.toJson()).toList()`;
  }
  
  return propName;
}
