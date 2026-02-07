/**
 * Help documentation for JSON to Java converter
 */

export const jsonToJavaHelp = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: `
## JSON to Java Converter

This tool converts JSON data into Java POJO (Plain Old Java Object) classes.

### Quick Start
1. Paste your JSON in the input panel
2. Configure annotation style and options
3. Copy or download the generated Java code

### Supported Features
- Jackson annotations (@JsonProperty)
- Gson annotations (@SerializedName)
- Lombok annotations (@Data, @Builder)
- Nested class generation
- List/ArrayList for arrays
    `.trim(),
  },
  {
    id: 'annotations',
    title: 'Annotation Styles',
    content: `
## Annotation Styles

### Plain Java
No JSON annotations. Use when you don't need JSON serialization.

### Jackson
Uses Jackson annotations like \`@JsonProperty\` for JSON serialization.
\`\`\`java
@JsonProperty("user_name")
private String userName;
\`\`\`

### Gson
Uses Gson annotations like \`@SerializedName\`.
\`\`\`java
@SerializedName("user_name")
private String userName;
\`\`\`

### Lombok
Uses Lombok annotations to reduce boilerplate:
- \`@Data\` - Generates getters, setters, toString, equals, hashCode
- \`@NoArgsConstructor\` - Generates default constructor
- \`@AllArgsConstructor\` - Generates all-args constructor
- \`@Builder\` - Generates builder pattern
    `.trim(),
  },
  {
    id: 'type-mapping',
    title: 'Type Mapping',
    content: `
## JSON to Java Type Mapping

| JSON Type | Java Type (Wrapper) | Java Type (Primitive) |
|-----------|---------------------|----------------------|
| string | String | String |
| number (int) | Integer | int |
| number (decimal) | Double | double |
| boolean | Boolean | boolean |
| null | Object | Object |
| array | List<T> | List<T> |
| object | Custom Class | Custom Class |

### Collections
Arrays are converted to \`List<T>\` by default. You can choose between:
- \`List<T>\` (interface)
- \`ArrayList<T>\` (concrete class)
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
