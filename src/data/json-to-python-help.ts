/**
 * Help documentation for JSON to Python converter
 */

export const jsonToPythonHelp = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: `
## JSON to Python Converter

This tool converts JSON data into Python code with multiple output formats.

### Quick Start
1. Paste your JSON in the input panel
2. Select output format (dataclass, Pydantic, etc.)
3. Copy or download the generated Python code

### Supported Formats
- Python dictionaries
- dataclasses
- Pydantic models (v1 and v2)
- TypedDict
- attrs classes
- NamedTuple
    `.trim(),
  },
  {
    id: 'output-formats',
    title: 'Output Formats',
    content: `
## Output Formats

### Dataclass
Standard Python dataclass with type hints.
\`\`\`python
@dataclass
class User:
    name: str
    age: int
\`\`\`

### Pydantic Model
Data validation and serialization.
\`\`\`python
class User(BaseModel):
    name: str
    age: int
\`\`\`

### TypedDict
Dictionary with typed keys.
\`\`\`python
class User(TypedDict):
    name: str
    age: int
\`\`\`

### attrs
Alternative to dataclass with more features.
\`\`\`python
@attr.s(auto_attribs=True)
class User:
    name: str
    age: int
\`\`\`
    `.trim(),
  },
  {
    id: 'type-hints',
    title: 'Type Hints',
    content: `
## Type Hints

### Basic Types
- \`str\` for strings
- \`int\` for integers
- \`float\` for decimals
- \`bool\` for booleans
- \`list[T]\` for arrays
- \`dict\` for objects

### Optional Types
\`\`\`python
# Python 3.9 and earlier
from typing import Optional
field: Optional[str] = None

# Python 3.10+
field: str | None = None
\`\`\`

### Special Types
- \`datetime\` for ISO date strings
- \`UUID\` for UUID strings
- \`EmailStr\` for email addresses (Pydantic)
- \`HttpUrl\` for URLs (Pydantic)
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
