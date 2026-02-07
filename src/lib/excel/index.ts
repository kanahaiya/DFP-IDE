/**
 * JSON to Excel library public API
 */

// Types
export type {
  ExcelFormat,
  ExcelExportSettings,
  ColumnDataType,
  ColumnConfig,
  ColumnManagerState,
  PreviewRow,
  PreviewData,
  JsonStructureType,
  StructureAnalysis,
  ConversionResult,
  ExportResult,
  ExportPreset,
  JsonPrimitive,
  JsonValue,
  JsonObject,
  JsonArray,
} from './types';

// Constants
export {
  DEFAULT_EXPORT_SETTINGS,
  EXPORT_PRESETS,
  isPlainObject,
  isArray,
  isPrimitive,
} from './types';

// Flattener functions
export {
  flattenObject,
  flattenArrayOfObjects,
  getAllKeys,
  analyzeKeys,
  getMaxDepth,
  countNestedObjects,
  unflattenObject,
} from './flattener';

// Column manager functions
export {
  detectDataType,
  generateColumns,
  formatColumnName,
  reorderColumns,
  toggleColumnVisibility,
  renameColumn,
  selectAllColumns,
  deselectAllColumns,
  getVisibleColumns,
  getColumnByKey,
  calculateColumnWidth,
  calculateAllColumnWidths,
  validateColumns,
} from './columnManager';

// Converter functions
export {
  analyzeStructure,
  convertToTabular,
  exportToExcel,
  generateExcelBlob,
  parseJSON,
} from './converter';

// Preset functions
export {
  getAllPresets,
  getPresetById,
  applyPreset,
  getDefaultSettings,
  createCustomPreset,
  suggestPreset,
  validatePresetSettings,
  getPresetDescription,
  getQuickAccessPresets,
} from './presets';
