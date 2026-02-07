/**
 * Sample Templates for JSON to JavaScript Converter
 */

export interface SampleTemplate {
  name: string;
  description: string;
  content: string;
}

export const JSON_TO_JAVASCRIPT_SAMPLES: SampleTemplate[] = [
  {
    name: 'Configuration',
    description: 'Application configuration object',
    content: JSON.stringify(
      {
        apiEndpoint: 'https://api.example.com',
        timeout: 5000,
        retries: 3,
        debug: false,
        features: {
          darkMode: true,
          analytics: true,
          notifications: false,
        },
        allowedOrigins: ['https://example.com', 'https://app.example.com'],
      },
      null,
      2
    ),
  },
  {
    name: 'User Data',
    description: 'User profile information',
    content: JSON.stringify(
      {
        id: 1,
        username: 'johndoe',
        email: 'john@example.com',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          age: 30,
          location: 'New York',
        },
        preferences: {
          theme: 'dark',
          language: 'en',
          notifications: true,
        },
        roles: ['user', 'admin'],
      },
      null,
      2
    ),
  },
  {
    name: 'Product List',
    description: 'Array of product objects',
    content: JSON.stringify(
      [
        {
          id: 'prod-001',
          name: 'Wireless Headphones',
          price: 99.99,
          inStock: true,
          category: 'Electronics',
        },
        {
          id: 'prod-002',
          name: 'USB-C Cable',
          price: 12.99,
          inStock: true,
          category: 'Accessories',
        },
        {
          id: 'prod-003',
          name: 'Laptop Stand',
          price: 45.0,
          inStock: false,
          category: 'Accessories',
        },
      ],
      null,
      2
    ),
  },
  {
    name: 'API Response',
    description: 'Typical REST API response structure',
    content: JSON.stringify(
      {
        success: true,
        data: {
          items: [
            { id: 1, title: 'First Item', status: 'active' },
            { id: 2, title: 'Second Item', status: 'pending' },
          ],
          pagination: {
            page: 1,
            perPage: 10,
            total: 25,
            totalPages: 3,
          },
        },
        meta: {
          requestId: 'req-abc123',
          timestamp: '2024-01-15T10:30:00Z',
        },
      },
      null,
      2
    ),
  },
  {
    name: 'Country Codes',
    description: 'Reference data for countries',
    content: JSON.stringify(
      {
        US: { name: 'United States', code: '+1', currency: 'USD' },
        GB: { name: 'United Kingdom', code: '+44', currency: 'GBP' },
        DE: { name: 'Germany', code: '+49', currency: 'EUR' },
        JP: { name: 'Japan', code: '+81', currency: 'JPY' },
        AU: { name: 'Australia', code: '+61', currency: 'AUD' },
      },
      null,
      2
    ),
  },
  {
    name: 'Theme Config',
    description: 'UI theme configuration',
    content: JSON.stringify(
      {
        colors: {
          primary: '#3b82f6',
          secondary: '#64748b',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
          background: '#ffffff',
          text: '#1e293b',
        },
        fonts: {
          body: 'Inter, sans-serif',
          heading: 'Poppins, sans-serif',
          mono: 'Fira Code, monospace',
        },
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
        },
        borderRadius: {
          sm: '0.25rem',
          md: '0.5rem',
          lg: '1rem',
          full: '9999px',
        },
      },
      null,
      2
    ),
  },
  {
    name: 'Menu Structure',
    description: 'Navigation menu with nested items',
    content: JSON.stringify(
      {
        main: [
          { label: 'Home', path: '/', icon: 'home' },
          { label: 'About', path: '/about', icon: 'info' },
          {
            label: 'Products',
            path: '/products',
            icon: 'box',
            children: [
              { label: 'All Products', path: '/products' },
              { label: 'Categories', path: '/products/categories' },
              { label: 'Featured', path: '/products/featured' },
            ],
          },
          { label: 'Contact', path: '/contact', icon: 'mail' },
        ],
        footer: [
          { label: 'Privacy', path: '/privacy' },
          { label: 'Terms', path: '/terms' },
          { label: 'FAQ', path: '/faq' },
        ],
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
        name: 'My App',
        version: '1.0.0',
        description: 'A sample application',
        author: 'Developer',
        license: 'MIT',
      },
      null,
      2
    ),
  },
];
