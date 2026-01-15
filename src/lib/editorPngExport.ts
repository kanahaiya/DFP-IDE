export type ExportLayout = 'horizontal' | 'vertical';
export type ExportTheme = 'dark' | 'light';
export type DiffType = 'ADDED' | 'REMOVED' | 'MODIFIED' | 'TYPE_CHANGED' | 'MOVED';

export interface LineDiff {
  lineNumber: number;
  type: DiffType;
}

export interface ExportPane {
  title: string;
  text: string;
  diffs?: LineDiff[]; // Lines with diff highlighting
  language?: string; // Monaco language id (e.g. 'json', 'yaml') when available
  cursorLine?: number; // Current cursor line (for current-line highlight)
}

interface ExportEditorsPngArgs {
  filenameBase: string;
  theme: ExportTheme;
  layout: ExportLayout;
  left?: ExportPane;
  right?: ExportPane;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// Simple JSON syntax highlighting colors
interface TokenColors {
  key: string;
  string: string;
  number: string;
  boolean: string;
  null: string;
  bracket: string;
  punctuation: string;
}

function getTokenColors(theme: ExportTheme): TokenColors {
  if (theme === 'dark') {
    // VS Code Dark+ theme colors (matching Monaco editor)
    return {
      key: '#9cdcfe',      // light blue (property names)
      string: '#ce9178',   // orange/salmon (string values)
      number: '#b5cea8',   // light green
      boolean: '#569cd6',  // blue (true/false)
      null: '#569cd6',     // blue
      bracket: '#ffd700',  // gold/yellow (bracket pair colorization level 1)
      punctuation: '#d4d4d4', // light gray (colons, commas)
    };
  }
  // VS Code Light+ theme colors
  return {
    key: '#0451a5',      // dark blue
    string: '#a31515',   // dark red
    number: '#098658',   // green
    boolean: '#0000ff',  // blue
    null: '#0000ff',     // blue
    bracket: '#000000',  // black
    punctuation: '#000000', // black
  };
}

// Diff highlight colors MUST match `src/app/globals.css` exactly.
function getDiffBackgroundColor(diffType: DiffType, theme: ExportTheme): string {
  if (theme === 'dark') {
    switch (diffType) {
      case 'ADDED':
        return 'rgba(34, 197, 94, 0.25)';
      case 'REMOVED':
        return 'rgba(239, 68, 68, 0.25)';
      case 'MODIFIED':
        return 'rgba(234, 179, 8, 0.22)';
      case 'TYPE_CHANGED':
        return 'rgba(168, 85, 247, 0.22)';
      case 'MOVED':
        return 'rgba(59, 130, 246, 0.22)';
      default:
        return 'transparent';
    }
  }

  // Light theme (solid backgrounds in CSS)
  switch (diffType) {
    case 'ADDED':
      return '#d4f4dd';
    case 'REMOVED':
      return '#ffcccc';
    case 'MODIFIED':
      return '#fff4c5';
    case 'TYPE_CHANGED':
      return '#f0d9ff';
    case 'MOVED':
      return '#e0e7ff';
    default:
      return 'transparent';
  }
}

function getDiffBorderColor(diffType: DiffType, theme: ExportTheme): string {
  if (theme === 'dark') {
    switch (diffType) {
      case 'ADDED':
        return 'rgba(74, 222, 128, 0.5)';
      case 'REMOVED':
        return 'rgba(248, 113, 113, 0.5)';
      case 'MODIFIED':
        return 'rgba(250, 204, 21, 0.5)';
      case 'TYPE_CHANGED':
        return 'rgba(192, 132, 252, 0.5)';
      case 'MOVED':
        return 'rgba(96, 165, 250, 0.5)';
      default:
        return 'transparent';
    }
  }

  // Light theme doesn't specify border-left for diff decorations
  return 'transparent';
}

interface TextSegment {
  text: string;
  color: string;
}

type ContentType = 'json' | 'yaml' | 'text';

function detectContentType(text: string): ContentType {
  const trimmed = text.trim();
  // JSON starts with { or [
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return 'json';
  }
  // YAML typically has key: value patterns without quotes, or starts with ---
  if (trimmed.startsWith('---') || /^[a-zA-Z_][a-zA-Z0-9_]*:/.test(trimmed)) {
    return 'yaml';
  }
  // Check if it looks like YAML (has unquoted keys with colons)
  const lines = trimmed.split('\n').slice(0, 5);
  const yamlLikeLines = lines.filter(l => /^\s*[a-zA-Z_][a-zA-Z0-9_-]*:\s*/.test(l));
  if (yamlLikeLines.length > 0) {
    return 'yaml';
  }
  return 'text';
}

