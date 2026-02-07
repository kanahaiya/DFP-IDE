/**
 * Help documentation for JSON to Dart converter
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

export const jsonToDartHelp: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: 'The JSON to Dart converter transforms JSON data into Dart class definitions with optional serialization methods.',
    subsections: [
      {
        title: 'Basic Usage',
        content: '1. Paste JSON into the input editor\n2. View generated Dart code instantly\n3. Customize settings as needed\n4. Copy or download the result'
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
    content: 'The converter automatically maps JSON types to Dart types.',
    subsections: [
      {
        title: 'Primitive Types',
        content: 'JSON strings → String\nJSON integers → int\nJSON decimals → double\nJSON booleans → bool\nJSON null → nullable type (Type?)'
      },
      {
        title: 'Complex Types',
        content: 'JSON arrays → List<Type>\nJSON objects → Custom class type\nMixed arrays → List<dynamic>'
      }
    ]
  },
  {
    id: 'code-styles',
    title: 'Code Styles',
    content: 'Choose from three code generation styles based on your needs.',
    subsections: [
      {
        title: 'Plain Dart',
        content: 'Standard Dart classes with manual fromJson/toJson implementation. No external dependencies required. Best for simple use cases.'
      },
      {
        title: 'Freezed',
        content: 'Generates immutable classes using the freezed package. Includes:\n- Immutable properties\n- copyWith method\n- Pattern matching\n- JSON serialization\nRequires: freezed_annotation, build_runner'
      },
      {
        title: 'JSON Serializable',
        content: 'Uses json_annotation for code generation. Simpler than Freezed, just handles JSON serialization.\nRequires: json_annotation, json_serializable, build_runner'
      }
    ]
  },
  {
    id: 'methods',
    title: 'Generated Methods',
    content: 'Optional methods you can include in generated classes.',
    subsections: [
      {
        title: 'fromJson',
        content: 'Factory constructor that creates an instance from a Map<String, dynamic>. Handles nested objects and lists.'
      },
      {
        title: 'toJson',
        content: 'Method that converts the object back to a Map<String, dynamic> for JSON encoding.'
      },
      {
        title: 'copyWith',
        content: 'Creates a new instance with some properties changed. Essential for immutable state management.'
      },
      {
        title: 'Equality',
        content: 'Implements operator == and hashCode for value-based equality. Useful for collections and state comparison.'
      }
    ]
  },
  {
    id: 'null-safety',
    title: 'Null Safety',
    content: 'Dart 3.x uses sound null safety.',
    subsections: [
      {
        title: 'Nullable vs Non-Nullable',
        content: 'Types without ? must have values (non-null)\nTypes with ? can be null\nExample: String is non-null, String? can be null'
      },
      {
        title: 'Required Fields',
        content: 'Non-nullable fields use "required" keyword in constructors. Nullable fields are optional by default.'
      }
    ]
  },
  {
    id: 'presets',
    title: 'Presets',
    content: 'Quick configurations for common Flutter patterns.',
    subsections: [
      {
        title: 'Available Presets',
        content: '- Default: Plain classes with fromJson/toJson\n- Flutter Model: Full-featured with copyWith, equality\n- Freezed: Immutable with freezed package\n- JSON Serializable: With json_annotation\n- Minimal: Simple classes without serialization'
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
        title: 'Build Runner',
        content: 'For Freezed/JSON Serializable, run:\nflutter pub run build_runner build\nto generate the .g.dart and .freezed.dart files.'
      }
    ]
  }
];
