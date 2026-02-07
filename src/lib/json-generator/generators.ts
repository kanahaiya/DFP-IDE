/**
 * JSON Data Generators
 * Functions that generate fake data using Faker.js
 */

import { faker } from '@faker-js/faker';
import type { 
  DataType, 
  SchemaField, 
  GeneratorSettings, 
  FieldOptions,
  NumberOptions,
  DateOptions,
  ArrayOptions,
  EnumOptions,
  ConstantOptions,
  AlphanumericOptions,
  SequentialIdOptions,
  TextOptions,
  Locale
} from './types';

// ============================================================================
// Locale Configuration
// ============================================================================

// Set faker locale
export function setLocale(locale: Locale): void {
  // Faker.js uses different locale format
  const localeMapping: Record<Locale, string> = {
    'en_US': 'en_US',
    'en_GB': 'en_GB',
    'de': 'de',
    'fr': 'fr',
    'es': 'es',
    'it': 'it',
    'pt_BR': 'pt_BR',
    'ja': 'ja',
    'zh_CN': 'zh_CN',
    'ko': 'ko',
    'ru': 'ru',
    'ar': 'ar',
    'nl': 'nl',
    'pl': 'pl',
    'sv': 'sv'
  };
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (faker as any).locale = localeMapping[locale] || 'en_US';
  } catch {
    // Fallback to default if locale not supported
    console.warn(`Locale ${locale} not fully supported, using en_US`);
  }
}

// ============================================================================
// Individual Value Generators
// ============================================================================

export function generateValue(
  type: DataType, 
  options: FieldOptions, 
  context: GenerationContext
): unknown {
  // Check for nullable
  if (options.nullable && Math.random() * 100 < options.nullable) {
    return null;
  }

  switch (type) {
    // Basic Types
    case 'string':
      return generateString(options);
    case 'number':
      return generateNumber(options as NumberOptions);
    case 'boolean':
      return faker.datatype.boolean();
    case 'null':
      return null;
    case 'enum':
      return generateEnum(options as EnumOptions);
    case 'constant':
      return (options as ConstantOptions).value;

    // Personal Types
    case 'firstName':
      return faker.person.firstName();
    case 'lastName':
      return faker.person.lastName();
    case 'fullName':
      return faker.person.fullName();
    case 'email':
      return faker.internet.email().toLowerCase();
    case 'phone':
      return faker.phone.number();
    case 'username':
      return faker.internet.username().toLowerCase();
    case 'avatar':
      return faker.image.avatar();
    case 'age':
      return generateAge(options as NumberOptions);
    case 'birthday':
      return generateBirthday(options as DateOptions);
    case 'gender':
      return faker.person.sex();

    // Address Types
    case 'streetAddress':
      return faker.location.streetAddress();
    case 'city':
      return faker.location.city();
    case 'state':
      return faker.location.state();
    case 'zipCode':
      return faker.location.zipCode();
    case 'country':
      return faker.location.country();
    case 'countryCode':
      return faker.location.countryCode();
    case 'latitude':
      return parseFloat(faker.location.latitude().toString());
    case 'longitude':
      return parseFloat(faker.location.longitude().toString());
    case 'timezone':
      return faker.location.timeZone();

    // Business Types
    case 'company':
      return faker.company.name();
    case 'jobTitle':
      return faker.person.jobTitle();
    case 'department':
      return faker.commerce.department();
    case 'industry':
      return faker.company.buzzNoun();
    case 'catchPhrase':
      return faker.company.catchPhrase();
    case 'productName':
      return faker.commerce.productName();

    // Financial Types
    case 'price':
      return generatePrice(options as NumberOptions);
    case 'creditCard':
      return faker.finance.creditCardNumber();
    case 'creditCardCVV':
      return faker.finance.creditCardCVV();
    case 'iban':
      return faker.finance.iban();
    case 'bic':
      return faker.finance.bic();
    case 'currencyCode':
      return faker.finance.currencyCode();
    case 'currencyName':
      return faker.finance.currencyName();
    case 'transactionId':
      return faker.finance.accountNumber(16);

    // Internet Types
    case 'url':
      return faker.internet.url();
    case 'domain':
      return faker.internet.domainName();
    case 'ipv4':
      return faker.internet.ip();
    case 'ipv6':
      return faker.internet.ipv6();
    case 'mac':
      return faker.internet.mac();
    case 'userAgent':
      return faker.internet.userAgent();
    case 'color':
      return faker.color.rgb({ format: 'hex' });
    case 'rgb':
      return `rgb(${faker.number.int(255)}, ${faker.number.int(255)}, ${faker.number.int(255)})`;
    case 'mimeType':
      return faker.system.mimeType();
    case 'fileExtension':
      return faker.system.fileExt();
    case 'imageUrl':
      return faker.image.url();

    // Identifier Types
    case 'uuid':
      return faker.string.uuid();
    case 'objectId':
      return faker.database.mongodbObjectId();
    case 'sequentialId':
      return generateSequentialId(options as SequentialIdOptions, context);
    case 'alphanumeric':
      return generateAlphanumeric(options as AlphanumericOptions);
    case 'slug':
      return faker.helpers.slugify(faker.lorem.words(3)).toLowerCase();

    // DateTime Types
    case 'date':
      return generateDate(options as DateOptions);
    case 'datetime':
      return generateDateTime(options as DateOptions);
    case 'timestamp':
      return Math.floor(faker.date.recent().getTime() / 1000);
    case 'past':
      return generatePastDate(options as DateOptions);
    case 'future':
      return generateFutureDate(options as DateOptions);
    case 'recent':
      return generateRecentDate(options as DateOptions);
    case 'month':
      return faker.date.month();
    case 'weekday':
      return faker.date.weekday();

    // Text Types
    case 'word':
      return faker.lorem.word();
    case 'words':
      return generateWords(options as TextOptions);
    case 'sentence':
      return generateSentence(options as TextOptions);
    case 'sentences':
      return generateSentences(options as TextOptions);
    case 'paragraph':
      return faker.lorem.paragraph();
    case 'paragraphs':
      return generateParagraphs(options as TextOptions);
    case 'lorem':
      return generateLorem(options as TextOptions);

    // Structure types are handled separately
    case 'object':
    case 'array':
      return null; // These are handled in generateFromSchema

    default:
      return null;
  }
}

