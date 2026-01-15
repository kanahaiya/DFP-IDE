/**
 * Central tool configuration
 * Defines all tools available in the application
 */

export interface ToolMetadata {
  id: string;
  name: string;
  route: string;
  icon: string;
  description: string;
  category: 'converter' | 'formatter' | 'validator' | 'utility';
  keywords: string[];
  enabled: boolean;
}

export const TOOLS: ToolMetadata[] = [
  {
    id: 'json-to-openapi',
    name: 'JSON to OpenAPI',
    route: '/json-to-openapi',
    icon: 'fas fa-file-invoice',
    description: 'Convert JSON to OpenAPI 3.0 specifications',
    category: 'converter',
    keywords: ['openapi', 'swagger', 'api', 'rest', 'json', 'converter'],
    enabled: true,
  },
  {
    id: 'csv-to-json',
    name: 'CSV to JSON',
    route: '/csv-to-json',
    icon: 'fas fa-table',
    description: 'Convert CSV to JSON with custom formatting options',
    category: 'converter',
    keywords: ['csv', 'json', 'converter', 'table', 'data', 'parse'],
    enabled: true,
  },
  {
    id: 'json-to-yaml',
    name: 'JSON to YAML',
    route: '/json-to-yaml',
    icon: 'fas fa-arrow-right',
    description: 'Convert JSON to YAML with Kubernetes, Docker Compose, and Ansible presets',
    category: 'converter',
    keywords: ['json', 'yaml', 'yml', 'converter', 'config', 'kubernetes', 'docker'],
    enabled: true,
  },
  {
    id: 'json-diff',
    name: 'JSON Diff',
    route: '/json-diff',
    icon: 'fas fa-not-equal',
    description: 'Compare two JSON documents with visual diff, tree view, and detailed reports',
    category: 'utility',
    keywords: ['json', 'diff', 'compare', 'comparison', 'patch', 'delta', 'merge', 'changes'],
    enabled: true,
  },
  {
    id: 'json-to-xml',
    name: 'JSON to XML',
    route: '/json-to-xml',
    icon: 'fas fa-file-code',
    description: 'Convert JSON to XML with SOAP, RSS, Sitemap presets and customizable formatting',
    category: 'converter',
    keywords: ['json', 'xml', 'converter', 'soap', 'rss', 'sitemap', 'cdata', 'namespace'],
    enabled: true,
  },
];

/**
 * Get tool configuration by ID
 */
export function getToolById(id: string): ToolMetadata | undefined {
  return TOOLS.find(tool => tool.id === id);
}

/**
 * Get tool configuration by route
 */
export function getToolByRoute(route: string): ToolMetadata | undefined {
  return TOOLS.find(tool => tool.route === route);
}

/**
 * Get all enabled tools
 */
export function getEnabledTools(): ToolMetadata[] {
  return TOOLS.filter(tool => tool.enabled);
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: ToolMetadata['category']): ToolMetadata[] {
  return TOOLS.filter(tool => tool.category === category && tool.enabled);
}
