import { inferType, toPascalCase, toSnakeCase } from '@/lib/code-gen';
import type { CppGeneratorSettings, CppConversionResult, CppClassInfo, CppFieldInfo } from './types';

const DEFAULT_SETTINGS: CppGeneratorSettings = {
  rootClassName: 'Root',
  indentation: 4,
  useNullableTypes: true,
  library: 'nlohmann',
  cppStandard: 'cpp17',
  outputMode: 'header-only',
  includeNullable: true,
  useOptional: true,
  generateConstructors: true,
  generateGettersSetters: false,
  useSmartPointers: false,
  addSerializationMacros: true,
  includeValidation: false,
  useStringView: false,
  generateComments: true,
  namespacePrefix: '',
  headerGuardStyle: 'pragma',
  indentStyle: 'spaces',
  indentSize: 4,
};

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export function convertJSONToCpp(jsonString: string, settings: Partial<CppGeneratorSettings> = {}): CppConversionResult {
  const config = { ...DEFAULT_SETTINGS, ...settings };
  
  try {
    const parsed = JSON.parse(jsonString);
    const classes: CppClassInfo[] = [];
    const classMap = new Map<string, CppClassInfo>();
    
    processValue(parsed, config.rootClassName, classes, classMap, config);
    
    const headerContent = generateHeader(classes, config);
    const sourceContent = config.outputMode === 'header-source' ? generateSource(classes, config) : undefined;
    
    return {
      success: true,
      code: sourceContent ? `${headerContent}\n\n// ==================== SOURCE FILE ====================\n\n${sourceContent}` : headerContent,
      classes,
      headerContent,
      sourceContent,
    };
  } catch (e) {
    return {
      success: false,
      code: '',
      errors: [{ message: e instanceof Error ? e.message : 'Invalid JSON', type: 'syntax' }],
      classes: [],
      headerContent: '',
    };
  }
}

function processValue(value: JsonValue, className: string, classes: CppClassInfo[], classMap: Map<string, CppClassInfo>, config: CppGeneratorSettings): string {
  if (value === null) return config.useOptional ? 'std::optional<std::nullptr_t>' : 'void*';
  if (typeof value === 'boolean') return 'bool';
  if (typeof value === 'number') return Number.isInteger(value) ? 'int64_t' : 'double';
  if (typeof value === 'string') return config.useStringView && config.cppStandard >= 'cpp17' ? 'std::string_view' : 'std::string';
  
  if (Array.isArray(value)) {
    if (value.length === 0) return 'std::vector<nlohmann::json>';
    const elemType = processValue(value[0], className + 'Item', classes, classMap, config);
    return `std::vector<${elemType}>`;
  }
  
  if (typeof value === 'object') {
    const existingClass = classMap.get(className);
    if (existingClass) return className;
    
    const fields: CppFieldInfo[] = [];
    for (const [key, val] of Object.entries(value)) {
      const fieldName = toSnakeCase(key);
      const nestedClassName = toPascalCase(key);
      const cppType = processValue(val as JsonValue, nestedClassName, classes, classMap, config);
      const inferred = inferType(val);
      
      fields.push({
        name: fieldName,
        originalName: key,
        type: inferred,
        isRequired: val !== null,
        cppType,
        isOptional: val === null,
      });
    }
    
    const classInfo: CppClassInfo = {
      name: className,
      fields,
      nestedClasses: [],
      headerCode: '',
    };
    
    classes.push(classInfo);
    classMap.set(className, classInfo);
    return className;
  }
  
  return 'nlohmann::json';
}

