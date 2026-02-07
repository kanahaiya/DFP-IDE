/**
 * JSONPath Tester Sample Templates
 * Pre-loaded JSON samples with example queries
 */

export interface SampleTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  content: string;
  defaultQuery?: string;
}

export const JSONPATH_SAMPLES: SampleTemplate[] = [
  {
    id: 'bookstore',
    name: 'Bookstore',
    description: 'Classic JSONPath example with books and bicycle',
    icon: 'fas fa-book',
    iconColor: '#3B82F6',
    content: JSON.stringify({
      store: {
        book: [
          {
            category: 'reference',
            author: 'Nigel Rees',
            title: 'Sayings of the Century',
            price: 8.95
          },
          {
            category: 'fiction',
            author: 'Evelyn Waugh',
            title: 'Sword of Honour',
            price: 12.99
          },
          {
            category: 'fiction',
            author: 'Herman Melville',
            title: 'Moby Dick',
            isbn: '0-553-21311-3',
            price: 8.99
          },
          {
            category: 'fiction',
            author: 'J. R. R. Tolkien',
            title: 'The Lord of the Rings',
            isbn: '0-395-19395-8',
            price: 22.99
          }
        ],
        bicycle: {
          color: 'red',
          price: 19.95
        }
      }
    }, null, 2),
    defaultQuery: '$.store.book[*].author',
  },
  {
    id: 'users',
    name: 'User Profiles',
    description: 'API response with nested user data',
    icon: 'fas fa-users',
    iconColor: '#10B981',
    content: JSON.stringify({
      users: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          age: 30,
          active: true,
          address: {
            street: '123 Main St',
            city: 'New York',
            country: 'USA'
          },
          roles: ['admin', 'user']
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          age: 25,
          active: true,
          address: {
            street: '456 Oak Ave',
            city: 'Los Angeles',
            country: 'USA'
          },
          roles: ['user']
        },
        {
          id: 3,
          name: 'Bob Wilson',
          email: 'bob@example.com',
          age: 45,
          active: false,
          address: {
            street: '789 Pine Rd',
            city: 'Chicago',
            country: 'USA'
          },
          roles: ['moderator', 'user']
        }
      ],
      meta: {
        total: 3,
        page: 1
      }
    }, null, 2),
    defaultQuery: '$.users[?(@.active == true)].name',
  },
  {
    id: 'products',
    name: 'Product Catalog',
    description: 'E-commerce products with variants',
    icon: 'fas fa-shopping-cart',
    iconColor: '#F59E0B',
    content: JSON.stringify({
      products: [
        {
          id: 'prod-001',
          name: 'Laptop Pro 15',
          category: 'Electronics',
          price: 1299.99,
          inStock: true,
          rating: 4.5,
          tags: ['laptop', 'computer'],
          variants: [
            { color: 'Silver', sku: 'LP15-SLV', stock: 50 },
            { color: 'Space Gray', sku: 'LP15-GRY', stock: 30 }
          ]
        },
        {
          id: 'prod-002',
          name: 'Wireless Mouse',
          category: 'Accessories',
          price: 49.99,
          inStock: true,
          rating: 4.2,
          tags: ['mouse', 'wireless'],
          variants: [
            { color: 'Black', sku: 'WM-BLK', stock: 100 }
          ]
        },
        {
          id: 'prod-003',
          name: 'USB-C Hub',
          category: 'Accessories',
          price: 79.99,
          inStock: false,
          rating: 4.8,
          tags: ['usb', 'hub'],
          variants: []
        }
      ]
    }, null, 2),
    defaultQuery: '$.products[?(@.price < 100)]',
  },
  {
    id: 'logs',
    name: 'Server Logs',
    description: 'JSON formatted log entries',
    icon: 'fas fa-file-alt',
    iconColor: '#EF4444',
    content: JSON.stringify({
      logs: [
        { timestamp: '2024-01-15T10:30:00Z', level: 'INFO', service: 'api', message: 'Request received', requestId: 'req-001' },
        { timestamp: '2024-01-15T10:30:01Z', level: 'DEBUG', service: 'api', message: 'Processing data', requestId: 'req-001' },
        { timestamp: '2024-01-15T10:30:02Z', level: 'ERROR', service: 'api', message: 'Database connection failed', requestId: 'req-001', error: { code: 'DB_CONN_ERR', details: 'Timeout after 30s' } },
        { timestamp: '2024-01-15T10:30:05Z', level: 'INFO', service: 'worker', message: 'Job started', jobId: 'job-123' },
        { timestamp: '2024-01-15T10:30:10Z', level: 'WARN', service: 'worker', message: 'High memory usage', jobId: 'job-123' },
        { timestamp: '2024-01-15T10:30:15Z', level: 'INFO', service: 'worker', message: 'Job completed', jobId: 'job-123' }
      ]
    }, null, 2),
    defaultQuery: "$.logs[?(@.level == 'ERROR')]",
  },
  {
    id: 'nested',
    name: 'Nested Structure',
    description: 'Deeply nested organization data',
    icon: 'fas fa-sitemap',
    iconColor: '#8B5CF6',
    content: JSON.stringify({
      company: {
        name: 'Tech Corp',
        departments: [
          {
            name: 'Engineering',
            teams: [
              {
                name: 'Frontend',
                members: [
                  { name: 'Alice', role: 'Lead', level: 5 },
                  { name: 'Bob', role: 'Developer', level: 3 }
                ]
              },
              {
                name: 'Backend',
                members: [
                  { name: 'Charlie', role: 'Lead', level: 5 },
                  { name: 'Diana', role: 'Developer', level: 4 }
                ]
              }
            ]
          },
          {
            name: 'Design',
            teams: [
              {
                name: 'UX',
                members: [
                  { name: 'Eve', role: 'Lead', level: 5 }
                ]
              }
            ]
          }
        ]
      }
    }, null, 2),
    defaultQuery: "$..members[?(@.role == 'Lead')]",
  },
];
