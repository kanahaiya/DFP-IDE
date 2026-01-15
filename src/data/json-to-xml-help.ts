export const jsonToXMLHelpSections = [
  {
    title: 'Getting Started',
    icon: 'fas fa-rocket',
    content: `
      <p>Welcome to the JSON to XML Converter! This tool transforms JSON data into well-formed XML with extensive customization options for formatting, array handling, and special characters.</p>
      <p><strong>Quick Start:</strong></p>
      <ol>
        <li>Paste your JSON data (or drag & drop a .json file)</li>
        <li>Choose a preset or customize settings</li>
        <li>View the XML output in real-time</li>
        <li>Copy or download the converted XML</li>
      </ol>
    `
  },
  {
    title: 'JSON to XML Conversion',
    icon: 'fas fa-file-code',
    content: `
      <p>Convert JSON to XML with powerful customization options:</p>
      <ul>
        <li><strong>Real-Time Conversion:</strong> JSON converts to XML automatically as you type</li>
        <li><strong>Smart Presets:</strong> One-click formatting for RSS, Sitemap, SOAP, Android, and more</li>
        <li><strong>Custom Root Element:</strong> Define your own root element name</li>
        <li><strong>XML Declaration:</strong> Include or exclude the XML declaration header</li>
      </ul>
      <p><strong>Tip:</strong> Use the "Readable" preset for human-friendly XML output.</p>
    `
  },
  {
    title: 'Input Methods',
    icon: 'fas fa-file-import',
    content: `
      <p>Multiple ways to provide JSON data:</p>
      <ul>
        <li><strong>Paste:</strong> Copy JSON from anywhere and paste into the editor</li>
        <li><strong>File Upload:</strong> Click <code>Upload File</code> to select .json files</li>
        <li><strong>Drag & Drop:</strong> Drag JSON files directly onto the editor panel</li>
        <li><strong>Sample Templates:</strong> Use <code>Load Sample</code> for examples (RSS, Sitemap, Config, etc.)</li>
      </ul>
      <p><strong>Supported Formats:</strong> Standard JSON files up to 10MB.</p>
    `
  },
  {
    title: 'Format Settings',
    icon: 'fas fa-sliders-h',
    content: `
      <p>Customize XML output formatting:</p>
      <ul>
        <li><strong>Root Element:</strong> Name of the wrapping root element (default: "root")</li>
        <li><strong>XML Declaration:</strong> Toggle &lt;?xml version="1.0" encoding="UTF-8"?&gt;</li>
        <li><strong>Encoding:</strong> UTF-8 (recommended), UTF-16, ISO-8859-1, or US-ASCII</li>
        <li><strong>Indentation:</strong> 2 spaces, 4 spaces, tabs, or no indentation (minified)</li>
        <li><strong>Line Breaks:</strong> Add newlines between elements for readability</li>
      </ul>
      <p><strong>Best Practice:</strong> Use 2-space indentation with line breaks for readable XML.</p>
    `
  },
  {
    title: 'Array Handling',
    icon: 'fas fa-list',
    content: `
      <p>Control how JSON arrays are converted to XML:</p>
      <ul>
        <li><strong>Array Wrapper:</strong> Optionally wrap array items in a container element</li>
        <li><strong>Wrapper Name:</strong> Custom name for the wrapper element (e.g., "items")</li>
        <li><strong>Item Naming:</strong>
          <ul>
            <li>Singular form: "users" → "user" items</li>
            <li>Custom: Use your own item element name</li>
            <li>Parent key: Use the array key name for each item</li>
          </ul>
        </li>
        <li><strong>Index Attribute:</strong> Add index="0" attribute to preserve order</li>
      </ul>
      <p><strong>Example:</strong> {"users": ["John", "Jane"]} → &lt;user&gt;John&lt;/user&gt;&lt;user&gt;Jane&lt;/user&gt;</p>
    `
  },
  {
    title: 'Data Type Handling',
    icon: 'fas fa-database',
    content: `
      <p>Configure how different data types are converted:</p>
      <ul>
        <li><strong>CDATA Wrapping:</strong>
          <ul>
            <li>Auto: Wrap text with special characters (&lt;, &gt;, &amp;) in CDATA</li>
            <li>Force: Always use CDATA for text content</li>
            <li>Disabled: Use XML entity encoding instead</li>
          </ul>
        </li>
        <li><strong>Null Values:</strong> Self-closing tag, empty element, omit, or custom text</li>
        <li><strong>Booleans:</strong> lowercase (true/false), Capitalized (True/False), or Numeric (1/0)</li>
        <li><strong>Attribute Mode:</strong> Convert properties to XML attributes instead of elements</li>
      </ul>
    `
  },
  {
    title: 'Namespace Support',
    icon: 'fas fa-globe',
    content: `
      <p>Add XML namespaces to your output:</p>
      <ul>
        <li><strong>Enable Namespace:</strong> Toggle namespace support on/off</li>
        <li><strong>Namespace URI:</strong> The full namespace URL (e.g., "http://example.com/schema")</li>
        <li><strong>Namespace Prefix:</strong> Optional prefix like "ns" for &lt;ns:element&gt;</li>
      </ul>
      <p><strong>Common Use Cases:</strong></p>
      <ul>
        <li>XML Sitemaps: xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"</li>
        <li>SOAP: xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"</li>
        <li>Custom schemas for validation</li>
      </ul>
    `
  },
  {
    title: 'Presets for Common Use Cases',
    icon: 'fas fa-magic',
    content: `
      <p>One-click formatting for common XML formats:</p>
      <ul>
        <li><strong>Readable:</strong> Human-readable with 2-space indentation</li>
        <li><strong>Compact:</strong> Minified XML without whitespace</li>
        <li><strong>Attribute Mode:</strong> Convert simple values to XML attributes</li>
        <li><strong>SOAP/Web Services:</strong> Format suitable for SOAP messages</li>
        <li><strong>Configuration:</strong> XML format for config files with sorted keys</li>
        <li><strong>Android Resources:</strong> Android XML resource file format</li>
        <li><strong>RSS Feed:</strong> RSS feed structure with channel wrapper</li>
        <li><strong>XML Sitemap:</strong> Search engine sitemap format with namespace</li>
      </ul>
      <p><strong>How to use:</strong> Click a preset card to instantly apply its settings.</p>
    `
  },
  {
    title: 'Key Transformation',
    icon: 'fas fa-key',
    content: `
      <p>Transform JSON keys to different naming conventions:</p>
      <ul>
        <li><strong>Sort Keys:</strong> Alphabetically sort object keys for deterministic output</li>
        <li><strong>Key Transform:</strong>
          <ul>
            <li>None: Keep original key names</li>
            <li>lowercase: convert to lowercase</li>
            <li>UPPERCASE: CONVERT TO UPPERCASE</li>
            <li>camelCase: convert to camelCase</li>
            <li>kebab-case: convert to kebab-case</li>
          </ul>
        </li>
      </ul>
      <p><strong>Tip:</strong> Enable "Sort Keys" for git-friendly, reproducible output.</p>
    `
  },
  {
    title: 'Tab Management',
    icon: 'fas fa-layer-group',
    content: `
      <p>Work on multiple conversions simultaneously:</p>
      <ul>
        <li><strong>Multiple Tabs:</strong> Open up to 10 independent conversion sessions</li>
        <li><strong>Per-Tab Settings:</strong> Each tab remembers its own settings</li>
        <li><strong>Rename Tabs:</strong> Double-click tab title to give it a meaningful name</li>
        <li><strong>Duplicate Tab:</strong> Right-click and select "Duplicate" to clone a session</li>
        <li><strong>Persistence:</strong> Tabs are saved to browser storage</li>
      </ul>
      <p><strong>Keyboard Shortcut:</strong> Ctrl/Cmd+T to add a new tab.</p>
    `
  },
  {
    title: 'Export Options',
    icon: 'fas fa-download',
    content: `
      <p>Save and share your converted XML:</p>
      <ul>
        <li><strong>Copy:</strong> One-click clipboard copy with success notification</li>
        <li><strong>Download:</strong> Save as .xml file with timestamp</li>
        <li><strong>Share:</strong> Generate shareable URL (coming soon)</li>
      </ul>
      <p><strong>File Naming:</strong> Downloaded files are named with timestamp (e.g., converted-2026-01-15.xml)</p>
    `
  },
  {
    title: 'Privacy & Security',
    icon: 'fas fa-shield-alt',
    content: `
      <p>Your data never leaves your browser:</p>
      <ul>
        <li><strong>100% Client-Side:</strong> All conversion happens locally in your browser</li>
        <li><strong>No Server Uploads:</strong> Files and data are never sent to any server</li>
        <li><strong>No Tracking:</strong> We don't log, store, or analyze your content</li>
        <li><strong>Offline Capable:</strong> Works without internet connection after page loads</li>
      </ul>
      <p><strong>Safe for sensitive data:</strong> Perfect for converting API keys, configs, or proprietary data.</p>
    `
  },
  {
    title: 'Keyboard Shortcuts',
    icon: 'fas fa-keyboard',
    content: `
      <p>Speed up your workflow:</p>
      <ul>
        <li><code>Ctrl/Cmd + V</code> - Paste data into input</li>
        <li><code>Ctrl/Cmd + C</code> - Copy output to clipboard (when focused)</li>
        <li><code>Ctrl/Cmd + T</code> - Add new tab</li>
        <li><code>Ctrl/Cmd + W</code> - Close current tab</li>
        <li><code>Ctrl/Cmd + S</code> - Download output file</li>
        <li><code>F1</code> - Open this help modal</li>
      </ul>
    `
  },
  {
    title: 'Troubleshooting',
    icon: 'fas fa-question-circle',
    content: `
      <p>Common issues and solutions:</p>
      <ul>
        <li><strong>"Invalid JSON":</strong> Check for missing quotes, commas, or brackets. Use a JSON validator.</li>
        <li><strong>"Invalid element name":</strong> XML element names can't start with numbers. Keys are automatically sanitized.</li>
        <li><strong>"Special characters showing wrong":</strong> Try enabling CDATA mode for text with &lt;, &gt;, or &amp; characters.</li>
        <li><strong>"Output is minified":</strong> Enable "Line Breaks" and set indentation in Format settings.</li>
        <li><strong>"Lost my tabs":</strong> Tabs are saved per-browser. Clear cache = lost tabs.</li>
      </ul>
      <p><strong>Still stuck?</strong> Try loading a sample template to verify the tool is working, then compare with your data.</p>
    `
  }
];
