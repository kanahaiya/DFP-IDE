export const csvToJSONHelpSections = [
  {
    title: 'Getting Started',
    icon: 'fas fa-rocket',
    content: `
      <p>Welcome to the CSV to JSON Converter! This tool helps you transform CSV (Comma-Separated Values) files into structured JSON format with advanced parsing options.</p>
      <p><strong>Quick Start:</strong></p>
      <ol>
        <li>Paste your CSV data or drag & drop a CSV file</li>
        <li>Configure delimiter and parsing options (or use auto-detect)</li>
        <li>Choose your JSON output format</li>
        <li>Copy or download the generated JSON</li>
      </ol>
    `
  },
  {
    title: 'Input Methods',
    icon: 'fas fa-file-import',
    content: `
      <p>Multiple ways to provide CSV data:</p>
      <ul>
        <li><strong>Paste:</strong> Copy CSV from anywhere and paste into the editor</li>
        <li><strong>File Upload:</strong> Click <code>Upload File</code> to select a .csv or .txt file</li>
        <li><strong>Drag & Drop:</strong> Drag CSV files directly onto the editor panel</li>
        <li><strong>Sample Templates:</strong> Use <code>Load Sample</code> to try pre-configured examples</li>
      </ul>
      <p><strong>Supported Formats:</strong> Standard CSV (comma), European CSV (semicolon), TSV (tab), pipe-delimited, and custom delimiters.</p>
    `
  },
  {
    title: 'Delimiter Options',
    icon: 'fas fa-sliders-h',
    content: `
      <p>Configure how CSV columns are separated:</p>
      <ul>
        <li><strong>Auto-detect:</strong> Automatically identifies comma, semicolon, tab, or pipe delimiters</li>
        <li><strong>Comma (,):</strong> Standard CSV format used by most tools</li>
        <li><strong>Semicolon (;):</strong> European CSV format common in Excel exports</li>
        <li><strong>Tab (\\t):</strong> Tab-Separated Values (TSV) format</li>
        <li><strong>Pipe (|):</strong> Pipe-delimited format for database exports</li>
        <li><strong>Custom:</strong> Enter any single character as delimiter</li>
      </ul>
      <p>Auto-detect works for 99% of CSV files. Use manual selection only if auto-detection fails.</p>
    `
  },
  {
    title: 'CSV Structure Settings',
    icon: 'fas fa-file-csv',
    content: `
      <p>Control how the tool interprets your CSV structure:</p>
      <ul>
        <li><strong>First row as header:</strong> Treat the first row as column names (creates objects with named properties)</li>
        <li><strong>Trim whitespace:</strong> Remove leading/trailing spaces from values</li>
        <li><strong>Skip empty lines:</strong> Ignore blank rows in the CSV file</li>
        <li><strong>Handle quoted fields:</strong> Support RFC 4180 quote handling (values with commas, newlines)</li>
        <li><strong>Escape characters:</strong> Process escape sequences in values</li>
      </ul>
      <p><strong>Tip:</strong> Enable all options for cleanest output. Disable "First row as header" for headerless CSV files.</p>
    `
  },
  {
    title: 'Data Type Parsing',
    icon: 'fas fa-magic',
    content: `
      <p>Automatically convert string values to appropriate types:</p>
      <ul>
        <li><strong>Parse numbers:</strong> Convert "123" → 123, "45.67" → 45.67, scientific notation supported</li>
        <li><strong>Parse booleans:</strong> Convert "true"/"false", "yes"/"no", "1"/"0" → true/false</li>
        <li><strong>Parse null values:</strong> Convert empty strings, "null", "NULL" → null</li>
        <li><strong>Parse dates:</strong> Detect ISO format dates (YYYY-MM-DD, ISO 8601)</li>
      </ul>
      <p><strong>Why use type parsing?</strong> Creates properly typed JSON for APIs and JavaScript—numbers as numbers, not strings. Disable if you need everything as strings.</p>
    `
  },
  {
    title: 'JSON Output Formats',
    icon: 'fas fa-code',
    content: `
      <p>Choose how CSV data is structured in JSON:</p>
      <ul>
        <li><strong>Array of Objects:</strong> Standard format <code>[{"name":"John","age":30},...]</code></li>
        <li><strong>Keyed Object:</strong> First column as keys <code>{"John":{"age":30},...}</code></li>
        <li><strong>Column Arrays:</strong> Group by columns <code>{"name":["John","Jane"],"age":[30,25]}</code></li>
        <li><strong>Nested JSON:</strong> Dot notation creates hierarchy (e.g., "address.city" → <code>{"address":{"city":"..."}}</code>)</li>
      </ul>
      <p><strong>Use cases:</strong> Array of Objects for APIs, Keyed Object for lookups, Column Arrays for charting libraries, Nested JSON for complex structures.</p>
    `
  },
  {
    title: 'Formatting Options',
    icon: 'fas fa-indent',
    content: `
      <p>Customize JSON output appearance:</p>
      <ul>
        <li><strong>2 spaces:</strong> Compact indentation (default, recommended)</li>
        <li><strong>4 spaces:</strong> More readable indentation</li>
        <li><strong>Tab:</strong> Tab-based indentation</li>
        <li><strong>Minified:</strong> No whitespace (smallest file size)</li>
      </ul>
      <p><strong>Additional options:</strong></p>
      <ul>
        <li><strong>Sort keys alphabetically:</strong> Consistent property order</li>
        <li><strong>Compact output:</strong> Remove unnecessary whitespace</li>
      </ul>
    `
  },
  {
    title: 'Export & Download',
    icon: 'fas fa-download',
    content: `
      <p>Multiple ways to use your converted JSON:</p>
      <ul>
        <li><strong>Copy:</strong> Click "Copy" to copy JSON to clipboard</li>
        <li><strong>Download:</strong> Click "Download" to save as .json file with timestamp</li>
        <li><strong>Validate:</strong> Click "Validate" to check JSON syntax</li>
        <li><strong>Share:</strong> Generate a shareable URL (encodes CSV in URL)</li>
      </ul>
      <p><strong>Keyboard shortcuts:</strong></p>
      <ul>
        <li><code>Ctrl/Cmd + Enter</code>: Convert CSV to JSON</li>
        <li><code>Ctrl/Cmd + S</code>: Download JSON file</li>
        <li><code>Ctrl/Cmd + K</code>: Copy to clipboard</li>
      </ul>
    `
  },
  {
    title: 'Privacy & Security',
    icon: 'fas fa-shield-alt',
    content: `
      <p><strong>100% Client-Side Processing</strong></p>
      <p>Your CSV data never leaves your browser. All conversion happens locally:</p>
      <ul>
        <li>No uploads to servers</li>
        <li>No data storage or logging</li>
        <li>No tracking or analytics on your data</li>
        <li>Works completely offline after page load</li>
        <li>GDPR compliant by design</li>
      </ul>
      <p>Perfect for confidential data, personal information, or sensitive business records. The tool uses PapaParse library for local parsing.</p>
    `
  },
  {
    title: 'Common Use Cases',
    icon: 'fas fa-lightbulb',
    content: `
      <p><strong>When to use CSV to JSON conversion:</strong></p>
      <ul>
        <li><strong>API Preparation:</strong> Convert spreadsheet data to JSON for REST APIs</li>
        <li><strong>Database Migration:</strong> Migrate CSV exports to NoSQL databases (MongoDB, Firestore)</li>
        <li><strong>Frontend Data:</strong> Create JSON data files for React/Vue/Angular apps</li>
        <li><strong>Testing:</strong> Generate test fixtures and mock data from CSV test cases</li>
        <li><strong>Configuration:</strong> Transform CSV settings to JSON config files</li>
        <li><strong>Data Visualization:</strong> Prepare CSV data for D3.js, Chart.js libraries</li>
      </ul>
    `
  },
  {
    title: 'Troubleshooting',
    icon: 'fas fa-question-circle',
    content: `
      <p><strong>Common issues and solutions:</strong></p>
      <ul>
        <li><strong>Wrong delimiter detected:</strong> Manually select delimiter instead of auto-detect</li>
        <li><strong>Missing columns:</strong> Ensure CSV has consistent column counts per row</li>
        <li><strong>Quotes not handled:</strong> Enable "Handle quoted fields" in advanced options</li>
        <li><strong>Numbers as strings:</strong> Enable "Parse numbers" in data type parsing</li>
        <li><strong>Empty output:</strong> Check CSV format—try different delimiter or disable header option</li>
        <li><strong>Special characters broken:</strong> Ensure CSV file encoding is UTF-8</li>
      </ul>
      <p><strong>Best practices:</strong></p>
      <ul>
        <li>Use UTF-8 encoding for CSV files with special characters</li>
        <li>Include header row for more readable JSON (named properties)</li>
        <li>Quote fields containing delimiters or newlines</li>
        <li>Test with sample data before processing large files</li>
        <li>Enable type parsing for cleaner JSON output</li>
      </ul>
    `
  },
  {
    title: 'Nested JSON with Dot Notation',
    icon: 'fas fa-sitemap',
    content: `
      <p>Create hierarchical JSON from flat CSV using dot notation in headers:</p>
      <p><strong>Example CSV:</strong></p>
      <pre>person.name,person.age,address.city,address.zip
John,30,New York,10001
Jane,25,Los Angeles,90001</pre>
      <p><strong>Becomes nested JSON:</strong></p>
      <pre>[
  {
    "person": {"name": "John", "age": 30},
    "address": {"city": "New York", "zip": "10001"}
  },
  {
    "person": {"name": "Jane", "age": 25},
    "address": {"city": "Los Angeles", "zip": "90001"}
  }
]</pre>
      <p>Use multiple dots for deeper nesting: "company.office.location.country"</p>
    `
  },
  {
    title: 'Performance Tips',
    icon: 'fas fa-tachometer-alt',
    content: `
      <p><strong>Optimizing conversion performance:</strong></p>
      <ul>
        <li><strong>Small files (&lt;100KB):</strong> Convert instantly (< 100ms)</li>
        <li><strong>Medium files (100KB-1MB):</strong> ~1 second conversion time</li>
        <li><strong>Large files (1-5MB):</strong> 2-3 seconds, no performance issues</li>
        <li><strong>Very large files (5-10MB):</strong> 5-10 seconds, may show progress</li>
      </ul>
      <p><strong>Tips for large files:</strong></p>
      <ul>
        <li>Use modern browsers (Chrome, Firefox, Edge) for best performance</li>
        <li>Disable real-time conversion (it has a 500ms debounce)</li>
        <li>Consider splitting huge datasets into smaller chunks</li>
        <li>Disable unnecessary type parsing if speed is critical</li>
      </ul>
    `
  }
];
