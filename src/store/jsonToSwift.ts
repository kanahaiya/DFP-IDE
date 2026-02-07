/**
 * Zustand store for JSON to Swift converter
 */

import { create } from 'zustand';
import type { SwiftGeneratorSettings, SwiftConversionResult } from '@/lib/swift/types';
import { DEFAULT_SWIFT_SETTINGS } from '@/lib/swift/types';
import { convertJSONToSwift } from '@/lib/swift/generator';

export interface ValidationError {
  message: string;
  line?: number;
  column?: number;
  type: 'syntax' | 'type' | 'naming';
}

interface JsonToSwiftState {
  input: string;
  output: string;
  settings: SwiftGeneratorSettings;
  isProcessing: boolean;
  errors: ValidationError[];
  typeCount: number;
  showHelp: boolean;
  activePreset: string | null;
  
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  updateSettings: (settings: Partial<SwiftGeneratorSettings>) => void;
  resetSettings: () => void;
  convert: () => void;
  setShowHelp: (show: boolean) => void;
  setActivePreset: (presetId: string | null) => void;
  applyPreset: (presetId: string) => void;
  clearAll: () => void;
}

export const useJsonToSwiftStore = create<JsonToSwiftState>((set, get) => ({
  input: '',
  output: '',
  settings: { ...DEFAULT_SWIFT_SETTINGS },
  isProcessing: false,
  errors: [],
  typeCount: 0,
  showHelp: false,
  activePreset: 'default',
  
  setInput: (input: string) => {
    set({ input });
    const state = get();
    if (input.trim()) {
      state.convert();
    } else {
      set({ output: '', errors: [], typeCount: 0 });
    }
  },
  
  setOutput: (output: string) => set({ output }),
  
  updateSettings: (newSettings: Partial<SwiftGeneratorSettings>) => {
    set(state => ({
      settings: { ...state.settings, ...newSettings },
      activePreset: null
    }));
    const state = get();
    if (state.input.trim()) {
      state.convert();
    }
  },
  
  resetSettings: () => {
    set({ 
      settings: { ...DEFAULT_SWIFT_SETTINGS },
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
      set({ output: '', errors: [], typeCount: 0 });
      return;
    }
    
    set({ isProcessing: true });
    
    try {
      const result: SwiftConversionResult = convertJSONToSwift(input, settings);
      
      if (result.success) {
        set({
          output: result.code || '',
          errors: [],
          typeCount: result.typeCount || 0,
          isProcessing: false
        });
      } else {
        set({
          output: '',
          errors: result.errors || [],
          typeCount: 0,
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
        typeCount: 0,
        isProcessing: false
      });
    }
  },
  
  setShowHelp: (show: boolean) => set({ showHelp: show }),
  
  setActivePreset: (presetId: string | null) => set({ activePreset: presetId }),
  
  applyPreset: (presetId: string) => {
    import('@/lib/swift/presets').then(({ getSwiftPreset }) => {
      const preset = getSwiftPreset(presetId);
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
      typeCount: 0,
      settings: { ...DEFAULT_SWIFT_SETTINGS },
      activePreset: 'default'
    });
  }
}));
