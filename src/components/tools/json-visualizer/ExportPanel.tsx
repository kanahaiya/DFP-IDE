'use client';

import React, { useState, useCallback } from 'react';
import { useJsonVisualizerStore } from '@/store/jsonVisualizer';

type ExportFormat = 'png' | 'svg' | 'json' | 'gltf';

export function ExportPanel() {
  const { jsonInput, settings, graph } = useJsonVisualizerStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const handleExport = useCallback(async (format: ExportFormat) => {
    if (!graph) return;
    
    setIsExporting(true);
    setExportMessage(null);

    try {
      switch (format) {
        case 'json': {
          // Export the JSON data
          const blob = new Blob([jsonInput], { type: 'application/json' });
          downloadBlob(blob, 'data.json');
          setExportMessage('JSON exported successfully!');
          break;
        }

        case 'png': {
          // Export as PNG using html2canvas
          const canvasContainer = document.querySelector('.canvas-2d-container, .canvas-3d-container');
          if (!canvasContainer) {
            setExportMessage('Cannot find visualization to export');
            break;
          }

          const { default: html2canvas } = await import('html2canvas');
          const canvas = await html2canvas(canvasContainer as HTMLElement, {
            backgroundColor: settings.mode === '3d' ? '#0a0a0f' : '#ffffff',
            scale: 2,
          });
          
          canvas.toBlob((blob) => {
            if (blob) {
              downloadBlob(blob, 'visualization.png');
              setExportMessage('PNG exported successfully!');
            }
          }, 'image/png');
          break;
        }

        case 'svg': {
          if (settings.mode === '3d') {
            setExportMessage('SVG export is only available in 2D mode');
            break;
          }

          // Try to get SVG from ReactFlow
          const svgElement = document.querySelector('.react-flow__renderer svg');
          if (svgElement) {
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const blob = new Blob([svgData], { type: 'image/svg+xml' });
            downloadBlob(blob, 'visualization.svg');
            setExportMessage('SVG exported successfully!');
          } else {
            setExportMessage('Cannot find SVG element to export');
          }
          break;
        }

        case 'gltf': {
          if (settings.mode !== '3d') {
            setExportMessage('GLTF export is only available in 3D mode');
            break;
          }
          setExportMessage('GLTF export coming soon!');
          break;
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      setExportMessage('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [graph, jsonInput, settings.mode]);

  const handleShareUrl = useCallback(async () => {
    if (!jsonInput) return;

    try {
      // Compress and encode the JSON
      const encoded = btoa(encodeURIComponent(jsonInput));
      const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
      
      await navigator.clipboard.writeText(url);
      setExportMessage('Shareable URL copied to clipboard!');
    } catch (error) {
      console.error('Share error:', error);
      setExportMessage('Failed to create shareable URL');
    }
  }, [jsonInput]);

  return (
    <div className="export-panel">
      <h4 className="section-title">Export</h4>

      <div className="export-buttons">
        <button
          className="export-btn"
          onClick={() => handleExport('json')}
          disabled={isExporting || !graph}
        >
          <i className="fas fa-file-code" />
          <span>JSON</span>
        </button>
        <button
          className="export-btn"
          onClick={() => handleExport('png')}
          disabled={isExporting || !graph}
        >
          <i className="fas fa-image" />
          <span>PNG</span>
        </button>
        {settings.mode === '2d' && (
          <button
            className="export-btn"
            onClick={() => handleExport('svg')}
            disabled={isExporting || !graph}
          >
            <i className="fas fa-vector-square" />
            <span>SVG</span>
          </button>
        )}
        {settings.mode === '3d' && (
          <button
            className="export-btn"
            onClick={() => handleExport('gltf')}
            disabled={isExporting || !graph}
          >
            <i className="fas fa-cube" />
            <span>GLTF</span>
          </button>
        )}
      </div>

      <button
        className="share-btn"
        onClick={handleShareUrl}
        disabled={!graph}
      >
        <i className="fas fa-share-alt" />
        <span>Copy Shareable URL</span>
      </button>

      {exportMessage && (
        <div className={`export-message ${exportMessage.includes('failed') ? 'error' : 'success'}`}>
          {exportMessage}
        </div>
      )}

      <style jsx>{`
        .export-panel {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 12px;
          border-top: 1px solid var(--border);
        }

        .section-title {
          margin: 0;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--text-secondary);
          letter-spacing: 0.5px;
        }

        .export-buttons {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .export-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 10px 14px;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .export-btn:hover:not(:disabled) {
          background: var(--hover);
          color: var(--text);
        }

        .export-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .export-btn i {
          font-size: 16px;
        }

        .export-btn span {
          font-size: 10px;
          font-weight: 500;
        }

        .share-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          background: var(--primary);
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .share-btn:hover:not(:disabled) {
          background: var(--primary-dark);
        }

        .share-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .export-message {
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 11px;
          text-align: center;
        }

        .export-message.success {
          background: rgba(63, 185, 80, 0.1);
          color: var(--success);
        }

        .export-message.error {
          background: rgba(248, 81, 73, 0.1);
          color: var(--danger);
        }
      `}</style>
    </div>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
