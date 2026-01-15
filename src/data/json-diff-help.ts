/**
 * Help documentation for JSON Diff tool
 */

export interface HelpSection {
  id: string;
  title: string;
  content: string;
  icon?: string;
}

export const jsonDiffHelpSections: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'fas fa-rocket',
    content: `
      <h3>How to Use JSON Diff</h3>
      <ol>
        <li><strong>Load JSON Documents:</strong> Paste, upload, or select sample JSON in both left and right panels</li>
        <li><strong>Choose Comparison Strategy:</strong> Select how arrays should be compared (identifier-based, LCS, or index-based)</li>
        <li><strong>Customize Options:</strong> Configure ignore options, type checking, and other comparison settings</li>
        <li><strong>View Results:</strong> Switch between Split, Tree, or Report view to explore changes</li>
        <li><strong>Export:</strong> Download results in your preferred format (JSON Patch, Delta, HTML, CSV, or Unified Diff)</li>
      </ol>
    `,
  },
  {
    id: 'view-modes',
    title: 'View Modes',
    icon: 'fas fa-eye',
    content: `
      <h3>Available View Modes</h3>
      <ul>
        <li><strong>Split View:</strong> Side-by-side comparison with synchronized scrolling and visual highlighting</li>
        <li><strong>Unified View:</strong> Single view with +/- indicators showing additions and removals</li>
        <li><strong>Tree View:</strong> Hierarchical structure showing changes in a collapsible tree format</li>
        <li><strong>Report View:</strong> Detailed tabular report of all changes with statistics</li>
      </ul>
      <p>Switch between views using the View Mode selector in the settings panel.</p>
    `,
  },
  {
    id: 'array-strategies',
    title: 'Array Comparison Strategies',
    icon: 'fas fa-list-ol',
    content: `
      <h3>Choosing the Right Strategy</h3>
      <dl>
        <dt><strong>Identifier-based</strong></dt>
        <dd>Matches array items by id/uuid/key fields. Best for arrays of objects with unique identifiers.</dd>
        
        <dt><strong>LCS Algorithm</strong></dt>
        <dd>Uses Longest Common Subsequence to find semantic similarities. Good for general-purpose comparison.</dd>
        
        <dt><strong>Index-based</strong></dt>
        <dd>Matches items by position in the array. Simple and fast, but may miss reordered items.</dd>
      </dl>
      <p><strong>Tip:</strong> For API responses and database records, use identifier-based matching. For simple arrays, index-based is sufficient.</p>
    `,
  },
  {
    id: 'ignore-options',
    title: 'Ignore Options',
    icon: 'fas fa-filter',
    content: `
      <h3>Customizing Comparison Behavior</h3>
      <ul>
        <li><strong>Ignore Case:</strong> Treat "ABC" and "abc" as equal</li>
        <li><strong>Ignore Whitespace:</strong> Ignore spacing differences in string values</li>
        <li><strong>Ignore Key Order:</strong> Object property order doesn't matter</li>
        <li><strong>Ignore Array Order:</strong> Array items can be in any order (works best with identifier-based strategy)</li>
        <li><strong>Strict Type Checking:</strong> Disable type coercion (e.g., "1" ≠ 1)</li>
        <li><strong>Treat Null as Missing:</strong> null values are treated as if the key doesn't exist</li>
        <li><strong>Float Tolerance:</strong> Set acceptable difference for floating-point comparisons</li>
      </ul>
    `,
  },
  {
    id: 'export-formats',
    title: 'Export Formats',
    icon: 'fas fa-download',
    content: `
      <h3>Supported Export Formats</h3>
      <dl>
        <dt><strong>JSON Patch (RFC 6902)</strong></dt>
        <dd>Standard format for describing changes to a JSON document. Can be applied programmatically.</dd>
        
        <dt><strong>Delta Format</strong></dt>
        <dd>Grouped changes by type (added, removed, modified, etc.) in JSON format.</dd>
        
        <dt><strong>Unified Diff</strong></dt>
        <dd>Traditional diff format with +/- indicators, compatible with version control tools.</dd>
        
        <dt><strong>HTML Report</strong></dt>
        <dd>Styled report with statistics and change details. Supports dark/light themes.</dd>
        
        <dt><strong>CSV</strong></dt>
        <dd>Spreadsheet-friendly format listing all changes with paths and values.</dd>
      </dl>
    `,
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    icon: 'fas fa-keyboard',
    content: `
      <h3>Keyboard Shortcuts</h3>
      <table>
        <tr>
          <td><kbd>Ctrl/Cmd</kbd> + <kbd>↑</kbd></td>
          <td>Previous change</td>
        </tr>
        <tr>
          <td><kbd>Ctrl/Cmd</kbd> + <kbd>↓</kbd></td>
          <td>Next change</td>
        </tr>
        <tr>
          <td><kbd>Ctrl/Cmd</kbd> + <kbd>F</kbd></td>
          <td>Find in editor</td>
        </tr>
        <tr>
          <td><kbd>Ctrl/Cmd</kbd> + <kbd>H</kbd></td>
          <td>Replace in editor</td>
        </tr>
        <tr>
          <td><kbd>Ctrl/Cmd</kbd> + <kbd>S</kbd></td>
          <td>Save/Export current view</td>
        </tr>
        <tr>
          <td><kbd>F1</kbd></td>
          <td>Show this help</td>
        </tr>
      </table>
    `,
  },
  {
    id: 'tips-tricks',
    title: 'Tips & Tricks',
    icon: 'fas fa-lightbulb',
    content: `
      <h3>Pro Tips</h3>
      <ul>
        <li><strong>Use Tabs:</strong> Compare multiple JSON pairs simultaneously using tabs</li>
        <li><strong>Filter Changes:</strong> Focus on specific change types (added, removed, modified) using the filter dropdown</li>
        <li><strong>Sample Templates:</strong> Start with provided samples to learn how different comparison strategies work</li>
        <li><strong>Performance:</strong> For very large JSON files, consider using index-based strategy for faster comparison</li>
        <li><strong>Identifier Fields:</strong> Customize which fields are used as identifiers for array matching (id, uuid, key, _id by default)</li>
        <li><strong>Max Depth:</strong> Limit comparison depth for deeply nested structures to improve performance</li>
      </ul>
    `,
  },
];
