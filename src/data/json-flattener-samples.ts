/**
 * JSON Flattener Sample Templates
 */

export interface FlattenerSample {
  id: string;
  name: string;
  description: string;
  content: string;
}

export const FLATTENER_SAMPLES: FlattenerSample[] = [
  {
    id: 'simple-nested',
    name: 'Simple Nested Object',
    description: 'Basic nested object with user data',
    content: JSON.stringify({
      user: {
        name: "John Doe",
        email: "john@example.com",
        age: 30,
        address: {
          street: "123 Main St",
          city: "New York",
          zipcode: "10001"
        }
      }
    }, null, 2),
  },
  {
    id: 'with-arrays',
    name: 'Object with Arrays',
    description: 'Nested object containing arrays',
    content: JSON.stringify({
      company: {
        name: "TechCorp",
        departments: ["Engineering", "Marketing", "Sales"],
        employees: [
          { id: 1, name: "Alice", skills: ["JavaScript", "React"] },
          { id: 2, name: "Bob", skills: ["Python", "Django"] }
        ]
      }
    }, null, 2),
  },
  {
    id: 'deep-nesting',
    name: 'Deep Nesting',
    description: '5+ levels of nested objects',
    content: JSON.stringify({
      level1: {
        level2: {
          level3: {
            level4: {
              level5: {
                value: "Deep nested value",
                count: 42
              }
            }
          }
        }
      }
    }, null, 2),
  },
  {
    id: 'api-response',
    name: 'API Response',
    description: 'Typical REST API response structure',
    content: JSON.stringify({
      status: "success",
      data: {
        users: [
          {
            id: 1,
            profile: {
              firstName: "Jane",
              lastName: "Smith",
              avatar: {
                url: "https://example.com/avatar.jpg",
                size: { width: 200, height: 200 }
              }
            },
            metadata: {
              createdAt: "2024-01-15T10:30:00Z",
              lastLogin: "2024-01-20T15:45:00Z"
            }
          }
        ],
        pagination: {
          page: 1,
          perPage: 10,
          total: 100
        }
      }
    }, null, 2),
  },
  {
    id: 'config-file',
    name: 'Configuration File',
    description: 'Application config with nested settings',
    content: JSON.stringify({
      app: {
        name: "MyApp",
        version: "1.0.0"
      },
      database: {
        host: "localhost",
        port: 5432,
        credentials: {
          username: "admin",
          password: "secret"
        },
        options: {
          ssl: true,
          poolSize: 10
        }
      },
      features: {
        darkMode: true,
        notifications: {
          email: true,
          push: false
        }
      }
    }, null, 2),
  },
  {
    id: 'mixed-types',
    name: 'Mixed Types',
    description: 'Object with various data types including null',
    content: JSON.stringify({
      string: "text",
      number: 123,
      float: 45.67,
      boolean: true,
      nullValue: null,
      nested: {
        array: [1, 2, 3],
        emptyArray: [],
        emptyObject: {},
        date: "2024-01-20"
      }
    }, null, 2),
  },
];
