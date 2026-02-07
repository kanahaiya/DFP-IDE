'use client';

import React from 'react';
import type { AvroGeneratorSettings } from '@/lib/avro/types';

interface AvroOptionsPanelProps {
  settings: AvroGeneratorSettings;
  onUpdateSettings: (settings: Partial<AvroGeneratorSettings>) => void;
  onReset: () => void;
}

export function AvroOptionsPanel({
  settings,
  onUpdateSettings,
  onReset,
}: AvroOptionsPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-group">
        <div className="settings-group-header">
          <h3><i className="fas fa-cog"></i> Options</h3>
          <button className="btn btn-ghost btn-sm" onClick={onReset} title="Reset to defaults">
            <i className="fas fa-undo"></i>
          </button>
        </div>
        
        {/* Namespace */}
        <div className="form-row">
          <label htmlFor="namespace">Namespace</label>
          <input
            id="namespace"
            type="text"
            value={settings.namespace}
            onChange={(e) => onUpdateSettings({ namespace: e.target.value })}
            placeholder="e.g., com.example.events"
          />
        </div>

        {/* Root Record Name */}
        <div className="form-row">
          <label htmlFor="rootRecordName">Root Record Name</label>
          <input
            id="rootRecordName"
            type="text"
            value={settings.rootRecordName}
            onChange={(e) => onUpdateSettings({ rootRecordName: e.target.value })}
            placeholder="e.g., Event, User, Record"
          />
        </div>

        {/* Field Naming */}
        <div className="checkbox-row">
          <input
            id="useSnakeCase"
            type="checkbox"
            checked={settings.useSnakeCase}
            onChange={(e) => onUpdateSettings({ useSnakeCase: e.target.checked })}
          />
          <label htmlFor="useSnakeCase">Convert fields to snake_case</label>
        </div>

        {/* Infer Logical Types */}
        <div className="checkbox-row">
          <input
            id="inferLogicalTypes"
            type="checkbox"
            checked={settings.inferLogicalTypes}
            onChange={(e) => onUpdateSettings({ inferLogicalTypes: e.target.checked })}
          />
          <label htmlFor="inferLogicalTypes">Infer logical types (date, timestamp, uuid)</label>
        </div>

        {/* Union for Nullable */}
        <div className="checkbox-row">
          <input
            id="useUnionForNullable"
            type="checkbox"
            checked={settings.useUnionForNullable}
            onChange={(e) => onUpdateSettings({ useUnionForNullable: e.target.checked })}
          />
          <label htmlFor="useUnionForNullable">Use union types for nullable fields</label>
        </div>

        {/* Include Defaults */}
        <div className="checkbox-row">
          <input
            id="includeDefaults"
            type="checkbox"
            checked={settings.includeDefaults}
            onChange={(e) => onUpdateSettings({ includeDefaults: e.target.checked })}
          />
          <label htmlFor="includeDefaults">Include default values</label>
        </div>

        {/* Generate Documentation */}
        <div className="checkbox-row">
          <input
            id="generateDoc"
            type="checkbox"
            checked={settings.generateDoc}
            onChange={(e) => onUpdateSettings({ generateDoc: e.target.checked })}
          />
          <label htmlFor="generateDoc">Generate documentation</label>
        </div>

        {/* Indentation */}
        <div className="form-row">
          <label htmlFor="indentation">Indentation</label>
          <select
            id="indentation"
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
