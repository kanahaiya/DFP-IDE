import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ObjCGeneratorSettings } from '@/lib/objc/types';
import { DEFAULT_OBJC_SETTINGS } from '@/lib/objc/types';

interface JsonToObjCState {
  settings: ObjCGeneratorSettings;
  updateSettings: (settings: Partial<ObjCGeneratorSettings>) => void;
  resetSettings: () => void;
}

export const useJsonToObjCStore = create<JsonToObjCState>()(
  persist(
    (set) => ({
      settings: DEFAULT_OBJC_SETTINGS,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      resetSettings: () => set({ settings: DEFAULT_OBJC_SETTINGS }),
    }),
    {
      name: 'json-to-objc-settings',
    }
  )
);
