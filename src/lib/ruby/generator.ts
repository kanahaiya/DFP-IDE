import { inferType, toPascalCase, toSnakeCase } from '@/lib/code-gen';
import type { RubyGeneratorSettings, RubyConversionResult, RubyClassInfo, RubyFieldInfo } from './types';

const DEFAULT_SETTINGS: RubyGeneratorSettings = {
  rootClassName: 'Root',
  indentation: 2,
  useNullableTypes: true,
  hashSyntax: 'symbols',
  outputMode: 'hash',
  stringQuote: 'single',
  freezeStrings: true,
  addTypeSig: false,
  useSymbols: true,
  generateAccessors: true,
  generateInitialize: true,
  generateToJson: false,
  generateFromJson: false,
  addFrozenStringLiteral: true,
  indentSpaces: 2,
};

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export function convertJSONToRuby(jsonString: string, settings: Partial<RubyGeneratorSettings> = {}): RubyConversionResult {
  const config = { ...DEFAULT_SETTINGS, ...settings };
  
  try {
    const parsed = JSON.parse(jsonString);
    
    if (config.outputMode === 'hash') {
      const hashOutput = generateHash(parsed, config, 0);
      return {
        success: true,
        code: config.addFrozenStringLiteral ? `# frozen_string_literal: true\n\n${hashOutput}` : hashOutput,
        classes: [],
        hashOutput,
      };
    }
    
    // Generate classes/structs
    const classes: RubyClassInfo[] = [];
    const classMap = new Map<string, RubyClassInfo>();
    
    processValue(parsed, config.rootClassName, classes, classMap, config);
    
    const classOutput = generateClasses(classes, config);
    
    return {
      success: true,
      code: config.addFrozenStringLiteral ? `# frozen_string_literal: true\n\n${classOutput}` : classOutput,
      classes,
      classOutput,
    };
  } catch (e) {
    return {
      success: false,
      code: '',
      errors: [{ message: e instanceof Error ? e.message : 'Invalid JSON', type: 'syntax' }],
      classes: [],
    };
  }
}

function generateHash(value: JsonValue, config: RubyGeneratorSettings, depth: number): string {
  const indent = ' '.repeat(config.indentSpaces * depth);
  const innerIndent = ' '.repeat(config.indentSpaces * (depth + 1));
  const q = config.stringQuote === 'single' ? "'" : '"';
  
  if (value === null) return 'nil';
  if (typeof value === 'boolean') return value.toString();
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'string') return `${q}${escapeString(value, config.stringQuote)}${q}`;
  
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map(v => generateHash(v, config, depth + 1));
    if (items.join(', ').length < 60) return `[${items.join(', ')}]`;
    return `[\n${items.map(i => `${innerIndent}${i}`).join(',\n')}\n${indent}]`;
  }
  
  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';
    
    const pairs = entries.map(([key, val]) => {
      const keyStr = formatKey(key, config);
      const valStr = generateHash(val as JsonValue, config, depth + 1);
      return `${innerIndent}${keyStr} => ${valStr}`;
    });
    
    return `{\n${pairs.join(",\n")}\n${indent}}`;
  }
  
  return 'nil';
}

function formatKey(key: string, config: RubyGeneratorSettings): string {
  const q = config.stringQuote === 'single' ? "'" : '"';
  
  switch (config.hashSyntax) {
    case 'symbols':
      // New Ruby 1.9+ symbol syntax: key: value
      if (/^[a-z_][a-z0-9_]*$/i.test(key)) {
        return `${toSnakeCase(key)}:`;
      }
      return `${q}${key}${q}:`;
    case 'rockets':
      // Old hashrocket syntax: :key => value
      if (/^[a-z_][a-z0-9_]*$/i.test(key)) {
        return `:${toSnakeCase(key)}`;
      }
      return `${q}${key}${q}`;
    case 'strings':
      return `${q}${key}${q}`;
    case 'mixed':
    default:
      if (/^[a-z_][a-z0-9_]*$/i.test(key)) {
        return `${toSnakeCase(key)}:`;
      }
      return `${q}${key}${q} =>`; 
  }
}

