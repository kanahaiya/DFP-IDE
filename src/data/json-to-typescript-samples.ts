/**
 * Sample Templates for JSON to TypeScript Converter
 */

export interface SampleTemplate {
  name: string;
  description: string;
  content: string;
}

export const JSON_TO_TYPESCRIPT_SAMPLES: SampleTemplate[] = [
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
          updatedAt: '2024-06-20T14:45:00Z',
          roles: ['admin', 'user'],
          settings: {
            theme: 'dark',
            notifications: true,
            language: 'en',
          },
        },
        meta: {
          page: 1,
          total: 100,
          perPage: 20,
        },
      },
      null,
      2
    ),
  },
  {
    name: 'User Profile',
    description: 'User profile with nested address and preferences',
    content: JSON.stringify(
      {
        id: 1,
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        isVerified: true,
        birthDate: '1990-05-15',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        preferences: {
          newsletter: true,
          smsNotifications: false,
          emailFrequency: 'weekly',
        },
        socialLinks: {
          twitter: '@johndoe',
          linkedin: 'in/johndoe',
          github: 'johndoe',
        },
      },
      null,
      2
    ),
  },
  {
    name: 'Product Catalog',
    description: 'E-commerce product with variants and pricing',
    content: JSON.stringify(
      {
        id: 'prod_12345',
        name: 'Premium Wireless Headphones',
        slug: 'premium-wireless-headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        brand: 'AudioTech',
        category: 'Electronics',
        price: {
          amount: 299.99,
          currency: 'USD',
          discount: 15,
          finalPrice: 254.99,
        },
        inventory: {
          quantity: 150,
          sku: 'ATH-WH-001',
          inStock: true,
        },
        variants: [
          { color: 'Black', sku: 'ATH-WH-001-BLK', quantity: 75 },
          { color: 'White', sku: 'ATH-WH-001-WHT', quantity: 50 },
          { color: 'Navy', sku: 'ATH-WH-001-NVY', quantity: 25 },
        ],
        images: [
          'https://example.com/images/headphones-1.jpg',
          'https://example.com/images/headphones-2.jpg',
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
    name: 'Blog Post',
    description: 'Blog post with author and comments',
    content: JSON.stringify(
      {
        id: 42,
        title: 'Getting Started with TypeScript',
        slug: 'getting-started-with-typescript',
        excerpt: 'Learn the basics of TypeScript...',
        content: 'Full article content here...',
        publishedAt: '2024-03-15T09:00:00Z',
        updatedAt: '2024-03-20T14:30:00Z',
        status: 'published',
        author: {
          id: 1,
          name: 'Jane Smith',
          avatar: 'https://example.com/avatars/jane.jpg',
          bio: 'Senior Developer',
        },
        categories: ['TypeScript', 'Programming', 'Web Development'],
        tags: ['typescript', 'javascript', 'tutorial'],
        comments: [
          {
            id: 101,
            author: 'Bob',
            content: 'Great article!',
            createdAt: '2024-03-16T10:00:00Z',
            likes: 5,
          },
          {
            id: 102,
            author: 'Alice',
            content: 'Very helpful, thanks!',
            createdAt: '2024-03-17T15:30:00Z',
            likes: 3,
          },
        ],
        metadata: {
          views: 1250,
          readTime: 8,
          featured: true,
        },
      },
      null,
      2
    ),
  },
  {
    name: 'Configuration',
    description: 'Application configuration object',
    content: JSON.stringify(
      {
        app: {
          name: 'MyApp',
          version: '2.1.0',
          environment: 'production',
        },
        server: {
          host: 'localhost',
          port: 3000,
          ssl: true,
          timeout: 30000,
        },
        database: {
          type: 'postgres',
          host: 'db.example.com',
          port: 5432,
          name: 'myapp_prod',
          pool: {
            min: 2,
            max: 10,
          },
        },
        cache: {
          enabled: true,
          ttl: 3600,
          prefix: 'myapp:',
        },
        features: {
          darkMode: true,
          analytics: true,
          beta: false,
        },
        logging: {
          level: 'info',
          format: 'json',
          outputs: ['console', 'file'],
        },
      },
      null,
      2
    ),
  },
  {
    name: 'GraphQL Response',
    description: 'GraphQL query response structure',
    content: JSON.stringify(
      {
        data: {
          user: {
            id: '1',
            name: 'John Doe',
            posts: {
              edges: [
                {
                  node: {
                    id: '101',
                    title: 'First Post',
                    createdAt: '2024-01-10T10:00:00Z',
                  },
                  cursor: 'Y3Vyc29yMQ==',
                },
                {
                  node: {
                    id: '102',
                    title: 'Second Post',
                    createdAt: '2024-02-15T14:30:00Z',
                  },
                  cursor: 'Y3Vyc29yMg==',
                },
              ],
              pageInfo: {
                hasNextPage: true,
                hasPreviousPage: false,
                startCursor: 'Y3Vyc29yMQ==',
                endCursor: 'Y3Vyc29yMg==',
              },
              totalCount: 25,
            },
          },
        },
        errors: null,
      },
      null,
      2
    ),
  },
  {
    name: 'Nullable Fields',
    description: 'Object with various nullable fields',
    content: JSON.stringify(
      {
        id: 1,
        requiredField: 'This is required',
        optionalString: null,
        optionalNumber: null,
        nestedOptional: {
          present: 'value',
          missing: null,
        },
        mixedArray: [1, 'two', null, true],
        status: 'active',
        metadata: null,
      },
      null,
      2
    ),
  },
  {
    name: 'Simple Object',
    description: 'Basic flat object structure',
    content: JSON.stringify(
      {
        id: 1,
        name: 'Sample Item',
        description: 'A simple example',
        price: 19.99,
        quantity: 100,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
      },
      null,
      2
    ),
  },
];
