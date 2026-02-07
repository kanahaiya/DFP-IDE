'use client';

import React from 'react';
import type { TreeNode, FlattenedTree } from '@/lib/json-editor/types';

interface PathBreadcrumbProps {
  tree: FlattenedTree;
  selectedNode: TreeNode | null;
  onNavigate: (nodeId: string) => void;
}

export function PathBreadcrumb({ tree, selectedNode, onNavigate }: PathBreadcrumbProps) {
  if (!selectedNode) {
    return (
      <div className="path-breadcrumb-container">
        <span className="breadcrumb-empty">No selection</span>

        <style jsx>{`
          .path-breadcrumb-container {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 0.75rem;
            background: var(--elevated);
            border-bottom: 1px solid var(--border);
            font-size: 0.875rem;
            color: var(--text-secondary);
            flex-shrink: 0;
          }

          .breadcrumb-empty {
            color: var(--text-secondary);
          }
        `}</style>
      </div>
    );
  }

  // Build the path from root to selected node
  const pathNodes: TreeNode[] = [];
  let currentNode: TreeNode | undefined = selectedNode;
  
  while (currentNode) {
    pathNodes.unshift(currentNode);
    if (currentNode.parentId) {
      currentNode = tree.nodes.get(currentNode.parentId);
    } else {
      break;
    }
  }

  return (
    <div className="path-breadcrumb-container">
      <i className="fas fa-route breadcrumb-icon" aria-hidden="true" />
      
      {pathNodes.map((node, index) => (
        <React.Fragment key={node.id}>
          {index > 0 && (
            <i className="fas fa-chevron-right breadcrumb-sep" aria-hidden="true" />
          )}
          <button
            onClick={() => onNavigate(node.id)}
            className={`breadcrumb-btn ${node.id === selectedNode.id ? 'active' : ''}`}
          >
            {index === 0 ? 'root' : node.key}
            {(node.type === 'object' || node.type === 'array') && (
              <span className="breadcrumb-type">
                {node.type === 'object' ? '{}' : '[]'}
              </span>
            )}
          </button>
        </React.Fragment>
      ))}

      <style jsx>{`
        .path-breadcrumb-container {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 0.75rem;
          background: var(--elevated);
          border-bottom: 1px solid var(--border);
          font-size: 0.875rem;
          overflow-x: auto;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .breadcrumb-icon {
          color: var(--text-secondary);
          margin-right: 0.25rem;
          flex-shrink: 0;
        }

        .breadcrumb-sep {
          color: var(--text-secondary);
          font-size: 0.75rem;
          margin: 0 0.25rem;
          flex-shrink: 0;
          opacity: 0.75;
        }

        .breadcrumb-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.125rem 0.5rem;
          border-radius: 6px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
          font-family: var(--font-mono);
        }

        .breadcrumb-btn:hover {
          background: var(--hover);
          color: var(--text);
        }

        .breadcrumb-btn.active {
          background: rgba(88, 166, 255, 0.15);
          border-color: rgba(88, 166, 255, 0.35);
          color: var(--primary);
        }

        .breadcrumb-type {
          color: var(--text-secondary);
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}
