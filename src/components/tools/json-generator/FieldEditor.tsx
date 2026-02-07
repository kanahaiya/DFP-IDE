'use client';

import React, { useState, useCallback } from 'react';
import type { SchemaField, DataType, DataTypeCategory } from '@/lib/json-generator/types';
import { DATA_TYPE_INFO, DATA_TYPE_CATEGORIES, getDataTypesByCategory } from '@/lib/json-generator/types';

interface FieldEditorProps {
  field: SchemaField;
  onUpdate: (updates: Partial<SchemaField>) => void;
  onDelete: () => void;
}

export function FieldEditor({ field, onUpdate, onDelete }: FieldEditorProps) {
  const [activeCategory, setActiveCategory] = useState<DataTypeCategory | 'all'>('all');
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  // Get available data types
  const getFilteredTypes = useCallback((): DataType[] => {
    if (activeCategory === 'all') {
      return Object.keys(DATA_TYPE_INFO) as DataType[];
    }
    return getDataTypesByCategory(activeCategory);
  }, [activeCategory]);

  // Handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
    onUpdate({ name });
  };

  // Handle type change
  const handleTypeChange = (type: DataType) => {
    const newOptions = { ...field.options };
    
    // Reset type-specific options
    if (type === 'object') {
      onUpdate({ type, options: newOptions, children: field.children || [] });
    } else if (type === 'array') {
      onUpdate({ type, options: { ...newOptions, count: 3 }, children: field.children || [] });
    } else {
      onUpdate({ type, options: newOptions, children: undefined });
    }
    
    setShowTypeSelector(false);
  };

  // Render type-specific options
  const renderTypeOptions = () => {
    const typeInfo = DATA_TYPE_INFO[field.type];
    if (!typeInfo) return null;

    switch (field.type) {
      case 'string':
        return (
          <>
            <div className="option-row">
              <label>Min Length</label>
              <input
                type="number"
                min={0}
                value={(field.options as { minLength?: number }).minLength || ''}
                onChange={(e) => onUpdate({ options: { ...field.options, minLength: parseInt(e.target.value) || undefined } })}
                placeholder="0"
              />
            </div>
            <div className="option-row">
              <label>Max Length</label>
              <input
                type="number"
                min={1}
                value={(field.options as { maxLength?: number }).maxLength || ''}
                onChange={(e) => onUpdate({ options: { ...field.options, maxLength: parseInt(e.target.value) || undefined } })}
                placeholder="100"
              />
            </div>
          </>
        );

      case 'number':
      case 'age':
      case 'price':
        return (
          <>
            <div className="option-row">
              <label>Min Value</label>
              <input
                type="number"
                value={(field.options as { min?: number }).min ?? ''}
                onChange={(e) => onUpdate({ options: { ...field.options, min: parseFloat(e.target.value) || undefined } })}
                placeholder="0"
              />
            </div>
            <div className="option-row">
              <label>Max Value</label>
              <input
                type="number"
                value={(field.options as { max?: number }).max ?? ''}
                onChange={(e) => onUpdate({ options: { ...field.options, max: parseFloat(e.target.value) || undefined } })}
                placeholder="1000"
              />
            </div>
            {field.type === 'number' && (
              <div className="option-row checkbox">
                <input
                  type="checkbox"
                  id="integer"
                  checked={(field.options as { integer?: boolean }).integer || false}
                  onChange={(e) => onUpdate({ options: { ...field.options, integer: e.target.checked } })}
                />
                <label htmlFor="integer">Integer only</label>
              </div>
            )}
          </>
        );

      case 'enum':
        return (
          <div className="option-row full">
            <label>Values (one per line)</label>
            <textarea
              value={((field.options as { values?: string[] }).values || []).join('\n')}
              onChange={(e) => onUpdate({ 
                options: { 
                  ...field.options, 
                  values: e.target.value.split('\n').filter(v => v.trim()) 
                } 
              })}
              placeholder="Option 1&#10;Option 2&#10;Option 3"
              rows={4}
            />
          </div>
        );

      case 'constant':
        return (
          <div className="option-row">
            <label>Value</label>
            <input
              type="text"
              value={String((field.options as { value?: unknown }).value ?? '')}
              onChange={(e) => onUpdate({ options: { ...field.options, value: e.target.value } })}
              placeholder="Constant value"
            />
          </div>
        );

      case 'date':
      case 'datetime':
      case 'birthday':
        return (
          <>
            <div className="option-row">
              <label>Min Date</label>
              <input
                type="date"
                value={(field.options as { min?: string }).min || ''}
                onChange={(e) => onUpdate({ options: { ...field.options, min: e.target.value || undefined } })}
              />
            </div>
            <div className="option-row">
              <label>Max Date</label>
              <input
                type="date"
                value={(field.options as { max?: string }).max || ''}
                onChange={(e) => onUpdate({ options: { ...field.options, max: e.target.value || undefined } })}
              />
            </div>
          </>
        );

      case 'array':
        return (
          <>
            <div className="option-row">
              <label>Min Items</label>
              <input
                type="number"
                min={0}
                value={typeof (field.options as { count?: { min: number } }).count === 'object' 
                  ? (field.options as { count: { min: number } }).count.min 
                  : ''}
                onChange={(e) => {
                  const min = parseInt(e.target.value) || 1;
                  const currentCount = (field.options as { count?: number | { min: number; max: number } }).count;
                  const max = typeof currentCount === 'object' ? currentCount.max : 5;
                  onUpdate({ options: { ...field.options, count: { min, max } } });
                }}
                placeholder="1"
              />
            </div>
            <div className="option-row">
              <label>Max Items</label>
              <input
                type="number"
                min={1}
                value={typeof (field.options as { count?: { max: number } }).count === 'object' 
                  ? (field.options as { count: { max: number } }).count.max 
                  : ''}
                onChange={(e) => {
                  const max = parseInt(e.target.value) || 5;
                  const currentCount = (field.options as { count?: number | { min: number; max: number } }).count;
                  const min = typeof currentCount === 'object' ? currentCount.min : 1;
                  onUpdate({ options: { ...field.options, count: { min, max } } });
                }}
                placeholder="5"
              />
            </div>
          </>
        );

      case 'alphanumeric':
        return (
          <>
            <div className="option-row">
              <label>Length</label>
              <input
                type="number"
                min={1}
                value={(field.options as { length?: number }).length || ''}
                onChange={(e) => onUpdate({ options: { ...field.options, length: parseInt(e.target.value) || undefined } })}
                placeholder="8"
              />
            </div>
            <div className="option-row">
              <label>Prefix</label>
              <input
                type="text"
                value={(field.options as { prefix?: string }).prefix || ''}
                onChange={(e) => onUpdate({ options: { ...field.options, prefix: e.target.value || undefined } })}
                placeholder="e.g., ID-"
              />
            </div>
            <div className="option-row">
              <label>Suffix</label>
              <input
                type="text"
                value={(field.options as { suffix?: string }).suffix || ''}
                onChange={(e) => onUpdate({ options: { ...field.options, suffix: e.target.value || undefined } })}
                placeholder="e.g., -X"
              />
            </div>
          </>
        );

      case 'sequentialId':
        return (
          <>
            <div className="option-row">
              <label>Start</label>
              <input
                type="number"
                value={(field.options as { start?: number }).start ?? ''}
                onChange={(e) => onUpdate({ options: { ...field.options, start: parseInt(e.target.value) || undefined } })}
                placeholder="1"
              />
            </div>
            <div className="option-row">
              <label>Step</label>
              <input
                type="number"
                min={1}
                value={(field.options as { step?: number }).step || ''}
                onChange={(e) => onUpdate({ options: { ...field.options, step: parseInt(e.target.value) || undefined } })}
                placeholder="1"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="field-editor">
      {/* Field Name */}
      <div className="editor-section">
        <label className="section-label">Field Name</label>
        <input
          type="text"
          className="field-name-input"
          value={field.name}
          onChange={handleNameChange}
          placeholder="fieldName"
        />
      </div>

      {/* Data Type */}
      <div className="editor-section">
        <label className="section-label">Data Type</label>
        <div className="type-selector-trigger" onClick={() => setShowTypeSelector(!showTypeSelector)}>
          <span className="type-icon" style={{ color: DATA_TYPE_INFO[field.type]?.color }}>
            <i className={DATA_TYPE_INFO[field.type]?.icon || 'fas fa-question'}></i>
          </span>
          <span className="type-name">{DATA_TYPE_INFO[field.type]?.label || field.type}</span>
          <i className={`fas fa-chevron-${showTypeSelector ? 'up' : 'down'}`}></i>
        </div>

        {showTypeSelector && (
          <div className="type-selector">
            <div className="type-categories">
              <button
                className={activeCategory === 'all' ? 'active' : ''}
                onClick={() => setActiveCategory('all')}
              >
                All
              </button>
              {Object.entries(DATA_TYPE_CATEGORIES).map(([catId, cat]) => (
                <button
                  key={catId}
                  className={activeCategory === catId ? 'active' : ''}
                  onClick={() => setActiveCategory(catId as DataTypeCategory)}
                >
                  <i className={cat.icon}></i>
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="type-list">
              {getFilteredTypes().map((dataType: DataType) => {
                const info = DATA_TYPE_INFO[dataType];
                if (!info) return null;
                return (
                  <button
                    key={dataType}
                    className={`type-option ${field.type === dataType ? 'selected' : ''}`}
                    onClick={() => handleTypeChange(dataType)}
                  >
                    <i className={info.icon} style={{ color: info.color }}></i>
                    <span className="type-label">{info.label}</span>
                    <span className="type-example">{info.example}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Type-specific Options */}
      <div className="editor-section">
        <label className="section-label">Options</label>
        <div className="type-options">
          {renderTypeOptions()}
        </div>
      </div>

      {/* Common Options */}
      <div className="editor-section">
        <label className="section-label">Constraints</label>
        <div className="common-options">
          <div className="option-row checkbox">
            <input
              type="checkbox"
              id="nullable"
              checked={!!field.options.nullable}
              onChange={(e) => onUpdate({ options: { ...field.options, nullable: e.target.checked ? 10 : undefined } })}
            />
            <label htmlFor="nullable">Nullable (10% chance)</label>
          </div>
          {field.options.nullable && (
            <div className="option-row">
              <label>Null Probability (%)</label>
              <input
                type="number"
                min={1}
                max={100}
                value={field.options.nullable}
                onChange={(e) => onUpdate({ options: { ...field.options, nullable: parseInt(e.target.value) || 10 } })}
              />
            </div>
          )}
          <div className="option-row checkbox">
            <input
              type="checkbox"
              id="unique"
              checked={!!field.options.unique}
              onChange={(e) => onUpdate({ options: { ...field.options, unique: e.target.checked } })}
            />
            <label htmlFor="unique">Unique values</label>
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <div className="editor-section">
        <button className="btn-delete" onClick={onDelete}>
          <i className="fas fa-trash"></i>
          Delete Field
        </button>
      </div>

      <style jsx>{`
        .field-editor {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .editor-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .section-label {
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
        }

        .field-name-input {
          padding: 0.5rem 0.75rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text);
          font-size: 0.875rem;
          font-family: var(--font-mono);
        }

        .field-name-input:focus {
          outline: none;
          border-color: var(--primary);
        }

        .type-selector-trigger {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .type-selector-trigger:hover {
          border-color: var(--primary);
        }

        .type-icon {
          width: 20px;
          text-align: center;
        }

        .type-name {
          flex: 1;
          font-size: 0.8125rem;
          color: var(--text);
        }

        .type-selector {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          overflow: hidden;
          max-height: 300px;
          display: flex;
          flex-direction: column;
        }

        .type-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
          padding: 0.5rem;
          background: var(--elevated);
          border-bottom: 1px solid var(--border);
        }

        .type-categories button {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: var(--radius-xs);
          color: var(--text-secondary);
          font-size: 0.6875rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .type-categories button:hover {
          background: var(--bg);
          color: var(--text);
        }

        .type-categories button.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .type-list {
          flex: 1;
          overflow-y: auto;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .type-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.5rem;
          background: transparent;
          border: 1px solid transparent;
          border-radius: var(--radius-xs);
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
        }

        .type-option:hover {
          background: var(--elevated);
        }

        .type-option.selected {
          background: var(--primary-bg);
          border-color: var(--primary);
        }

        .type-option i {
          width: 16px;
          text-align: center;
          font-size: 0.75rem;
        }

        .type-label {
          flex: 1;
          font-size: 0.75rem;
          color: var(--text);
        }

        .type-example {
          font-size: 0.625rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .type-options,
        .common-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .option-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .option-row.full {
          flex-direction: column;
          align-items: stretch;
        }

        .option-row.checkbox {
          gap: 0.5rem;
        }

        .option-row.checkbox input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: var(--primary);
        }

        .option-row label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .option-row.checkbox label {
          color: var(--text);
          flex: 1;
        }

        .option-row input[type="text"],
        .option-row input[type="number"],
        .option-row input[type="date"],
        .option-row textarea {
          flex: 1;
          padding: 0.375rem 0.5rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-xs);
          color: var(--text);
          font-size: 0.75rem;
        }

        .option-row textarea {
          resize: vertical;
          font-family: var(--font-mono);
        }

        .option-row input:focus,
        .option-row textarea:focus {
          outline: none;
          border-color: var(--primary);
        }

        .btn-delete {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--error-bg);
          border: 1px solid var(--error);
          border-radius: var(--radius-sm);
          color: var(--error);
          font-size: 0.8125rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-delete:hover {
          background: var(--error);
          color: white;
        }
      `}</style>
    </div>
  );
}
