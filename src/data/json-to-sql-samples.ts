/**
 * Sample JSON data for SQL converter
 */

export const sqlSamples = [
  {
    name: 'Simple Users',
    json: `[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "active": true
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "active": false
  }
]`,
  },
  {
    name: 'Products',
    json: `[
  {
    "sku": "PROD-001",
    "name": "Laptop",
    "price": 999.99,
    "quantity": 50,
    "category": "Electronics"
  },
  {
    "sku": "PROD-002",
    "name": "Mouse",
    "price": 29.99,
    "quantity": 200,
    "category": "Accessories"
  }
]`,
  },
  {
    name: 'Orders',
    json: `[
  {
    "order_id": "ORD-2024-001",
    "customer_id": 101,
    "total": 1250.00,
    "status": "shipped",
    "created_at": "2024-01-15T10:30:00Z"
  },
  {
    "order_id": "ORD-2024-002",
    "customer_id": 102,
    "total": 85.50,
    "status": "pending",
    "created_at": "2024-01-16T14:20:00Z"
  }
]`,
  },
  {
    name: 'Single Record',
    json: `{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "role": "administrator",
  "last_login": "2024-01-15T08:00:00Z"
}`,
  },
];
