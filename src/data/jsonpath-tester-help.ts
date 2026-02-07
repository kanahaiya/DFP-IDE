/**
 * JSONPath Tester Help Content
 * Help modal content for JSONPath tester tool
 */

export interface HelpSection {
  title: string;
  icon: string;
  content: string;
}

export const jsonpathTesterHelp = {
  toolName: 'JSONPath Tester',
  description: 'Test and debug JSONPath expressions against JSON data in real-time',
  
  sections: [
    {
      title: 'Getting Started',
      icon: 'fas fa-play-circle',
      content: `
        <p><strong>JSONPath</strong> is a query language for JSON, similar to XPath for XML. It lets you extract data from JSON documents using path expressions.</p>
        
        <h4>Quick Start</h4>
        <ol>
          <li>Paste your JSON in the left editor (or load an example)</li>
          <li>Type a JSONPath query starting with <code>$</code></li>
          <li>Results appear instantly on the right</li>
        </ol>
        
        <h4>Basic Examples</h4>
        <ul>
          <li><code>$</code> - The entire JSON document</li>
          <li><code>$.name</code> - The "name" property at root</li>
          <li><code>$.users[0]</code> - First user in array</li>
          <li><code>$.users[*].name</code> - All user names</li>
        </ul>
      `,
    },
    {
      title: 'JSONPath Syntax Reference',
      icon: 'fas fa-search',
      content: `
        <h4>Basic Operators</h4>
        <table class="help-table">
          <tr><td><code>$</code></td><td>Root element (always starts here)</td></tr>
          <tr><td><code>@</code></td><td>Current element in filters</td></tr>
          <tr><td><code>.property</code></td><td>Child property (dot notation)</td></tr>
          <tr><td><code>['property']</code></td><td>Child property (bracket notation)</td></tr>
          <tr><td><code>*</code></td><td>Wildcard - all elements</td></tr>
          <tr><td><code>..</code></td><td>Recursive descent - search all levels</td></tr>
        </table>
        
        <h4>Array Operations</h4>
        <table class="help-table">
          <tr><td><code>[n]</code></td><td>Element at index n (0-based)</td></tr>
          <tr><td><code>[-n]</code></td><td>Element from end ([-1] = last)</td></tr>
          <tr><td><code>[start:end]</code></td><td>Slice from start to end-1</td></tr>
          <tr><td><code>[start:end:step]</code></td><td>Slice with step</td></tr>
          <tr><td><code>[a,b,c]</code></td><td>Union - multiple indices</td></tr>
        </table>
        
        <h4>Filter Expressions</h4>
        <table class="help-table">
          <tr><td><code>[?(@.price)]</code></td><td>Elements with price property</td></tr>
          <tr><td><code>[?(@.price &lt; 10)]</code></td><td>Elements where price &lt; 10</td></tr>
          <tr><td><code>[?(@.name == 'John')]</code></td><td>Exact match</td></tr>
          <tr><td><code>[?(@.a && @.b)]</code></td><td>Multiple conditions (AND)</td></tr>
          <tr><td><code>[?(@.a || @.b)]</code></td><td>Either condition (OR)</td></tr>
        </table>
      `,
    },
    {
      title: 'Examples',
      icon: 'fas fa-lightbulb',
      content: `
        <h4>Given this JSON:</h4>
        <pre><code>{
  "store": {
    "book": [
      { "title": "Book 1", "price": 8.95 },
      { "title": "Book 2", "price": 12.99 },
      { "title": "Book 3", "price": 22.99 }
    ],
    "bicycle": { "color": "red", "price": 19.95 }
  }
}</code></pre>

        <h4>Query Examples:</h4>
        <table class="help-table">
          <tr><td><code>$.store.book[*].title</code></td><td>All book titles</td></tr>
          <tr><td><code>$..price</code></td><td>All prices (recursive)</td></tr>
          <tr><td><code>$.store.book[0]</code></td><td>First book</td></tr>
          <tr><td><code>$.store.book[-1]</code></td><td>Last book</td></tr>
          <tr><td><code>$.store.book[0:2]</code></td><td>First two books</td></tr>
          <tr><td><code>$.store.book[?(@.price &lt; 10)]</code></td><td>Books under $10</td></tr>
          <tr><td><code>$.store.*</code></td><td>Everything in store</td></tr>
          <tr><td><code>$..book[?(@.price &lt; 20)]</code></td><td>Cheap books anywhere</td></tr>
        </table>
      `,
    },
    {
      title: 'Settings',
      icon: 'fas fa-cog',
      content: `
        <h4>Auto-Execute</h4>
        <p>When enabled, queries run automatically as you type with a configurable delay (debounce). Disable for large files or when crafting complex queries.</p>
        
        <h4>Result Format</h4>
        <ul>
          <li><strong>JSON</strong> - Pretty-printed JSON results</li>
          <li><strong>Table</strong> - Structured rows and columns</li>
          <li><strong>Tree</strong> - Collapsible tree navigation</li>
        </ul>
        
        <h4>Show Paths</h4>
        <p>Display the JSONPath and JSON Pointer for each matched value, showing exactly where it exists in the original document.</p>
        
        <h4>Presets</h4>
        <ul>
          <li><strong>Default</strong> - Balanced for general use</li>
          <li><strong>Debug</strong> - Shows all paths and details</li>
          <li><strong>Performance</strong> - Optimized for large files</li>
          <li><strong>Compact</strong> - Minimal output</li>
        </ul>
      `,
    },
    {
      title: 'Tips & Tricks',
      icon: 'fas fa-magic',
      content: `
        <h4>Query Building Tips</h4>
        <ul>
          <li>Start simple and add complexity—test <code>$.users</code> before <code>$.users[?(@.age &gt; 30)]</code></li>
          <li>Use <code>$</code> alone to see your entire JSON structure</li>
          <li>Wildcard <code>*</code> helps discover property names</li>
          <li>Recursive <code>..</code> finds properties at any depth</li>
        </ul>
        
        <h4>Debugging Queries</h4>
        <ul>
          <li>Check the error message for syntax issues</li>
          <li>Verify property names are case-sensitive matches</li>
          <li>Arrays need <code>[n]</code> access, not <code>.n</code></li>
          <li>String values in filters need quotes: <code>@.status == 'active'</code></li>
        </ul>
        
        <h4>Performance</h4>
        <ul>
          <li>Disable auto-execute for files over 1MB</li>
          <li>Avoid <code>$..*</code> on large documents</li>
          <li>Be specific in paths when possible</li>
        </ul>
      `,
    },
    {
      title: 'Keyboard Shortcuts',
      icon: 'fas fa-keyboard',
      content: `
        <table class="help-table">
          <tr><td><kbd>Ctrl/Cmd + Enter</kbd></td><td>Execute query</td></tr>
          <tr><td><kbd>Ctrl/Cmd + K</kbd></td><td>Clear all</td></tr>
          <tr><td><kbd>Ctrl/Cmd + Shift + F</kbd></td><td>Format JSON</td></tr>
          <tr><td><kbd>Ctrl/Cmd + C</kbd></td><td>Copy results (when focused)</td></tr>
          <tr><td><kbd>Escape</kbd></td><td>Close help modal</td></tr>
        </table>
      `,
    },
  ] as HelpSection[],
};
