export interface SampleTemplate {
  name: string;
  description: string;
  content: string;
  icon?: string;
  iconColor?: string;
}

export const JSON_TO_ELM_SAMPLES: SampleTemplate[] = [
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
    name: 'User Profile',
    description: 'User data with nested objects',
    icon: 'fa-user',
    content: JSON.stringify({
      id: 1,
      username: "johndoe",
      email: "john@example.com",
      profile: {
        firstName: "John",
        lastName: "Doe",
        age: 30
      },
      active: true
    }, null, 2),
  },
  {
    name: 'List of Items',
    description: 'Array of objects',
    icon: 'fa-list',
    content: JSON.stringify({
      items: [
        { id: 1, name: "Item 1", price: 9.99 },
        { id: 2, name: "Item 2", price: 19.99 },
        { id: 3, name: "Item 3", price: 29.99 }
      ],
      total: 59.97
    }, null, 2),
  },
  {
    name: 'Simple Object',
    description: 'Basic key-value structure',
    icon: 'fa-cube',
    content: JSON.stringify({
      name: "Example",
      count: 42,
      enabled: true,
      ratio: 0.75
    }, null, 2),
  },
  {
    name: 'Flags Data',
    description: 'Elm flags example',
    icon: 'fa-flag',
    content: JSON.stringify({
      apiUrl: "https://api.example.com",
      environment: "production",
      features: {
        darkMode: true,
        notifications: false
      },
      userId: 12345
    }, null, 2),
  },
];
