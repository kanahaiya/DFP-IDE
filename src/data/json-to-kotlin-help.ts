/**
 * Help Content for JSON to Kotlin Converter
 */

export interface HelpSection {
  title: string;
  content: string;
  icon?: string;
}

export const jsonToKotlinHelp: HelpSection[] = [
  {
    title: 'Overview',
    icon: 'fas fa-info-circle',
    content: 'The JSON to Kotlin converter transforms JSON data into Kotlin data classes. It supports multiple serialization libraries (Kotlinx, Gson, Moshi, Jackson), Android Parcelize, and various customization options. Key features include: data class generation, automatic type inference, serialization annotations, nullable type support, nested class handling, and configurable naming conventions.',
  },
  {
    title: 'JSON Input',
    icon: 'fas fa-file-code',
    content: 'Paste valid JSON into the input editor. The tool accepts JSON objects and arrays of objects. Syntax highlighting and real-time validation help identify errors. Use sample templates to test with example data structures like API responses, user profiles, or configuration objects.',
  },
  {
    title: 'Serialization Libraries',
    icon: 'fas fa-exchange-alt',
    content: 'Choose your serialization library. Options: None - plain data classes without annotations, Kotlinx Serialization - @Serializable and @SerialName, Gson - @SerializedName for Google Gson, Moshi - @Json and @JsonClass for Square Moshi, Jackson - @JsonProperty for FasterXML Jackson. Select based on your project dependencies.',
  },
  {
    title: 'Data Class Options',
    icon: 'fas fa-database',
    content: 'Configure data class generation. Use Data Class: generate data class (recommended) or regular class. Val Properties: use immutable val (recommended) or mutable var. Nullable Properties: make all properties nullable with ?. Default Values: add default values for properties. Companion Object: generate an empty companion object placeholder.',
  },
  {
    title: 'Naming Conventions',
    icon: 'fas fa-font',
    content: 'Customize naming. Class Names: PascalCase (default), camelCase, or snake_case. Property Names: camelCase (default), PascalCase, snake_case, or preserve original. When property names differ from JSON keys, serial name annotations are added automatically.',
  },
  {
    title: 'Android Options',
    icon: 'fab fa-android',
    content: 'Android-specific features. Parcelize: add @Parcelize annotation and implement Parcelable interface. This requires the kotlin-parcelize Gradle plugin. Useful for passing data between activities and fragments.',
  },
  {
    title: 'Advanced Options',
    icon: 'fas fa-tools',
    content: 'Additional configuration. Package Name: add package declaration at the top of the file. Add Imports: include necessary import statements. Add KDoc: generate documentation comments for classes. Serial Names: add serialization annotations when property names differ from JSON keys.',
  },
  {
    title: 'Presets',
    icon: 'fas fa-magic',
    content: 'Quick configuration presets. Available options: Default (plain data class), Kotlinx Serialization, Gson, Moshi, Jackson, Android Parcelize, Nullable Properties, Documented (with KDoc), and Mutable (var properties). Click a preset to apply its settings instantly.',
  },
  {
    title: 'Export Options',
    icon: 'fas fa-download',
    content: 'Export your generated Kotlin code. Click Copy to copy to clipboard for pasting into Android Studio or IntelliJ IDEA. Click Download to save as a .kt file. The filename uses your root class name (e.g., Root.kt).',
  },
];
