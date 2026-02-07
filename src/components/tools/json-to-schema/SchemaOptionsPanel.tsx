'use client';

import React from 'react';
import type { SchemaGeneratorSettings } from '@/lib/schema-generator/types';

interface SchemaOptionsPanelProps {
  settings: SchemaGeneratorSettings;
  updateSettings: (settings: Partial<SchemaGeneratorSettings>) => void;
}

export function SchemaOptionsPanel({ settings, updateSettings }: SchemaOptionsPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-group">
        <h3><i className="fas fa-sliders-h"></i> Generation Options</h3>
        
        {/* Root Name */}
        <div className="form-row">
          <label htmlFor="rootName">
            <i className="fas fa-tag" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Root Name
          </label>
          <input
            type="text"
            id="rootName"
            value={settings.rootName}
            onChange={(e) => updateSettings({ rootName: e.target.value })}
            placeholder="Root"
          />
          <span className="form-hint">Name for the root type/interface</span>
        </div>

        {/* Required Fields */}
        <div className="form-row">
          <label>
            <i className="fas fa-asterisk" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Required Fields
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="required"
                checked={!settings.makeAllRequired && !settings.makeAllOptional}
                onChange={() => updateSettings({ makeAllRequired: false, makeAllOptional: false })}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span>Auto-detect</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="required"
                checked={settings.makeAllRequired}
                onChange={() => updateSettings({ makeAllRequired: true, makeAllOptional: false })}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span>All Required</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="required"
                checked={settings.makeAllOptional}
                onChange={() => updateSettings({ makeAllRequired: false, makeAllOptional: true })}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span>All Optional</span>
            </label>
          </div>
        </div>

        {/* Infer Formats */}
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="inferFormats"
            checked={settings.inferFormats}
            onChange={(e) => updateSettings({ inferFormats: e.target.checked })}
          />
          <label htmlFor="inferFormats">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Detect formats</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>✨ Auto-detect emails, URLs, UUIDs, dates</span>
            </div>
          </label>
        </div>

        {/* Sort Properties */}
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="sortProperties"
            checked={settings.sortProperties}
            onChange={(e) => updateSettings({ sortProperties: e.target.checked })}
          />
          <label htmlFor="sortProperties">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Sort properties</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>🔤 Alphabetically sort object properties</span>
            </div>
          </label>
        </div>

        {/* Add Descriptions */}
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="addDescriptions"
            checked={settings.addDescriptions}
            onChange={(e) => updateSettings({ addDescriptions: e.target.checked })}
          />
          <label htmlFor="addDescriptions">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Add descriptions</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>💬 Include description fields in schema</span>
            </div>
          </label>
        </div>

        {/* Indentation */}
        <div className="form-row">
          <label htmlFor="indentation">
            <i className="fas fa-indent" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Indentation
          </label>
          <select
            id="indentation"
            value={settings.indentation === 'tab' ? 'tab' : String(settings.indentation)}
            onChange={(e) =>
              updateSettings({
                indentation: e.target.value === 'tab' ? 'tab' : parseInt(e.target.value, 10),
              })
            }
          >
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="tab">Tab</option>
          </select>
          <span className="form-hint">⚙️ Controls spacing depth for output</span>
        </div>
      </div>
    </div>
  );
}
