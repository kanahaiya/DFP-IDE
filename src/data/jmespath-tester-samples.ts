/**
 * JMESPath Tester Sample Templates
 * Pre-loaded JSON samples with example queries
 */

export interface SampleTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  content: string;
  defaultQuery?: string;
}

export const JMESPATH_SAMPLES: SampleTemplate[] = [
  {
    id: 'aws-ec2',
    name: 'AWS EC2 Instances',
    description: 'AWS CLI describe-instances output',
    icon: 'fab fa-aws',
    iconColor: '#FF9900',
    content: JSON.stringify({
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
    defaultQuery: 'Reservations[].Instances[].{ID: InstanceId, Type: InstanceType, State: State.Name}',
  },
  {
    id: 'aws-s3',
    name: 'AWS S3 Buckets',
    description: 'AWS CLI list-buckets output',
    icon: 'fab fa-aws',
    iconColor: '#FF9900',
    content: JSON.stringify({
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
    defaultQuery: 'sort(Buckets[].Name)',
  },
  {
    id: 'api-users',
    name: 'User API Response',
    description: 'REST API response with user data',
    icon: 'fas fa-users',
    iconColor: '#10B981',
    content: JSON.stringify({
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
    defaultQuery: 'data.users[?active].{name: name, role: role}',
  },
  {
    id: 'products',
    name: 'Product Catalog',
    description: 'E-commerce product list',
    icon: 'fas fa-shopping-cart',
    iconColor: '#F59E0B',
    content: JSON.stringify({
      products: [
        { id: 'P001', name: 'Laptop Pro', category: 'Electronics', price: 1299.99, stock: 50, rating: 4.5 },
        { id: 'P002', name: 'Wireless Mouse', category: 'Accessories', price: 49.99, stock: 200, rating: 4.2 },
        { id: 'P003', name: 'USB Hub', category: 'Accessories', price: 29.99, stock: 0, rating: 4.8 },
        { id: 'P004', name: 'Monitor 27"', category: 'Electronics', price: 399.99, stock: 30, rating: 4.6 },
        { id: 'P005', name: 'Keyboard', category: 'Accessories', price: 89.99, stock: 150, rating: 4.4 }
      ]
    }, null, 2),
    defaultQuery: 'sort_by(products[?stock > `0`], &price)[].{name: name, price: price}',
  },
  {
    id: 'logs',
    name: 'Server Logs',
    description: 'JSON formatted log entries',
    icon: 'fas fa-file-alt',
    iconColor: '#EF4444',
    content: JSON.stringify({
      logs: [
        { timestamp: '2024-01-15T10:30:00Z', level: 'INFO', service: 'api', message: 'Request received', duration: 45 },
        { timestamp: '2024-01-15T10:30:01Z', level: 'DEBUG', service: 'api', message: 'Processing data', duration: 120 },
        { timestamp: '2024-01-15T10:30:02Z', level: 'ERROR', service: 'api', message: 'Database timeout', duration: 5000 },
        { timestamp: '2024-01-15T10:30:05Z', level: 'INFO', service: 'worker', message: 'Job started', duration: 10 },
        { timestamp: '2024-01-15T10:30:10Z', level: 'WARN', service: 'worker', message: 'High memory', duration: 2000 },
        { timestamp: '2024-01-15T10:30:15Z', level: 'INFO', service: 'worker', message: 'Job completed', duration: 5050 }
      ]
    }, null, 2),
    defaultQuery: "logs[?level == `ERROR` || level == `WARN`]",
  },
  {
    id: 'nested',
    name: 'Nested Structure',
    description: 'Deeply nested organization data',
    icon: 'fas fa-sitemap',
    iconColor: '#8B5CF6',
    content: JSON.stringify({
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
    defaultQuery: 'organization.departments[].teams[].{team: name, size: headcount}',
  },
];