// ============================================================================
// Helper Generators
// ============================================================================

function generateString(options: FieldOptions): string {
  const opts = options as { minLength?: number; maxLength?: number };
  const length = faker.number.int({ 
    min: opts.minLength || 5, 
    max: opts.maxLength || 20 
  });
  return faker.string.alphanumeric(length);
}

function generateNumber(options: NumberOptions): number {
  const min = options.min ?? 0;
  const max = options.max ?? 1000;
  const precision = options.precision ?? 2;
  
  if (options.integer) {
    return faker.number.int({ min, max });
  }
  return parseFloat(faker.number.float({ min, max, fractionDigits: precision }).toFixed(precision));
}

function generateEnum(options: EnumOptions): unknown {
  if (!options.values || options.values.length === 0) {
    return null;
  }
  return faker.helpers.arrayElement(options.values);
}

function generateAge(options: NumberOptions): number {
  const min = options.min ?? 18;
  const max = options.max ?? 80;
  return faker.number.int({ min, max });
}

function generateBirthday(options: DateOptions): string {
  const minDate = options.min ? new Date(options.min) : new Date('1950-01-01');
  const maxDate = options.max ? new Date(options.max) : new Date('2005-12-31');
  return faker.date.between({ from: minDate, to: maxDate }).toISOString().split('T')[0];
}

function generatePrice(options: NumberOptions): number {
  const min = options.min ?? 0.99;
  const max = options.max ?? 999.99;
  return parseFloat(faker.commerce.price({ min, max }));
}

function generateAlphanumeric(options: AlphanumericOptions): string {
  const length = options.length ?? 8;
  const base = faker.string.alphanumeric(length).toUpperCase();
  const prefix = options.prefix ?? '';
  const suffix = options.suffix ?? '';
  return `${prefix}${base}${suffix}`;
}

interface GenerationContext {
  sequentialCounters: Map<string, number>;
  uniqueValues: Map<string, Set<unknown>>;
  recordIndex: number;
}

function generateSequentialId(options: SequentialIdOptions, context: GenerationContext): number {
  const start = options.start ?? 1;
  const step = options.step ?? 1;
  
  const key = 'sequential';
  if (!context.sequentialCounters.has(key)) {
    context.sequentialCounters.set(key, start);
  }
  
  const current = context.sequentialCounters.get(key)!;
  context.sequentialCounters.set(key, current + step);
  return current;
}

function generateDate(options: DateOptions): string {
  const minDate = options.min ? new Date(options.min) : new Date('2020-01-01');
  const maxDate = options.max ? new Date(options.max) : new Date();
  return faker.date.between({ from: minDate, to: maxDate }).toISOString().split('T')[0];
}

function generateDateTime(options: DateOptions): string {
  const minDate = options.min ? new Date(options.min) : new Date('2020-01-01');
  const maxDate = options.max ? new Date(options.max) : new Date();
  return faker.date.between({ from: minDate, to: maxDate }).toISOString();
}

function generatePastDate(options: DateOptions): string {
  const years = options.years ?? 1;
  return faker.date.past({ years }).toISOString();
}

