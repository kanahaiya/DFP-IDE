/**
 * JMESPath Query Tester Help Content
 * Help modal content for JMESPath tester tool
 */

export interface HelpSection {
  title: string;
  icon: string;
  content: string;
}

export const jmespathTesterHelp = {
  toolName: 'JMESPath Tester',
  description: 'Test and debug JMESPath queries against JSON data in real-time',
  
  sections: [
    {
      title: 'Getting Started',
      icon: 'fas fa-play-circle',
      content: `
        <p><strong>JMESPath</strong> is a query language for JSON used by AWS CLI and many APIs. It lets you filter, project, and transform JSON data.</p>
        
        <h4>Quick Start</h4>
        <ol>
          <li>Paste your JSON in the left editor (or load an example)</li>
          <li>Type a JMESPath query (no $ prefix needed)</li>
          <li>Results appear instantly on the right</li>
        </ol>
        
        <h4>Basic Examples</h4>
        <ul>
          <li><code>name</code> - Get the "name" property</li>
          <li><code>users[0]</code> - First user in array</li>
          <li><code>users[*].name</code> - All user names</li>
          <li><code>users[?active]</code> - Filter active users</li>
        </ul>
      `,
    },
    {
      title: 'JMESPath Syntax Reference',
      icon: 'fas fa-filter',
      content: `
        <h4>Basic Access</h4>
        <table class="help-table">
          <tr><td><code>identifier</code></td><td>Access property by name</td></tr>
          <tr><td><code>foo.bar</code></td><td>Nested property access</td></tr>
          <tr><td><code>[n]</code></td><td>Array element by index</td></tr>
          <tr><td><code>[-n]</code></td><td>Element from end (-1 = last)</td></tr>
          <tr><td><code>[start:stop]</code></td><td>Array slice</td></tr>
        </table>
        
        <h4>Projections</h4>
        <table class="help-table">
          <tr><td><code>[*]</code></td><td>List projection - iterate array</td></tr>
          <tr><td><code>*</code></td><td>Object projection - all values</td></tr>
          <tr><td><code>[]</code></td><td>Flatten nested arrays</td></tr>
        </table>
        
        <h4>Filters & Conditions</h4>
        <table class="help-table">
          <tr><td><code>[?price < \`10\`]</code></td><td>Filter by condition</td></tr>
          <tr><td><code>[?status == \`active\`]</code></td><td>String equality (use backticks)</td></tr>
          <tr><td><code>[?a && b]</code></td><td>AND condition</td></tr>
          <tr><td><code>[?a || b]</code></td><td>OR condition</td></tr>
        </table>
        
        <h4>Special</h4>
        <table class="help-table">
          <tr><td><code>\`value\`</code></td><td>Literal value (string, number, bool)</td></tr>
          <tr><td><code>@</code></td><td>Current element</td></tr>
          <tr><td><code>&expr</code></td><td>Expression reference (for sort_by)</td></tr>
          <tr><td><code>|</code></td><td>Pipe - chain expressions</td></tr>
        </table>
      `,
    },
    {
      title: 'Multiselect',
      icon: 'fas fa-cubes',
      content: `
        <h4>Multiselect Hash (Create Objects)</h4>
        <p>Create custom objects with computed properties:</p>
        <pre><code>users[*].{name: name, email: email}
// [{name: "Alice", email: "alice@x.com"}, ...]

Reservations[].Instances[].{
  id: InstanceId,
  type: InstanceType,
  state: State.Name
}</code></pre>

        <h4>Multiselect List (Create Arrays)</h4>
        <p>Create arrays from multiple expressions:</p>
        <pre><code>users[0].[name, email, age]
// ["Alice", "alice@x.com", 28]

products[*].[name, price]
// [["Product A", 99], ...]</code></pre>
      `,
    },
    {
      title: 'Built-in Functions',
      icon: 'fas fa-calculator',
      content: `
        <h4>Array Functions</h4>
        <table class="help-table">
          <tr><td><code>length(array)</code></td><td>Array/string length</td></tr>
          <tr><td><code>sort(array)</code></td><td>Sort array</td></tr>
          <tr><td><code>sort_by(array, &key)</code></td><td>Sort by property</td></tr>
          <tr><td><code>reverse(array)</code></td><td>Reverse array</td></tr>
          <tr><td><code>contains(array, val)</code></td><td>Check if contains</td></tr>
        </table>
        
        <h4>Numeric Functions</h4>
        <table class="help-table">
          <tr><td><code>sum(numbers)</code></td><td>Sum of array</td></tr>
          <tr><td><code>avg(numbers)</code></td><td>Average</td></tr>
          <tr><td><code>min(numbers)</code></td><td>Minimum value</td></tr>
          <tr><td><code>max(numbers)</code></td><td>Maximum value</td></tr>
        </table>
        
        <h4>String Functions</h4>
        <table class="help-table">
          <tr><td><code>starts_with(str, prefix)</code></td><td>Check prefix</td></tr>
          <tr><td><code>ends_with(str, suffix)</code></td><td>Check suffix</td></tr>
          <tr><td><code>join(delim, array)</code></td><td>Join to string</td></tr>
        </table>
        
        <h4>Object Functions</h4>
        <table class="help-table">
          <tr><td><code>keys(object)</code></td><td>Get all keys</td></tr>
          <tr><td><code>values(object)</code></td><td>Get all values</td></tr>
          <tr><td><code>merge(obj1, obj2)</code></td><td>Merge objects</td></tr>
        </table>
      `,
    },
    {
      title: 'AWS CLI Examples',
      icon: 'fab fa-aws',
      content: `
        <h4>EC2 Instances</h4>
        <pre><code>// All instance IDs
Reservations[].Instances[].InstanceId

// Running instances only
Reservations[].Instances[?State.Name == \`running\`][]

// Custom output format
Reservations[].Instances[].{
  ID: InstanceId,
  Type: InstanceType,
  Status: State.Name
}</code></pre>

        <h4>S3 Buckets</h4>
        <pre><code>// Bucket names
Buckets[].Name

// Sorted bucket list
sort(Buckets[].Name)

// Buckets containing "prod"
Buckets[?contains(Name, \`prod\`)].Name</code></pre>
        
        <h4>Use in CLI</h4>
        <pre><code>aws ec2 describe-instances \\
  --query 'Reservations[].Instances[].InstanceId'</code></pre>
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
        
        <h4>Presets</h4>
        <ul>
          <li><strong>AWS CLI</strong> - Optimized for AWS output</li>
          <li><strong>Debug</strong> - Show execution details</li>
          <li><strong>Performance</strong> - For large files</li>
          <li><strong>Table View</strong> - Display as table</li>
        </ul>
      `,
    },
    {
      title: 'Tips & Tricks',
      icon: 'fas fa-magic',
      content: `
        <h4>Query Building Tips</h4>
        <ul>
          <li>No $ prefix—start directly with property names</li>
          <li>Use backticks for literals: <code>\`active\`</code>, <code>\`100\`</code></li>
          <li>Flatten nested arrays with <code>[]</code></li>
          <li>Use <code>@</code> in sort_by: <code>sort_by(@, &price)</code></li>
        </ul>
        
        <h4>Debugging</h4>
        <ul>
          <li>Test each step with pipe: <code>users | [0]</code></li>
          <li>Check type mismatch—numbers need backticks in filters</li>
          <li>Projections stop if value is null</li>
        </ul>
        
        <h4>Performance</h4>
        <ul>
          <li>Disable auto-execute for large files</li>
          <li>Filter early in the query chain</li>
          <li>Avoid multiple flatten operations on large arrays</li>
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
