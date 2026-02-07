/**
 * JSON to Java converter generator
 */

import type { JavaGeneratorSettings, JavaGenerationResult } from './types';
import { DEFAULT_JAVA_SETTINGS } from './types';
import { toPascalCase, toCamelCase, toSnakeCase } from '../code-gen/nameUtils';

interface JavaClass {
  name: string;
  fields: JavaField[];
  isInner: boolean;
}

interface JavaField {
  name: string;
  originalName: string;
  type: string;
  isArray: boolean;
  isObject: boolean;
  isNullable: boolean;
}

function getJavaType(value: unknown, settings: JavaGeneratorSettings): string {
  if (value === null) {
    return 'Object';
  }
  
  const type = typeof value;
  
  switch (type) {
    case 'string':
      return 'String';
    case 'number':
      if (Number.isInteger(value)) {
        return settings.usePrimitives ? 'int' : 'Integer';
      }
      return settings.usePrimitives ? 'double' : 'Double';
    case 'boolean':
      return settings.usePrimitives ? 'boolean' : 'Boolean';
    case 'object':
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return settings.useCollectionInterfaces ? 'List<Object>' : 'ArrayList<Object>';
        }
        const elementType = getJavaType(value[0], settings);
        return settings.useCollectionInterfaces ? `List<${elementType}>` : `ArrayList<${elementType}>`;
      }
      return 'Object';
    default:
      return 'Object';
  }
}

function convertPropertyName(name: string, settings: JavaGeneratorSettings): string {
  switch (settings.propertyNaming) {
    case 'camelCase':
      return toCamelCase(name);
    case 'PascalCase':
      return toPascalCase(name);
    case 'snake_case':
      return toSnakeCase(name);
    default:
      return toCamelCase(name);
  }
}

function convertClassName(name: string): string {
  return toPascalCase(name);
}

function generateJacksonAnnotation(originalName: string, fieldName: string): string {
  if (originalName !== fieldName) {
    return `@JsonProperty("${originalName}")`;
  }
  return '';
}

function generateGsonAnnotation(originalName: string, fieldName: string): string {
  if (originalName !== fieldName) {
    return `@SerializedName("${originalName}")`;
  }
  return '';
}

function generateField(field: JavaField, settings: JavaGeneratorSettings, indent: string): string {
  const lines: string[] = [];
  
  // Add annotation if needed
  if (settings.annotationStyle === 'jackson') {
    const annotation = generateJacksonAnnotation(field.originalName, field.name);
    if (annotation) {
      lines.push(`${indent}${annotation}`);
    }
  } else if (settings.annotationStyle === 'gson') {
    const annotation = generateGsonAnnotation(field.originalName, field.name);
    if (annotation) {
      lines.push(`${indent}${annotation}`);
    }
  }
  
  // Field declaration
  const modifier = settings.accessModifier;
  const finalModifier = settings.makeFinal ? 'final ' : '';
  lines.push(`${indent}${modifier} ${finalModifier}${field.type} ${field.name};`);
  
  return lines.join('\n');
}

function generateGetter(field: JavaField, indent: string): string {
  const getterName = `get${toPascalCase(field.name)}`;
  return `${indent}public ${field.type} ${getterName}() {\n${indent}    return this.${field.name};\n${indent}}`;
}

function generateSetter(field: JavaField, indent: string): string {
  const setterName = `set${toPascalCase(field.name)}`;
  return `${indent}public void ${setterName}(${field.type} ${field.name}) {\n${indent}    this.${field.name} = ${field.name};\n${indent}}`;
}

function generateDefaultConstructor(className: string, indent: string): string {
  return `${indent}public ${className}() {\n${indent}}`;
}

function generateAllArgsConstructor(className: string, fields: JavaField[], indent: string): string {
  const params = fields.map(f => `${f.type} ${f.name}`).join(', ');
  const assignments = fields.map(f => `${indent}    this.${f.name} = ${f.name};`).join('\n');
  return `${indent}public ${className}(${params}) {\n${assignments}\n${indent}}`;
}

function generateToString(className: string, fields: JavaField[], indent: string): string {
  const fieldStrings = fields.map(f => `"${f.name}=" + ${f.name}`).join(' + ", " + ');
  return `${indent}@Override\n${indent}public String toString() {\n${indent}    return "${className}{" + ${fieldStrings} + "}";\n${indent}}`;
}

