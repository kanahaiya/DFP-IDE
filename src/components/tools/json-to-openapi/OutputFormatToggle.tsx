'use client';

import { useOpenAPIStore } from '@/store/openapi';
import type { OutputFormat } from '@/types';

/**
 * Toggle between YAML and JSON output formats
 */
export function OutputFormatToggle() {
  const { outputFormat, setOutputFormat } = useOpenAPIStore();

  const formats: { value: OutputFormat; label: string; icon: string }[] = [
    { value: 'yaml', label: 'YAML', icon: 'fa-file-code' },
    { value: 'json', label: 'JSON', icon: 'fa-brackets-curly' },
  ];

  return (
    <div className="format-toggle">
      {formats.map((format) => (
        <button
          key={format.value}
          className={outputFormat === format.value ? 'active' : ''}
          onClick={() => setOutputFormat(format.value)}
          title={`Switch to ${format.label} format`}
        >
          {format.label}
        </button>
      ))}
    </div>
  );
}
