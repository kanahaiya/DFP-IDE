'use client';

import { create } from 'zustand';
import type { 
  SchemaField, 
  GeneratorSettings, 
  ExportSettings,
  GeneratorTemplate
} from '@/lib/json-generator/types';
import { 
  DEFAULT_GENERATOR_SETTINGS, 
  DEFAULT_EXPORT_SETTINGS 
} from '@/lib/json-generator/types';

// ============================================================================
// State Interface
// ============================================================================

interface JsonGeneratorState {
  // Schema
  schema: SchemaField[];
  selectedFieldId: string | null;
  
  // Generated Data
  output: string;
  generatedData: Record<string, unknown>[];
  isGenerating: boolean;
  
  // Settings
  settings: GeneratorSettings;
  exportSettings: ExportSettings;
  
  // Templates
  currentTemplate: GeneratorTemplate | null;
  savedTemplates: GeneratorTemplate[];
  
  // Preview
  previewData: Record<string, unknown>[];
  showPreview: boolean;
  
  // UI State
  activeTab: 'schema' | 'settings' | 'export' | 'help';
  
  // Actions - Schema
  setSchema: (schema: SchemaField[]) => void;
  addField: (field: SchemaField, parentId?: string) => void;
  updateField: (fieldId: string, updates: Partial<SchemaField>) => void;
  removeField: (fieldId: string) => void;
  moveField: (fieldId: string, direction: 'up' | 'down') => void;
  duplicateField: (fieldId: string) => void;
  selectField: (fieldId: string | null) => void;
  
  // Actions - Generation
  setOutput: (output: string) => void;
  setGeneratedData: (data: Record<string, unknown>[]) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  
  // Actions - Settings
  updateSettings: (updates: Partial<GeneratorSettings>) => void;
  updateExportSettings: (updates: Partial<ExportSettings>) => void;
  resetSettings: () => void;
  
  // Actions - Templates
  loadTemplate: (template: GeneratorTemplate) => void;
  saveTemplate: (template: GeneratorTemplate) => void;
  deleteTemplate: (templateId: string) => void;
  clearTemplate: () => void;
  
  // Actions - Preview
  setPreviewData: (data: Record<string, unknown>[]) => void;
  togglePreview: () => void;
  
  // Actions - UI
  setActiveTab: (tab: 'schema' | 'settings' | 'export' | 'help') => void;
  
