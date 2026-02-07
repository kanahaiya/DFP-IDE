import { create } from 'zustand';
import type { CppGeneratorSettings } from '@/lib/cpp/types';

interface ValidationError {
  message: string;
  type: 'syntax' | 'type' | 'naming';
}

interface JsonToCppState {
  input: string;
  output: string;
  settings: CppGeneratorSettings;
  errors: ValidationError[];
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  setErrors: (errors: ValidationError[]) => void;
  updateSettings: (settings: Partial<CppGeneratorSettings>) => void;
  resetAll: () => void;
}

const DEFAULT_SETTINGS: CppGeneratorSettings = {
  rootClassName: 'Root',
  indentation: 4,
  useNullableTypes: true,
  library: 'nlohmann',
  cppStandard: 'cpp17',
  outputMode: 'header-only',
  includeNullable: true,
  useOptional: true,
  generateConstructors: true,
  generateGettersSetters: false,
  useSmartPointers: false,
  addSerializationMacros: true,
  includeValidation: false,
  useStringView: false,
  generateComments: true,
  namespacePrefix: '',
  headerGuardStyle: 'pragma',
  indentStyle: 'spaces',
  indentSize: 4,
};

export const useJsonToCppStore = create<JsonToCppState>((set) => ({
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