function generateFutureDate(options: DateOptions): string {
  const years = options.years ?? 1;
  return faker.date.future({ years }).toISOString();
}

function generateRecentDate(options: DateOptions): string {
  const days = options.days ?? 7;
  return faker.date.recent({ days }).toISOString();
}

function generateWords(options: TextOptions): string {
  const count = typeof options.count === 'object' 
    ? faker.number.int({ min: options.count.min, max: options.count.max })
    : options.count ?? 3;
  return faker.lorem.words(count);
}

function generateSentence(options: TextOptions): string {
  const min = options.min ?? 5;
  const max = options.max ?? 15;
  const wordCount = faker.number.int({ min, max });
  return faker.lorem.sentence(wordCount);
}

function generateSentences(options: TextOptions): string {
  const count = typeof options.count === 'object'
    ? faker.number.int({ min: options.count.min, max: options.count.max })
    : options.count ?? 3;
  return faker.lorem.sentences(count);
}

function generateParagraphs(options: TextOptions): string {
  const count = typeof options.count === 'object'
    ? faker.number.int({ min: options.count.min, max: options.count.max })
    : options.count ?? 3;
  return faker.lorem.paragraphs(count);
}

function generateLorem(options: TextOptions): string {
  const count = typeof options.count === 'object'
    ? faker.number.int({ min: options.count.min, max: options.count.max })
    : options.count ?? 50;
  return faker.lorem.words(count);
}

// ============================================================================
// Schema-Based Generation
// ============================================================================

function generateObjectFromSchema(
  fields: SchemaField[],
  context: GenerationContext
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  for (const field of fields) {
    result[field.name] = generateFieldValue(field, context);
  }
  
  return result;
}

function generateFieldValue(
  field: SchemaField,
  context: GenerationContext
): unknown {
  // Handle nullable
  if (field.options.nullable && Math.random() * 100 < field.options.nullable) {
    return null;
  }

  // Handle object type
  if (field.type === 'object' && field.children) {
    return generateObjectFromSchema(field.children, context);
  }

  // Handle array type
  if (field.type === 'array' && field.children) {
    const arrayOpts = field.options as ArrayOptions;
    const count = typeof arrayOpts.count === 'object'
      ? faker.number.int({ min: arrayOpts.count.min, max: arrayOpts.count.max })
      : arrayOpts.count ?? 3;
    
    const items: unknown[] = [];
    for (let i = 0; i < count; i++) {
      // Array children can be a single schema field defining item shape
      const childField = field.children[0];
      if (childField) {
        if (childField.type === 'object' && childField.children) {
          items.push(generateObjectFromSchema(childField.children, context));
        } else {
          items.push(generateValue(childField.type, childField.options, context));
        }
      }
    }
    return items;
  }

  // Handle unique constraint
  if (field.options.unique) {
    const key = field.id;
    if (!context.uniqueValues.has(key)) {
      context.uniqueValues.set(key, new Set());
    }
    const existingValues = context.uniqueValues.get(key)!;
    
    let value: unknown;
    let attempts = 0;
    const maxAttempts = 1000;
    
    do {
      value = generateValue(field.type, field.options, context);
      attempts++;
    } while (existingValues.has(value) && attempts < maxAttempts);
    
    existingValues.add(value);
    return value;
  }

  return generateValue(field.type, field.options, context);
}

// ============================================================================
// Main Generation Function
// ============================================================================

export function generateData(
  schema: SchemaField[],
  settings: GeneratorSettings
): Record<string, unknown>[] {
  // Set seed if provided
  if (settings.seed !== undefined) {
    faker.seed(settings.seed);
  } else {
    faker.seed(); // Random seed
  }

  // Set locale
  setLocale(settings.locale);

  // Initialize context
  const context: GenerationContext = {
    sequentialCounters: new Map(),
    uniqueValues: new Map(),
    recordIndex: 0
  };

  // Generate records
  const records: Record<string, unknown>[] = [];
  
  for (let i = 0; i < settings.quantity; i++) {
    context.recordIndex = i;
    const record = generateObjectFromSchema(schema, context);
    records.push(record);
  }

  return records;
}

// ============================================================================
// Utility Functions
// ============================================================================

export function generateSingleRecord(schema: SchemaField[]): Record<string, unknown> {
  const context: GenerationContext = {
    sequentialCounters: new Map(),
    uniqueValues: new Map(),
    recordIndex: 0
  };
  return generateObjectFromSchema(schema, context);
}

export function generatePreview(schema: SchemaField[], count: number = 3): Record<string, unknown>[] {
  return generateData(schema, {
    quantity: count,
    locale: 'en_US'
  });
}