function generateHashCode(fields: JavaField[], indent: string): string {
  const fieldNames = fields.map(f => f.name).join(', ');
  return `${indent}@Override\n${indent}public int hashCode() {\n${indent}    return java.util.Objects.hash(${fieldNames});\n${indent}}`;
}

function generateEquals(className: string, fields: JavaField[], indent: string): string {
  const comparisons = fields.map(f => `java.util.Objects.equals(${f.name}, other.${f.name})`).join(' && ');
  return `${indent}@Override\n${indent}public boolean equals(Object obj) {\n${indent}    if (this == obj) return true;\n${indent}    if (obj == null || getClass() != obj.getClass()) return false;\n${indent}    ${className} other = (${className}) obj;\n${indent}    return ${comparisons || 'true'};\n${indent}}`;
}

function analyzeObject(
  obj: Record<string, unknown>,
  className: string,
  settings: JavaGeneratorSettings,
  classes: JavaClass[],
  isInner: boolean
): JavaClass {
  const fields: JavaField[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fieldName = convertPropertyName(key, settings);
    let fieldType: string;
    let isObject = false;
    let isArray = false;
    
    if (value === null) {
      fieldType = 'Object';
    } else if (Array.isArray(value)) {
      isArray = true;
      if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null && !Array.isArray(value[0])) {
        const nestedClassName = convertClassName(key);
        analyzeObject(value[0] as Record<string, unknown>, nestedClassName, settings, classes, !settings.generateSeparateClasses);
        fieldType = settings.useCollectionInterfaces ? `List<${nestedClassName}>` : `ArrayList<${nestedClassName}>`;
      } else {
        fieldType = getJavaType(value, settings);
      }
    } else if (typeof value === 'object') {
      isObject = true;
      const nestedClassName = convertClassName(key);
      analyzeObject(value as Record<string, unknown>, nestedClassName, settings, classes, !settings.generateSeparateClasses);
      fieldType = nestedClassName;
    } else {
      fieldType = getJavaType(value, settings);
    }
    
    fields.push({
      name: fieldName,
      originalName: key,
      type: fieldType,
      isArray,
      isObject,
      isNullable: value === null,
    });
  }
  
  const javaClass: JavaClass = { name: className, fields, isInner };
  classes.push(javaClass);
  return javaClass;
}

function generateClass(
  javaClass: JavaClass,
  settings: JavaGeneratorSettings,
  baseIndent: string = ''
): string {
  const indent = baseIndent + (settings.useSpaces ? ' '.repeat(settings.indentSize) : '\t');
  const lines: string[] = [];
  
  // Class annotations (Lombok)
  if (settings.useLombok) {
    if (settings.generateGetters && settings.generateSetters) {
      lines.push(`${baseIndent}@Data`);
    } else {
      if (settings.generateGetters) lines.push(`${baseIndent}@Getter`);
      if (settings.generateSetters) lines.push(`${baseIndent}@Setter`);
    }
    if (settings.generateConstructors) lines.push(`${baseIndent}@NoArgsConstructor`);
    if (settings.generateAllArgsConstructor) lines.push(`${baseIndent}@AllArgsConstructor`);
    if (settings.generateBuilder) lines.push(`${baseIndent}@Builder`);
  }
  
  // Class declaration
  const staticModifier = javaClass.isInner ? 'static ' : '';
  lines.push(`${baseIndent}public ${staticModifier}class ${javaClass.name} {`);
  lines.push('');
  
  // Fields
  for (const field of javaClass.fields) {
    lines.push(generateField(field, settings, indent));
  }
  
  // Only generate methods if not using Lombok
  if (!settings.useLombok) {
    lines.push('');
    
    // Default constructor
    if (settings.generateConstructors) {
      lines.push(generateDefaultConstructor(javaClass.name, indent));
      lines.push('');
    }
    
    // All-args constructor
    if (settings.generateAllArgsConstructor && javaClass.fields.length > 0) {
      lines.push(generateAllArgsConstructor(javaClass.name, javaClass.fields, indent));
      lines.push('');
    }
    
    // Getters and Setters
    for (const field of javaClass.fields) {
      if (settings.generateGetters) {
        lines.push(generateGetter(field, indent));
        lines.push('');
      }
      if (settings.generateSetters && !settings.makeFinal) {
        lines.push(generateSetter(field, indent));
        lines.push('');
      }
    }
    
    // toString
    if (settings.generateToString) {
      lines.push(generateToString(javaClass.name, javaClass.fields, indent));
      lines.push('');
    }
    
    // hashCode and equals
    if (settings.generateHashCodeEquals) {
      lines.push(generateHashCode(javaClass.fields, indent));
      lines.push('');
      lines.push(generateEquals(javaClass.name, javaClass.fields, indent));
      lines.push('');
    }
  }
  
  lines.push(`${baseIndent}}`);
  
  return lines.join('\n');
}

