'use client';

import { create } from 'zustand';
import type { FlattenerSettings } from '@/lib/flattener/converter';
import { DEFAULT_FLATTENER_SETTINGS } from '@/lib/flattener/converter';

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  type: 'syntax' | 'structure';
  severity: 'error' | 'warning';
}

interface FlattenerState {
  input: string;
  output: string;
  settings: FlattenerSettings;
  errors: ValidationError[];
  warnings: string[];
  isFlattening: boolean;
  stats: {
    inputKeys: number;
    outputKeys: number;
    maxDepth: number;
    arraysFlattened: number;
  } | null;
  
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  updateSettings: (updates: Partial<FlattenerSettings>) => void;
  setErrors: (errors: ValidationError[]) => void;
  setWarnings: (warnings: string[]) => void;
  setIsFlattening: (isFlattening: boolean) => void;
  setStats: (stats: FlattenerState['stats']) => void;
  resetSettings: () => void;
  resetAll: () => void;
}

export const useFlattenerStore = create<FlattenerState>((set) => ({
  input: '',
  output: '',
  settings: DEFAULT_FLATTENER_SETTINGS,
  errors: [],
  warnings: [],
  isFlattening: false,
  stats: null,
  
  setInput: (input) => set({ input }),
  setOutput: (output) => set({ output }),
  
  updateSettings: (updates) => set(state => ({
    settings: { ...state.settings, ...updates }
  })),
  
  setErrors: (errors) => set({ errors }),
  setWarnings: (warnings) => set({ warnings }),
  setIsFlattening: (isFlattening) => set({ isFlattening }),
  setStats: (stats) => set({ stats }),
  
  resetSettings: () => set({ settings: DEFAULT_FLATTENER_SETTINGS }),
  
  resetAll: () => set({
    input: '',
    output: '',
    settings: DEFAULT_FLATTENER_SETTINGS,
    errors: [],
    warnings: [],
    isFlattening: false,
    stats: null,
  }),
}));

// Re-export settings type for convenience
export type { FlattenerSettings };
