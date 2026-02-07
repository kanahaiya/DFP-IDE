'use client';

import { create } from 'zustand';
import type { UnescaperSettings } from '@/lib/unescaper/converter';
import { DEFAULT_UNESCAPER_SETTINGS } from '@/lib/unescaper/converter';

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  type: 'syntax' | 'structure';
}

interface UnescaperState {
  input: string;
  output: string;
  settings: UnescaperSettings;
  errors: ValidationError[];
  warnings: string[];
  isUnescaping: boolean;
  unescapeChain: string[];
  isValidJSON: boolean;
  escapeLevel: number;
  
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  updateSettings: (updates: Partial<UnescaperSettings>) => void;
  setErrors: (errors: ValidationError[]) => void;
  setWarnings: (warnings: string[]) => void;
  setIsUnescaping: (isUnescaping: boolean) => void;
  setUnescapeChain: (chain: string[]) => void;
  setIsValidJSON: (isValid: boolean) => void;
  setEscapeLevel: (level: number) => void;
  resetSettings: () => void;
  resetAll: () => void;
}

export const useUnescaperStore = create<UnescaperState>((set) => ({
  input: '',
  output: '',
  settings: DEFAULT_UNESCAPER_SETTINGS,
  errors: [],
  warnings: [],
  isUnescaping: false,
  unescapeChain: [],
  isValidJSON: false,
  escapeLevel: 0,
  
  setInput: (input) => set({ input }),
  setOutput: (output) => set({ output }),
  
  updateSettings: (updates) => set(state => ({
    settings: { ...state.settings, ...updates }
  })),
  
  setErrors: (errors) => set({ errors }),
  setWarnings: (warnings) => set({ warnings }),
  setIsUnescaping: (isUnescaping) => set({ isUnescaping }),
  setUnescapeChain: (unescapeChain) => set({ unescapeChain }),
  setIsValidJSON: (isValidJSON) => set({ isValidJSON }),
  setEscapeLevel: (escapeLevel) => set({ escapeLevel }),
  
  resetSettings: () => set({ settings: DEFAULT_UNESCAPER_SETTINGS }),
  
  resetAll: () => set({
    input: '',
    output: '',
    settings: DEFAULT_UNESCAPER_SETTINGS,
    errors: [],
    warnings: [],
    isUnescaping: false,
    unescapeChain: [],
    isValidJSON: false,
    escapeLevel: 0,
  }),
}));

// Re-export settings type for convenience
export type { UnescaperSettings };