function tokenizeJsonLine(line: string, theme: ExportTheme, defaultColor: string): TextSegment[] {
  const colors = getTokenColors(theme);
  const segments: TextSegment[] = [];
  
  let i = 0;
  while (i < line.length) {
    const char = line[i];
    
    // Whitespace
    if (/\s/.test(char)) {
      let ws = '';
      while (i < line.length && /\s/.test(line[i])) {
        ws += line[i];
        i++;
      }
      segments.push({ text: ws, color: defaultColor });
      continue;
    }
    
    // Brackets
    if (char === '{' || char === '}' || char === '[' || char === ']') {
      segments.push({ text: char, color: colors.bracket });
      i++;
      continue;
    }
    
    // Punctuation
    if (char === ',' || char === ':') {
      segments.push({ text: char, color: colors.punctuation });
      i++;
      continue;
    }
    
    // String (key or value)
    if (char === '"') {
      let str = '"';
      i++;
      while (i < line.length && line[i] !== '"') {
        if (line[i] === '\\' && i + 1 < line.length) {
          str += line[i] + line[i + 1];
          i += 2;
        } else {
          str += line[i];
          i++;
        }
      }
      if (i < line.length) {
        str += '"';
        i++;
      }
      
      // Check if this is a key (followed by colon)
      let j = i;
      while (j < line.length && /\s/.test(line[j])) j++;
      const isKey = j < line.length && line[j] === ':';
      
      segments.push({ text: str, color: isKey ? colors.key : colors.string });
      continue;
    }
    
    // Numbers
    if (/[\d\-]/.test(char)) {
      let num = '';
      while (i < line.length && /[\d\.\-eE\+]/.test(line[i])) {
        num += line[i];
        i++;
      }
      segments.push({ text: num, color: colors.number });
      continue;
    }
    
    // Boolean / null
    const remaining = line.slice(i);
    if (remaining.startsWith('true')) {
      segments.push({ text: 'true', color: colors.boolean });
      i += 4;
      continue;
    }
    if (remaining.startsWith('false')) {
      segments.push({ text: 'false', color: colors.boolean });
      i += 5;
      continue;
    }
    if (remaining.startsWith('null')) {
      segments.push({ text: 'null', color: colors.null });
      i += 4;
      continue;
    }
    
    // Default
    segments.push({ text: char, color: defaultColor });
    i++;
  }
  
  return segments;
}

