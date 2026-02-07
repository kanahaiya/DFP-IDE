/**
 * SEO Content for JSON to Elm Converter
 */

export interface TrustBadge { icon: string; text: string; }
export interface FeatureItem { icon: string; title: string; description: string; }
export interface HowToStep { number: number; title: string; description: string; }
export interface EducationalSection { title: string; content: string; type?: 'info' | 'tip' | 'warning'; }
export interface UseCase { title: string; description: string; icon: string; }
export interface WhyChooseItem { icon: string; title: string; description: string; }
export interface TechnicalSpec { feature: string; specification: string; }
export interface ComparisonRow { feature: string; ourTool: string; competitorA: string; competitorB: string; }
export interface FAQItem { question: string; answer: string; }
export interface RelatedTool { title: string; description: string; icon: string; link: string; }

export const jsonToElmSEO = {
  title: 'JSON to Elm Converter - Types, Decoders & Encoders',
  subtitle: 'Convert JSON to Elm type aliases with Json.Decode and Json.Encode functions. Generate pipeline-style decoders automatically.',
  description: 'Free online JSON to Elm converter with type alias, decoder, and encoder generation. Support for Json.Decode.Pipeline.',

  trustBadges: [
    { icon: 'fas fa-leaf', text: 'Elm Native' },
    { icon: 'fas fa-code', text: 'Type Safe' },
    { icon: 'fas fa-shield-alt', text: 'Private & Secure' },
    { icon: 'fas fa-bolt', text: 'Instant Results' },
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
  ] as TrustBadge[],

  features: [
    { icon: 'fas fa-shapes', title: 'Type Aliases', description: 'Generate Elm type aliases from JSON structure.' },
    { icon: 'fas fa-download', title: 'JSON Decoders', description: 'Create Json.Decode decoders with pipeline or mapN style.' },
    { icon: 'fas fa-upload', title: 'JSON Encoders', description: 'Generate Json.Encode functions for serialization.' },
    { icon: 'fas fa-stream', title: 'Pipeline Style', description: 'Use elm-json-decode-pipeline for readable decoders.' },
    { icon: 'fas fa-sitemap', title: 'Nested Types', description: 'Automatically handle nested objects and arrays.' },
    { icon: 'fas fa-comment-alt', title: 'Documentation', description: 'Add doc comments to generated functions.' },
  ] as FeatureItem[],

  howToSectionTitle: 'How to Convert JSON to Elm',

  howToSteps: [
    { number: 1, title: 'Paste Your JSON', description: 'Copy your JSON data from an API or file and paste it into the input editor.' },
    { number: 2, title: 'Configure Output', description: 'Choose to generate types only, decoders, encoders, or all three.' },
    { number: 3, title: 'Select Decoder Style', description: 'Use pipeline style (recommended) or standard Decode.mapN.' },
    { number: 4, title: 'Copy or Download', description: 'Click Copy or Download to save the generated Elm module.' },
  ] as HowToStep[],

  educationalContent: [
    { title: 'Elm JSON Decoding', content: 'Elm requires explicit JSON decoders because it has no runtime type coercion. This ensures type safety at the boundary between your Elm app and external JSON data.', type: 'info' },
    { title: 'Pipeline vs MapN', content: 'json-decode-pipeline provides a cleaner syntax for decoders with many fields. Standard Decode.mapN works without extra packages but gets verbose with more than 3 fields.', type: 'tip' },
    { title: 'Handling Nulls', content: 'Elm has no null - use Maybe types for optional fields. The generated decoder uses Decode.nullable or optional from the pipeline package.', type: 'info' },
  ] as EducationalSection[],

  useCases: [
    { title: 'API Integration', description: 'Generate decoders for REST API responses in Elm applications.', icon: 'fas fa-cloud' },
    { title: 'Elm Flags', description: 'Create types and decoders for data passed from JavaScript to Elm.', icon: 'fas fa-flag' },
    { title: 'WebSocket Messages', description: 'Handle JSON messages from WebSocket connections.', icon: 'fas fa-plug' },
    { title: 'Local Storage', description: 'Decode JSON data stored in browser local storage.', icon: 'fas fa-database' },
  ] as UseCase[],

  whyChooseSectionTitle: 'Why Choose Our JSON to Elm Converter?',

  whyChoose: [
    { icon: 'fas fa-leaf', title: 'Elm-Idiomatic Output', description: 'Generate clean, idiomatic Elm code following community conventions.' },
    { icon: 'fas fa-stream', title: 'Pipeline Support', description: 'Use the popular json-decode-pipeline package for readable decoders.' },
    { icon: 'fas fa-shield-alt', title: 'Privacy First', description: 'All processing happens in your browser. Your JSON never leaves your device.' },
    { icon: 'fas fa-rocket', title: 'Instant Generation', description: 'Real-time conversion as you type. No waiting, no submit buttons.' },
  ] as WhyChooseItem[],

  technicalSpecs: [
    { feature: 'Output Options', specification: 'Types, Decoders, Encoders, or All' },
    { feature: 'Decoder Style', specification: 'Pipeline or Decode.mapN' },
    { feature: 'Type Inference', specification: 'Int, Float, String, Bool, List, nested' },
    { feature: 'Nullable Handling', specification: 'Maybe types with optional decoder' },
    { feature: 'Max File Size', specification: 'Up to 10MB JSON' },
    { feature: 'Processing', specification: '100% client-side' },
    { feature: 'Export Options', specification: '.elm file download' },
    { feature: 'Browser Support', specification: 'Chrome, Firefox, Safari, Edge' },
  ] as TechnicalSpec[],

  comparisonSectionTitle: 'JSON to Elm Converter Comparison',

  comparison: [
    { feature: 'Free to Use', ourTool: '✓ Unlimited', competitorA: 'Limited', competitorB: 'Paid' },
    { feature: 'Privacy', ourTool: '✓ Client-side', competitorA: 'Server upload', competitorB: 'Server upload' },
    { feature: 'Type Generation', ourTool: '✓', competitorA: '✓', competitorB: '✓' },
    { feature: 'Decoder Generation', ourTool: '✓', competitorA: '✓', competitorB: '✗' },
    { feature: 'Encoder Generation', ourTool: '✓', competitorA: '✗', competitorB: '✗' },
    { feature: 'Pipeline Style', ourTool: '✓', competitorA: '✓', competitorB: '✗' },
    { feature: 'Nested Types', ourTool: '✓ Automatic', competitorA: 'Manual', competitorB: '✓' },
    { feature: 'Presets', ourTool: '✓ 5 presets', competitorA: '✗', competitorB: '✗' },
  ] as ComparisonRow[],

  faqs: [
    { question: 'Do I need json-decode-pipeline?', answer: 'Only if you enable pipeline-style decoders. Install it with: elm install NoRedInk/elm-json-decode-pipeline. Standard Decode.mapN works without extra packages.' },
    { question: 'How are nested objects handled?', answer: 'Nested objects are automatically converted to separate type aliases with their own decoders and encoders. References are created in the parent type.' },
    { question: 'What about null values?', answer: 'Elm has no null - the converter uses Maybe types. Fields that might be null are wrapped in Maybe and decoded with Decode.nullable or optional.' },
    { question: 'Can I customize the module name?', answer: 'Yes! Set the Module Prefix in the settings to change the module path. The default is Data.Root.' },
    { question: 'What Elm version is supported?', answer: 'The generated code is compatible with Elm 0.19.x. The syntax and packages used are all supported in the current Elm version.' },
    { question: 'Is my data secure?', answer: 'Yes. All conversion happens entirely in your browser. Your JSON data is never sent to any server.' },
  ] as FAQItem[],

  relatedTools: [
    { title: 'JSON to Haskell', description: 'Generate Haskell types with Aeson', icon: 'fas fa-lambda', link: '/json-to-haskell' },
    { title: 'JSON to TypeScript', description: 'Generate TypeScript interfaces', icon: 'fas fa-code', link: '/json-to-typescript' },
    { title: 'JSON Formatter', description: 'Format and beautify JSON data', icon: 'fas fa-indent', link: '/json-formatter' },
    { title: 'JSON Validator', description: 'Validate JSON syntax and structure', icon: 'fas fa-check-circle', link: '/json-validator' },
    { title: 'JSON to Rust', description: 'Generate Rust structs with serde', icon: 'fas fa-cog', link: '/json-to-rust' },
    { title: 'JSON to Go', description: 'Generate Go structs from JSON', icon: 'fab fa-golang', link: '/json-to-go' },
  ] as RelatedTool[],
};
