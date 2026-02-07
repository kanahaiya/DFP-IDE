/**
 * SEO Content for JSON to Kotlin Converter
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

export const jsonToKotlinSEO = {
  title: 'JSON to Kotlin Converter - Generate Data Classes & Serialization',
  subtitle: 'Convert JSON to Kotlin data classes instantly. Generate Kotlinx Serialization, Gson, Moshi, or Jackson annotations. Perfect for Android development.',
  description: 'Free online JSON to Kotlin converter with data class and serialization annotation generation',

  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-shield-alt', text: 'Secure & Private' },
    { icon: 'fas fa-bolt', text: 'Instant Results' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
    { icon: 'fab fa-android', text: 'Android Ready' },
    { icon: 'fas fa-code', text: 'Serializable' },
  ] as TrustBadge[],

  features: [
    {
      icon: 'fas fa-database',
      title: 'Data Classes',
      description: 'Generate idiomatic Kotlin data classes with val/var properties and proper type inference.',
    },
    {
      icon: 'fas fa-exchange-alt',
      title: 'Kotlinx Serialization',
      description: 'Add @Serializable and @SerialName annotations for Kotlin serialization.',
    },
    {
      icon: 'fab fa-google',
      title: 'Gson Support',
      description: 'Generate @SerializedName annotations for Google Gson library.',
    },
    {
      icon: 'fas fa-square',
      title: 'Moshi Support',
      description: 'Add @Json and @JsonClass annotations for Square Moshi.',
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Android Parcelize',
      description: 'Generate @Parcelize for Android Parcelable implementation.',
    },
    {
      icon: 'fas fa-question-circle',
      title: 'Nullable Support',
      description: 'Detect null values and generate nullable types with proper Kotlin syntax.',
    },
  ] as FeatureItem[],

  howToSectionTitle: 'How to Convert JSON to Kotlin',

  howToSteps: [
    {
      number: 1,
      title: 'Paste Your JSON',
      description: 'Copy your JSON data from an API response, configuration file, or any source and paste it into the input editor. Real-time validation highlights any syntax errors.',
    },
    {
      number: 2,
      title: 'Choose Serialization',
      description: 'Select your serialization library: Kotlinx Serialization, Gson, Moshi, or Jackson. Configure naming conventions and additional options like Parcelize.',
    },
    {
      number: 3,
      title: 'Generate Kotlin',
      description: 'Your Kotlin data classes are generated instantly with proper annotations, imports, and type inference for nested objects and arrays.',
    },
    {
      number: 4,
      title: 'Copy or Download',
      description: 'Click Copy to clipboard or Download as a .kt file. Add the generated classes directly to your Android or Kotlin project.',
    },
  ] as HowToStep[],

  educationalContent: [
    {
      title: 'Kotlin Data Classes',
      content: 'Data classes in Kotlin are specially designed for holding data. They automatically generate equals(), hashCode(), toString(), copy(), and componentN() functions. Using data classes with JSON parsing libraries ensures clean, concise code with minimal boilerplate.',
      type: 'info',
    },
    {
      title: 'Choosing a Serialization Library',
      content: 'Kotlinx Serialization is the official Kotlin solution with multiplatform support. Gson is widely used but Java-centric. Moshi is modern and Kotlin-friendly. Jackson is powerful for complex scenarios. Choose based on your project requirements and existing dependencies.',
      type: 'tip',
    },
    {
      title: 'val vs var Properties',
      content: 'Use val for immutable properties (recommended for data classes) and var for mutable ones. Immutable data classes are thread-safe and easier to reason about. Only use var if you need to modify properties after construction.',
      type: 'info',
    },
  ] as EducationalSection[],

  useCases: [
    {
      title: 'Android API Integration',
      description: 'Generate data classes from REST API responses for use with Retrofit, Ktor, or other networking libraries in Android apps.',
      icon: 'fab fa-android',
    },
    {
      title: 'Backend Development',
      description: 'Create Kotlin data classes for Spring Boot, Ktor, or other JVM backend frameworks to handle JSON request/response bodies.',
      icon: 'fas fa-server',
    },
    {
      title: 'Kotlin Multiplatform',
      description: 'Generate shared data models with Kotlinx Serialization for iOS, Android, Web, and Desktop applications.',
      icon: 'fas fa-layer-group',
    },
    {
      title: 'Firebase/Firestore',
      description: 'Create data classes compatible with Firebase Firestore document mapping for Android and server-side Kotlin.',
      icon: 'fas fa-fire',
    },
  ] as UseCase[],

  whyChooseSectionTitle: 'Why Choose Our JSON to Kotlin Converter?',

  whyChoose: [
    {
      icon: 'fas fa-magic',
      title: 'Smart Type Inference',
      description: 'Automatically detects Int, Double, String, Boolean, List, and nested object types from your JSON data.',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Privacy First',
      description: 'All processing happens in your browser. Your JSON data never leaves your device—complete privacy guaranteed.',
    },
    {
      icon: 'fas fa-sliders-h',
      title: 'Multiple Libraries',
      description: 'Support for Kotlinx, Gson, Moshi, and Jackson—use the library your project already depends on.',
    },
    {
      icon: 'fas fa-rocket',
      title: 'Instant Generation',
      description: 'Real-time conversion as you type. No waiting, no submit buttons—just instant Kotlin code.',
    },
  ] as WhyChooseItem[],

  technicalSpecs: [
    { feature: 'Class Types', specification: 'data class, class' },
    { feature: 'Serialization', specification: 'Kotlinx, Gson, Moshi, Jackson' },
    { feature: 'Android', specification: 'Parcelize support' },
    { feature: 'Nullable Types', specification: 'Kotlin null safety' },
    { feature: 'Max File Size', specification: 'Up to 10MB JSON' },
    { feature: 'Processing', specification: '100% client-side' },
    { feature: 'Export Options', specification: '.kt file download' },
    { feature: 'Browser Support', specification: 'Chrome, Firefox, Safari, Edge' },
  ] as TechnicalSpec[],

  comparisonSectionTitle: 'JSON to Kotlin Converter Comparison',

  comparison: [
    { feature: 'Free to Use', ourTool: '✓ Unlimited', competitorA: 'Limited', competitorB: 'Paid' },
    { feature: 'Privacy', ourTool: '✓ Client-side', competitorA: 'Server upload', competitorB: 'Server upload' },
    { feature: 'Kotlinx Serialization', ourTool: '✓', competitorA: '✓', competitorB: '✗' },
    { feature: 'Gson', ourTool: '✓', competitorA: '✓', competitorB: '✓' },
    { feature: 'Moshi', ourTool: '✓', competitorA: '✗', competitorB: '✓' },
    { feature: 'Parcelize', ourTool: '✓', competitorA: '✗', competitorB: '✗' },
    { feature: 'Nullable Support', ourTool: '✓ Auto-detect', competitorA: 'Manual', competitorB: '✓' },
    { feature: 'Presets', ourTool: '✓ 9 presets', competitorA: '✗', competitorB: '✗' },
  ] as ComparisonRow[],

  faqs: [
    {
      question: 'What is a Kotlin data class?',
      answer: 'A data class in Kotlin is a special class designed to hold data. The compiler automatically generates equals(), hashCode(), toString(), copy(), and componentN() functions based on the properties declared in the primary constructor. They\'re perfect for representing JSON data.',
    },
    {
      question: 'Which serialization library should I use?',
      answer: 'Kotlinx Serialization is recommended for new Kotlin projects—it\'s official, multiplatform, and has excellent Kotlin integration. Use Gson if you\'re migrating from Java or have existing Gson setup. Moshi is a modern alternative with Kotlin support. Jackson is powerful for complex scenarios.',
    },
    {
      question: 'How does nullable type detection work?',
      answer: 'When a JSON property has a null value, the converter marks that property as nullable (Type?). You can also enable "Make All Properties Nullable" to ensure all properties can accept null values, which is useful for partial updates or optional fields.',
    },
    {
      question: 'What is @Parcelize and when should I use it?',
      answer: '@Parcelize is a Kotlin Android extension that automatically generates Parcelable implementation. Use it when you need to pass data classes between Android activities, fragments, or through intents. It requires the kotlin-parcelize Gradle plugin.',
    },
    {
      question: 'Can I use val and var together in a data class?',
      answer: 'Yes, but it\'s generally recommended to use val (immutable) for all properties in data classes. This makes the class thread-safe and prevents accidental modifications. Use var only when you specifically need mutable properties.',
    },
    {
      question: 'Is my data secure when using this tool?',
      answer: 'Yes. All conversion happens entirely in your browser using JavaScript. Your JSON data is never sent to any server—it stays completely on your device. You can even use the tool offline once it\'s loaded.',
    },
    {
      question: 'How do I handle nested objects?',
      answer: 'The converter automatically creates separate data classes for nested objects. Each nested object becomes its own data class with appropriate type references. Arrays of objects are typed as List<NestedClass>.',
    },
    {
      question: 'Can I customize property names?',
      answer: 'Yes! Use the "Add Serial Names" option to add @SerialName (Kotlinx), @SerializedName (Gson), or @Json (Moshi) annotations when the property name differs from the JSON key. This is useful when JSON uses snake_case but you prefer camelCase.',
    },
  ] as FAQItem[],

  relatedTools: [
    {
      title: 'JSON to Java',
      description: 'Generate Java POJO classes from JSON',
      icon: 'fab fa-java',
      link: '/json-to-java',
    },
    {
      title: 'JSON to TypeScript',
      description: 'Generate TypeScript interfaces from JSON',
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
      title: 'JSON to Swift',
      description: 'Generate Swift Codable structs',
      icon: 'fab fa-swift',
      link: '/json-to-swift',
    },
    {
      title: 'JSON to Dart',
      description: 'Generate Dart classes for Flutter',
      icon: 'fas fa-mobile-alt',
      link: '/json-to-dart',
    },
    {
      title: 'JSON Validator',
      description: 'Validate JSON syntax and structure',
      icon: 'fas fa-check-circle',
      link: '/json-validator',
    },
  ] as RelatedTool[],
};
