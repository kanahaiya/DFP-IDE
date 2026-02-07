import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CrystalGeneratorSettings } from '@/lib/crystal/types';
import { DEFAULT_CRYSTAL_SETTINGS } from '@/lib/crystal/types';

interface JsonToCrystalState {
  settings: CrystalGeneratorSettings;
  updateSettings: (settings: Partial<CrystalGeneratorSettings>) => void;
  resetSettings: () => void;
}

export const useJsonToCrystalStore = create<JsonToCrystalState>()(
  persist(
    (set) => ({
      settings: DEFAULT_CRYSTAL_SETTINGS,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      resetSettings: () => set({ settings: DEFAULT_CRYSTAL_SETTINGS }),
    }),
    {
      name: 'json-to-crystal-settings',
    }
  )
);
