'use client';

import React, { useState, useMemo } from 'react';
import { Change } from '@/lib/json-diff/diffEngine';
import { getColorsByTheme } from '@/lib/json-diff/colors';
import { useTheme } from '@/hooks/useTheme';

interface TreeViewProps {
  changes: Change[];
  onSelectChange?: (change: Change) => void;
}

interface TreeNode {
  path: string;
  fullPath: string;
  changes: Change[];
  children: Record<string, TreeNode>;
}

export function TreeView({ changes, onSelectChange }: TreeViewProps) {
  const { theme } = useTheme();
  const colors = getColorsByTheme(theme);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['$']));

  const togglePath = (path: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  // Build a hierarchical tree structure from changes
  const buildTree = (changes: Change[]): Record<string, TreeNode> => {
    const tree: Record<string, TreeNode> = {};

    changes.forEach(change => {
      const path = change.path;
      if (!Array.isArray(path) || path.length === 0) {
        return; // Skip invalid paths
      }

      let current = tree;

      path.forEach((segment, idx) => {
        const segmentStr = String(segment);
        
        if (!current[segmentStr]) {
          // Build path string correctly - use dot notation for object properties
          const pathSegments = path.slice(0, idx + 1);
          const pathStr = pathSegments.length === 1
            ? `$.${pathSegments[0]}`
            : `$.${pathSegments.join('.')}`;

          current[segmentStr] = {
            path: pathStr,
            fullPath: change.jsonPath,
            changes: [],
            children: {},
          };
        }

        if (idx === path.length - 1) {
          // This is the leaf node - add the change
          current[segmentStr].changes.push(change);
        } else {
          // This is an intermediate node - ensure children object exists
          if (!current[segmentStr].children) {
            current[segmentStr].children = {};
          }
          current = current[segmentStr].children;
        }
      });
    });

    return tree;
  };

  const tree = useMemo(() => buildTree(changes || []), [changes]);

  const getChangeIcon = (changeType: string): string => {
    switch (changeType) {
      case 'ADDED':
        return '+';
      case 'REMOVED':
        return '-';
      case 'MODIFIED':
        return '~';
      case 'TYPE_CHANGED':
        return 'T';
      case 'MOVED':
        return '→';
      default:
        return '?';
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'ADDED':
        return colors.added;
      case 'REMOVED':
        return colors.removed;
      case 'MODIFIED':
        return colors.modified;
      case 'TYPE_CHANGED':
        return colors.typeChanged;
      case 'MOVED':
        return colors.moved;
      default:
        return { bg: '#gray', text: '#gray' };
    }
  };

  const renderTreeNode = (node: TreeNode, key: string, level: number = 0): React.ReactNode => {
    const hasChildren = Object.keys(node.children || {}).length > 0;
    const isExpanded = expandedPaths.has(node.path);
    const indent = level * 16;
    const hasChange = node.changes.length > 0;
    const change = hasChange ? node.changes[0] : null;

    return (
      <div key={`${node.path}-${key}`} className="tree-item-wrapper">
        <div
          className="tree-item"
          style={{ paddingLeft: `${8 + indent}px` }}
          onClick={() => {
            if (hasChildren) {
              togglePath(node.path);
            }
            if (change && onSelectChange) {
              onSelectChange(change);
            }
          }}
        >
          {/* Expand/collapse icon */}
          {hasChildren && (
            <span className="tree-expand-icon">
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          {!hasChildren && <span className="tree-spacer"></span>}

          {/* Change type badge */}
          {hasChange && change && (
            <span
              className="tree-change-badge"
              style={{
                backgroundColor: getChangeColor(change.type).bg,
                color: getChangeColor(change.type).text,
              }}
            >
              {getChangeIcon(change.type)}
            </span>
          )}

          {/* Node key name */}
          <span className="tree-key-name">
            {key}
            {hasChange &&
              change &&
              Array.isArray(change.path) &&
              typeof change.path[change.path.length - 1] === 'number' &&
              `[${change.path[change.path.length - 1]}]`}
          </span>

          {/* Change value */}
          {hasChange && change && (
            <span className="tree-value">
              {change.type === 'MODIFIED' || change.type === 'TYPE_CHANGED'
                ? `${JSON.stringify(change.oldValue)} → ${JSON.stringify(change.newValue)}`
                : change.type === 'MOVED'
                ? `Moved from [${change.oldIndex}] to [${change.newIndex}]`
                : JSON.stringify(change.value || change.newValue || change.oldValue)}
            </span>
          )}
        </div>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div className="tree-children">
            {Object.entries(node.children)
              .sort(([a], [b]) => {
                // Sort array indices numerically, object keys alphabetically
                const aIsNumeric = /^\d+$/.test(a);
                const bIsNumeric = /^\d+$/.test(b);

                if (aIsNumeric && bIsNumeric) {
                  return parseInt(a, 10) - parseInt(b, 10);
                } else if (aIsNumeric) {
                  return -1;
                } else if (bIsNumeric) {
                  return 1;
                } else {
                  return a.localeCompare(b);
                }
              })
              .map(([childKey, childNode]) =>
                renderTreeNode(childNode, childKey, level + 1)
              )}
          </div>
        )}
      </div>
    );
  };

  if (!changes || changes.length === 0) {
    return (
      <div className="tree-view-empty">
        No differences found
      </div>
    );
  }

  return (
    <div className="tree-view">
      <div className="tree-container">
        {Object.entries(tree)
          .sort(([a], [b]) => {
            const aIsNumeric = /^\d+$/.test(a);
            const bIsNumeric = /^\d+$/.test(b);
            if (aIsNumeric && bIsNumeric) {
              return parseInt(a, 10) - parseInt(b, 10);
            } else if (aIsNumeric) return -1;
            else if (bIsNumeric) return 1;
            return a.localeCompare(b);
          })
          .map(([key, node]) => renderTreeNode(node, key, 0))}
      </div>
    </div>
  );
}
