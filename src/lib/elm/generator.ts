import { inferType, toPascalCase, toCamelCase } from '@/lib/code-gen';
import type { ElmGeneratorSettings, ElmConversionResult, ElmTypeInfo, ElmFieldInfo } from './types';

const DEFAULT_SETTINGS: ElmGeneratorSettings = {
  rootClassName: 'Root',
  indentation: 4,
  useNullableTypes: true,
  outputMode: 'full',
  namingStyle: 'camelCase',
  generateTypeAliases: true,
  generateDecoders: true,
  generateEncoders: true,
  usePipeline: true,
  modulePrefix: 'Data',
  exposeAll: true,
  addComments: true,
};

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export function convertJSONToElm(jsonString: string, settings: Partial<ElmGeneratorSettings> = {}): ElmConversionResult {
  const config = { ...DEFAULT_SETTINGS, ...settings };
  
  try {
    const parsed = JSON.parse(jsonString);
    const types: ElmTypeInfo[] = [];
    const typeMap = new Map<string, ElmTypeInfo>();
    
    processValue(parsed, config.rootClassName, types, typeMap, config);
    
    const moduleCode = generateModule(types, config);
    
    return {
      success: true,
      code: moduleCode,
      types,
      moduleCode,
    };
  } catch (e) {
    return {
      success: false,
      code: '',
      errors: [{ message: e instanceof Error ? e.message : 'Invalid JSON', type: 'syntax' }],
      types: [],
      moduleCode: '',
    };
  }
}

function getElmType(value: JsonValue, fieldName: string, types: ElmTypeInfo[], typeMap: Map<string, ElmTypeInfo>, config: ElmGeneratorSettings): { type: string; decoder: string; encoder: string } {
  if (value === null) return { type: 'Maybe a', decoder: 'Decode.null Nothing', encoder: 'always Encode.null' };
  if (typeof value === 'boolean') return { type: 'Bool', decoder: 'Decode.bool', encoder: 'Encode.bool' };
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return { type: 'Int', decoder: 'Decode.int', encoder: 'Encode.int' };
    return { type: 'Float', decoder: 'Decode.float', encoder: 'Encode.float' };
  }
  if (typeof value === 'string') return { type: 'String', decoder: 'Decode.string', encoder: 'Encode.string' };
  
  if (Array.isArray(value)) {
    if (value.length === 0) return { type: 'List a', decoder: 'Decode.list Decode.value', encoder: 'Encode.list identity' };
    const elemInfo = getElmType(value[0], fieldName + 'Item', types, typeMap, config);
    return {
      type: `List ${elemInfo.type.includes(' ') ? `(${elemInfo.type})` : elemInfo.type}`,
      decoder: `Decode.list ${elemInfo.decoder.includes(' ') ? `(${elemInfo.decoder})` : elemInfo.decoder}`,
      encoder: `Encode.list ${elemInfo.encoder.includes(' ') ? `(${elemInfo.encoder})` : elemInfo.encoder}`,
    };
  }
  
  if (typeof value === 'object') {
    const typeName = toPascalCase(fieldName);
    processValue(value, typeName, types, typeMap, config);
    return {
      type: typeName,
      decoder: `${toCamelCase(typeName)}Decoder`,
      encoder: `encode${typeName}`,
    };
  }
  
  return { type: 'Value', decoder: 'Decode.value', encoder: 'identity' };
}

function processValue(value: JsonValue, typeName: string, types: ElmTypeInfo[], typeMap: Map<string, ElmTypeInfo>, config: ElmGeneratorSettings): void {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return;
  if (typeMap.has(typeName)) return;
  
  const fields: ElmFieldInfo[] = [];
  
  for (const [key, val] of Object.entries(value)) {
    const fieldName = toCamelCase(key);
    const elmInfo = getElmType(val as JsonValue, toPascalCase(key), types, typeMap, config);
    const inferred = inferType(val);
    
    fields.push({
      name: fieldName,
      originalName: key,
      originalKey: key,
      type: inferred,
      isRequired: val !== null,
      elmType: elmInfo.type,
      decoderExpr: elmInfo.decoder,
      encoderExpr: elmInfo.encoder,
    });
  }
  
  const typeInfo: ElmTypeInfo = {
    name: typeName,
    fields,
    nestedClasses: [],
    typeAlias: '',
    decoder: '',
    encoder: '',
  };
  
  types.push(typeInfo);
  typeMap.set(typeName, typeInfo);
}

