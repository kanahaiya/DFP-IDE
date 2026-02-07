'use client';

import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { JsonValueType } from '@/lib/flow-viz/types';
import { NODE_COLORS } from '@/lib/flow-viz/types';

interface JsonNodeData {
  key: string;
  value: unknown;
  valueType: JsonValueType;
  childCount: number;
  path: string;
  isHighlighted?: boolean;
  showTypes?: boolean;
  showValues?: boolean;
  showPath?: boolean;
}

interface JsonNodeComponentProps {
  data: JsonNodeData;
}

function JsonNodeComponentInner({ data }: JsonNodeComponentProps) {
  const {
    key,
    value,
    valueType,
    childCount,
    path,
    isHighlighted,
    showTypes,
    showValues,
    showPath,
  } = data;

  const bgColor = NODE_COLORS[valueType];
  const isContainer = valueType === 'object' || valueType === 'array';

  // Format display value
  const displayValue = () => {
    if (isContainer) {
      return valueType === 'array' ? `[${childCount}]` : `{${childCount}}`;
    }
    if (value === null) return 'null';
    if (typeof value === 'string') {
      return value.length > 20 ? `"${value.slice(0, 20)}..."` : `"${value}"`;
    }
    return String(value);
  };

  return (
    <div
      className={`json-node ${isHighlighted ? 'highlighted' : ''}`}
      style={{
        borderColor: bgColor,
        backgroundColor: isHighlighted ? `${bgColor}20` : undefined,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: bgColor }}
      />

      <div className="node-content">
        <div className="node-header">
          <span className="node-key">{key}</span>
          {showTypes && (
            <span className="node-type" style={{ backgroundColor: bgColor }}>
              {valueType}
            </span>
          )}
        </div>

        {showValues && (
          <div className="node-value">{displayValue()}</div>
        )}

        {showPath && (
          <div className="node-path">{path}</div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: bgColor }}
      />

      <style jsx>{`
        .json-node {
          padding: 8px 12px;
          border-radius: 8px;
          border: 2px solid;
          background: var(--card);
          min-width: 120px;
          max-width: 200px;
          font-size: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .json-node:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          transform: translateY(-1px);
        }

        .json-node.highlighted {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
        }

        .node-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .node-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .node-key {
          font-weight: 600;
          color: var(--text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .node-type {
          font-size: 9px;
          padding: 2px 4px;
          border-radius: 4px;
          color: white;
          flex-shrink: 0;
        }

        .node-value {
          color: var(--text-secondary);
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 11px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .node-path {
          font-size: 9px;
          color: var(--text-secondary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}

export const JsonNodeComponent = memo(JsonNodeComponentInner);
