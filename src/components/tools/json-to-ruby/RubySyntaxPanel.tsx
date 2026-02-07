'use client';

import React from 'react';
import type { RubyGeneratorSettings, RubyHashSyntax } from '@/lib/ruby/types';

interface RubySyntaxPanelProps {
  settings: RubyGeneratorSettings;
  updateSettings: (settings: Partial<RubyGeneratorSettings>) => void;
}

const HASH_SYNTAXES: { value: RubyHashSyntax; label: string; example: string }[] = [
  { value: 'symbols', label: 'Symbol Keys', example: 'key: value' },
  { value: 'rockets', label: 'Hashrockets', example: ':key => value' },
  { value: 'strings', label: 'String Keys', example: '"key" => value' },
  { value: 'mixed', label: 'Mixed', example: 'Auto-select based on key' },
];

export function RubySyntaxPanel({ settings, updateSettings }: RubySyntaxPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-hashtag"></i> Hash Syntax</h3>
        <div className="setting-group">
          {HASH_SYNTAXES.map((syntax) => (
            <label key={syntax.value} className={`radio-card ${settings.hashSyntax === syntax.value ? 'selected' : ''}`}>
              <input type="radio" name="hashSyntax" checked={settings.hashSyntax === syntax.value} onChange={() => updateSettings({ hashSyntax: syntax.value })} />
              <div className="radio-card-content">
                <span className="radio-card-label">{syntax.label}</span>
                <span className="radio-card-description"><code>{syntax.example}</code></span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-quote-right"></i> String Quotes</h3>
        <div className="setting-group">
          <label className={`radio-card compact ${settings.stringQuote === 'single' ? 'selected' : ''}`}>
            <input type="radio" name="stringQuote" checked={settings.stringQuote === 'single'} onChange={() => updateSettings({ stringQuote: 'single' })} />
            <div className="radio-card-content">
              <span className="radio-card-label">Single quotes</span>
              <span className="radio-card-description"><code>&apos;string&apos;</code></span>
            </div>
          </label>
          <label className={`radio-card compact ${settings.stringQuote === 'double' ? 'selected' : ''}`}>
            <input type="radio" name="stringQuote" checked={settings.stringQuote === 'double'} onChange={() => updateSettings({ stringQuote: 'double' })} />
            <div className="radio-card-content">
              <span className="radio-card-label">Double quotes</span>
              <span className="radio-card-description"><code>&quot;string&quot;</code></span>
            </div>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-align-left"></i> Indentation</h3>
        <div className="setting-group">
          <label className="setting-label">Indent Spaces</label>
          <select className="setting-select" value={settings.indentSpaces} onChange={(e) => updateSettings({ indentSpaces: parseInt(e.target.value) })}>
            <option value="2">2 spaces (Ruby standard)</option>
            <option value="4">4 spaces</option>
          </select>
        </div>
      </div>
    </div>
  );
}
