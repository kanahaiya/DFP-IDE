/**
 * Help modal sections for JSON Unescaper tool
 */

export const jsonUnescaperHelpSections = [
  {
    title: 'Getting Started',
    icon: 'fas fa-rocket',
    content: `
      <p>Welcome to the JSON Unescaper! This tool converts escaped JSON strings back to readable text, handling single or multi-layer escaping automatically.</p>
      <p><strong>Quick Start:</strong></p>
      <ol>
        <li>Paste your escaped string</li>
        <li>Select the unescape mode (Auto recommended)</li>
        <li>Configure formatting options if needed</li>
        <li>Copy or download the unescaped output</li>
      </ol>
    `
  },
  {
    title: 'Unescape Modes',
    icon: 'fas fa-magic',
    content: `
      <p>Choose from multiple unescape modes:</p>
      <ul>
        <li><strong>Auto Detect:</strong> Automatically detects escape level and applies appropriate unescaping. Best for most cases.</li>
        <li><strong>JSON String:</strong> Uses JSON.parse() to unescape valid JSON string literals. Safest for proper JSON strings.</li>
        <li><strong>Single Layer:</strong> Removes exactly one level of escaping. Use when you need precise control.</li>
        <li><strong>Multi-Layer:</strong> Recursively unescapes nested escape sequences up to max depth.</li>
      </ul>
    `
  },
  {
    title: 'Escape Sequences',
    icon: 'fas fa-code',
    content: `
      <p>The unescaper handles these escape sequences:</p>
      <ul>
        <li><code>\\"</code> → <strong>"</strong> (double quote)</li>
        <li><code>\\\\</code> → <strong>\\</strong> (backslash)</li>
        <li><code>\\/</code> → <strong>/</strong> (forward slash)</li>
        <li><code>\\n</code> → <strong>newline</strong></li>
        <li><code>\\r</code> → <strong>carriage return</strong></li>
        <li><code>\\t</code> → <strong>tab</strong></li>
        <li><code>\\b</code> → <strong>backspace</strong></li>
        <li><code>\\f</code> → <strong>form feed</strong></li>
        <li><code>\\uXXXX</code> → <strong>Unicode character</strong></li>
      </ul>
    `
  },
  {
    title: 'Multi-Layer Escaping',
    icon: 'fas fa-layer-group',
    content: `
      <p>Multi-layer escaping occurs when strings are escaped multiple times:</p>
      <ul>
        <li><strong>Level 1:</strong> <code>"</code> → <code>\\"</code></li>
        <li><strong>Level 2:</strong> <code>\\"</code> → <code>\\\\\\"</code></li>
        <li><strong>Level 3:</strong> <code>\\\\\\"</code> → <code>\\\\\\\\\\"</code></li>
      </ul>
      <p>This happens when JSON passes through multiple serialization steps. Auto mode handles this automatically.</p>
    `
  },
  {
    title: 'Escape Level Detection',
    icon: 'fas fa-search',
    content: `
      <p>The unescaper shows detected escape information:</p>
      <ul>
        <li><strong>Escape Level:</strong> How many layers of escaping were detected (1, 2, 3, etc.)</li>
        <li><strong>Unescape Chain:</strong> The sequence of operations applied (e.g., JSON.parse → unescape)</li>
        <li><strong>Valid JSON:</strong> Whether the output is valid, parseable JSON</li>
      </ul>
      <p>Use this information to verify the unescaping result.</p>
    `
  },
  {
    title: 'Output Formatting',
    icon: 'fas fa-align-left',
    content: `
      <p>Configure how the unescaped output is formatted:</p>
      <ul>
        <li><strong>Format Output:</strong> Pretty-print if result is valid JSON</li>
        <li><strong>Indentation:</strong> 2 spaces, 4 spaces, or tabs</li>
        <li><strong>Sort Keys:</strong> Alphabetically sort object keys</li>
        <li><strong>Remove Outer Quotes:</strong> Strip surrounding quotes from input</li>
      </ul>
    `
  },
  {
    title: 'Presets',
    icon: 'fas fa-magic',
    content: `
      <p>One-click presets for common scenarios:</p>
      <ul>
        <li><strong>Auto + Format:</strong> Auto-detect with pretty formatting</li>
        <li><strong>Single Layer:</strong> Remove one escape level only</li>
        <li><strong>Deep Unescape:</strong> Recursive multi-layer unescaping</li>
        <li><strong>JSON String:</strong> Parse as JSON string literal</li>
        <li><strong>Minified:</strong> Unescape without formatting</li>
        <li><strong>Sorted Keys:</strong> Format with alphabetical keys</li>
        <li><strong>Tab Indent:</strong> Format with tabs</li>
        <li><strong>Keep Quotes:</strong> Preserve outer quotation marks</li>
      </ul>
    `
  },
  {
    title: 'Common Use Cases',
    icon: 'fas fa-tasks',
    content: `
      <p>When to use the JSON Unescaper:</p>
      <ul>
        <li><strong>API Debugging:</strong> Unescape over-escaped API responses</li>
        <li><strong>Log Analysis:</strong> Make log file JSON readable</li>
        <li><strong>Database Recovery:</strong> Fix multi-escaped stored data</li>
        <li><strong>Webhook Processing:</strong> Handle double-escaped payloads</li>
        <li><strong>Config Extraction:</strong> Recover escaped env variables</li>
      </ul>
    `
  },
  {
    title: 'Keyboard Shortcuts',
    icon: 'fas fa-keyboard',
    content: `
      <p>Speed up your workflow with keyboard shortcuts:</p>
      <ul>
        <li><strong>Ctrl/Cmd + C:</strong> Copy output (when focused)</li>
        <li><strong>Ctrl/Cmd + V:</strong> Paste into input</li>
        <li><strong>Ctrl/Cmd + A:</strong> Select all</li>
        <li><strong>Ctrl/Cmd + Z:</strong> Undo</li>
        <li><strong>Ctrl/Cmd + Shift + Z:</strong> Redo</li>
      </ul>
    `
  },
  {
    title: 'Troubleshooting',
    icon: 'fas fa-wrench',
    content: `
      <p>Common issues and solutions:</p>
      <ul>
        <li><strong>Output not valid JSON:</strong> The original content may be plain text, not JSON</li>
        <li><strong>Still see escape sequences:</strong> Try Multi-Layer mode with higher max depth</li>
        <li><strong>Unexpected characters:</strong> Input may have been encoded (URL/Base64), not escaped</li>
        <li><strong>Large file slow:</strong> Files over 1MB may take longer. Consider chunking.</li>
      </ul>
      <p><strong>Tip:</strong> For URL/Base64 decoding, use the JSON Decoder tool instead.</p>
    `
  },
];
