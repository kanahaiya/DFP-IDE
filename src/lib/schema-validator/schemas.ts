/**
 * Example JSON Schemas
 * Pre-built schemas for common use cases
 */

import type { ExampleSchema } from './types';

export const EXAMPLE_SCHEMAS: ExampleSchema[] = [
  {
    id: 'user-profile',
    name: 'User Profile',
    description: 'Schema for user profile data',
    icon: 'fa-user',
    schema: JSON.stringify({
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "title": "User Profile",
      "description": "A user profile schema",
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "minimum": 1
        },
        "username": {
          "type": "string",
          "minLength": 3,
          "maxLength": 30,
          "pattern": "^[a-zA-Z0-9_]+$"
        },
        "email": {
          "type": "string",
          "format": "email"
        },
        "age": {
          "type": "integer",
          "minimum": 0,
          "maximum": 150
        },
        "role": {
          "type": "string",
          "enum": ["admin", "user", "guest"]
        },
        "isActive": {
          "type": "boolean"
        }
      },
      "required": ["id", "username", "email"]
    }, null, 2),
    sampleData: JSON.stringify({
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "age": 30,
      "role": "user",
      "isActive": true
    }, null, 2),
  },
  {
    id: 'api-response',
    name: 'API Response',
    description: 'Schema for REST API response',
    icon: 'fa-exchange-alt',
    schema: JSON.stringify({
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "title": "API Response",
      "type": "object",
      "properties": {
        "status": {
          "type": "string",
          "enum": ["success", "error"]
        },
        "code": {
          "type": "integer",
          "minimum": 100,
          "maximum": 599
        },
        "message": {
          "type": "string"
        },
        "data": {
          "oneOf": [
            { "type": "object" },
            { "type": "array" },
            { "type": "null" }
          ]
        },
        "timestamp": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": ["status", "code"]
    }, null, 2),
    sampleData: JSON.stringify({
      "status": "success",
      "code": 200,
      "message": "Data retrieved successfully",
      "data": { "items": [] },
      "timestamp": "2026-01-16T10:30:00Z"
    }, null, 2),
  },
  {
    id: 'product',
    name: 'Product',
    description: 'Schema for e-commerce product',
    icon: 'fa-shopping-cart',
    schema: JSON.stringify({
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "title": "Product",
      "type": "object",
      "properties": {
        "sku": {
          "type": "string",
          "pattern": "^[A-Z]{3}-[0-9]{4}$"
        },
        "name": {
          "type": "string",
          "minLength": 1,
          "maxLength": 200
        },
        "description": {
          "type": "string"
        },
        "price": {
          "type": "number",
          "minimum": 0,
          "exclusiveMinimum": 0
        },
        "currency": {
          "type": "string",
          "enum": ["USD", "EUR", "GBP", "JPY"]
        },
        "inStock": {
          "type": "boolean"
        },
        "quantity": {
          "type": "integer",
          "minimum": 0
        },
        "categories": {
          "type": "array",
          "items": { "type": "string" },
          "minItems": 1
        }
      },
      "required": ["sku", "name", "price"]
    }, null, 2),
    sampleData: JSON.stringify({
      "sku": "ABC-1234",
      "name": "Wireless Headphones",
      "description": "Premium wireless headphones",
      "price": 99.99,
      "currency": "USD",
      "inStock": true,
      "quantity": 50,
      "categories": ["Electronics", "Audio"]
    }, null, 2),
  },
  {
    id: 'config-file',
    name: 'Config File',
    description: 'Schema for application configuration',
    icon: 'fa-cog',
    schema: JSON.stringify({
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "title": "Application Config",
      "type": "object",
      "properties": {
        "app": {
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "version": { 
              "type": "string",
              "pattern": "^\\d+\\.\\d+\\.\\d+$"
            },
            "port": {
              "type": "integer",
              "minimum": 1,
              "maximum": 65535
            }
          },
          "required": ["name", "version"]
        },
        "database": {
          "type": "object",
          "properties": {
            "host": { "type": "string" },
            "port": { "type": "integer" },
            "name": { "type": "string" },
            "ssl": { "type": "boolean" }
          },
          "required": ["host", "name"]
        },
        "logging": {
          "type": "object",
          "properties": {
            "level": {
              "type": "string",
              "enum": ["debug", "info", "warn", "error"]
            },
            "format": {
              "type": "string",
              "enum": ["json", "text"]
            }
          }
        }
      },
      "required": ["app"]
    }, null, 2),
    sampleData: JSON.stringify({
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
      "logging": {
        "level": "info",
        "format": "json"
      }
    }, null, 2),
  },
  {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'Schema for contact form submission',
    icon: 'fa-envelope',
    schema: JSON.stringify({
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "title": "Contact Form",
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "minLength": 2,
          "maxLength": 100
        },
        "email": {
          "type": "string",
          "format": "email"
        },
        "phone": {
          "type": "string",
          "pattern": "^\\+?[1-9]\\d{6,14}$"
        },
        "subject": {
          "type": "string",
          "enum": ["general", "support", "sales", "feedback"]
        },
        "message": {
          "type": "string",
          "minLength": 10,
          "maxLength": 5000
        },
        "consent": {
          "type": "boolean",
          "const": true
        }
      },
      "required": ["name", "email", "subject", "message", "consent"]
    }, null, 2),
    sampleData: JSON.stringify({
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+1234567890",
      "subject": "support",
      "message": "I need help with my account settings.",
      "consent": true
    }, null, 2),
  },
  {
    id: 'order',
    name: 'Order',
    description: 'Schema for e-commerce order',
    icon: 'fa-receipt',
    schema: JSON.stringify({
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "title": "Order",
      "type": "object",
      "properties": {
        "orderId": {
          "type": "string",
          "format": "uuid"
        },
        "customerId": {
          "type": "integer"
        },
        "items": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "productId": { "type": "string" },
              "quantity": { "type": "integer", "minimum": 1 },
              "price": { "type": "number", "minimum": 0 }
            },
            "required": ["productId", "quantity", "price"]
          },
          "minItems": 1
        },
        "total": {
          "type": "number",
          "minimum": 0
        },
        "status": {
          "type": "string",
          "enum": ["pending", "processing", "shipped", "delivered", "cancelled"]
        },
        "createdAt": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": ["orderId", "customerId", "items", "total", "status"]
    }, null, 2),
    sampleData: JSON.stringify({
      "orderId": "550e8400-e29b-41d4-a716-446655440000",
      "customerId": 12345,
      "items": [
        { "productId": "ABC-1234", "quantity": 2, "price": 99.99 },
        { "productId": "DEF-5678", "quantity": 1, "price": 49.99 }
      ],
      "total": 249.97,
      "status": "processing",
      "createdAt": "2026-01-16T10:30:00Z"
    }, null, 2),
  },
  {
    id: 'address',
    name: 'Address',
    description: 'Schema for postal address',
    icon: 'fa-map-marker-alt',
    schema: JSON.stringify({
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "title": "Postal Address",
      "type": "object",
      "properties": {
        "street": {
          "type": "string",
          "minLength": 1
        },
        "city": {
          "type": "string",
          "minLength": 1
        },
        "state": {
          "type": "string"
        },
        "postalCode": {
          "type": "string",
          "pattern": "^[0-9]{5}(-[0-9]{4})?$"
        },
        "country": {
          "type": "string",
          "minLength": 2,
          "maxLength": 2
        }
      },
      "required": ["street", "city", "country"]
    }, null, 2),
    sampleData: JSON.stringify({
      "street": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "US"
    }, null, 2),
  },
  {
    id: 'event',
    name: 'Event',
    description: 'Schema for calendar event',
    icon: 'fa-calendar',
    schema: JSON.stringify({
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "title": "Calendar Event",
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "minLength": 1,
          "maxLength": 200
        },
        "description": {
          "type": "string"
        },
        "start": {
          "type": "string",
          "format": "date-time"
        },
        "end": {
          "type": "string",
          "format": "date-time"
        },
        "location": {
          "type": "string"
        },
        "attendees": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "email": { "type": "string", "format": "email" },
              "name": { "type": "string" },
              "status": {
                "type": "string",
                "enum": ["pending", "accepted", "declined"]
              }
            },
            "required": ["email"]
          }
        },
        "recurring": {
          "type": "boolean"
        }
      },
      "required": ["title", "start", "end"]
    }, null, 2),
    sampleData: JSON.stringify({
      "title": "Team Meeting",
      "description": "Weekly team sync",
      "start": "2026-01-16T10:00:00Z",
      "end": "2026-01-16T11:00:00Z",
      "location": "Conference Room A",
      "attendees": [
        { "email": "alice@example.com", "name": "Alice", "status": "accepted" },
        { "email": "bob@example.com", "name": "Bob", "status": "pending" }
      ],
      "recurring": true
    }, null, 2),
  },
];

/**
 * Get schema by ID
 */
export function getSchemaById(id: string): ExampleSchema | undefined {
  return EXAMPLE_SCHEMAS.find(s => s.id === id);
}
