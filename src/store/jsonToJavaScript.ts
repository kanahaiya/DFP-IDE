'use client';

import { create } from 'zustand';
import type { JavaScriptGeneratorSettings } from '@/lib/javascript/types';
import { DEFAULT_JAVASCRIPT_SETTINGS } from '@/lib/javascript/types';

export interface ValidationError {
  line?: number;
  column?: number;
  message: string;
  type: 'syntax' | 'type' | 'naming';
}

interface JsonToJavaScriptState {
  input: string;
  output: string;
  settings: JavaScriptGeneratorSettings;
  errors: ValidationError[];
  isConverting: boolean;

  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  setErrors: (errors: ValidationError[]) => void;
  setIsConverting: (isConverting: boolean) => void;
  updateSettings: (updates: Partial<JavaScriptGeneratorSettings>) => void;
  resetSettings: () => void;
  resetAll: () => void;
}

export const useJsonToJavaScriptStore = create<JsonToJavaScriptState>((set) => ({
  input: '',
  output: '',
  settings: DEFAULT_JAVASCRIPT_SETTINGS,
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

  resetSettings: () => set({ settings: DEFAULT_JAVASCRIPT_SETTINGS }),

  resetAll: () =>
    set({
      input: '',
      output: '',
      settings: DEFAULT_JAVASCRIPT_SETTINGS,
      errors: [],
      isConverting: false,
    }),
}));

export type { JavaScriptGeneratorSettings };
