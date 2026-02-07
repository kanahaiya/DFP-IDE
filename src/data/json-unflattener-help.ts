/**
 * JSON Unflattener Help Content
 */

export const jsonUnflattenerHelpSections = [
  {
    id: 'overview',
    title: 'What is JSON Unflattening?',
    icon: 'fas fa-expand-alt',
    content: `JSON unflattening is the reverse of flattening – it converts flat key-value pairs back into a nested hierarchical JSON structure.

**Example:**
\`\`\`json
// Flattened JSON
{
  "user.name": "John",
  "user.address.city": "NYC"
}

// Unflattened (Nested)
{
  "user": {
    "name": "John",
    "address": {
      "city": "NYC"
    }
  }
}
\`\`\`

This is useful for:
- Reconstructing JSON from CSV imports
- Parsing form data submissions
- Converting environment variables to config objects
- Restoring database flat exports to hierarchical structures`,
  },
  {
    id: 'delimiters',
    title: 'Delimiter Types',
    icon: 'fas fa-minus',
    content: `Choose the delimiter that matches your flattened data:

**Dot Delimiter** (Default)
- Keys separated by periods
- Example: \`user.address.city\`
- Most common format

**Underscore Delimiter**
- Keys separated by underscores
- Example: \`user_address_city\`
- Common in env vars and database exports

**Custom Delimiter**
- Define your own separator
- Examples: \`::\`, \`->\`, \`/\`
- For non-standard formats

**Auto-Detection**
The tool attempts to detect the delimiter automatically based on your input patterns.`,
  },
  {
    id: 'array-detection',
    title: 'Array Handling',
    icon: 'fas fa-list',
    content: `Control how arrays are reconstructed:

**Auto-Detect Arrays** (Default)
- Recognizes bracket notation: \`[0]\`, \`[1]\`, etc.
- Automatically creates arrays when patterns match
- Best for most use cases

**Force Array Conversion**
- Treats ALL numeric keys as array indices
- Even without brackets: \`items.0.name\` → array
- Use when source consistently uses numeric keys

**When arrays are created:**
- \`users[0].name\` → creates users array
- \`items.0.name\` → creates items array (if forced)
- \`data.1.value\` → creates data array (if forced)`,
  },
  {
    id: 'conflict-handling',
    title: 'Conflict Resolution',
    icon: 'fas fa-exclamation-triangle',
    content: `Handle key conflicts when the same path has multiple values:

**Last-Write-Wins** (Default)
- Later values overwrite earlier ones
- Safe for most use cases
- Predictable behavior

**Preserve First**
- Keeps the first encountered value
- Ignores subsequent values for same path
- Useful for priority-based data

**Strict Mode**
- Throws an error on any conflict
- Ensures data integrity
- Best for critical data processing

**Example Conflict:**
\`\`\`json
{
  "user.name": "John",
  "user": {"name": "Jane"}  // Conflict!
}
\`\`\``,
  },
  {
    id: 'type-preservation',
    title: 'Type Preservation',
    icon: 'fas fa-exchange-alt',
    content: `Convert string values back to their original types:

**Preserve Numbers**
- \`"123"\` → \`123\`
- \`"45.67"\` → \`45.67\`
- Converts numeric strings to actual numbers

**Preserve Booleans**
- \`"true"\` → \`true\`
- \`"false"\` → \`false\`
- Converts boolean strings to actual booleans

**Preserve Null**
- \`"null"\` → \`null\`
- Converts "null" string to actual null value

**Why enable?**
Some flattening tools stringify all values. Type preservation restores the original data types for proper JSON semantics.`,
  },
  {
    id: 'formatting',
    title: 'Output Formatting',
    icon: 'fas fa-align-left',
    content: `Control how the output JSON is formatted:

**Format Output** (Default: On)
- Pretty-prints with indentation
- Makes output human-readable
- Choose 2 spaces, 4 spaces, or tabs

**Minified Output**
- Single line, no whitespace
- Smaller file size
- Better for API responses

**Sort Keys**
- Alphabetically orders object keys
- Consistent output ordering
- Useful for diffs and comparison`,
  },
  {
    id: 'presets',
    title: 'Using Presets',
    icon: 'fas fa-magic',
    content: `Quick configurations for common scenarios:

**Auto Detect** - Intelligent detection, works for most cases
**Database Import** - For ORM-generated flat exports
**Form Data** - For HTML form serialization
**Config Import** - For underscore-separated configs
**Strict Mode** - Error on any conflicts
**Preserve First** - Keep first value on conflicts
**Minified** - Compact single-line output
**Sorted Keys** - Alphabetically sorted keys`,
  },
  {
    id: 'tips',
    title: 'Tips & Best Practices',
    icon: 'fas fa-lightbulb',
    content: `**Choosing Delimiter:**
- Check your input for the most common separator
- The tool auto-detects but manual selection is more reliable
- Use custom delimiter for non-standard formats

**Array Reconstruction:**
- Auto-detect works for bracket notation: \`[0]\`, \`[1]\`
- Enable force conversion for numeric-key arrays
- Check output to verify arrays were created correctly

**Type Preservation:**
- Enable for data that was originally typed
- Disable if all values should remain strings
- Test with sample data first

**Handling Errors:**
- Strict mode helps identify data issues
- Check warnings for potential problems
- Use last-write-wins for lenient processing`,
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    icon: 'fas fa-keyboard',
    content: `Speed up your workflow:

| Shortcut | Action |
|----------|--------|
| \`Ctrl/Cmd + V\` | Paste from clipboard |
| \`Ctrl/Cmd + C\` | Copy output (when focused) |
| \`Ctrl/Cmd + S\` | Download output |
| \`Ctrl/Cmd + K\` | Clear input |
| \`Esc\` | Close dialogs |`,
  },
];
