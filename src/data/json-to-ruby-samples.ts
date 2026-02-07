export interface SampleTemplate {
  name: string;
  description: string;
  content: string;
  icon?: string;
  iconColor?: string;
}

export const JSON_TO_RUBY_SAMPLES: SampleTemplate[] = [
  {
    name: 'API Response',
    description: 'REST API response structure',
    icon: 'fa-cloud',
    content: JSON.stringify({
      success: true,
      data: {
        id: 12345,
        name: "Widget Pro",
        price: 29.99,
        available: true,
        tags: ["electronics", "gadgets"]
      },
      timestamp: "2024-01-15T10:30:00Z"
    }, null, 2),
  },
  {
    name: 'Rails Model',
    description: 'ActiveRecord-style attributes',
    icon: 'fa-train',
    content: JSON.stringify({
      id: 1,
      email: "user@example.com",
      first_name: "John",
      last_name: "Doe",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      admin: false
    }, null, 2),
  },
  {
    name: 'Configuration',
    description: 'Application config hash',
    icon: 'fa-cog',
    content: JSON.stringify({
      environment: "production",
      debug: false,
      database: {
        adapter: "postgresql",
        host: "localhost",
        port: 5432,
        database: "myapp_production"
      },
      redis: {
        url: "redis://localhost:6379/0"
      }
    }, null, 2),
  },
  {
    name: 'Nested Objects',
    description: 'Complex nested structure',
    icon: 'fa-sitemap',
    content: JSON.stringify({
      company: {
        name: "Tech Corp",
        employees: [
          { name: "Alice", role: "Engineer" },
          { name: "Bob", role: "Designer" }
        ]
      },
      active: true
    }, null, 2),
  },
  {
    name: 'Simple Array',
    description: 'Array of values',
    icon: 'fa-list',
    content: JSON.stringify([
      { id: 1, title: "First Item", completed: false },
      { id: 2, title: "Second Item", completed: true },
      { id: 3, title: "Third Item", completed: false }
    ], null, 2),
  },
];
