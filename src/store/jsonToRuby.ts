import { create } from 'zustand';
import type { RubyGeneratorSettings } from '@/lib/ruby/types';

interface ValidationError {
  message: string;
  type: 'syntax' | 'type' | 'naming';
}

interface JsonToRubyState {
  input: string;
  output: string;
  settings: RubyGeneratorSettings;
  errors: ValidationError[];
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  setErrors: (errors: ValidationError[]) => void;
  updateSettings: (settings: Partial<RubyGeneratorSettings>) => void;
  resetAll: () => void;
}

const DEFAULT_SETTINGS: RubyGeneratorSettings = {
  rootClassName: 'Root',
  indentation: 2,
  useNullableTypes: true,
  hashSyntax: 'symbols',
  outputMode: 'hash',
  stringQuote: 'single',
  freezeStrings: true,
  addTypeSig: false,
  useSymbols: true,
  generateAccessors: true,
  generateInitialize: true,
  generateToJson: false,
  generateFromJson: false,
  addFrozenStringLiteral: true,
  indentSpaces: 2,
};

export const useJsonToRubyStore = create<JsonToRubyState>((set) => ({
  input: '',
  output: '',
  settings: DEFAULT_SETTINGS,
  errors: [],
  setInput: (input) => set({ input }),
  setOutput: (output) => set({ output }),
  setErrors: (errors) => set({ errors }),
  updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
  resetAll: () => set({ input: '', output: '', settings: DEFAULT_SETTINGS, errors: [] }),
}));