function tokenizeYamlLine(line: string, theme: ExportTheme, defaultColor: string): TextSegment[] {
  const colors = getTokenColors(theme);
  const segments: TextSegment[] = [];
  
  let i = 0;
  
  // Handle leading whitespace
  while (i < line.length && /\s/.test(line[i])) {
    segments.push({ text: line[i], color: defaultColor });
    i++;
  }
  
  // Check for comment
  if (line[i] === '#') {
    segments.push({ text: line.slice(i), color: theme === 'dark' ? '#6a9955' : '#008000' });
    return segments;
  }
  
  // Check for array item marker
  if (line[i] === '-' && (i + 1 >= line.length || /\s/.test(line[i + 1]))) {
    segments.push({ text: '-', color: colors.punctuation });
    i++;
    // Skip space after dash
    while (i < line.length && /\s/.test(line[i])) {
      segments.push({ text: line[i], color: defaultColor });
      i++;
    }
  }
  
  // Check for key: value pattern
  const remainingLine = line.slice(i);
  const keyMatch = remainingLine.match(/^([a-zA-Z_][a-zA-Z0-9_-]*)(\s*:\s*)/);
  
  if (keyMatch) {
    // Key
    segments.push({ text: keyMatch[1], color: colors.key });
    // Colon and surrounding spaces
    segments.push({ text: keyMatch[2], color: colors.punctuation });
    i += keyMatch[0].length;
    
    // Value
    const valueStr = line.slice(i).trim();
    const valuePadding = line.slice(i, line.indexOf(valueStr, i));
    if (valuePadding) {
      segments.push({ text: valuePadding, color: defaultColor });
      i += valuePadding.length;
    }
    
    if (valueStr.length > 0) {
      // Determine value type and color
      const value = line.slice(i);
      
      // Quoted string
      if (value.startsWith('"') || value.startsWith("'")) {
        segments.push({ text: value, color: colors.string });
      }
      // Number
      else if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(valueStr)) {
        segments.push({ text: value, color: colors.number });
      }
      // Boolean
      else if (/^(true|false|yes|no|on|off)$/i.test(valueStr)) {
        segments.push({ text: value, color: colors.boolean });
      }
      // Null
      else if (/^(null|~)$/i.test(valueStr)) {
        segments.push({ text: value, color: colors.null });
      }
      // Regular string value
      else {
        segments.push({ text: value, color: colors.string });
      }
    }
    return segments;
  }
  
  // If no key pattern, treat rest as value/text
  if (i < line.length) {
    const rest = line.slice(i);
    // Check if it's a plain value
    if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(rest.trim())) {
      segments.push({ text: rest, color: colors.number });
    } else if (/^(true|false|yes|no|on|off)$/i.test(rest.trim())) {
      segments.push({ text: rest, color: colors.boolean });
    } else if (/^(null|~)$/i.test(rest.trim())) {
      segments.push({ text: rest, color: colors.null });
    } else {
      segments.push({ text: rest, color: colors.string });
    }
  }
  
  return segments;
}

function tokenizeLine(line: string, theme: ExportTheme, defaultColor: string, contentType: ContentType): TextSegment[] {
  if (contentType === 'json') {
    return tokenizeJsonLine(line, theme, defaultColor);
  } else if (contentType === 'yaml') {
    return tokenizeYamlLine(line, theme, defaultColor);
  }
  // Plain text - no highlighting
  return [{ text: line, color: defaultColor }];
}

