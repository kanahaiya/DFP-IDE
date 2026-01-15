'use client';

import { create } from 'zustand';
import type { XMLConversionSettings } from '@/lib/xml/converter';
import { DEFAULT_XML_SETTINGS } from '@/lib/xml/converter';

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  type: 'syntax' | 'structure';
}

interface XMLState {
  input: string;
  output: string;
  settings: XMLConversionSettings;
  errors: ValidationError[];
  isConverting: boolean;
  
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  updateSettings: (updates: Partial<XMLConversionSettings>) => void;
  resetSettings: () => void;
  resetAll: () => void;
}

export const useXMLStore = create<XMLState>((set) => ({
  input: '',
  output: '',
  settings: DEFAULT_XML_SETTINGS,
  errors: [],
  isConverting: false,
  
  setInput: (input) => set({ input }),
  setOutput: (output) => set({ output }),
  
  updateSettings: (updates) => set(state => ({
    settings: { ...state.settings, ...updates }
  })),
  
  resetSettings: () => set({ settings: DEFAULT_XML_SETTINGS }),
  
  resetAll: () => set({
    input: '',
    output: '',
    settings: DEFAULT_XML_SETTINGS,
    errors: [],
    isConverting: false,
  }),
}));

// Re-export settings type for convenience
export type { XMLConversionSettings };
