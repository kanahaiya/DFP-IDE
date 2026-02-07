'use client';

import React from 'react';
import type { PythonGeneratorSettings } from '@/lib/python/types';

interface PythonOptionsPanelProps {
  settings: PythonGeneratorSettings;
  onSettingsChange: (settings: Partial<PythonGeneratorSettings>) => void;
}

export function PythonOptionsPanel({ settings, onSettingsChange }: PythonOptionsPanelProps) {
  return (
    <div className="settings-panel-content sp-stack-lg">
      {/* Dataclass Options */}
      {settings.outputFormat === 'dataclass' && (
        <div className="settings-group">
          <span className="settings-group-title">Dataclass Options</span>
          <div className="checkbox-group">
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={settings.dataclassFrozen}
                onChange={(e) => onSettingsChange({ dataclassFrozen: e.target.checked })}
              />
              <span className="checkbox-option-label">Frozen (immutable)</span>
            </label>

            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={settings.dataclassSlots}
                onChange={(e) => onSettingsChange({ dataclassSlots: e.target.checked })}
              />
              <span className="checkbox-option-label">Use __slots__ (Python 3.10+)</span>
            </label>

            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={settings.dataclassKwOnly}
                onChange={(e) => onSettingsChange({ dataclassKwOnly: e.target.checked })}
              />
              <span className="checkbox-option-label">Keyword-only arguments (Python 3.10+)</span>
            </label>
          </div>
        </div>
      )}

      {/* Pydantic Options */}
      {settings.outputFormat === 'pydantic' && (
        <div className="settings-group">
          <span className="settings-group-title">Pydantic Version</span>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="pydanticVersion"
                checked={settings.pydanticVersion === 'v2'}
                onChange={() => onSettingsChange({ pydanticVersion: 'v2' })}
              />
              <div className="radio-option-content">
                <span className="radio-option-label">Pydantic v2 (recommended)</span>
              </div>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="pydanticVersion"
                checked={settings.pydanticVersion === 'v1'}
                onChange={() => onSettingsChange({ pydanticVersion: 'v1' })}
              />
              <div className="radio-option-content">
                <span className="radio-option-label">Pydantic v1 (legacy)</span>
              </div>
            </label>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={settings.pydanticStrict}
                onChange={(e) => onSettingsChange({ pydanticStrict: e.target.checked })}
              />
              <span className="checkbox-option-label">Strict mode</span>
            </label>
          </div>
        </div>
      )}

      {/* Code Generation */}
      <div className="settings-group">
        <span className="settings-group-title">Code Generation</span>
        <div className="checkbox-group">
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.includeImports}
              onChange={(e) => onSettingsChange({ includeImports: e.target.checked })}
            />
            <span className="checkbox-option-label">Add import statements</span>
          </label>

          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.includeFromFuture}
              onChange={(e) => onSettingsChange({ includeFromFuture: e.target.checked })}
            />
            <span className="checkbox-option-label">Add &apos;from __future__ import annotations&apos;</span>
          </label>
        </div>
      </div>

      {/* Detection Options */}
      <div className="settings-group">
        <span className="settings-group-title">Type Detection</span>
        <div className="checkbox-group">
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.detectDatetime}
              onChange={(e) => onSettingsChange({ detectDatetime: e.target.checked })}
            />
            <span className="checkbox-option-label">Detect datetime strings</span>
          </label>

          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.detectUuid}
              onChange={(e) => onSettingsChange({ detectUuid: e.target.checked })}
            />
            <span className="checkbox-option-label">Detect UUID strings</span>
          </label>
        </div>
      </div>
    </div>
  );
}
