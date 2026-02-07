'use client';

import { create } from 'zustand';
import type {
  ExcelExportSettings,
  ColumnConfig,
  PreviewData,
  StructureAnalysis,
  ConversionResult,
  ExportResult,
  JsonValue,
} from '@/lib/excel/types';
import {
  DEFAULT_EXPORT_SETTINGS,
  EXPORT_PRESETS,
} from '@/lib/excel/types';
import { parseJSON, convertToTabular, generateExcelBlob } from '@/lib/excel/converter';
import {
  reorderColumns,
  toggleColumnVisibility,
  renameColumn,
  selectAllColumns,
  deselectAllColumns,
} from '@/lib/excel/columnManager';

// ============================================================================
// State Interface
// ============================================================================

interface JsonExcelState {
  // Input
  input: string;
  parsedData: JsonValue | null;
  parseError: string | null;
  
  // Conversion Result
  conversionResult: ConversionResult | null;
  
  // Preview
  preview: PreviewData | null;
  structure: StructureAnalysis | null;
  
  // Column Configuration
  columns: ColumnConfig[];
  
  // Settings
  settings: ExcelExportSettings;
  
  // Export State
  isExporting: boolean;
  lastExportResult: ExportResult | null;
  
  // UI State
  isProcessing: boolean;
  activeTab: 'options' | 'columns' | 'presets';
  
  // Actions - Input
  setInput: (input: string) => void;
  clearInput: () => void;
  
  // Actions - Processing
  processInput: () => void;
  
  // Actions - Columns
  toggleColumn: (key: string) => void;
  renameColumn: (key: string, newName: string) => void;
  reorderColumn: (fromIndex: number, toIndex: number) => void;
  selectAll: () => void;
  deselectAll: () => void;
  resetColumns: () => void;
  
  // Actions - Settings
  updateSettings: (updates: Partial<ExcelExportSettings>) => void;
  resetSettings: () => void;
  applyPreset: (presetId: string) => void;
  
  // Actions - Export
  exportExcel: () => Promise<ExportResult>;
  downloadExcel: () => void;
  
  // Actions - UI
  setActiveTab: (tab: 'options' | 'columns' | 'presets') => void;
  
  // Actions - Reset
  resetAll: () => void;
}

// ============================================================================
// Store
// ============================================================================

