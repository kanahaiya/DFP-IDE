'use client';

import React from 'react';
import type { TypeScriptGeneratorSettings } from '@/lib/typescript/types';

interface TypeScriptAdvancedPanelProps {
  settings: TypeScriptGeneratorSettings;
  updateSettings: (updates: Partial<TypeScriptGeneratorSettings>) => void;
}

export function TypeScriptAdvancedPanel({ settings, updateSettings }: TypeScriptAdvancedPanelProps) {
  return (
    <div className="settings-panel">
      <h3 className="settings-section-title">Documentation</h3>

      {/* Generate JSDoc */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="generateJSDoc"
          checked={settings.generateJSDoc}
          onChange={(e) => updateSettings({ generateJSDoc: e.target.checked })}
        />
        <label htmlFor="generateJSDoc">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Generate JSDoc Comments</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Add documentation comments to types</span>
          </div>
        </label>
      </div>

      {/* Include Examples */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="includeExamples"
          checked={settings.includeExamples}
          onChange={(e) => updateSettings({ includeExamples: e.target.checked })}
        />
        <label htmlFor="includeExamples">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Include Examples</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Add @example annotations with values</span>
          </div>
        </label>
      </div>

      <h3 className="settings-section-title" style={{ marginTop: '1.5rem' }}>Type Generation</h3>

      {/* Use Type Keyword */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="useTypeKeyword"
          checked={settings.useTypeKeyword}
          onChange={(e) => updateSettings({ useTypeKeyword: e.target.checked })}
        />
        <label htmlFor="useTypeKeyword">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Use Type Keyword</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Use &apos;type&apos; instead of &apos;interface&apos;</span>
          </div>
        </label>
      </div>

      {/* Generate Enums */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="generateEnums"
          checked={settings.generateEnums}
          onChange={(e) => updateSettings({ generateEnums: e.target.checked })}
        />
        <label htmlFor="generateEnums">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Generate Enums</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Create enums for repeated string values</span>
          </div>
        </label>
      </div>

      {/* Inline Nested Types */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="inlineNestedTypes"
          checked={settings.inlineNestedTypes}
          onChange={(e) => updateSettings({ inlineNestedTypes: e.target.checked })}
        />
        <label htmlFor="inlineNestedTypes">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Inline Nested Types</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Inline nested objects instead of separate types</span>
          </div>
        </label>
      </div>

      {/* Index Signature */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="addIndexSignature"
          checked={settings.addIndexSignature}
          onChange={(e) => updateSettings({ addIndexSignature: e.target.checked })}
        />
        <label htmlFor="addIndexSignature">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Add Index Signature</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Add [key: string]: unknown to interfaces</span>
          </div>
        </label>
      </div>
    </div>
  );
}
