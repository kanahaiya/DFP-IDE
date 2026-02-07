/**
 * Sample templates for JSON to C# converter
 */

export interface SampleTemplate {
  name: string;
  description: string;
  content: string;
}

export const jsonToCSharpSamples: SampleTemplate[] = [
  {
    name: 'User Model',
    description: 'Simple user with profile data',
    content: JSON.stringify({
      "id": 123,
      "email": "john@example.com",
      "userName": "john_doe",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "avatarUrl": "https://example.com/avatar.jpg"
      }
    }, null, 2)
  },
  {
    name: 'API Response',
    description: 'REST API response with pagination',
    content: JSON.stringify({
      "success": true,
      "message": "Data retrieved successfully",
      "data": {
        "items": [
          { "id": 1, "name": "Item 1", "price": 19.99 },
          { "id": 2, "name": "Item 2", "price": 29.99 }
        ],
        "total": 100,
        "page": 1,
        "pageSize": 10
      }
    }, null, 2)
  },
  {
    name: 'Weather Data',
    description: 'Weather forecast response',
    content: JSON.stringify({
      "location": {
        "city": "New York",
        "country": "US",
        "latitude": 40.7128,
        "longitude": -74.0060
      },
      "current": {
        "temperature": 22.5,
        "humidity": 65,
        "windSpeed": 12.3,
        "condition": "Partly Cloudy"
      },
      "forecast": [
        { "date": "2024-01-16", "high": 24, "low": 18, "condition": "Sunny" },
        { "date": "2024-01-17", "high": 22, "low": 16, "condition": "Cloudy" }
      ]
    }, null, 2)
  },
  {
    name: 'Product Catalog',
    description: 'E-commerce product with variants',
    content: JSON.stringify({
      "productId": "PROD-001",
      "name": "Classic T-Shirt",
      "description": "Comfortable cotton t-shirt",
      "basePrice": 24.99,
      "category": "Clothing",
      "variants": [
        { "sku": "TS-S-BLK", "size": "S", "color": "Black", "stock": 50 },
        { "sku": "TS-M-BLK", "size": "M", "color": "Black", "stock": 75 },
        { "sku": "TS-L-BLK", "size": "L", "color": "Black", "stock": 30 }
      ],
      "tags": ["cotton", "unisex", "casual"]
    }, null, 2)
  },
  {
    name: 'Azure Function Input',
    description: 'Azure Function HTTP trigger input',
    content: JSON.stringify({
      "requestId": "abc123",
      "method": "POST",
      "headers": {
        "contentType": "application/json",
        "authorization": "Bearer token123"
      },
      "body": {
        "action": "process",
        "payload": {
          "itemId": 1,
          "quantity": 5
        }
      },
      "timestamp": "2024-01-15T10:30:00Z"
    }, null, 2)
  },
];
