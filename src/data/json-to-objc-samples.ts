/**
 * Sample JSON data for Objective-C converter
 */

export const objcSamples = [
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
    name: 'User Model',
    json: `{
  "userId": "usr_12345",
  "firstName": "Alice",
  "lastName": "Smith",
  "age": 28,
  "profileImageURL": "https://example.com/avatar.png",
  "isVerified": true
}`,
  },
  {
    name: 'Nested Data',
    json: `{
  "post": {
    "id": 1,
    "title": "Hello World",
    "content": "This is my first post",
    "author": {
      "name": "Jane",
      "username": "@jane"
    },
    "likes": 42,
    "comments": [
      {
        "id": 1,
        "text": "Great post!",
        "user": "Bob"
      }
    ]
  }
}`,
  },
  {
    name: 'API Response',
    json: `{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Item One",
        "price": 9.99
      },
      {
        "id": 2,
        "name": "Item Two",
        "price": 19.99
      }
    ],
    "totalCount": 2,
    "hasMore": false
  },
  "errorMessage": null
}`,
  },
];
