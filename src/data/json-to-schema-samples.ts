/**
 * JSON to Schema Generator Sample Templates
 */

export interface SampleTemplate {
  name: string;
  description: string;
  content: string;
  icon?: string;
  iconColor?: string;
}

export const jsonToSchemaSamples: SampleTemplate[] = [
  {
    name: 'User Profile',
    description: 'A typical user profile with common fields',
    icon: 'fa-user',
    iconColor: 'text-blue-500',
    content: `{
  "id": 12345,
  "username": "john_doe",
  "email": "john@example.com",
  "age": 30,
  "isActive": true,
  "role": "admin",
  "createdAt": "2026-01-16T10:30:00Z"
}`,
  },
  {
    name: 'Product',
    description: 'E-commerce product with nested data',
    icon: 'fa-shopping-cart',
    iconColor: 'text-green-500',
    content: `{
  "sku": "ABC-1234",
  "name": "Wireless Headphones",
  "price": 99.99,
  "inStock": true,
  "categories": ["Electronics", "Audio"],
  "specs": {
    "battery": "20 hours",
    "weight": "250g",
    "bluetooth": "5.0"
  }
}`,
  },
  {
    name: 'API Response',
    description: 'REST API response structure',
    icon: 'fa-exchange-alt',
    iconColor: 'text-purple-500',
    content: `{
  "status": "success",
  "code": 200,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "Alice",
        "email": "alice@example.com"
      }
    ],
    "pagination": {
      "page": 1,
      "perPage": 10,
      "total": 100
    }
  },
  "timestamp": "2026-01-16T10:30:00Z"
}`,
  },
  {
    name: 'Blog Post',
    description: 'Blog post with author and comments',
    icon: 'fa-newspaper',
    iconColor: 'text-orange-500',
    content: `{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Getting Started with TypeScript",
  "slug": "getting-started-typescript",
  "content": "TypeScript is a typed superset of JavaScript...",
  "author": {
    "id": 1,
    "name": "Jane Smith",
    "avatar": "https://example.com/avatar.jpg"
  },
  "tags": ["typescript", "javascript", "programming"],
  "comments": [
    {
      "id": 1,
      "text": "Great article!",
      "authorName": "Bob"
    }
  ],
  "publishedAt": "2026-01-16",
  "views": 1250
}`,
  },
  {
    name: 'Config File',
    description: 'Application configuration',
    icon: 'fa-cog',
    iconColor: 'text-gray-500',
    content: `{
  "app": {
    "name": "MyApp",
    "version": "1.0.0",
    "port": 3000
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "myapp_db",
    "ssl": false
  },
  "features": {
    "darkMode": true,
    "analytics": false,
    "maxUploadSize": 10485760
  }
}`,
  },
  {
    name: 'Event',
    description: 'Calendar event with attendees',
    icon: 'fa-calendar',
    iconColor: 'text-cyan-500',
    content: `{
  "id": "evt-123",
  "title": "Team Meeting",
  "description": "Weekly team sync",
  "start": "2026-01-16T10:00:00Z",
  "end": "2026-01-16T11:00:00Z",
  "location": "Conference Room A",
  "isRecurring": true,
  "attendees": [
    {
      "email": "alice@company.com",
      "name": "Alice",
      "status": "accepted"
    },
    {
      "email": "bob@company.com",
      "name": "Bob",
      "status": "pending"
    }
  ]
}`,
  },
];

export const defaultSample = jsonToSchemaSamples[0];
