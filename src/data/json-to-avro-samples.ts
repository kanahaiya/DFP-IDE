/**
 * JSON to Avro Sample Templates
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

export const jsonToAvroSamples: SampleTemplate[] = [
  {
    id: 'kafka-event',
    name: 'Kafka Event',
    description: 'Typical Kafka event message',
    icon: 'fa-stream',
    iconColor: 'var(--primary)',
    content: `{
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "event_type": "user.created",
  "timestamp": "2026-01-17T10:30:00Z",
  "source": "user-service",
  "payload": {
    "user_id": 12345,
    "email": "newuser@example.com",
    "plan": "premium"
  },
  "metadata": {
    "correlation_id": "req-abc-123",
    "version": 1
  }
}`,
  },
  {
    id: 'user-profile',
    name: 'User Profile',
    description: 'User profile with dates',
    icon: 'fa-user',
    iconColor: 'var(--success)',
    content: `{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "john_doe",
  "email": "john@example.com",
  "is_verified": true,
  "birth_date": "1996-05-15",
  "created_at": "2026-01-17T10:30:00Z",
  "profile": {
    "first_name": "John",
    "last_name": "Doe",
    "bio": "Software developer"
  },
  "tags": ["developer", "tech"]
}`,
  },
  {
    id: 'order-event',
    name: 'Order Event',
    description: 'E-commerce order event',
    icon: 'fa-shopping-cart',
    iconColor: 'var(--warning)',
    content: `{
  "order_id": "ORD-2026-001",
  "customer_id": 54321,
  "status": "completed",
  "total_amount": 199.99,
  "currency": "USD",
  "items": [
    {
      "product_id": "PROD-001",
      "name": "Widget Pro",
      "quantity": 2,
      "price": 49.99
    }
  ],
  "shipping_address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  },
  "created_at": "2026-01-17T10:30:00Z"
}`,
  },
  {
    id: 'sensor-data',
    name: 'IoT Sensor Data',
    description: 'IoT sensor reading event',
    icon: 'fa-thermometer-half',
    iconColor: 'var(--info)',
    content: `{
  "device_id": "sensor-001",
  "timestamp": "2026-01-17T10:30:00Z",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "readings": {
    "temperature": 22.5,
    "humidity": 45.2,
    "pressure": 1013.25
  },
  "battery_level": 85,
  "is_online": true
}`,
  },
  {
    id: 'log-event',
    name: 'Log Event',
    description: 'Application log entry',
    icon: 'fa-file-alt',
    iconColor: 'var(--error)',
    content: `{
  "log_id": "550e8400-e29b-41d4-a716-446655440000",
  "level": "ERROR",
  "message": "Failed to process request",
  "timestamp": "2026-01-17T10:30:00Z",
  "service": "api-gateway",
  "trace_id": "trace-abc-123",
  "span_id": "span-xyz-789",
  "context": {
    "user_id": 12345,
    "request_path": "/api/users",
    "http_method": "POST"
  },
  "stack_trace": null
}`,
  },
  {
    id: 'clickstream',
    name: 'Clickstream Event',
    description: 'Web analytics clickstream',
    icon: 'fa-mouse-pointer',
    iconColor: '#6366f1',
    content: `{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": null,
  "event_type": "page_view",
  "timestamp": "2026-01-17T10:30:00Z",
  "page_url": "https://example.com/products",
  "referrer_url": "https://google.com",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "geo": {
    "country": "US",
    "region": "NY",
    "city": "New York"
  },
  "device": {
    "type": "desktop",
    "browser": "Chrome",
    "os": "Windows"
  }
}`,
  },
];
