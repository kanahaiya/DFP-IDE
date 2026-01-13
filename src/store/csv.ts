'use client';

import { create } from 'zustand';
import type { OutputFormat } from '@/types';

// CSV output format types
export type CSVOutputFormat = 'array' | 'keyed' | 'columns' | 'nested';

// Delimiter types
export type Delimiter = 'auto' | ',' | ';' | '\t' | '|' | 'custom';

// Indentation types
export type Indentation = 2 | 4 | 'tab' | 'minified';

export interface CSVSettings {
  // Parsing options
  delimiter: Delimiter;
  customDelimiter: string;
  hasHeader: boolean;
  trimWhitespace: boolean;
  skipEmptyLines: boolean;
  
  // Data type parsing
  parseNumbers: boolean;
  parseBooleans: boolean;
  parseNulls: boolean;
  parseDates: boolean;
  
  // Output options
  outputFormat: CSVOutputFormat;
  jsonFormat: OutputFormat; // 'json' or 'yaml' (though CSV->JSON typically outputs JSON)
  indentation: Indentation;
  sortKeys: boolean;
  compactOutput: boolean;
  
  // Advanced options
  quoteHandling: boolean;
  escapeHandling: boolean;
}

interface CSVState {
  inputCSV: string;
  outputJSON: string;
  settings: CSVSettings;
  
  // Actions
  setInputCSV: (csv: string) => void;
  setOutputJSON: (json: string) => void;
  updateSettings: (updates: Partial<CSVSettings>) => void;
  resetSettings: () => void;
  resetAll: () => void;
}

const DEFAULT_SETTINGS: CSVSettings = {
  // Parsing options
  delimiter: 'auto',
  customDelimiter: ',',
  hasHeader: true,
  trimWhitespace: true,
  skipEmptyLines: true,
  
  // Data type parsing
  parseNumbers: true,
  parseBooleans: true,
  parseNulls: true,
  parseDates: true,
  
  // Output options
  outputFormat: 'array',
  jsonFormat: 'json',
  indentation: 2,
  sortKeys: false,
  compactOutput: false,
  
  // Advanced options
  quoteHandling: true,
  escapeHandling: true,
};

export const useCSVStore = create<CSVState>((set) => ({
  inputCSV: '',
  outputJSON: '',
  settings: DEFAULT_SETTINGS,
  
  setInputCSV: (csv: string) => set({ inputCSV: csv }),
  
  setOutputJSON: (json: string) => set({ outputJSON: json }),
  
  updateSettings: (updates: Partial<CSVSettings>) => set((state) => ({
    settings: { ...state.settings, ...updates },
  })),
  
  resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
  
  resetAll: () => set({
    inputCSV: '',
    outputJSON: '',
    settings: DEFAULT_SETTINGS,
  }),
}));
