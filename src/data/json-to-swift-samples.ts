/**
 * Sample templates for JSON to Swift converter
 */

export interface SampleTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
}

export const jsonToSwiftSamples: SampleTemplate[] = [
  {
    id: 'user-profile',
    name: 'User Profile',
    description: 'User object with nested profile data',
    category: 'Common',
    content: JSON.stringify({
      "id": 12345,
      "username": "john_doe",
      "email": "john@example.com",
      "is_verified": true,
      "created_at": "2024-01-15T10:30:00Z",
      "profile": {
        "first_name": "John",
        "last_name": "Doe",
        "avatar_url": "https://example.com/avatar.jpg",
        "bio": "Software developer"
      }
    }, null, 2)
  },
  {
    id: 'api-response',
    name: 'API Response',
    description: 'Typical REST API response with pagination',
    category: 'API',
    content: JSON.stringify({
      "success": true,
      "data": {
        "items": [
          {
            "id": 1,
            "title": "Item One",
            "description": "First item description",
            "price": 29.99
          }
        ],
        "total_count": 100,
        "page": 1,
        "per_page": 10
      },
      "meta": {
        "request_id": "abc123",
        "response_time_ms": 42
      }
    }, null, 2)
  },
  {
    id: 'product-catalog',
    name: 'Product Catalog',
    description: 'E-commerce product with variants',
    category: 'E-commerce',
    content: JSON.stringify({
      "product_id": "PRD-12345",
      "name": "Premium Widget",
      "description": "High-quality widget",
      "price": 99.99,
      "currency": "USD",
      "in_stock": true,
      "images": [
        {
          "url": "https://example.com/img1.jpg",
          "alt_text": "Front view"
        }
      ],
      "variants": [
        {
          "sku": "WDG-BLK-M",
          "color": "Black",
          "size": "M",
          "available": true
        }
      ],
      "rating": {
        "average": 4.5,
        "review_count": 128
      }
    }, null, 2)
  },
  {
    id: 'weather-data',
    name: 'Weather Data',
    description: 'Weather API response structure',
    category: 'API',
    content: JSON.stringify({
      "location": {
        "city": "San Francisco",
        "country": "US",
        "latitude": 37.7749,
        "longitude": -122.4194
      },
      "current": {
        "temperature": 18.5,
        "feels_like": 17.2,
        "humidity": 65,
        "wind_speed": 12.5,
        "condition": "Partly Cloudy",
        "icon": "partly-cloudy"
      },
      "forecast": [
        {
          "date": "2024-01-16",
          "high": 21,
          "low": 14,
          "condition": "Sunny"
        }
      ]
    }, null, 2)
  },
  {
    id: 'notification',
    name: 'Push Notification',
    description: 'Push notification payload',
    category: 'Mobile',
    content: JSON.stringify({
      "notification_id": "notif_123",
      "title": "New Message",
      "body": "You have a new message from John",
      "badge_count": 5,
      "sound": "default",
      "data": {
        "type": "message",
        "sender_id": "user_456",
        "conversation_id": "conv_789"
      },
      "sent_at": "2024-01-15T10:30:00Z"
    }, null, 2)
  },
  {
    id: 'social-post',
    name: 'Social Media Post',
    description: 'Social media post with interactions',
    category: 'Social',
    content: JSON.stringify({
      "post_id": "post_abc123",
      "author": {
        "user_id": "user_123",
        "display_name": "Jane Smith",
        "profile_image": "https://example.com/jane.jpg",
        "is_verified": true
      },
      "content": "Check out this awesome photo!",
      "media": [
        {
          "type": "image",
          "url": "https://example.com/photo.jpg",
          "width": 1920,
          "height": 1080
        }
      ],
      "likes_count": 245,
      "comments_count": 32,
      "shares_count": 12,
      "created_at": "2024-01-15T10:30:00Z"
    }, null, 2)
  }
];

export function getJsonToSwiftSample(id: string): SampleTemplate | undefined {
  return jsonToSwiftSamples.find(s => s.id === id);
}
