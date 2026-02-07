/**
 * Sample JSON templates for the JSON Encoder tool
 */

export interface EncoderSample {
  id: string;
  name: string;
  description: string;
  content: string;
}

export const ENCODER_SAMPLES: EncoderSample[] = [
  {
    id: 'api-response',
    name: 'API Response',
    description: 'Typical REST API response structure',
    content: JSON.stringify({
      status: 'success',
      data: {
        id: 12345,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin'
      },
      meta: {
        timestamp: '2026-01-15T10:30:00Z',
        version: '1.0'
      }
    }, null, 2),
  },
  {
    id: 'config-object',
    name: 'Configuration Object',
    description: 'Application configuration structure',
    content: JSON.stringify({
      app: {
        name: 'MyApp',
        version: '2.1.0',
        debug: false
      },
      database: {
        host: 'localhost',
        port: 5432,
        name: 'myapp_db'
      },
      features: {
        auth: true,
        analytics: true,
        darkMode: false
      }
    }, null, 2),
  },
  {
    id: 'user-profile',
    name: 'User Profile',
    description: 'User data object with nested properties',
    content: JSON.stringify({
      id: 'usr_abc123',
      username: 'johndoe',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'https://example.com/avatar.jpg',
        bio: 'Software developer & coffee enthusiast'
      },
      preferences: {
        theme: 'dark',
        language: 'en-US',
        notifications: true
      },
      createdAt: '2025-06-15T08:00:00Z'
    }, null, 2),
  },
  {
    id: 'product-list',
    name: 'Product Array',
    description: 'Array of product items',
    content: JSON.stringify({
      products: [
        { id: 1, name: 'Widget Pro', price: 99.99, inStock: true },
        { id: 2, name: 'Gadget Plus', price: 149.99, inStock: true },
        { id: 3, name: 'Super Tool', price: 199.99, inStock: false }
      ],
      total: 3,
      currency: 'USD'
    }, null, 2),
  },
  {
    id: 'nested-complex',
    name: 'Complex Nested',
    description: 'Deeply nested JSON structure',
    content: JSON.stringify({
      organization: {
        name: 'TechCorp',
        departments: [
          {
            name: 'Engineering',
            teams: [
              {
                name: 'Frontend',
                members: ['Alice', 'Bob', 'Charlie'],
                projects: [
                  { name: 'Dashboard', status: 'active' },
                  { name: 'Mobile App', status: 'planning' }
                ]
              },
              {
                name: 'Backend',
                members: ['David', 'Eve'],
                projects: [
                  { name: 'API v2', status: 'active' }
                ]
              }
            ]
          }
        ]
      }
    }, null, 2),
  },
  {
    id: 'special-chars',
    name: 'Special Characters',
    description: 'JSON with special characters and Unicode',
    content: JSON.stringify({
      message: 'Hello, World! <script>alert("test")</script>',
      unicode: 'Café résumé naïve',
      symbols: '© ® ™ € £ ¥',
      emoji: '👋 🌍 🚀 ✨',
      quotes: 'He said "Hello" and she replied \'Hi\'',
      escapes: 'Line1\nLine2\tTabbed'
    }, null, 2),
  },
  {
    id: 'query-params',
    name: 'Query Parameters',
    description: 'Data for URL query string encoding',
    content: JSON.stringify({
      search: 'hello world',
      filters: {
        category: 'electronics',
        priceRange: '100-500',
        inStock: true
      },
      sort: 'price_asc',
      page: 1,
      limit: 20
    }, null, 2),
  },
  {
    id: 'jwt-payload',
    name: 'JWT Payload',
    description: 'Typical JWT token payload structure',
    content: JSON.stringify({
      sub: '1234567890',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      permissions: ['read', 'write', 'delete'],
      iat: 1704067200,
      exp: 1704153600,
      iss: 'https://auth.example.com'
    }, null, 2),
  },
];
