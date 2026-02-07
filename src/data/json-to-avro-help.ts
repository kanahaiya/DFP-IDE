/**
 * JSON to Avro Help Documentation
 * Help content for the Avro converter tool
 */

export interface HelpSection {
  id: string;
  title: string;
  content: string;
}

export const jsonToAvroHelp: HelpSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    content: `The JSON to Avro converter transforms JSON data structures into Apache Avro schema definitions (.avsc files).

**Key Features:**
- Automatic type inference from JSON values
- Logical type detection (dates, timestamps, UUIDs)
- Nested record generation
- Nullable field handling with unions
- Kafka Schema Registry compatible output`,
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: `**Step 1:** Paste your JSON data into the input editor.

**Step 2:** Set a namespace (e.g., com.company.events).

**Step 3:** Choose a root record name.

**Step 4:** Enable logical type inference if needed.

**Step 5:** Copy or download the generated .avsc file.`,
  },
  {
    id: 'type-mapping',
    title: 'Type Mapping',
    content: `JSON types are mapped to Avro types as follows:

| JSON Type | Avro Type |
|-----------|-----------|
| string | string |
| integer (small) | int |
| integer (large) | long |
| float | double |
| boolean | boolean |
| null | null |
| array | array |
| object | record |

**Logical Types:**
- ISO dates → date
- ISO timestamps → timestamp-millis
- UUID strings → uuid`,
  },
  {
    id: 'nullable-fields',
    title: 'Nullable Fields',
    content: `Fields with null values are converted to union types:

**JSON:**
\`\`\`json
{ "middle_name": null }
\`\`\`

**Avro:**
\`\`\`json
{
  "name": "middle_name",
  "type": ["null", "string"],
  "default": null
}
\`\`\`

This allows the field to be either null or a string value.`,
  },
  {
    id: 'nested-records',
    title: 'Nested Records',
    content: `Nested JSON objects are converted to nested Avro records:

**JSON:**
\`\`\`json
{
  "address": {
    "city": "NYC",
    "zip": "10001"
  }
}
\`\`\`

**Avro:**
\`\`\`json
{
  "name": "address",
  "type": {
    "type": "record",
    "name": "Address",
    "fields": [
      { "name": "city", "type": "string" },
      { "name": "zip", "type": "string" }
    ]
  }
}
\`\`\``,
  },
  {
    id: 'schema-registry',
    title: 'Schema Registry',
    content: `The generated schemas are compatible with Confluent Schema Registry.

**Registration:**
1. Copy the generated schema
2. Register via REST API or UI
3. Use the schema ID in your producers/consumers

**Compatibility:**
- Set namespace to match your organization
- Include default values for backward compatibility
- Use union types for nullable fields`,
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    content: `**Editor Shortcuts:**
- \`Ctrl/Cmd + Enter\`: Generate schema
- \`Ctrl/Cmd + K\`: Clear input
- \`Ctrl/Cmd + S\`: Download .avsc file

**Output Shortcuts:**
- \`Ctrl/Cmd + C\`: Copy output (when focused)`,
  },
];
