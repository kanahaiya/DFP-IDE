'use client';

import React from 'react';
import type { ElmGeneratorSettings } from '@/lib/elm/types';

interface ElmDecoderPanelProps {
  settings: ElmGeneratorSettings;
  updateSettings: (settings: Partial<ElmGeneratorSettings>) => void;
}

export function ElmDecoderPanel({ settings, updateSettings }: ElmDecoderPanelProps) {
  const decodersEnabled = settings.outputMode === 'with-decoders' || settings.outputMode === 'full';
  
  return (
    <div className="settings-panel">
      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-download"></i> Decoder Style</h3>
        {!decodersEnabled && (
          <p className="setting-hint">Enable decoders in Output tab to configure decoder options</p>
        )}
        <div className="setting-group">
          <label className={`radio-card ${settings.usePipeline ? 'selected' : ''}`}>
            <input type="radio" name="decoderStyle" checked={settings.usePipeline} onChange={() => updateSettings({ usePipeline: true })} disabled={!decodersEnabled} />
            <div className="radio-card-content">
              <span className="radio-card-label">Pipeline Style</span>
              <span className="radio-card-description">Uses Json.Decode.Pipeline</span>
            </div>
          </label>
          <label className={`radio-card ${!settings.usePipeline ? 'selected' : ''}`}>
            <input type="radio" name="decoderStyle" checked={!settings.usePipeline} onChange={() => updateSettings({ usePipeline: false })} disabled={!decodersEnabled} />
            <div className="radio-card-content">
              <span className="radio-card-label">MapN Style</span>
              <span className="radio-card-description">Uses Decode.mapN (no deps)</span>
            </div>
          </label>
        </div>
      </div>

      {settings.usePipeline && decodersEnabled && (
        <div className="settings-section">
          <h3 className="settings-section-title"><i className="fas fa-info-circle"></i> Required Package</h3>
          <div className="setting-hint">
            <code>elm install NoRedInk/elm-json-decode-pipeline</code>
          </div>
        </div>
      )}
    </div>
  );
}
