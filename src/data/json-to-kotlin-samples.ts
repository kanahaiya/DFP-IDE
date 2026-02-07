/**
 * Sample Templates for JSON to Kotlin Converter
 */

export interface SampleTemplate {
  name: string;
  description: string;
  content: string;
}

export const JSON_TO_KOTLIN_SAMPLES: SampleTemplate[] = [
  {
    name: 'API Response',
    description: 'Typical REST API response with user data',
    content: JSON.stringify(
      {
        success: true,
        data: {
          id: 12345,
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'https://example.com/avatar.jpg',
          createdAt: '2024-01-15T10:30:00Z',
          roles: ['admin', 'user'],
        },
        meta: {
          page: 1,
          total: 100,
        },
      },
      null,
      2
    ),
  },
  {
    name: 'User Profile',
    description: 'User profile with nested address',
    content: JSON.stringify(
      {
        id: 1,
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        isVerified: true,
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        preferences: {
          theme: 'dark',
          notifications: true,
        },
      },
      null,
      2
    ),
  },
  {
    name: 'Product Catalog',
    description: 'E-commerce product with variants',
    content: JSON.stringify(
      {
        id: 'prod_12345',
        name: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones',
        price: 299.99,
        currency: 'USD',
        inStock: true,
        category: 'Electronics',
        variants: [
          { color: 'Black', sku: 'ATH-001-BLK', quantity: 75 },
          { color: 'White', sku: 'ATH-001-WHT', quantity: 50 },
        ],
        ratings: {
          average: 4.5,
          count: 128,
        },
        tags: ['wireless', 'bluetooth', 'noise-cancelling'],
      },
      null,
      2
    ),
  },
  {
    name: 'Android Config',
    description: 'App configuration object',
    content: JSON.stringify(
      {
        appName: 'MyApp',
        version: '2.1.0',
        buildNumber: 42,
        debug: false,
        api: {
          baseUrl: 'https://api.example.com',
          timeout: 30000,
          retryCount: 3,
        },
        features: {
          darkMode: true,
          pushNotifications: true,
          analytics: false,
          crashReporting: true,
        },
        supportedLocales: ['en', 'es', 'fr', 'de'],
      },
      null,
      2
    ),
  },
  {
    name: 'Blog Post',
    description: 'Blog post with author and comments',
    content: JSON.stringify(
      {
        id: 42,
        title: 'Getting Started with Kotlin',
        slug: 'getting-started-with-kotlin',
        excerpt: 'Learn the basics of Kotlin...',
        publishedAt: '2024-03-15T09:00:00Z',
        author: {
          id: 1,
          name: 'Jane Smith',
          avatar: 'https://example.com/avatars/jane.jpg',
        },
        tags: ['kotlin', 'android', 'tutorial'],
        comments: [
          {
            id: 101,
            author: 'Bob',
            content: 'Great article!',
            createdAt: '2024-03-16T10:00:00Z',
          },
        ],
        metadata: {
          views: 1250,
          likes: 89,
        },
      },
      null,
      2
    ),
  },
  {
    name: 'Nullable Fields',
    description: 'Object with nullable properties',
    content: JSON.stringify(
      {
        id: 1,
        requiredField: 'This is required',
        optionalString: null,
        optionalNumber: null,
        nested: {
          present: 'value',
          missing: null,
        },
        status: 'active',
      },
      null,
      2
    ),
  },
  {
    name: 'Simple Object',
    description: 'Basic flat object',
    content: JSON.stringify(
      {
        id: 1,
        name: 'Sample Item',
        price: 19.99,
        quantity: 100,
        active: true,
      },
      null,
      2
    ),
  },
];