function escapeString(str: string, quote: 'single' | 'double'): string {
  if (quote === 'single') {
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function processValue(value: JsonValue, className: string, classes: RubyClassInfo[], classMap: Map<string, RubyClassInfo>, config: RubyGeneratorSettings): string {
  if (value === null) return 'NilClass';
  if (typeof value === 'boolean') return 'Boolean';
  if (typeof value === 'number') return Number.isInteger(value) ? 'Integer' : 'Float';
  if (typeof value === 'string') return 'String';
  
  if (Array.isArray(value)) {
    if (value.length === 0) return 'Array';
    const elemType = processValue(value[0], className + 'Item', classes, classMap, config);
    return `Array<${elemType}>`;
  }
  
  if (typeof value === 'object') {
    const existingClass = classMap.get(className);
    if (existingClass) return className;
    
    const fields: RubyFieldInfo[] = [];
    for (const [key, val] of Object.entries(value)) {
      const fieldName = toSnakeCase(key);
      const nestedClassName = toPascalCase(key);
      const rubyType = processValue(val as JsonValue, nestedClassName, classes, classMap, config);
      const inferred = inferType(val);
      
      fields.push({
        name: fieldName,
        originalName: key,
        originalKey: key,
        symbolName: `:${fieldName}`,
        type: inferred,
        isRequired: val !== null,
        rubyType,
      });
    }
    
    const classInfo: RubyClassInfo = {
      name: className,
      fields,
      nestedClasses: [],
      rubyCode: '',
    };
    
    classes.push(classInfo);
    classMap.set(className, classInfo);
    return className;
  }
  
  return 'Object';
}

function generateClasses(classes: RubyClassInfo[], config: RubyGeneratorSettings): string {
  const lines: string[] = [];
  const indent = ' '.repeat(config.indentSpaces);
  
  for (const cls of [...classes].reverse()) {
    switch (config.outputMode) {
      case 'struct':
        lines.push(generateStruct(cls, config, indent));
        break;
      case 'ostruct':
        lines.push(generateOpenStruct(cls));
        break;
      case 'data':
        lines.push(generateDataClass(cls));
        break;
      case 'class':
      default:
        lines.push(generateClass(cls, config, indent));
    }
    lines.push('');
  }
  
  return lines.join('\n').trim();
}

function generateClass(cls: RubyClassInfo, config: RubyGeneratorSettings, indent: string): string {
  const lines: string[] = [];
  
  lines.push(`class ${cls.name}`);
  
  // Accessors
  if (config.generateAccessors && cls.fields.length > 0) {
    const attrs = cls.fields.map(f => `:${f.name}`).join(', ');
    lines.push(`${indent}attr_accessor ${attrs}`);
    lines.push('');
  }
  
  // Initialize
  if (config.generateInitialize) {
    const params = cls.fields.map(f => `${f.name}: nil`).join(', ');
    lines.push(`${indent}def initialize(${params})`);
    for (const field of cls.fields) {
      lines.push(`${indent}${indent}@${field.name} = ${field.name}`);
    }
    lines.push(`${indent}end`);
  }
  
  // to_json
  if (config.generateToJson) {
    lines.push('');
    lines.push(`${indent}def to_h`);
    lines.push(`${indent}${indent}{`);
    for (const field of cls.fields) {
      const q = config.stringQuote === 'single' ? "'" : '"';
      lines.push(`${indent}${indent}${indent}${q}${field.originalKey}${q} => @${field.name},`);
    }
    lines.push(`${indent}${indent}}`);
    lines.push(`${indent}end`);
    lines.push('');
    lines.push(`${indent}def to_json(*args)`);
    lines.push(`${indent}${indent}to_h.to_json(*args)`);
    lines.push(`${indent}end`);
  }
  
  // from_json
  if (config.generateFromJson) {
    lines.push('');
    lines.push(`${indent}def self.from_json(json_string)`);
    lines.push(`${indent}${indent}data = JSON.parse(json_string)`);
    lines.push(`${indent}${indent}new(`);
    for (let i = 0; i < cls.fields.length; i++) {
      const field = cls.fields[i];
      const q = config.stringQuote === 'single' ? "'" : '"';
      const comma = i < cls.fields.length - 1 ? ',' : '';
      lines.push(`${indent}${indent}${indent}${field.name}: data[${q}${field.originalKey}${q}]${comma}`);
    }
    lines.push(`${indent}${indent})`);
    lines.push(`${indent}end`);
  }
  
  lines.push('end');
  
  return lines.join('\n');
}

function generateStruct(cls: RubyClassInfo, config: RubyGeneratorSettings, indent: string): string {
  const attrs = cls.fields.map(f => `:${f.name}`).join(', ');
  const lines: string[] = [];
  
  lines.push(`${cls.name} = Struct.new(${attrs}, keyword_init: true) do`);
  
  if (config.generateToJson) {
    lines.push(`${indent}def to_h`);
    lines.push(`${indent}${indent}{`);
    for (const field of cls.fields) {
      const q = config.stringQuote === 'single' ? "'" : '"';
      lines.push(`${indent}${indent}${indent}${q}${field.originalKey}${q} => ${field.name},`);
    }
    lines.push(`${indent}${indent}}`);
    lines.push(`${indent}end`);
  }
  
  lines.push('end');
  
  return lines.join('\n');
}

function generateOpenStruct(cls: RubyClassInfo): string {
  const lines: string[] = [];
  
  lines.push(`${cls.name.toLowerCase()} = OpenStruct.new(`);
  for (let i = 0; i < cls.fields.length; i++) {
    const field = cls.fields[i];
    const comma = i < cls.fields.length - 1 ? ',' : '';
    lines.push(`  ${field.name}: nil${comma}  # ${field.rubyType}`);
  }
  lines.push(')');
  
  return lines.join('\n');
}

function generateDataClass(cls: RubyClassInfo): string {
  const attrs = cls.fields.map(f => `:${f.name}`).join(', ');
  return `${cls.name} = Data.define(${attrs})`;
}

export { DEFAULT_SETTINGS };
