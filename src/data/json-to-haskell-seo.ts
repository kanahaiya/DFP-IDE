/**
 * SEO Content for JSON to Haskell Converter
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

export const jsonToHaskellSEO = {
  title: 'JSON to Haskell Converter - Records, Aeson & Generic Deriving',
  subtitle: 'Convert JSON to Haskell data types with Aeson FromJSON/ToJSON instances. Support for Generic deriving and Template Haskell.',
  description: 'Free online JSON to Haskell converter with record type generation and Aeson instances. Support for DeriveGeneric and Template Haskell.',

  trustBadges: [
    { icon: 'fas fa-code', text: 'Haskell Native' },
    { icon: 'fas fa-code', text: 'Type Safe' },
    { icon: 'fas fa-shield-alt', text: 'Private & Secure' },
    { icon: 'fas fa-bolt', text: 'Instant Results' },
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
  ] as TrustBadge[],

  features: [
    { icon: 'fas fa-database', title: 'Record Types', description: 'Generate Haskell record data types from JSON structure.' },
    { icon: 'fas fa-cogs', title: 'Generic Deriving', description: 'Use DeriveGeneric for automatic Aeson instances.' },
    { icon: 'fas fa-magic', title: 'Template Haskell', description: 'Generate instances with deriveJSON TH.' },
    { icon: 'fas fa-hand-paper', title: 'Manual Instances', description: 'Generate hand-written FromJSON/ToJSON.' },
    { icon: 'fas fa-bolt', title: 'Strict Fields', description: 'Option for strict data with StrictData pragma.' },
    { icon: 'fas fa-comment-alt', title: 'Documentation', description: 'Add Haddock documentation comments.' },
  ] as FeatureItem[],

  howToSectionTitle: 'How to Convert JSON to Haskell',

  howToSteps: [
    { number: 1, title: 'Paste Your JSON', description: 'Copy your JSON data from an API or file and paste it into the input editor.' },
    { number: 2, title: 'Configure Instance Style', description: 'Choose Generic deriving, Template Haskell, or manual instances.' },
    { number: 3, title: 'Set Deriving Options', description: 'Enable Show, Eq, Generic, and other type class deriving.' },
    { number: 4, title: 'Copy or Download', description: 'Click Copy or Download to save the generated Haskell module.' },
  ] as HowToStep[],

  educationalContent: [
    { title: 'Aeson JSON Handling', content: 'Aeson is the standard Haskell library for JSON parsing. It provides FromJSON and ToJSON type classes with efficient parsing using attoparsec.', type: 'info' },
    { title: 'Generic Deriving vs TH', content: 'DeriveGeneric provides runtime-generated instances with good error messages. Template Haskell generates code at compile time for better performance. Choose based on your needs.', type: 'tip' },
    { title: 'Record Field Naming', content: 'Using a field label modifier (dropping the type name prefix) allows idiomatic Haskell field names while matching JSON keys.', type: 'info' },
  ] as EducationalSection[],

  useCases: [
    { title: 'Web APIs', description: 'Generate types for REST API responses in Servant or Yesod applications.', icon: 'fas fa-cloud' },
    { title: 'Configuration', description: 'Create types for JSON configuration files in Haskell applications.', icon: 'fas fa-cog' },
    { title: 'Data Processing', description: 'Define types for JSON data in data processing pipelines.', icon: 'fas fa-stream' },
    { title: 'Database Models', description: 'Generate types that mirror JSON documents from MongoDB or similar.', icon: 'fas fa-database' },
  ] as UseCase[],

  whyChooseSectionTitle: 'Why Choose Our JSON to Haskell Converter?',

  whyChoose: [
    { icon: 'fas fa-code', title: 'Haskell-Idiomatic', description: 'Generate clean, idiomatic Haskell code following best practices.' },
    { icon: 'fas fa-cogs', title: 'Multiple Instance Styles', description: 'Choose Generic, Template Haskell, or manual Aeson instances.' },
    { icon: 'fas fa-shield-alt', title: 'Privacy First', description: 'All processing happens in your browser. Your JSON never leaves your device.' },
    { icon: 'fas fa-rocket', title: 'Instant Generation', description: 'Real-time conversion as you type. No waiting, no submit buttons.' },
  ] as WhyChooseItem[],

  technicalSpecs: [
    { feature: 'Instance Styles', specification: 'Generic, Template Haskell, Manual' },
    { feature: 'Deriving Support', specification: 'Generic, Show, Eq, Ord' },
    { feature: 'Type Inference', specification: 'Int, Double, Text, Bool, Maybe, [a]' },
    { feature: 'Strict Fields', specification: 'Optional StrictData pragma' },
    { feature: 'Max File Size', specification: 'Up to 10MB JSON' },
    { feature: 'Processing', specification: '100% client-side' },
    { feature: 'Export Options', specification: '.hs file download' },
    { feature: 'Browser Support', specification: 'Chrome, Firefox, Safari, Edge' },
  ] as TechnicalSpec[],

  comparisonSectionTitle: 'JSON to Haskell Converter Comparison',

  comparison: [
    { feature: 'Free to Use', ourTool: '✓ Unlimited', competitorA: 'Limited', competitorB: 'Paid' },
    { feature: 'Privacy', ourTool: '✓ Client-side', competitorA: 'Server upload', competitorB: 'Server upload' },
    { feature: 'Generic Deriving', ourTool: '✓', competitorA: '✓', competitorB: '✗' },
    { feature: 'Template Haskell', ourTool: '✓', competitorA: '✗', competitorB: '✓' },
    { feature: 'Manual Instances', ourTool: '✓', competitorA: '✗', competitorB: '✗' },
    { feature: 'Strict Fields', ourTool: '✓', competitorA: '✗', competitorB: '✗' },
    { feature: 'Nested Types', ourTool: '✓ Automatic', competitorA: 'Manual', competitorB: '✓' },
    { feature: 'Presets', ourTool: '✓ 5 presets', competitorA: '✗', competitorB: '✗' },
  ] as ComparisonRow[],

  faqs: [
    { question: 'What is Aeson?', answer: 'Aeson is the de facto standard Haskell library for JSON encoding and decoding. It provides FromJSON and ToJSON type classes with efficient parsing and encoding.' },
    { question: 'Should I use Generic or Template Haskell?', answer: 'Generic deriving is simpler and provides better error messages. Template Haskell generates code at compile time for potentially better runtime performance. Generic is usually sufficient.' },
    { question: 'What are the required language extensions?', answer: 'At minimum, DeriveGeneric and OverloadedStrings. Template Haskell requires the TemplateHaskell extension. StrictData is optional for strict fields.' },
    { question: 'How does fieldLabelModifier work?', answer: 'The field label modifier transforms Haskell field names to match JSON keys. We prefix fields with the type name (e.g., userName for User) then drop this prefix when encoding/decoding.' },
    { question: 'What about Maybe types?', answer: 'Null JSON values are represented as Maybe types in Haskell. The Aeson instances handle Nothing as null in JSON.' },
    { question: 'Is my data secure?', answer: 'Yes. All conversion happens entirely in your browser. Your JSON data is never sent to any server.' },
  ] as FAQItem[],

  relatedTools: [
    { title: 'JSON to Elm', description: 'Generate Elm types with decoders', icon: 'fas fa-leaf', link: '/json-to-elm' },
    { title: 'JSON to TypeScript', description: 'Generate TypeScript interfaces', icon: 'fas fa-code', link: '/json-to-typescript' },
    { title: 'JSON Formatter', description: 'Format and beautify JSON data', icon: 'fas fa-indent', link: '/json-formatter' },
    { title: 'JSON Validator', description: 'Validate JSON syntax and structure', icon: 'fas fa-check-circle', link: '/json-validator' },
    { title: 'JSON to Rust', description: 'Generate Rust structs with serde', icon: 'fas fa-cog', link: '/json-to-rust' },
    { title: 'JSON to Go', description: 'Generate Go structs from JSON', icon: 'fab fa-golang', link: '/json-to-go' },
  ] as RelatedTool[],
};
