'use client';

import { create } from 'zustand';
import type {
  MinifierSettings,
  MinifyResult,
  ValidationError,
  CompressionStats,
} from '@/lib/minifier/types';
import {
  DEFAULT_MINIFIER_SETTINGS,
  MINIFIER_PRESETS,
} from '@/lib/minifier/types';

// ============================================================================
// State Interface
// ============================================================================

interface JsonMinifierState {
  // Input/Output
  input: string;
  output: string;
  
  // Processing result
  result: MinifyResult | null;
  
  // Settings
  settings: MinifierSettings;
  
  // Validation
  errors: ValidationError[];
  
  // Compression stats
  compressionStats: CompressionStats | null;
  
  // UI State
  isProcessing: boolean;
  showComparison: boolean;
  
  // Actions - Input/Output
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  setResult: (result: MinifyResult | null) => void;
  
  // Actions - Settings
  updateSettings: (updates: Partial<MinifierSettings>) => void;
  resetSettings: () => void;
  applyPreset: (presetId: string) => void;
  toggleMode: () => void;
  
  // Actions - State
  setIsProcessing: (isProcessing: boolean) => void;
  setErrors: (errors: ValidationError[]) => void;
  setCompressionStats: (stats: CompressionStats | null) => void;
  
  // Actions - UI
  toggleComparison: () => void;
  
  // Actions - Reset
  resetAll: () => void;
  clearInput: () => void;
}

// ============================================================================
// Store
// ============================================================================

export const useJsonMinifierStore = create<JsonMinifierState>((set) => ({
  // Initial state
  input: '',
  output: '',
  result: null,
  settings: DEFAULT_MINIFIER_SETTINGS,
  errors: [],
  compressionStats: null,
  isProcessing: false,
  showComparison: false,
  
  // Input/Output actions
  setInput: (input) => set({ input }),
  
  setOutput: (output) => set({ output }),
  
  setResult: (result) => set({
    result,
    output: result?.output || '',
    compressionStats: result?.stats || null,
    errors: result?.errors || [],
  }),
  
  // Settings actions
  updateSettings: (updates) => set((state) => ({
    settings: { ...state.settings, ...updates },
  })),
  
  resetSettings: () => set({ settings: DEFAULT_MINIFIER_SETTINGS }),
  
  applyPreset: (presetId) => set((state) => {
    const preset = MINIFIER_PRESETS.find((p) => p.id === presetId);
    if (!preset) return state;
    
    return {
      settings: { ...state.settings, ...preset.settings },
    };
  }),
  
  toggleMode: () => set((state) => ({
    settings: {
      ...state.settings,
      mode: state.settings.mode === 'minify' ? 'beautify' : 'minify',
    },
  })),
  
  // State actions
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  
  setErrors: (errors) => set({ errors }),
  
  setCompressionStats: (stats) => set({ compressionStats: stats }),
  
  // UI actions
  toggleComparison: () => set((state) => ({
    showComparison: !state.showComparison,
  })),
  
  // Reset actions
  resetAll: () => set({
    input: '',
    output: '',
    result: null,
    settings: DEFAULT_MINIFIER_SETTINGS,
    errors: [],
    compressionStats: null,
    isProcessing: false,
    showComparison: false,
  }),
  
  clearInput: () => set({
    input: '',
    output: '',
    result: null,
    errors: [],
    compressionStats: null,
  }),
}));

// ============================================================================
// Selectors
// ============================================================================

export const selectHasInput = (state: JsonMinifierState) =>
  state.input.trim() !== '';

export const selectHasOutput = (state: JsonMinifierState) =>
  state.output.trim() !== '';

export const selectHasErrors = (state: JsonMinifierState) =>
  state.errors.length > 0;

export const selectIsMinifyMode = (state: JsonMinifierState) =>
  state.settings.mode === 'minify';

export const selectIsBeautifyMode = (state: JsonMinifierState) =>
  state.settings.mode === 'beautify';

export const selectCompressionPercentage = (state: JsonMinifierState) =>
  state.compressionStats?.percentageReduction ?? 0;

export const selectBytesSaved = (state: JsonMinifierState) =>
  state.compressionStats?.bytesSaved ?? 0;

// Re-export types for convenience
export type { MinifierSettings, MinifyResult, ValidationError, CompressionStats };
