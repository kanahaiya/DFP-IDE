/**
 * Help modal sections for JSON Decoder tool
 */

export const jsonDecoderHelpSections = [
  {
    title: 'Getting Started',
    icon: 'fas fa-rocket',
    content: `
      <p>Welcome to the JSON Decoder! This tool decodes various encoded JSON formats including URL encoding, Base64, Hex, HTML entities, and escaped strings.</p>
      <p><strong>Quick Start:</strong></p>
      <ol>
        <li>Paste your encoded JSON data or load a sample</li>
        <li>The tool auto-detects the encoding type</li>
        <li>View the decoded and formatted JSON output</li>
        <li>Copy or download the result</li>
      </ol>
    `
  },
  {
    title: 'Auto-Detection',
    icon: 'fas fa-magic',
    content: `
      <p>The decoder automatically detects encoding types:</p>
      <ul>
        <li><strong>URL Encoding:</strong> Detects %XX patterns</li>
        <li><strong>Base64:</strong> Recognizes Base64 character patterns</li>
        <li><strong>Hex:</strong> Identifies hexadecimal byte strings</li>
        <li><strong>HTML Entities:</strong> Finds &#XXX; and &name; patterns</li>
        <li><strong>Unicode:</strong> Detects \\uXXXX escape sequences</li>
        <li><strong>Escaped:</strong> Recognizes \\", \\n, \\t patterns</li>
      </ul>
      <p><strong>Tip:</strong> Auto-detection works best with clearly encoded data. Use manual mode if detection fails.</p>
    `
  },
  {
    title: 'URL Decoding',
    icon: 'fas fa-link',
    content: `
      <p>Decode URL/percent-encoded JSON strings:</p>
      <ul>
        <li><strong>Input:</strong> <code>%7B%22name%22%3A%22test%22%7D</code></li>
        <li><strong>Output:</strong> <code>{"name":"test"}</code></li>
      </ul>
      <p>Handles both single and double URL encoding. The decoder will recursively decode until valid JSON is found.</p>
      <p><strong>Common patterns:</strong></p>
      <ul>
        <li>%7B = {</li>
        <li>%7D = }</li>
        <li>%22 = "</li>
        <li>%3A = :</li>
        <li>%20 or + = space</li>
      </ul>
    `
  },
  {
    title: 'Base64 Decoding',
    icon: 'fas fa-key',
    content: `
      <p>Decode Base64 encoded JSON including JWT payloads:</p>
      <ul>
        <li><strong>Standard Base64:</strong> Uses A-Z, a-z, 0-9, +, /</li>
        <li><strong>URL-Safe Base64:</strong> Uses - and _ instead of + and /</li>
        <li><strong>With/Without Padding:</strong> Handles missing = characters</li>
      </ul>
      <p><strong>JWT Decoding:</strong> Paste just the payload section (middle part) of a JWT token to decode it.</p>
      <p><strong>Example:</strong></p>
      <ul>
        <li>Input: <code>eyJuYW1lIjoiSm9obiJ9</code></li>
        <li>Output: <code>{"name":"John"}</code></li>
      </ul>
    `
  },
  {
    title: 'Hex Decoding',
    icon: 'fas fa-hashtag',
    content: `
      <p>Decode hexadecimal byte strings to JSON:</p>
      <ul>
        <li><strong>Plain hex:</strong> <code>7b226e616d65223a2274657374227d</code></li>
        <li><strong>With 0x prefix:</strong> <code>0x7b 0x22...</code></li>
        <li><strong>With \\x prefix:</strong> <code>\\x7b\\x22...</code></li>
        <li><strong>Colon-separated:</strong> <code>7b:22:6e...</code></li>
      </ul>
      <p>The decoder automatically strips prefixes and delimiters before decoding.</p>
    `
  },
  {
    title: 'Escaped Strings',
    icon: 'fas fa-compress-alt',
    content: `
      <p>Unescape JSON strings with extra escape characters:</p>
      <ul>
        <li><strong>Double-escaped:</strong> <code>{\\"name\\":\\"test\\"}</code> → <code>{"name":"test"}</code></li>
        <li><strong>Wrapped strings:</strong> <code>"{\\"a\\":1}"</code> → <code>{"a":1}</code></li>
        <li><strong>Escape sequences:</strong> \\n, \\t, \\r, \\\\</li>
      </ul>
      <p>Common when JSON is embedded in other JSON or extracted from log files.</p>
    `
  },
  {
    title: 'HTML & Unicode',
    icon: 'fas fa-code',
    content: `
      <p>Decode HTML entities and Unicode escape sequences:</p>
      <ul>
        <li><strong>Numeric entities:</strong> <code>&#123;</code> → <code>{</code></li>
        <li><strong>Hex entities:</strong> <code>&#x7B;</code> → <code>{</code></li>
        <li><strong>Named entities:</strong> <code>&lt;</code> → <code><</code></li>
        <li><strong>Unicode escapes:</strong> <code>\\u0041</code> → <code>A</code></li>
      </ul>
    `
  },
  {
    title: 'Recursive Decoding',
    icon: 'fas fa-layer-group',
    content: `
      <p>Handle multi-layer encoded data:</p>
      <ul>
        <li><strong>Enable Recursive:</strong> Automatically decode all layers</li>
        <li><strong>Max Iterations:</strong> Set limit to prevent infinite loops (default: 10)</li>
        <li><strong>Decoding Chain:</strong> View which decodings were applied</li>
      </ul>
      <p><strong>Example:</strong> URL → Unicode → Valid JSON</p>
      <p>The decoder stops when valid JSON is found or max iterations reached.</p>
    `
  },
  {
    title: 'Output Formatting',
    icon: 'fas fa-align-left',
    content: `
      <p>Format the decoded JSON output:</p>
      <ul>
        <li><strong>Indentation:</strong> 2 spaces, 4 spaces, or tabs</li>
        <li><strong>Sort Keys:</strong> Alphabetically sort object keys</li>
        <li><strong>Format Toggle:</strong> Enable/disable pretty printing</li>
      </ul>
      <p><strong>Note:</strong> Formatting only applies if the decoded result is valid JSON.</p>
    `
  },
  {
    title: 'Troubleshooting',
    icon: 'fas fa-wrench',
    content: `
      <p>Common issues and solutions:</p>
      <ul>
        <li><strong>Invalid Base64:</strong> Check for missing padding or incorrect characters</li>
        <li><strong>Odd hex length:</strong> Hex strings must have even number of characters</li>
        <li><strong>Incomplete URL encoding:</strong> Look for truncated %XX sequences</li>
        <li><strong>Not valid JSON:</strong> Decoded result may be plain text, not JSON</li>
        <li><strong>Wrong encoding detected:</strong> Use manual mode to select the correct type</li>
      </ul>
      <p><strong>Tip:</strong> Check the "Advanced" tab to see which decodings were applied.</p>
    `
  },
];
