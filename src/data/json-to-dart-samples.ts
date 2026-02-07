/**
 * Sample templates for JSON to Dart converter
 */

export interface SampleTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
}

export const jsonToDartSamples: SampleTemplate[] = [
  {
    id: 'user-model',
    name: 'User Model',
    description: 'Simple user with profile data',
    category: 'Common',
    content: JSON.stringify({
      "id": 123,
      "email": "john@example.com",
      "username": "john_doe",
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
    id: 'api-response',
    name: 'API Response',
    description: 'Typical REST API response with data and pagination',
    category: 'API',
    content: JSON.stringify({
      "success": true,
      "message": "Data retrieved successfully",
      "data": {
        "items": [
          {
            "id": 1,
            "title": "Item One",
            "price": 29.99,
            "inStock": true
          }
        ],
        "pagination": {
          "page": 1,
          "perPage": 10,
          "totalItems": 100,
          "totalPages": 10
        }
      }
    }, null, 2)
  },
  {
    id: 'product',
    name: 'E-commerce Product',
    description: 'Product with variants and ratings',
    category: 'E-commerce',
    content: JSON.stringify({
      "productId": "PRD-12345",
      "name": "Premium Widget",
      "description": "High-quality widget for Flutter apps",
      "price": 99.99,
      "currency": "USD",
      "inStock": true,
      "images": [
        {
          "url": "https://example.com/img1.jpg",
          "isPrimary": true
        }
      ],
      "variants": [
        {
          "sku": "WDG-BLK",
          "color": "Black",
          "available": true
        }
      ],
      "rating": {
        "average": 4.5,
        "reviewCount": 128
      }
    }, null, 2)
  },
  {
    id: 'firestore-doc',
    name: 'Firestore Document',
    description: 'Firestore document structure',
    category: 'Firebase',
    content: JSON.stringify({
      "id": "doc_abc123",
      "title": "My Document",
      "content": "Document content here",
      "author": {
        "uid": "user_123",
        "displayName": "John Doe"
      },
      "tags": ["flutter", "dart", "firebase"],
      "isPublished": true,
      "viewCount": 150,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T12:00:00Z"
    }, null, 2)
  },
  {
    id: 'bloc-state',
    name: 'BLoC State',
    description: 'State class for BLoC pattern',
    category: 'State Management',
    content: JSON.stringify({
      "status": "loaded",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "items": [
        { "id": 1, "name": "Item 1" },
        { "id": 2, "name": "Item 2" }
      ],
      "selectedIndex": 0,
      "isLoading": false,
      "errorMessage": null
    }, null, 2)
  },
  {
    id: 'notification',
    name: 'Push Notification',
    description: 'FCM notification payload',
    category: 'Firebase',
    content: JSON.stringify({
      "notificationId": "notif_123",
      "title": "New Message",
      "body": "You have a new message",
      "data": {
        "type": "message",
        "senderId": "user_456",
        "conversationId": "conv_789"
      },
      "sentAt": "2024-01-15T10:30:00Z"
    }, null, 2)
  }
];

export function getJsonToDartSample(id: string): SampleTemplate | undefined {
  return jsonToDartSamples.find(s => s.id === id);
}
