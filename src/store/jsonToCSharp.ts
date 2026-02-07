/**
 * Zustand store for JSON to C# converter state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CSharpGeneratorSettings } from '@/lib/csharp/types';
import { DEFAULT_CSHARP_SETTINGS } from '@/lib/csharp/types';

interface JsonToCSharpStore {
  settings: CSharpGeneratorSettings;
  updateSettings: (settings: Partial<CSharpGeneratorSettings>) => void;
  resetSettings: () => void;
  applyPreset: (presetSettings: Partial<CSharpGeneratorSettings>) => void;
}

export const useJsonToCSharpStore = create<JsonToCSharpStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_CSHARP_SETTINGS,
      
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      
      resetSettings: () =>
        set({ settings: DEFAULT_CSHARP_SETTINGS }),
      
      applyPreset: (presetSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...presetSettings },
        })),
    }),
    {
      name: 'json-to-csharp-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);
