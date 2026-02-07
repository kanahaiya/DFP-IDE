/**
 * Sample templates for JSON to Python converter
 */

export interface SampleTemplate {
  name: string;
  description: string;
  content: string;
}

export const jsonToPythonSamples: SampleTemplate[] = [
  {
    name: 'User Model',
    description: 'Simple user with profile data',
    content: JSON.stringify({
      "id": 123,
      "email": "john@example.com",
      "user_name": "john_doe",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z",
      "profile": {
        "first_name": "John",
        "last_name": "Doe",
        "avatar_url": "https://example.com/avatar.jpg"
      }
    }, null, 2)
  },
  {
    name: 'FastAPI Response',
    description: 'API response with pagination',
    content: JSON.stringify({
      "success": true,
      "message": "Data retrieved successfully",
      "data": {
        "items": [
          { "id": 1, "name": "Item 1", "price": 19.99 },
          { "id": 2, "name": "Item 2", "price": 29.99 }
        ],
        "total": 100,
        "page": 1,
        "page_size": 10
      }
    }, null, 2)
  },
  {
    name: 'Data Science Record',
    description: 'Dataset record with metrics',
    content: JSON.stringify({
      "experiment_id": "exp_001",
      "model_name": "neural_network_v2",
      "timestamp": "2024-01-15T10:30:00Z",
      "parameters": {
        "learning_rate": 0.001,
        "batch_size": 32,
        "epochs": 100
      },
      "metrics": {
        "accuracy": 0.95,
        "precision": 0.93,
        "recall": 0.92,
        "f1_score": 0.925
      },
      "tags": ["production", "optimized"]
    }, null, 2)
  },
  {
    name: 'Configuration',
    description: 'Application settings for Pydantic',
    content: JSON.stringify({
      "app_name": "MyFastAPIApp",
      "debug": false,
      "version": "1.0.0",
      "database": {
        "host": "localhost",
        "port": 5432,
        "name": "mydb",
        "pool_size": 10
      },
      "redis": {
        "url": "redis://localhost:6379",
        "ttl": 3600
      },
      "allowed_origins": ["http://localhost:3000", "https://myapp.com"]
    }, null, 2)
  },
  {
    name: 'Event Message',
    description: 'Message queue event payload',
    content: JSON.stringify({
      "event_id": "evt_abc123",
      "event_type": "order.created",
      "timestamp": "2024-01-15T10:30:00Z",
      "data": {
        "order_id": "ord_xyz789",
        "customer_email": "customer@example.com",
        "total_amount": 99.99,
        "currency": "USD"
      },
      "metadata": {
        "source": "web",
        "ip_address": "192.168.1.1"
      }
    }, null, 2)
  },
];
