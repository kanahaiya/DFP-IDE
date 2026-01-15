'use client';

import React from 'react';
import { Change, DiffStats } from '@/lib/json-diff/diffEngine';
import { generateJSONPatch, generateDelta, generateUnifiedDiff, generateHTMLReport, generateCSV } from '@/lib/json-diff/exportFormats';
import { downloadTextFile } from '@/lib/fileUtils';
import { useToast } from '@/store/toast';
import { trackDownload } from '@/lib/analytics';
import { useTheme } from '@/hooks/useTheme';

interface ExportOptionsProps {
  changes: Change[];
  stats: DiffStats | null;
  leftJSON: string;
  rightJSON: string;
}

export function ExportOptions({ changes, stats, leftJSON, rightJSON }: ExportOptionsProps) {
  const toast = useToast();
  const { theme } = useTheme();
  
  const handleExport = (format: string) => {
    if (changes.length === 0) {
      toast.error('No changes to export');
      return;
    }
    
    try {
      let content = '';
      let filename = '';
      let mimeType = 'text/plain';
      
      switch (format) {
        case 'json-patch':
          content = JSON.stringify(generateJSONPatch(changes), null, 2);
          filename = 'diff.jsonpatch';
          mimeType = 'application/json';
          break;
          
        case 'delta':
          content = JSON.stringify(generateDelta(changes), null, 2);
          filename = 'diff.delta.json';
          mimeType = 'application/json';
          break;
          
        case 'unified':
          content = generateUnifiedDiff(leftJSON, rightJSON);
          filename = 'diff.patch';
          break;
          
        case 'html':
          if (!stats) {
            toast.error('Stats not available');
            return;
          }
          content = generateHTMLReport(changes, stats, { theme: theme });
          filename = 'diff-report.html';
          mimeType = 'text/html';
          break;
          
        case 'csv':
          content = generateCSV(changes);
          filename = 'diff.csv';
          mimeType = 'text/csv';
          break;
          
        default:
          toast.error('Unknown export format');
          return;
      }
      
      downloadTextFile(content, filename, mimeType);
      toast.success(`Exported as ${format.toUpperCase()}`);
      trackDownload(format);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Export failed: ${errorMessage}`);
    }
  };
  
  return (
    <div className="export-options">
      <button
        className="btn btn-sm btn-block"
        onClick={() => handleExport('json-patch')}
        disabled={changes.length === 0}
        title="RFC 6902 JSON Patch format"
      >
        <i className="fas fa-file-code"></i> JSON Patch
      </button>
      
      <button
        className="btn btn-sm btn-block"
        onClick={() => handleExport('delta')}
        disabled={changes.length === 0}
        title="Grouped delta format"
      >
        <i className="fas fa-file-alt"></i> Delta
      </button>
      
      <button
        className="btn btn-sm btn-block"
        onClick={() => handleExport('unified')}
        disabled={changes.length === 0}
        title="Unified diff format"
      >
        <i className="fas fa-file-export"></i> Unified Diff
      </button>
      
      <button
        className="btn btn-sm btn-block"
        onClick={() => handleExport('html')}
        disabled={changes.length === 0 || !stats}
        title="HTML report"
      >
        <i className="fas fa-file-html"></i> HTML Report
      </button>
      
      <button
        className="btn btn-sm btn-block"
        onClick={() => handleExport('csv')}
        disabled={changes.length === 0}
        title="CSV format"
      >
        <i className="fas fa-file-csv"></i> CSV
      </button>
    </div>
  );
}
