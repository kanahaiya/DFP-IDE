/**
 * XML Conversion Presets
 * 
 * Pre-configured settings for common XML use cases.
 */

import type { XMLConversionSettings } from './converter';

export interface XMLPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  settings: Partial<XMLConversionSettings>;
}

/**
 * Built-in presets for common use cases
 */
export const XML_PRESETS: XMLPreset[] = [
  {
    id: 'readable',
    name: 'Readable',
    description: 'Human-readable XML with 2-space indentation',
    icon: 'fas fa-eye',
    iconColor: '#58a6ff',
    settings: {
      rootElement: 'root',
      includeDeclaration: true,
      indentation: '2spaces',
      lineBreaks: true,
      arrayWrapper: false,
      itemNaming: 'singular',
      cdataMode: 'auto',
      nullHandling: 'self-closing',
      booleanFormat: 'lowercase',
      attributeMode: 'elements',
      sortKeys: false,
    },
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Minified XML without whitespace',
    icon: 'fas fa-compress-arrows-alt',
    iconColor: '#f0883e',
    settings: {
      rootElement: 'root',
      includeDeclaration: true,
      indentation: 'none',
      lineBreaks: false,
      arrayWrapper: false,
      itemNaming: 'singular',
      cdataMode: 'auto',
      nullHandling: 'self-closing',
      booleanFormat: 'lowercase',
      attributeMode: 'elements',
      sortKeys: false,
    },
  },
  {
    id: 'attributes',
    name: 'Attribute Mode',
    description: 'Use XML attributes for simple values',
    icon: 'fas fa-tags',
    iconColor: '#a371f7',
    settings: {
      rootElement: 'root',
      includeDeclaration: true,
      indentation: '2spaces',
      lineBreaks: true,
      arrayWrapper: false,
      itemNaming: 'singular',
      cdataMode: 'auto',
      nullHandling: 'omit',
      booleanFormat: 'lowercase',
      attributeMode: 'smart',
      sortKeys: false,
    },
  },
  {
    id: 'soap',
    name: 'SOAP/Web Services',
    description: 'XML format suitable for SOAP messages',
    icon: 'fas fa-cloud',
    iconColor: '#3fb950',
    settings: {
      rootElement: 'data',
      includeDeclaration: true,
      indentation: '2spaces',
      lineBreaks: true,
      arrayWrapper: true,
      arrayWrapperName: 'items',
      itemNaming: 'singular',
      cdataMode: 'auto',
      nullHandling: 'empty',
      booleanFormat: 'lowercase',
      attributeMode: 'elements',
      namespaceEnabled: false,
      sortKeys: false,
    },
  },
  {
    id: 'config',
    name: 'Configuration',
    description: 'XML format for configuration files',
    icon: 'fas fa-cog',
    iconColor: '#d29922',
    settings: {
      rootElement: 'configuration',
      includeDeclaration: true,
      indentation: '4spaces',
      lineBreaks: true,
      arrayWrapper: true,
      arrayWrapperName: 'list',
      itemNaming: 'custom',
      customItemName: 'item',
      cdataMode: 'disabled',
      nullHandling: 'empty',
      booleanFormat: 'lowercase',
      attributeMode: 'elements',
      sortKeys: true,
    },
  },
  {
    id: 'android',
    name: 'Android Resources',
    description: 'XML format for Android resource files',
    icon: 'fab fa-android',
    iconColor: '#3ddc84',
    settings: {
      rootElement: 'resources',
      includeDeclaration: true,
      indentation: '4spaces',
      lineBreaks: true,
      arrayWrapper: false,
      itemNaming: 'custom',
      customItemName: 'item',
      cdataMode: 'disabled',
      nullHandling: 'omit',
      booleanFormat: 'lowercase',
      attributeMode: 'smart',
      sortKeys: false,
    },
  },
  {
    id: 'rss',
    name: 'RSS Feed',
    description: 'XML format for RSS feed items',
    icon: 'fas fa-rss',
    iconColor: '#f78166',
    settings: {
      rootElement: 'rss',
      includeDeclaration: true,
      indentation: '2spaces',
      lineBreaks: true,
      arrayWrapper: true,
      arrayWrapperName: 'channel',
      itemNaming: 'custom',
      customItemName: 'item',
      cdataMode: 'auto',
      nullHandling: 'omit',
      booleanFormat: 'lowercase',
      attributeMode: 'elements',
      sortKeys: false,
    },
  },
  {
    id: 'sitemap',
    name: 'XML Sitemap',
    description: 'XML format for search engine sitemaps',
    icon: 'fas fa-sitemap',
    iconColor: '#79c0ff',
    settings: {
      rootElement: 'urlset',
      includeDeclaration: true,
      indentation: '2spaces',
      lineBreaks: true,
      arrayWrapper: false,
      itemNaming: 'custom',
      customItemName: 'url',
      cdataMode: 'disabled',
      nullHandling: 'omit',
      booleanFormat: 'lowercase',
      attributeMode: 'elements',
      namespaceEnabled: true,
      namespaceUri: 'http://www.sitemaps.org/schemas/sitemap/0.9',
      namespacePrefix: '',
      sortKeys: false,
    },
  },
];

/**
 * Get preset by ID
 */
export function getPresetById(id: string): XMLPreset | undefined {
  return XML_PRESETS.find(preset => preset.id === id);
}

/**
 * Get default preset
 */
export function getDefaultPreset(): XMLPreset {
  return XML_PRESETS[0]; // Readable preset
}
