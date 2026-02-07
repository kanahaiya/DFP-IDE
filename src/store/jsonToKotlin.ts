'use client';

import { create } from 'zustand';
import type { KotlinGeneratorSettings } from '@/lib/kotlin/types';
import { DEFAULT_KOTLIN_SETTINGS } from '@/lib/kotlin/types';

export interface ValidationError {
  line?: number;
  column?: number;
  message: string;
  type: 'syntax' | 'type' | 'naming';
}

interface JsonToKotlinState {
  input: string;
  output: string;
  settings: KotlinGeneratorSettings;
  errors: ValidationError[];
  isConverting: boolean;

  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  setErrors: (errors: ValidationError[]) => void;
  setIsConverting: (isConverting: boolean) => void;
  updateSettings: (updates: Partial<KotlinGeneratorSettings>) => void;
  resetSettings: () => void;
  resetAll: () => void;
}

export const useJsonToKotlinStore = create<JsonToKotlinState>((set) => ({
  input: '',
  output: '',
  settings: DEFAULT_KOTLIN_SETTINGS,
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

  resetSettings: () => set({ settings: DEFAULT_KOTLIN_SETTINGS }),

  resetAll: () =>
    set({
      input: '',
      output: '',
      settings: DEFAULT_KOTLIN_SETTINGS,
      errors: [],
      isConverting: false,
    }),
}));

export type { KotlinGeneratorSettings };
