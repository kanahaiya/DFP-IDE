'use client';

import React from 'react';
import type { SchemaField, DataType } from '@/lib/json-generator/types';
import { DATA_TYPE_INFO } from '@/lib/json-generator/types';

interface SchemaBuilderProps {
  schema: SchemaField[];
  selectedFieldId: string | null;
  onSelectField: (fieldId: string | null) => void;
  onAddField: (parentId?: string) => void;
  onRemoveField: (fieldId: string) => void;
  onMoveField: (fieldId: string, direction: 'up' | 'down') => void;
}

export function SchemaBuilder({
  schema,
  selectedFieldId,
  onSelectField,
  onAddField,
  onRemoveField,
  onMoveField,
}: SchemaBuilderProps) {
  const getTypeIcon = (type: DataType): string => {
    const info = DATA_TYPE_INFO[type];
    return info?.icon || 'fas fa-question';
  };

  const getTypeColor = (type: DataType): string => {
    const info = DATA_TYPE_INFO[type];
    return info?.color || 'var(--text-secondary)';
  };

  const renderField = (field: SchemaField, index: number, total: number, depth: number = 0) => {
    const isSelected = selectedFieldId === field.id;
    const hasChildren = field.children && field.children.length > 0;
    const isStructure = field.type === 'object' || field.type === 'array';

    return (
      <div key={field.id} className="schema-field-wrapper">
        <div
          className={`schema-field ${isSelected ? 'selected' : ''} ${isStructure ? 'structure' : ''}`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => onSelectField(field.id)}
        >
          {/* Expand/Collapse for structures */}
          {isStructure && (
            <span className="expand-icon">
              <i className={`fas fa-chevron-${hasChildren ? 'down' : 'right'}`}></i>
            </span>
          )}

          {/* Type Icon */}
          <span className="field-type-icon" style={{ color: getTypeColor(field.type) }}>
            <i className={getTypeIcon(field.type)}></i>
          </span>

          {/* Field Name */}
          <span className="field-name">{field.name}</span>

          {/* Type Badge */}
          <span className="field-type-badge">{field.type}</span>

          {/* Options Indicators */}
          <span className="field-indicators">
            {field.options.nullable && (
              <span className="indicator" title="Nullable">?</span>
            )}
            {field.options.unique && (
              <span className="indicator" title="Unique">!</span>
            )}
          </span>

          {/* Actions */}
          <div className="field-actions">
            <button
              className="action-btn"
              onClick={(e) => { e.stopPropagation(); onMoveField(field.id, 'up'); }}
              disabled={index === 0}
              title="Move up"
            >
              <i className="fas fa-chevron-up"></i>
            </button>
            <button
              className="action-btn"
              onClick={(e) => { e.stopPropagation(); onMoveField(field.id, 'down'); }}
              disabled={index === total - 1}
              title="Move down"
            >
              <i className="fas fa-chevron-down"></i>
            </button>
            {isStructure && (
              <button
                className="action-btn add"
                onClick={(e) => { e.stopPropagation(); onAddField(field.id); }}
                title="Add child field"
              >
                <i className="fas fa-plus"></i>
              </button>
            )}
            <button
              className="action-btn delete"
              onClick={(e) => { e.stopPropagation(); onRemoveField(field.id); }}
              title="Delete field"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && (
          <div className="schema-children">
            {field.children!.map((child, childIndex) =>
              renderField(child, childIndex, field.children!.length, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="schema-builder">
      {schema.length === 0 ? (
        <div className="empty-schema">
          <i className="fas fa-database"></i>
          <p>No fields defined</p>
          <button className="btn-add-first" onClick={() => onAddField()}>
            <i className="fas fa-plus"></i>
            Add First Field
          </button>
        </div>
      ) : (
        <div className="schema-fields">
          {schema.map((field, index) => renderField(field, index, schema.length))}
        </div>
      )}

{/* Styles moved to globals.css for proper scoping */}
    </div>
  );
}
