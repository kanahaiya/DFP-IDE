/**
 * JSON Generator Types
 * Type definitions for the JSON test data generator
 */

// ============================================================================
// Data Type Definitions
// ============================================================================

export type DataTypeCategory = 
  | 'basic'
  | 'personal'
  | 'address'
  | 'business'
  | 'financial'
  | 'internet'
  | 'identifier'
  | 'datetime'
  | 'text'
  | 'structure';

export type BasicDataType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'enum'
  | 'constant';

export type PersonalDataType =
  | 'firstName'
  | 'lastName'
  | 'fullName'
  | 'email'
  | 'phone'
  | 'username'
  | 'avatar'
  | 'age'
  | 'birthday'
  | 'gender';

export type AddressDataType =
  | 'streetAddress'
  | 'city'
  | 'state'
  | 'zipCode'
  | 'country'
  | 'countryCode'
  | 'latitude'
  | 'longitude'
  | 'timezone';

export type BusinessDataType =
  | 'company'
  | 'jobTitle'
  | 'department'
  | 'industry'
  | 'catchPhrase'
  | 'productName';

export type FinancialDataType =
  | 'price'
  | 'creditCard'
  | 'creditCardCVV'
  | 'iban'
  | 'bic'
  | 'currencyCode'
  | 'currencyName'
  | 'transactionId';

export type InternetDataType =
  | 'url'
  | 'domain'
  | 'ipv4'
  | 'ipv6'
  | 'mac'
  | 'userAgent'
  | 'color'
  | 'rgb'
  | 'mimeType'
  | 'fileExtension'
  | 'imageUrl';

export type IdentifierDataType =
  | 'uuid'
  | 'objectId'
  | 'sequentialId'
  | 'alphanumeric'
  | 'slug';

export type DateTimeDataType =
  | 'date'
  | 'datetime'
  | 'timestamp'
  | 'past'
  | 'future'
  | 'recent'
  | 'month'
  | 'weekday';

export type TextDataType =
  | 'word'
  | 'words'
  | 'sentence'
  | 'sentences'
  | 'paragraph'
  | 'paragraphs'
  | 'lorem';

export type StructureDataType =
  | 'object'
  | 'array';

export type DataType =
  | BasicDataType
  | PersonalDataType
  | AddressDataType
  | BusinessDataType
  | FinancialDataType
  | InternetDataType
  | IdentifierDataType
  | DateTimeDataType
  | TextDataType
  | StructureDataType;

// ============================================================================
// Field Options
// ============================================================================

export interface BaseFieldOptions {
  unique?: boolean;
  nullable?: number; // Percentage chance of null (0-100)
}

export interface StringOptions extends BaseFieldOptions {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  prefix?: string;
  suffix?: string;
}

export interface NumberOptions extends BaseFieldOptions {
  min?: number;
  max?: number;
  precision?: number;
  integer?: boolean;
}

export interface EnumOptions extends BaseFieldOptions {
  values: (string | number | boolean)[];
}

export interface ConstantOptions extends BaseFieldOptions {
  value: string | number | boolean | null;
}

export interface DateOptions extends BaseFieldOptions {
  min?: string; // ISO date string
  max?: string; // ISO date string
  years?: number; // For past/future types
  days?: number; // For recent type
}

export interface ArrayOptions extends BaseFieldOptions {
  count: number | { min: number; max: number };
}

export interface AlphanumericOptions extends BaseFieldOptions {
  length?: number;
  prefix?: string;
  suffix?: string;
}

export interface SequentialIdOptions extends BaseFieldOptions {
  start?: number;
  step?: number;
}

export interface TextOptions extends BaseFieldOptions {
  count?: number | { min: number; max: number };
  min?: number;
  max?: number;
}

export type FieldOptions = 
  | BaseFieldOptions
  | StringOptions
  | NumberOptions
  | EnumOptions
  | ConstantOptions
  | DateOptions
  | ArrayOptions
  | AlphanumericOptions
  | SequentialIdOptions
  | TextOptions;

// ============================================================================
// Schema Definition
// ============================================================================

export interface SchemaField {
  id: string;
  name: string;
  type: DataType;
  options: FieldOptions;
  children?: SchemaField[]; // For object and array types
}

// ============================================================================
// Generation Settings
// ============================================================================

