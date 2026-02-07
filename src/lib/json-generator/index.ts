/**
 * JSON Generator Library
 * Public API exports
 */

// Types
export type {
  DataType,
  DataTypeCategory,
  BasicDataType,
  PersonalDataType,
  AddressDataType,
  BusinessDataType,
  FinancialDataType,
  InternetDataType,
  IdentifierDataType,
  DateTimeDataType,
  TextDataType,
  StructureDataType,
  FieldOptions,
  BaseFieldOptions,
  StringOptions,
  NumberOptions,
  EnumOptions,
  ConstantOptions,
  DateOptions,
  ArrayOptions,
  AlphanumericOptions,
  SequentialIdOptions,
  TextOptions,
  SchemaField,
  GeneratorSettings,
  ExportSettings,
  ExportFormat,
  IndentStyle,
  Locale,
  GeneratorTemplate,
  GenerationResult,
  DataTypeInfo
} from './types';

// Constants
export {
  DEFAULT_GENERATOR_SETTINGS,
  DEFAULT_EXPORT_SETTINGS,
  DATA_TYPE_INFO,
  DATA_TYPE_CATEGORIES,
  getDataTypeInfo,
  getDataTypesByCategory
} from './types';

// Generators
export {
  generateData,
  generateSingleRecord,
  generatePreview,
  generateValue,
  setLocale
} from './generators';

// Exporters
export {
  exportData,
  exportToJSON,
  exportToJSONL,
  exportToCSV,
  exportToTypeScript,
  downloadFile,
  getFileExtension,
  getMimeType
} from './exporter';
