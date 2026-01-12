/**
 * Core type definitions for Data Formatter Pro
 */

// Theme types
export type Theme = 'light' | 'dark';

// Layout types
export type LayoutMode = 'horizontal' | 'vertical';

// Editor language types
export type EditorLanguage = 
  | 'plaintext'
  | 'json'
  | 'yaml'
  | 'xml'
  | 'csv'
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'java'
  | 'csharp'
  | 'go'
  | 'dart';

// Tool category types
export type ToolCategory = 
  | 'core'
  | 'converter'
  | 'advanced'
  | 'schema'
  | 'utility';

// HTTP Method types
export type HTTPMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

// OpenAPI version types
export type OpenAPIVersion = '3.0' | '2.0';

// Output format types
export type OutputFormat = 'yaml' | 'json';

/**
 * Tool configuration interface
 */
export interface ToolConfig {
  id: string;
  name: string;
  path: string;
  category: ToolCategory;
  inputLang: EditorLanguage;
  outputLang: EditorLanguage;
  description?: string;
  convertFn?: (input: string, options?: Record<string, unknown>) => Promise<string>;
}

/**
 * Editor stats interface
 */
export interface EditorStats {
  charCount: number;
  wordCount: number;
  lineCount: number;
  size: string; // formatted size (e.g., "10.5 KB")
}

/**
 * Message types for success/error notifications
 */
export type MessageType = 'success' | 'error' | 'info' | 'warning';

export interface Message {
  text: string;
  type: MessageType;
}

/**
 * Validation error interface for JSON/code validation
 */
export interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
  endLine?: number;
  endColumn?: number;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validation state for UI components
 */
export interface ValidationState {
  isValid: boolean;
  errorCount: number;
  warningCount: number;
}

/**
 * OpenAPI Endpoint configuration
 */
export interface Endpoint {
  id: string;
  path: string;
  method: HTTPMethod;
  json: string; // The JSON example for this endpoint
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string;
  responseCode?: string;
}

/**
 * OpenAPI settings
 */
export interface OpenAPISettings {
  title: string;
  version: string;
  description: string;
  serverUrl: string;
  openAPIVersion: OpenAPIVersion;
  
  // Schema generation options
  includeExamples: boolean;
  markRequired: boolean;
  generateComponents: boolean;
  detectFormats: boolean;
  addDescriptions: boolean;
  addConstraints: boolean;
  
  // Optional metadata
  securityScheme?: string;
  contactEmail?: string;
  licenseName?: string;
  licenseUrl?: string;
}

/**
 * OpenAPI conversion options
 */
export interface OpenAPIConversionOptions extends OpenAPISettings {
  endpoints: Endpoint[];
  outputFormat: OutputFormat;
}

/**
 * Sample template type
 */
export interface SampleTemplate {
  name: string;
  description: string;
  data: Record<string, unknown>;
}

/**
 * File upload options
 */
export interface FileUploadOptions {
  maxSize?: number; // in bytes
  allowedExtensions?: string[];
  accept?: string;
}

/**
 * URL fetch options
 */
export interface URLFetchOptions {
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * Share options
 */
export interface ShareOptions {
  includeSettings?: boolean;
  compress?: boolean;
}

/**
 * Keyboard shortcut definition
 */
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
}

/**
 * Monaco editor options
 */
export interface MonacoEditorOptions {
  language: EditorLanguage;
  theme?: 'vs' | 'vs-dark';
  readOnly?: boolean;
  minimap?: { enabled: boolean };
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval';
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
  automaticLayout?: boolean;
  fontSize?: number;
  lineHeight?: number;
  tabSize?: number;
  scrollBeyondLastLine?: boolean;
}

/**
 * Toolbar action interface
 */
export interface ToolbarAction {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
}

/**
 * Settings panel section
 */
export interface SettingsPanelSection {
  id: string;
  title: string;
  collapsed?: boolean;
  children: React.ReactNode;
}

/**
 * SEO metadata interface
 */
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

/**
 * Structured data types for SEO
 */
export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

/**
 * FAQ item for SEO
 */
export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Feature item for marketing content
 */
export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

/**
 * Use case item for marketing content
 */
export interface UseCaseItem {
  title: string;
  description: string;
  example?: string;
}
