'use client';

import React from 'react';
import { ObjCGeneratorSettings } from '@/lib/objc/types';

interface ObjCPropertyPanelProps {
  settings: ObjCGeneratorSettings;
  onSettingsChange: (settings: Partial<ObjCGeneratorSettings>) => void;
}

export function ObjCPropertyPanel({ settings, onSettingsChange }: ObjCPropertyPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.useAtomicProperties}
            onChange={(e) => onSettingsChange({ useAtomicProperties: e.target.checked })}
          />
          <span>Atomic Properties</span>
        </label>
        <p className="settings-hint">Use atomic (thread-safe) property attributes</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.useReadonlyProperties}
            onChange={(e) => onSettingsChange({ useReadonlyProperties: e.target.checked })}
          />
          <span>Readonly Properties</span>
        </label>
        <p className="settings-hint">Generate readonly properties</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.useStrongReferences}
            onChange={(e) => onSettingsChange({ useStrongReferences: e.target.checked })}
          />
          <span>Strong References</span>
        </label>
        <p className="settings-hint">Use strong (instead of weak) references for objects</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.useNullabilityAnnotations}
            onChange={(e) => onSettingsChange({ useNullabilityAnnotations: e.target.checked })}
          />
          <span>Nullability Annotations</span>
        </label>
        <p className="settings-hint">Add nullable/nonnull annotations</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.useNonnullByDefault}
            onChange={(e) => onSettingsChange({ useNonnullByDefault: e.target.checked })}
          />
          <span>Nonnull by Default</span>
        </label>
        <p className="settings-hint">Assume nonnull unless specified</p>
      </div>
    </div>
  );
}
