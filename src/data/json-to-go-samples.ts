/**
 * Sample templates for JSON to Go converter
 */

export interface SampleTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
}

export const jsonToGoSamples: SampleTemplate[] = [
  {
    id: 'user-profile',
    name: 'User Profile',
    description: 'Simple user object with nested profile',
    category: 'Common',
    content: JSON.stringify({
      "user_id": 123,
      "username": "john_doe",
      "email": "john@example.com",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z",
      "profile": {
        "first_name": "John",
        "last_name": "Doe",
        "age": 30,
        "avatar_url": "https://example.com/avatar.jpg"
      },
      "roles": ["admin", "user"]
    }, null, 2)
  },
  {
    id: 'api-response',
    name: 'API Response',
    description: 'Typical REST API response with pagination',
    category: 'API',
    content: JSON.stringify({
      "status": "success",
      "code": 200,
      "message": "Data retrieved successfully",
      "data": {
        "items": [
          {
            "id": 1,
            "name": "Item One",
            "price": 29.99,
            "in_stock": true
          },
          {
            "id": 2,
            "name": "Item Two",
            "price": 49.99,
            "in_stock": false
          }
        ],
        "pagination": {
          "page": 1,
          "per_page": 10,
          "total": 100,
          "total_pages": 10
        }
      },
      "timestamp": "2024-01-15T10:30:00Z"
    }, null, 2)
  },
  {
    id: 'ecommerce-product',
    name: 'E-commerce Product',
    description: 'Product with variants, categories, and reviews',
    category: 'E-commerce',
    content: JSON.stringify({
      "product_id": "PRD-12345",
      "sku": "WIDGET-BLK-M",
      "name": "Premium Widget",
      "description": "High-quality widget for all your needs",
      "price": 99.99,
      "currency": "USD",
      "discount_percent": 10,
      "in_stock": true,
      "stock_quantity": 150,
      "category": {
        "id": 5,
        "name": "Electronics",
        "slug": "electronics",
        "parent_id": 1
      },
      "tags": ["featured", "bestseller", "new"],
      "images": [
        {
          "url": "https://example.com/img1.jpg",
          "alt": "Front view",
          "is_primary": true
        },
        {
          "url": "https://example.com/img2.jpg",
          "alt": "Side view",
          "is_primary": false
        }
      ],
      "variants": [
        {
          "id": 1,
          "color": "Black",
          "size": "M",
          "price_modifier": 0
        },
        {
          "id": 2,
          "color": "White",
          "size": "L",
          "price_modifier": 5.00
        }
      ],
      "rating": {
        "average": 4.5,
        "count": 128
      }
    }, null, 2)
  },
  {
    id: 'config-file',
    name: 'Config File',
    description: 'Application configuration structure',
    category: 'Configuration',
    content: JSON.stringify({
      "app_name": "MyService",
      "version": "1.0.0",
      "environment": "production",
      "server": {
        "host": "0.0.0.0",
        "port": 8080,
        "timeout_seconds": 30,
        "max_connections": 1000
      },
      "database": {
        "driver": "postgres",
        "host": "localhost",
        "port": 5432,
        "name": "mydb",
        "username": "admin",
        "password": "secret",
        "ssl_mode": "require",
        "max_idle_conns": 10,
        "max_open_conns": 100
      },
      "redis": {
        "host": "localhost",
        "port": 6379,
        "password": "",
        "db": 0
      },
      "logging": {
        "level": "info",
        "format": "json",
        "output": "stdout"
      },
      "features": {
        "enable_cache": true,
        "enable_metrics": true,
        "enable_tracing": false
      }
    }, null, 2)
  },
  {
    id: 'webhook-payload',
    name: 'Webhook Payload',
    description: 'GitHub-style webhook event payload',
    category: 'Webhooks',
    content: JSON.stringify({
      "action": "opened",
      "number": 42,
      "pull_request": {
        "id": 123456789,
        "number": 42,
        "state": "open",
        "title": "Add new feature",
        "body": "This PR adds a new feature to the application",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T11:00:00Z",
        "head": {
          "ref": "feature-branch",
          "sha": "abc123def456"
        },
        "base": {
          "ref": "main",
          "sha": "789xyz000111"
        },
        "user": {
          "id": 12345,
          "login": "developer",
          "avatar_url": "https://example.com/avatar.jpg"
        },
        "mergeable": true,
        "draft": false
      },
      "repository": {
        "id": 98765,
        "name": "my-repo",
        "full_name": "org/my-repo",
        "private": false
      },
      "sender": {
        "id": 12345,
        "login": "developer"
      }
    }, null, 2)
  },
  {
    id: 'mongodb-document',
    name: 'MongoDB Document',
    description: 'Document with MongoDB-specific fields',
    category: 'Database',
    content: JSON.stringify({
      "_id": "507f1f77bcf86cd799439011",
      "collection": "orders",
      "customer_id": "CUST-001",
      "order_date": "2024-01-15T10:30:00Z",
      "status": "completed",
      "items": [
        {
          "product_id": "PROD-001",
          "name": "Widget",
          "quantity": 2,
          "unit_price": 29.99
        }
      ],
      "total": 59.98,
      "shipping_address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zip": "10001",
        "country": "US"
      },
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T12:00:00Z"
    }, null, 2)
  }
];

/**
 * Get sample by ID
 */
export function getJsonToGoSample(id: string): SampleTemplate | undefined {
  return jsonToGoSamples.find(s => s.id === id);
}

/**
 * Get samples by category
 */
export function getJsonToGoSamplesByCategory(category: string): SampleTemplate[] {
  return jsonToGoSamples.filter(s => s.category === category);
}
