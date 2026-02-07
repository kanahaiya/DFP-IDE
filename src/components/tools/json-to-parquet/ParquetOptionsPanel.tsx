'use client';

import React from 'react';
import type { ParquetGeneratorSettings, ParquetCompression } from '@/lib/parquet/types';

interface ParquetOptionsPanelProps {
  settings: ParquetGeneratorSettings;
  onUpdateSettings: (settings: Partial<ParquetGeneratorSettings>) => void;
  onReset: () => void;
}

const COMPRESSION_OPTIONS: { value: ParquetCompression; label: string }[] = [
  { value: 'SNAPPY', label: 'Snappy (fast)' },
  { value: 'GZIP', label: 'GZIP (high ratio)' },
  { value: 'LZ4', label: 'LZ4 (balanced)' },
  { value: 'ZSTD', label: 'ZSTD (best ratio)' },
  { value: 'UNCOMPRESSED', label: 'Uncompressed' },
];

export function ParquetOptionsPanel({
  settings,
  onUpdateSettings,
  onReset,
}: ParquetOptionsPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h3 className="settings-title">
          <i className="fas fa-cog"></i>
          Options
        </h3>
        <button className="btn btn-ghost btn-sm" onClick={onReset} title="Reset to defaults">
          <i className="fas fa-undo"></i>
        </button>
      </div>

      <div className="settings-content">
        {/* Root Name */}
        <div className="setting-group">
          <label className="setting-label">Root Name</label>
          <input
            type="text"
            className="setting-input"
            value={settings.rootName}
            onChange={(e) => onUpdateSettings({ rootName: e.target.value })}
            placeholder="e.g., root, table, schema"
          />
        </div>

        {/* Compression */}
        <div className="setting-group">
          <label className="setting-label">Compression</label>
          <select
            className="setting-select"
            value={settings.compression}
            onChange={(e) =>
              onUpdateSettings({ compression: e.target.value as ParquetCompression })
            }
          >
            {COMPRESSION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Row Group Size */}
        <div className="setting-group">
          <label className="setting-label">Row Group Size</label>
          <select
            className="setting-select"
            value={settings.rowGroupSize}
            onChange={(e) => onUpdateSettings({ rowGroupSize: parseInt(e.target.value) })}
          >
            <option value={10000}>10,000 rows</option>
            <option value={100000}>100,000 rows</option>
            <option value={1000000}>1,000,000 rows</option>
            <option value={134217728}>128 MB (Spark default)</option>
          </select>
        </div>

        {/* Field Naming */}
        <div className="setting-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.useSnakeCase}
              onChange={(e) => onUpdateSettings({ useSnakeCase: e.target.checked })}
            />
            <span>Convert fields to snake_case</span>
          </label>
        </div>

        {/* Infer Logical Types */}
        <div className="setting-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.inferLogicalTypes}
              onChange={(e) => onUpdateSettings({ inferLogicalTypes: e.target.checked })}
            />
            <span>Infer logical types (date, timestamp)</span>
          </label>
        </div>

        {/* Optional for Nullable */}
        <div className="setting-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.useOptionalForNullable}
              onChange={(e) => onUpdateSettings({ useOptionalForNullable: e.target.checked })}
            />
            <span>Use OPTIONAL for nullable fields</span>
          </label>
        </div>

        {/* Dictionary Encoding */}
        <div className="setting-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.useDictionaryEncoding}
              onChange={(e) => onUpdateSettings({ useDictionaryEncoding: e.target.checked })}
            />
            <span>Use dictionary encoding</span>
          </label>
        </div>
      </div>
    </div>
  );
}
