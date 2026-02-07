/**
 * Sample JSON templates for JSON Formatter tool
 */

export interface SampleTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  content: string;
}

export const JSON_FORMATTER_SAMPLES: SampleTemplate[] = [
  {
    id: 'api-response',
    name: 'API Response',
    description: 'Typical REST API response with nested data',
    icon: 'fas fa-server',
    iconColor: '#4CAF50',
    content: `{"status":"success","data":{"users":[{"id":1,"name":"John Doe","email":"john@example.com","role":"admin","profile":{"avatar":"https://example.com/avatars/john.png","bio":"Software developer"}}],"pagination":{"page":1,"total":100}}}`,
  },
  {
    id: 'config-file',
    name: 'Config File',
    description: 'Application configuration with various settings',
    icon: 'fas fa-cog',
    iconColor: '#2196F3',
    content: `{"app":{"name":"MyApp","version":"2.0.0"},"server":{"host":"0.0.0.0","port":3000,"cors":{"enabled":true,"origins":["https://app.example.com"]}},"database":{"type":"postgresql","host":"localhost","port":5432}}`,
  },
  {
    id: 'nested-deep',
    name: 'Deeply Nested',
    description: 'Complex nested structure for tree view demo',
    icon: 'fas fa-sitemap',
    iconColor: '#9C27B0',
    content: `{"company":{"departments":{"engineering":{"teams":{"frontend":{"lead":"Alice","members":[{"name":"Bob","skills":["React","TypeScript"]}]}}}}}}`,
  },
  {
    id: 'with-nulls',
    name: 'Data with Nulls',
    description: 'JSON with null values for cleaning demo',
    icon: 'fas fa-filter',
    iconColor: '#FF9800',
    content: `{"user":{"id":123,"name":"Developer","email":"dev@example.com","phone":null,"address":{"street":"123 Main St","apt":"","city":"SF"},"preferences":{"newsletter":true,"sms":null},"tags":["active",""],"metadata":{}}}`,
  },
  {
    id: 'minified',
    name: 'Minified JSON',
    description: 'Compressed JSON that needs formatting',
    icon: 'fas fa-compress',
    iconColor: '#E91E63',
    content: `{"products":[{"id":"P001","name":"Laptop","price":999.99,"specs":{"cpu":"Intel i7","ram":"16GB","storage":"512GB SSD"},"inStock":true},{"id":"P002","name":"Mouse","price":49.99,"specs":{"type":"wireless","dpi":1600},"inStock":false}],"total":2}`,
  },
  {
    id: 'array-objects',
    name: 'Array of Objects',
    description: 'Simple array structure',
    icon: 'fas fa-list',
    iconColor: '#00BCD4',
    content: `[{"id":1,"task":"Learn JSON","done":true},{"id":2,"task":"Build app","done":false},{"id":3,"task":"Deploy","done":false}]`,
  },
];

/**
 * Get sample by ID
 */
export function getSampleById(id: string): SampleTemplate | undefined {
  return JSON_FORMATTER_SAMPLES.find(sample => sample.id === id);
}

/**
 * Get all samples
 */
export function getAllSamples(): SampleTemplate[] {
  return JSON_FORMATTER_SAMPLES;
}
