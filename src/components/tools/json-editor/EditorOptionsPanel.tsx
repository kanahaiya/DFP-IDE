'use client';

import React from 'react';
import type { EditorSettings } from '@/lib/json-editor/types';

interface EditorOptionsPanelProps {
  settings: EditorSettings;
  onSettingsChange: (settings: Partial<EditorSettings>) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export function EditorOptionsPanel({
  settings,
  onSettingsChange,
  isExpanded,
  onToggle,
}: EditorOptionsPanelProps) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', overflow: 'hidden' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-cog" style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: 500, color: 'var(--text)' }}>Display Options</span>
        </div>
        <i 
          className="fas fa-chevron-down" 
          style={{ 
            transition: 'transform 0.2s',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'var(--text-secondary)'
          }} 
        />
      </button>

      {isExpanded && (
        <div style={{ padding: '0 1rem 1rem 1rem', borderTop: '1px solid var(--border)' }}>
          {/* Indent size */}
          <div style={{ paddingTop: '1rem', marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)', marginBottom: '0.5rem' }}>
              Indent Size
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {[2, 4].map((size) => (
                <button
                  key={size}
                  onClick={() => onSettingsChange({ indentSize: size })}
                  style={{
                    padding: '0.375rem 0.75rem',
                    fontSize: '0.875rem',
                    fontFamily: 'monospace',
                    background: settings.indentSize === size ? 'var(--primary-subtle)' : 'var(--elevated)',
                    color: settings.indentSize === size ? 'var(--primary)' : 'var(--text)',
                    border: settings.indentSize === size ? '1px solid var(--primary)' : '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (settings.indentSize !== size) {
                      e.currentTarget.style.background = 'var(--hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (settings.indentSize !== size) {
                      e.currentTarget.style.background = 'var(--elevated)';
                    }
                  }}
                >
                  {size} spaces
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <ToggleOption
              label="Show Type Icons"
              description="Display type icons next to values"
              checked={settings.showTypes}
              onChange={(checked) => onSettingsChange({ showTypes: checked })}
            />
            
            <ToggleOption
              label="Show Path"
              description="Display path breadcrumb"
              checked={settings.showPath}
              onChange={(checked) => onSettingsChange({ showPath: checked })}
            />
            
            <ToggleOption
              label="Show Line Numbers"
              description="Show line numbers in code view"
              checked={settings.showLineNumbers}
              onChange={(checked) => onSettingsChange({ showLineNumbers: checked })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface EditorAdvancedPanelProps {
  settings: EditorSettings;
  onSettingsChange: (settings: Partial<EditorSettings>) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export function EditorAdvancedPanel({
  settings,
  onSettingsChange,
  isExpanded,
  onToggle,
}: EditorAdvancedPanelProps) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', overflow: 'hidden' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-sliders-h" style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: 500, color: 'var(--text)' }}>Advanced Settings</span>
        </div>
        <i 
          className="fas fa-chevron-down" 
          style={{ 
            transition: 'transform 0.2s',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'var(--text-secondary)'
          }} 
        />
      </button>

      {isExpanded && (
        <div style={{ padding: '0 1rem 1rem 1rem', borderTop: '1px solid var(--border)' }}>
          {/* Parse Mode */}
          <div style={{ paddingTop: '1rem', marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)', marginBottom: '0.5rem' }}>
              Parse Mode
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => onSettingsChange({ parseMode: 'strict' })}
                style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem',
                  background: settings.parseMode === 'strict' ? 'var(--primary-subtle)' : 'var(--elevated)',
                  color: settings.parseMode === 'strict' ? 'var(--primary)' : 'var(--text)',
                  border: settings.parseMode === 'strict' ? '1px solid var(--primary)' : '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (settings.parseMode !== 'strict') {
                    e.currentTarget.style.background = 'var(--hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (settings.parseMode !== 'strict') {
                    e.currentTarget.style.background = 'var(--elevated)';
                  }
                }}
              >
                <i className="fas fa-shield-alt" style={{ marginRight: '0.5rem' }} />
                Strict
              </button>
              <button
                onClick={() => onSettingsChange({ parseMode: 'lenient' })}
                style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem',
                  background: settings.parseMode === 'lenient' ? 'var(--primary-subtle)' : 'var(--elevated)',
                  color: settings.parseMode === 'lenient' ? 'var(--primary)' : 'var(--text)',
                  border: settings.parseMode === 'lenient' ? '1px solid var(--primary)' : '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (settings.parseMode !== 'lenient') {
                    e.currentTarget.style.background = 'var(--hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (settings.parseMode !== 'lenient') {
                    e.currentTarget.style.background = 'var(--elevated)';
                  }
                }}
              >
                <i className="fas fa-feather" style={{ marginRight: '0.5rem' }} />
                Lenient
              </button>
            </div>
            <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {settings.parseMode === 'strict' 
                ? 'RFC 8259 compliant JSON parsing'
                : 'Allows comments and trailing commas (JSON5)'
              }
            </p>
          </div>

          {/* Lenient mode options */}
          {settings.parseMode === 'lenient' && (
            <div style={{ paddingLeft: '1rem', borderLeft: '2px solid var(--border)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <ToggleOption
                  label="Allow Comments"
                  description="Support // and /* */ comments"
                  checked={settings.allowComments}
                  onChange={(checked) => onSettingsChange({ allowComments: checked })}
                />
                
                <ToggleOption
                  label="Allow Trailing Commas"
                  description="Accept trailing commas in objects/arrays"
                  checked={settings.allowTrailingCommas}
                  onChange={(checked) => onSettingsChange({ allowTrailingCommas: checked })}
                />
              </div>
            </div>
          )}

          {/* Behavior toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem', marginBottom: '1rem' }}>
            <ToggleOption
              label="Auto Validate"
              description="Validate JSON as you type"
              checked={settings.autoValidate}
              onChange={(checked) => onSettingsChange({ autoValidate: checked })}
            />
            
            <ToggleOption
              label="Confirm Delete"
              description="Ask before deleting nodes"
              checked={settings.confirmDelete}
              onChange={(checked) => onSettingsChange({ confirmDelete: checked })}
            />
          </div>

          {/* History size */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)', marginBottom: '0.5rem' }}>
              History Size: {settings.maxHistorySize} actions
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={settings.maxHistorySize}
              onChange={(e) => onSettingsChange({ maxHistorySize: parseInt(e.target.value) })}
              style={{
                width: '100%',
                height: '0.5rem',
                appearance: 'none',
                cursor: 'pointer',
                accentColor: 'var(--primary)',
                background: 'var(--elevated)',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              <span>10</span>
              <span>100</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ToggleOptionProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleOption({ label, description, checked, onChange }: ToggleOptionProps) {
  return (
    <label 
      style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: '0.75rem', 
        cursor: 'pointer' 
      }}
    >
      <div style={{ position: 'relative', marginTop: '0.125rem' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={{ 
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            borderWidth: 0,
          }}
        />
        <div style={{ 
          width: '2.25rem', 
          height: '1.25rem', 
          background: checked ? 'var(--primary)' : 'var(--elevated)',
          borderRadius: '9999px',
          transition: 'background 0.2s',
        }} />
        <div style={{ 
          position: 'absolute', 
          top: '0.125rem', 
          left: '0.125rem', 
          width: '1rem', 
          height: '1rem', 
          background: 'white',
          borderRadius: '9999px',
          transition: 'transform 0.2s',
          transform: checked ? 'translateX(1rem)' : 'translateX(0)',
        }} />
      </div>
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>{label}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{description}</div>
      </div>
    </label>
  );
}
