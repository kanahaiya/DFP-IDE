/**
 * JMESPath Examples
 * Pre-loaded JSON examples and sample queries for learning
 */

import type { JMESPathExample } from './types';

export const JMESPATH_EXAMPLES: JMESPathExample[] = [
  {
    id: 'aws-ec2',
    name: 'AWS EC2 Instances',
    description: 'AWS CLI ec2 describe-instances output',
    icon: 'fab fa-aws',
    category: 'AWS CLI',
    json: JSON.stringify({
      Reservations: [
        {
          ReservationId: 'r-12345678',
          Instances: [
            {
              InstanceId: 'i-abc12345',
              InstanceType: 't2.micro',
              State: { Name: 'running', Code: 16 },
              Tags: [
                { Key: 'Name', Value: 'WebServer1' },
                { Key: 'Environment', Value: 'production' }
              ],
              LaunchTime: '2024-01-15T10:30:00Z'
            },
            {
              InstanceId: 'i-def67890',
              InstanceType: 't2.small',
              State: { Name: 'stopped', Code: 80 },
              Tags: [
                { Key: 'Name', Value: 'TestServer' },
                { Key: 'Environment', Value: 'development' }
              ],
              LaunchTime: '2024-01-10T08:00:00Z'
            }
          ]
        },
        {
          ReservationId: 'r-87654321',
          Instances: [
            {
              InstanceId: 'i-ghi11111',
              InstanceType: 't3.medium',
              State: { Name: 'running', Code: 16 },
              Tags: [
                { Key: 'Name', Value: 'Database' },
                { Key: 'Environment', Value: 'production' }
              ],
              LaunchTime: '2024-01-12T14:20:00Z'
            }
          ]
        }
      ]
    }, null, 2),
    queries: [
      { name: 'All instance IDs', query: 'Reservations[].Instances[].InstanceId', description: 'Get all EC2 instance IDs' },
      { name: 'Running instances', query: "Reservations[].Instances[?State.Name == 'running'][]", description: 'Filter running instances' },
      { name: 'Instance ID and type', query: 'Reservations[].Instances[].[InstanceId, InstanceType]', description: 'Get ID and type pairs' },
      { name: 'Production instances', query: "Reservations[].Instances[?contains(Tags[?Key == 'Environment'].Value, 'production')][]", description: 'Filter by tag value' },
      { name: 'Instance details', query: 'Reservations[].Instances[].{ID: InstanceId, Type: InstanceType, Status: State.Name}', description: 'Create custom object' },
      { name: 'Count instances', query: 'length(Reservations[].Instances[])', description: 'Total instance count' },
    ],
  },
  {
    id: 'aws-s3',
    name: 'AWS S3 Buckets',
    description: 'AWS CLI s3api list-buckets output',
    icon: 'fab fa-aws',
    category: 'AWS CLI',
    json: JSON.stringify({
      Buckets: [
        { Name: 'my-app-assets', CreationDate: '2023-06-15T10:00:00Z' },
        { Name: 'my-app-backups', CreationDate: '2023-07-20T14:30:00Z' },
        { Name: 'my-logs-bucket', CreationDate: '2023-08-01T09:00:00Z' },
        { Name: 'shared-data', CreationDate: '2024-01-05T16:45:00Z' }
      ],
      Owner: {
        ID: '123456789012',
        DisplayName: 'myaccount'
      }
    }, null, 2),
    queries: [
      { name: 'All bucket names', query: 'Buckets[].Name', description: 'List all bucket names' },
      { name: 'Sorted by name', query: 'sort(Buckets[].Name)', description: 'Sort bucket names alphabetically' },
      { name: 'Buckets with "app"', query: "Buckets[?contains(Name, 'app')]", description: 'Filter by name pattern' },
      { name: 'First 2 buckets', query: 'Buckets[:2].Name', description: 'Slice first two buckets' },
      { name: 'Bucket count', query: 'length(Buckets)', description: 'Count total buckets' },
      { name: 'Owner info', query: 'Owner.DisplayName', description: 'Get owner display name' },
    ],
  },
  {
    id: 'api-users',
    name: 'User API Response',
    description: 'REST API response with user data',
    icon: 'fas fa-users',
    category: 'API Response',
    json: JSON.stringify({
      data: {
        users: [
          { id: 1, name: 'Alice', email: 'alice@example.com', age: 28, role: 'admin', active: true },
          { id: 2, name: 'Bob', email: 'bob@example.com', age: 35, role: 'user', active: true },
          { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 42, role: 'user', active: false },
          { id: 4, name: 'Diana', email: 'diana@example.com', age: 31, role: 'moderator', active: true }
        ],
        pagination: {
          page: 1,
          perPage: 10,
          total: 4
        }
      },
      meta: {
        apiVersion: '2.0',
        timestamp: '2024-01-15T12:00:00Z'
      }
    }, null, 2),
    queries: [
      { name: 'All users', query: 'data.users', description: 'Get all user objects' },
      { name: 'User names', query: 'data.users[].name', description: 'Extract all names' },
      { name: 'Active users', query: 'data.users[?active]', description: 'Filter active users' },
      { name: 'Users over 30', query: 'data.users[?age > `30`]', description: 'Filter by age' },
      { name: 'Admin users', query: "data.users[?role == 'admin']", description: 'Filter by role' },
      { name: 'Sorted by age', query: 'sort_by(data.users, &age)[].name', description: 'Sort users by age' },
      { name: 'Name and email', query: 'data.users[].{name: name, email: email}', description: 'Select specific fields' },
      { name: 'Average age', query: 'avg(data.users[].age)', description: 'Calculate average age' },
    ],
  },
  {
    id: 'products',
    name: 'Product Catalog',
    description: 'E-commerce product list',
    icon: 'fas fa-shopping-cart',
    category: 'E-commerce',
    json: JSON.stringify({
      products: [
        { id: 'P001', name: 'Laptop Pro', category: 'Electronics', price: 1299.99, stock: 50, rating: 4.5, tags: ['laptop', 'computer'] },
        { id: 'P002', name: 'Wireless Mouse', category: 'Accessories', price: 49.99, stock: 200, rating: 4.2, tags: ['mouse', 'wireless'] },
        { id: 'P003', name: 'USB Hub', category: 'Accessories', price: 29.99, stock: 0, rating: 4.8, tags: ['usb', 'hub'] },
        { id: 'P004', name: 'Monitor 27"', category: 'Electronics', price: 399.99, stock: 30, rating: 4.6, tags: ['monitor', 'display'] },
        { id: 'P005', name: 'Keyboard', category: 'Accessories', price: 89.99, stock: 150, rating: 4.4, tags: ['keyboard', 'mechanical'] }
      ]
    }, null, 2),
    queries: [
      { name: 'All products', query: 'products', description: 'Get all products' },
      { name: 'Product names', query: 'products[].name', description: 'List all product names' },
      { name: 'In stock', query: 'products[?stock > `0`]', description: 'Products with stock' },
      { name: 'Electronics', query: "products[?category == 'Electronics']", description: 'Filter by category' },
      { name: 'Under $100', query: 'products[?price < `100`].name', description: 'Budget products' },
      { name: 'Sorted by price', query: 'sort_by(products, &price)[].{name: name, price: price}', description: 'Sort by price ascending' },
      { name: 'Top rated', query: 'max_by(products, &rating)', description: 'Highest rated product' },
      { name: 'Total value', query: 'sum(products[].price)', description: 'Sum of all prices' },
    ],
  },
  {
    id: 'nested',
    name: 'Nested Structure',
    description: 'Deeply nested organization data',
    icon: 'fas fa-sitemap',
    category: 'Advanced',
    json: JSON.stringify({
      organization: {
        name: 'Tech Corp',
        departments: [
          {
            name: 'Engineering',
            budget: 500000,
            teams: [
              { name: 'Frontend', headcount: 8, technologies: ['React', 'TypeScript'] },
              { name: 'Backend', headcount: 10, technologies: ['Node.js', 'Python', 'Go'] }
            ]
          },
          {
            name: 'Design',
            budget: 200000,
            teams: [
              { name: 'UX', headcount: 4, technologies: ['Figma', 'Sketch'] },
              { name: 'Graphic', headcount: 3, technologies: ['Photoshop', 'Illustrator'] }
            ]
          }
        ]
      }
    }, null, 2),
    queries: [
      { name: 'Department names', query: 'organization.departments[].name', description: 'List all departments' },
      { name: 'All teams', query: 'organization.departments[].teams[].name', description: 'List all team names' },
      { name: 'Flatten teams', query: 'organization.departments[].teams[]', description: 'Flatten teams array' },
      { name: 'Total budget', query: 'sum(organization.departments[].budget)', description: 'Sum all budgets' },
      { name: 'All technologies', query: 'organization.departments[].teams[].technologies[]', description: 'List all technologies' },
      { name: 'Large departments', query: 'organization.departments[?budget > `300000`].name', description: 'Filter by budget' },
      { name: 'Team headcount', query: 'organization.departments[].teams[].{team: name, size: headcount}', description: 'Team sizes' },
    ],
  },
  {
    id: 'logs',
    name: 'Log Entries',
    description: 'JSON formatted log data',
    icon: 'fas fa-file-alt',
    category: 'DevOps',
    json: JSON.stringify({
      logs: [
        { timestamp: '2024-01-15T10:30:00Z', level: 'INFO', service: 'api', message: 'Request received', duration: 45 },
        { timestamp: '2024-01-15T10:30:01Z', level: 'DEBUG', service: 'api', message: 'Processing data', duration: 120 },
        { timestamp: '2024-01-15T10:30:02Z', level: 'ERROR', service: 'api', message: 'Database timeout', duration: 5000 },
        { timestamp: '2024-01-15T10:30:05Z', level: 'INFO', service: 'worker', message: 'Job started', duration: 10 },
        { timestamp: '2024-01-15T10:30:10Z', level: 'WARN', service: 'worker', message: 'High memory', duration: 2000 },
        { timestamp: '2024-01-15T10:30:15Z', level: 'INFO', service: 'worker', message: 'Job completed', duration: 5050 }
      ]
    }, null, 2),
    queries: [
      { name: 'All logs', query: 'logs', description: 'Get all log entries' },
      { name: 'Error logs', query: "logs[?level == 'ERROR']", description: 'Filter error level' },
      { name: 'API service', query: "logs[?service == 'api']", description: 'Filter by service' },
      { name: 'Slow requests', query: 'logs[?duration > `1000`]', description: 'Filter slow operations' },
      { name: 'Messages only', query: 'logs[].message', description: 'Extract messages' },
      { name: 'Avg duration', query: 'avg(logs[].duration)', description: 'Average duration' },
      { name: 'Max duration', query: 'max(logs[].duration)', description: 'Slowest operation' },
      { name: 'Sorted by time', query: 'sort_by(logs, &timestamp)', description: 'Sort chronologically' },
    ],
  },
];

/**
 * Get example by ID
 */
export function getJMESPathExample(id: string): JMESPathExample | undefined {
  return JMESPATH_EXAMPLES.find(e => e.id === id);
}

/**
 * Get examples by category
 */
export function getJMESPathExamplesByCategory(category: string): JMESPathExample[] {
  return JMESPATH_EXAMPLES.filter(e => e.category === category);
}

/**
 * Get all categories
 */
export function getJMESPathCategories(): string[] {
  const categories = new Set(JMESPATH_EXAMPLES.map(e => e.category));
  return Array.from(categories);
}