async function tryGetMonacoColoredLines(args: {
  text: string;
  languageId: string;
  defaultColor: string;
}): Promise<TextSegment[][] | null> {
  try {
    type MonacoColorizeOptions = { tabSize?: number };
    type MonacoLike = {
      editor?: {
        colorize?: (text: string, languageId: string, options?: MonacoColorizeOptions) => Promise<string>;
      };
    };
    const monaco = (window as unknown as { monaco?: MonacoLike }).monaco;
    if (!monaco?.editor?.colorize) return null;

    const existingEditor = document.querySelector('.monaco-editor') as HTMLElement | null;
    const editorClassName = existingEditor?.className || 'monaco-editor';

    const html: string = await monaco.editor.colorize(args.text, args.languageId, { tabSize: 2 });

    // Offscreen container so computed styles resolve for `mtk*` token classes
    const container = document.createElement('div');
    container.className = editorClassName;
    container.setAttribute('aria-hidden', 'true');
    container.style.position = 'fixed';
    container.style.left = '-99999px';
    container.style.top = '0';
    container.style.whiteSpace = 'pre';
    container.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
    container.style.fontSize = '13px';
    container.style.lineHeight = '20px';
    container.innerHTML = html;
    document.body.appendChild(container);

    const lines: TextSegment[][] = [[]];

    const pushText = (text: string, color: string) => {
      if (!text) return;
      // Monaco colorize often uses NBSP to preserve spacing
      const normalized = text.replace(/\u00a0/g, ' ');
      if (!normalized) return;
      lines[lines.length - 1].push({ text: normalized, color });
    };

    const walk = (node: Node, inheritedColor: string) => {
      if (node.nodeType === Node.TEXT_NODE) {
        pushText(node.textContent || '', inheritedColor);
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const el = node as HTMLElement;

      if (el.tagName === 'BR') {
        lines.push([]);
        return;
      }

      const color = getComputedStyle(el).color || inheritedColor;
      for (const child of Array.from(el.childNodes)) {
        walk(child, color);
      }
    };

    for (const node of Array.from(container.childNodes)) {
      if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'BR') {
        lines.push([]);
      } else {
        walk(node, args.defaultColor);
      }
    }

    container.remove();
    return lines;
  } catch {
    return null;
  }
}

function measureMaxLine(ctx: CanvasRenderingContext2D, lines: string[]) {
  let max = 0;
  for (const line of lines) {
    const w = ctx.measureText(line).width;
    if (w > max) max = w;
  }
  return max;
}

