import { create } from 'zustand';
import type { ElmGeneratorSettings } from '@/lib/elm/types';

interface ValidationError {
  message: string;
  type: 'syntax' | 'type' | 'naming';
}

interface JsonToElmState {
  input: string;
  output: string;
  settings: ElmGeneratorSettings;
  errors: ValidationError[];
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  setErrors: (errors: ValidationError[]) => void;
  updateSettings: (settings: Partial<ElmGeneratorSettings>) => void;
  resetAll: () => void;
}

const DEFAULT_SETTINGS: ElmGeneratorSettings = {
  rootClassName: 'Root',
  indentation: 4,
  useNullableTypes: true,
  outputMode: 'full',
  namingStyle: 'camelCase',
  generateTypeAliases: true,
  generateDecoders: true,
  generateEncoders: true,
  usePipeline: true,
  modulePrefix: 'Data',
  exposeAll: true,
  addComments: true,
};

export const useJsonToElmStore = create<JsonToElmState>((set) => ({
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
