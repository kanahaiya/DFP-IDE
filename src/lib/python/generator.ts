/**
 * JSON to Python converter generator
 */

import type { PythonGeneratorSettings, PythonGenerationResult } from './types';
import { DEFAULT_PYTHON_SETTINGS } from './types';
import { toPascalCase, toSnakeCase } from '../code-gen/nameUtils';

interface PythonClass {
  name: string;
  fields: PythonField[];
}

interface PythonField {
  name: string;
  originalName: string;
  type: string;
  isOptional: boolean;
  isArray: boolean;
  defaultValue?: string;
}

// Regex patterns for special types
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/.+/;

function detectSpecialType(value: string, settings: PythonGeneratorSettings): string | null {
  if (settings.detectDatetime && ISO_DATE_REGEX.test(value)) {
    return 'datetime';
  }
  if (settings.detectUuid && UUID_REGEX.test(value)) {
    return 'UUID';
  }
  if (settings.detectEmail && EMAIL_REGEX.test(value)) {
    return 'EmailStr'; // Pydantic type
  }
  if (settings.detectUrl && URL_REGEX.test(value)) {
    return 'HttpUrl'; // Pydantic type
  }
  return null;
}

function getPythonType(value: unknown, settings: PythonGeneratorSettings): string {
  if (value === null) {
    return 'None';
  }
  
  const type = typeof value;
  
  switch (type) {
    case 'string': {
      const specialType = detectSpecialType(value as string, settings);
      if (specialType) return specialType;
      return 'str';
    }
    case 'number':
      if (Number.isInteger(value)) {
        return 'int';
      }
      return 'float';
    case 'boolean':
      return 'bool';
    case 'object':
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return 'list';
        }
        const elementType = getPythonType(value[0], settings);
        return `list[${elementType}]`;
      }
      return 'dict';
    default:
      return 'Any';
  }
}

function convertFieldName(name: string, settings: PythonGeneratorSettings): string {
  if (settings.convertToSnakeCase) {
    return toSnakeCase(name);
  }
  return name;
}

function convertClassName(name: string): string {
  return toPascalCase(name);
}

function formatOptionalType(type: string, settings: PythonGeneratorSettings): string {
  if (settings.useUnionSyntax) {
    return `${type} | None`;
  }
  return `Optional[${type}]`;
}

function analyzeObject(
  obj: Record<string, unknown>,
  className: string,
  settings: PythonGeneratorSettings,
  classes: PythonClass[]
): PythonClass {
  const fields: PythonField[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fieldName = convertFieldName(key, settings);
    let fieldType: string;
    let isOptional = false;
    let isArray = false;
    
    if (value === null) {
      fieldType = 'Any';
      isOptional = true;
    } else if (Array.isArray(value)) {
      isArray = true;
      if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null && !Array.isArray(value[0])) {
        const nestedClassName = convertClassName(key);
        analyzeObject(value[0] as Record<string, unknown>, nestedClassName, settings, classes);
        fieldType = `list[${nestedClassName}]`;
      } else {
        fieldType = getPythonType(value, settings);
      }
    } else if (typeof value === 'object') {
      const nestedClassName = convertClassName(key);
      analyzeObject(value as Record<string, unknown>, nestedClassName, settings, classes);
      fieldType = nestedClassName;
    } else {
      fieldType = getPythonType(value, settings);
    }
    
    fields.push({
      name: fieldName,
      originalName: key,
      type: fieldType,
      isOptional,
      isArray,
    });
  }
  
  const pythonClass: PythonClass = { name: className, fields };
  classes.push(pythonClass);
  return pythonClass;
}

function generateDict(parsed: Record<string, unknown>, settings: PythonGeneratorSettings): string {
  const quote = settings.quoteStyle === 'single' ? "'" : '"';
  const indent = ' '.repeat(settings.indentSize);
  
  function formatValue(value: unknown, currentIndent: string): string {
    if (value === null) {
      return 'None';
    }
    if (typeof value === 'string') {
      return `${quote}${value.replace(/\\/g, '\\\\').replace(new RegExp(quote, 'g'), '\\' + quote)}${quote}`;
    }
    if (typeof value === 'boolean') {
      return value ? 'True' : 'False';
    }
    if (typeof value === 'number') {
      return String(value);
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      const items = value.map(v => formatValue(v, currentIndent + indent));
      return `[\n${currentIndent}${indent}${items.join(',\n' + currentIndent + indent)}\n${currentIndent}]`;
    }
    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return '{}';
      const items = entries.map(([k, v]) => {
        const keyName = settings.convertToSnakeCase ? toSnakeCase(k) : k;
        return `${quote}${keyName}${quote}: ${formatValue(v, currentIndent + indent)}`;
      });
      return `{\n${currentIndent}${indent}${items.join(',\n' + currentIndent + indent)}\n${currentIndent}}`;
    }
    return 'None';
  }
  
  return `${settings.variableName} = ${formatValue(parsed, '')}`;
}

