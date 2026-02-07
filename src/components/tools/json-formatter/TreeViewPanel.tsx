'use client';

import React, { memo, useCallback } from 'react';
import type { TreeNode, NodeType } from '@/lib/formatter/types';

interface TreeViewPanelProps {
  root: TreeNode | null;
  expandedNodes: Set<string>;
  selectedNodeId: string | null;
  searchQuery: string;
  matchedNodeIds: string[];
  currentMatchIndex: number;
  onToggleNode: (nodeId: string) => void;
  onSelectNode: (nodeId: string | null) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onSearchChange: (query: string) => void;
  onNextMatch: () => void;
  onPrevMatch: () => void;
  onCopyPath: (path: string) => void;
}

function getTypeIcon(type: NodeType): string {
  switch (type) {
    case 'object': return 'fas fa-cube';
    case 'array': return 'fas fa-list';
    case 'string': return 'fas fa-font';
    case 'number': return 'fas fa-hashtag';
    case 'boolean': return 'fas fa-toggle-on';
    case 'null': return 'fas fa-ban';
    default: return 'fas fa-question';
  }
}

function getTypeColor(type: NodeType): string {
  switch (type) {
    case 'object': return '#f39c12';
    case 'array': return '#9b59b6';
    case 'string': return '#27ae60';
    case 'number': return '#3498db';
    case 'boolean': return '#e74c3c';
    case 'null': return '#95a5a6';
    default: return '#7f8c8d';
  }
}

function formatValue(value: unknown, type: NodeType): string {
  if (type === 'null') return 'null';
  if (type === 'boolean') return String(value);
  if (type === 'number') return String(value);
  if (type === 'string') {
    const str = value as string;
    if (str.length > 50) {
      return `"${str.substring(0, 50)}..."`;
    }
    return `"${str}"`;
  }
  return '';
}

interface TreeNodeComponentProps {
  node: TreeNode;
  expandedNodes: Set<string>;
  selectedNodeId: string | null;
  matchedNodeIds: string[];
  currentMatchNodeId: string | null;
  onToggle: (nodeId: string) => void;
  onSelect: (nodeId: string) => void;
  onCopyPath: (path: string) => void;
}

