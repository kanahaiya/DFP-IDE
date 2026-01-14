'use client';

import { create } from 'zustand';

export type YAMLIndentation = 2 | 4 | 'tab';
export type QuoteStyle = 'auto' | 'single' | 'double' | 'none';
export type FlowStyle = 'block' | 'flow' | 'mixed';
export type ArrayFormat = 'hyphen' | 'flow';

export interface YAMLSettings {
  // Formatting options
  indentation: YAMLIndentation;
  quoteStyle: QuoteStyle;
  flowStyle: FlowStyle;
  arrayFormat: ArrayFormat;
  lineWidth: number;
  
  // Advanced options
  sortKeys: boolean;
  noRefs: boolean; // No circular references
  skipInvalid: boolean;
  quotingType: "'" | '"';
  forceQuotes: boolean;
  noCompatMode: boolean;
  condenseFlow: boolean;
}

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  type: 'syntax' | 'structure';
}

interface YAMLState {
  input: string;
  output: string;
  settings: YAMLSettings;
  errors: ValidationError[];
  isConverting: boolean;
  
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  updateSettings: (updates: Partial<YAMLSettings>) => void;
  resetSettings: () => void;
  resetAll: () => void;
}

const DEFAULT_SETTINGS: YAMLSettings = {
  indentation: 2,
  quoteStyle: 'auto',
  flowStyle: 'block',
  arrayFormat: 'hyphen',
  lineWidth: -1,
  sortKeys: false,
  noRefs: true,
  skipInvalid: false,
  quotingType: '"',
  forceQuotes: false,
  noCompatMode: false,
  condenseFlow: false,
};

export const useYAMLStore = create<YAMLState>((set) => ({
  input: '',
  output: '',
  settings: DEFAULT_SETTINGS,
  errors: [],
  isConverting: false,
  
  setInput: (input) => set({ input }),
  setOutput: (output) => set({ output }),
  
  updateSettings: (updates) => set(state => ({
    settings: { ...state.settings, ...updates }
  })),
  
  resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
  
  resetAll: () => set({
    input: '',
    output: '',
    settings: DEFAULT_SETTINGS,
    errors: [],
    isConverting: false,
  }),
}));