export type Locale = 
  | 'en_US'
  | 'en_GB'
  | 'de'
  | 'fr'
  | 'es'
  | 'it'
  | 'pt_BR'
  | 'ja'
  | 'zh_CN'
  | 'ko'
  | 'ru'
  | 'ar'
  | 'nl'
  | 'pl'
  | 'sv';

export interface GeneratorSettings {
  quantity: number;
  seed?: number;
  locale: Locale;
}

export const DEFAULT_GENERATOR_SETTINGS: GeneratorSettings = {
  quantity: 10,
  seed: undefined,
  locale: 'en_US'
};

// ============================================================================
// Export Settings
// ============================================================================

export type ExportFormat = 'json' | 'jsonl' | 'csv' | 'typescript';
export type IndentStyle = '2spaces' | '4spaces' | 'tabs' | 'minified';

export interface ExportSettings {
  format: ExportFormat;
  indent: IndentStyle;
  sortKeys: boolean;
  includeTypes: boolean; // For TypeScript export
}

export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  format: 'json',
  indent: '2spaces',
  sortKeys: false,
  includeTypes: true
};

// ============================================================================
// Template Definition
// ============================================================================

export interface GeneratorTemplate {
  id: string;
  name: string;
  description: string;
  category: 'common' | 'business' | 'ecommerce' | 'social' | 'api';
  icon: string;
  schema: SchemaField[];
}

// ============================================================================
// Generation Result
// ============================================================================

export interface GenerationResult {
  data: Record<string, unknown>[];
  schema: SchemaField[];
  settings: GeneratorSettings;
  generatedAt: string;
  recordCount: number;
}

// ============================================================================
// Data Type Metadata (for UI)
// ============================================================================

export interface DataTypeInfo {
  label: string;
  description: string;
  category: DataTypeCategory;
  icon: string;
  color: string;
  example: string;
  hasOptions: boolean;
  optionFields?: string[];
}

