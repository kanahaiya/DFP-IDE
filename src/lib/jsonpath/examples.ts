/**
 * JSONPath Examples
 * Pre-loaded JSON examples and sample queries for learning
 */

import type { JSONPathExample } from './types';

export const JSONPATH_EXAMPLES: JSONPathExample[] = [
  {
    id: 'store',
    name: 'Bookstore',
    description: 'Classic bookstore example with books and bicycle',
    icon: 'fas fa-book',
    category: 'Classic',
    json: JSON.stringify({
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
    queries: [
      { name: 'All authors', query: '$.store.book[*].author', description: 'Get all book authors' },
      { name: 'All prices', query: '$..price', description: 'Recursively find all prices' },
      { name: 'Third book', query: '$.store.book[2]', description: 'Get the third book' },
      { name: 'Last book', query: '$.store.book[-1]', description: 'Get the last book' },
      { name: 'First two books', query: '$.store.book[0:2]', description: 'Get first two books' },
      { name: 'Books with ISBN', query: '$.store.book[?(@.isbn)]', description: 'Books that have ISBN' },
      { name: 'Cheap books', query: '$.store.book[?(@.price < 10)]', description: 'Books under $10' },
      { name: 'Fiction books', query: "$.store.book[?(@.category == 'fiction')]", description: 'Filter by category' },
      { name: 'All things in store', query: '$.store.*', description: 'Everything in store' },
      { name: 'Book count', query: '$.store.book.length()', description: 'Number of books' },
    ],
  },
  {
    id: 'users',
    name: 'User Profiles',
    description: 'API response with user data and nested addresses',
    icon: 'fas fa-users',
    category: 'API Response',
    json: JSON.stringify({
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
            country: 'USA',
            zip: '10001'
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
            country: 'USA',
            zip: '90001'
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
            country: 'USA',
            zip: '60601'
          },
          roles: ['moderator', 'user']
        }
      ],
      meta: {
        total: 3,
        page: 1,
        perPage: 10
      }
    }, null, 2),
    queries: [
      { name: 'All user names', query: '$.users[*].name', description: 'Get all user names' },
      { name: 'All cities', query: '$..city', description: 'Recursively find all cities' },
      { name: 'Active users', query: '$.users[?(@.active == true)]', description: 'Filter active users' },
      { name: 'Adults (age > 30)', query: '$.users[?(@.age > 30)]', description: 'Users over 30' },
      { name: 'Admin users', query: "$.users[?('admin' in @.roles)]", description: 'Users with admin role' },
      { name: 'User emails', query: '$.users[*].email', description: 'All email addresses' },
      { name: 'First user address', query: '$.users[0].address', description: 'Address of first user' },
      { name: 'Total count', query: '$.meta.total', description: 'Get total from metadata' },
    ],
  },
  {
    id: 'products',
    name: 'E-commerce Products',
    description: 'Product catalog with categories and variants',
    icon: 'fas fa-shopping-cart',
    category: 'E-commerce',
    json: JSON.stringify({
      products: [
        {
          id: 'prod-001',
          name: 'Laptop Pro 15',
          category: 'Electronics',
          price: 1299.99,
          inStock: true,
          rating: 4.5,
          tags: ['laptop', 'computer', 'portable'],
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
          tags: ['mouse', 'wireless', 'ergonomic'],
          variants: [
            { color: 'Black', sku: 'WM-BLK', stock: 100 },
            { color: 'White', sku: 'WM-WHT', stock: 75 }
          ]
        },
        {
          id: 'prod-003',
          name: 'USB-C Hub',
          category: 'Accessories',
          price: 79.99,
          inStock: false,
          rating: 4.8,
          tags: ['usb', 'hub', 'adapter'],
          variants: [
            { color: 'Gray', sku: 'USBC-GRY', stock: 0 }
          ]
        }
      ]
    }, null, 2),
    queries: [
      { name: 'All products', query: '$.products[*]', description: 'Get all products' },
      { name: 'Product names', query: '$.products[*].name', description: 'List all product names' },
      { name: 'In stock products', query: '$.products[?(@.inStock == true)]', description: 'Available products' },
      { name: 'Electronics', query: "$.products[?(@.category == 'Electronics')]", description: 'Filter by category' },
      { name: 'High rated (4.5+)', query: '$.products[?(@.rating >= 4.5)]', description: 'Products with 4.5+ rating' },
      { name: 'Under $100', query: '$.products[?(@.price < 100)]', description: 'Budget-friendly products' },
      { name: 'All variants', query: '$..variants[*]', description: 'All product variants' },
      { name: 'All SKUs', query: '$..sku', description: 'Get all SKU codes' },
      { name: 'All tags', query: '$..tags[*]', description: 'All product tags' },
    ],
  },
  {
    id: 'nested',
    name: 'Nested Objects',
    description: 'Deeply nested structure for recursive queries',
    icon: 'fas fa-layer-group',
    category: 'Advanced',
    json: JSON.stringify({
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
                  { name: 'Eve', role: 'Lead', level: 5 },
                  { name: 'Frank', role: 'Designer', level: 3 }
                ]
              }
            ]
          }
        ]
      }
    }, null, 2),
    queries: [
      { name: 'All member names', query: '$..name', description: 'Recursively find all names' },
      { name: 'All team members', query: '$..members[*]', description: 'Get all members' },
      { name: 'All leads', query: "$..members[?(@.role == 'Lead')]", description: 'Find team leads' },
      { name: 'High level (5)', query: '$..members[?(@.level == 5)]', description: 'Level 5 employees' },
      { name: 'Department names', query: '$.company.departments[*].name', description: 'List departments' },
      { name: 'Team names', query: '$..teams[*].name', description: 'List all teams' },
      { name: 'Engineering teams', query: '$.company.departments[0].teams[*]', description: 'Teams in Engineering' },
    ],
  },
  {
    id: 'logs',
    name: 'Log Entries',
    description: 'Server log entries with timestamps and levels',
    icon: 'fas fa-file-alt',
    category: 'DevOps',
    json: JSON.stringify({
      logs: [
        { timestamp: '2024-01-15T10:30:00Z', level: 'INFO', service: 'api', message: 'Request received', requestId: 'req-001' },
        { timestamp: '2024-01-15T10:30:01Z', level: 'DEBUG', service: 'api', message: 'Processing data', requestId: 'req-001' },
        { timestamp: '2024-01-15T10:30:02Z', level: 'ERROR', service: 'api', message: 'Database connection failed', requestId: 'req-001', error: { code: 'DB_CONN_ERR', details: 'Timeout after 30s' } },
        { timestamp: '2024-01-15T10:30:05Z', level: 'INFO', service: 'worker', message: 'Job started', jobId: 'job-123' },
        { timestamp: '2024-01-15T10:30:10Z', level: 'WARN', service: 'worker', message: 'High memory usage', jobId: 'job-123', metrics: { memory: '85%', cpu: '60%' } },
        { timestamp: '2024-01-15T10:30:15Z', level: 'INFO', service: 'worker', message: 'Job completed', jobId: 'job-123' }
      ]
    }, null, 2),
    queries: [
      { name: 'All logs', query: '$.logs[*]', description: 'Get all log entries' },
      { name: 'Error logs', query: "$.logs[?(@.level == 'ERROR')]", description: 'Filter error level logs' },
      { name: 'API service logs', query: "$.logs[?(@.service == 'api')]", description: 'Logs from API service' },
      { name: 'All messages', query: '$.logs[*].message', description: 'Extract all messages' },
      { name: 'Logs with errors', query: '$.logs[?(@.error)]', description: 'Logs that have error details' },
      { name: 'Error codes', query: '$..error.code', description: 'Extract all error codes' },
      { name: 'Worker metrics', query: '$..metrics', description: 'Get all metrics objects' },
    ],
  },
];

/**
 * Get example by ID
 */
export function getJSONPathExample(id: string): JSONPathExample | undefined {
  return JSONPATH_EXAMPLES.find(e => e.id === id);
}

/**
 * Get examples by category
 */
export function getJSONPathExamplesByCategory(category: string): JSONPathExample[] {
  return JSONPATH_EXAMPLES.filter(e => e.category === category);
}

/**
 * Get all categories
 */
export function getJSONPathCategories(): string[] {
  const categories = new Set(JSONPATH_EXAMPLES.map(e => e.category));
  return Array.from(categories);
}
