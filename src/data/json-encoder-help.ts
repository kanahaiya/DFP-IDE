/**
 * Help modal sections for JSON Encoder tool
 */

export const jsonEncoderHelpSections = [
  {
    title: 'Getting Started',
    icon: 'fas fa-rocket',
    content: `
      <p>Welcome to the JSON Encoder! This tool converts JSON data into various encoded formats commonly used in web development, API integration, and data transmission.</p>
      <p><strong>Quick Start:</strong></p>
      <ol>
        <li>Paste your JSON data or load a sample</li>
        <li>Select the encoding type (URL, Base64, Hex, etc.)</li>
        <li>Customize options if needed</li>
        <li>Copy or download the encoded output</li>
      </ol>
    `
  },
  {
    title: 'Encoding Types',
    icon: 'fas fa-lock',
    content: `
      <p>Choose from multiple encoding formats:</p>
      <ul>
        <li><strong>URL Encoding:</strong> For query parameters and form data. Converts special characters to %XX format.</li>
        <li><strong>URI Encoding:</strong> Like URL encoding but preserves URI special characters (: / ? # etc.)</li>
        <li><strong>Base64:</strong> Binary-to-text encoding. Great for data URIs, JWT, and basic auth.</li>
        <li><strong>Base64 URL-Safe:</strong> Uses - and _ instead of + and / for URL compatibility.</li>
        <li><strong>Hexadecimal:</strong> Converts each byte to two hex digits. Useful for debugging.</li>
        <li><strong>HTML Entities:</strong> Encodes as &#XXX; format for safe HTML embedding.</li>
        <li><strong>Unicode Escape:</strong> Converts non-ASCII to \\uXXXX format.</li>
      </ul>
    `
  },
  {
    title: 'URL Encoding',
    icon: 'fas fa-link',
    content: `
      <p>URL encoding is essential for passing JSON in URLs:</p>
      <ul>
        <li><strong>When to use:</strong> Query parameters, form submissions, API requests</li>
        <li><strong>Space handling:</strong> Choose between %20 (standard) or + (form encoding)</li>
        <li><strong>Example:</strong> <code>{"name":"John"}</code> → <code>%7B%22name%22%3A%22John%22%7D</code></li>
      </ul>
      <p><strong>Tip:</strong> Use standard URL encoding (%20) for most APIs, and + encoding for HTML forms.</p>
    `
  },
  {
    title: 'Base64 Encoding',
    icon: 'fas fa-key',
    content: `
      <p>Base64 is widely used for binary data and tokens:</p>
      <ul>
        <li><strong>Standard Base64:</strong> Uses A-Z, a-z, 0-9, +, / characters</li>
        <li><strong>URL-Safe Base64:</strong> Replaces + with - and / with _</li>
        <li><strong>Padding:</strong> Optional = characters at the end</li>
        <li><strong>Use cases:</strong> JWT tokens, data URIs, basic authentication, embedding binary data</li>
      </ul>
      <p><strong>Note:</strong> Base64 increases size by ~33%.</p>
    `
  },
  {
    title: 'Hex Encoding',
    icon: 'fas fa-hashtag',
    content: `
      <p>Hexadecimal encoding for debugging and binary protocols:</p>
      <ul>
        <li><strong>Format options:</strong> Lowercase (ab12) or uppercase (AB12)</li>
        <li><strong>Prefix options:</strong> None, 0x (C-style), \\x (escape sequence)</li>
        <li><strong>Delimiter options:</strong> None, space, or colon (:)</li>
        <li><strong>Example:</strong> <code>{"a":1}</code> → <code>7b2261223a317d</code></li>
      </ul>
      <p><strong>Note:</strong> Hex encoding doubles the size of your data.</p>
    `
  },
  {
    title: 'HTML & Unicode',
    icon: 'fas fa-code',
    content: `
      <p>Safe encoding for HTML and cross-platform compatibility:</p>
      <ul>
        <li><strong>HTML Entities:</strong> Converts to &#XXX; format, preventing XSS attacks</li>
        <li><strong>Unicode Escape:</strong> Converts non-ASCII to \\uXXXX format</li>
        <li><strong>ASCII-Only:</strong> Ensures output contains only ASCII characters (0-127)</li>
      </ul>
      <p><strong>Use cases:</strong> Embedding JSON in HTML, cross-platform data exchange, legacy system compatibility.</p>
    `
  },
  {
    title: 'Preprocessing Options',
    icon: 'fas fa-sliders-h',
    content: `
      <p>Process your JSON before encoding:</p>
      <ul>
        <li><strong>Minify First:</strong> Remove whitespace for smaller encoded output</li>
        <li><strong>Format First:</strong> Pretty print with indentation before encoding</li>
      </ul>
      <p><strong>Recommendation:</strong> Enable "Minify First" for URL and Base64 encoding to reduce output size.</p>
    `
  },
  {
    title: 'Presets',
    icon: 'fas fa-magic',
    content: `
      <p>One-click presets for common scenarios:</p>
      <ul>
        <li><strong>URL Safe:</strong> Standard URL encoding for query parameters</li>
        <li><strong>Form Data:</strong> URL encoding with spaces as +</li>
        <li><strong>Base64 JWT:</strong> URL-safe Base64 without padding for JWT tokens</li>
        <li><strong>Hex Debug:</strong> Uppercase hex with 0x prefix and spaces</li>
        <li><strong>HTML Safe:</strong> HTML entity encoding for embedding in HTML</li>
        <li><strong>ASCII Only:</strong> Unicode escape for non-ASCII characters</li>
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
        <li><strong>Invalid JSON error:</strong> The encoder accepts any text, but JSON-specific options work best with valid JSON</li>
        <li><strong>Double encoding warning:</strong> Your input may already be encoded. Consider decoding first.</li>
        <li><strong>Large file slow:</strong> Files over 1MB may take longer. Consider chunking.</li>
        <li><strong>Special characters issues:</strong> Make sure you're using the right encoding type for your use case</li>
      </ul>
      <p><strong>Tip:</strong> Use the Auto-Correct feature to fix common JSON syntax issues.</p>
    `
  },
];
