'use client';

import React, { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { VisualizerNode, NodeDataType } from '../../types';
import { NODE_TYPE_COLORS } from '../../types';
import { formatValueForDisplay } from '../../parser';

interface JsonNode2DData {
  node: VisualizerNode;
  showTypes: boolean;
  showValues: boolean;
  onToggleExpand: (nodeId: string) => void;
  onSelect: (nodeId: string) => void;
}

const TYPE_ICONS: Record<NodeDataType, string> = {
  object: 'fa-brackets-curly',
  array: 'fa-brackets-square',
  string: 'fa-quote-right',
  number: 'fa-hashtag',
  boolean: 'fa-toggle-on',
  null: 'fa-minus',
};

function JsonNode2DComponent({ data, selected }: NodeProps<JsonNode2DData>) {
  const { node, showTypes, showValues, onToggleExpand, onSelect } = data;
  const hasChildren = node.childrenIds.length > 0;
  const isExpandable = hasChildren && (node.type === 'object' || node.type === 'array');

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExpandable) {
      onToggleExpand(node.id);
    }
  }, [isExpandable, node.id, onToggleExpand]);

  const handleClick = useCallback(() => {
    onSelect(node.id);
  }, [node.id, onSelect]);

  const nodeColor = NODE_TYPE_COLORS[node.type];
  const displayValue = showValues ? formatValueForDisplay(node.value, 30) : null;

  return (
    <div
      className={`json-node-2d ${selected ? 'selected' : ''} ${node.isHighlighted ? 'highlighted' : ''}`}
      onClick={handleClick}
      style={{
        borderColor: nodeColor,
        backgroundColor: `${nodeColor}15`,
      }}
    >
      {/* Input Handle */}
      {node.parentId && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: nodeColor }}
        />
      )}

      <div className="node-content">
        {/* Expand/Collapse Button */}
        {isExpandable && (
          <button
            className="expand-btn"
            onClick={handleToggle}
            style={{ color: nodeColor }}
          >
            <i className={`fas ${node.isExpanded ? 'fa-chevron-down' : 'fa-chevron-right'}`} />
          </button>
        )}

        {/* Type Icon */}
        {showTypes && (
          <span className="type-icon" style={{ color: nodeColor }}>
            <i className={`fas ${TYPE_ICONS[node.type]}`} />
          </span>
        )}

        {/* Key */}
        <span className="node-key">{node.key}</span>

        {/* Type Badge */}
        {showTypes && (
          <span className="type-badge" style={{ backgroundColor: nodeColor }}>
            {node.type}
          </span>
        )}

        {/* Value Preview */}
        {displayValue && node.type !== 'object' && node.type !== 'array' && (
          <span className="node-value" style={{ color: nodeColor }}>
            {displayValue}
          </span>
        )}

        {/* Child Count */}
        {(node.type === 'object' || node.type === 'array') && (
          <span className="child-count">
            {node.childrenIds.length} {node.type === 'array' ? 'items' : 'keys'}
          </span>
        )}
      </div>

      {/* Output Handle */}
      {hasChildren && (
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: nodeColor }}
        />
      )}

      <style jsx>{`
        .json-node-2d {
          padding: 8px 12px;
          border-radius: 8px;
          border: 2px solid;
          background: var(--card);
          min-width: 120px;
          max-width: 300px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 13px;
        }

        .json-node-2d:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-1px);
        }

        .json-node-2d.selected {
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
        }

        .json-node-2d.highlighted {
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.5);
        }

        .node-content {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .expand-btn {
          background: none;
          border: none;
          padding: 2px 4px;
          cursor: pointer;
          font-size: 10px;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .expand-btn:hover {
          opacity: 1;
        }

        .type-icon {
          font-size: 11px;
          opacity: 0.8;
        }

        .node-key {
          font-weight: 600;
          color: var(--text);
        }

        .type-badge {
          font-size: 9px;
          padding: 1px 5px;
          border-radius: 4px;
          color: white;
          text-transform: uppercase;
          font-weight: 500;
        }

        .node-value {
          font-family: 'Fira Code', monospace;
          font-size: 11px;
          opacity: 0.9;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .child-count {
          font-size: 10px;
          color: var(--text-secondary);
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}

export const JsonNode2D = memo(JsonNode2DComponent);
