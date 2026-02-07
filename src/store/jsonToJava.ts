/**
 * Zustand store for JSON to Java converter state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JavaGeneratorSettings } from '@/lib/java/types';
import { DEFAULT_JAVA_SETTINGS } from '@/lib/java/types';

interface JsonToJavaStore {
  settings: JavaGeneratorSettings;
  updateSettings: (settings: Partial<JavaGeneratorSettings>) => void;
  resetSettings: () => void;
  applyPreset: (presetSettings: Partial<JavaGeneratorSettings>) => void;
}

export const useJsonToJavaStore = create<JsonToJavaStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_JAVA_SETTINGS,
      
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      
      resetSettings: () =>
        set({ settings: DEFAULT_JAVA_SETTINGS }),
      
      applyPreset: (presetSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...presetSettings },
        })),
    }),
    {
      name: 'json-to-java-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);
