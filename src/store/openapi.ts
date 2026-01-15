'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Endpoint, OpenAPISettings, OutputFormat } from '@/types';

interface OpenAPIState {
  endpoints: Endpoint[];
  activeEndpointIndex: number;
  settings: OpenAPISettings;
  outputFormat: OutputFormat;
  
  // Actions
  addEndpoint: () => void;
  removeEndpoint: (index: number) => void;
  updateEndpoint: (index: number, updates: Partial<Endpoint>) => void;
  setActiveEndpoint: (index: number) => void;
  loadEndpointJSON: (index: number, json: string) => void;
  
  updateSettings: (updates: Partial<OpenAPISettings>) => void;
  setOutputFormat: (format: OutputFormat) => void;
  
  resetAll: () => void;
}

const DEFAULT_ENDPOINT: Omit<Endpoint, 'id'> = {
  path: '/users',
  method: 'post',
  json: '',
  operationId: 'createUser',
  responseCode: '200',
  tags: 'Users',
  summary: 'Create a new user',
};

const DEFAULT_SETTINGS: OpenAPISettings = {
  title: 'Generated API',
  version: '1.0.0',
  description: '',
  serverUrl: 'https://api.example.com',
  openAPIVersion: '3.0',
  includeExamples: true,
  markRequired: true,
  generateComponents: false,
  detectFormats: true,
  addDescriptions: false,
  addConstraints: false,
};

export const useOpenAPIStore = create<OpenAPIState>((set) => ({
  endpoints: [{ ...DEFAULT_ENDPOINT, id: uuidv4() }],
  activeEndpointIndex: 0,
  settings: DEFAULT_SETTINGS,
  outputFormat: 'yaml',

  addEndpoint: () => set((state) => ({
    endpoints: [...state.endpoints, { ...DEFAULT_ENDPOINT, id: uuidv4() }],
    activeEndpointIndex: state.endpoints.length,
  })),

  removeEndpoint: (index: number) => set((state) => {
    if (state.endpoints.length <= 1) return state;
    
    const newEndpoints = state.endpoints.filter((_, i) => i !== index);
    let newActiveIndex = state.activeEndpointIndex;
    
    if (index === state.activeEndpointIndex) {
      newActiveIndex = Math.max(0, index - 1);
    } else if (index < state.activeEndpointIndex) {
      newActiveIndex = state.activeEndpointIndex - 1;
    }
    
    return {
      endpoints: newEndpoints,
      activeEndpointIndex: newActiveIndex,
    };
  }),

  updateEndpoint: (index: number, updates: Partial<Endpoint>) => set((state) => ({
    endpoints: state.endpoints.map((ep, i) =>
      i === index ? { ...ep, ...updates } : ep
    ),
  })),

  setActiveEndpoint: (index: number) => set({ activeEndpointIndex: index }),

  loadEndpointJSON: (index: number, json: string) => set((state) => ({
    endpoints: state.endpoints.map((ep, i) =>
      i === index ? { ...ep, json } : ep
    ),
  })),

  updateSettings: (updates: Partial<OpenAPISettings>) => set((state) => ({
    settings: { ...state.settings, ...updates },
  })),

  setOutputFormat: (format: OutputFormat) => set({ outputFormat: format }),

  resetAll: () => set({
    endpoints: [{ ...DEFAULT_ENDPOINT, id: uuidv4() }],
    activeEndpointIndex: 0,
    settings: DEFAULT_SETTINGS,
    outputFormat: 'yaml',
  }),
}));
