export const jsonToYAMLHelpSections = [
  {
    title: 'Getting Started',
    icon: 'fas fa-rocket',
    content: `
      <p>Welcome to the JSON to YAML Converter! This tool converts JSON data to YAML format with smart formatting and presets for Kubernetes, Docker Compose, Ansible, and more.</p>
      <p><strong>Quick Start:</strong></p>
      <ol>
        <li>Paste your JSON data (or drag & drop a .json file)</li>
        <li>Choose a formatting preset or customize settings</li>
        <li>View the YAML output in real-time</li>
        <li>Copy or download the converted YAML</li>
      </ol>
    `
  },
  {
    title: 'JSON to YAML Conversion',
    icon: 'fas fa-arrow-right',
    content: `
      <p>Convert JSON to YAML with powerful formatting options:</p>
      <ul>
        <li><strong>Real-Time Conversion:</strong> JSON converts to YAML automatically as you type</li>
        <li><strong>Smart Presets:</strong> One-click formatting for Kubernetes, Docker, Ansible, and more</li>
        <li><strong>Custom Formatting:</strong> Control indentation, quotes, flow style, and line width</li>
      </ul>
      <p><strong>Tip:</strong> Use the Kubernetes preset for kubectl-compatible YAML manifests.</p>
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
        <li><strong>Sample Templates:</strong> Use <code>Load Sample</code> for examples (Kubernetes, Docker Compose, etc.)</li>
      </ul>
      <p><strong>Supported Formats:</strong> Standard JSON and JSON5-like syntax with comments.</p>
    `
  },
  {
    title: 'Format Settings',
    icon: 'fas fa-sliders-h',
    content: `
      <p>Customize YAML output formatting:</p>
      <ul>
        <li><strong>Indentation:</strong> Choose 2 spaces, 4 spaces, or tabs for hierarchical structure</li>
        <li><strong>Quote Style:</strong> Auto, single quotes, double quotes, or no quotes</li>
        <li><strong>Flow Style:</strong> Block (readable, multi-line) vs Flow (compact, inline) vs Mixed</li>
        <li><strong>Line Width:</strong> Maximum line length before wrapping (-1 for no limit)</li>
      </ul>
      <p><strong>Best Practice:</strong> Use 2-space indentation with block style for Kubernetes/Docker configs.</p>
    `
  },
  {
    title: 'Advanced Options',
    icon: 'fas fa-cogs',
    content: `
      <p>Fine-tune conversion behavior:</p>
      <ul>
        <li><strong>Sort Keys:</strong> Alphabetically sort object keys for consistency</li>
        <li><strong>No Circular References:</strong> Prevent infinite loops in recursive structures</li>
        <li><strong>Force Quotes:</strong> Quote all string values regardless of content</li>
        <li><strong>Condense Flow:</strong> Minimize whitespace in flow-style output</li>
        <li><strong>No Compatibility Mode:</strong> Use pure YAML 1.2 without legacy YAML 1.1 types</li>
        <li><strong>Skip Invalid:</strong> Ignore values that cannot be serialized</li>
      </ul>
      <p><strong>Tip:</strong> Enable "Sort Keys" for git-friendly, deterministic output.</p>
    `
  },
  {
    title: 'Presets for Popular Tools',
    icon: 'fas fa-magic',
    content: `
      <p>One-click formatting for common use cases:</p>
      <ul>
        <li><strong>Kubernetes:</strong> Standard formatting for manifests (2 spaces, block style)</li>
        <li><strong>Docker Compose:</strong> Docker-specific YAML conventions</li>
        <li><strong>Ansible:</strong> Playbook-friendly formatting with clean indentation</li>
        <li><strong>OpenAPI:</strong> Swagger/OpenAPI specification formatting</li>
        <li><strong>GitHub Actions:</strong> Workflow file formatting (.github/workflows/)</li>
        <li><strong>Compact Flow:</strong> Minimal, JSON-like YAML for space efficiency</li>
        <li><strong>Sorted Keys:</strong> Alphabetically sorted for version control</li>
      </ul>
      <p><strong>How to use:</strong> Click a preset card to instantly apply its settings.</p>
    `
  },
  {
    title: 'Validation & Error Handling',
    icon: 'fas fa-check-circle',
    content: `
      <p>Real-time JSON validation catches issues before conversion:</p>
      <ul>
        <li><strong>JSON Syntax Check:</strong> Detects missing brackets, invalid escapes, trailing commas</li>
        <li><strong>Error Details:</strong> Shows precise line and column numbers for quick debugging</li>
        <li><strong>Live Feedback:</strong> Validation runs automatically as you type (300ms debounce)</li>
        <li><strong>Stats Bar:</strong> Displays character count, line count, and validation status</li>
      </ul>
      <p><strong>Tip:</strong> Fix all JSON errors before conversion to ensure valid YAML output.</p>
    `
  },
  {
    title: 'Tab Management',
    icon: 'fas fa-layer-group',
    content: `
      <p>Work on multiple conversions simultaneously:</p>
      <ul>
        <li><strong>Multiple Tabs:</strong> Open up to 10 independent conversion sessions</li>
        <li><strong>Per-Tab Settings:</strong> Each tab remembers its own format settings and mode</li>
        <li><strong>Rename Tabs:</strong> Double-click tab title to give it a meaningful name</li>
        <li><strong>Duplicate Tab:</strong> Right-click and select "Duplicate" to clone a session</li>
        <li><strong>Persistence:</strong> Tabs are saved to browser storage—reload anytime</li>
      </ul>
      <p><strong>Keyboard Shortcut:</strong> Ctrl/Cmd+T to add a new tab.</p>
    `
  },
  {
    title: 'Export Options',
    icon: 'fas fa-download',
    content: `
      <p>Save and share your converted YAML:</p>
      <ul>
        <li><strong>Copy:</strong> One-click clipboard copy with success notification</li>
        <li><strong>Download:</strong> Save as .yaml file with timestamp (e.g., converted-2026-01-14.yaml)</li>
        <li><strong>Share:</strong> Generate shareable URL with encoded data (coming soon)</li>
      </ul>
      <p><strong>Tip:</strong> Use the downloaded YAML directly in your Kubernetes, Docker, or Ansible projects.</p>
    `
  },
  {
    title: 'Use Cases',
    icon: 'fas fa-lightbulb',
    content: `
      <p>Common scenarios for JSON to YAML conversion:</p>
      <ul>
        <li><strong>Kubernetes:</strong> Convert JSON config to YAML manifests for kubectl apply</li>
        <li><strong>Docker Compose:</strong> Transform JSON service definitions to docker-compose.yml</li>
        <li><strong>Ansible:</strong> Generate YAML playbooks from JSON configuration data</li>
        <li><strong>CI/CD Pipelines:</strong> Create GitHub Actions/GitLab CI YAML from JSON configs</li>
        <li><strong>API Documentation:</strong> Convert JSON API responses to readable YAML format</li>
        <li><strong>OpenAPI Specs:</strong> Transform JSON OpenAPI definitions to YAML format</li>
      </ul>
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
        <li><strong>Offline Capable:</strong> Works without internet connection</li>
      </ul>
      <p><strong>Safe for sensitive data:</strong> Perfect for converting API keys, secrets, or proprietary configs.</p>
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
        <li><strong>"YAML parse error":</strong> Verify indentation is consistent (spaces only, no tabs mixed in).</li>
        <li><strong>"Output looks wrong":</strong> Try different flow styles or adjust indentation settings.</li>
        <li><strong>"Quotes everywhere":</strong> Disable "Force Quotes" and set Quote Style to "Auto".</li>
        <li><strong>"Lost my tabs":</strong> Tabs are saved per-browser. Clear cache = lost tabs.</li>
      </ul>
      <p><strong>Still stuck?</strong> Try loading a sample template to verify the tool is working, then compare with your data.</p>
    `
  }
];