function generateHeader(classes: CppClassInfo[], config: CppGeneratorSettings): string {
  const indent = config.indentStyle === 'tabs' ? '\t' : ' '.repeat(config.indentSize);
  const lines: string[] = [];
  
  // Header guard
  if (config.headerGuardStyle === 'pragma') {
    lines.push('#pragma once');
  } else {
    const guard = `${config.namespacePrefix ? config.namespacePrefix.toUpperCase() + '_' : ''}${config.rootClassName.toUpperCase()}_HPP`;
    lines.push(`#ifndef ${guard}`);
    lines.push(`#define ${guard}`);
  }
  lines.push('');
  
  // Includes
  lines.push('#include <string>');
  lines.push('#include <vector>');
  if (config.useOptional && config.cppStandard >= 'cpp17') lines.push('#include <optional>');
  if (config.useSmartPointers) lines.push('#include <memory>');
  if (config.useStringView && config.cppStandard >= 'cpp17') lines.push('#include <string_view>');
  
  if (config.library === 'nlohmann') lines.push('#include <nlohmann/json.hpp>');
  else if (config.library === 'rapidjson') { lines.push('#include <rapidjson/document.h>'); lines.push('#include <rapidjson/writer.h>'); }
  else if (config.library === 'jsoncpp') lines.push('#include <json/json.h>');
  else if (config.library === 'boost') { lines.push('#include <boost/json.hpp>'); lines.push('#include <boost/describe.hpp>'); }
  
  lines.push('');
  
  // Namespace
  if (config.namespacePrefix) { lines.push(`namespace ${config.namespacePrefix} {`); lines.push(''); }
  
  // Forward declarations
  if (classes.length > 1) {
    lines.push('// Forward declarations');
    for (const cls of classes) lines.push(`${config.outputMode === 'class' ? 'class' : 'struct'} ${cls.name};`);
    lines.push('');
  }
  
  // Generate each class/struct
  for (const cls of [...classes].reverse()) {
    if (config.generateComments) lines.push(`/**\n * @brief ${cls.name} structure\n */`);
    lines.push(`${config.outputMode === 'class' ? 'class' : 'struct'} ${cls.name} {`);
    if (config.outputMode === 'class') lines.push('public:');
    
    // Fields
    for (const field of cls.fields) {
      const type = config.useOptional && field.isOptional ? `std::optional<${field.cppType}>` : field.cppType;
      lines.push(`${indent}${type} ${field.name};`);
    }
    
    // Constructor
    if (config.generateConstructors) {
      lines.push('');
      lines.push(`${indent}${cls.name}() = default;`);
    }
    
    // Serialization for nlohmann
    if (config.library === 'nlohmann' && config.addSerializationMacros) {
      lines.push('');
      const fieldList = cls.fields.map(f => f.name).join(', ');
      lines.push(`${indent}NLOHMANN_DEFINE_TYPE_INTRUSIVE(${cls.name}, ${fieldList})`);
    }
    
    lines.push('};');
    lines.push('');
  }
  
  // Close namespace
  if (config.namespacePrefix) { lines.push(`} // namespace ${config.namespacePrefix}`); lines.push(''); }
  
  // Close header guard
  if (config.headerGuardStyle === 'ifndef') {
    const guard = `${config.namespacePrefix ? config.namespacePrefix.toUpperCase() + '_' : ''}${config.rootClassName.toUpperCase()}_HPP`;
    lines.push(`#endif // ${guard}`);
  }
  
  return lines.join('\n');
}

function generateSource(classes: CppClassInfo[], config: CppGeneratorSettings): string {
  const lines: string[] = [];
  lines.push(`#include "${config.rootClassName.toLowerCase()}.hpp"`);
  lines.push('');
  
  if (config.namespacePrefix) { lines.push(`namespace ${config.namespacePrefix} {`); lines.push(''); }
  
  // Add any implementation code if needed
  for (const cls of [...classes].reverse()) {
    if (config.library === 'rapidjson' || config.library === 'jsoncpp') {
      lines.push(`// ${cls.name} serialization`);
      lines.push(`// TODO: Implement to_json and from_json for ${cls.name}`);
      lines.push('');
    }
  }
  
  if (config.namespacePrefix) lines.push(`} // namespace ${config.namespacePrefix}`);
  
  return lines.join('\n');
}

export { DEFAULT_SETTINGS };
