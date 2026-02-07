/**
 * JSON to Objective-C code generator
 */

import type { ObjCGeneratorSettings, ObjCGenerationResult } from './types';
import { DEFAULT_OBJC_SETTINGS } from './types';
import { toPascalCase, toCamelCase } from '../code-gen/nameUtils';

interface ClassDefinition {
  name: string;
  properties: PropertyDefinition[];
}

interface PropertyDefinition {
  name: string;
  originalName: string;
  type: string;
  isObject: boolean;
  isArray: boolean;
  nestedClassName?: string;
  objcType: string;
  propertyAttributes: string;
}

function inferObjCType(value: unknown): { type: string; objcType: string } {
  if (value === null) {
    return { type: 'id', objcType: 'id' };
  }
  
  if (typeof value === 'string') {
    return { type: 'NSString', objcType: 'NSString *' };
  }
  
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      return { type: 'NSInteger', objcType: 'NSInteger' };
    }
    return { type: 'double', objcType: 'double' };
  }
  
  if (typeof value === 'boolean') {
    return { type: 'BOOL', objcType: 'BOOL' };
  }
  
  if (Array.isArray(value)) {
    return { type: 'NSArray', objcType: 'NSArray *' };
  }
  
  return { type: 'id', objcType: 'id' };
}

function convertPropertyName(name: string, settings: ObjCGeneratorSettings): string {
  switch (settings.propertyNaming) {
    case 'PascalCase':
      return toPascalCase(name);
    case 'snake_case':
      return name.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
    case 'preserve':
      return name;
    case 'camelCase':
    default:
      return toCamelCase(name);
  }
}

function convertClassName(name: string, settings: ObjCGeneratorSettings): string {
  return settings.classPrefix + toPascalCase(name);
}

function getPropertyAttributes(prop: PropertyDefinition, settings: ObjCGeneratorSettings): string {
  const attrs: string[] = [];
  
  // Atomicity
  attrs.push(settings.useAtomicProperties ? 'atomic' : 'nonatomic');
  
  // Memory management
  if (prop.objcType.includes('*')) {
    if (settings.useReadonlyProperties) {
      attrs.push('readonly');
    }
    attrs.push(settings.useStrongReferences ? 'strong' : 'weak');
  } else {
    attrs.push('assign');
  }
  
  return attrs.join(', ');
}

function analyzeObject(
  obj: Record<string, unknown>,
  className: string,
  settings: ObjCGeneratorSettings,
  classes: Map<string, ClassDefinition>
): ClassDefinition {
  const properties: PropertyDefinition[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const propertyName = convertPropertyName(key, settings);
    let { type, objcType } = inferObjCType(value);
    let isObject = false;
    const isArray = Array.isArray(value);
    let nestedClassName: string | undefined;
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      isObject = true;
      nestedClassName = convertClassName(key, settings);
      type = nestedClassName;
      objcType = `${nestedClassName} *`;
      
      // Recursively analyze nested object
      const nestedClass = analyzeObject(
        value as Record<string, unknown>,
        nestedClassName,
        settings,
        classes
      );
      classes.set(nestedClassName, nestedClass);
    } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
      isObject = true;
      nestedClassName = convertClassName(key, settings);
      type = 'NSArray';
      objcType = `NSArray<${nestedClassName} *> *`;
      
      // Recursively analyze first array element
      const nestedClass = analyzeObject(
        value[0] as Record<string, unknown>,
        nestedClassName,
        settings,
        classes
      );
      classes.set(nestedClassName, nestedClass);
    }
    
    const prop: PropertyDefinition = {
      name: propertyName,
      originalName: key,
      type,
      isObject,
      isArray,
      nestedClassName,
      objcType,
      propertyAttributes: '',
    };
    
    prop.propertyAttributes = getPropertyAttributes(prop, settings);
    properties.push(prop);
  }
  
  return { name: className, properties };
}

function generateHeaderCode(classDef: ClassDefinition, settings: ObjCGeneratorSettings): string {
  const lines: string[] = [];
  
  // Forward declarations
  const nestedClasses = classDef.properties.filter(p => p.nestedClassName).map(p => p.nestedClassName!);
  for (const nc of nestedClasses) {
    lines.push(`@class ${nc};`);
  }
  if (nestedClasses.length > 0) {
    lines.push('');
  }
  
  // Nullability region
  if (settings.useNullabilityAnnotations && settings.useNonnullByDefault) {
    lines.push('NS_ASSUME_NONNULL_BEGIN');
    lines.push('');
  }
  
  // Interface declaration
  const protocols: string[] = [];
  if (settings.conformToNSCoding) protocols.push('NSCoding');
  if (settings.conformToNSCopying) protocols.push('NSCopying');
  if (settings.conformToNSSecureCoding) protocols.push('NSSecureCoding');
  
  const protocolStr = protocols.length > 0 ? ` <${protocols.join(', ')}>` : '';
  lines.push(`@interface ${classDef.name} : NSObject${protocolStr}`);
  lines.push('');
  
  // Properties
  for (const prop of classDef.properties) {
    let nullability = '';
    if (settings.useNullabilityAnnotations && prop.objcType.includes('*')) {
      nullability = settings.useNonnullByDefault ? '' : ', nullable';
    }
    const attrs = prop.propertyAttributes + nullability;
    lines.push(`@property (${attrs}) ${prop.objcType}${prop.name};`);
  }
  lines.push('');
  
  // Method declarations
  if (settings.generateInitWithDictionary) {
    lines.push('- (instancetype)initWithDictionary:(NSDictionary *)dictionary;');
  }
  if (settings.generateToDictionary) {
    lines.push('- (NSDictionary *)toDictionary;');
  }
  
  lines.push('');
  lines.push('@end');
  
  if (settings.useNullabilityAnnotations && settings.useNonnullByDefault) {
    lines.push('');
    lines.push('NS_ASSUME_NONNULL_END');
  }
  
  return lines.join('\n');
}

