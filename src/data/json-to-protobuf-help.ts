/**
 * JSON to Protobuf Help Documentation
 * Help content for the Protobuf converter tool
 */

export interface HelpSection {
  id: string;
  title: string;
  content: string;
}

export const jsonToProtobufHelp: HelpSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    content: `The JSON to Protobuf converter transforms JSON data structures into Protocol Buffer schema definitions (.proto files).

**Key Features:**
- Automatic type inference from JSON values
- Support for proto2 and proto3 syntax
- Nested message generation
- Repeated field detection for arrays
- Custom package and message naming`,
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: `**Step 1:** Paste your JSON data into the input editor.

**Step 2:** Choose your preferred syntax version (proto3 recommended).

**Step 3:** Set a package name and root message name.

**Step 4:** Click Generate or wait for auto-generation.

**Step 5:** Copy or download the generated .proto file.`,
  },
  {
    id: 'type-mapping',
    title: 'Type Mapping',
    content: `JSON types are mapped to Protobuf types as follows:

| JSON Type | Protobuf Type |
|-----------|---------------|
| string | string |
| integer | int32 / int64 |
| float | double |
| boolean | bool |
| null | optional field |
| array | repeated |
| object | nested message |

Large integers (> 2^31) are automatically converted to int64.`,
  },
  {
    id: 'syntax-versions',
    title: 'Proto2 vs Proto3',
    content: `**Proto3 (Recommended):**
- Simplified syntax
- All fields optional by default
- No required fields
- Better default value handling

**Proto2:**
- Legacy syntax
- Explicit optional/required modifiers
- Required for some older systems
- More control over field requirements`,
  },
  {
    id: 'naming-conventions',
    title: 'Naming Conventions',
    content: `**Field Names:**
- By default, field names are converted to snake_case
- Original names can be preserved with the JSON name option

**Message Names:**
- Automatically converted to PascalCase
- Reserved words are suffixed with "Message"
- Numbers at start are prefixed with "M"

**Package Names:**
- Use lowercase with dots (e.g., com.example.api)
- Optional but recommended for organization`,
  },
  {
    id: 'nested-objects',
    title: 'Nested Objects',
    content: `Nested JSON objects are converted to nested Protobuf messages:

**JSON:**
\`\`\`json
{
  "user": {
    "name": "John",
    "address": {
      "city": "NYC"
    }
  }
}
\`\`\`

**Protobuf:**
\`\`\`protobuf
message Root {
  message User {
    message Address {
      string city = 1;
    }
    string name = 1;
    Address address = 2;
  }
  User user = 1;
}
\`\`\``,
  },
  {
    id: 'arrays',
    title: 'Array Handling',
    content: `JSON arrays are converted to repeated fields:

**Simple Arrays:**
\`["a", "b", "c"]\` → \`repeated string items = 1;\`

**Object Arrays:**
Arrays of objects generate a nested message type with "Item" suffix:
\`\`\`protobuf
message Items {
  repeated Item items = 1;
  message Item {
    string name = 1;
  }
}
\`\`\``,
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    content: `**Editor Shortcuts:**
- \`Ctrl/Cmd + Enter\`: Generate schema
- \`Ctrl/Cmd + K\`: Clear input
- \`Ctrl/Cmd + S\`: Download .proto file

**Output Shortcuts:**
- \`Ctrl/Cmd + C\`: Copy output (when focused)`,
  },
];