export const useJsonExcelStore = create<JsonExcelState>((set, get) => ({
  // Initial state
  input: '',
  parsedData: null,
  parseError: null,
  conversionResult: null,
  preview: null,
  structure: null,
  columns: [],
  settings: DEFAULT_EXPORT_SETTINGS,
  isExporting: false,
  lastExportResult: null,
  isProcessing: false,
  activeTab: 'options',
  
  // Input actions
  setInput: (input) => {
    set({ input });
    // Auto-process after setting input
    get().processInput();
  },
  
  clearInput: () => set({
    input: '',
    parsedData: null,
    parseError: null,
    conversionResult: null,
    preview: null,
    structure: null,
    columns: [],
    lastExportResult: null,
  }),
  
  // Processing actions
  processInput: () => {
    const { input, settings } = get();
    
    if (!input.trim()) {
      set({
        parsedData: null,
        parseError: null,
        conversionResult: null,
        preview: null,
        structure: null,
        columns: [],
      });
      return;
    }
    
    set({ isProcessing: true });
    
    // Parse JSON
    const { data, error } = parseJSON(input);
    
    if (error || !data) {
      set({
        parsedData: null,
        parseError: error || 'Invalid JSON',
        conversionResult: null,
        preview: null,
        structure: null,
        columns: [],
        isProcessing: false,
      });
      return;
    }
    
    // Convert to tabular format
    const result = convertToTabular(data, settings);
    
    set({
      parsedData: data,
      parseError: null,
      conversionResult: result,
      preview: result.preview,
      structure: result.structure,
      columns: result.columns,
      isProcessing: false,
    });
  },
  
  // Column actions
  toggleColumn: (key) => set((state) => ({
    columns: toggleColumnVisibility(state.columns, key),
  })),
  
  renameColumn: (key, newName) => set((state) => ({
    columns: renameColumn(state.columns, key, newName),
  })),
  
  reorderColumn: (fromIndex, toIndex) => set((state) => ({
    columns: reorderColumns(state.columns, fromIndex, toIndex),
  })),
  
  selectAll: () => set((state) => ({
    columns: selectAllColumns(state.columns),
  })),
  
  deselectAll: () => set((state) => ({
    columns: deselectAllColumns(state.columns),
  })),
  
  resetColumns: () => {
    // Re-process to get original columns
    const { parsedData, settings } = get();
    if (parsedData) {
      const result = convertToTabular(parsedData, settings);
      set({ columns: result.columns });
    }
  },
  
  // Settings actions
  updateSettings: (updates) => {
    set((state) => ({
      settings: { ...state.settings, ...updates },
    }));
    // Re-process if flattening settings changed
    if ('flattenNested' in updates || 'flattenDepth' in updates || 'flattenDelimiter' in updates) {
      get().processInput();
    }
  },
  
  resetSettings: () => set({ settings: DEFAULT_EXPORT_SETTINGS }),
  
  applyPreset: (presetId) => set((state) => {
    const preset = EXPORT_PRESETS.find((p) => p.id === presetId);
    if (!preset) return state;
    
    return {
      settings: { ...state.settings, ...preset.settings },
    };
  }),
  
  // Export actions
  exportExcel: async () => {
    const { parsedData, columns, settings } = get();
    
    if (!parsedData) {
      const errorResult: ExportResult = {
        success: false,
        filename: '',
        format: settings.format,
        rowCount: 0,
        columnCount: 0,
        error: 'No data to export',
      };
      set({ lastExportResult: errorResult });
      return errorResult;
    }
    
    set({ isExporting: true });
    
    try {
      const blob = generateExcelBlob(parsedData, columns, settings);
      
      if (!blob) {
        const errorResult: ExportResult = {
          success: false,
          filename: '',
          format: settings.format,
          rowCount: 0,
          columnCount: 0,
          error: 'Failed to generate file',
        };
        set({ isExporting: false, lastExportResult: errorResult });
        return errorResult;
      }
      
      // Create download
      const extension = settings.format === 'csv' ? 'csv' : settings.format;
      const filename = `${settings.filename}.${extension}`;
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      const result: ExportResult = {
        success: true,
        filename,
        format: settings.format,
        rowCount: get().preview?.totalRows || 0,
        columnCount: columns.filter(c => c.visible).length,
        fileSize: blob.size,
      };
      
      set({ isExporting: false, lastExportResult: result });
      return result;
    } catch (error) {
      const errorResult: ExportResult = {
        success: false,
        filename: '',
        format: settings.format,
        rowCount: 0,
        columnCount: 0,
        error: (error as Error).message,
      };
      set({ isExporting: false, lastExportResult: errorResult });
      return errorResult;
    }
  },
  
  downloadExcel: () => {
    get().exportExcel();
  },
  
  // UI actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  // Reset actions
  resetAll: () => set({
    input: '',
    parsedData: null,
    parseError: null,
    conversionResult: null,
    preview: null,
    structure: null,
    columns: [],
    settings: DEFAULT_EXPORT_SETTINGS,
    isExporting: false,
    lastExportResult: null,
    isProcessing: false,
    activeTab: 'options',
  }),
}));

// ============================================================================
// Selectors
// ============================================================================

export const selectHasInput = (state: JsonExcelState) =>
  state.input.trim() !== '';

export const selectHasValidData = (state: JsonExcelState) =>
  state.parsedData !== null && state.parseError === null;

export const selectHasPreview = (state: JsonExcelState) =>
  state.preview !== null && state.preview.rows.length > 0;

export const selectVisibleColumns = (state: JsonExcelState) =>
  state.columns.filter(col => col.visible).sort((a, b) => a.order - b.order);

export const selectColumnCount = (state: JsonExcelState) =>
  state.columns.filter(col => col.visible).length;

export const selectCanExport = (state: JsonExcelState) =>
  state.parsedData !== null && 
  state.columns.some(col => col.visible) && 
  !state.isExporting;

// Re-export types for convenience
export type { ExcelExportSettings, ColumnConfig, PreviewData, StructureAnalysis, ExportResult };
