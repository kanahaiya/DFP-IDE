/**
 * JSON to Flow Sample Templates
 * Example JSON structures for the visualizer
 */

export interface SampleTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  icon: string;
  iconColor: string;
}

export const jsonToFlowSamples: SampleTemplate[] = [
  {
    id: 'org-chart',
    name: 'Organization Chart',
    description: 'Company structure with departments',
    icon: 'fa-sitemap',
    iconColor: 'var(--primary)',
    content: `{
  "company": "Acme Corporation",
  "ceo": {
    "name": "John Smith",
    "title": "CEO"
  },
  "departments": [
    {
      "name": "Engineering",
      "head": "Jane Doe",
      "teams": [
        {
          "name": "Frontend",
          "members": 5
        },
        {
          "name": "Backend",
          "members": 8
        }
      ]
    },
    {
      "name": "Marketing",
      "head": "Bob Wilson",
      "teams": [
        {
          "name": "Digital",
          "members": 4
        },
        {
          "name": "Content",
          "members": 3
        }
      ]
    }
  ]
}`,
  },
  {
    id: 'api-response',
    name: 'API Response',
    description: 'Typical REST API response',
    icon: 'fa-server',
    iconColor: 'var(--success)',
    content: `{
  "status": "success",
  "code": 200,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "profile": {
          "avatar": "https://example.com/avatar.jpg",
          "bio": "Software developer"
        }
      },
      {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "profile": {
          "avatar": null,
          "bio": "Product manager"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "total": 50,
      "perPage": 10
    }
  },
  "meta": {
    "requestId": "abc-123",
    "timestamp": "2026-01-17T10:30:00Z"
  }
}`,
  },
  {
    id: 'config-file',
    name: 'Config File',
    description: 'Application configuration',
    icon: 'fa-cog',
    iconColor: 'var(--warning)',
    content: `{
  "app": {
    "name": "MyApp",
    "version": "2.0.0",
    "environment": "production"
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "mydb",
    "ssl": true,
    "pool": {
      "min": 2,
      "max": 10
    }
  },
  "cache": {
    "enabled": true,
    "provider": "redis",
    "ttl": 3600
  },
  "features": {
    "darkMode": true,
    "analytics": true,
    "notifications": false
  }
}`,
  },
  {
    id: 'nested-data',
    name: 'Nested Data',
    description: 'Deeply nested structure',
    icon: 'fa-layer-group',
    iconColor: 'var(--info)',
    content: `{
  "level1": {
    "level2": {
      "level3": {
        "level4": {
          "level5": {
            "data": "Deep nested value",
            "count": 42
          },
          "sibling": "Same level"
        }
      },
      "array": [
        {
          "nested": {
            "value": true
          }
        }
      ]
    }
  }
}`,
  },
  {
    id: 'product-catalog',
    name: 'Product Catalog',
    description: 'E-commerce product data',
    icon: 'fa-shopping-cart',
    iconColor: 'var(--error)',
    content: `{
  "catalog": {
    "categories": [
      {
        "id": "electronics",
        "name": "Electronics",
        "products": [
          {
            "id": "PROD-001",
            "name": "Wireless Headphones",
            "price": 199.99,
            "specs": {
              "battery": "40 hours",
              "noise_cancelling": true
            }
          }
        ]
      },
      {
        "id": "clothing",
        "name": "Clothing",
        "products": [
          {
            "id": "PROD-002",
            "name": "T-Shirt",
            "price": 29.99,
            "variants": ["S", "M", "L", "XL"]
          }
        ]
      }
    ],
    "featured": ["PROD-001"]
  }
}`,
  },
  {
    id: 'mixed-types',
    name: 'Mixed Types',
    description: 'Various JSON data types',
    icon: 'fa-random',
    iconColor: '#6366f1',
    content: `{
  "string": "Hello World",
  "number": 42,
  "float": 3.14159,
  "boolean_true": true,
  "boolean_false": false,
  "null_value": null,
  "array_of_strings": ["a", "b", "c"],
  "array_of_numbers": [1, 2, 3],
  "array_of_mixed": [1, "two", true, null],
  "nested_object": {
    "key1": "value1",
    "key2": {
      "nested_key": "nested_value"
    }
  },
  "empty_object": {},
  "empty_array": []
}`,
  },
];
