'use client';

import React from 'react';
import type { ProtobufGeneratorSettings } from '@/lib/protobuf/types';

interface ProtobufOptionsPanelProps {
  settings: ProtobufGeneratorSettings;
  onUpdateSettings: (settings: Partial<ProtobufGeneratorSettings>) => void;
  onReset: () => void;
}

export function ProtobufOptionsPanel({
  settings,
  onUpdateSettings,
  onReset,
}: ProtobufOptionsPanelProps) {
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
        {/* Syntax Version */}
        <div className="setting-group">
          <label className="setting-label">Syntax Version</label>
          <div className="setting-options">
            <label className="radio-label">
              <input
                type="radio"
                name="syntax"
                checked={settings.syntax === 'proto3'}
                onChange={() => onUpdateSettings({ syntax: 'proto3' })}
              />
              <span>Proto3</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="syntax"
                checked={settings.syntax === 'proto2'}
                onChange={() => onUpdateSettings({ syntax: 'proto2' })}
              />
              <span>Proto2</span>
            </label>
          </div>
        </div>

        {/* Package Name */}
        <div className="setting-group">
          <label className="setting-label">Package Name</label>
          <input
            type="text"
            className="setting-input"
            value={settings.packageName}
            onChange={(e) => onUpdateSettings({ packageName: e.target.value })}
            placeholder="e.g., com.example.api"
          />
        </div>

        {/* Root Message Name */}
        <div className="setting-group">
          <label className="setting-label">Root Message Name</label>
          <input
            type="text"
            className="setting-input"
            value={settings.rootMessageName}
            onChange={(e) => onUpdateSettings({ rootMessageName: e.target.value })}
            placeholder="e.g., Root, Request, Response"
          />
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

        {/* Include JSON Name */}
        <div className="setting-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.includeJsonName}
              onChange={(e) => onUpdateSettings({ includeJsonName: e.target.checked })}
            />
            <span>Include json_name option</span>
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
            <span>Use optional for null values</span>
          </label>
        </div>

        {/* Int64 for Large Numbers */}
        <div className="setting-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.inferInt64ForLargeNumbers}
              onChange={(e) => onUpdateSettings({ inferInt64ForLargeNumbers: e.target.checked })}
            />
            <span>Use int64 for large numbers</span>
          </label>
        </div>

        {/* Generate Comments */}
        <div className="setting-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.generateComments}
              onChange={(e) => onUpdateSettings({ generateComments: e.target.checked })}
            />
            <span>Generate comments</span>
          </label>
        </div>

        {/* Sort Fields */}
        <div className="setting-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.sortFields}
              onChange={(e) => onUpdateSettings({ sortFields: e.target.checked })}
            />
            <span>Sort fields alphabetically</span>
          </label>
        </div>

        {/* Indentation */}
        <div className="setting-group">
          <label className="setting-label">Indentation</label>
          <select
            className="setting-select"
            value={settings.indentation}
            onChange={(e) => onUpdateSettings({ indentation: parseInt(e.target.value) })}
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </div>
      </div>
    </div>
  );
}
