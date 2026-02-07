'use client';

import React, { useState } from 'react';
import type { ColumnConfig } from '@/lib/excel/types';

interface ColumnManagerPanelProps {
  columns: ColumnConfig[];
  onToggleColumn: (key: string) => void;
  onRenameColumn: (key: string, newName: string) => void;
  onReorderColumn: (fromIndex: number, toIndex: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function ColumnManagerPanel({
  columns,
  onToggleColumn,
  onRenameColumn,
  onReorderColumn,
  onSelectAll,
  onDeselectAll,
}: ColumnManagerPanelProps) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const selectedCount = columns.filter(col => col.visible).length;
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  const handleStartEdit = (col: ColumnConfig) => {
    setEditingKey(col.key);
    setEditValue(col.displayName);
  };

  const handleSaveEdit = (key: string) => {
    if (editValue.trim()) {
      onRenameColumn(key, editValue.trim());
    }
    setEditingKey(null);
    setEditValue('');
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorderColumn(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'string': return 'fas fa-font';
      case 'number': return 'fas fa-hashtag';
      case 'boolean': return 'fas fa-toggle-on';
      case 'date': return 'fas fa-calendar';
      default: return 'fas fa-question';
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'string': return '#27ae60';
      case 'number': return '#3498db';
      case 'boolean': return '#e74c3c';
      case 'date': return '#9b59b6';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="column-manager-panel">
      <div className="panel-header">
        <div className="header-info">
          <span className="header-title">
            <i className="fas fa-columns"></i>
            Column Selection
          </span>
          <span className="selection-count">
            {selectedCount} of {columns.length} selected
          </span>
        </div>
        <div className="header-actions">
          <button onClick={onSelectAll} title="Select all">
            <i className="fas fa-check-double"></i>
          </button>
          <button onClick={onDeselectAll} title="Deselect all">
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div className="columns-list">
        {sortedColumns.map((col, index) => (
          <div
            key={col.key}
            className={`column-item ${col.visible ? 'visible' : 'hidden'} ${draggedIndex === index ? 'dragging' : ''}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className="drag-handle">
              <i className="fas fa-grip-vertical"></i>
            </div>

            <label className="column-checkbox">
              <input
                type="checkbox"
                checked={col.visible}
                onChange={() => onToggleColumn(col.key)}
              />
              <span className="checkmark"></span>
            </label>

            <div className="column-info">
              {editingKey === col.key ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleSaveEdit(col.key)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(col.key);
                    if (e.key === 'Escape') {
                      setEditingKey(null);
                      setEditValue('');
                    }
                  }}
                  autoFocus
                  className="edit-input"
                />
              ) : (
                <span className="column-name" onClick={() => handleStartEdit(col)}>
                  {col.displayName}
                </span>
              )}
              <span className="column-key">{col.originalKey}</span>
            </div>

            <div className="column-type" style={{ color: getTypeColor(col.dataType) }}>
              <i className={getTypeIcon(col.dataType)}></i>
              <span>{col.dataType}</span>
            </div>

            {editingKey !== col.key && (
              <button
                className="edit-btn"
                onClick={() => handleStartEdit(col)}
                title="Rename column"
              >
                <i className="fas fa-pencil-alt"></i>
              </button>
            )}
          </div>
        ))}
      </div>

      {columns.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-table"></i>
          <span>No columns detected</span>
          <span className="hint">Enter valid JSON to see columns</span>
        </div>
      )}

      <style jsx>{`
        .column-manager-panel {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1rem;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border);
        }

        .header-info {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
        }

        .header-title i {
          color: var(--primary);
        }

        .selection-count {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .header-actions {
          display: flex;
          gap: 0.25rem;
        }

        .header-actions button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 0.15s;
        }

        .header-actions button:hover {
          background: var(--card);
          color: var(--primary);
          border-color: var(--primary);
        }

        .columns-list {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          max-height: 400px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }

        .columns-list::-webkit-scrollbar {
          width: 6px;
        }

        .columns-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .columns-list::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 3px;
        }

        .columns-list::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }

        .column-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          cursor: grab;
          transition: all 0.15s;
        }

        .column-item:hover {
          background: var(--card);
        }

        .column-item.hidden {
          opacity: 0.5;
        }

        .column-item.dragging {
          opacity: 0.5;
          border-style: dashed;
        }

        .drag-handle {
          color: var(--text-tertiary);
          cursor: grab;
          font-size: 0.75rem;
        }

        .column-checkbox {
          position: relative;
          cursor: pointer;
        }

        .column-checkbox input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .checkmark {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-xs);
          transition: all 0.15s;
        }

        .column-checkbox input:checked + .checkmark {
          background: var(--primary);
          border-color: var(--primary);
        }

        .checkmark::after {
          content: '\\f00c';
          font-family: 'Font Awesome 6 Free';
          font-weight: 900;
          font-size: 0.6rem;
          color: white;
          opacity: 0;
          transition: opacity 0.15s;
        }

        .column-checkbox input:checked + .checkmark::after {
          opacity: 1;
        }

        .column-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          min-width: 0;
        }

        .column-name {
          font-size: 0.85rem;
          color: var(--text);
          cursor: text;
        }

        .column-name:hover {
          color: var(--primary);
        }

        .column-key {
          font-size: 0.7rem;
          color: var(--text-tertiary);
          font-family: var(--font-mono);
        }

        .edit-input {
          padding: 0.25rem 0.375rem;
          border: 1px solid var(--primary);
          border-radius: var(--radius-xs);
          background: var(--card);
          color: var(--text);
          font-size: 0.85rem;
          outline: none;
        }

        .column-type {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          padding: 0.125rem 0.375rem;
          background: var(--card);
          border-radius: var(--radius-xs);
        }

        .edit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: transparent;
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
          font-size: 0.7rem;
          border-radius: var(--radius-xs);
          opacity: 0;
          transition: all 0.15s;
        }

        .column-item:hover .edit-btn {
          opacity: 1;
        }

        .edit-btn:hover {
          background: var(--elevated);
          color: var(--primary);
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: var(--text-tertiary);
          text-align: center;
        }

        .empty-state i {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .empty-state .hint {
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
}
