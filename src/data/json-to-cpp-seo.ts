/**
 * SEO Content for JSON to C++ Converter
 */

export interface TrustBadge {
  icon: string;
  text: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface HowToStep {
  number: number;
  title: string;
  description: string;
}

export interface EducationalSection {
  title: string;
  content: string;
  type?: 'info' | 'tip' | 'warning';
}

export interface UseCase {
  title: string;
  description: string;
  icon: string;
}

export interface WhyChooseItem {
  icon: string;
  title: string;
  description: string;
}

export interface TechnicalSpec {
  feature: string;
  specification: string;
}

export interface ComparisonRow {
  feature: string;
  ourTool: string;
  competitorA: string;
  competitorB: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface RelatedTool {
  title: string;
  description: string;
  icon: string;
  link: string;
}

export const jsonToCppSEO = {
  title: 'JSON to C++ Converter - Generate Structs & Classes',
  subtitle: 'Convert JSON to C++ structs and classes instantly. Support for nlohmann/json, RapidJSON, Boost.JSON, and jsoncpp with C++11 to C++20 standards.',
  description: 'Free online JSON to C++ converter with struct and class generation, multiple JSON library support, and modern C++ features.',

  trustBadges: [
    { icon: 'fas fa-microchip', text: 'Multi-Library' },
    { icon: 'fas fa-code', text: 'C++11-20' },
    { icon: 'fas fa-shield-alt', text: 'Private & Secure' },
    { icon: 'fas fa-bolt', text: 'Instant Results' },
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
  ] as TrustBadge[],

  features: [
    {
      icon: 'fas fa-book',
      title: 'Multiple JSON Libraries',
      description: 'Generate code for nlohmann/json, RapidJSON, jsoncpp, or Boost.JSON libraries.',
    },
    {
      icon: 'fas fa-layer-group',
      title: 'C++ Standards Support',
      description: 'Target C++11, C++14, C++17, or C++20 with appropriate language features.',
    },
    {
      icon: 'fas fa-cube',
      title: 'Struct & Class Output',
      description: 'Choose between structs or classes with optional getters/setters.',
    },
    {
      icon: 'fas fa-code-branch',
      title: 'std::optional Support',
      description: 'Use modern C++17 std::optional for nullable JSON fields.',
    },
    {
      icon: 'fas fa-magic',
      title: 'Auto Serialization',
      description: 'Generate NLOHMANN_DEFINE_TYPE_INTRUSIVE macros automatically.',
    },
    {
      icon: 'fas fa-file-alt',
      title: 'Header Guards',
      description: 'Choose between #pragma once or traditional #ifndef guards.',
    },
  ] as FeatureItem[],

  howToSectionTitle: 'How to Convert JSON to C++',

  howToSteps: [
    {
      number: 1,
      title: 'Paste Your JSON',
      description: 'Copy your JSON data from an API response, configuration file, or any source and paste it into the input editor.',
    },
    {
      number: 2,
      title: 'Select JSON Library',
      description: 'Choose your preferred C++ JSON library: nlohmann/json, RapidJSON, jsoncpp, or Boost.JSON.',
    },
    {
      number: 3,
      title: 'Configure Options',
      description: 'Set C++ standard version, struct vs class output, serialization macros, and formatting options.',
    },
    {
      number: 4,
      title: 'Copy or Download',
      description: 'Click Copy to clipboard or Download as a .hpp file. Add the generated code to your C++ project.',
    },
  ] as HowToStep[],

  educationalContent: [
    {
      title: 'Why Convert JSON to C++ Structs?',
      content: 'Type-safe data structures improve code reliability and enable compiler optimizations. Converting JSON to C++ structs eliminates runtime parsing overhead for known schemas and catches data errors at compile time rather than runtime.',
      type: 'info',
    },
    {
      title: 'Choosing the Right JSON Library',
      content: 'nlohmann/json offers the most intuitive API with modern C++ idioms. RapidJSON excels in performance-critical applications. Boost.JSON integrates seamlessly with the Boost ecosystem. jsoncpp provides broad compiler compatibility.',
      type: 'tip',
    },
    {
      title: 'Modern C++ Features',
      content: "C++17's std::optional is ideal for nullable JSON fields. std::string_view can improve performance for read-only string access. Smart pointers help manage nested object lifetimes automatically.",
      type: 'info',
    },
  ] as EducationalSection[],

  useCases: [
    {
      title: 'Game Development',
      description: 'Define game configs, save data, and asset manifests with type safety for game engines like Unreal Engine.',
      icon: 'fas fa-gamepad',
    },
    {
      title: 'Embedded Systems',
      description: 'Parse configuration files and sensor data in resource-constrained embedded environments.',
      icon: 'fas fa-microchip',
    },
    {
      title: 'Backend Services',
      description: 'Build high-performance REST API clients with strongly-typed request/response objects.',
      icon: 'fas fa-server',
    },
    {
      title: 'Desktop Applications',
      description: 'Load application settings, user preferences, and document formats with validation.',
      icon: 'fas fa-desktop',
    },
  ] as UseCase[],

  whyChooseSectionTitle: 'Why Choose Our JSON to C++ Converter?',

  whyChoose: [
    {
      icon: 'fas fa-bolt',
      title: 'Multiple Library Support',
      description: 'Generate code for the most popular C++ JSON libraries including nlohmann, RapidJSON, and Boost.',
    },
    {
      icon: 'fas fa-code',
      title: 'Modern C++ Standards',
      description: 'Support for C++11 through C++20 with appropriate features like std::optional and string_view.',
    },
    {
      icon: 'fas fa-magic',
      title: 'Automatic Serialization',
      description: 'Generate nlohmann macros or Boost.Describe annotations for seamless JSON round-tripping.',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Privacy First',
      description: 'All processing happens in your browser. Your JSON data never leaves your device.',
    },
  ] as WhyChooseItem[],

  technicalSpecs: [
    { feature: 'Supported Libraries', specification: 'nlohmann/json, RapidJSON, jsoncpp, Boost.JSON' },
    { feature: 'C++ Standards', specification: 'C++11, C++14, C++17, C++20' },
    { feature: 'Output Formats', specification: 'struct, class, header-only, header+source' },
    { feature: 'Type Inference', specification: 'int64_t, double, bool, std::string, std::vector' },
    { feature: 'Nullable Handling', specification: 'std::optional (C++17+), pointers' },
    { feature: 'Max File Size', specification: 'Up to 10MB JSON' },
    { feature: 'Processing', specification: '100% client-side' },
    { feature: 'Browser Support', specification: 'Chrome, Firefox, Safari, Edge' },
  ] as TechnicalSpec[],

  comparisonSectionTitle: 'JSON to C++ Converter Comparison',

  comparison: [
    { feature: 'Free to Use', ourTool: '✓ Unlimited', competitorA: 'Limited', competitorB: 'Paid' },
    { feature: 'Privacy', ourTool: '✓ Client-side', competitorA: 'Server upload', competitorB: 'Server upload' },
    { feature: 'nlohmann/json', ourTool: '✓', competitorA: '✓', competitorB: '✗' },
    { feature: 'RapidJSON', ourTool: '✓', competitorA: '✗', competitorB: '✓' },
    { feature: 'Boost.JSON', ourTool: '✓', competitorA: '✗', competitorB: '✗' },
    { feature: 'C++17 Features', ourTool: '✓ std::optional', competitorA: '✗', competitorB: '✗' },
    { feature: 'Serialization Macros', ourTool: '✓ Auto-generated', competitorA: 'Manual', competitorB: '✗' },
    { feature: 'Presets', ourTool: '✓ 5 presets', competitorA: '✗', competitorB: '✗' },
  ] as ComparisonRow[],

  faqs: [
    {
      question: 'Which C++ JSON library should I use?',
      answer: "For most projects, nlohmann/json offers the best balance of ease-of-use and features with its intuitive STL-like API. For performance-critical applications, RapidJSON is the fastest option. For Boost-based projects, Boost.JSON integrates seamlessly with the ecosystem.",
    },
    {
      question: 'Does the converter handle nested JSON objects?',
      answer: 'Yes! Nested objects are automatically converted to separate struct definitions with proper forward declarations and includes. Arrays of objects create vector types with element structs.',
    },
    {
      question: 'Can I use std::optional for nullable fields?',
      answer: 'Yes, when targeting C++17 or later, you can enable std::optional support for nullable JSON fields. This provides null safety at compile time. For older standards, raw pointers or custom nullable types are used instead.',
    },
    {
      question: 'How do I serialize the generated structs back to JSON?',
      answer: 'With nlohmann/json, the generated NLOHMANN_DEFINE_TYPE_INTRUSIVE macro enables automatic bidirectional serialization. For other libraries, you may need to implement to_json/from_json functions manually.',
    },
    {
      question: 'What C++ standard should I target?',
      answer: "Use C++17 or C++20 for modern features like std::optional, structured bindings, and string_view. Use C++11 only if you need to support older compilers. Most active projects should target at least C++17.",
    },
    {
      question: 'Is my data secure when using this tool?',
      answer: 'Yes. All conversion happens entirely in your browser using JavaScript. Your JSON data is never sent to any server—it stays completely on your device. You can even use the tool offline once loaded.',
    },
  ] as FAQItem[],

  relatedTools: [
    {
      title: 'JSON to Go',
      description: 'Generate Go structs from JSON',
      icon: 'fab fa-golang',
      link: '/json-to-go',
    },
    {
      title: 'JSON to Rust',
      description: 'Generate Rust structs with serde',
      icon: 'fas fa-cog',
      link: '/json-to-rust',
    },
    {
      title: 'JSON to TypeScript',
      description: 'Generate TypeScript interfaces',
      icon: 'fas fa-code',
      link: '/json-to-typescript',
    },
    {
      title: 'JSON Formatter',
      description: 'Format and beautify JSON data',
      icon: 'fas fa-indent',
      link: '/json-formatter',
    },
    {
      title: 'JSON to Kotlin',
      description: 'Generate Kotlin data classes',
      icon: 'fas fa-mobile-alt',
      link: '/json-to-kotlin',
    },
    {
      title: 'JSON Validator',
      description: 'Validate JSON syntax and structure',
      icon: 'fas fa-check-circle',
      link: '/json-validator',
    },
  ] as RelatedTool[],
};
