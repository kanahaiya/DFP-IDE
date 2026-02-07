import { inferType, toPascalCase, toCamelCase } from '@/lib/code-gen';
import type { HaskellGeneratorSettings, HaskellConversionResult, HaskellTypeInfo, HaskellFieldInfo } from './types';

const DEFAULT_SETTINGS: HaskellGeneratorSettings = {
  rootClassName: 'Root',
  indentation: 2,
  useNullableTypes: true,
  outputMode: 'records',
  aesonStyle: 'generic',
  namingConvention: 'camelCase',
  deriveGeneric: true,
  deriveShow: true,
  deriveEq: true,
  generateToJSON: true,
  generateFromJSON: true,
  useStrictFields: false,
  addDocComments: true,
  modulePrefix: 'Data',
  fieldLabelModifier: true,
};

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export function convertJSONToHaskell(jsonString: string, settings: Partial<HaskellGeneratorSettings> = {}): HaskellConversionResult {
  const config = { ...DEFAULT_SETTINGS, ...settings };
  
  try {
    const parsed = JSON.parse(jsonString);
    const types: HaskellTypeInfo[] = [];
    const typeMap = new Map<string, HaskellTypeInfo>();
    
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

function getHaskellType(value: JsonValue, fieldName: string, types: HaskellTypeInfo[], typeMap: Map<string, HaskellTypeInfo>, config: HaskellGeneratorSettings): string {
  if (value === null) return 'Maybe a';
  if (typeof value === 'boolean') return 'Bool';
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return 'Int';
    return 'Double';
  }
  if (typeof value === 'string') return 'Text';
  
  if (Array.isArray(value)) {
    if (value.length === 0) return '[a]';
    const elemType = getHaskellType(value[0], fieldName + 'Item', types, typeMap, config);
    return `[${elemType}]`;
  }
  
  if (typeof value === 'object') {
    const typeName = toPascalCase(fieldName);
    processValue(value, typeName, types, typeMap, config);
    return typeName;
  }
  
  return 'Value';
}

function processValue(value: JsonValue, typeName: string, types: HaskellTypeInfo[], typeMap: Map<string, HaskellTypeInfo>, config: HaskellGeneratorSettings): void {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return;
  if (typeMap.has(typeName)) return;
  
  const fields: HaskellFieldInfo[] = [];
  const prefix = typeName.charAt(0).toLowerCase() + typeName.slice(1);
  
  for (const [key, val] of Object.entries(value)) {
    const fieldName = config.fieldLabelModifier 
      ? `${prefix}${toPascalCase(key)}`
      : toCamelCase(key);
    const haskellType = getHaskellType(val as JsonValue, toPascalCase(key), types, typeMap, config);
    const inferred = inferType(val);
    
    fields.push({
      name: fieldName,
      originalName: key,
      originalKey: key,
      recordField: fieldName,
      type: inferred,
      isRequired: val !== null,
      haskellType: val === null ? `Maybe ${haskellType}` : haskellType,
    });
  }
  
  const typeInfo: HaskellTypeInfo = {
    name: typeName,
    fields,
    nestedClasses: [],
    dataDecl: '',
    aesonInstance: '',
  };
  
  types.push(typeInfo);
  typeMap.set(typeName, typeInfo);
}

function generateModule(types: HaskellTypeInfo[], config: HaskellGeneratorSettings): string {
  const lines: string[] = [];
  
  // Language extensions
  lines.push('{-# LANGUAGE DeriveGeneric #-}');
  lines.push('{-# LANGUAGE OverloadedStrings #-}');
  if (config.aesonStyle === 'template-haskell') {
    lines.push('{-# LANGUAGE TemplateHaskell #-}');
  }
  if (config.useStrictFields) {
    lines.push('{-# LANGUAGE StrictData #-}');
  }
  lines.push('');
  
  // Module declaration
  lines.push(`module ${config.modulePrefix}.${config.rootClassName}`);
  lines.push('  ( ' + types.map(t => t.name).join('\n  , '));
  lines.push('  ) where');
  lines.push('');
  
  // Imports
  lines.push('import Data.Aeson');
  if (config.aesonStyle === 'template-haskell') {
    lines.push('import Data.Aeson.TH');
  }
  lines.push('import Data.Text (Text)');
  lines.push('import GHC.Generics (Generic)');
  lines.push('');
  lines.push('');
  
  // Generate types
  for (const typeInfo of [...types].reverse()) {
    // Documentation comment
    if (config.addDocComments) {
      lines.push(`-- | ${typeInfo.name} data type`);
    }
    
    // Data declaration
    lines.push(`data ${typeInfo.name} = ${typeInfo.name}`);
    lines.push('  {');
    for (let i = 0; i < typeInfo.fields.length; i++) {
      const field = typeInfo.fields[i];
      const prefix = i === 0 ? ' ' : ',';
      const strictPrefix = config.useStrictFields ? '!' : '';
      lines.push(`  ${prefix} ${field.recordField} :: ${strictPrefix}${field.haskellType}`);
    }
    lines.push('  }');
    
    // Deriving clause
    const derives: string[] = [];
    if (config.deriveGeneric) derives.push('Generic');
    if (config.deriveShow) derives.push('Show');
    if (config.deriveEq) derives.push('Eq');
    if (derives.length > 0) {
      lines.push(`  deriving (${derives.join(', ')})`);
    }
    lines.push('');
    
    // Aeson instances
    if (config.aesonStyle === 'generic') {
      if (config.generateFromJSON) {
        if (config.fieldLabelModifier) {
          lines.push(`instance FromJSON ${typeInfo.name} where`);
          lines.push(`  parseJSON = genericParseJSON defaultOptions`);
          lines.push(`    { fieldLabelModifier = drop ${typeInfo.name.length} }`);
        } else {
          lines.push(`instance FromJSON ${typeInfo.name}`);
        }
        lines.push('');
      }
      if (config.generateToJSON) {
        if (config.fieldLabelModifier) {
          lines.push(`instance ToJSON ${typeInfo.name} where`);
          lines.push(`  toJSON = genericToJSON defaultOptions`);
          lines.push(`    { fieldLabelModifier = drop ${typeInfo.name.length} }`);
        } else {
          lines.push(`instance ToJSON ${typeInfo.name}`);
        }
        lines.push('');
      }
    } else if (config.aesonStyle === 'template-haskell') {
      const options = config.fieldLabelModifier 
        ? `defaultOptions { fieldLabelModifier = drop ${typeInfo.name.length} }`
        : 'defaultOptions';
      lines.push(`$(deriveJSON ${options} ''${typeInfo.name})`);
      lines.push('');
    } else if (config.aesonStyle === 'manual') {
      // Manual instance
      if (config.generateFromJSON) {
        lines.push(`instance FromJSON ${typeInfo.name} where`);
        lines.push(`  parseJSON = withObject "${typeInfo.name}" $ \\v -> ${typeInfo.name}`);
        for (let i = 0; i < typeInfo.fields.length; i++) {
          const field = typeInfo.fields[i];
          const op = i === 0 ? '<$>' : '<*>';
          lines.push(`    ${op} v .: "${field.originalKey}"`);
        }
        lines.push('');
      }
      if (config.generateToJSON) {
        lines.push(`instance ToJSON ${typeInfo.name} where`);
        lines.push(`  toJSON ${typeInfo.name}{..} = object`);
        lines.push(`    [`);
        for (let i = 0; i < typeInfo.fields.length; i++) {
          const field = typeInfo.fields[i];
          const prefix = i === 0 ? ' ' : ',';
          lines.push(`    ${prefix} "${field.originalKey}" .= ${field.recordField}`);
        }
        lines.push(`    ]`);
        lines.push('');
      }
    }
    lines.push('');
  }
  
  return lines.join('\n').trim();
}

export { DEFAULT_SETTINGS };
