/**
 * JSON Flattener Help Content
 */

export const jsonFlattenerHelpSections = [
  {
    id: 'overview',
    title: 'What is JSON Flattening?',
    icon: 'fas fa-compress-alt',
    content: `JSON flattening converts nested hierarchical JSON structures into a flat key-value format. 
    
**Example:**
\`\`\`json
// Nested JSON
{
  "user": {
    "name": "John",
    "address": {
      "city": "NYC"
    }
  }
}

// Flattened (dot notation)
{
  "user.name": "John",
  "user.address.city": "NYC"
}
\`\`\`

This is useful for:
- Exporting to CSV/spreadsheets
- Creating environment variables
- Database flat storage
- Simplifying complex data analysis`,
  },
  {
    id: 'notation-styles',
    title: 'Notation Styles',
    icon: 'fas fa-key',
    content: `Choose how flattened keys are formatted:

**Dot Notation** (Default)
- Keys separated by periods
- Example: \`user.address.city\`
- Best for: General use, JavaScript access

**Bracket Notation**
- Keys in square brackets
- Example: \`user[address][city]\`
- Best for: Form data, query parameters

**Underscore Notation**
- Keys separated by underscores
- Example: \`user_address_city\`
- Best for: Environment variables, CSV headers

**Slash (Path) Notation**
- Keys separated by forward slashes
- Example: \`user/address/city\`
- Best for: File path-like structures, URLs`,
  },
  {
    id: 'array-handling',
    title: 'Array Handling',
    icon: 'fas fa-list',
    content: `Control how arrays are flattened:

**Index-Based** (Default)
- Uses numeric indices in the key path
- Example: \`items.0.name\`, \`items.1.name\`
- Best for: Preserving array structure

**Expand All**
- Creates separate keys for each element
- Maintains full path with indices
- Best for: Complete data extraction

**Concatenate**
- Joins array values with a delimiter
- Example: \`tags: "js,react,node"\`
- Best for: Simple value lists, CSV export

**Preserve Arrays**
- Keeps arrays as-is in output
- Doesn't flatten array contents
- Best for: Partial flattening`,
  },
  {
    id: 'advanced-options',
    title: 'Advanced Options',
    icon: 'fas fa-cog',
    content: `Fine-tune the flattening process:

**Max Depth**
- Limits how deep to flatten
- Objects beyond max depth kept as-is
- Useful for partially flattening complex structures

**Ignore Nulls**
- Excludes null and undefined values from output
- Reduces output size
- Helpful for clean exports

**Ignore Empty**
- Excludes empty strings, arrays, and objects
- Creates more compact output

**Safe Mode**
- Escapes special characters in keys (. [ ] / \\)
- Prevents key conflicts
- Recommended when keys contain separator characters

**Preserve Types**
- Keeps arrays/objects at max depth as-is
- If disabled, stringifies complex values`,
  },
  {
    id: 'presets',
    title: 'Using Presets',
    icon: 'fas fa-magic',
    content: `Quick configurations for common use cases:

**Standard** - Default dot notation, good for most cases
**CSV Export** - Underscore keys, concatenated arrays
**Environment Variables** - Perfect for .env file generation
**Path Style** - Slash notation for file-like structures
**Safe Keys** - Escapes special characters in keys
**Compact** - Removes null and empty values
**Bracket Style** - Form-like bracket notation
**Shallow (1 Level)** - Only flatten first level`,
  },
  {
    id: 'tips',
    title: 'Tips & Best Practices',
    icon: 'fas fa-lightbulb',
    content: `**Choosing Notation Style:**
- Use dot notation for general JavaScript/programming use
- Use underscore for environment variables and CSV
- Use bracket for form data and query parameters

**Handling Large Files:**
- The tool handles files up to 10MB
- Very deep nesting (>20 levels) may slow processing
- Consider using max depth for complex structures

**Array Strategies:**
- Index-based preserves most information
- Concatenate works best for primitive arrays
- Preserve is good when you need arrays intact

**Reverse Operation:**
- Use our JSON Unflatten tool to convert back
- Keys must use consistent notation for unflattening`,
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
| \`Ctrl/Cmd + F\` | Format/prettify input |
| \`Esc\` | Close dialogs |`,
  },
];
