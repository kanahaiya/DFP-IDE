'use client';

import React from 'react';
import type { ExcelExportSettings, ExcelFormat } from '@/lib/excel/types';

interface ExcelOptionsPanelProps {
  settings: ExcelExportSettings;
  onUpdateSettings: (updates: Partial<ExcelExportSettings>) => void;
}

export function ExcelOptionsPanel({
  settings,
  onUpdateSettings,
}: ExcelOptionsPanelProps) {
  const formatOptions: { value: ExcelFormat; label: string; icon: string }[] = [
    { value: 'xlsx', label: 'XLSX', icon: 'fas fa-file-excel' },
    { value: 'xls', label: 'XLS', icon: 'fas fa-file-excel' },
    { value: 'csv', label: 'CSV', icon: 'fas fa-file-csv' },
  ];

  return (
    <div className="excel-options-panel">
      {/* File Format */}
      <div className="option-group">
        <label className="option-label">
          <i className="fas fa-file"></i>
          File Format
        </label>
        <div className="button-group">
          {formatOptions.map((opt) => (
            <button
              key={opt.value}
              className={`option-btn ${settings.format === opt.value ? 'active' : ''}`}
              onClick={() => onUpdateSettings({ format: opt.value })}
            >
              <i className={opt.icon}></i>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filename */}
      <div className="option-group">
        <label className="option-label">
          <i className="fas fa-tag"></i>
          Filename
        </label>
        <div className="input-with-suffix">
          <input
            type="text"
            value={settings.filename}
            onChange={(e) => onUpdateSettings({ filename: e.target.value })}
            placeholder="data"
          />
          <span className="suffix">.{settings.format}</span>
        </div>
      </div>

      {/* Sheet Name (only for Excel formats) */}
      {settings.format !== 'csv' && (
        <div className="option-group">
          <label className="option-label">
            <i className="fas fa-table"></i>
            Sheet Name
          </label>
          <input
            type="text"
            value={settings.sheetName}
            onChange={(e) => onUpdateSettings({ sheetName: e.target.value })}
            placeholder="Sheet1"
            maxLength={31}
          />
        </div>
      )}

      {/* Headers */}
      <div className="option-group">
        <label className="option-toggle">
          <input
            type="checkbox"
            checked={settings.includeHeaders}
            onChange={(e) => onUpdateSettings({ includeHeaders: e.target.checked })}
          />
          <span className="toggle-slider"></span>
          <span className="toggle-label">
            <i className="fas fa-heading"></i>
            Include Headers
          </span>
        </label>
      </div>

      {/* Flatten Nested */}
      <div className="option-group">
        <label className="option-toggle">
          <input
            type="checkbox"
            checked={settings.flattenNested}
            onChange={(e) => onUpdateSettings({ flattenNested: e.target.checked })}
          />
          <span className="toggle-slider"></span>
          <span className="toggle-label">
            <i className="fas fa-layer-group"></i>
            Flatten Nested Objects
          </span>
        </label>
        {settings.flattenNested && (
          <div className="nested-option">
            <label className="small-label">Max Depth</label>
            <select
              value={settings.flattenDepth}
              onChange={(e) => onUpdateSettings({ flattenDepth: Number(e.target.value) })}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <option key={n} value={n}>{n} level{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Excel Formatting Options (only for Excel formats) */}
      {settings.format !== 'csv' && (
        <>
          <div className="section-divider">
            <span>Excel Formatting</span>
          </div>

          <div className="option-group">
            <label className="option-toggle">
              <input
                type="checkbox"
                checked={settings.autoFitColumns}
                onChange={(e) => onUpdateSettings({ autoFitColumns: e.target.checked })}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">
                <i className="fas fa-text-width"></i>
                Auto-fit Column Widths
              </span>
            </label>
          </div>

          <div className="option-group">
            <label className="option-toggle">
              <input
                type="checkbox"
                checked={settings.boldHeaders}
                onChange={(e) => onUpdateSettings({ boldHeaders: e.target.checked })}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">
                <i className="fas fa-bold"></i>
                Bold Headers
              </span>
            </label>
          </div>

          <div className="option-group">
            <label className="option-toggle">
              <input
                type="checkbox"
                checked={settings.freezeHeaders}
                onChange={(e) => onUpdateSettings({ freezeHeaders: e.target.checked })}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">
                <i className="fas fa-thumbtack"></i>
                Freeze Header Row
              </span>
            </label>
          </div>

          <div className="option-group">
            <label className="option-toggle">
              <input
                type="checkbox"
                checked={settings.enableAutoFilter}
                onChange={(e) => onUpdateSettings({ enableAutoFilter: e.target.checked })}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">
                <i className="fas fa-filter"></i>
                Enable Auto-Filter
              </span>
            </label>
          </div>
        </>
      )}

      <style jsx>{`
        .excel-options-panel {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
        }

        .option-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .option-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
        }

        .option-label i {
          color: var(--primary);
          width: 16px;
        }

        .button-group {
          display: flex;
          gap: 0.25rem;
        }

        .option-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.8rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .option-btn:hover {
          background: var(--card);
          color: var(--text);
        }

        .option-btn.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .input-with-suffix {
          display: flex;
          align-items: center;
        }

        .input-with-suffix input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid var(--border);
          border-right: none;
          border-radius: var(--radius-sm) 0 0 var(--radius-sm);
          background: var(--elevated);
          color: var(--text);
          font-size: 0.85rem;
        }

        .input-with-suffix input:focus {
          outline: none;
          border-color: var(--primary);
        }

        .suffix {
          padding: 0.5rem 0.75rem;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .option-group input[type="text"] {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background: var(--elevated);
          color: var(--text);
          font-size: 0.85rem;
        }

        .option-group input[type="text"]:focus {
          outline: none;
          border-color: var(--primary);
        }

        .option-toggle {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          user-select: none;
        }

        .option-toggle input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: relative;
          width: 36px;
          height: 20px;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: 10px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .toggle-slider::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 14px;
          height: 14px;
          background: var(--text-secondary);
          border-radius: 50%;
          transition: all 0.2s;
        }

        .option-toggle input:checked + .toggle-slider {
          background: var(--primary);
          border-color: var(--primary);
        }

        .option-toggle input:checked + .toggle-slider::after {
          transform: translateX(16px);
          background: white;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text);
        }

        .toggle-label i {
          color: var(--primary);
          width: 16px;
        }

        .nested-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: calc(36px + 0.75rem);
        }

        .small-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .nested-option select {
          padding: 0.25rem 0.5rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background: var(--elevated);
          color: var(--text);
          font-size: 0.8rem;
        }

        .section-divider {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0;
          color: var(--text-tertiary);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .section-divider::before,
        .section-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }
      `}</style>
    </div>
  );
}
