/**
 * Help documentation for JSON to C# converter
 */

export const jsonToCSharpHelp = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: `
## JSON to C# Converter

This tool converts JSON data into C# classes with support for modern C# features.

### Quick Start
1. Paste your JSON in the input panel
2. Configure serialization library and options
3. Copy or download the generated C# code

### Supported Features
- Newtonsoft.Json (Json.NET) attributes
- System.Text.Json attributes
- C# records (9+)
- Nullable reference types (8+)
- File-scoped namespaces (10+)
    `.trim(),
  },
  {
    id: 'serializers',
    title: 'Serialization Libraries',
    content: `
## Serialization Libraries

### Newtonsoft.Json (Json.NET)
The most popular JSON library for .NET with extensive features.
\`\`\`csharp
[JsonProperty("user_name")]
public string UserName { get; set; }
\`\`\`

### System.Text.Json
Built-in .NET JSON library with better performance.
\`\`\`csharp
[JsonPropertyName("user_name")]
public string UserName { get; set; }
\`\`\`

### No Attributes
Plain classes without JSON attributes.
    `.trim(),
  },
  {
    id: 'modern-features',
    title: 'Modern C# Features',
    content: `
## Modern C# Features

### Records (C# 9+)
Immutable reference types with value-based equality.
\`\`\`csharp
public record User(string Name, int Age);
\`\`\`

### Init-Only Setters (C# 9+)
Properties that can only be set during initialization.
\`\`\`csharp
public string Name { get; init; }
\`\`\`

### Nullable Reference Types (C# 8+)
Better null safety with nullable annotations.
\`\`\`csharp
public string? OptionalField { get; set; }
\`\`\`

### File-Scoped Namespaces (C# 10+)
Cleaner namespace declarations.
\`\`\`csharp
namespace MyNamespace;

public class MyClass { }
\`\`\`
    `.trim(),
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    content: `
## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Copy output | Ctrl/Cmd + Shift + C |
| Clear input | Ctrl/Cmd + Shift + X |
| Download output | Ctrl/Cmd + Shift + S |
    `.trim(),
  },
];