function generateImplementationCode(classDef: ClassDefinition, settings: ObjCGeneratorSettings): string {
  const lines: string[] = [];
  
  lines.push(`@implementation ${classDef.name}`);
  lines.push('');
  
  // initWithDictionary
  if (settings.generateInitWithDictionary) {
    lines.push('- (instancetype)initWithDictionary:(NSDictionary *)dictionary {');
    lines.push('    self = [super init];');
    lines.push('    if (self) {');
    
    for (const prop of classDef.properties) {
      if (prop.isObject && prop.nestedClassName && !prop.isArray) {
        lines.push(`        self.${prop.name} = [[${prop.nestedClassName} alloc] initWithDictionary:dictionary[@"${prop.originalName}"]];`);
      } else if (prop.isArray && prop.nestedClassName) {
        lines.push(`        NSMutableArray *${prop.name}Array = [NSMutableArray array];`);
        lines.push(`        for (NSDictionary *item in dictionary[@"${prop.originalName}"]) {`);
        lines.push(`            [${prop.name}Array addObject:[[${prop.nestedClassName} alloc] initWithDictionary:item]];`);
        lines.push('        }');
        lines.push(`        self.${prop.name} = [${prop.name}Array copy];`);
      } else {
        lines.push(`        self.${prop.name} = dictionary[@"${prop.originalName}"];`);
      }
    }
    
    lines.push('    }');
    lines.push('    return self;');
    lines.push('}');
    lines.push('');
  }
  
  // toDictionary
  if (settings.generateToDictionary) {
    lines.push('- (NSDictionary *)toDictionary {');
    lines.push('    NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];');
    
    for (const prop of classDef.properties) {
      if (prop.isObject && prop.nestedClassName && !prop.isArray) {
        lines.push(`    if (self.${prop.name}) dictionary[@"${prop.originalName}"] = [self.${prop.name} toDictionary];`);
      } else if (prop.isArray && prop.nestedClassName) {
        lines.push(`    if (self.${prop.name}) {`);
        lines.push(`        NSMutableArray *array = [NSMutableArray array];`);
        lines.push(`        for (${prop.nestedClassName} *item in self.${prop.name}) {`);
        lines.push(`            [array addObject:[item toDictionary]];`);
        lines.push('        }');
        lines.push(`        dictionary[@"${prop.originalName}"] = array;`);
        lines.push('    }');
      } else {
        lines.push(`    if (self.${prop.name}) dictionary[@"${prop.originalName}"] = self.${prop.name};`);
      }
    }
    
    lines.push('    return [dictionary copy];');
    lines.push('}');
    lines.push('');
  }
  
  // description
  if (settings.generateDescription) {
    lines.push('- (NSString *)description {');
    lines.push(`    return [NSString stringWithFormat:@"${classDef.name}: %@", [self toDictionary]];`);
    lines.push('}');
    lines.push('');
  }
  
  lines.push('@end');
  
  return lines.join('\n');
}

export function convertJSONToObjC(
  jsonString: string,
  settings: Partial<ObjCGeneratorSettings> = {}
): ObjCGenerationResult {
  const mergedSettings: ObjCGeneratorSettings = { ...DEFAULT_OBJC_SETTINGS, ...settings };
  
  try {
    const parsed = JSON.parse(jsonString);
    
    if (typeof parsed !== 'object' || parsed === null) {
      return {
        success: false,
        errors: [{ message: 'Input must be a JSON object or array of objects' }],
      };
    }
    
    const classes = new Map<string, ClassDefinition>();
    let rootData = parsed;
    
    // Handle array of objects
    if (Array.isArray(parsed)) {
      if (parsed.length === 0 || typeof parsed[0] !== 'object') {
        return {
          success: false,
          errors: [{ message: 'Array must contain objects' }],
        };
      }
      rootData = parsed[0];
    }
    
    // Analyze and collect all classes
    const rootClassName = convertClassName(mergedSettings.rootClassName, mergedSettings);
    const rootClass = analyzeObject(
      rootData as Record<string, unknown>,
      rootClassName,
      mergedSettings,
      classes
    );
    classes.set(rootClassName, rootClass);
    
    // Generate code
    const headerBlocks: string[] = [];
    const implBlocks: string[] = [];
    
    // Add imports
    headerBlocks.push('#import <Foundation/Foundation.h>');
    headerBlocks.push('');
    
    implBlocks.push(`#import "${rootClassName}.h"`);
    implBlocks.push('');
    
    // Generate all classes
    const sortedClasses = Array.from(classes.values()).reverse();
    for (const classDef of sortedClasses) {
      headerBlocks.push(generateHeaderCode(classDef, mergedSettings));
      headerBlocks.push('');
      implBlocks.push(generateImplementationCode(classDef, mergedSettings));
      implBlocks.push('');
    }
    
    const headerCode = headerBlocks.join('\n').trim();
    const implementationCode = implBlocks.join('\n').trim();
    
    let code: string;
    switch (mergedSettings.outputFormat) {
      case 'header-only':
        code = headerCode;
        break;
      case 'implementation-only':
        code = implementationCode;
        break;
      case 'header-implementation':
      default:
        code = `// ${rootClassName}.h\n${headerCode}\n\n// ${rootClassName}.m\n${implementationCode}`;
    }
    
    return {
      success: true,
      code,
      headerCode,
      implementationCode,
      classCount: classes.size,
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