function drawPane(
  ctx: CanvasRenderingContext2D,
  pane: ExportPane,
  x: number,
  y: number,
  width: number,
  height: number,
  theme: ExportTheme,
  coloredLines: TextSegment[][] | null
) {
  // Match Monaco editor colors exactly
  const bg = theme === 'dark' ? '#1e1e1e' : '#ffffff';
  const textColor = theme === 'dark' ? '#d4d4d4' : '#1f2937';
  const lineNumColor = theme === 'dark' ? '#858585' : '#6b7280';
  // From `src/app/globals.css` current-line rules
  const currentLineBg = theme === 'dark' ? 'rgba(96, 165, 250, 0.18)' : 'rgba(255, 193, 7, 0.15)';
  const currentLineBorder = theme === 'dark' ? 'rgba(96, 165, 250, 0.5)' : 'rgba(255, 193, 7, 0.5)';
  const activeLineNumberColor = theme === 'dark' ? '#60a5fa' : '#b45309';
  const currentLineRadius = 6;
  const currentLineBorderWidth = 2;
  const currentLine = pane.cursorLine;

  // Build a map of line numbers to diff types
  const diffMap = new Map<number, DiffType>();
  if (pane.diffs) {
    for (const diff of pane.diffs) {
      diffMap.set(diff.lineNumber, diff.type);
    }
  }

  // Panel background (no title bar - matches editor view)
  ctx.fillStyle = bg;
  ctx.fillRect(x, y, width, height);

  // Content settings
  const padding = 8;
  const lineHeight = 20;
  const fontSize = 13;
  const contentY = y + padding;

  // Gutter for line numbers
  const lines = pane.text.split('\n');
  const digits = Math.max(String(lines.length).length, 2);
  const gutterW = digits * 9 + 20;
  const contentX = x + gutterW;

  ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
  ctx.textBaseline = 'top';

  // Detect content type for syntax highlighting
  const contentType = detectContentType(pane.text);

  let yy = contentY;
  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const diffType = diffMap.get(lineNum);
    const isCurrentLine = currentLine === lineNum;
    
    // Draw current line highlight (blue box like in editor)
    if (isCurrentLine) {
      // Background
      ctx.fillStyle = currentLineBg;
      ctx.fillRect(x, yy - 1, width, lineHeight + 2);
      // Border
      ctx.strokeStyle = currentLineBorder;
      ctx.lineWidth = currentLineBorderWidth;
      ctx.beginPath();
      ctx.roundRect(x + 1, yy - 1, width - 2, lineHeight + 2, currentLineRadius);
      ctx.stroke();
    }
    
    // Draw diff highlight (Monaco decoration is applied to content area, not gutter)
    if (diffType && !isCurrentLine) {
      ctx.fillStyle = getDiffBackgroundColor(diffType, theme);
      ctx.fillRect(x + gutterW, yy - 1, width - gutterW, lineHeight + 2);

      // Draw border-left (matches CSS border-left on dark theme diff decorations)
      const borderColor = getDiffBorderColor(diffType, theme);
      if (borderColor !== 'transparent') {
        ctx.fillStyle = borderColor;
        ctx.fillRect(x + gutterW, yy - 1, 2, lineHeight + 2);
      }
    }

    const ln = String(lineNum).padStart(digits, ' ');
    ctx.fillStyle = isCurrentLine ? activeLineNumberColor : lineNumColor;
    ctx.font = `${isCurrentLine ? '600 ' : ''}${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
    ctx.fillText(ln, x + 8, yy + 2);
    ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;

    // Tokenize and render with syntax colors
    const segments =
      coloredLines?.[i] && coloredLines[i].length > 0
        ? coloredLines[i]
        : tokenizeLine(lines[i], theme, textColor, contentType);
    let xx = contentX + 8;
    for (const seg of segments) {
      ctx.fillStyle = seg.color;
      ctx.fillText(seg.text, xx, yy + 2);
      xx += ctx.measureText(seg.text).width;
    }

    yy += lineHeight;
  }
}

export async function exportEditorsAsPng(args: ExportEditorsPngArgs) {
  const { filenameBase, theme, layout, left, right } = args;

  if (!left && !right) {
    console.warn('PNG Export: No content to export');
    return;
  }

  console.log('PNG Export: Starting text render export');

  // Measure required canvas size based on line counts (full content)
  const lineHeight = 20;
  const padding = 16; // Top and bottom padding

  const leftLines = left ? left.text.split('\n') : [];
  const rightLines = right ? right.text.split('\n') : [];
  const leftLineCount = leftLines.length;
  const rightLineCount = rightLines.length;
  const maxLines = Math.max(leftLineCount, rightLineCount, 1);

  // Offscreen measuring canvas
  const measureCanvas = document.createElement('canvas');
  const mctx = measureCanvas.getContext('2d');
  if (!mctx) {
    console.error('PNG Export: Failed to create measuring context');
    return;
  }
  mctx.font = '13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

  const baseW = 450; // minimum per pane
  const leftTextW = left ? measureMaxLine(mctx, leftLines) : 0;
  const rightTextW = right ? measureMaxLine(mctx, rightLines) : 0;
  
  // Calculate gutter width
  const leftDigits = Math.max(String(leftLineCount).length, 2);
  const rightDigits = Math.max(String(rightLineCount).length, 2);
  const leftGutterW = leftDigits * 9 + 28;
  const rightGutterW = rightDigits * 9 + 28;
  
  const paneWLeft = Math.max(baseW, Math.ceil(leftTextW) + leftGutterW + 40);
  const paneWRight = Math.max(baseW, Math.ceil(rightTextW) + rightGutterW + 40);

  // Height based on actual line count for each pane
  const leftPaneH = padding * 2 + leftLineCount * lineHeight;
  const rightPaneH = padding * 2 + rightLineCount * lineHeight;
  const maxPaneH = padding * 2 + maxLines * lineHeight;

  // Guard against extreme canvas size
  const maxCanvasDim = 16384;
  const clampedLeftH = Math.min(leftPaneH, maxCanvasDim - 40);
  const clampedRightH = Math.min(rightPaneH, maxCanvasDim - 40);
  const clampedMaxH = Math.min(maxPaneH, maxCanvasDim - 40);

  const gap = 4; // Small gap between editors (like in the actual editor view)
  let canvasW = paneWLeft;
  let canvasH = clampedLeftH;

  const hasBoth = !!left && !!right;
  if (hasBoth) {
    if (layout === 'horizontal') {
      canvasW = paneWLeft + gap + paneWRight;
      canvasH = clampedMaxH;
    } else {
      canvasW = Math.max(paneWLeft, paneWRight);
      canvasH = clampedLeftH + gap + clampedRightH;
    }
  }

  canvasW = Math.min(canvasW, maxCanvasDim);
  canvasH = Math.min(canvasH, maxCanvasDim);

  const canvas = document.createElement('canvas');
  // Use 2x scale for crisp output on retina displays
  const scale = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.max(1, Math.floor(canvasW * scale));
  canvas.height = Math.max(1, Math.floor(canvasH * scale));
  canvas.style.width = `${canvasW}px`;
  canvas.style.height = `${canvasH}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('PNG Export: Failed to create canvas context');
    return;
  }

  // Scale for retina
  ctx.scale(scale, scale);

  // Background (match Monaco editor background)
  ctx.fillStyle = theme === 'dark' ? '#1e1e1e' : '#ffffff';
  ctx.fillRect(0, 0, canvasW, canvasH);

  // Use Monaco's real token colors when available (so PNG matches editor theme)
  const defaultTextColor = theme === 'dark' ? '#d4d4d4' : '#1f2937';
  const resolveLanguageId = (pane: ExportPane): string => {
    const inferred = detectContentType(pane.text);
    // If the content clearly looks like JSON/YAML, prefer that over the editor's configured language.
    if (inferred !== 'text' && pane.language && pane.language !== inferred) return inferred;
    return pane.language || inferred;
  };

  const leftColoredLines =
    left && resolveLanguageId(left) !== 'text'
      ? await tryGetMonacoColoredLines({
          text: left.text,
          languageId: resolveLanguageId(left),
          defaultColor: defaultTextColor,
        })
      : null;
  const rightColoredLines =
    right && resolveLanguageId(right) !== 'text'
      ? await tryGetMonacoColoredLines({
          text: right.text,
          languageId: resolveLanguageId(right),
          defaultColor: defaultTextColor,
        })
      : null;

  if (hasBoth) {
    if (layout === 'horizontal') {
      // Draw divider line between panes
      ctx.fillStyle = theme === 'dark' ? '#3c3c3c' : '#e0e0e0';
      ctx.fillRect(paneWLeft, 0, gap, canvasH);
      
      drawPane(ctx, left!, 0, 0, paneWLeft, clampedMaxH, theme, leftColoredLines);
      drawPane(ctx, right!, paneWLeft + gap, 0, paneWRight, clampedMaxH, theme, rightColoredLines);
    } else {
      // Draw divider line between panes
      ctx.fillStyle = theme === 'dark' ? '#3c3c3c' : '#e0e0e0';
      ctx.fillRect(0, clampedLeftH, canvasW, gap);
      
      drawPane(ctx, left!, 0, 0, canvasW, clampedLeftH, theme, leftColoredLines);
      drawPane(ctx, right!, 0, clampedLeftH + gap, canvasW, clampedRightH, theme, rightColoredLines);
    }
  } else {
    const pane = left || right!;
    const paneH = left ? clampedLeftH : clampedRightH;
    const singleColoredLines =
      pane && resolveLanguageId(pane) !== 'text'
        ? await tryGetMonacoColoredLines({
            text: pane.text,
            languageId: resolveLanguageId(pane),
            defaultColor: defaultTextColor,
          })
        : null;
    drawPane(ctx, pane, 0, 0, canvasW, paneH, theme, singleColoredLines);
  }

  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) {
    console.error('PNG Export: Failed to create blob');
    return;
  }

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  downloadBlob(blob, `${filenameBase}-${ts}.png`);
  console.log('PNG Export: Successfully downloaded');
}

