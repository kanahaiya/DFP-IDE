/**
 * Central tool configuration
 * Defines all tools available in the application
 */

export interface ToolConfig {
  id: string;
  name: string;
  route: string;
  icon: string;
  description: string;
  category: 'converter' | 'formatter' | 'validator' | 'utility';
  keywords: string[];
  enabled: boolean;
}

export const TOOLS: ToolConfig[] = [
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
];

/**
 * Get tool configuration by ID
 */
export function getToolById(id: string): ToolConfig | undefined {
  return TOOLS.find(tool => tool.id === id);
}

/**
 * Get tool configuration by route
 */
export function getToolByRoute(route: string): ToolConfig | undefined {
  return TOOLS.find(tool => tool.route === route);
}

/**
 * Get all enabled tools
 */
export function getEnabledTools(): ToolConfig[] {
  return TOOLS.filter(tool => tool.enabled);
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: ToolConfig['category']): ToolConfig[] {
  return TOOLS.filter(tool => tool.category === category && tool.enabled);
}
