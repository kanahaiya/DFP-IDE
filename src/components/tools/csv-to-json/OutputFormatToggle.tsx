'use client';

import { useCSVStore, type CSVOutputFormat } from '@/store/csv';

/**
 * Toggle component for selecting JSON output format
 */
export function OutputFormatToggle() {
  const { settings, updateSettings } = useCSVStore();

  const formats: Array<{ value: CSVOutputFormat; label: string; description: string; icon: string }> = [
    {
      value: 'array',
      label: 'Array of Objects',
      description: 'Standard JSON array with objects',
      icon: 'fas fa-list',
    },
    {
      value: 'keyed',
      label: 'Keyed Object',
      description: 'Object with first column as keys',
      icon: 'fas fa-key',
    },
    {
      value: 'columns',
      label: 'Column Arrays',
      description: 'Group values by column names',
      icon: 'fas fa-columns',
    },
    {
      value: 'nested',
      label: 'Nested JSON',
      description: 'Support dot notation (e.g., "address.city")',
      icon: 'fas fa-sitemap',
    },
  ];

  const handleFormatChange = (format: CSVOutputFormat) => {
    updateSettings({ outputFormat: format });
  };

  return (
    <div className="settings-panel-content">
      {/* JSON Format */}
      <div className="settings-group">
        <h3><i className="fas fa-code"></i> JSON Format</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
          {formats.map((format) => (
            <button
              key={format.value}
              className={`btn ${
                settings.outputFormat === format.value ? 'btn-primary' : 'btn-secondary'
              }`}
              onClick={() => handleFormatChange(format.value)}
              title={format.description}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                fontSize: '0.75rem',
                textAlign: 'center',
                height: 'auto',
                minHeight: '70px',
              }}
            >
              <i className={format.icon} style={{ fontSize: '1.25rem' }}></i>
              <span>{format.label}</span>
            </button>
          ))}
        </div>
        
        <div style={{
          padding: '0.75rem',
          background: 'var(--elevated)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
        }}>
          <i className="fas fa-info-circle" style={{ marginTop: '0.15rem', color: 'var(--primary)' }}></i>
          <span>
            {formats.find(f => f.value === settings.outputFormat)?.description}
          </span>
        </div>
      </div>
    </div>
  );
}