function generateTypedDict(classes: PythonClass[], settings: PythonGeneratorSettings): string {
  const lines: string[] = [];
  const indent = ' '.repeat(settings.indentSize);
  
  // Imports
  if (settings.includeImports) {
    if (settings.includeFromFuture) {
      lines.push('from __future__ import annotations');
      lines.push('');
    }
    lines.push('from typing import TypedDict, Optional, Any');
    lines.push('');
  }
  
  // Generate TypedDicts (reversed to have dependencies first)
  const reversedClasses = [...classes].reverse();
  
  for (const cls of reversedClasses) {
    lines.push(`class ${cls.name}(TypedDict):`);
    
    for (const field of cls.fields) {
      let fieldType = field.type;
      if (field.isOptional && settings.useOptionalForNullable) {
        fieldType = formatOptionalType(fieldType, settings);
      }
      lines.push(`${indent}${field.name}: ${fieldType}`);
    }
    
    lines.push('');
  }
  
  return lines.join('\n');
}

function generateDataclass(classes: PythonClass[], settings: PythonGeneratorSettings): string {
  const lines: string[] = [];
  const indent = ' '.repeat(settings.indentSize);
  
  // Imports
  if (settings.includeImports) {
    if (settings.includeFromFuture) {
      lines.push('from __future__ import annotations');
      lines.push('');
    }
    
    const decoratorArgs: string[] = [];
    if (settings.dataclassFrozen) decoratorArgs.push('frozen=True');
    if (settings.dataclassSlots) decoratorArgs.push('slots=True');
    if (settings.dataclassKwOnly) decoratorArgs.push('kw_only=True');
    
    lines.push('from dataclasses import dataclass, field');
    if (settings.includeTypeHints) {
      lines.push('from typing import Optional, Any');
    }
    lines.push('');
  }
  
  // Generate dataclasses (reversed to have dependencies first)
  const reversedClasses = [...classes].reverse();
  
  for (const cls of reversedClasses) {
    const decoratorArgs: string[] = [];
    if (settings.dataclassFrozen) decoratorArgs.push('frozen=True');
    if (settings.dataclassSlots) decoratorArgs.push('slots=True');
    if (settings.dataclassKwOnly) decoratorArgs.push('kw_only=True');
    
    if (decoratorArgs.length > 0) {
      lines.push(`@dataclass(${decoratorArgs.join(', ')})`);
    } else {
      lines.push('@dataclass');
    }
    
    lines.push(`class ${cls.name}:`);
    
    // Sort fields: required first, optional last
    const sortedFields = [...cls.fields].sort((a, b) => {
      if (a.isOptional && !b.isOptional) return 1;
      if (!a.isOptional && b.isOptional) return -1;
      return 0;
    });
    
    for (const field of sortedFields) {
      let fieldType = field.type;
      let defaultValue = '';
      
      if (field.isOptional && settings.useOptionalForNullable) {
        fieldType = formatOptionalType(fieldType, settings);
        defaultValue = ' = None';
      }
      
      if (settings.includeTypeHints) {
        lines.push(`${indent}${field.name}: ${fieldType}${defaultValue}`);
      } else {
        lines.push(`${indent}${field.name}${defaultValue}`);
      }
    }
    
    lines.push('');
  }
  
  return lines.join('\n');
}

function generatePydantic(classes: PythonClass[], settings: PythonGeneratorSettings): string {
  const lines: string[] = [];
  const indent = ' '.repeat(settings.indentSize);
  
  // Imports
  if (settings.includeImports) {
    if (settings.includeFromFuture) {
      lines.push('from __future__ import annotations');
      lines.push('');
    }
    
    if (settings.pydanticVersion === 'v2') {
      lines.push('from pydantic import BaseModel, Field');
    } else {
      lines.push('from pydantic import BaseModel, Field');
    }
    
    if (settings.includeTypeHints) {
      lines.push('from typing import Optional, Any');
    }
    
    // Special types
    const hasSpecialTypes = classes.some(cls => 
      cls.fields.some(f => 
        f.type === 'datetime' || f.type === 'UUID' || 
        f.type === 'EmailStr' || f.type === 'HttpUrl'
      )
    );
    
    if (hasSpecialTypes) {
      lines.push('from datetime import datetime');
      lines.push('from uuid import UUID');
      if (settings.pydanticVersion === 'v2') {
        lines.push('from pydantic import EmailStr, HttpUrl');
      }
    }
    
    lines.push('');
  }
  
  // Generate Pydantic models (reversed to have dependencies first)
  const reversedClasses = [...classes].reverse();
  
  for (const cls of reversedClasses) {
    lines.push(`class ${cls.name}(BaseModel):`);
    
    // Model config for Pydantic v2
    if (settings.pydanticVersion === 'v2' && settings.pydanticStrict) {
      lines.push(`${indent}model_config = {'strict': True}`);
      lines.push('');
    }
    
    for (const field of cls.fields) {
      let fieldType = field.type;
      let fieldDef = '';
      
      if (field.isOptional && settings.useOptionalForNullable) {
        fieldType = formatOptionalType(fieldType, settings);
        fieldDef = ' = None';
      }
      
      // Add Field if name differs
      if (field.name !== field.originalName) {
        if (settings.pydanticVersion === 'v2') {
          fieldDef = ` = Field(alias="${field.originalName}")`;
        } else {
          fieldDef = ` = Field(..., alias="${field.originalName}")`;
        }
      }
      
      if (settings.includeTypeHints) {
        lines.push(`${indent}${field.name}: ${fieldType}${fieldDef}`);
      } else {
        lines.push(`${indent}${field.name}${fieldDef}`);
      }
    }
    
    lines.push('');
  }
  
  return lines.join('\n');
}