export const DATA_TYPE_INFO: Record<DataType, DataTypeInfo> = {
  // Basic Types
  string: { label: 'String', description: 'Random text string', category: 'basic', icon: 'fas fa-font', color: 'var(--success)', example: '"abc123"', hasOptions: true, optionFields: ['minLength', 'maxLength'] },
  number: { label: 'Number', description: 'Random number', category: 'basic', icon: 'fas fa-hashtag', color: 'var(--warning)', example: '42', hasOptions: true, optionFields: ['min', 'max', 'precision', 'integer'] },
  boolean: { label: 'Boolean', description: 'True or false', category: 'basic', icon: 'fas fa-toggle-on', color: 'var(--info)', example: 'true', hasOptions: false },
  null: { label: 'Null', description: 'Null value', category: 'basic', icon: 'fas fa-ban', color: 'var(--text-muted)', example: 'null', hasOptions: false },
  enum: { label: 'Enum', description: 'Random from list', category: 'basic', icon: 'fas fa-list', color: 'var(--primary)', example: '"option1"', hasOptions: true, optionFields: ['values'] },
  constant: { label: 'Constant', description: 'Fixed value', category: 'basic', icon: 'fas fa-lock', color: 'var(--text-secondary)', example: '"fixed"', hasOptions: true, optionFields: ['value'] },
  
  // Personal Types
  firstName: { label: 'First Name', description: 'Random first name', category: 'personal', icon: 'fas fa-user', color: '#3b82f6', example: '"John"', hasOptions: false },
  lastName: { label: 'Last Name', description: 'Random last name', category: 'personal', icon: 'fas fa-user', color: '#3b82f6', example: '"Doe"', hasOptions: false },
  fullName: { label: 'Full Name', description: 'Full name (first + last)', category: 'personal', icon: 'fas fa-user', color: '#3b82f6', example: '"John Doe"', hasOptions: false },
  email: { label: 'Email', description: 'Email address', category: 'personal', icon: 'fas fa-envelope', color: '#8b5cf6', example: '"john@example.com"', hasOptions: false },
  phone: { label: 'Phone', description: 'Phone number', category: 'personal', icon: 'fas fa-phone', color: '#10b981', example: '"+1-555-123-4567"', hasOptions: false },
  username: { label: 'Username', description: 'Internet username', category: 'personal', icon: 'fas fa-at', color: '#6366f1', example: '"john_doe"', hasOptions: false },
  avatar: { label: 'Avatar URL', description: 'Profile image URL', category: 'personal', icon: 'fas fa-image', color: '#ec4899', example: '"https://..."', hasOptions: false },
  age: { label: 'Age', description: 'Random age', category: 'personal', icon: 'fas fa-birthday-cake', color: '#f59e0b', example: '28', hasOptions: true, optionFields: ['min', 'max'] },
  birthday: { label: 'Birthday', description: 'Birth date', category: 'personal', icon: 'fas fa-calendar', color: '#f59e0b', example: '"1995-03-15"', hasOptions: true, optionFields: ['min', 'max'] },
  gender: { label: 'Gender', description: 'Gender value', category: 'personal', icon: 'fas fa-venus-mars', color: '#ec4899', example: '"female"', hasOptions: false },
  
  // Address Types
  streetAddress: { label: 'Street Address', description: 'Street address', category: 'address', icon: 'fas fa-road', color: '#14b8a6', example: '"123 Main St"', hasOptions: false },
  city: { label: 'City', description: 'City name', category: 'address', icon: 'fas fa-city', color: '#14b8a6', example: '"New York"', hasOptions: false },
  state: { label: 'State', description: 'State/Province', category: 'address', icon: 'fas fa-map', color: '#14b8a6', example: '"California"', hasOptions: false },
  zipCode: { label: 'ZIP Code', description: 'Postal code', category: 'address', icon: 'fas fa-mail-bulk', color: '#14b8a6', example: '"90210"', hasOptions: false },
  country: { label: 'Country', description: 'Country name', category: 'address', icon: 'fas fa-globe', color: '#14b8a6', example: '"United States"', hasOptions: false },
  countryCode: { label: 'Country Code', description: 'ISO country code', category: 'address', icon: 'fas fa-flag', color: '#14b8a6', example: '"US"', hasOptions: false },
  latitude: { label: 'Latitude', description: 'Geographic latitude', category: 'address', icon: 'fas fa-map-marker-alt', color: '#14b8a6', example: '40.7128', hasOptions: false },
  longitude: { label: 'Longitude', description: 'Geographic longitude', category: 'address', icon: 'fas fa-map-marker-alt', color: '#14b8a6', example: '-74.0060', hasOptions: false },
  timezone: { label: 'Timezone', description: 'Timezone identifier', category: 'address', icon: 'fas fa-clock', color: '#14b8a6', example: '"America/New_York"', hasOptions: false },
  
  // Business Types
  company: { label: 'Company', description: 'Company name', category: 'business', icon: 'fas fa-building', color: '#6366f1', example: '"Acme Inc"', hasOptions: false },
  jobTitle: { label: 'Job Title', description: 'Professional title', category: 'business', icon: 'fas fa-briefcase', color: '#6366f1', example: '"Software Engineer"', hasOptions: false },
  department: { label: 'Department', description: 'Department name', category: 'business', icon: 'fas fa-sitemap', color: '#6366f1', example: '"Engineering"', hasOptions: false },
  industry: { label: 'Industry', description: 'Industry category', category: 'business', icon: 'fas fa-industry', color: '#6366f1', example: '"Technology"', hasOptions: false },
  catchPhrase: { label: 'Catch Phrase', description: 'Business catch phrase', category: 'business', icon: 'fas fa-quote-right', color: '#6366f1', example: '"Innovate..."', hasOptions: false },
  productName: { label: 'Product Name', description: 'Product name', category: 'business', icon: 'fas fa-box', color: '#6366f1', example: '"Widget Pro"', hasOptions: false },
  
  // Financial Types
  price: { label: 'Price', description: 'Currency amount', category: 'financial', icon: 'fas fa-dollar-sign', color: '#22c55e', example: '29.99', hasOptions: true, optionFields: ['min', 'max'] },
  creditCard: { label: 'Credit Card', description: 'Card number (fake)', category: 'financial', icon: 'fas fa-credit-card', color: '#22c55e', example: '"4532..."', hasOptions: false },
  creditCardCVV: { label: 'CVV', description: 'Card CVV code', category: 'financial', icon: 'fas fa-lock', color: '#22c55e', example: '"123"', hasOptions: false },
  iban: { label: 'IBAN', description: 'Bank account number', category: 'financial', icon: 'fas fa-university', color: '#22c55e', example: '"DE89..."', hasOptions: false },
  bic: { label: 'BIC/SWIFT', description: 'Bank identifier code', category: 'financial', icon: 'fas fa-university', color: '#22c55e', example: '"DEUTDEFF"', hasOptions: false },
  currencyCode: { label: 'Currency Code', description: 'ISO currency code', category: 'financial', icon: 'fas fa-coins', color: '#22c55e', example: '"USD"', hasOptions: false },
  currencyName: { label: 'Currency Name', description: 'Currency name', category: 'financial', icon: 'fas fa-coins', color: '#22c55e', example: '"US Dollar"', hasOptions: false },
  transactionId: { label: 'Transaction ID', description: 'Transaction identifier', category: 'financial', icon: 'fas fa-receipt', color: '#22c55e', example: '"TXN123..."', hasOptions: false },
  
  // Internet Types
  url: { label: 'URL', description: 'Web URL', category: 'internet', icon: 'fas fa-link', color: '#0ea5e9', example: '"https://..."', hasOptions: false },
  domain: { label: 'Domain', description: 'Domain name', category: 'internet', icon: 'fas fa-globe', color: '#0ea5e9', example: '"example.com"', hasOptions: false },
  ipv4: { label: 'IPv4', description: 'IPv4 address', category: 'internet', icon: 'fas fa-network-wired', color: '#0ea5e9', example: '"192.168.1.1"', hasOptions: false },
  ipv6: { label: 'IPv6', description: 'IPv6 address', category: 'internet', icon: 'fas fa-network-wired', color: '#0ea5e9', example: '"2001:db8::1"', hasOptions: false },
  mac: { label: 'MAC Address', description: 'Network MAC address', category: 'internet', icon: 'fas fa-ethernet', color: '#0ea5e9', example: '"00:1A:2B..."', hasOptions: false },
  userAgent: { label: 'User Agent', description: 'Browser user agent', category: 'internet', icon: 'fas fa-desktop', color: '#0ea5e9', example: '"Mozilla/5.0..."', hasOptions: false },
  color: { label: 'Color (Hex)', description: 'Hex color code', category: 'internet', icon: 'fas fa-palette', color: '#f472b6', example: '"#ff5733"', hasOptions: false },
  rgb: { label: 'Color (RGB)', description: 'RGB color value', category: 'internet', icon: 'fas fa-palette', color: '#f472b6', example: '"rgb(255,87,51)"', hasOptions: false },
  mimeType: { label: 'MIME Type', description: 'Content type', category: 'internet', icon: 'fas fa-file-code', color: '#0ea5e9', example: '"image/png"', hasOptions: false },
  fileExtension: { label: 'File Extension', description: 'File extension', category: 'internet', icon: 'fas fa-file', color: '#0ea5e9', example: '"pdf"', hasOptions: false },
  imageUrl: { label: 'Image URL', description: 'Placeholder image URL', category: 'internet', icon: 'fas fa-image', color: '#0ea5e9', example: '"https://..."', hasOptions: false },
  
  // Identifier Types
  uuid: { label: 'UUID', description: 'UUID v4', category: 'identifier', icon: 'fas fa-fingerprint', color: '#a855f7', example: '"550e8400..."', hasOptions: false },
  objectId: { label: 'Object ID', description: 'MongoDB ObjectID', category: 'identifier', icon: 'fas fa-database', color: '#a855f7', example: '"507f1f77..."', hasOptions: false },
  sequentialId: { label: 'Sequential ID', description: 'Auto-increment ID', category: 'identifier', icon: 'fas fa-sort-numeric-up', color: '#a855f7', example: '1, 2, 3...', hasOptions: true, optionFields: ['start', 'step'] },
  alphanumeric: { label: 'Alphanumeric', description: 'Random alphanumeric', category: 'identifier', icon: 'fas fa-key', color: '#a855f7', example: '"ABC123XY"', hasOptions: true, optionFields: ['length', 'prefix'] },
  slug: { label: 'Slug', description: 'URL-friendly slug', category: 'identifier', icon: 'fas fa-link', color: '#a855f7', example: '"hello-world"', hasOptions: false },
  
  // DateTime Types
  date: { label: 'Date', description: 'Date (YYYY-MM-DD)', category: 'datetime', icon: 'fas fa-calendar-day', color: '#f59e0b', example: '"2024-03-15"', hasOptions: true, optionFields: ['min', 'max'] },
  datetime: { label: 'DateTime', description: 'ISO 8601 datetime', category: 'datetime', icon: 'fas fa-calendar-alt', color: '#f59e0b', example: '"2024-03-15T..."', hasOptions: true, optionFields: ['min', 'max'] },
  timestamp: { label: 'Timestamp', description: 'Unix timestamp', category: 'datetime', icon: 'fas fa-clock', color: '#f59e0b', example: '1710489600', hasOptions: false },
  past: { label: 'Past Date', description: 'Date in the past', category: 'datetime', icon: 'fas fa-history', color: '#f59e0b', example: '"2023-01-15"', hasOptions: true, optionFields: ['years', 'days'] },
  future: { label: 'Future Date', description: 'Date in the future', category: 'datetime', icon: 'fas fa-forward', color: '#f59e0b', example: '"2025-06-20"', hasOptions: true, optionFields: ['years', 'days'] },
  recent: { label: 'Recent Date', description: 'Recent date', category: 'datetime', icon: 'fas fa-calendar-check', color: '#f59e0b', example: '"2024-03-10"', hasOptions: true, optionFields: ['days'] },
  month: { label: 'Month', description: 'Month name', category: 'datetime', icon: 'fas fa-calendar', color: '#f59e0b', example: '"March"', hasOptions: false },
  weekday: { label: 'Weekday', description: 'Day of week', category: 'datetime', icon: 'fas fa-calendar-week', color: '#f59e0b', example: '"Friday"', hasOptions: false },
  
  // Text Types
  word: { label: 'Word', description: 'Single word', category: 'text', icon: 'fas fa-font', color: '#64748b', example: '"lorem"', hasOptions: false },
  words: { label: 'Words', description: 'Multiple words', category: 'text', icon: 'fas fa-font', color: '#64748b', example: '"lorem ipsum..."', hasOptions: true, optionFields: ['count'] },
  sentence: { label: 'Sentence', description: 'Single sentence', category: 'text', icon: 'fas fa-align-left', color: '#64748b', example: '"Lorem ipsum..."', hasOptions: true, optionFields: ['min', 'max'] },
  sentences: { label: 'Sentences', description: 'Multiple sentences', category: 'text', icon: 'fas fa-align-left', color: '#64748b', example: '"Lorem... Dolor..."', hasOptions: true, optionFields: ['count'] },
  paragraph: { label: 'Paragraph', description: 'Full paragraph', category: 'text', icon: 'fas fa-paragraph', color: '#64748b', example: '"Lorem ipsum..."', hasOptions: false },
  paragraphs: { label: 'Paragraphs', description: 'Multiple paragraphs', category: 'text', icon: 'fas fa-paragraph', color: '#64748b', example: '"Lorem...\\n\\n..."', hasOptions: true, optionFields: ['count'] },
  lorem: { label: 'Lorem Ipsum', description: 'Lorem ipsum text', category: 'text', icon: 'fas fa-align-justify', color: '#64748b', example: '"Lorem ipsum..."', hasOptions: true, optionFields: ['count'] },
  
  // Structure Types
  object: { label: 'Object', description: 'Nested object', category: 'structure', icon: 'fas fa-cube', color: '#ef4444', example: '{ ... }', hasOptions: false },
  array: { label: 'Array', description: 'Array of items', category: 'structure', icon: 'fas fa-list-ul', color: '#ef4444', example: '[ ... ]', hasOptions: true, optionFields: ['count'] }
};

// Helper to get type info
export function getDataTypeInfo(type: DataType): DataTypeInfo | undefined {
  return DATA_TYPE_INFO[type];
}

// Helper to get types by category
export function getDataTypesByCategory(category: DataTypeCategory): DataType[] {
  return (Object.keys(DATA_TYPE_INFO) as DataType[]).filter(
    type => DATA_TYPE_INFO[type].category === category
  );
}

// All categories for UI
export const DATA_TYPE_CATEGORIES: Record<DataTypeCategory, { name: string; icon: string }> = {
  basic: { name: 'Basic', icon: 'fas fa-cube' },
  personal: { name: 'Personal', icon: 'fas fa-user' },
  address: { name: 'Address', icon: 'fas fa-map-marker-alt' },
  business: { name: 'Business', icon: 'fas fa-building' },
  financial: { name: 'Financial', icon: 'fas fa-dollar-sign' },
  internet: { name: 'Internet', icon: 'fas fa-globe' },
  identifier: { name: 'Identifiers', icon: 'fas fa-fingerprint' },
  datetime: { name: 'Date & Time', icon: 'fas fa-calendar' },
  text: { name: 'Text', icon: 'fas fa-align-left' },
  structure: { name: 'Structure', icon: 'fas fa-sitemap' }
};
