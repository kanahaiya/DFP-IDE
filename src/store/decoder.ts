'use client';

import { create } from 'zustand';
import type { DecoderSettings } from '@/lib/decoder/converter';
import { DEFAULT_DECODER_SETTINGS } from '@/lib/decoder/converter';

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  type: 'syntax' | 'encoding';
}

interface DecoderState {
  input: string;
  output: string;
  settings: DecoderSettings;
  errors: ValidationError[];
  warnings: string[];
  decodingChain: string[];
  isDecoding: boolean;
  isValidJSON: boolean;
  
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  updateSettings: (updates: Partial<DecoderSettings>) => void;
  setErrors: (errors: ValidationError[]) => void;
  setWarnings: (warnings: string[]) => void;
  setDecodingChain: (chain: string[]) => void;
  setIsDecoding: (isDecoding: boolean) => void;
  setIsValidJSON: (isValid: boolean) => void;
  resetSettings: () => void;
  resetAll: () => void;
}

export const useDecoderStore = create<DecoderState>((set) => ({
  input: '',
  output: '',
  settings: DEFAULT_DECODER_SETTINGS,
  errors: [],
  warnings: [],
  decodingChain: [],
  isDecoding: false,
  isValidJSON: false,
  
  setInput: (input) => set({ input }),
  setOutput: (output) => set({ output }),
  
  updateSettings: (updates) => set(state => ({
    settings: { ...state.settings, ...updates }
  })),
  
  setErrors: (errors) => set({ errors }),
  setWarnings: (warnings) => set({ warnings }),
  setDecodingChain: (decodingChain) => set({ decodingChain }),
  setIsDecoding: (isDecoding) => set({ isDecoding }),
  setIsValidJSON: (isValidJSON) => set({ isValidJSON }),
  
  resetSettings: () => set({ settings: DEFAULT_DECODER_SETTINGS }),
  
  resetAll: () => set({
    input: '',
    output: '',
    settings: DEFAULT_DECODER_SETTINGS,
    errors: [],
    warnings: [],
    decodingChain: [],
    isDecoding: false,
    isValidJSON: false,
  }),
}));

// Re-export settings type for convenience
export type { DecoderSettings };
