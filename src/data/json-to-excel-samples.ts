/**
 * Sample JSON templates for JSON to Excel tool
 */

export interface SampleTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  content: string;
}

export const JSON_TO_EXCEL_SAMPLES: SampleTemplate[] = [
  {
    id: 'users-list',
    name: 'Users List',
    description: 'Array of user objects with contact info',
    icon: 'fas fa-users',
    iconColor: '#4CAF50',
    content: `[
  {"id": 1, "name": "John Doe", "email": "john@example.com", "role": "Admin", "active": true},
  {"id": 2, "name": "Jane Smith", "email": "jane@example.com", "role": "User", "active": true},
  {"id": 3, "name": "Bob Wilson", "email": "bob@example.com", "role": "User", "active": false}
]`,
  },
  {
    id: 'nested-data',
    name: 'Nested Objects',
    description: 'Users with nested address and profile',
    icon: 'fas fa-sitemap',
    iconColor: '#9C27B0',
    content: `[
  {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@company.com",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "zip": "10001"
    },
    "profile": {
      "department": "Engineering",
      "title": "Senior Developer"
    }
  },
  {
    "id": 2,
    "name": "Bob Brown",
    "email": "bob@company.com",
    "address": {
      "street": "456 Oak Ave",
      "city": "Boston",
      "zip": "02101"
    },
    "profile": {
      "department": "Marketing",
      "title": "Manager"
    }
  }
]`,
  },
  {
    id: 'products',
    name: 'Product Catalog',
    description: 'E-commerce products with prices',
    icon: 'fas fa-shopping-cart',
    iconColor: '#E91E63',
    content: `[
  {"sku": "PROD-001", "name": "Wireless Mouse", "price": 29.99, "category": "Electronics", "stock": 150},
  {"sku": "PROD-002", "name": "USB-C Cable", "price": 12.99, "category": "Accessories", "stock": 300},
  {"sku": "PROD-003", "name": "Laptop Stand", "price": 49.99, "category": "Electronics", "stock": 75},
  {"sku": "PROD-004", "name": "Webcam HD", "price": 89.99, "category": "Electronics", "stock": 42}
]`,
  },
  {
    id: 'sales-data',
    name: 'Sales Report',
    description: 'Sales transactions with dates and amounts',
    icon: 'fas fa-chart-line',
    iconColor: '#2196F3',
    content: `[
  {"order_id": "ORD-1001", "date": "2026-01-15", "customer": "Acme Corp", "amount": 1250.00, "status": "Completed"},
  {"order_id": "ORD-1002", "date": "2026-01-15", "customer": "Tech Solutions", "amount": 890.50, "status": "Pending"},
  {"order_id": "ORD-1003", "date": "2026-01-16", "customer": "Global Inc", "amount": 2100.00, "status": "Completed"},
  {"order_id": "ORD-1004", "date": "2026-01-16", "customer": "Startup LLC", "amount": 450.75, "status": "Shipped"}
]`,
  },
  {
    id: 'api-response',
    name: 'API Response',
    description: 'Typical REST API response format',
    icon: 'fas fa-server',
    iconColor: '#FF9800',
    content: `{
  "status": "success",
  "data": {
    "users": [
      {"id": 101, "username": "developer1", "joined": "2025-01-10", "posts": 42},
      {"id": 102, "username": "developer2", "joined": "2025-02-15", "posts": 28},
      {"id": 103, "username": "designer1", "joined": "2025-03-20", "posts": 15}
    ]
  }
}`,
  },
  {
    id: 'single-object',
    name: 'Single Object',
    description: 'Convert a single object to one row',
    icon: 'fas fa-cube',
    iconColor: '#00BCD4',
    content: `{
  "company": "TechCorp",
  "founded": 2020,
  "employees": 150,
  "headquarters": "San Francisco",
  "industry": "Software",
  "revenue": "10M",
  "public": false
}`,
  },
];

/**
 * Get sample by ID
 */
export function getSampleById(id: string): SampleTemplate | undefined {
  return JSON_TO_EXCEL_SAMPLES.find(sample => sample.id === id);
}

/**
 * Get all samples
 */
export function getAllSamples(): SampleTemplate[] {
  return JSON_TO_EXCEL_SAMPLES;
}
