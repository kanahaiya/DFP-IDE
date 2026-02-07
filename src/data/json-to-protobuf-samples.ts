/**
 * JSON to Protobuf Sample Templates
 * Example JSON structures for the converter
 */

export interface SampleTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  icon: string;
  iconColor: string;
}

export const jsonToProtobufSamples: SampleTemplate[] = [
  {
    id: 'user-profile',
    name: 'User Profile',
    description: 'Basic user profile with nested address',
    icon: 'fa-user',
    iconColor: 'var(--primary)',
    content: `{
  "id": 12345,
  "username": "john_doe",
  "email": "john@example.com",
  "is_verified": true,
  "profile": {
    "first_name": "John",
    "last_name": "Doe",
    "bio": "Software developer",
    "avatar_url": "https://example.com/avatar.jpg"
  },
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip_code": "10001",
    "country": "USA"
  },
  "created_at": "2026-01-17T10:30:00Z"
}`,
  },
  {
    id: 'api-response',
    name: 'API Response',
    description: 'Typical REST API response with pagination',
    icon: 'fa-server',
    iconColor: 'var(--success)',
    content: `{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Item One",
        "price": 29.99,
        "in_stock": true
      }
    ],
    "total": 100,
    "page": 1,
    "per_page": 20
  },
  "meta": {
    "request_id": "abc-123-def",
    "timestamp": "2026-01-17T10:30:00Z"
  }
}`,
  },
  {
    id: 'order-data',
    name: 'E-commerce Order',
    description: 'Order with line items and shipping',
    icon: 'fa-shopping-cart',
    iconColor: 'var(--warning)',
    content: `{
  "order_id": "ORD-2026-001",
  "customer_id": 54321,
  "status": "processing",
  "items": [
    {
      "product_id": "PROD-001",
      "name": "Widget Pro",
      "quantity": 2,
      "unit_price": 49.99
    },
    {
      "product_id": "PROD-002",
      "name": "Gadget Plus",
      "quantity": 1,
      "unit_price": 99.99
    }
  ],
  "shipping": {
    "method": "express",
    "address": {
      "name": "John Doe",
      "street": "456 Oak Ave",
      "city": "Los Angeles",
      "zip": "90001"
    },
    "cost": 15.99
  },
  "total": 215.96,
  "created_at": "2026-01-17T10:30:00Z"
}`,
  },
  {
    id: 'config-file',
    name: 'Configuration',
    description: 'Application configuration settings',
    icon: 'fa-cog',
    iconColor: 'var(--info)',
    content: `{
  "app_name": "MyService",
  "version": "1.0.0",
  "debug": false,
  "server": {
    "host": "0.0.0.0",
    "port": 8080,
    "timeout_ms": 30000,
    "max_connections": 1000
  },
  "database": {
    "driver": "postgresql",
    "host": "localhost",
    "port": 5432,
    "name": "mydb",
    "pool_size": 10
  },
  "features": {
    "caching_enabled": true,
    "rate_limiting": true,
    "metrics_enabled": true
  },
  "allowed_origins": [
    "https://example.com",
    "https://app.example.com"
  ]
}`,
  },
  {
    id: 'event-message',
    name: 'Event Message',
    description: 'Kafka/messaging event structure',
    icon: 'fa-bolt',
    iconColor: 'var(--error)',
    content: `{
  "event_id": "evt_abc123",
  "event_type": "user.created",
  "version": 1,
  "timestamp": "2026-01-17T10:30:00Z",
  "source": "user-service",
  "correlation_id": "req_xyz789",
  "payload": {
    "user_id": 12345,
    "email": "newuser@example.com",
    "plan": "premium"
  },
  "metadata": {
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0",
    "region": "us-west-2"
  }
}`,
  },
  {
    id: 'grpc-request',
    name: 'gRPC Request',
    description: 'Sample gRPC service request',
    icon: 'fa-exchange-alt',
    iconColor: '#6366f1',
    content: `{
  "request_id": "grpc-001",
  "method": "GetUserDetails",
  "params": {
    "user_id": 12345,
    "include_profile": true,
    "include_orders": true,
    "max_orders": 10
  },
  "auth": {
    "token": "Bearer eyJhbGciOiJIUzI1NiIs...",
    "client_id": "mobile-app-ios"
  },
  "options": {
    "timeout_ms": 5000,
    "retry_count": 3
  }
}`,
  },
];
