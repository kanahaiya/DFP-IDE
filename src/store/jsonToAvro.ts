/**
 * JSON to Avro Zustand Store
 * State management for Avro schema generation tool
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AvroGeneratorSettings, AvroGenerationResult } from '@/lib/avro/types';
import { DEFAULT_AVRO_SETTINGS } from '@/lib/avro/types';
import { jsonToAvroSchema } from '@/lib/avro/schemaInference';

interface JsonToAvroState {
  // Input
  input: string;
  
  // Output
  result: AvroGenerationResult | null;
  
  // Settings
  settings: AvroGeneratorSettings;
  
  // Actions
  setInput: (input: string) => void;
  generate: () => void;
  updateSettings: (settings: Partial<AvroGeneratorSettings>) => void;
  resetSettings: () => void;
  clear: () => void;
  formatInput: () => void;
}

const DEFAULT_INPUT = `{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "john_doe",
  "email": "john@example.com",
  "is_active": true,
  "age": 30,
  "balance": 1500.75,
  "roles": ["admin", "user"],
  "profile": {
    "first_name": "John",
    "last_name": "Doe",
    "bio": "Software developer",
    "birth_date": "1996-05-15"
  },
  "last_login": "2026-01-17T10:30:00Z"
}`;

export const useJsonToAvroStore = create<JsonToAvroState>()(
  persist(
    (set, get) => ({
      // Initial state
      input: DEFAULT_INPUT,
      result: null,
      settings: DEFAULT_AVRO_SETTINGS,
      
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
        
        const result = jsonToAvroSchema(input, settings);
        set({ result });
      },
      
      updateSettings: (newSettings: Partial<AvroGeneratorSettings>) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        }));
        // Re-generate with new settings
        setTimeout(() => get().generate(), 100);
      },
      
      resetSettings: () => {
        set({ settings: DEFAULT_AVRO_SETTINGS });
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
      name: 'json-to-avro-storage',
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);
