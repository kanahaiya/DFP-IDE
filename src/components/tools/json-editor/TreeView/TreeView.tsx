'use client';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import type { FlattenedTree, SearchResult, NodeType, JsonValue } from '@/lib/json-editor/types';
import { TreeNode } from './TreeNode';
import { ContextMenu } from './ContextMenu';

interface TreeViewProps {
  tree: FlattenedTree;
  showTypes: boolean;
  indentSize: number;
  searchResults: SearchResult[];
  currentSearchIndex: number;
  onToggleExpand: (nodeId: string) => void;
  onSelect: (nodeId: string | null) => void;
  onStartEdit: (nodeId: string) => void;
  onValueChange: (nodeId: string, value: JsonValue) => void;
  onKeyChange: (nodeId: string, newKey: string) => void;
  onAddProperty: (nodeId: string, key: string, type: NodeType) => void;
  onDeleteProperty: (nodeId: string) => void;
  onDuplicateProperty: (nodeId: string) => void;
  onMoveUp: (nodeId: string) => void;
  onMoveDown: (nodeId: string) => void;
  onChangeType: (nodeId: string, newType: NodeType) => void;
  onCopy: (nodeId: string) => void;
  onCut: (nodeId: string) => void;
  onPaste: (nodeId: string) => void;
  canPaste: boolean;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export function TreeView({
  tree,
  showTypes,
  indentSize,
  searchResults,
  currentSearchIndex,
  onToggleExpand,
  onSelect,
  onStartEdit,
  onValueChange,
  onKeyChange,
  onAddProperty,
  onDeleteProperty,
  onDuplicateProperty,
  onMoveUp,
  onMoveDown,
  onChangeType,
  onCopy,
  onCut,
  onPaste,
  canPaste,
  onExpandAll,
  onCollapseAll,
}: TreeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    nodeId: string;
  } | null>(null);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu) {
        setContextMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const selectedNode = Array.from(tree.nodes.values()).find(n => n.isSelected);
      if (!selectedNode) return;

      switch (e.key) {
        case 'ArrowUp': {
          e.preventDefault();
          const currentIndex = tree.visibleNodeIds.indexOf(selectedNode.id);
          if (currentIndex > 0) {
            onSelect(tree.visibleNodeIds[currentIndex - 1]);
          }
          break;
        }
        case 'ArrowDown': {
          e.preventDefault();
          const currentIndex = tree.visibleNodeIds.indexOf(selectedNode.id);
          if (currentIndex < tree.visibleNodeIds.length - 1) {
            onSelect(tree.visibleNodeIds[currentIndex + 1]);
          }
          break;
        }
        case 'ArrowLeft':
          e.preventDefault();
          if (selectedNode.isExpanded && selectedNode.childrenIds.length > 0) {
            onToggleExpand(selectedNode.id);
          } else if (selectedNode.parentId) {
            onSelect(selectedNode.parentId);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (!selectedNode.isExpanded && selectedNode.childrenIds.length > 0) {
            onToggleExpand(selectedNode.id);
          } else if (selectedNode.childrenIds.length > 0) {
            onSelect(selectedNode.childrenIds[0]);
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedNode.type !== 'object' && selectedNode.type !== 'array') {
            onStartEdit(selectedNode.id);
          } else {
            onToggleExpand(selectedNode.id);
          }
          break;
        case 'Delete':
        case 'Backspace':
          if (selectedNode.depth > 0 && !selectedNode.isEditing) {
            e.preventDefault();
            onDeleteProperty(selectedNode.id);
          }
          break;
        case 'F2':
          e.preventDefault();
          if (selectedNode.type !== 'object' && selectedNode.type !== 'array') {
            onStartEdit(selectedNode.id);
          }
          break;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      return () => container.removeEventListener('keydown', handleKeyDown);
    }
  }, [tree, onSelect, onToggleExpand, onStartEdit, onDeleteProperty]);

  const handleContextMenu = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, nodeId });
  }, []);

  const handleValueChange = useCallback((nodeId: string, valueStr: string) => {
    const node = tree.nodes.get(nodeId);
    if (!node) return;

    let newValue: JsonValue;

    switch (node.type) {
      case 'string':
        newValue = valueStr;
        break;
      case 'number':
        newValue = parseFloat(valueStr) || 0;
        break;
      case 'boolean':
        newValue = valueStr.toLowerCase() === 'true';
        break;
      case 'null':
        newValue = null;
        break;
      default:
        newValue = valueStr;
    }

    onValueChange(nodeId, newValue);
  }, [tree.nodes, onValueChange]);

  const getSearchMatchForNode = useCallback((nodeId: string) => {
    const result = searchResults[currentSearchIndex];
    if (result && result.nodeId === nodeId) {
      return {
        matchType: result.matchType,
        startIndex: result.startIndex,
        endIndex: result.endIndex,
      };
    }
    // Check if there's any match for this node
    const anyMatch = searchResults.find(r => r.nodeId === nodeId);
    if (anyMatch) {
      return {
        matchType: anyMatch.matchType,
        startIndex: anyMatch.startIndex,
        endIndex: anyMatch.endIndex,
      };
    }
    return undefined;
  }, [searchResults, currentSearchIndex]);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const contextNode = contextMenu ? tree.nodes.get(contextMenu.nodeId) : null;

  return (
    <div
      ref={containerRef}
      className="json-editor-treeview"
      tabIndex={0}
      onClick={() => onSelect(null)}
    >
      {/* Closing brackets for expanded arrays/objects */}
      {tree.visibleNodeIds.map((nodeId) => {
        const node = tree.nodes.get(nodeId);
        if (!node) return null;

        const searchMatch = getSearchMatchForNode(nodeId);

        return (
          <TreeNode
            key={nodeId}
            node={node}
            showTypes={showTypes}
            indentSize={indentSize}
            onToggleExpand={onToggleExpand}
            onSelect={onSelect}
            onStartEdit={onStartEdit}
            onValueChange={handleValueChange}
            onKeyChange={onKeyChange}
            onContextMenu={handleContextMenu}
            searchMatch={searchMatch}
          />
        );
      })}

      {/* Context Menu */}
      {contextMenu && contextNode && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          node={contextNode}
          onAdd={(type) => {
            const key = contextNode.type === 'array' 
              ? String(contextNode.childrenIds.length)
              : `newKey_${Date.now()}`;
            onAddProperty(contextMenu.nodeId, key, type);
            closeContextMenu();
          }}
          onDelete={() => {
            onDeleteProperty(contextMenu.nodeId);
            closeContextMenu();
          }}
          onDuplicate={() => {
            onDuplicateProperty(contextMenu.nodeId);
            closeContextMenu();
          }}
          onMoveUp={() => {
            onMoveUp(contextMenu.nodeId);
            closeContextMenu();
          }}
          onMoveDown={() => {
            onMoveDown(contextMenu.nodeId);
            closeContextMenu();
          }}
          onChangeType={(type) => {
            onChangeType(contextMenu.nodeId, type);
            closeContextMenu();
          }}
          onCopy={() => {
            onCopy(contextMenu.nodeId);
            closeContextMenu();
          }}
          onCut={() => {
            onCut(contextMenu.nodeId);
            closeContextMenu();
          }}
          onPaste={() => {
            onPaste(contextMenu.nodeId);
            closeContextMenu();
          }}
          canPaste={canPaste}
          onExpandAll={() => {
            onExpandAll();
            closeContextMenu();
          }}
          onCollapseAll={() => {
            onCollapseAll();
            closeContextMenu();
          }}
        />
      )}

      <style jsx>{`
        .json-editor-treeview {
          position: relative;
          height: 100%;
          min-height: 0;
          overflow: auto;
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.4;
          outline: none;
          background: transparent;
        }

        .json-editor-treeview:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}
