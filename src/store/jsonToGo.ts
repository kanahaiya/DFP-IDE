/**
 * Zustand store for JSON to Go converter
 */

import { create } from 'zustand';
import type { GoGeneratorSettings, GoConversionResult } from '@/lib/go/types';
import { DEFAULT_GO_SETTINGS } from '@/lib/go/types';
import { convertJSONToGo } from '@/lib/go/generator';

export interface ValidationError {
  message: string;
  line?: number;
  column?: number;
  type: 'syntax' | 'type' | 'naming';
}

interface JsonToGoState {
  // Input/Output
  input: string;
  output: string;
  
  // Settings
  settings: GoGeneratorSettings;
  
  // Status
  isProcessing: boolean;
  errors: ValidationError[];
  structCount: number;
  
  // UI state
  showHelp: boolean;
  activePreset: string | null;
  
  // Actions
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  updateSettings: (settings: Partial<GoGeneratorSettings>) => void;
  resetSettings: () => void;
  convert: () => void;
  setShowHelp: (show: boolean) => void;
  setActivePreset: (presetId: string | null) => void;
  applyPreset: (presetId: string) => void;
  clearAll: () => void;
}

export const useJsonToGoStore = create<JsonToGoState>((set, get) => ({
  // Initial state
  input: '',
  output: '',
  settings: { ...DEFAULT_GO_SETTINGS },
  isProcessing: false,
  errors: [],
  structCount: 0,
  showHelp: false,
  activePreset: 'default',
  
  // Actions
  setInput: (input: string) => {
    set({ input });
    // Auto-convert on input change
    const state = get();
    if (input.trim()) {
      state.convert();
    } else {
      set({ output: '', errors: [], structCount: 0 });
    }
  },
  
  setOutput: (output: string) => set({ output }),
  
  updateSettings: (newSettings: Partial<GoGeneratorSettings>) => {
    set(state => ({
      settings: { ...state.settings, ...newSettings },
      activePreset: null // Clear preset when settings manually changed
    }));
    // Re-convert with new settings
    const state = get();
    if (state.input.trim()) {
      state.convert();
    }
  },
  
  resetSettings: () => {
    set({ 
      settings: { ...DEFAULT_GO_SETTINGS },
      activePreset: 'default'
    });
    const state = get();
    if (state.input.trim()) {
      state.convert();
    }
  },
  
  convert: () => {
    const { input, settings } = get();
    
    if (!input.trim()) {
      set({ output: '', errors: [], structCount: 0 });
      return;
    }
    
    set({ isProcessing: true });
    
    try {
      const result: GoConversionResult = convertJSONToGo(input, settings);
      
      if (result.success) {
        set({
          output: result.code || '',
          errors: [],
          structCount: result.structCount || 0,
          isProcessing: false
        });
      } else {
        set({
          output: '',
          errors: result.errors || [],
          structCount: 0,
          isProcessing: false
        });
      }
    } catch (error) {
      set({
        output: '',
        errors: [{
          message: error instanceof Error ? error.message : 'Conversion failed',
          type: 'syntax'
        }],
        structCount: 0,
        isProcessing: false
      });
    }
  },
  
  setShowHelp: (show: boolean) => set({ showHelp: show }),
  
  setActivePreset: (presetId: string | null) => set({ activePreset: presetId }),
  
  applyPreset: (presetId: string) => {
    // Import presets dynamically to avoid circular dependency
    import('@/lib/go/presets').then(({ getGoPreset }) => {
      const preset = getGoPreset(presetId);
      if (preset) {
        set(state => ({
          settings: { ...state.settings, ...preset.settings },
          activePreset: presetId
        }));
        const state = get();
        if (state.input.trim()) {
          state.convert();
        }
      }
    });
  },
  
  clearAll: () => {
    set({
      input: '',
      output: '',
      errors: [],
      structCount: 0,
      settings: { ...DEFAULT_GO_SETTINGS },
      activePreset: 'default'
    });
  }
}));
