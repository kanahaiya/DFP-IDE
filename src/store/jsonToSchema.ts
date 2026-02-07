/**
 * JSON to Schema Generator Zustand Store
 * State management for schema generation tool
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  SchemaGeneratorSettings, 
  SchemaGenerationResult,
  SchemaFormat,
  SchemaFormatInfo,
} from '@/lib/schema-generator/types';
import { DEFAULT_SCHEMA_GENERATOR_SETTINGS, SCHEMA_FORMATS } from '@/lib/schema-generator/types';
import { generateSchema } from '@/lib/schema-generator';

interface JsonToSchemaState {
  // Input
  input: string;
  
  // Output
  result: SchemaGenerationResult | null;
  
  // Settings
  settings: SchemaGeneratorSettings;
  
  // Actions
  setInput: (input: string) => void;
  generate: () => void;
  setFormat: (format: SchemaFormat) => void;
  updateSettings: (settings: Partial<SchemaGeneratorSettings>) => void;
  resetSettings: () => void;
  clear: () => void;
  formatInput: () => void;
}

const DEFAULT_INPUT = `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "isActive": true,
  "tags": ["developer", "designer"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA",
    "zipCode": "10001"
  },
  "createdAt": "2026-01-16T10:30:00Z"
}`;

export const useJsonToSchemaStore = create<JsonToSchemaState>()(
  persist(
    (set, get) => ({
      // Initial state
      input: DEFAULT_INPUT,
      result: null,
      settings: DEFAULT_SCHEMA_GENERATOR_SETTINGS,
      
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
        
        const result = generateSchema(input, settings);
        set({ result });
      },
      
      setFormat: (format: SchemaFormat) => {
        set(state => ({
          settings: { ...state.settings, format },
        }));
        get().generate();
      },
      
      updateSettings: (newSettings: Partial<SchemaGeneratorSettings>) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        }));
        get().generate();
      },
      
      resetSettings: () => {
        set({ settings: DEFAULT_SCHEMA_GENERATOR_SETTINGS });
        get().generate();
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
          set({ input: JSON.stringify(parsed, null, 2) });
        } catch {
          // Invalid JSON, can't format
        }
      },
    }),
    {
      name: 'json-to-schema-storage',
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);

// Export schema formats for easy access
export { SCHEMA_FORMATS };
export type { SchemaFormatInfo };
