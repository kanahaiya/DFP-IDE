'use client';

import React, { useState, useCallback } from 'react';
import { SchemaBuilder } from './SchemaBuilder';
import { PreviewPanel } from './PreviewPanel';
import { FieldEditor } from './FieldEditor';
import type { SchemaField, GeneratorSettings, ExportSettings } from '@/lib/json-generator/types';

interface JsonGeneratorToolProps {
  schema: SchemaField[];
  setSchema: (schema: SchemaField[]) => void;
  previewData: Record<string, unknown>[];
  output: string;
  isGenerating: boolean;
  onGenerate: () => void;
  onCopy: () => void;
  onDownload: () => void;
  settings: GeneratorSettings;
  exportSettings: ExportSettings;
}

export function JsonGeneratorTool({
  schema,
  setSchema,
  previewData,
  output,
  isGenerating,
  onGenerate,
  onCopy,
  onDownload,
  settings,
  exportSettings,
}: JsonGeneratorToolProps) {
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'output'>('preview');

  // Find selected field
  const findField = useCallback((fields: SchemaField[], id: string): SchemaField | null => {
    for (const field of fields) {
      if (field.id === id) return field;
      if (field.children) {
        const found = findField(field.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const selectedField = selectedFieldId ? findField(schema, selectedFieldId) : null;

  // Add field
  const handleAddField = useCallback((parentId?: string) => {
    const newField: SchemaField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: 'newField',
      type: 'string',
      options: {},
    };

    if (parentId) {
      // Add to parent
      const addToParent = (fields: SchemaField[]): SchemaField[] => {
        return fields.map(field => {
          if (field.id === parentId) {
            return {
              ...field,
              children: [...(field.children || []), newField],
            };
          }
          if (field.children) {
            return { ...field, children: addToParent(field.children) };
          }
          return field;
        });
      };
      setSchema(addToParent(schema));
    } else {
      setSchema([...schema, newField]);
    }

    setSelectedFieldId(newField.id);
  }, [schema, setSchema]);

  // Update field
  const handleUpdateField = useCallback((fieldId: string, updates: Partial<SchemaField>) => {
    const updateInSchema = (fields: SchemaField[]): SchemaField[] => {
      return fields.map(field => {
        if (field.id === fieldId) {
          return { ...field, ...updates };
        }
        if (field.children) {
          return { ...field, children: updateInSchema(field.children) };
        }
        return field;
      });
    };
    setSchema(updateInSchema(schema));
  }, [schema, setSchema]);

  // Remove field
  const handleRemoveField = useCallback((fieldId: string) => {
    const removeFromSchema = (fields: SchemaField[]): SchemaField[] => {
      return fields
        .filter(field => field.id !== fieldId)
        .map(field => {
          if (field.children) {
            return { ...field, children: removeFromSchema(field.children) };
          }
          return field;
        });
    };
    setSchema(removeFromSchema(schema));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  }, [schema, setSchema, selectedFieldId]);

  // Move field
  const handleMoveField = useCallback((fieldId: string, direction: 'up' | 'down') => {
    const moveInArray = (fields: SchemaField[]): SchemaField[] => {
      const index = fields.findIndex(f => f.id === fieldId);
      if (index === -1) {
        return fields.map(field => {
          if (field.children) {
            return { ...field, children: moveInArray(field.children) };
          }
          return field;
        });
      }

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= fields.length) return fields;

      const newFields = [...fields];
      [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
      return newFields;
    };
    setSchema(moveInArray(schema));
  }, [schema, setSchema]);

  return (
    <div className="json-generator-tool">
      {/* Top Bar */}
      <div className="generator-toolbar">
        <div className="toolbar-left">
          <button
            className="btn-primary"
            onClick={onGenerate}
            disabled={isGenerating || schema.length === 0}
          >
            {isGenerating ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Generating...
              </>
            ) : (
              <>
                <i className="fas fa-play"></i>
                Generate {settings.quantity} Records
              </>
            )}
          </button>
        </div>
        
        <div className="toolbar-center">
          <div className="view-toggle">
            <button
              className={viewMode === 'preview' ? 'active' : ''}
              onClick={() => setViewMode('preview')}
            >
              <i className="fas fa-eye"></i>
              Preview
            </button>
            <button
              className={viewMode === 'output' ? 'active' : ''}
              onClick={() => setViewMode('output')}
              disabled={!output}
            >
              <i className="fas fa-code"></i>
              Output
            </button>
          </div>
        </div>
        
        <div className="toolbar-right">
          <button
            className="btn-secondary"
            onClick={onCopy}
            disabled={!output}
            title="Copy to clipboard"
          >
            <i className="fas fa-copy"></i>
          </button>
          <button
            className="btn-secondary"
            onClick={onDownload}
            disabled={!output}
            title="Download"
          >
            <i className="fas fa-download"></i>
          </button>
        </div>
      </div>

      {/* Main Content - Three Panel Layout */}
      <div className="generator-panels">
        {/* Left Panel - Schema Builder */}
        <div className="panel schema-panel">
          <div className="panel-header">
            <h3>Schema</h3>
            <button className="btn-icon" onClick={() => handleAddField()} title="Add field">
              <i className="fas fa-plus"></i>
            </button>
          </div>
          <div className="panel-content">
            <SchemaBuilder
              schema={schema}
              selectedFieldId={selectedFieldId}
              onSelectField={setSelectedFieldId}
              onAddField={handleAddField}
              onRemoveField={handleRemoveField}
              onMoveField={handleMoveField}
            />
          </div>
        </div>

        {/* Center Panel - Preview/Output */}
        <div className="panel preview-panel">
          <div className="panel-header">
            <h3>{viewMode === 'preview' ? 'Preview' : 'Generated Output'}</h3>
            {viewMode === 'output' && output && (
              <span className="record-count">
                {settings.quantity} records • {exportSettings.format.toUpperCase()}
              </span>
            )}
          </div>
          <div className="panel-content">
            <PreviewPanel
              data={viewMode === 'preview' ? previewData : null}
              output={viewMode === 'output' ? output : null}
              format={exportSettings.format}
            />
          </div>
        </div>

        {/* Right Panel - Field Editor */}
        <div className="panel editor-panel">
          <div className="panel-header">
            <h3>Field Configuration</h3>
          </div>
          <div className="panel-content">
            {selectedField ? (
              <FieldEditor
                field={selectedField}
                onUpdate={(updates) => handleUpdateField(selectedField.id, updates)}
                onDelete={() => handleRemoveField(selectedField.id)}
              />
            ) : (
              <div className="no-selection">
                <i className="fas fa-mouse-pointer"></i>
                <p>Select a field to configure</p>
                <p className="hint">Or click + to add a new field</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .json-generator-tool {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--bg);
        }

        .generator-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: var(--card);
          border-bottom: 1px solid var(--border);
          gap: 1rem;
        }

        .toolbar-left,
        .toolbar-center,
        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--primary-hover);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-secondary:hover:not(:disabled) {
          background: var(--card);
          border-color: var(--primary);
          color: var(--primary);
        }

        .btn-secondary:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .view-toggle {
          display: flex;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }

        .view-toggle button {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.8125rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .view-toggle button:hover:not(:disabled) {
          color: var(--text);
          background: var(--card);
        }

        .view-toggle button.active {
          background: var(--primary);
          color: white;
        }

        .view-toggle button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .generator-panels {
          display: grid;
          grid-template-columns: 280px 1fr 300px;
          flex: 1;
          overflow: hidden;
        }

        .panel {
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--border);
          overflow: hidden;
        }

        .panel:last-child {
          border-right: none;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: var(--elevated);
          border-bottom: 1px solid var(--border);
        }

        .panel-header h3 {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text);
          margin: 0;
        }

        .record-count {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: var(--primary);
          border: none;
          border-radius: var(--radius-sm);
          color: white;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-icon:hover {
          background: var(--primary-hover);
        }

        .panel-content {
          flex: 1;
          overflow: auto;
        }

        .no-selection {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 2rem;
          text-align: center;
          color: var(--text-secondary);
        }

        .no-selection i {
          font-size: 2rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .no-selection p {
          margin: 0;
          font-size: 0.875rem;
        }

        .no-selection .hint {
          font-size: 0.75rem;
          opacity: 0.7;
          margin-top: 0.5rem;
        }

        @media (max-width: 1024px) {
          .generator-panels {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr auto;
          }

          .panel {
            border-right: none;
            border-bottom: 1px solid var(--border);
          }

          .schema-panel {
            max-height: 200px;
          }

          .editor-panel {
            max-height: 250px;
          }
        }
      `}</style>
    </div>
  );
}
