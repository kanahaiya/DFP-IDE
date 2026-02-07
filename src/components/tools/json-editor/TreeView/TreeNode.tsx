'use client';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import type { TreeNode as TreeNodeType, NodeType } from '@/lib/json-editor/types';
import { getTypeIcon, getTypeDisplayName, countChildren } from '@/lib/json-editor/pathUtils';

interface TreeNodeProps {
  node: TreeNodeType;
  showTypes: boolean;
  indentSize: number;
  onToggleExpand: (nodeId: string) => void;
  onSelect: (nodeId: string) => void;
  onStartEdit: (nodeId: string) => void;
  onValueChange: (nodeId: string, value: string) => void;
  onKeyChange: (nodeId: string, newKey: string) => void;
  onContextMenu: (e: React.MouseEvent, nodeId: string) => void;
  searchMatch?: { matchType: 'key' | 'value'; startIndex: number; endIndex: number };
}

export function TreeNode({
  node,
  showTypes,
  indentSize,
  onToggleExpand,
  onSelect,
  onStartEdit,
  onValueChange,
  onKeyChange,
  onContextMenu,
  searchMatch,
}: TreeNodeProps) {
  const [editingKey, setEditingKey] = useState(false);
  const [editingValue, setEditingValue] = useState(false);
  const [keyInput, setKeyInput] = useState(node.key);
  const [valueInput, setValueInput] = useState('');
  const keyInputRef = useRef<HTMLInputElement>(null);
  const valueInputRef = useRef<HTMLInputElement>(null);

  const isExpandable = node.type === 'object' || node.type === 'array';
  const childCount = countChildren(node.value);
  const indent = node.depth * indentSize * 8; // 8px per indent level

  // Focus input when editing starts
  useEffect(() => {
    if (editingKey && keyInputRef.current) {
      keyInputRef.current.focus();
      keyInputRef.current.select();
    }
  }, [editingKey]);

  useEffect(() => {
    if (editingValue && valueInputRef.current) {
      valueInputRef.current.focus();
      valueInputRef.current.select();
    }
  }, [editingValue]);

  // Initialize value input when starting to edit
  useEffect(() => {
    if (node.isEditing) {
      setEditingValue(true);
      setValueInput(formatValueForEdit(node.value, node.type));
    } else {
      setEditingValue(false);
    }
  }, [node.isEditing, node.value, node.type]);

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExpandable) {
      onToggleExpand(node.id);
    }
  }, [isExpandable, node.id, onToggleExpand]);

  const handleClick = useCallback(() => {
    onSelect(node.id);
  }, [node.id, onSelect]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isExpandable) {
      onStartEdit(node.id);
    }
  }, [isExpandable, node.id, onStartEdit]);

  const handleKeyDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Don't allow editing root key or array indices
    if (node.depth === 0 || /^\d+$/.test(node.key)) return;
    setEditingKey(true);
    setKeyInput(node.key);
  }, [node.depth, node.key]);

  const handleKeySubmit = useCallback(() => {
    if (keyInput.trim() && keyInput !== node.key) {
      onKeyChange(node.id, keyInput.trim());
    }
    setEditingKey(false);
  }, [keyInput, node.id, node.key, onKeyChange]);

  const handleValueSubmit = useCallback(() => {
    onValueChange(node.id, valueInput);
    setEditingValue(false);
  }, [node.id, valueInput, onValueChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, isKey: boolean) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isKey) {
        handleKeySubmit();
      } else {
        handleValueSubmit();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (isKey) {
        setEditingKey(false);
        setKeyInput(node.key);
      } else {
        setEditingValue(false);
      }
    }
  }, [handleKeySubmit, handleValueSubmit, node.key]);

  const handleContextMenuEvent = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(node.id);
    onContextMenu(e, node.id);
  }, [node.id, onContextMenu, onSelect]);

  // Render value display
  const renderValue = () => {
    if (editingValue && !isExpandable) {
      return (
        <input
          ref={valueInputRef}
          type={node.type === 'number' ? 'number' : 'text'}
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          onBlur={handleValueSubmit}
          onKeyDown={(e) => handleKeyDown(e, false)}
          className="json-editor-inline-input"
          onClick={(e) => e.stopPropagation()}
        />
      );
    }

    if (isExpandable) {
      const bracket = node.type === 'object' ? '{' : '[';
      const closeBracket = node.type === 'object' ? '}' : ']';
      
      if (!node.isExpanded) {
        return (
          <span className="json-editor-bracket">
            {bracket}
            <span className="json-editor-count">
              {childCount} {childCount === 1 ? 'item' : 'items'}
            </span>
            {closeBracket}
          </span>
        );
      }
      
      return (
        <span className="json-editor-bracket">{bracket}</span>
      );
    }

    return (
      <span 
        className="json-editor-value"
        data-type={node.type}
        onDoubleClick={handleDoubleClick}
      >
        {highlightSearchMatch(
          formatValueForDisplay(node.value, node.type),
          searchMatch?.matchType === 'value' ? searchMatch : undefined
        )}
      </span>
    );
  };

  return (
    <div
      className={`json-editor-tree-node ${node.isSelected ? 'selected' : ''} ${searchMatch ? 'match' : ''}`}
      style={{ paddingLeft: `${indent + 8}px` }}
      onClick={handleClick}
      onContextMenu={handleContextMenuEvent}
    >
      {/* Expand/Collapse toggle */}
      <button
        onClick={handleToggle}
        className={`json-editor-expando ${!isExpandable ? 'invisible' : ''}`}
        aria-label={node.isExpanded ? 'Collapse' : 'Expand'}
      >
        <i className={`fas fa-chevron-right chevron ${node.isExpanded ? 'expanded' : ''}`} />
      </button>

      {/* Type icon */}
      {showTypes && (
        <span className="json-editor-type-icon" data-type={node.type} aria-hidden="true">
          <i className={`${getTypeIcon(node.type)} text-xs`} />
        </span>
      )}

      {/* Key */}
      {node.depth > 0 && (
        <>
          {editingKey ? (
            <input
              ref={keyInputRef}
              type="text"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onBlur={handleKeySubmit}
              onKeyDown={(e) => handleKeyDown(e, true)}
              className="json-editor-inline-input key"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span 
              className="json-editor-key"
              onDoubleClick={handleKeyDoubleClick}
            >
              {highlightSearchMatch(node.key, searchMatch?.matchType === 'key' ? searchMatch : undefined)}
            </span>
          )}
          <span className="json-editor-colon">:</span>
        </>
      )}

      {/* Value */}
      {renderValue()}

      {/* Trailing info */}
      {showTypes && !isExpandable && (
        <span className="json-editor-type-label">
          {getTypeDisplayName(node.type)}
        </span>
      )}

      <style jsx>{`
        .json-editor-tree-node {
          display: flex;
          align-items: center;
          min-height: 28px;
          padding: 0 8px;
          cursor: pointer;
          user-select: none;
          border-left: 2px solid transparent;
        }

        .json-editor-tree-node:hover {
          background: rgba(88, 166, 255, 0.06);
        }

        .json-editor-tree-node.selected {
          background: rgba(88, 166, 255, 0.12);
          border-left-color: var(--primary);
        }

        .json-editor-tree-node.match:not(.selected) {
          background: rgba(210, 153, 34, 0.12);
        }

        .json-editor-expando {
          width: 20px;
          height: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 4px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
          flex-shrink: 0;
        }

        .json-editor-expando:hover {
          background: var(--hover);
          color: var(--text);
        }

        .json-editor-expando.invisible {
          visibility: hidden;
        }

        .chevron {
          font-size: 11px;
          transition: transform 0.15s ease;
          opacity: 0.9;
        }

        .chevron.expanded {
          transform: rotate(90deg);
        }

        .json-editor-type-icon {
          width: 20px;
          height: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 6px;
          flex-shrink: 0;
        }

        .json-editor-type-icon[data-type='object'] {
          color: var(--primary);
        }
        .json-editor-type-icon[data-type='array'] {
          color: var(--warning);
        }
        .json-editor-type-icon[data-type='string'] {
          color: var(--success);
        }
        .json-editor-type-icon[data-type='number'] {
          color: #FFB86C;
        }
        .json-editor-type-icon[data-type='boolean'] {
          color: var(--info);
        }
        .json-editor-type-icon[data-type='null'] {
          color: var(--text-secondary);
        }

        .json-editor-key {
          font-family: var(--font-mono);
          color: var(--primary);
          cursor: pointer;
        }

        .json-editor-key:hover {
          text-decoration: underline;
        }

        .json-editor-colon {
          margin: 0 6px;
          color: var(--text-secondary);
          opacity: 0.9;
        }

        .json-editor-bracket {
          color: var(--text-secondary);
          font-family: var(--font-mono);
        }

        .json-editor-count {
          margin: 0 6px;
          color: var(--text-secondary);
          opacity: 0.85;
        }

        .json-editor-value {
          font-family: var(--font-mono);
          border-radius: 6px;
          padding: 0 4px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .json-editor-value:hover {
          background: var(--hover);
        }

        .json-editor-value[data-type='string'] {
          color: var(--success);
        }
        .json-editor-value[data-type='number'] {
          color: #FFB86C;
        }
        .json-editor-value[data-type='boolean'] {
          color: var(--info);
        }
        .json-editor-value[data-type='null'] {
          color: var(--text-secondary);
        }

        .json-editor-type-label {
          margin-left: 8px;
          font-size: 11px;
          color: var(--text-secondary);
          opacity: 0.85;
        }

        .json-editor-inline-input {
          background: var(--input-bg);
          border: 1px solid rgba(88, 166, 255, 0.55);
          border-radius: 6px;
          padding: 2px 6px;
          font-size: 13px;
          font-family: var(--font-mono);
          color: var(--text);
          outline: none;
          min-width: 60px;
        }

        .json-editor-inline-input.key {
          min-width: 40px;
          color: var(--primary);
        }

        .json-editor-inline-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.15);
        }

        :global(.json-editor-highlight) {
          background: rgba(210, 153, 34, 0.55);
          color: #fff;
          border-radius: 4px;
          padding: 0 2px;
        }
      `}</style>
    </div>
  );
}

// Helper functions
function formatValueForDisplay(value: unknown, type: NodeType): string {
  switch (type) {
    case 'string':
      return `"${value}"`;
    case 'number':
    case 'boolean':
      return String(value);
    case 'null':
      return 'null';
    default:
      return '';
  }
}

function formatValueForEdit(value: unknown, type: NodeType): string {
  switch (type) {
    case 'string':
      return String(value);
    case 'number':
      return String(value);
    case 'boolean':
      return String(value);
    case 'null':
      return '';
    default:
      return '';
  }
}

function highlightSearchMatch(
  text: string, 
  match?: { startIndex: number; endIndex: number }
): React.ReactNode {
  if (!match) return text;
  
  const before = text.slice(0, match.startIndex);
  const highlighted = text.slice(match.startIndex, match.endIndex);
  const after = text.slice(match.endIndex);
  
  return (
    <>
      {before}
      <span className="json-editor-highlight">{highlighted}</span>
      {after}
    </>
  );
}
