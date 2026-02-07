/**
 * JSON to Parquet Zustand Store
 * State management for Parquet schema generation tool
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ParquetGeneratorSettings, ParquetGenerationResult } from '@/lib/parquet/types';
import { DEFAULT_PARQUET_SETTINGS } from '@/lib/parquet/types';
import { jsonToParquetSchema } from '@/lib/parquet/schemaInference';

interface JsonToParquetState {
  // Input
  input: string;

  // Output
  result: ParquetGenerationResult | null;

  // Settings
  settings: ParquetGeneratorSettings;

  // Actions
  setInput: (input: string) => void;
  generate: () => void;
  updateSettings: (settings: Partial<ParquetGeneratorSettings>) => void;
  resetSettings: () => void;
  clear: () => void;
  formatInput: () => void;
}

const DEFAULT_INPUT = `[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "is_active": true,
    "balance": 1500.75,
    "created_at": "2026-01-17T10:30:00Z",
    "tags": ["developer", "admin"]
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "age": 28,
    "is_active": true,
    "balance": 2500.00,
    "created_at": "2026-01-16T15:45:00Z",
    "tags": ["designer"]
  }
]`;

export const useJsonToParquetStore = create<JsonToParquetState>()(
  persist(
    (set, get) => ({
      // Initial state
      input: DEFAULT_INPUT,
      result: null,
      settings: DEFAULT_PARQUET_SETTINGS,

      // Actions
      setInput: (input: string) => {
        set({ input });
        // Auto-generate
        setTimeout(() => get().generate(), 300);
      },

      generate: () => {
        const { input, settings } = get();

        if (!input.trim()) {
          set({ result: null });
          return;
        }

        const result = jsonToParquetSchema(input, settings);
        set({ result });
      },

      updateSettings: (newSettings: Partial<ParquetGeneratorSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
        // Re-generate with new settings
        setTimeout(() => get().generate(), 100);
      },

      resetSettings: () => {
        set({ settings: DEFAULT_PARQUET_SETTINGS });
        setTimeout(() => get().generate(), 100);
      },

      clear: () => {
        set({
          input: '',
          result: null,
        });
      },

      formatInput: () => {
        const { input } = get();
        try {
          const parsed = JSON.parse(input);
          const formatted = JSON.stringify(parsed, null, 2);
          set({ input: formatted });
        } catch {
          // Invalid JSON, don't format
        }
      },
    }),
    {
      name: 'json-to-parquet-storage',
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);
