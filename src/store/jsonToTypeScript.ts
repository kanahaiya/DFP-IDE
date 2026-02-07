'use client';

import { create } from 'zustand';
import type { TypeScriptGeneratorSettings } from '@/lib/typescript/types';
import { DEFAULT_TYPESCRIPT_SETTINGS } from '@/lib/typescript/types';

export interface ValidationError {
  line?: number;
  column?: number;
  message: string;
  type: 'syntax' | 'type' | 'naming';
}

interface JsonToTypeScriptState {
  input: string;
  output: string;
  settings: TypeScriptGeneratorSettings;
  errors: ValidationError[];
  isConverting: boolean;

  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  setErrors: (errors: ValidationError[]) => void;
  setIsConverting: (isConverting: boolean) => void;
  updateSettings: (updates: Partial<TypeScriptGeneratorSettings>) => void;
  resetSettings: () => void;
  resetAll: () => void;
}

export const useJsonToTypeScriptStore = create<JsonToTypeScriptState>((set) => ({
  input: '',
  output: '',
  settings: DEFAULT_TYPESCRIPT_SETTINGS,
  errors: [],
  isConverting: false,

  setInput: (input) => set({ input }),
  setOutput: (output) => set({ output }),
  setErrors: (errors) => set({ errors }),
  setIsConverting: (isConverting) => set({ isConverting }),

  updateSettings: (updates) =>
    set((state) => ({
      settings: { ...state.settings, ...updates },
    })),

  resetSettings: () => set({ settings: DEFAULT_TYPESCRIPT_SETTINGS }),

  resetAll: () =>
    set({
      input: '',
      output: '',
      settings: DEFAULT_TYPESCRIPT_SETTINGS,
      errors: [],
      isConverting: false,
    }),
}));

export type { TypeScriptGeneratorSettings };
