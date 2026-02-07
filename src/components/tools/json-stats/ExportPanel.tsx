'use client';

import React from 'react';
import type { ExportSettings, ExportFormat } from '@/lib/stats/types';

interface ExportPanelProps {
  exportSettings: ExportSettings;
  onUpdateSettings: (updates: Partial<ExportSettings>) => void;
  onExport: () => void;
  disabled: boolean;
}

export function ExportPanel({
  exportSettings,
  onUpdateSettings,
  onExport,
  disabled,
}: ExportPanelProps) {
  const formatOptions: { value: ExportFormat; label: string; icon: string }[] = [
    { value: 'json', label: 'JSON', icon: 'fas fa-file-code' },
    { value: 'csv', label: 'CSV', icon: 'fas fa-file-csv' },
    { value: 'markdown', label: 'Markdown', icon: 'fas fa-file-alt' },
  ];

  return (
    <div className="export-panel">
      <h4 className="section-title">
        <i className="fas fa-download"></i>
        Export
      </h4>
      
      <div className="format-buttons">
        {formatOptions.map(opt => (
          <button
            key={opt.value}
            className={`format-btn ${exportSettings.format === opt.value ? 'active' : ''}`}
            onClick={() => onUpdateSettings({ format: opt.value })}
            disabled={disabled}
          >
            <i className={opt.icon}></i>
            {opt.label}
          </button>
        ))}
      </div>
      
      <div className="export-options">
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="export-size"
            checked={exportSettings.includeSize}
            onChange={(e) => onUpdateSettings({ includeSize: e.target.checked })}
            disabled={disabled}
          />
          <label htmlFor="export-size">Size Metrics</label>
        </div>
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="export-structure"
            checked={exportSettings.includeStructure}
            onChange={(e) => onUpdateSettings({ includeStructure: e.target.checked })}
            disabled={disabled}
          />
          <label htmlFor="export-structure">Structure</label>
        </div>
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="export-types"
            checked={exportSettings.includeTypes}
            onChange={(e) => onUpdateSettings({ includeTypes: e.target.checked })}
            disabled={disabled}
          />
          <label htmlFor="export-types">Types</label>
        </div>
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="export-keys"
            checked={exportSettings.includeKeys}
            onChange={(e) => onUpdateSettings({ includeKeys: e.target.checked })}
            disabled={disabled}
          />
          <label htmlFor="export-keys">Keys</label>
        </div>
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="export-values"
            checked={exportSettings.includeValues}
            onChange={(e) => onUpdateSettings({ includeValues: e.target.checked })}
            disabled={disabled}
          />
          <label htmlFor="export-values">Values</label>
        </div>
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="export-quality"
            checked={exportSettings.includeQuality}
            onChange={(e) => onUpdateSettings({ includeQuality: e.target.checked })}
            disabled={disabled}
          />
          <label htmlFor="export-quality">Quality</label>
        </div>
      </div>
      
      <button
        className="export-btn"
        onClick={onExport}
        disabled={disabled}
      >
        <i className="fas fa-download"></i>
        Export Statistics
      </button>

      <style jsx>{`
        .export-panel {
          padding: 1rem;
          border-top: 1px solid var(--border);
          margin-top: auto;
        }
        
        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 0.75rem 0;
        }
        
        .section-title i {
          color: var(--primary);
        }
        
        .format-buttons {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        
        .format-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 0.5rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .format-btn:hover:not(:disabled) {
          border-color: var(--primary);
          color: var(--text);
        }
        
        .format-btn.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }
        
        .format-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .export-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1rem;
          margin-bottom: 0.75rem;
        }
        
        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        
        .checkbox-row input[type="checkbox"] {
          width: 14px;
          height: 14px;
          accent-color: var(--primary);
          cursor: pointer;
        }
        
        .checkbox-row input[type="checkbox"]:disabled {
          cursor: not-allowed;
        }
        
        .checkbox-row label {
          font-size: 0.75rem;
          color: var(--text);
          cursor: pointer;
        }
        
        .export-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
          background: var(--primary);
          border: none;
          border-radius: var(--radius-md);
          color: white;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .export-btn:hover:not(:disabled) {
          background: var(--primary-hover);
        }
        
        .export-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
