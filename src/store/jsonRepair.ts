/**
 * JSON Repair Zustand Store
 * State management for JSON repair tool
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RepairResult, RepairSettings, RepairMode } from '@/lib/json-repair/types';
import { DEFAULT_REPAIR_SETTINGS } from '@/lib/json-repair/types';
import { repairJSON, needsRepair, previewRepair } from '@/lib/json-repair/repairer';
import { applyPreset, recommendPreset } from '@/lib/json-repair/presets';

interface JsonRepairState {
  // Input/Output
  input: string;
  output: string;
  
  // Repair result
  result: RepairResult | null;
  isRepairing: boolean;
  
  // Preview
  preview: {
    willRepair: boolean;
    estimatedFixes: string[];
  } | null;
  
  // Settings
  settings: RepairSettings;
  
  // UI state
  showDiff: boolean;
  autoRepair: boolean;
  
  // Actions
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  repair: () => RepairResult;
  updatePreview: () => void;
  updateSettings: (settings: Partial<RepairSettings>) => void;
  applyPreset: (presetId: RepairMode) => void;
  recommendAndApplyPreset: () => RepairMode;
  resetSettings: () => void;
  clear: () => void;
  toggleDiff: () => void;
  toggleAutoRepair: () => void;
  formatOutput: () => void;
  minifyOutput: () => void;
}

const DEFAULT_INPUT = `{
  'name': 'John Doe',
  'email': 'john@example.com'
  "age": 30,
  "isActive": True,
  "tags": ["developer", "designer",],
  "metadata": None
}`;

export const useJsonRepairStore = create<JsonRepairState>()(
  persist(
    (set, get) => ({
      // Initial state
      input: DEFAULT_INPUT,
      output: '',
      result: null,
      isRepairing: false,
      preview: null,
      settings: DEFAULT_REPAIR_SETTINGS,
      showDiff: false,
      autoRepair: false,
      
      // Actions
      setInput: (input: string) => {
        set({ input });
        
        // Update preview
        get().updatePreview();
        
        // Auto-repair if enabled
        if (get().autoRepair && needsRepair(input)) {
          setTimeout(() => {
            get().repair();
          }, 300);
        }
      },
      
      setOutput: (output: string) => {
        set({ output });
      },
      
      repair: () => {
        const { input, settings } = get();
        set({ isRepairing: true });
        
        try {
          const result = repairJSON(input, settings);
          set({
            result,
            output: result.output,
            isRepairing: false,
          });
          return result;
        } catch {
          set({ isRepairing: false });
          return {
            success: false,
            input,
            output: input,
            isValid: false,
            operations: [],
            operationCounts: {} as RepairResult['operationCounts'],
            totalFixes: 0,
            repairTime: 0,
            error: 'Repair failed',
            confidence: 'low' as const,
          };
        }
      },
      
      updatePreview: () => {
        const { input } = get();
        const preview = previewRepair(input);
        set({ preview });
      },
      
      updateSettings: (newSettings: Partial<RepairSettings>) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        }));
        
        // Update preview with new settings
        get().updatePreview();
      },
      
      applyPreset: (presetId: RepairMode) => {
        const { settings } = get();
        const newSettings = applyPreset(settings, presetId);
        set({ settings: newSettings });
        get().updatePreview();
      },
      
      recommendAndApplyPreset: () => {
        const { input } = get();
        const recommended = recommendPreset(input);
        get().applyPreset(recommended);
        return recommended;
      },
      
      resetSettings: () => {
        set({ settings: DEFAULT_REPAIR_SETTINGS });
        get().updatePreview();
      },
      
      clear: () => {
        set({
          input: '',
          output: '',
          result: null,
          preview: null,
        });
      },
      
      toggleDiff: () => {
        set(state => ({ showDiff: !state.showDiff }));
      },
      
      toggleAutoRepair: () => {
        set(state => ({ autoRepair: !state.autoRepair }));
      },
      
      formatOutput: () => {
        const { output } = get();
        try {
          const parsed = JSON.parse(output);
          const formatted = JSON.stringify(parsed, null, 2);
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
      name: 'json-repair-storage',
      partialize: (state) => ({
        settings: state.settings,
        autoRepair: state.autoRepair,
      }),
    }
  )
);
