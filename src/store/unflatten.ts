'use client';

import { create } from 'zustand';
import type { UnflattenSettings } from '@/lib/unflatten/converter';
import { DEFAULT_UNFLATTEN_SETTINGS } from '@/lib/unflatten/converter';

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  type: 'syntax' | 'structure';
  severity: 'error' | 'warning';
}

interface UnflattenState {
  input: string;
  output: string;
  settings: UnflattenSettings;
  errors: ValidationError[];
  warnings: string[];
  isUnflattening: boolean;
  detectedDelimiter: string | null;
  stats: {
    inputKeys: number;
    outputDepth: number;
    arraysCreated: number;
    conflictsResolved: number;
  } | null;
  
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  updateSettings: (updates: Partial<UnflattenSettings>) => void;
  setErrors: (errors: ValidationError[]) => void;
  setWarnings: (warnings: string[]) => void;
  setIsUnflattening: (isUnflattening: boolean) => void;
  setDetectedDelimiter: (delimiter: string | null) => void;
  setStats: (stats: UnflattenState['stats']) => void;
  resetSettings: () => void;
  resetAll: () => void;
}

export const useUnflattenStore = create<UnflattenState>((set) => ({
  input: '',
  output: '',
  settings: DEFAULT_UNFLATTEN_SETTINGS,
  errors: [],
  warnings: [],
  isUnflattening: false,
  detectedDelimiter: null,
  stats: null,
  
  setInput: (input) => set({ input }),
  setOutput: (output) => set({ output }),
  
  updateSettings: (updates) => set(state => ({
    settings: { ...state.settings, ...updates }
  })),
  
  setErrors: (errors) => set({ errors }),
  setWarnings: (warnings) => set({ warnings }),
  setIsUnflattening: (isUnflattening) => set({ isUnflattening }),
  setDetectedDelimiter: (detectedDelimiter) => set({ detectedDelimiter }),
  setStats: (stats) => set({ stats }),
  
  resetSettings: () => set({ settings: DEFAULT_UNFLATTEN_SETTINGS }),
  
  resetAll: () => set({
    input: '',
    output: '',
    settings: DEFAULT_UNFLATTEN_SETTINGS,
    errors: [],
    warnings: [],
    isUnflattening: false,
    detectedDelimiter: null,
    stats: null,
  }),
}));

// Re-export settings type for convenience
export type { UnflattenSettings };
