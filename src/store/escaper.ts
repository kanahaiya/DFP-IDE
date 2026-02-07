'use client';

import { create } from 'zustand';
import type { EscaperSettings } from '@/lib/escaper/converter';
import { DEFAULT_ESCAPER_SETTINGS } from '@/lib/escaper/converter';

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  type: 'syntax' | 'structure';
}

interface EscaperState {
  input: string;
  output: string;
  settings: EscaperSettings;
  errors: ValidationError[];
  warnings: string[];
  isEscaping: boolean;
  
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  updateSettings: (updates: Partial<EscaperSettings>) => void;
  setErrors: (errors: ValidationError[]) => void;
  setWarnings: (warnings: string[]) => void;
  setIsEscaping: (isEscaping: boolean) => void;
  resetSettings: () => void;
  resetAll: () => void;
}

export const useEscaperStore = create<EscaperState>((set) => ({
  input: '',
  output: '',
  settings: DEFAULT_ESCAPER_SETTINGS,
  errors: [],
  warnings: [],
  isEscaping: false,
  
  setInput: (input) => set({ input }),
  setOutput: (output) => set({ output }),
  
  updateSettings: (updates) => set(state => ({
    settings: { ...state.settings, ...updates }
  })),
  
  setErrors: (errors) => set({ errors }),
  setWarnings: (warnings) => set({ warnings }),
  setIsEscaping: (isEscaping) => set({ isEscaping }),
  
  resetSettings: () => set({ settings: DEFAULT_ESCAPER_SETTINGS }),
  
  resetAll: () => set({
    input: '',
    output: '',
    settings: DEFAULT_ESCAPER_SETTINGS,
    errors: [],
    warnings: [],
    isEscaping: false,
  }),
}));

// Re-export settings type for convenience
export type { EscaperSettings };
