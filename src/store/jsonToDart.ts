/**
 * Zustand store for JSON to Dart converter
 */

import { create } from 'zustand';
import type { DartGeneratorSettings, DartConversionResult } from '@/lib/dart/types';
import { DEFAULT_DART_SETTINGS } from '@/lib/dart/types';
import { convertJSONToDart } from '@/lib/dart/generator';

export interface ValidationError {
  message: string;
  line?: number;
  column?: number;
  type: 'syntax' | 'type' | 'naming';
}

interface JsonToDartState {
  input: string;
  output: string;
  settings: DartGeneratorSettings;
  isProcessing: boolean;
  errors: ValidationError[];
  classCount: number;
  showHelp: boolean;
  activePreset: string | null;
  
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  updateSettings: (settings: Partial<DartGeneratorSettings>) => void;
  resetSettings: () => void;
  convert: () => void;
  setShowHelp: (show: boolean) => void;
  setActivePreset: (presetId: string | null) => void;
  applyPreset: (presetId: string) => void;
  clearAll: () => void;
}

export const useJsonToDartStore = create<JsonToDartState>((set, get) => ({
  input: '',
  output: '',
  settings: { ...DEFAULT_DART_SETTINGS },
  isProcessing: false,
  errors: [],
  classCount: 0,
  showHelp: false,
  activePreset: 'default',
  
  setInput: (input: string) => {
    set({ input });
    const state = get();
    if (input.trim()) {
      state.convert();
    } else {
      set({ output: '', errors: [], classCount: 0 });
    }
  },
  
  setOutput: (output: string) => set({ output }),
  
  updateSettings: (newSettings: Partial<DartGeneratorSettings>) => {
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
      settings: { ...DEFAULT_DART_SETTINGS },
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
      set({ output: '', errors: [], classCount: 0 });
      return;
    }
    
    set({ isProcessing: true });
    
    try {
      const result: DartConversionResult = convertJSONToDart(input, settings);
      
      if (result.success) {
        set({
          output: result.code || '',
          errors: [],
          classCount: result.classCount || 0,
          isProcessing: false
        });
      } else {
        set({
          output: '',
          errors: result.errors || [],
          classCount: 0,
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
        classCount: 0,
        isProcessing: false
      });
    }
  },
  
  setShowHelp: (show: boolean) => set({ showHelp: show }),
  
  setActivePreset: (presetId: string | null) => set({ activePreset: presetId }),
  
  applyPreset: (presetId: string) => {
    import('@/lib/dart/presets').then(({ getDartPreset }) => {
      const preset = getDartPreset(presetId);
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
      classCount: 0,
      settings: { ...DEFAULT_DART_SETTINGS },
      activePreset: 'default'
    });
  }
}));
