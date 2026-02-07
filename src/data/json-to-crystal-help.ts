/**
 * Help content for JSON to Crystal converter
 */

export const jsonToCrystalHelp = [
  {
    title: 'Getting Started',
    content: `
## JSON to Crystal Converter

Convert your JSON data to Crystal structs or classes with type annotations.

### Quick Start
1. Paste your JSON data
2. Configure naming and generation options
3. Copy or download the generated Crystal code

### Output Types
- **Struct** - Immutable value type (default)
- **Class** - Reference type with mutability
    `.trim(),
  },
  {
    title: 'Type Mapping',
    content: `
## Type Inference

| JSON Value | Crystal Type |
|------------|--------------|
| String | String |
| Integer | Int32 / Int64 |
| Float | Float64 |
| Boolean | Bool |
| Null | Nil |
| Array | Array(T) |
| Object | Nested Struct/Class |
    `.trim(),
  },
  {
    title: 'JSON Annotations',
    content: `
## JSON::Serializable

Enable JSON::Serializable for automatic serialization:

\`\`\`crystal
require "json"

struct User
  include JSON::Serializable

  @[JSON::Field(key: "firstName")]
  property first_name : String

  @[JSON::Field(key: "lastName")]
  property last_name : String
end
\`\`\`
    `.trim(),
  },
  {
    title: 'Keyboard Shortcuts',
    content: `
## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Format JSON | Ctrl/Cmd + Shift + F |
| Copy Output | Ctrl/Cmd + Shift + C |
| Clear Input | Ctrl/Cmd + Shift + X |
    `.trim(),
  },
];
