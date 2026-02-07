'use client';

import React, { useMemo } from 'react';
import { useJsonVisualizerStore } from '@/store/jsonVisualizer';
import { getNodePathString, formatValueForDisplay, NODE_TYPE_COLORS } from '@/lib/json-visualizer';
import { copyToClipboard } from '@/lib/clipboardUtils';

export function DetailsPanel() {
  const { graph, selectedNodeId, selectNodeById } = useJsonVisualizerStore();

  const selectedNode = useMemo(() => {
    if (!graph || !selectedNodeId) return null;
    return graph.nodes.get(selectedNodeId);
  }, [graph, selectedNodeId]);

  const parentNode = useMemo(() => {
    if (!graph || !selectedNode?.parentId) return null;
    return graph.nodes.get(selectedNode.parentId);
  }, [graph, selectedNode]);

  const handleCopyPath = async () => {
    if (!selectedNode) return;
    await copyToClipboard(getNodePathString(selectedNode));
  };

  const handleCopyValue = async () => {
    if (!selectedNode) return;
    const value = typeof selectedNode.value === 'object'
      ? JSON.stringify(selectedNode.value, null, 2)
      : String(selectedNode.value);
    await copyToClipboard(value);
  };

  // No selection
  if (!selectedNode) {
    return (
      <div className="details-panel">
        <div className="empty-details">
          <i className="fas fa-mouse-pointer" />
          <p>Click on a node to see its details</p>
        </div>
        <style jsx>{`
          .details-panel {
            padding: 12px;
            height: 100%;
          }
          .empty-details {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: var(--text-secondary);
            text-align: center;
          }
          .empty-details i {
            font-size: 24px;
            margin-bottom: 8px;
            opacity: 0.5;
          }
          .empty-details p {
            margin: 0;
            font-size: 12px;
          }
        `}</style>
      </div>
    );
  }

  const nodeColor = NODE_TYPE_COLORS[selectedNode.type];

  return (
    <div className="details-panel">
      {/* Header */}
      <div className="details-header" style={{ borderColor: nodeColor }}>
        <div className="node-type-badge" style={{ backgroundColor: nodeColor }}>
          {selectedNode.type}
        </div>
        <div className="node-key">{selectedNode.key}</div>
        <button className="close-btn" onClick={() => selectNodeById(null)}>
          <i className="fas fa-times" />
        </button>
      </div>

      {/* Path */}
      <div className="detail-section">
        <div className="section-header">
          <span className="label">Path</span>
          <button className="copy-btn" onClick={handleCopyPath} title="Copy path">
            <i className="fas fa-copy" />
          </button>
        </div>
        <code className="path-value">{getNodePathString(selectedNode)}</code>
      </div>

      {/* Value */}
      <div className="detail-section">
        <div className="section-header">
          <span className="label">Value</span>
          <button className="copy-btn" onClick={handleCopyValue} title="Copy value">
            <i className="fas fa-copy" />
          </button>
        </div>
        <div className="value-container">
          {selectedNode.type === 'object' || selectedNode.type === 'array' ? (
            <pre className="json-value">
              {JSON.stringify(selectedNode.value, null, 2)}
            </pre>
          ) : (
            <code className="primitive-value" style={{ color: nodeColor }}>
              {formatValueForDisplay(selectedNode.value, 200)}
            </code>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="detail-section">
        <span className="label">Metadata</span>
        <div className="metadata-grid">
          <div className="meta-item">
            <span className="meta-label">Depth</span>
            <span className="meta-value">{selectedNode.depth}</span>
          </div>
          {(selectedNode.type === 'object' || selectedNode.type === 'array') && (
            <div className="meta-item">
              <span className="meta-label">
                {selectedNode.type === 'array' ? 'Items' : 'Properties'}
              </span>
              <span className="meta-value">{selectedNode.childrenIds.length}</span>
            </div>
          )}
          {typeof selectedNode.value === 'string' && (
            <div className="meta-item">
              <span className="meta-label">Length</span>
              <span className="meta-value">{selectedNode.value.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Parent Navigation */}
      {parentNode && (
        <div className="detail-section">
          <span className="label">Parent</span>
          <button
            className="parent-btn"
            onClick={() => selectNodeById(parentNode.id)}
            style={{ borderColor: NODE_TYPE_COLORS[parentNode.type] }}
          >
            <span className="parent-type" style={{ color: NODE_TYPE_COLORS[parentNode.type] }}>
              {parentNode.type}
            </span>
            <span className="parent-key">{parentNode.key}</span>
            <i className="fas fa-arrow-up" />
          </button>
        </div>
      )}

      {/* Children Preview */}
      {selectedNode.childrenIds.length > 0 && (
        <div className="detail-section">
          <span className="label">Children ({selectedNode.childrenIds.length})</span>
          <div className="children-list">
            {selectedNode.childrenIds.slice(0, 5).map((childId) => {
              const child = graph?.nodes.get(childId);
              if (!child) return null;
              return (
                <button
                  key={childId}
                  className="child-btn"
                  onClick={() => selectNodeById(childId)}
                >
                  <span className="child-type" style={{ color: NODE_TYPE_COLORS[child.type] }}>
                    {child.type}
                  </span>
                  <span className="child-key">{child.key}</span>
                </button>
              );
            })}
            {selectedNode.childrenIds.length > 5 && (
              <div className="more-children">
                + {selectedNode.childrenIds.length - 5} more
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .details-panel {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 12px;
          overflow-y: auto;
          height: 100%;
        }

        .details-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 12px;
          border-bottom: 2px solid;
        }

        .node-type-badge {
          padding: 3px 8px;
          border-radius: 4px;
          color: white;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .node-key {
          flex: 1;
          font-weight: 600;
          color: var(--text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 4px;
        }

        .close-btn:hover {
          color: var(--text);
        }

        .detail-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .label {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--text-secondary);
          letter-spacing: 0.5px;
        }

        .copy-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 2px 4px;
          font-size: 11px;
        }

        .copy-btn:hover {
          color: var(--primary);
        }

        .path-value {
          font-family: 'Fira Code', monospace;
          font-size: 11px;
          color: var(--text-secondary);
          background: var(--elevated);
          padding: 6px 8px;
          border-radius: 4px;
          word-break: break-all;
        }

        .value-container {
          background: var(--elevated);
          border-radius: 4px;
          max-height: 200px;
          overflow: auto;
        }

        .json-value {
          font-family: 'Fira Code', monospace;
          font-size: 11px;
          color: var(--text-secondary);
          margin: 0;
          padding: 8px;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .primitive-value {
          display: block;
          font-family: 'Fira Code', monospace;
          font-size: 12px;
          padding: 8px;
          word-break: break-all;
        }

        .metadata-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .meta-item {
          display: flex;
          justify-content: space-between;
          padding: 6px 8px;
          background: var(--elevated);
          border-radius: 4px;
        }

        .meta-label {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .meta-value {
          font-size: 11px;
          font-weight: 600;
          color: var(--text);
        }

        .parent-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: var(--elevated);
          border: 1px solid;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .parent-btn:hover {
          background: var(--hover);
        }

        .parent-type {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .parent-key {
          flex: 1;
          font-size: 12px;
          color: var(--text);
          text-align: left;
        }

        .parent-btn i {
          color: var(--text-secondary);
          font-size: 10px;
        }

        .children-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .child-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          background: var(--elevated);
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .child-btn:hover {
          background: var(--hover);
        }

        .child-type {
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .child-key {
          font-size: 11px;
          color: var(--text);
        }

        .more-children {
          font-size: 11px;
          color: var(--text-secondary);
          padding: 4px 8px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
