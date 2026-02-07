/**
 * JSON to Parquet Sample Templates
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

export const jsonToParquetSamples: SampleTemplate[] = [
  {
    id: 'user-table',
    name: 'User Table',
    description: 'Typical user data table',
    icon: 'fa-users',
    iconColor: 'var(--primary)',
    content: `[
  {
    "user_id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "age": 30,
    "is_verified": true,
    "balance": 1500.75,
    "created_at": "2026-01-17T10:30:00Z"
  },
  {
    "user_id": 2,
    "username": "jane_smith",
    "email": "jane@example.com",
    "age": 28,
    "is_verified": true,
    "balance": 2500.00,
    "created_at": "2026-01-16T15:45:00Z"
  },
  {
    "user_id": 3,
    "username": "bob_wilson",
    "email": "bob@example.com",
    "age": 35,
    "is_verified": false,
    "balance": 500.25,
    "created_at": "2026-01-15T09:00:00Z"
  }
]`,
  },
  {
    id: 'event-logs',
    name: 'Event Logs',
    description: 'Application event log data',
    icon: 'fa-file-alt',
    iconColor: 'var(--success)',
    content: `[
  {
    "event_id": "evt_001",
    "event_type": "page_view",
    "timestamp": "2026-01-17T10:30:00Z",
    "user_id": 12345,
    "session_id": "sess_abc123",
    "page_url": "/products",
    "duration_ms": 1500,
    "metadata": {
      "browser": "Chrome",
      "os": "Windows"
    }
  },
  {
    "event_id": "evt_002",
    "event_type": "click",
    "timestamp": "2026-01-17T10:30:05Z",
    "user_id": 12345,
    "session_id": "sess_abc123",
    "page_url": "/products",
    "duration_ms": null,
    "metadata": {
      "element_id": "buy-button",
      "element_text": "Add to Cart"
    }
  }
]`,
  },
  {
    id: 'transactions',
    name: 'Financial Transactions',
    description: 'Payment transaction records',
    icon: 'fa-credit-card',
    iconColor: 'var(--warning)',
    content: `[
  {
    "transaction_id": "txn_001",
    "account_id": 1001,
    "type": "debit",
    "amount": 150.00,
    "currency": "USD",
    "timestamp": "2026-01-17T10:30:00Z",
    "status": "completed",
    "merchant": {
      "id": "merch_001",
      "name": "Amazon",
      "category": "retail"
    }
  },
  {
    "transaction_id": "txn_002",
    "account_id": 1001,
    "type": "credit",
    "amount": 2500.00,
    "currency": "USD",
    "timestamp": "2026-01-16T09:00:00Z",
    "status": "completed",
    "merchant": null
  }
]`,
  },
  {
    id: 'sensor-readings',
    name: 'IoT Sensor Data',
    description: 'Time-series sensor readings',
    icon: 'fa-thermometer-half',
    iconColor: 'var(--info)',
    content: `[
  {
    "device_id": "sensor_001",
    "timestamp": "2026-01-17T10:30:00Z",
    "readings": {
      "temperature": 22.5,
      "humidity": 45.2,
      "pressure": 1013.25
    },
    "location": {
      "lat": 40.7128,
      "lng": -74.0060
    },
    "battery_level": 85,
    "is_online": true
  },
  {
    "device_id": "sensor_002",
    "timestamp": "2026-01-17T10:30:00Z",
    "readings": {
      "temperature": 19.8,
      "humidity": 52.1,
      "pressure": 1015.10
    },
    "location": {
      "lat": 34.0522,
      "lng": -118.2437
    },
    "battery_level": 72,
    "is_online": true
  }
]`,
  },
  {
    id: 'product-catalog',
    name: 'Product Catalog',
    description: 'E-commerce product data',
    icon: 'fa-shopping-cart',
    iconColor: 'var(--error)',
    content: `[
  {
    "product_id": "PROD_001",
    "name": "Wireless Headphones",
    "description": "High-quality wireless headphones with noise cancellation",
    "category": "Electronics",
    "price": 199.99,
    "currency": "USD",
    "in_stock": true,
    "stock_count": 150,
    "tags": ["audio", "wireless", "premium"],
    "attributes": {
      "brand": "AudioPro",
      "color": "Black",
      "weight_grams": 250
    }
  },
  {
    "product_id": "PROD_002",
    "name": "USB-C Cable",
    "description": "Fast charging USB-C cable, 2 meters",
    "category": "Accessories",
    "price": 14.99,
    "currency": "USD",
    "in_stock": true,
    "stock_count": 500,
    "tags": ["cable", "usb-c", "charging"],
    "attributes": {
      "brand": "TechGear",
      "color": "White",
      "weight_grams": 45
    }
  }
]`,
  },
  {
    id: 'web-analytics',
    name: 'Web Analytics',
    description: 'Website analytics data',
    icon: 'fa-chart-line',
    iconColor: '#6366f1',
    content: `[
  {
    "date": "2026-01-17",
    "page_path": "/home",
    "visitors": 15000,
    "page_views": 25000,
    "bounce_rate": 0.35,
    "avg_time_seconds": 120,
    "conversions": 450,
    "revenue": 12500.00,
    "traffic_sources": {
      "organic": 8000,
      "paid": 3000,
      "direct": 2500,
      "referral": 1500
    }
  },
  {
    "date": "2026-01-16",
    "page_path": "/home",
    "visitors": 14500,
    "page_views": 24000,
    "bounce_rate": 0.38,
    "avg_time_seconds": 115,
    "conversions": 420,
    "revenue": 11800.00,
    "traffic_sources": {
      "organic": 7500,
      "paid": 3200,
      "direct": 2300,
      "referral": 1500
    }
  }
]`,
  },
];