  // Actions - Reset
  resetAll: () => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

function generateFieldId(): string {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function findFieldById(
  fields: SchemaField[], 
  fieldId: string
): SchemaField | null {
  for (const field of fields) {
    if (field.id === fieldId) {
      return field;
    }
    if (field.children) {
      const found = findFieldById(field.children, fieldId);
      if (found) return found;
    }
  }
  return null;
}

function updateFieldInSchema(
  fields: SchemaField[],
  fieldId: string,
  updates: Partial<SchemaField>
): SchemaField[] {
  return fields.map(field => {
    if (field.id === fieldId) {
      return { ...field, ...updates };
    }
    if (field.children) {
      return {
        ...field,
        children: updateFieldInSchema(field.children, fieldId, updates)
      };
    }
    return field;
  });
}

function removeFieldFromSchema(
  fields: SchemaField[],
  fieldId: string
): SchemaField[] {
  return fields
    .filter(field => field.id !== fieldId)
    .map(field => {
      if (field.children) {
        return {
          ...field,
          children: removeFieldFromSchema(field.children, fieldId)
        };
      }
      return field;
    });
}

function addFieldToParent(
  fields: SchemaField[],
  newField: SchemaField,
  parentId: string
): SchemaField[] {
  return fields.map(field => {
    if (field.id === parentId) {
      return {
        ...field,
        children: [...(field.children || []), newField]
      };
    }
    if (field.children) {
      return {
        ...field,
        children: addFieldToParent(field.children, newField, parentId)
      };
    }
    return field;
  });
}

function moveFieldInArray(
  fields: SchemaField[],
  fieldId: string,
  direction: 'up' | 'down'
): SchemaField[] {
  const index = fields.findIndex(f => f.id === fieldId);
  if (index === -1) {
    // Not at this level, check children
    return fields.map(field => {
      if (field.children) {
        return {
          ...field,
          children: moveFieldInArray(field.children, fieldId, direction)
        };
      }
      return field;
    });
  }
  
  const newIndex = direction === 'up' ? index - 1 : index + 1;
  if (newIndex < 0 || newIndex >= fields.length) {
    return fields;
  }
  
  const newFields = [...fields];
  [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
  return newFields;
}

function duplicateFieldInSchema(
  fields: SchemaField[],
  fieldId: string
): SchemaField[] {
  const result: SchemaField[] = [];
  
  for (const field of fields) {
    result.push(field);
    
    if (field.id === fieldId) {
      // Create a deep copy with new IDs
      const duplicate = deepCopyField(field);
      duplicate.name = `${field.name}_copy`;
      result.push(duplicate);
    }
    
    if (field.children) {
      const index = result.findIndex(f => f.id === field.id);
      if (index !== -1) {
        result[index] = {
          ...result[index],
          children: duplicateFieldInSchema(field.children, fieldId)
        };
      }
    }
  }
  
  return result;
}

function deepCopyField(field: SchemaField): SchemaField {
  const copy: SchemaField = {
    ...field,
    id: generateFieldId(),
    options: { ...field.options }
  };
  
  if (field.children) {
    copy.children = field.children.map(deepCopyField);
  }
  
  return copy;
}

// ============================================================================
// Store
// ============================================================================

export const useJsonGeneratorStore = create<JsonGeneratorState>((set) => ({
  // Initial State
  schema: [],
  selectedFieldId: null,
  output: '',
  generatedData: [],
  isGenerating: false,
  settings: { ...DEFAULT_GENERATOR_SETTINGS },
  exportSettings: { ...DEFAULT_EXPORT_SETTINGS },
  currentTemplate: null,
  savedTemplates: [],
  previewData: [],
  showPreview: true,
  activeTab: 'schema',
  
  // Schema Actions
  setSchema: (schema) => set({ schema }),
  
  addField: (field, parentId) => set((state) => {
    const newField = {
      ...field,
      id: field.id || generateFieldId()
    };
    
    if (parentId) {
      return {
        schema: addFieldToParent(state.schema, newField, parentId),
        selectedFieldId: newField.id
      };
    }
    
    return {
      schema: [...state.schema, newField],
      selectedFieldId: newField.id
    };
  }),
  
  updateField: (fieldId, updates) => set((state) => ({
    schema: updateFieldInSchema(state.schema, fieldId, updates)
  })),
  
  removeField: (fieldId) => set((state) => ({
    schema: removeFieldFromSchema(state.schema, fieldId),
    selectedFieldId: state.selectedFieldId === fieldId ? null : state.selectedFieldId
  })),
  
  moveField: (fieldId, direction) => set((state) => ({
    schema: moveFieldInArray(state.schema, fieldId, direction)
  })),
  
  duplicateField: (fieldId) => set((state) => ({
    schema: duplicateFieldInSchema(state.schema, fieldId)
  })),
  
  selectField: (fieldId) => set({ selectedFieldId: fieldId }),
  
  // Generation Actions
  setOutput: (output) => set({ output }),
  setGeneratedData: (generatedData) => set({ generatedData }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  
  // Settings Actions
  updateSettings: (updates) => set((state) => ({
    settings: { ...state.settings, ...updates }
  })),
  
  updateExportSettings: (updates) => set((state) => ({
    exportSettings: { ...state.exportSettings, ...updates }
  })),
  
  resetSettings: () => set({
    settings: { ...DEFAULT_GENERATOR_SETTINGS },
    exportSettings: { ...DEFAULT_EXPORT_SETTINGS }
  }),
  
  // Template Actions
  loadTemplate: (template) => set({
    schema: template.schema.map(field => ({
      ...field,
      id: generateFieldId(),
      children: field.children?.map(child => ({
        ...child,
        id: generateFieldId(),
        children: child.children?.map(grandchild => ({
          ...grandchild,
          id: generateFieldId()
        }))
      }))
    })),
    currentTemplate: template,
    selectedFieldId: null,
    output: '',
    generatedData: [],
    previewData: []
  }),
  
  saveTemplate: (template) => set((state) => {
    const existingIndex = state.savedTemplates.findIndex(t => t.id === template.id);
    if (existingIndex >= 0) {
      const newTemplates = [...state.savedTemplates];
      newTemplates[existingIndex] = template;
      return { savedTemplates: newTemplates };
    }
    return { savedTemplates: [...state.savedTemplates, template] };
  }),
  
  deleteTemplate: (templateId) => set((state) => ({
    savedTemplates: state.savedTemplates.filter(t => t.id !== templateId)
  })),
  
  clearTemplate: () => set({
    schema: [],
    currentTemplate: null,
    selectedFieldId: null,
    output: '',
    generatedData: [],
    previewData: []
  }),
  
  // Preview Actions
  setPreviewData: (previewData) => set({ previewData }),
  togglePreview: () => set((state) => ({ showPreview: !state.showPreview })),
  
  // UI Actions
  setActiveTab: (activeTab) => set({ activeTab }),
  
  // Reset
  resetAll: () => set({
    schema: [],
    selectedFieldId: null,
    output: '',
    generatedData: [],
    isGenerating: false,
    settings: { ...DEFAULT_GENERATOR_SETTINGS },
    exportSettings: { ...DEFAULT_EXPORT_SETTINGS },
    currentTemplate: null,
    previewData: [],
    showPreview: true,
    activeTab: 'schema'
  })
}));

// ============================================================================
// Selectors (for optimized re-renders)
// ============================================================================

export const selectSchema = (state: JsonGeneratorState) => state.schema;
export const selectSelectedField = (state: JsonGeneratorState) => 
  state.selectedFieldId ? findFieldById(state.schema, state.selectedFieldId) : null;
export const selectSettings = (state: JsonGeneratorState) => state.settings;
export const selectExportSettings = (state: JsonGeneratorState) => state.exportSettings;
export const selectOutput = (state: JsonGeneratorState) => state.output;
export const selectIsGenerating = (state: JsonGeneratorState) => state.isGenerating;
export const selectPreviewData = (state: JsonGeneratorState) => state.previewData;
export const selectCurrentTemplate = (state: JsonGeneratorState) => state.currentTemplate;

// Re-export types
export type { SchemaField, GeneratorSettings, ExportSettings, GeneratorTemplate };
