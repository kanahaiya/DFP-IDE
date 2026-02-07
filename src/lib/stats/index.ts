/**
 * JSON Stats library public API
 */

// Types
export type {
  SizeMetrics,
  StructureMetrics,
  JsonDataType,
  TypeCount,
  TypeDistribution,
  KeyFrequency,
  KeyAnalysis,
  StringStats,
  NumberStats,
  ArrayStats,
  ValueAnalysis,
  QualityIssueType,
  QualityIssue,
  DataQualityInsights,
  JsonStats,
  ExportFormat,
  ExportSettings,
  ActiveSection,
  JsonValue,
  JsonObject,
  JsonArray,
  JsonPrimitive,
} from './types';

// Constants
export {
  DEFAULT_EXPORT_SETTINGS,
  TYPE_COLORS,
  isPlainObject,
  isArray,
  isPrimitive,
  getJsonType,
} from './types';

// Main analyzer
export {
  analyzeJSON,
  validateJSON,
  analyzePartial,
} from './analyzer';

// Structure analyzer
export {
  analyzeStructure,
  getDepthAtPath,
  countTotalElements,
} from './structureAnalyzer';

// Type analyzer
export {
  analyzeTypes,
  getTypesForKey,
  findInconsistentTypes,
  getPrimitiveRatio,
} from './typeAnalyzer';

// Key analyzer
export {
  analyzeKeys,
  getKeyAtPath,
  searchKeys,
  getDeepKeys,
} from './keyAnalyzer';

// Value analyzer
export {
  analyzeValues,
  getUniqueStrings,
  getNumberRange,
  getValuesAtPath,
} from './valueAnalyzer';

// Quality analyzer
export {
  analyzeQuality,
  getSeverityDistribution,
} from './qualityAnalyzer';

// Exporter
export {
  exportStats,
  getFileExtension,
  getMimeType,
  downloadStats,
} from './exporter';