const TreeNodeComponent = memo(function TreeNodeComponent({
  node,
  expandedNodes,
  selectedNodeId,
  matchedNodeIds,
  currentMatchNodeId,
  onToggle,
  onSelect,
  onCopyPath,
}: TreeNodeComponentProps) {
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedNodeId === node.id;
  const isMatched = matchedNodeIds.includes(node.id);
  const isCurrentMatch = currentMatchNodeId === node.id;
  const hasChildren = node.children.length > 0;

  const handleClick = useCallback(() => {
    onSelect(node.id);
    if (hasChildren) {
      onToggle(node.id);
    }
  }, [node.id, hasChildren, onSelect, onToggle]);

  const handleCopyPath = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const path = node.path.replace(/^root\.?/, '') || '$';
    onCopyPath(path);
  }, [node.path, onCopyPath]);

  return (
    <div className="tree-node-wrapper">
      <div
        className={`tree-node ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''} ${isCurrentMatch ? 'current-match' : ''}`}
        style={{ paddingLeft: `${node.depth * 16 + 8}px` }}
        onClick={handleClick}
      >
        {hasChildren && (
          <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
            <i className="fas fa-chevron-right"></i>
          </span>
        )}
        {!hasChildren && <span className="expand-placeholder"></span>}

        <span className="type-icon" style={{ color: getTypeColor(node.type) }}>
          <i className={getTypeIcon(node.type)}></i>
        </span>

        <span className="node-key">{node.key}</span>

        {node.childCount !== undefined && (
          <span className="child-count">
            {node.type === 'array' ? `[${node.childCount}]` : `{${node.childCount}}`}
          </span>
        )}

        {!hasChildren && (
          <span className="node-value" style={{ color: getTypeColor(node.type) }}>
            {formatValue(node.value, node.type)}
          </span>
        )}

        <button
          className="copy-path-btn"
          onClick={handleCopyPath}
          title="Copy path"
        >
          <i className="fas fa-copy"></i>
        </button>
      </div>

      {hasChildren && isExpanded && (
        <div className="tree-children">
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              expandedNodes={expandedNodes}
              selectedNodeId={selectedNodeId}
              matchedNodeIds={matchedNodeIds}
              currentMatchNodeId={currentMatchNodeId}
              onToggle={onToggle}
              onSelect={onSelect}
              onCopyPath={onCopyPath}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .tree-node-wrapper {
          user-select: none;
        }

        .tree-node {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.5rem;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: background 0.15s;
        }

        .tree-node:hover {
          background: var(--elevated);
        }

        .tree-node.selected {
          background: rgba(var(--primary-rgb, 59, 130, 246), 0.15);
        }

        .tree-node.matched {
          background: rgba(255, 193, 7, 0.2);
        }

        .tree-node.current-match {
          background: rgba(255, 193, 7, 0.4);
          outline: 2px solid #ffc107;
        }

        .expand-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          font-size: 0.65rem;
          color: var(--text-secondary);
          transition: transform 0.15s;
        }

        .expand-icon.expanded {
          transform: rotate(90deg);
        }

        .expand-placeholder {
          width: 16px;
        }

        .type-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          font-size: 0.7rem;
        }

        .node-key {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          color: var(--text);
          font-weight: 500;
        }

        .child-count {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .node-value {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          margin-left: auto;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .copy-path-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 0.7rem;
          border-radius: var(--radius-sm);
          margin-left: auto;
        }

        .tree-node:hover .copy-path-btn {
          display: flex;
        }

        .copy-path-btn:hover {
          background: var(--card);
          color: var(--primary);
        }

        .tree-children {
          /* No additional styling needed */
        }
      `}</style>
    </div>
  );
});

export function TreeViewPanel({
  root,
  expandedNodes,
  selectedNodeId,
  searchQuery,
  matchedNodeIds,
  currentMatchIndex,
  onToggleNode,
  onSelectNode,
  onExpandAll,
  onCollapseAll,
  onSearchChange,
  onNextMatch,
  onPrevMatch,
  onCopyPath,
}: TreeViewPanelProps) {
  const currentMatchNodeId = matchedNodeIds[currentMatchIndex] || null;

  if (!root) {
    return (
      <div className="tree-view-empty">
        <i className="fas fa-tree"></i>
        <span>Enter valid JSON to view tree</span>
      </div>
    );
  }

  return (
    <div className="tree-view-panel">
      <div className="tree-toolbar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search keys/values..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {matchedNodeIds.length > 0 && (
            <span className="match-count">
              {currentMatchIndex + 1}/{matchedNodeIds.length}
            </span>
          )}
          {searchQuery && (
            <div className="search-nav">
              <button onClick={onPrevMatch} title="Previous match">
                <i className="fas fa-chevron-up"></i>
              </button>
              <button onClick={onNextMatch} title="Next match">
                <i className="fas fa-chevron-down"></i>
              </button>
            </div>
          )}
        </div>
        <div className="toolbar-actions">
          <button onClick={onExpandAll} title="Expand all">
            <i className="fas fa-expand-arrows-alt"></i>
          </button>
          <button onClick={onCollapseAll} title="Collapse all">
            <i className="fas fa-compress-arrows-alt"></i>
          </button>
        </div>
      </div>

      <div className="tree-content">
        <TreeNodeComponent
          node={root}
          expandedNodes={expandedNodes}
          selectedNodeId={selectedNodeId}
          matchedNodeIds={matchedNodeIds}
          currentMatchNodeId={currentMatchNodeId}
          onToggle={onToggleNode}
          onSelect={onSelectNode}
          onCopyPath={onCopyPath}
        />
      </div>

      <style jsx>{`
        .tree-view-panel {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .tree-view-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 0.5rem;
          color: var(--text-tertiary);
        }

        .tree-view-empty i {
          font-size: 2rem;
        }

        .tree-toolbar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border-bottom: 1px solid var(--border);
          background: var(--elevated);
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.5rem;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
        }

        .search-box i {
          color: var(--text-tertiary);
          font-size: 0.8rem;
        }

        .search-box input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.8rem;
          color: var(--text);
        }

        .match-count {
          font-size: 0.7rem;
          color: var(--text-secondary);
          padding: 0.125rem 0.375rem;
          background: var(--elevated);
          border-radius: var(--radius-sm);
        }

        .search-nav {
          display: flex;
          gap: 0.125rem;
        }

        .search-nav button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 0.65rem;
          border-radius: var(--radius-xs);
        }

        .search-nav button:hover {
          background: var(--elevated);
          color: var(--text);
        }

        .toolbar-actions {
          display: flex;
          gap: 0.25rem;
        }

        .toolbar-actions button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 0.15s;
        }

        .toolbar-actions button:hover {
          background: var(--card);
          color: var(--primary);
          border-color: var(--primary);
        }

        .tree-content {
          flex: 1;
          overflow: auto;
          padding: 0.5rem;
        }
      `}</style>
    </div>
  );
}
