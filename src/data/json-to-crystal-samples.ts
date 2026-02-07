/**
 * Sample JSON data for Crystal converter
 */

export const crystalSamples = [
  {
    name: 'Simple Object',
    json: `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "active": true
}`,
  },
  {
    name: 'User Profile',
    json: `{
  "user_id": "usr_12345",
  "first_name": "Alice",
  "last_name": "Smith",
  "age": 28,
  "balance": 1250.50,
  "verified": true,
  "created_at": "2024-01-15T10:30:00Z"
}`,
  },
  {
    name: 'Nested Object',
    json: `{
  "id": 1,
  "title": "Crystal Programming",
  "author": {
    "name": "Jane Doe",
    "email": "jane@example.com"
  },
  "tags": ["crystal", "programming", "tutorial"],
  "published": true
}`,
  },
  {
    name: 'API Response',
    json: `{
  "status": "success",
  "data": {
    "users": [
      {
        "id": 1,
        "name": "User One",
        "role": "admin"
      },
      {
        "id": 2,
        "name": "User Two",
        "role": "member"
      }
    ],
    "total": 2,
    "page": 1
  },
  "timestamp": "2024-01-15T12:00:00Z"
}`,
  },
];
