export interface SampleTemplate {
  name: string;
  description: string;
  content: string;
  icon?: string;
  iconColor?: string;
}

export const JSON_TO_HASKELL_SAMPLES: SampleTemplate[] = [
  {
    name: 'API Response',
    description: 'REST API response structure',
    icon: 'fa-cloud',
    content: JSON.stringify({
      id: 12345,
      title: "Sample Post",
      body: "This is the content of the post.",
      author: {
        id: 1,
        name: "John Doe",
        email: "john@example.com"
      },
      published: true,
      views: 1500
    }, null, 2),
  },
  {
    name: 'User Data',
    description: 'User profile with nested objects',
    icon: 'fa-user',
    content: JSON.stringify({
      userId: 1,
      username: "johndoe",
      email: "john@example.com",
      profile: {
        firstName: "John",
        lastName: "Doe",
        age: 30
      },
      isActive: true
    }, null, 2),
  },
  {
    name: 'Product List',
    description: 'Array of products',
    icon: 'fa-shopping-cart',
    content: JSON.stringify({
      products: [
        { id: 1, name: "Item A", price: 9.99 },
        { id: 2, name: "Item B", price: 19.99 },
        { id: 3, name: "Item C", price: 29.99 }
      ],
      totalCount: 3
    }, null, 2),
  },
  {
    name: 'Config Data',
    description: 'Configuration settings',
    icon: 'fa-cog',
    content: JSON.stringify({
      appName: "MyApp",
      version: "1.0.0",
      debug: false,
      database: {
        host: "localhost",
        port: 5432,
        name: "myapp_db"
      }
    }, null, 2),
  },
  {
    name: 'Simple Record',
    description: 'Basic data structure',
    icon: 'fa-cube',
    content: JSON.stringify({
      name: "Example",
      count: 42,
      enabled: true,
      ratio: 0.75
    }, null, 2),
  },
];
