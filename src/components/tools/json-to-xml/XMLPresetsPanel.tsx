'use client';

import { useState } from 'react';
import { useXMLStore } from '@/store/xml';
import { XML_PRESETS } from '@/lib/xml/presets';
import { event as trackEvent } from '@/lib/analytics';

export function XMLPresetsPanel() {
  const { updateSettings } = useXMLStore();
  const [appliedPreset, setAppliedPreset] = useState<string | null>(null);

  const handlePresetClick = (presetId: string) => {
    const preset = XML_PRESETS.find(p => p.id === presetId);
    if (preset) {
      updateSettings(preset.settings);
      
      // Show feedback
      setAppliedPreset(presetId);
      setTimeout(() => setAppliedPreset(null), 2000);
      
      // Track preset selection
      trackEvent('xml_preset_applied', 'tool_usage', presetId);
    }
  };

  return (
    <div className="presets-panel">
      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ 
          fontSize: '0.875rem', 
          fontWeight: 600, 
          color: 'var(--primary)',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <i className="fas fa-magic"></i>
          Quick Presets
        </h4>
        <p style={{ 
          fontSize: '13px', 
          color: 'var(--text-secondary)', 
          lineHeight: 1.5,
          margin: 0
        }}>
          Apply pre-configured settings for common XML use cases
        </p>
      </div>
      
      <div className="presets-grid">
        {XML_PRESETS.map((preset) => (
          <button
            key={preset.id}
            className={`preset-card ${appliedPreset === preset.id ? 'preset-active' : ''}`}
            onClick={() => handlePresetClick(preset.id)}
            title={preset.description}
          >
            <i className={preset.icon} style={{ color: preset.iconColor }}></i>
            <span>{preset.name}</span>
            {appliedPreset === preset.id && (
              <i className="fas fa-check" style={{ 
                position: 'absolute', 
                top: '8px', 
                right: '8px', 
                color: 'var(--success)',
                fontSize: '12px'
              }}></i>
            )}
          </button>
        ))}
      </div>
      
      {appliedPreset && (
        <div style={{
          padding: '0.75rem',
          background: 'rgba(63, 185, 80, 0.15)',
          border: '1px solid rgba(63, 185, 80, 0.3)',
          borderRadius: '6px',
          color: 'var(--success)',
          fontSize: '13px',
          fontWeight: 500,
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <i className="fas fa-check-circle"></i>
          <span>
            {XML_PRESETS.find(p => p.id === appliedPreset)?.name} preset applied!
          </span>
        </div>
      )}
      
      <p className="presets-hint">
        <i className="fas fa-lightbulb" style={{ marginRight: '6px' }}></i>
        Hover over a preset to see its description
      </p>
    </div>
  );
}
