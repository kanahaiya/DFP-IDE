/**
 * JSON Cleaner Zustand Store
 * State management for JSON cleaner tool
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CleanerSettings, CleaningResult, CleanerPreset } from '@/lib/json-cleaner/types';
import { DEFAULT_CLEANER_SETTINGS } from '@/lib/json-cleaner/types';
import { cleanJSON } from '@/lib/json-cleaner/cleaner';
import { transformJSON } from '@/lib/json-cleaner/transformer';
import { applyPreset as getPresetSettings } from '@/lib/json-cleaner/presets';

interface JsonCleanerState {
  // Input/Output
  input: string;
  output: string;
  
  // Results
  cleaningResult: CleaningResult | null;
  isProcessing: boolean;
  
  // Settings
  settings: CleanerSettings;
  
  // UI state
  activeTab: 'cleaning' | 'transform' | 'presets';
  showStats: boolean;
  
  // Actions
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  process: () => void;
  cleanOnly: () => void;
  transformOnly: () => void;
  updateCleaningSettings: (settings: Partial<CleanerSettings['cleaning']>) => void;
  updateTransformSettings: (settings: Partial<CleanerSettings['transform']>) => void;
  applyPreset: (presetId: CleanerPreset) => void;
  resetSettings: () => void;
  setActiveTab: (tab: 'cleaning' | 'transform' | 'presets') => void;
  toggleStats: () => void;
  clear: () => void;
  formatOutput: () => void;
  minifyOutput: () => void;
}

const DEFAULT_INPUT = `{
  "user": {
    "name": "  John Doe  ",
    "email": "john@example.com",
    "age": 30,
    "bio": "",
    "tags": ["developer", "developer", "designer"],
    "metadata": null,
    "settings": {}
  },
  "config": {
    "THEME": "dark",
    "API_KEY": "abc123"
  }
}`;

export const useJsonCleanerStore = create<JsonCleanerState>()(
  persist(
    (set, get) => ({
      // Initial state
      input: DEFAULT_INPUT,
      output: '',
      cleaningResult: null,
      isProcessing: false,
      settings: DEFAULT_CLEANER_SETTINGS,
      activeTab: 'cleaning',
      showStats: true,
      
      // Actions
      setInput: (input: string) => {
        set({ input });
      },
      
      setOutput: (output: string) => {
        set({ output });
      },
      
      process: () => {
        const { input, settings } = get();
        set({ isProcessing: true });
        
        try {
          // First clean
          const cleaningResult = cleanJSON(input, settings.cleaning);
          
          if (!cleaningResult.success) {
            set({
              cleaningResult,
              output: '',
              isProcessing: false,
            });
            return;
          }
          
          // Then transform
          const transformResult = transformJSON(
            cleaningResult.output,
            settings.transform,
            settings.cleaning.indentation
          );
          
          set({
            output: transformResult.output,
            cleaningResult: {
              ...cleaningResult,
              output: transformResult.output,
              stats: {
                ...cleaningResult.stats,
                outputSize: transformResult.output.length,
                sizeDifference: input.length - transformResult.output.length,
                sizeReduction: input.length > 0
                  ? ((input.length - transformResult.output.length) / input.length) * 100
                  : 0,
                transformedItems: transformResult.transformCount,
              },
            },
            isProcessing: false,
          });
        } catch {
          set({ isProcessing: false });
        }
      },
      
      cleanOnly: () => {
        const { input, settings } = get();
        set({ isProcessing: true });
        
        try {
          const result = cleanJSON(input, settings.cleaning);
          set({
            output: result.output,
            cleaningResult: result,
            isProcessing: false,
          });
        } catch {
          set({ isProcessing: false });
        }
      },
      
      transformOnly: () => {
        const { input, settings } = get();
        set({ isProcessing: true });
        
        try {
          const result = transformJSON(input, settings.transform, settings.cleaning.indentation);
          set({
            output: result.output,
            cleaningResult: {
              success: result.success,
              input,
              output: result.output,
              operations: [],
              stats: {
                inputSize: input.length,
                outputSize: result.output.length,
                sizeDifference: input.length - result.output.length,
                sizeReduction: input.length > 0
                  ? ((input.length - result.output.length) / input.length) * 100
                  : 0,
                removedItems: 0,
                transformedItems: result.transformCount,
                inputKeyCount: 0,
                outputKeyCount: 0,
              },
              processingTime: 0,
              error: result.error,
            },
            isProcessing: false,
          });
        } catch {
          set({ isProcessing: false });
        }
      },
      
      updateCleaningSettings: (newSettings: Partial<CleanerSettings['cleaning']>) => {
        set(state => ({
          settings: {
            ...state.settings,
            cleaning: {
              ...state.settings.cleaning,
              ...newSettings,
            },
          },
        }));
      },
      
      updateTransformSettings: (newSettings: Partial<CleanerSettings['transform']>) => {
        set(state => ({
          settings: {
            ...state.settings,
            transform: {
              ...state.settings.transform,
              ...newSettings,
            },
          },
        }));
      },
      
      applyPreset: (presetId: CleanerPreset) => {
        const presetSettings = getPresetSettings(presetId);
        set({ settings: presetSettings });
      },
      
      resetSettings: () => {
        set({ settings: DEFAULT_CLEANER_SETTINGS });
      },
      
      setActiveTab: (tab: 'cleaning' | 'transform' | 'presets') => {
        set({ activeTab: tab });
      },
      
      toggleStats: () => {
        set(state => ({ showStats: !state.showStats }));
      },
      
      clear: () => {
        set({
          input: '',
          output: '',
          cleaningResult: null,
        });
      },
      
      formatOutput: () => {
        const { output, settings } = get();
        try {
          const parsed = JSON.parse(output);
          const indent = settings.cleaning.indentation === 'tab' ? '\t' : settings.cleaning.indentation;
          const formatted = JSON.stringify(parsed, null, indent);
          set({ output: formatted });
        } catch {
          // Invalid JSON, can't format
        }
      },
      
      minifyOutput: () => {
        const { output } = get();
        try {
          const parsed = JSON.parse(output);
          const minified = JSON.stringify(parsed);
          set({ output: minified });
        } catch {
          // Invalid JSON, can't minify
        }
      },
    }),
    {
      name: 'json-cleaner-storage',
      partialize: (state) => ({
        settings: state.settings,
        showStats: state.showStats,
      }),
    }
  )
);
