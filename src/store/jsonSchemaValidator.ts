/**
 * JSON Schema Validator Zustand Store
 * State management for JSON Schema validation tool
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  SchemaValidationResult, 
  SchemaValidatorSettings, 
  ExampleSchema 
} from '@/lib/schema-validator/types';
import { DEFAULT_SCHEMA_VALIDATOR_SETTINGS } from '@/lib/schema-validator/types';
import { validateJSONSchema, validateSchema } from '@/lib/schema-validator/validator';
import { EXAMPLE_SCHEMAS } from '@/lib/schema-validator/schemas';

interface JsonSchemaValidatorState {
  // Input
  schema: string;
  data: string;
  
  // Validation result
  result: SchemaValidationResult | null;
  schemaErrors: string[];
  isValidating: boolean;
  
  // Settings
  settings: SchemaValidatorSettings;
  
  // Actions
  setSchema: (schema: string) => void;
  setData: (data: string) => void;
  validate: () => void;
  validateSchemaOnly: () => void;
  loadExample: (example: ExampleSchema) => void;
  updateSettings: (settings: Partial<SchemaValidatorSettings>) => void;
  resetSettings: () => void;
  clear: () => void;
  swapSchemaAndData: () => void;
  formatSchema: () => void;
  formatData: () => void;
}

const DEFAULT_SCHEMA = JSON.stringify({
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Example Schema",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1
    },
    "age": {
      "type": "integer",
      "minimum": 0
    },
    "email": {
      "type": "string",
      "format": "email"
    }
  },
  "required": ["name", "email"]
}, null, 2);

const DEFAULT_DATA = JSON.stringify({
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com"
}, null, 2);

export const useJsonSchemaValidatorStore = create<JsonSchemaValidatorState>()(
  persist(
    (set, get) => ({
      // Initial state
      schema: DEFAULT_SCHEMA,
      data: DEFAULT_DATA,
      result: null,
      schemaErrors: [],
      isValidating: false,
      settings: DEFAULT_SCHEMA_VALIDATOR_SETTINGS,
      
      // Actions
      setSchema: (schema: string) => {
        set({ schema });
        
        // Validate schema syntax
        const { valid, errors } = validateSchema(schema);
        set({ schemaErrors: errors });
        
        // Auto-validate if enabled
        if (valid && get().settings.autoDetectDraft) {
          setTimeout(() => get().validate(), 300);
        }
      },
      
      setData: (data: string) => {
        set({ data });
        
        // Auto-validate
        setTimeout(() => get().validate(), 300);
      },
      
      validate: () => {
        const { schema, data, settings } = get();
        set({ isValidating: true });
        
        try {
          const result = validateJSONSchema(data, schema, settings);
          set({ result, isValidating: false });
        } catch {
          set({ isValidating: false });
        }
      },
      
      validateSchemaOnly: () => {
        const { schema } = get();
        const { valid, errors } = validateSchema(schema);
        set({ schemaErrors: errors });
        return valid;
      },
      
      loadExample: (example: ExampleSchema) => {
        set({ 
          schema: example.schema, 
          data: example.sampleData,
          schemaErrors: [],
        });
        get().validate();
      },
      
      updateSettings: (newSettings: Partial<SchemaValidatorSettings>) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        }));
        
        // Re-validate with new settings
        setTimeout(() => get().validate(), 100);
      },
      
      resetSettings: () => {
        set({ settings: DEFAULT_SCHEMA_VALIDATOR_SETTINGS });
        get().validate();
      },
      
      clear: () => {
        set({
          schema: '',
          data: '',
          result: null,
          schemaErrors: [],
        });
      },
      
      swapSchemaAndData: () => {
        const { schema, data } = get();
        set({ schema: data, data: schema });
        get().validate();
      },
      
      formatSchema: () => {
        const { schema } = get();
        try {
          const parsed = JSON.parse(schema);
          set({ schema: JSON.stringify(parsed, null, 2) });
        } catch {
          // Invalid JSON, can't format
        }
      },
      
      formatData: () => {
        const { data } = get();
        try {
          const parsed = JSON.parse(data);
          set({ data: JSON.stringify(parsed, null, 2) });
        } catch {
          // Invalid JSON, can't format
        }
      },
    }),
    {
      name: 'json-schema-validator-storage',
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);

// Export example schemas for easy access
export { EXAMPLE_SCHEMAS };
