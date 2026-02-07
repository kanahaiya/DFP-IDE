/**
 * JSON to Schema Generator Help Documentation
 */

export interface HelpSection {
  title: string;
  content: string;
}

export const jsonToSchemaHelp: HelpSection[] = [
  {
    title: 'Getting Started',
    content: `The JSON to Schema Generator creates schema definitions from JSON examples.

**Quick Start:**
1. Paste your JSON in the input editor
2. Select your desired output format
3. Adjust settings as needed
4. Copy or download the generated schema

**Supported Formats:**
- JSON Schema (Draft-07, 2019-09, 2020-12)
- TypeScript (Interface, Type)
- Zod, Yup
- GraphQL, Mongoose
- Flow, Rust, Go`,
  },
  {
    title: 'Output Formats',
    content: `Choose the right format for your use case:

**JSON Schema** - Standard format for JSON validation
- Draft-07: Widely supported
- 2020-12: Latest with new features

**TypeScript** - Static type definitions
- Interface: Extendable, preferred for objects
- Type: Alias for complex unions

**Validation Libraries**
- Zod: Modern, TypeScript-first
- Yup: Popular, React-friendly

**Other Languages**
- GraphQL: API type definitions
- Mongoose: MongoDB schemas
- Rust: Structs with serde
- Go: Structs with JSON tags`,
  },
  {
    title: 'Type Inference',
    content: `The generator automatically detects these formats:

**Strings:**
- email: user@example.com
- uri: https://example.com
- uuid: 550e8400-e29b-...
- date-time: 2026-01-16T10:30:00Z
- date: 2026-01-16

**Numbers:**
- integer: Whole numbers
- number: Decimals

**Arrays:**
- Infers item type from elements
- Mixed arrays use union types`,
  },
  {
    title: 'Settings',
    content: `Customize the output with these options:

**Root Name** - Name of the root type/interface

**Required Fields:**
- Default: Based on null values
- Make All Required: Force all required
- Make All Optional: Force all optional

**Format Detection** - Auto-detect emails, URLs, etc.

**Sort Properties** - Alphabetize properties

**Indentation** - 2 spaces, 4 spaces, or tabs`,
  },
  {
    title: 'Tips & Best Practices',
    content: `Get the best results:

**Provide Complete Examples**
Include all possible fields in your JSON. Missing fields will be optional.

**Use Realistic Data**
Real emails, URLs, and dates are detected for better format constraints.

**Check Nested Objects**
Nested objects become separate types/interfaces in most outputs.

**Review Optional Fields**
Null values make fields optional. Use settings to override if needed.`,
  },
];

export const jsonToSchemaHelpTitle = 'JSON to Schema Help';
