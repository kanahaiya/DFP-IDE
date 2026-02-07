'use client';

import React from 'react';
import type { SchemaFormat, SchemaFormatInfo } from '@/lib/schema-generator/types';

interface SchemaFormatPanelProps {
  formats: SchemaFormatInfo[];
  selectedFormat: SchemaFormat;
  onSelectFormat: (format: SchemaFormat) => void;
}

export function SchemaFormatPanel({ formats, selectedFormat, onSelectFormat }: SchemaFormatPanelProps) {
  // Group formats by category
  const jsonSchemaFormats = formats.filter(f => f.id.startsWith('json-schema'));
  const typescriptFormats = formats.filter(f => f.id.startsWith('typescript'));
  const validationFormats = formats.filter(f => ['zod', 'yup'].includes(f.id));
  const otherFormats = formats.filter(f => 
    !f.id.startsWith('json-schema') && 
    !f.id.startsWith('typescript') && 
    !['zod', 'yup'].includes(f.id)
  );

  const renderFormatGroup = (title: string, groupFormats: SchemaFormatInfo[]) => (
    <div className="settings-group" style={{ marginBottom: '1.5rem' }}>
      <h4 style={{ 
        fontSize: '0.7rem', 
        fontWeight: 600, 
        color: 'var(--text-tertiary)', 
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>{title}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {groupFormats.map((format) => (
          <button
            key={format.id}
            className={`settings-option ${selectedFormat === format.id ? 'active' : ''}`}
            onClick={() => onSelectFormat(format.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              background: selectedFormat === format.id ? 'var(--primary-subtle)' : 'var(--elevated)',
              border: `1px solid ${selectedFormat === format.id ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.15s',
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--primary-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--primary)',
              flexShrink: 0,
              fontSize: '0.875rem'
            }}>
              <i className={`fas ${format.icon}`}></i>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.125rem', minWidth: 0 }}>
              <span style={{ fontWeight: 500, fontSize: '0.85rem', color: 'var(--text)' }}>{format.name}</span>
              <span style={{ 
                fontSize: '0.75rem', 
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>{format.description}</span>
            </div>
            {selectedFormat === format.id && (
              <div style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>
                <i className="fas fa-check"></i>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="settings-panel">
      <div className="settings-group">
        <h3><i className="fas fa-file-code"></i> Output Format</h3>
      </div>

      {renderFormatGroup('JSON Schema', jsonSchemaFormats)}
      {renderFormatGroup('TypeScript', typescriptFormats)}
      {renderFormatGroup('Validation Libraries', validationFormats)}
      {renderFormatGroup('Other Languages', otherFormats)}
    </div>
  );
}
