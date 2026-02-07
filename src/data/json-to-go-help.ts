/**
 * Help documentation for JSON to Go converter
 */

export interface HelpSection {
  id: string;
  title: string;
  content: string;
  subsections?: HelpSubsection[];
}

export interface HelpSubsection {
  title: string;
  content: string;
  code?: string;
}

export const jsonToGoHelp: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: 'The JSON to Go converter transforms JSON data into Go struct definitions. Simply paste your JSON and get production-ready Go code instantly.',
    subsections: [
      {
        title: 'Basic Usage',
        content: '1. Paste JSON into the input editor\n2. View generated Go structs in real-time\n3. Customize settings as needed\n4. Copy or download the result'
      },
      {
        title: 'Input Methods',
        content: 'You can input JSON in three ways:\n- Paste directly into the editor\n- Upload a .json file\n- Load a sample template'
      }
    ]
  },
  {
    id: 'type-mapping',
    title: 'Type Mapping',
    content: 'The converter automatically maps JSON types to appropriate Go types.',
    subsections: [
      {
        title: 'Primitive Types',
        content: 'JSON strings → string\nJSON integers → int (or int64)\nJSON decimals → float64\nJSON booleans → bool\nJSON null → interface{} (or pointer type)'
      },
      {
        title: 'Complex Types',
        content: 'JSON arrays → []Type (slice)\nJSON objects → Struct type\nMixed arrays → []interface{}'
      },
      {
        title: 'Example',
        content: 'Input JSON:',
        code: '{\n  "name": "John",\n  "age": 30,\n  "active": true\n}'
      }
    ]
  },
  {
    id: 'struct-tags',
    title: 'Struct Tags',
    content: 'Go struct tags provide metadata for encoding/decoding. The converter supports multiple tag types.',
    subsections: [
      {
        title: 'JSON Tags',
        content: 'JSON tags (enabled by default) map struct fields to JSON keys:\n`json:"field_name"`'
      },
      {
        title: 'omitempty Option',
        content: 'Add omitempty to exclude zero-value fields from JSON output:\n`json:"field_name,omitempty"`'
      },
      {
        title: 'Additional Tags',
        content: 'Enable YAML, XML, or BSON tags for multi-format support:\n- YAML: `yaml:"field_name"`\n- XML: `xml:"field_name"`\n- BSON: `bson:"field_name"`'
      }
    ]
  },
  {
    id: 'nested-objects',
    title: 'Nested Objects',
    content: 'The converter automatically handles nested JSON objects by generating separate struct definitions.',
    subsections: [
      {
        title: 'How It Works',
        content: 'Each nested object becomes a separate struct. The parent struct references the nested struct by its type name.'
      },
      {
        title: 'Naming',
        content: 'Nested struct names are derived from the JSON key in PascalCase. For example, "user_profile" becomes "UserProfile".'
      }
    ]
  },
  {
    id: 'nullable-fields',
    title: 'Nullable Fields',
    content: 'Handle JSON null values appropriately with pointer types.',
    subsections: [
      {
        title: 'Default Behavior',
        content: 'By default, nullable fields use interface{} which can hold any value including nil.'
      },
      {
        title: 'Pointer Types',
        content: 'Enable "Use pointer for nullable" to generate pointer types:\n*string, *int, *float64, *bool\n\nThis allows distinguishing between zero values and null/missing fields.'
      }
    ]
  },
  {
    id: 'presets',
    title: 'Presets',
    content: 'Use presets to quickly apply common configuration patterns.',
    subsections: [
      {
        title: 'Available Presets',
        content: '- Default: Standard JSON tags\n- API Response: With omitempty and pointers\n- MongoDB: Includes BSON tags\n- Config File: JSON + YAML tags\n- XML API: JSON + XML tags\n- Minimal: No tags'
      },
      {
        title: 'Custom Settings',
        content: 'After applying a preset, you can further customize settings. Any manual changes will clear the preset indicator.'
      }
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    content: 'Common issues and solutions.',
    subsections: [
      {
        title: 'Invalid JSON',
        content: 'If you see a JSON syntax error, check for:\n- Missing commas between properties\n- Unmatched brackets or braces\n- Trailing commas (not allowed in JSON)\n- Unescaped special characters in strings'
      },
      {
        title: 'Reserved Keywords',
        content: 'If a JSON key is a Go reserved keyword (like "type" or "func"), the converter will append an underscore to make it valid.'
      },
      {
        title: 'Large JSON Files',
        content: 'For very large JSON files (>5MB), conversion may be slow. Consider splitting into smaller chunks or using the file upload option.'
      }
    ]
  }
];
