/**
 * CSV Column-based color highlighting for Monaco Editor
 * Uses decorations to apply different colors to each column (cycling through 8 colors)
 * Matches the DataFormatterPro reference implementation
 */

import type { Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

// Column color palette (cycles through 8 colors)
const CSV_COLUMN_COLORS = [
  '#60a5fa', // blue
  '#34d399', // green
  '#93c5fd', // light blue
  '#f59e0b', // amber/orange
  '#f87171', // red
  '#a78bfa', // purple
  '#f472b6', // pink
  '#2dd4bf', // teal
];

// Performance limits
const MAX_ROWS_FOR_COLORING = 5000;
const MAX_COLS_FOR_COLORING = 10;

export function registerCSVLanguage(monaco: Monaco) {
  // Check if already registered
  const languages = monaco.languages.getLanguages();
  if (languages.some((lang: { id: string }) => lang.id === 'csv')) {
    return;
  }

  // Register the CSV language (minimal, we'll use decorations for coloring)
  monaco.languages.register({ id: 'csv' });

  // Basic language configuration
  monaco.languages.setLanguageConfiguration('csv', {
    wordPattern: /[^,;\t|\s"]+|"[^"]*"/g,
    brackets: [
      ['"', '"'],
    ],
    autoClosingPairs: [
      { open: '"', close: '"', notIn: ['string'] },
    ],
  });
}

/**
 * Parse a CSV line to find column boundaries
 */
function parseCsvLine(line: string, delimiter: string): number[][] {
  const spans: number[][] = [];
  let i = 0;
  let start = 0;
  let inQuote = false;
  const delim = delimiter || ',';

  while (i < line.length) {
    const ch = line[i];
    
    if (inQuote) {
      if (ch === '"') {
        // Check for escaped quote
        if (i + 1 < line.length && line[i + 1] === '"') {
          i += 2;
          continue;
        }
        inQuote = false;
        i++;
        continue;
      }
      i++;
      continue;
    }
    
    if (ch === '"') {
      inQuote = true;
      i++;
      continue;
    }
    
    if (ch === delim) {
      spans.push([start + 1, i + 1]); // Monaco columns are 1-based
      i++;
      start = i;
      continue;
    }
    
    i++;
  }
  
  // Add the last span
  spans.push([start + 1, line.length + 1]);
  return spans;
}

/**
 * Apply column-based decorations to the CSV editor
 */
export function applyCSVColumnDecorations(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco,
  delimiter: string = ','
): editor.IEditorDecorationsCollection | null {
  try {
    const model = editor.getModel();
    if (!model) return null;

    const linesCount = model.getLineCount();
    const firstLine = model.getLineContent(1) || '';
    const firstSpans = parseCsvLine(firstLine, delimiter);
    const colCount = firstSpans.length;

    // Disable coloring for large files
    const shouldDisable = linesCount > MAX_ROWS_FOR_COLORING || colCount > MAX_COLS_FOR_COLORING;
    if (shouldDisable) {
      return null;
    }

    const decorations: editor.IModelDeltaDecoration[] = [];
    const maxLines = Math.min(linesCount, 4000);
    let maxDecos = 0;

    for (let lineNo = 1; lineNo <= maxLines; lineNo++) {
      const text = model.getLineContent(lineNo);
      if (!text) continue;

      const spans = parseCsvLine(text, delimiter);
      
      for (let colIndex = 0; colIndex < spans.length; colIndex++) {
        const [startCol, endCol] = spans[colIndex];
        if (endCol <= startCol) continue;

        const colorIndex = colIndex % CSV_COLUMN_COLORS.length;

        decorations.push({
          range: new monaco.Range(lineNo, startCol, lineNo, endCol),
          options: {
            inlineClassName: `csv-col-${colorIndex + 1}`,
          },
        });

        maxDecos++;
        if (maxDecos > 60000) break;
      }
      
      if (maxDecos > 60000) break;
    }

    return editor.createDecorationsCollection(decorations);
  } catch (error) {
    console.warn('Error applying CSV decorations:', error);
    return null;
  }
}
