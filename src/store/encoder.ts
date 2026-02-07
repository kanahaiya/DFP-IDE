'use client';

import { create } from 'zustand';
import type { EncoderSettings } from '@/lib/encoder/converter';
import { DEFAULT_ENCODER_SETTINGS } from '@/lib/encoder/converter';

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  type: 'syntax' | 'structure';
}

interface EncoderState {
  input: string;
  output: string;
  settings: EncoderSettings;
  errors: ValidationError[];
  warnings: string[];
  isEncoding: boolean;
  
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  updateSettings: (updates: Partial<EncoderSettings>) => void;
  setErrors: (errors: ValidationError[]) => void;
  setWarnings: (warnings: string[]) => void;
  setIsEncoding: (isEncoding: boolean) => void;
  resetSettings: () => void;
  resetAll: () => void;
}

export const useEncoderStore = create<EncoderState>((set) => ({
  input: '',
  output: '',
  settings: DEFAULT_ENCODER_SETTINGS,
  errors: [],
  warnings: [],
  isEncoding: false,
  
  setInput: (input) => set({ input }),
  setOutput: (output) => set({ output }),
  
  updateSettings: (updates) => set(state => ({
    settings: { ...state.settings, ...updates }
  })),
  
  setErrors: (errors) => set({ errors }),
  setWarnings: (warnings) => set({ warnings }),
  setIsEncoding: (isEncoding) => set({ isEncoding }),
  
  resetSettings: () => set({ settings: DEFAULT_ENCODER_SETTINGS }),
  
  resetAll: () => set({
    input: '',
    output: '',
    settings: DEFAULT_ENCODER_SETTINGS,
    errors: [],
    warnings: [],
    isEncoding: false,
  }),
}));

// Re-export settings type for convenience
export type { EncoderSettings };
