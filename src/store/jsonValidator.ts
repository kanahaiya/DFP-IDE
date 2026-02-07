/**
 * JSON Validator Zustand Store
 * State management for JSON validation tool
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ValidationResult, ValidatorSettings, AutoFixResult, AutoFixChange } from '@/lib/json-validator/types';
import { DEFAULT_VALIDATOR_SETTINGS } from '@/lib/json-validator/types';
import { validateJSON } from '@/lib/json-validator/validator';
import { autoFixJSON, previewFixes } from '@/lib/json-validator/autofix';

interface JsonValidatorState {
  // Input
  input: string;
  
  // Validation result
  result: ValidationResult | null;
  isValidating: boolean;
  
  // Auto-fix
  autoFixResult: AutoFixResult | null;
  fixPreview: AutoFixChange[];
  
  // Settings
  settings: ValidatorSettings;
  
  // Actions
  setInput: (input: string) => void;
  validate: () => void;
  autoFix: () => AutoFixResult;
  previewAutoFix: () => void;
  applyAutoFix: () => void;
  updateSettings: (settings: Partial<ValidatorSettings>) => void;
  resetSettings: () => void;
  clear: () => void;
  formatInput: () => void;
  minifyInput: () => void;
}

const DEFAULT_INPUT = `{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "isActive": true,
  "tags": ["developer", "designer"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  }
}`;

export const useJsonValidatorStore = create<JsonValidatorState>()(
  persist(
    (set, get) => ({
      // Initial state
      input: DEFAULT_INPUT,
      result: null,
      isValidating: false,
      autoFixResult: null,
      fixPreview: [],
      settings: DEFAULT_VALIDATOR_SETTINGS,
      
      // Actions
      setInput: (input: string) => {
        set({ input });
        
        // Auto-validate if enabled
        const { settings } = get();
        if (settings.autoValidate) {
          // Debounce validation
          setTimeout(() => {
            get().validate();
          }, 300);
        }
      },
      
      validate: () => {
        const { input, settings } = get();
        set({ isValidating: true });
        
        try {
          const result = validateJSON(input, settings);
          set({ result, isValidating: false });
        } catch {
          set({ isValidating: false });
        }
      },
      
      autoFix: () => {
        const { input, settings } = get();
        const result = autoFixJSON(input, settings);
        set({ autoFixResult: result });
        return result;
      },
      
      previewAutoFix: () => {
        const { input } = get();
        const preview = previewFixes(input);
        set({ fixPreview: preview });
      },
      
      applyAutoFix: () => {
        const { autoFixResult } = get();
        if (autoFixResult && autoFixResult.success) {
          set({ input: autoFixResult.fixed, autoFixResult: null });
          get().validate();
        }
      },
      
      updateSettings: (newSettings: Partial<ValidatorSettings>) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        }));
        
        // Re-validate with new settings
        const { settings } = get();
        if (settings.autoValidate) {
          get().validate();
        }
      },
      
      resetSettings: () => {
        set({ settings: DEFAULT_VALIDATOR_SETTINGS });
        get().validate();
      },
      
      clear: () => {
        set({
          input: '',
          result: null,
          autoFixResult: null,
          fixPreview: [],
        });
      },
      
      formatInput: () => {
        const { input, settings } = get();
        try {
          const parsed = JSON.parse(input);
          const indent = settings.indentation === 'tab' ? '\t' : settings.indentation;
          const formatted = JSON.stringify(parsed, null, indent);
          set({ input: formatted });
          get().validate();
        } catch {
          // Input is invalid, can't format
        }
      },
      
      minifyInput: () => {
        const { input } = get();
        try {
          const parsed = JSON.parse(input);
          const minified = JSON.stringify(parsed);
          set({ input: minified });
          get().validate();
        } catch {
          // Input is invalid, can't minify
        }
      },
    }),
    {
      name: 'json-validator-storage',
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);
