/**
 * JSON Visualizer - Sample Templates
 */

export interface SampleTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  data: object;
}

export const JSON_VISUALIZER_SAMPLES: SampleTemplate[] = [
  {
    id: 'api-response',
    name: 'API Response',
    description: 'Typical REST API response with nested data',
    icon: 'fas fa-code',
    iconColor: '#4F46E5',
    data: {
      success: true,
      data: {
        users: [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "admin",
            profile: {
              avatar: "https://example.com/avatar/1.jpg",
              bio: "Software developer",
              social: {
                twitter: "@johndoe",
                github: "johndoe"
              }
            },
            permissions: ["read", "write", "delete"]
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            role: "user",
            profile: {
              avatar: "https://example.com/avatar/2.jpg",
              bio: "Product designer",
              social: {
                twitter: "@janesmith",
                dribbble: "janesmith"
              }
            },
            permissions: ["read"]
          }
        ],
        pagination: {
          total: 100,
          page: 1,
          perPage: 10,
          totalPages: 10
        }
      },
      meta: {
        timestamp: "2024-01-15T10:30:00Z",
        version: "v2",
        requestId: "abc123"
      }
    }
  },
  {
    id: 'package-json',
    name: 'Package.json',
    description: 'Node.js package configuration',
    icon: 'fab fa-npm',
    iconColor: '#CB3837',
    data: {
      name: "my-awesome-app",
      version: "2.1.0",
      description: "An awesome application built with modern tools",
      main: "dist/index.js",
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        test: "jest",
        lint: "eslint src/"
      },
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        next: "^14.0.0",
        typescript: "^5.0.0"
      },
      devDependencies: {
        "@types/react": "^18.2.0",
        "@types/node": "^20.0.0",
        eslint: "^8.0.0",
        jest: "^29.0.0"
      },
      engines: {
        node: ">=18.0.0"
      },
      repository: {
        type: "git",
        url: "https://github.com/user/repo"
      }
    }
  },
  {
    id: 'org-structure',
    name: 'Organization',
    description: 'Company organizational structure',
    icon: 'fas fa-sitemap',
    iconColor: '#059669',
    data: {
      company: "TechCorp Inc.",
      founded: 2010,
      departments: [
        {
          name: "Engineering",
          headcount: 50,
          budget: 5000000,
          teams: [
            {
              name: "Frontend",
              lead: "Alice Johnson",
              members: 12,
              technologies: ["React", "TypeScript", "Next.js"]
            },
            {
              name: "Backend",
              lead: "Bob Smith",
              members: 15,
              technologies: ["Node.js", "Python", "Go"]
            },
            {
              name: "DevOps",
              lead: "Carol White",
              members: 8,
              technologies: ["AWS", "Kubernetes", "Terraform"]
            }
          ]
        },
        {
          name: "Product",
          headcount: 20,
          budget: 2000000,
          teams: [
            {
              name: "Design",
              lead: "Dave Brown",
              members: 10,
              tools: ["Figma", "Sketch", "Adobe XD"]
            },
            {
              name: "Research",
              lead: "Eve Davis",
              members: 5,
              focus: ["User interviews", "Analytics", "A/B testing"]
            }
          ]
        }
      ],
      locations: ["San Francisco", "New York", "London", "Singapore"]
    }
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Order',
    description: 'Online store order data',
    icon: 'fas fa-shopping-cart',
    iconColor: '#D97706',
    data: {
      orderId: "ORD-2024-001234",
      status: "processing",
      customer: {
        id: "CUS-5678",
        name: "Sarah Wilson",
        email: "sarah@email.com",
        tier: "gold",
        addresses: {
          shipping: {
            street: "123 Main St",
            city: "Seattle",
            state: "WA",
            zip: "98101",
            country: "USA"
          },
          billing: {
            street: "456 Oak Ave",
            city: "Seattle",
            state: "WA",
            zip: "98102",
            country: "USA"
          }
        }
      },
      items: [
        {
          sku: "LAPTOP-001",
          name: "Pro Laptop 15\"",
          quantity: 1,
          price: 1299.99,
          category: "Electronics"
        },
        {
          sku: "MOUSE-003",
          name: "Wireless Mouse",
          quantity: 2,
          price: 49.99,
          category: "Accessories"
        },
        {
          sku: "KEYBOARD-007",
          name: "Mechanical Keyboard",
          quantity: 1,
          price: 149.99,
          category: "Accessories"
        }
      ],
      totals: {
        subtotal: 1549.96,
        tax: 139.50,
        shipping: 0,
        discount: 77.50,
        total: 1611.96
      },
      payment: {
        method: "credit_card",
        last4: "4242",
        brand: "visa"
      }
    }
  },
  {
    id: 'config-file',
    name: 'App Config',
    description: 'Application configuration file',
    icon: 'fas fa-cog',
    iconColor: '#7C3AED',
    data: {
      app: {
        name: "MyApp",
        environment: "production",
        debug: false,
        version: "3.2.1"
      },
      server: {
        host: "0.0.0.0",
        port: 3000,
        ssl: {
          enabled: true,
          certificate: "/etc/ssl/cert.pem",
          key: "/etc/ssl/key.pem"
        },
        cors: {
          enabled: true,
          origins: ["https://myapp.com", "https://api.myapp.com"],
          methods: ["GET", "POST", "PUT", "DELETE"]
        }
      },
      database: {
        type: "postgres",
        host: "db.myapp.com",
        port: 5432,
        name: "myapp_prod",
        pool: {
          min: 5,
          max: 20,
          idleTimeout: 30000
        }
      },
      cache: {
        type: "redis",
        host: "cache.myapp.com",
        port: 6379,
        ttl: 3600
      },
      logging: {
        level: "info",
        format: "json",
        outputs: ["stdout", "file"],
        file: {
          path: "/var/log/myapp/app.log",
          maxSize: "100MB",
          maxFiles: 10
        }
      },
      features: {
        newDashboard: true,
        betaFeatures: false,
        analytics: true
      }
    }
  },
  {
    id: 'nested-deep',
    name: 'Deep Nesting',
    description: 'Deeply nested structure for testing',
    icon: 'fas fa-layer-group',
    iconColor: '#DC2626',
    data: {
      level1: {
        name: "Level 1",
        level2: {
          name: "Level 2",
          level3: {
            name: "Level 3",
            level4: {
              name: "Level 4",
              level5: {
                name: "Level 5",
                level6: {
                  name: "Level 6",
                  value: "Deep value",
                  metadata: {
                    created: "2024-01-01",
                    modified: "2024-01-15"
                  }
                }
              }
            }
          }
        }
      },
      array_deep: [
        [
          [
            ["deeply", "nested", "array"],
            ["another", "nested", "array"]
          ]
        ]
      ],
      mixed: {
        arrays: [1, 2, [3, 4, [5, 6]]],
        objects: {
          a: { b: { c: { d: "value" } } }
        }
      }
    }
  }
];

export const jsonVisualizerSamples = JSON_VISUALIZER_SAMPLES;