export function convertJSONToJava(
  jsonInput: string,
  userSettings?: Partial<JavaGeneratorSettings>
): JavaGenerationResult {
  const settings: JavaGeneratorSettings = { ...DEFAULT_JAVA_SETTINGS, ...userSettings };
  
  try {
    const parsed = JSON.parse(jsonInput);
    
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {
        success: false,
        errors: [{ message: 'Input must be a JSON object' }],
      };
    }
    
    const classes: JavaClass[] = [];
    analyzeObject(parsed, settings.rootClassName, settings, classes, false);
    
    // Reverse to have root class first
    classes.reverse();
    
    const output: string[] = [];
    const indent = settings.useSpaces ? ' '.repeat(settings.indentSize) : '\t';
    
    // Package declaration
    if (settings.packageName) {
      output.push(`package ${settings.packageName};`);
      output.push('');
    }
    
    // Imports
    const imports: string[] = [];
    
    if (settings.useCollectionInterfaces || !settings.useCollectionInterfaces) {
      imports.push('import java.util.List;');
      imports.push('import java.util.ArrayList;');
    }
    
    if (settings.annotationStyle === 'jackson') {
      imports.push('import com.fasterxml.jackson.annotation.JsonProperty;');
    } else if (settings.annotationStyle === 'gson') {
      imports.push('import com.google.gson.annotations.SerializedName;');
    }
    
    if (settings.useLombok) {
      imports.push('import lombok.Data;');
      imports.push('import lombok.Getter;');
      imports.push('import lombok.Setter;');
      imports.push('import lombok.NoArgsConstructor;');
      imports.push('import lombok.AllArgsConstructor;');
      imports.push('import lombok.Builder;');
    }
    
    if (imports.length > 0) {
      output.push(...imports);
      output.push('');
    }
    
    // Generate classes
    if (settings.generateSeparateClasses) {
      // All classes as top-level
      for (const cls of classes) {
        output.push(generateClass({ ...cls, isInner: false }, settings));
        output.push('');
      }
    } else {
      // Root class with inner classes
      const rootClass = classes[0];
      const innerClasses = classes.slice(1);
      
      // Class annotations (Lombok)
      if (settings.useLombok) {
        if (settings.generateGetters && settings.generateSetters) {
          output.push('@Data');
        } else {
          if (settings.generateGetters) output.push('@Getter');
          if (settings.generateSetters) output.push('@Setter');
        }
        if (settings.generateConstructors) output.push('@NoArgsConstructor');
        if (settings.generateAllArgsConstructor) output.push('@AllArgsConstructor');
        if (settings.generateBuilder) output.push('@Builder');
      }
      
      output.push(`public class ${rootClass.name} {`);
      output.push('');
      
      // Root fields
      for (const field of rootClass.fields) {
        output.push(generateField(field, settings, indent));
      }
      
      // Root methods if not using Lombok
      if (!settings.useLombok) {
        output.push('');
        
        if (settings.generateConstructors) {
          output.push(generateDefaultConstructor(rootClass.name, indent));
          output.push('');
        }
        
        if (settings.generateAllArgsConstructor && rootClass.fields.length > 0) {
          output.push(generateAllArgsConstructor(rootClass.name, rootClass.fields, indent));
          output.push('');
        }
        
        for (const field of rootClass.fields) {
          if (settings.generateGetters) {
            output.push(generateGetter(field, indent));
            output.push('');
          }
          if (settings.generateSetters && !settings.makeFinal) {
            output.push(generateSetter(field, indent));
            output.push('');
          }
        }
        
        if (settings.generateToString) {
          output.push(generateToString(rootClass.name, rootClass.fields, indent));
          output.push('');
        }
        
        if (settings.generateHashCodeEquals) {
          output.push(generateHashCode(rootClass.fields, indent));
          output.push('');
          output.push(generateEquals(rootClass.name, rootClass.fields, indent));
          output.push('');
        }
      }
      
      // Inner classes
      for (const innerClass of innerClasses) {
        output.push('');
        output.push(generateClass(innerClass, settings, indent));
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
