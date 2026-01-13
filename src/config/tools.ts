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
