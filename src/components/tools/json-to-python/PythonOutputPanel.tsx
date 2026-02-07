'use client';

import React from 'react';
import type { PythonGeneratorSettings, PythonOutputFormat } from '@/lib/python/types';

interface PythonOutputPanelProps {
  settings: PythonGeneratorSettings;
  onSettingsChange: (settings: Partial<PythonGeneratorSettings>) => void;
}

export function PythonOutputPanel({ settings, onSettingsChange }: PythonOutputPanelProps) {
  const outputFormats: { value: PythonOutputFormat; label: string; description: string }[] = [
    { value: 'dataclass', label: 'Dataclass', description: '@dataclass decorator (Python 3.7+)' },
    { value: 'pydantic', label: 'Pydantic', description: 'BaseModel with validation' },
    { value: 'typeddict', label: 'TypedDict', description: 'Typed dictionary definition' },
    { value: 'namedtuple', label: 'NamedTuple', description: 'Typed named tuple' },
    { value: 'attrs', label: 'attrs', description: '@attr.s decorator' },
    { value: 'dict', label: 'Dictionary', description: 'Plain Python dictionary' },
  ];

  return (
    <div className="settings-panel-content sp-stack-lg">
      {/* Output Format */}
      <div className="settings-group">
        <label className="setting-label">Output Format</label>
        <div className="radio-group">
          {outputFormats.map((format) => (
            <label key={format.value} className="radio-option">
              <input
                type="radio"
                name="outputFormat"
                value={format.value}
                checked={settings.outputFormat === format.value}
                onChange={() => onSettingsChange({ outputFormat: format.value })}
              />
              <div className="radio-option-content">
                <span className="radio-option-label">{format.label}</span>
                <p className="radio-option-desc">{format.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
