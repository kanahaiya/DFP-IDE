export const jsonToOpenAPIHelpSections = [
  {
    title: 'Getting Started',
    icon: 'fas fa-rocket',
    content: `
      <p>Welcome to the JSON to OpenAPI Generator! This tool helps you convert JSON examples into production-ready OpenAPI 3.0 or Swagger 2.0 specifications.</p>
      <p><strong>Quick Start:</strong></p>
      <ol>
        <li>Paste your JSON data into the left editor</li>
        <li>Configure your API endpoint settings in the right sidebar</li>
        <li>Choose your output format (JSON or YAML)</li>
        <li>Copy or download the generated OpenAPI specification</li>
      </ol>
    `
  },
  {
    title: 'Input Methods',
    icon: 'fas fa-file-import',
    content: `
      <p>You can provide JSON data in multiple ways:</p>
      <ul>
        <li><strong>Paste:</strong> Copy JSON from anywhere and paste it into the editor</li>
        <li><strong>File Upload:</strong> Click the <code>Upload File</code> button to select a JSON file from your computer</li>
        <li><strong>URL Load:</strong> Click <code>Load from URL</code> to fetch JSON from an API endpoint</li>
        <li><strong>Drag & Drop:</strong> Drag JSON files directly onto the editor</li>
        <li><strong>Sample Templates:</strong> Use the <code>Load Sample</code> button to try pre-configured examples</li>
      </ul>
      <p><strong>Supported Formats:</strong> Standard JSON objects and arrays. The tool automatically detects data types, formats, and nested structures.</p>
    `
  },
  {
    title: 'Output Settings',
    icon: 'fas fa-cog',
    content: `
      <p>Customize your OpenAPI specification using the settings panel:</p>
      <ul>
        <li><strong>OpenAPI Version:</strong> Choose between OpenAPI 3.0 or Swagger 2.0</li>
        <li><strong>Output Format:</strong> Toggle between JSON and YAML formats</li>
        <li><strong>Include Examples:</strong> Add example values from your input JSON</li>
        <li><strong>Required Fields:</strong> Mark all fields as required by default</li>
        <li><strong>Additional Properties:</strong> Allow extra properties in schemas</li>
        <li><strong>Type Coercion:</strong> Automatically convert string numbers to number types</li>
        <li><strong>Descriptions:</strong> Include auto-generated field descriptions</li>
      </ul>
    `
  },
  {
    title: 'Endpoint Management',
    icon: 'fas fa-network-wired',
    content: `
      <p>Configure multiple API endpoints for your specification:</p>
      <ul>
        <li><strong>Path:</strong> Set the endpoint path (e.g., <code>/users</code>, <code>/products/{id}</code>)</li>
        <li><strong>Method:</strong> Choose HTTP method (GET, POST, PUT, PATCH, DELETE)</li>
        <li><strong>Description:</strong> Add a summary of what this endpoint does</li>
        <li><strong>Tags:</strong> Organize endpoints with tags for better documentation</li>
      </ul>
      <p>Use the <code>+ Add Endpoint</code> button to create multiple endpoints in a single specification.</p>
    `
  },
  {
    title: 'Smart Type Detection',
    icon: 'fas fa-magic',
    content: `
      <p>The tool automatically detects various data types and formats:</p>
      <ul>
        <li><strong>Email:</strong> Strings matching email patterns → <code>format: "email"</code></li>
        <li><strong>UUID:</strong> Strings matching UUID patterns → <code>format: "uuid"</code></li>
        <li><strong>Date-Time:</strong> ISO 8601 date strings → <code>format: "date-time"</code></li>
        <li><strong>URL:</strong> Valid URL strings → <code>format: "uri"</code></li>
        <li><strong>Numbers:</strong> Distinguishes between integers and floats</li>
        <li><strong>Booleans:</strong> Recognizes true/false values</li>
        <li><strong>Arrays:</strong> Detects item types and creates schemas</li>
        <li><strong>Objects:</strong> Processes nested structures recursively</li>
      </ul>
    `
  },
  {
    title: 'Keyboard Shortcuts',
    icon: 'fas fa-keyboard',
    content: `
      <p>Work faster with these keyboard shortcuts:</p>
      <ul>
        <li><code>Ctrl/Cmd + V</code> - Paste JSON data</li>
        <li><code>Ctrl/Cmd + A</code> - Select all text</li>
        <li><code>Ctrl/Cmd + C</code> - Copy selected text</li>
        <li><code>Ctrl/Cmd + Z</code> - Undo changes</li>
        <li><code>Ctrl/Cmd + Shift + Z</code> - Redo changes</li>
        <li><code>Ctrl/Cmd + F</code> - Find in editor</li>
        <li><code>Ctrl/Cmd + H</code> - Find and replace</li>
        <li><code>Alt + Up/Down</code> - Move line up/down</li>
      </ul>
    `
  },
  {
    title: 'Preview & Validation',
    icon: 'fas fa-eye',
    content: `
      <p>Use the toolbar buttons to work with your generated specification:</p>
      <ul>
        <li><strong>Copy:</strong> Copy the entire specification to clipboard</li>
        <li><strong>Download:</strong> Save as a file (<code>.json</code> or <code>.yaml</code>)</li>
        <li><strong>Clear:</strong> Reset the output editor</li>
        <li><strong>Validate:</strong> Check if the specification is valid OpenAPI/Swagger</li>
        <li><strong>Preview:</strong> View interactive API documentation using Swagger UI</li>
      </ul>
      <p>The preview feature lets you see exactly how your API documentation will appear to end users.</p>
    `
  },
  {
    title: 'Privacy & Security',
    icon: 'fas fa-shield-alt',
    content: `
      <p><strong>100% Client-Side Processing</strong></p>
      <p>Your data never leaves your browser. All conversion happens locally on your device:</p>
      <ul>
        <li>No uploads to servers</li>
        <li>No data storage or logging</li>
        <li>No tracking or analytics on your data</li>
        <li>Works completely offline after initial page load</li>
      </ul>
      <p>This tool is perfect for working with sensitive API data, as everything stays private on your machine.</p>
    `
  },
  {
    title: 'Common Issues & Tips',
    icon: 'fas fa-lightbulb',
    content: `
      <p><strong>Troubleshooting:</strong></p>
      <ul>
        <li><strong>Invalid JSON:</strong> Ensure your input is valid JSON (use a validator if needed)</li>
        <li><strong>Empty Output:</strong> Check that you've added at least one endpoint configuration</li>
        <li><strong>Missing Fields:</strong> Arrays should have at least one item for proper schema detection</li>
        <li><strong>Type Mismatch:</strong> Arrays with mixed types will use the most common type detected</li>
      </ul>
      <p><strong>Best Practices:</strong></p>
      <ul>
        <li>Use representative sample data with all possible fields</li>
        <li>Include at least one item in arrays for accurate schema generation</li>
        <li>Add descriptions to make your API documentation more useful</li>
        <li>Use tags to organize endpoints logically</li>
        <li>Test your generated specification in the preview before using it</li>
      </ul>
    `
  },
  {
    title: 'Export & Integration',
    icon: 'fas fa-download',
    content: `
      <p>Once you've generated your OpenAPI specification, you can:</p>
      <ul>
        <li><strong>Copy to Clipboard:</strong> Use the copy button to paste into your project</li>
        <li><strong>Download as File:</strong> Save as <code>openapi.json</code> or <code>openapi.yaml</code></li>
        <li><strong>Use in Tools:</strong> Import into Postman, Swagger Editor, or other API tools</li>
        <li><strong>Generate Code:</strong> Use Swagger Codegen to create client libraries</li>
        <li><strong>Document APIs:</strong> Host with Swagger UI, Redoc, or similar documentation tools</li>
      </ul>
    `
  }
];
