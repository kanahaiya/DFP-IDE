/**
 * Sample JSON templates for JSON Minifier tool
 */

export interface SampleTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  content: string;
}

export const JSON_MINIFIER_SAMPLES: SampleTemplate[] = [
  {
    id: 'api-response',
    name: 'API Response',
    description: 'Typical REST API response with user data',
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
        "role": "admin",
        "active": true,
        "profile": {
          "avatar": "https://example.com/avatars/john.png",
          "bio": "Software developer with 10 years of experience",
          "location": "San Francisco, CA"
        }
      },
      {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "user",
        "active": true,
        "profile": {
          "avatar": "https://example.com/avatars/jane.png",
          "bio": "UX designer passionate about accessibility",
          "location": "New York, NY"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "perPage": 10,
      "total": 2,
      "totalPages": 1
    }
  },
  "meta": {
    "timestamp": "2026-01-16T12:00:00Z",
    "requestId": "abc123",
    "version": "v1"
  }
}`,
  },
  {
    id: 'config-file',
    name: 'Config File',
    description: 'Application configuration with various settings',
    icon: 'fas fa-cog',
    iconColor: '#2196F3',
    content: `{
  "app": {
    "name": "MyApp",
    "version": "2.5.0",
    "environment": "production"
  },
  "server": {
    "host": "0.0.0.0",
    "port": 3000,
    "cors": {
      "enabled": true,
      "origins": [
        "https://app.example.com",
        "https://admin.example.com"
      ]
    }
  },
  "database": {
    "type": "postgresql",
    "host": "localhost",
    "port": 5432,
    "name": "myapp_production",
    "pool": {
      "min": 2,
      "max": 10
    }
  },
  "cache": {
    "enabled": true,
    "ttl": 3600,
    "redis": {
      "host": "localhost",
      "port": 6379
    }
  },
  "logging": {
    "level": "info",
    "format": "json",
    "outputs": ["console", "file"]
  },
  "features": {
    "darkMode": true,
    "notifications": true,
    "analytics": false
  }
}`,
  },
  {
    id: 'nested-data',
    name: 'Deeply Nested',
    description: 'Complex nested structure with multiple levels',
    icon: 'fas fa-sitemap',
    iconColor: '#9C27B0',
    content: `{
  "company": {
    "name": "TechCorp",
    "departments": {
      "engineering": {
        "teams": {
          "frontend": {
            "lead": "Alice",
            "members": [
              {
                "name": "Bob",
                "skills": ["React", "TypeScript", "CSS"]
              },
              {
                "name": "Carol",
                "skills": ["Vue", "JavaScript", "SCSS"]
              }
            ],
            "projects": [
              {
                "name": "Dashboard",
                "status": "active",
                "tech": {
                  "framework": "React",
                  "state": "Redux",
                  "styling": "Tailwind"
                }
              }
            ]
          },
          "backend": {
            "lead": "Dave",
            "members": [
              {
                "name": "Eve",
                "skills": ["Node.js", "Python", "PostgreSQL"]
              }
            ],
            "projects": [
              {
                "name": "API Gateway",
                "status": "active",
                "tech": {
                  "runtime": "Node.js",
                  "framework": "Express",
                  "database": "PostgreSQL"
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
  {
    id: 'with-nulls',
    name: 'Data with Nulls',
    description: 'JSON with null values and empty fields for cleaning demo',
    icon: 'fas fa-filter',
    iconColor: '#FF9800',
    content: `{
  "user": {
    "id": 12345,
    "username": "developer",
    "email": "dev@example.com",
    "phone": null,
    "address": {
      "street": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "zip": "94102",
      "country": null,
      "apartment": ""
    },
    "preferences": {
      "newsletter": true,
      "notifications": {
        "email": true,
        "sms": null,
        "push": false
      },
      "theme": "dark",
      "language": ""
    },
    "tags": ["developer", "", "active"],
    "metadata": {},
    "notes": null,
    "history": []
  },
  "session": {
    "token": "abc123xyz",
    "expires": "2026-12-31T23:59:59Z",
    "data": null
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
        "id": "PROD-001",
        "name": "Wireless Headphones",
        "description": "Premium noise-canceling wireless headphones with 30-hour battery life",
        "price": {
          "amount": 299.99,
          "currency": "USD",
          "discounted": 249.99
        },
        "inventory": {
          "inStock": true,
          "quantity": 150
        },
        "variants": [
          {
            "sku": "WH-BLK",
            "color": "Black",
            "quantity": 75
          },
          {
            "sku": "WH-WHT",
            "color": "White",
            "quantity": 50
          },
          {
            "sku": "WH-SLV",
            "color": "Silver",
            "quantity": 25
          }
        ],
        "images": [
          "https://example.com/images/headphones-1.jpg",
          "https://example.com/images/headphones-2.jpg"
        ],
        "ratings": {
          "average": 4.7,
          "count": 1250
        }
      }
    ]
  }
}`,
  },
  {
    id: 'graphql-response',
    name: 'GraphQL Response',
    description: 'Typical GraphQL query response',
    icon: 'fas fa-project-diagram',
    iconColor: '#E535AB',
    content: `{
  "data": {
    "viewer": {
      "login": "developer",
      "name": "John Developer",
      "repositories": {
        "totalCount": 42,
        "nodes": [
          {
            "name": "awesome-project",
            "description": "An awesome open source project",
            "stargazerCount": 1234,
            "forkCount": 567,
            "primaryLanguage": {
              "name": "TypeScript",
              "color": "#2b7489"
            },
            "issues": {
              "totalCount": 23
            },
            "pullRequests": {
              "totalCount": 8
            }
          },
          {
            "name": "cool-library",
            "description": "A cool utility library",
            "stargazerCount": 890,
            "forkCount": 234,
            "primaryLanguage": {
              "name": "JavaScript",
              "color": "#f1e05a"
            },
            "issues": {
              "totalCount": 15
            },
            "pullRequests": {
              "totalCount": 3
            }
          }
        ]
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
  return JSON_MINIFIER_SAMPLES.find(sample => sample.id === id);
}

/**
 * Get all samples
 */
export function getAllSamples(): SampleTemplate[] {
  return JSON_MINIFIER_SAMPLES;
}