function generateModule(types: ElmTypeInfo[], config: ElmGeneratorSettings): string {
  const lines: string[] = [];
  const indentSize = typeof config.indentation === 'number' ? config.indentation : 4;
  const indent = ' '.repeat(indentSize);
  
  // Module declaration
  const exports = config.exposeAll ? '..' : types.map(t => t.name).join(', ');
  lines.push(`module ${config.modulePrefix}.${config.rootClassName} exposing (${exports})`);
  lines.push('');
  
  // Imports
  if (config.generateDecoders || config.generateEncoders) {
    lines.push('import Json.Decode as Decode exposing (Decoder)');
    if (config.usePipeline) {
      lines.push('import Json.Decode.Pipeline exposing (required, optional)');
    }
  }
  if (config.generateEncoders) {
    lines.push('import Json.Encode as Encode');
  }
  lines.push('');
  lines.push('');
  
  // Generate types and functions
  for (const typeInfo of [...types].reverse()) {
    // Type alias
    if (config.generateTypeAliases) {
      if (config.addComments) {
        lines.push(`{-| ${typeInfo.name} type -}`);
      }
      lines.push(`type alias ${typeInfo.name} =`);
      lines.push(`${indent}{`);
      for (let i = 0; i < typeInfo.fields.length; i++) {
        const field = typeInfo.fields[i];
        const prefix = i === 0 ? ' ' : ',';
        lines.push(`${indent}${prefix} ${field.name} : ${field.elmType}`);
      }
      lines.push(`${indent}}`);
      lines.push('');
      lines.push('');
    }
    
    // Decoder
    if (config.generateDecoders) {
      if (config.addComments) {
        lines.push(`{-| Decoder for ${typeInfo.name} -}`);
      }
      const decoderName = `${toCamelCase(typeInfo.name)}Decoder`;
      lines.push(`${decoderName} : Decoder ${typeInfo.name}`);
      lines.push(`${decoderName} =`);
      
      if (config.usePipeline) {
        lines.push(`${indent}Decode.succeed ${typeInfo.name}`);
        for (const field of typeInfo.fields) {
          lines.push(`${indent}${indent}|> required "${field.originalKey}" ${field.decoderExpr}`);
        }
      } else {
        lines.push(`${indent}Decode.map${typeInfo.fields.length > 1 ? typeInfo.fields.length : ''} ${typeInfo.name}`);
        for (const field of typeInfo.fields) {
          lines.push(`${indent}${indent}(Decode.field "${field.originalKey}" ${field.decoderExpr})`);
        }
      }
      lines.push('');
      lines.push('');
    }
    
    // Encoder
    if (config.generateEncoders) {
      if (config.addComments) {
        lines.push(`{-| Encoder for ${typeInfo.name} -}`);
      }
      const encoderName = `encode${typeInfo.name}`;
      lines.push(`${encoderName} : ${typeInfo.name} -> Encode.Value`);
      lines.push(`${encoderName} record =`);
      lines.push(`${indent}Encode.object`);
      lines.push(`${indent}${indent}[`);
      for (let i = 0; i < typeInfo.fields.length; i++) {
        const field = typeInfo.fields[i];
        const prefix = i === 0 ? ' ' : ',';
        lines.push(`${indent}${indent}${prefix} ( "${field.originalKey}", ${field.encoderExpr} record.${field.name} )`);
      }
      lines.push(`${indent}${indent}]`);
      lines.push('');
      lines.push('');
    }
  }
  
  return lines.join('\n').trim();
}

export { DEFAULT_SETTINGS };
