/**
 * Help modal sections for JSON Escaper tool
 */

export const jsonEscaperHelpSections = [
  {
    title: 'Getting Started',
    icon: 'fas fa-rocket',
    content: `
      <p>Welcome to the JSON Escaper! This tool converts text and JSON strings into properly escaped formats for various contexts like JavaScript, HTML, and URLs.</p>
      <p><strong>Quick Start:</strong></p>
      <ol>
        <li>Paste your text or JSON data</li>
        <li>Select the escape mode (Standard, JavaScript, URL, HTML)</li>
        <li>Customize options if needed</li>
        <li>Copy or download the escaped output</li>
      </ol>
    `
  },
  {
    title: 'Escape Modes',
    icon: 'fas fa-shield-alt',
    content: `
      <p>Choose from multiple escape modes:</p>
      <ul>
        <li><strong>Standard JSON:</strong> Escapes quotes, backslashes, and control characters per RFC 8259.</li>
        <li><strong>JavaScript String:</strong> Adds escaping for single quotes, backticks, and dollar signs for JS contexts.</li>
        <li><strong>URL-Safe:</strong> Encodes for URL query parameters using percent-encoding.</li>
        <li><strong>HTML-Safe:</strong> Converts &lt;, &gt;, &amp;, quotes to HTML entities for safe HTML embedding.</li>
      </ul>
    `
  },
  {
    title: 'Standard JSON Escaping',
    icon: 'fas fa-code',
    content: `
      <p>Standard JSON escaping handles these characters:</p>
      <ul>
        <li><strong>"</strong> → <code>\\"</code> (double quote)</li>
        <li><strong>\\</strong> → <code>\\\\</code> (backslash)</li>
        <li><strong>newline</strong> → <code>\\n</code></li>
        <li><strong>tab</strong> → <code>\\t</code></li>
        <li><strong>carriage return</strong> → <code>\\r</code></li>
        <li><strong>backspace</strong> → <code>\\b</code></li>
        <li><strong>form feed</strong> → <code>\\f</code></li>
        <li><strong>control chars</strong> → <code>\\uXXXX</code></li>
      </ul>
      <p>Optionally escape forward slashes: <strong>/</strong> → <code>\\/</code></p>
    `
  },
  {
    title: 'JavaScript Escaping',
    icon: 'fab fa-js',
    content: `
      <p>JavaScript mode adds escaping for JS-specific characters:</p>
      <ul>
        <li><strong>'</strong> → <code>\\'</code> (single quote)</li>
        <li><strong>\`</strong> → <code>\\\`</code> (backtick for template literals)</li>
        <li><strong>$</strong> → <code>\\$</code> (dollar sign for template expressions)</li>
      </ul>
      <p><strong>Use cases:</strong> Embedding strings in JS code, template literals, eval(), dynamically generated scripts.</p>
    `
  },
  {
    title: 'URL & HTML Escaping',
    icon: 'fas fa-link',
    content: `
      <p><strong>URL-Safe Mode:</strong></p>
      <ul>
        <li>Uses encodeURIComponent for complete URL safety</li>
        <li>Converts spaces to %20, quotes to %22, etc.</li>
        <li>Safe for query parameters and form data</li>
      </ul>
      <p><strong>HTML-Safe Mode:</strong></p>
      <ul>
        <li><strong>&lt;</strong> → <code>&amp;lt;</code></li>
        <li><strong>&gt;</strong> → <code>&amp;gt;</code></li>
        <li><strong>&amp;</strong> → <code>&amp;amp;</code></li>
        <li>Prevents XSS attacks when embedding in HTML</li>
      </ul>
    `
  },
  {
    title: 'Unicode Options',
    icon: 'fas fa-globe',
    content: `
      <p>Control how non-ASCII characters are handled:</p>
      <ul>
        <li><strong>Unicode Escape:</strong> Convert to \\uXXXX format (e.g., é → \\u00e9)</li>
        <li><strong>ASCII Only:</strong> Escape all characters above code point 127</li>
      </ul>
      <p><strong>Use cases:</strong> Legacy system compatibility, debugging encoding issues, ensuring ASCII-only output.</p>
    `
  },
  {
    title: 'Output Options',
    icon: 'fas fa-sliders-h',
    content: `
      <p>Customize your escaped output:</p>
      <ul>
        <li><strong>Wrap in Quotes:</strong> Add surrounding double quotes for complete JSON string</li>
        <li><strong>Escape Forward Slash:</strong> Convert / to \\/ (useful in HTML script tags)</li>
        <li><strong>Output Format:</strong> As-Is, Minified (no whitespace), or Formatted (pretty-print)</li>
        <li><strong>Indentation:</strong> 2 or 4 spaces when formatting</li>
      </ul>
    `
  },
  {
    title: 'Presets',
    icon: 'fas fa-magic',
    content: `
      <p>One-click presets for common scenarios:</p>
      <ul>
        <li><strong>Standard JSON:</strong> Basic escaping with quotes</li>
        <li><strong>Minified String:</strong> Compact escaped output</li>
        <li><strong>JavaScript String:</strong> For embedding in JS code</li>
        <li><strong>URL Query:</strong> URL-safe encoding</li>
        <li><strong>HTML Attribute:</strong> Safe for HTML data attributes</li>
        <li><strong>ASCII Only:</strong> Unicode escape all non-ASCII</li>
        <li><strong>Readable:</strong> Formatted with indentation</li>
        <li><strong>No Outer Quotes:</strong> Escaped content only</li>
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
        <li><strong>Already escaped warning:</strong> Your input may contain escape sequences already. Consider unescaping first.</li>
        <li><strong>Double escaping:</strong> If you see \\\\ instead of \\, your input was already escaped</li>
        <li><strong>Output not valid JSON:</strong> Make sure "Wrap in Quotes" is enabled for complete JSON strings</li>
        <li><strong>Large file slow:</strong> Files over 1MB may take longer. Consider chunking.</li>
      </ul>
      <p><strong>Tip:</strong> Use the JSON Unescaper to reverse escaping operations.</p>
    `
  },
];
