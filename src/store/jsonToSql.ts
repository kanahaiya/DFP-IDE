import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SqlGeneratorSettings } from '@/lib/sql/types';
import { DEFAULT_SQL_SETTINGS } from '@/lib/sql/types';

interface JsonToSqlState {
  settings: SqlGeneratorSettings;
  updateSettings: (settings: Partial<SqlGeneratorSettings>) => void;
  resetSettings: () => void;
}

export const useJsonToSqlStore = create<JsonToSqlState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SQL_SETTINGS,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      resetSettings: () => set({ settings: DEFAULT_SQL_SETTINGS }),
    }),
    {
      name: 'json-to-sql-settings',
    }
  )
);
