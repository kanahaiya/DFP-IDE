/**
 * JSON Validator Sample Templates
 * Sample JSON data for testing validation
 */

export interface SampleTemplate {
  name: string;
  description: string;
  content: string;
  icon?: string;
  iconColor?: string;
}

export const jsonValidatorSamples: SampleTemplate[] = [
  {
    name: 'Valid Simple JSON',
    description: 'A simple valid JSON object',
    icon: 'fa-check-circle',
    iconColor: 'text-green-500',
    content: `{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "isActive": true,
  "tags": ["developer", "designer"]
}`,
  },
  {
    name: 'Valid Nested JSON',
    description: 'A valid JSON with nested objects and arrays',
    icon: 'fa-layer-group',
    iconColor: 'text-blue-500',
    content: `{
  "user": {
    "id": 12345,
    "profile": {
      "name": "Jane Smith",
      "avatar": "https://example.com/avatar.jpg",
      "settings": {
        "theme": "dark",
        "notifications": true
      }
    }
  },
  "posts": [
    {
      "id": 1,
      "title": "First Post",
      "content": "Hello World!"
    },
    {
      "id": 2,
      "title": "Second Post",
      "content": "JSON is great!"
    }
  ]
}`,
  },
  {
    name: 'Trailing Comma Error',
    description: 'JSON with trailing comma (auto-fixable)',
    icon: 'fa-exclamation-triangle',
    iconColor: 'text-yellow-500',
    content: `{
  "name": "Test",
  "items": [
    "one",
    "two",
    "three",
  ],
}`,
  },
  {
    name: 'Single Quotes Error',
    description: 'JSON with single quotes (auto-fixable)',
    icon: 'fa-quote-right',
    iconColor: 'text-orange-500',
    content: `{
  'name': 'John',
  'city': 'New York',
  'active': true
}`,
  },
  {
    name: 'Comments Error',
    description: 'JSON with comments (auto-fixable)',
    icon: 'fa-comment-slash',
    iconColor: 'text-red-500',
    content: `{
  // This is a comment
  "name": "Test",
  /* This is a
     multi-line comment */
  "value": 42
}`,
  },
  {
    name: 'Unquoted Keys Error',
    description: 'JSON with unquoted keys (auto-fixable)',
    icon: 'fa-key',
    iconColor: 'text-purple-500',
    content: `{
  name: "John",
  age: 30,
  isActive: true,
  tags: ["a", "b"]
}`,
  },
  {
    name: 'Multiple Errors',
    description: 'JSON with multiple fixable errors',
    icon: 'fa-bug',
    iconColor: 'text-red-600',
    content: `{
  // User data
  name: 'John Doe',
  'email': "john@example.com",
  age: 30,
  tags: [
    'developer',
    'designer',
  ],
}`,
  },
  {
    name: 'API Response',
    description: 'Typical REST API response format',
    icon: 'fa-exchange-alt',
    iconColor: 'text-cyan-500',
    content: `{
  "status": "success",
  "code": 200,
  "message": "Data retrieved successfully",
  "data": {
    "users": [
      {
        "id": 1,
        "username": "admin",
        "role": "administrator"
      },
      {
        "id": 2,
        "username": "user1",
        "role": "member"
      }
    ],
    "pagination": {
      "page": 1,
      "perPage": 10,
      "total": 2,
      "totalPages": 1
    }
  },
  "timestamp": "2026-01-16T10:30:00Z"
}`,
  },
];

export const defaultSample = jsonValidatorSamples[0];
