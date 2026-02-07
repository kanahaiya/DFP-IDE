/**
 * Zustand store for JSON to Python converter state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PythonGeneratorSettings } from '@/lib/python/types';
import { DEFAULT_PYTHON_SETTINGS } from '@/lib/python/types';

interface JsonToPythonStore {
  settings: PythonGeneratorSettings;
  updateSettings: (settings: Partial<PythonGeneratorSettings>) => void;
  resetSettings: () => void;
  applyPreset: (presetSettings: Partial<PythonGeneratorSettings>) => void;
}

export const useJsonToPythonStore = create<JsonToPythonStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_PYTHON_SETTINGS,
      
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      
      resetSettings: () =>
        set({ settings: DEFAULT_PYTHON_SETTINGS }),
      
      applyPreset: (presetSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...presetSettings },
        })),
    }),
    {
      name: 'json-to-python-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);
