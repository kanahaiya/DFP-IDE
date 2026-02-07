/**
 * JSON Schema Validator Help Documentation
 * Help content for JSON Schema Validator tool
 */

export interface HelpSection {
  title: string;
  content: string;
}

export const jsonSchemaValidatorHelp: HelpSection[] = [
  {
    title: 'Getting Started',
    content: `The JSON Schema Validator validates JSON data against a JSON Schema definition.

**Quick Start:**
1. Enter your JSON Schema in the left editor
2. Enter your JSON data in the right editor
3. Validation runs automatically
4. Review any errors shown below

**Features:**
- Dual editor interface
- Multiple draft support
- Detailed error messages
- Pre-built example schemas`,
  },
  {
    title: 'JSON Schema Basics',
    content: `JSON Schema describes the structure of JSON data.

**Core Keywords:**
- \`type\` - Expected data type (string, number, object, array, boolean, null)
- \`properties\` - Object property schemas
- \`required\` - Required property names
- \`items\` - Array item schema
- \`enum\` - Allowed values

**Example Schema:**
\`\`\`json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "integer" }
  },
  "required": ["name"]
}
\`\`\``,
  },
  {
    title: 'Schema Drafts',
    content: `Different versions of JSON Schema specification:

**Draft 2020-12** (Latest)
- prefixItems for tuple validation
- $dynamicRef for dynamic references

**Draft-07** (Widely Used)
- if/then/else conditionals
- readOnly/writeOnly

**Draft-04** (Legacy)
- Still common in older systems
- Uses definitions instead of $defs

The validator auto-detects the draft from $schema.`,
  },
  {
    title: 'Validation Keywords',
    content: `Common validation keywords by type:

**Strings:**
- minLength, maxLength
- pattern (regex)
- format (email, uri, date-time, uuid)

**Numbers:**
- minimum, maximum
- exclusiveMinimum, exclusiveMaximum
- multipleOf

**Arrays:**
- minItems, maxItems
- uniqueItems
- items, prefixItems

**Objects:**
- properties, patternProperties
- additionalProperties
- required
- minProperties, maxProperties`,
  },
  {
    title: 'Combinators',
    content: `Combine schemas with logical operators:

**allOf** - Must match ALL schemas
\`\`\`json
{ "allOf": [{ "type": "string" }, { "minLength": 1 }] }
\`\`\`

**anyOf** - Must match AT LEAST ONE schema
\`\`\`json
{ "anyOf": [{ "type": "string" }, { "type": "number" }] }
\`\`\`

**oneOf** - Must match EXACTLY ONE schema
\`\`\`json
{ "oneOf": [{ "type": "string" }, { "type": "null" }] }
\`\`\`

**not** - Must NOT match the schema
\`\`\`json
{ "not": { "type": "null" } }
\`\`\``,
  },
  {
    title: 'Understanding Errors',
    content: `Error messages include:

**Path** - Location in the JSON data (e.g., ".user.email")
**Keyword** - The validation keyword that failed
**Message** - Human-readable error description
**Suggestion** - How to fix the issue

**Common Errors:**
- Type mismatch: Expected string, got number
- Required property missing
- String too short/long
- Number out of range
- Pattern not matched`,
  },
];

export const jsonSchemaValidatorHelpTitle = 'JSON Schema Validator Help';