function generateNamedTuple(classes: PythonClass[], settings: PythonGeneratorSettings): string {
  const lines: string[] = [];
  
  // Imports
  if (settings.includeImports) {
    if (settings.includeFromFuture) {
      lines.push('from __future__ import annotations');
      lines.push('');
    }
    lines.push('from typing import NamedTuple, Optional, Any');
    lines.push('');
  }
  
  // Generate NamedTuples (reversed to have dependencies first)
  const reversedClasses = [...classes].reverse();
  
  for (const cls of reversedClasses) {
    lines.push(`class ${cls.name}(NamedTuple):`);
    
    const indent = ' '.repeat(settings.indentSize);
    
    for (const field of cls.fields) {
      let fieldType = field.type;
      if (field.isOptional && settings.useOptionalForNullable) {
        fieldType = formatOptionalType(fieldType, settings);
      }
      
      if (settings.includeTypeHints) {
        lines.push(`${indent}${field.name}: ${fieldType}`);
      } else {
        lines.push(`${indent}${field.name}`);
      }
    }
    
    lines.push('');
  }
  
  return lines.join('\n');
}

function generateAttrs(classes: PythonClass[], settings: PythonGeneratorSettings): string {
  const lines: string[] = [];
  const indent = ' '.repeat(settings.indentSize);
  
  // Imports
  if (settings.includeImports) {
    if (settings.includeFromFuture) {
      lines.push('from __future__ import annotations');
      lines.push('');
    }
    lines.push('import attr');
    if (settings.includeTypeHints) {
      lines.push('from typing import Optional, Any');
    }
    lines.push('');
  }
  
  // Generate attrs classes (reversed to have dependencies first)
  const reversedClasses = [...classes].reverse();
  
  for (const cls of reversedClasses) {
    lines.push('@attr.s(auto_attribs=True)');
    lines.push(`class ${cls.name}:`);
    
    // Sort fields: required first, optional last
    const sortedFields = [...cls.fields].sort((a, b) => {
      if (a.isOptional && !b.isOptional) return 1;
      if (!a.isOptional && b.isOptional) return -1;
      return 0;
    });
    
    for (const field of sortedFields) {
      let fieldType = field.type;
      let defaultValue = '';
      
      if (field.isOptional && settings.useOptionalForNullable) {
        fieldType = formatOptionalType(fieldType, settings);
        defaultValue = ' = None';
      }
      
      if (settings.includeTypeHints) {
        lines.push(`${indent}${field.name}: ${fieldType}${defaultValue}`);
      } else {
        lines.push(`${indent}${field.name}${defaultValue}`);
      }
    }
    
    lines.push('');
  }
  
  return lines.join('\n');
}

export function convertJSONToPython(
  jsonInput: string,
  userSettings?: Partial<PythonGeneratorSettings>
): PythonGenerationResult {
  const settings: PythonGeneratorSettings = { ...DEFAULT_PYTHON_SETTINGS, ...userSettings };
  
  try {
    const parsed = JSON.parse(jsonInput);
    
    if (typeof parsed !== 'object' || parsed === null) {
      return {
        success: false,
        errors: [{ message: 'Input must be a JSON object or array' }],
      };
    }
    
    // For dict output, just convert the value directly
    if (settings.outputFormat === 'dict') {
      if (Array.isArray(parsed)) {
        return {
          success: false,
          errors: [{ message: 'Input must be a JSON object for dictionary output' }],
        };
      }
      return {
        success: true,
        code: generateDict(parsed, settings),
        classCount: 0,
      };
    }
    
    // For class-based outputs, analyze the structure
    if (Array.isArray(parsed)) {
      return {
        success: false,
        errors: [{ message: 'Input must be a JSON object for class generation' }],
      };
    }
    
    const classes: PythonClass[] = [];
    analyzeObject(parsed, settings.className, settings, classes);
    
    let code: string;
    
    switch (settings.outputFormat) {
      case 'typeddict':
        code = generateTypedDict(classes, settings);
        break;
      case 'dataclass':
        code = generateDataclass(classes, settings);
        break;
      case 'pydantic':
        code = generatePydantic(classes, settings);
        break;
      case 'namedtuple':
        code = generateNamedTuple(classes, settings);
        break;
      case 'attrs':
        code = generateAttrs(classes, settings);
        break;
      default:
        code = generateDataclass(classes, settings);
    }
    
    return {
      success: true,
      code,
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
