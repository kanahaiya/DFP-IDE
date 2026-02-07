/**
 * Sample JSON templates for JSON Stats tool
 */

export interface SampleTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  content: string;
}

export const JSON_STATS_SAMPLES: SampleTemplate[] = [
  {
    id: 'api-response',
    name: 'API Response',
    description: 'Typical REST API response with users array',
    icon: 'fas fa-server',
    iconColor: '#4CAF50',
    content: `{
  "status": "success",
  "data": {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "age": 32,
        "active": true,
        "roles": ["admin", "editor"],
        "profile": {
          "avatar": "https://example.com/avatars/john.png",
          "bio": "Software engineer",
          "joinedAt": "2023-01-15T10:30:00Z"
        }
      },
      {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "age": 28,
        "active": true,
        "roles": ["user"],
        "profile": {
          "avatar": "https://example.com/avatars/jane.png",
          "bio": "Product designer",
          "joinedAt": "2023-06-20T14:45:00Z"
        }
      },
      {
        "id": 3,
        "name": "Bob Wilson",
        "email": "bob@example.com",
        "age": 45,
        "active": false,
        "roles": ["user", "moderator"],
        "profile": {
          "avatar": null,
          "bio": "",
          "joinedAt": "2022-11-10T08:00:00Z"
        }
      }
    ],
    "total": 3,
    "page": 1
  },
  "meta": {
    "requestId": "abc123",
    "timestamp": "2026-01-16T12:00:00Z"
  }
}`,
  },
  {
    id: 'mixed-data',
    name: 'Mixed Data Types',
    description: 'JSON with various data types for type analysis',
    icon: 'fas fa-shapes',
    iconColor: '#9C27B0',
    content: `{
  "strings": {
    "name": "Example",
    "description": "A longer text description that spans multiple words",
    "empty": "",
    "url": "https://example.com/page",
    "email": "user@example.com",
    "date": "2026-01-16"
  },
  "numbers": {
    "integer": 42,
    "float": 3.14159,
    "negative": -100,
    "zero": 0,
    "large": 1000000
  },
  "booleans": {
    "active": true,
    "deleted": false,
    "enabled": true
  },
  "nulls": {
    "optional": null,
    "missing": null
  },
  "arrays": {
    "empty": [],
    "numbers": [1, 2, 3, 4, 5],
    "strings": ["red", "green", "blue"],
    "mixed": [1, "two", true, null]
  },
  "nested": {
    "level1": {
      "level2": {
        "level3": {
          "value": "deep"
        }
      }
    }
  }
}`,
  },
  {
    id: 'quality-issues',
    name: 'Quality Issues',
    description: 'JSON with common data quality problems',
    icon: 'fas fa-bug',
    iconColor: '#F44336',
    content: `{
  "users": [
    {
      "id": 1,
      "name": "Alice",
      "email": "alice@example.com",
      "phone": "+1234567890",
      "age": 25
    },
    {
      "id": 2,
      "name": "Bob",
      "email": null,
      "phone": "",
      "age": "thirty"
    },
    {
      "id": "three",
      "name": "",
      "email": "charlie@example.com",
      "phone": null,
      "age": 35
    }
  ],
  "metadata": {
    "source": null,
    "lastUpdated": "",
    "tags": [],
    "extra": {}
  },
  "config": {
    "debug": true,
    "DEBUG": false,
    "settings": {
      "theme": null,
      "language": ""
    }
  }
}`,
  },
  {
    id: 'product-catalog',
    name: 'Product Catalog',
    description: 'E-commerce product data with variants',
    icon: 'fas fa-shopping-cart',
    iconColor: '#E91E63',
    content: `{
  "catalog": {
    "category": "Electronics",
    "products": [
      {
        "sku": "LAPTOP-001",
        "name": "Pro Laptop 15",
        "brand": "TechBrand",
        "price": 1299.99,
        "salePrice": 1199.99,
        "inStock": true,
        "quantity": 50,
        "specs": {
          "cpu": "Intel i7",
          "ram": "16GB",
          "storage": "512GB SSD",
          "display": "15.6 inch"
        },
        "tags": ["laptop", "portable", "powerful"],
        "ratings": {
          "average": 4.5,
          "count": 234
        }
      },
      {
        "sku": "PHONE-001",
        "name": "Smart Phone X",
        "brand": "PhoneCo",
        "price": 899.99,
        "salePrice": null,
        "inStock": true,
        "quantity": 100,
        "specs": {
          "cpu": "Snapdragon 888",
          "ram": "8GB",
          "storage": "256GB",
          "display": "6.5 inch OLED"
        },
        "tags": ["phone", "5G", "camera"],
        "ratings": {
          "average": 4.8,
          "count": 567
        }
      },
      {
        "sku": "HEADPHONES-001",
        "name": "Wireless Buds Pro",
        "brand": "AudioMax",
        "price": 199.99,
        "salePrice": 149.99,
        "inStock": false,
        "quantity": 0,
        "specs": {
          "type": "In-ear",
          "connectivity": "Bluetooth 5.0",
          "battery": "24 hours",
          "noiseCanceling": true
        },
        "tags": ["audio", "wireless", "premium"],
        "ratings": {
          "average": 4.2,
          "count": 89
        }
      }
    ]
  }
}`,
  },
  {
    id: 'flat-config',
    name: 'Flat Configuration',
    description: 'Simple flat key-value configuration',
    icon: 'fas fa-cog',
    iconColor: '#2196F3',
    content: `{
  "app_name": "MyApplication",
  "version": "2.1.0",
  "environment": "production",
  "debug_mode": false,
  "port": 3000,
  "host": "0.0.0.0",
  "db_host": "localhost",
  "db_port": 5432,
  "db_name": "myapp_production",
  "db_pool_min": 5,
  "db_pool_max": 20,
  "redis_host": "localhost",
  "redis_port": 6379,
  "cache_ttl": 3600,
  "session_secret": "supersecretkey123",
  "jwt_expiry": 86400,
  "log_level": "info",
  "cors_enabled": true,
  "rate_limit": 100,
  "max_upload_size": 10485760
}`,
  },
  {
    id: 'deeply-nested',
    name: 'Deeply Nested',
    description: 'Complex structure with deep nesting levels',
    icon: 'fas fa-layer-group',
    iconColor: '#FF9800',
    content: `{
  "company": {
    "name": "TechCorp Inc",
    "headquarters": {
      "address": {
        "street": {
          "number": 123,
          "name": "Innovation Drive",
          "type": "Avenue"
        },
        "city": {
          "name": "San Francisco",
          "state": {
            "code": "CA",
            "name": "California",
            "country": {
              "code": "US",
              "name": "United States",
              "continent": {
                "code": "NA",
                "name": "North America"
              }
            }
          }
        }
      }
    },
    "departments": {
      "engineering": {
        "teams": {
          "frontend": {
            "lead": {
              "name": "Alice",
              "level": {
                "grade": "L6",
                "title": "Senior Staff Engineer"
              }
            },
            "members": [
              {
                "name": "Bob",
                "specialization": {
                  "primary": {
                    "skill": "React",
                    "experience": {
                      "years": 5,
                      "projects": 12
                    }
                  }
                }
              }
            ]
          }
        }
      }
    }
  }
}`,
  },
];

/**
 * Get sample by ID
 */
export function getSampleById(id: string): SampleTemplate | undefined {
  return JSON_STATS_SAMPLES.find(sample => sample.id === id);
}

/**
 * Get all samples
 */
export function getAllSamples(): SampleTemplate[] {
  return JSON_STATS_SAMPLES;
}
