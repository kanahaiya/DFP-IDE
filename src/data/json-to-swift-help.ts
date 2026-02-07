/**
 * Help documentation for JSON to Swift converter
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

export const jsonToSwiftHelp: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: 'The JSON to Swift converter transforms JSON data into Swift struct or class definitions with Codable conformance.',
    subsections: [
      {
        title: 'Basic Usage',
        content: '1. Paste JSON into the input editor\n2. View generated Swift code instantly\n3. Customize settings as needed\n4. Copy or download the result'
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
    content: 'The converter automatically maps JSON types to Swift types.',
    subsections: [
      {
        title: 'Primitive Types',
        content: 'JSON strings → String\nJSON integers → Int\nJSON decimals → Double\nJSON booleans → Bool\nJSON null → Optional (Type?)'
      },
      {
        title: 'Complex Types',
        content: 'JSON arrays → [Type]\nJSON objects → Struct/Class type\nMixed arrays → [Any]'
      }
    ]
  },
  {
    id: 'codable',
    title: 'Codable Protocol',
    content: 'Swift\'s Codable protocol enables encoding/decoding to external formats.',
    subsections: [
      {
        title: 'Protocol Options',
        content: '- Codable: Both encode and decode\n- Decodable: Decode only (read from JSON)\n- Encodable: Encode only (write to JSON)\n- None: Plain struct without protocols'
      },
      {
        title: 'CodingKeys',
        content: 'CodingKeys enum maps JSON keys to Swift property names. Auto-generated when:\n- JSON uses snake_case (e.g., user_name)\n- JSON key is a Swift reserved word'
      }
    ]
  },
  {
    id: 'type-options',
    title: 'Type Options',
    content: 'Choose the output type based on your needs.',
    subsections: [
      {
        title: 'Struct vs Class',
        content: 'struct: Value type, immutable, preferred for data models\nclass: Reference type, for ObservableObject or inheritance\nfinal class: Cannot be subclassed, performance optimization'
      },
      {
        title: 'Access Modifiers',
        content: 'public: Accessible from any module (frameworks)\ninternal: Default, accessible within module\nprivate: Accessible only within declaration\nfileprivate: Accessible within file'
      }
    ]
  },
  {
    id: 'swiftui',
    title: 'SwiftUI Integration',
    content: 'Generate code ready for SwiftUI reactive apps.',
    subsections: [
      {
        title: '@Published Properties',
        content: 'Enable "Add @Published" to mark properties with @Published wrapper. This makes the class compatible with ObservableObject for SwiftUI state management.'
      },
      {
        title: 'SwiftUI Preset',
        content: 'Use the "SwiftUI Model" preset for quick setup:\n- Class type\n- var properties\n- @Published wrapper\n- Codable conformance'
      }
    ]
  },
  {
    id: 'presets',
    title: 'Presets',
    content: 'Quick configurations for common use cases.',
    subsections: [
      {
        title: 'Available Presets',
        content: '- Default: Codable struct with CodingKeys\n- SwiftUI Model: Observable class with @Published\n- API Client: Decodable public structs\n- Data Model: Full-featured class with init\n- Minimal: Plain struct without Codable'
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
        content: 'If you see a JSON syntax error:\n- Check for missing commas\n- Ensure matching brackets/braces\n- Remove trailing commas\n- Escape special characters in strings'
      },
      {
        title: 'Reserved Keywords',
        content: 'Swift reserved words (like "class", "var", "func") in JSON keys are automatically handled by CodingKeys mapping.'
      }
    ]
  }
];
