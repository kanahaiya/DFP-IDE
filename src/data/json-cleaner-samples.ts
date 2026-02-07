/**
 * JSON Cleaner Sample Templates
 * Example JSON for testing cleaner functionality
 */

export interface SampleTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  content: string;
  category: 'empty-values' | 'keys' | 'types' | 'structure' | 'mixed';
}

export const jsonCleanerSamples: SampleTemplate[] = [
  {
    id: 'empty-values',
    name: 'Empty Values',
    description: 'JSON with various empty values to remove',
    icon: 'fas fa-ban',
    category: 'empty-values',
    content: `{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "",
  "bio": null,
  "website": "   ",
  "tags": [],
  "metadata": {},
  "settings": {
    "theme": "dark",
    "notifications": null,
    "language": ""
  }
}`,
  },
  {
    id: 'duplicate-arrays',
    name: 'Duplicate Arrays',
    description: 'Arrays with duplicate items',
    icon: 'fas fa-clone',
    category: 'empty-values',
    content: `{
  "tags": ["javascript", "typescript", "javascript", "react", "typescript"],
  "ids": [1, 2, 3, 2, 1, 4, 3, 5],
  "users": [
    {"name": "Alice", "role": "admin"},
    {"name": "Bob", "role": "user"},
    {"name": "Alice", "role": "admin"}
  ]
}`,
  },
  {
    id: 'snake-to-camel',
    name: 'Snake to Camel',
    description: 'Convert snake_case keys to camelCase',
    icon: 'fas fa-key',
    category: 'keys',
    content: `{
  "user_id": 12345,
  "user_name": "john_doe",
  "email_address": "john@example.com",
  "created_at": "2024-01-15T10:30:00Z",
  "is_active": true,
  "profile_data": {
    "first_name": "John",
    "last_name": "Doe",
    "profile_picture_url": "https://example.com/avatar.jpg"
  }
}`,
  },
  {
    id: 'camel-to-snake',
    name: 'Camel to Snake',
    description: 'Convert camelCase keys to snake_case',
    icon: 'fas fa-key',
    category: 'keys',
    content: `{
  "userId": 12345,
  "userName": "johnDoe",
  "emailAddress": "john@example.com",
  "createdAt": "2024-01-15T10:30:00Z",
  "isActive": true,
  "profileData": {
    "firstName": "John",
    "lastName": "Doe",
    "profilePictureUrl": "https://example.com/avatar.jpg"
  }
}`,
  },
  {
    id: 'string-types',
    name: 'String Types',
    description: 'String values that should be other types',
    icon: 'fas fa-hashtag',
    category: 'types',
    content: `{
  "count": "42",
  "price": "19.99",
  "quantity": "100",
  "active": "true",
  "verified": "false",
  "enabled": "TRUE",
  "data": {
    "score": "95.5",
    "passed": "true",
    "attempts": "3"
  }
}`,
  },
  {
    id: 'nested-object',
    name: 'Nested Object',
    description: 'Deeply nested object for flattening',
    icon: 'fas fa-sitemap',
    category: 'structure',
    content: `{
  "user": {
    "profile": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "settings": {
      "theme": {
        "mode": "dark",
        "colors": {
          "primary": "#3b82f6",
          "secondary": "#64748b"
        }
      },
      "notifications": {
        "email": true,
        "push": false
      }
    }
  }
}`,
  },
  {
    id: 'flat-object',
    name: 'Flat Object',
    description: 'Flat object with dot notation for unflattening',
    icon: 'fas fa-expand-arrows-alt',
    category: 'structure',
    content: `{
  "user.profile.name": "John Doe",
  "user.profile.email": "john@example.com",
  "user.settings.theme.mode": "dark",
  "user.settings.theme.colors.primary": "#3b82f6",
  "user.settings.theme.colors.secondary": "#64748b",
  "user.settings.notifications.email": true,
  "user.settings.notifications.push": false
}`,
  },
  {
    id: 'messy-json',
    name: 'Messy JSON',
    description: 'Real-world messy JSON with multiple issues',
    icon: 'fas fa-broom',
    category: 'mixed',
    content: `{
  "user_info": {
    "user_id": "12345",
    "first_name": "  John  ",
    "last_name": "  Doe  ",
    "email_address": "john@example.com",
    "phone_number": "",
    "bio_text": null,
    "profile_picture_url": "   "
  },
  "account_settings": {
    "is_active": "true",
    "is_verified": "false",
    "login_count": "42",
    "preferences": {},
    "tags_list": ["dev", "admin", "dev", "user", "admin"]
  },
  "metadata": {
    "created_at": "2024-01-15",
    "updated_at": null,
    "extra_data": {}
  }
}`,
  },
  {
    id: 'api-response',
    name: 'API Response',
    description: 'Typical API response to clean',
    icon: 'fas fa-server',
    category: 'mixed',
    content: `{
  "status_code": "200",
  "message": "Success",
  "data": {
    "user_list": [
      {
        "user_id": "1",
        "display_name": "Alice",
        "email_address": "alice@test.com",
        "is_admin": "true",
        "last_login": null
      },
      {
        "user_id": "2",
        "display_name": "Bob",
        "email_address": "bob@test.com",
        "is_admin": "false",
        "last_login": null
      }
    ],
    "total_count": "2",
    "page_number": "1"
  },
  "errors": [],
  "meta_info": {}
}`,
  },
];

/**
 * Get samples by category
 */
export function getSamplesByCategory(category: SampleTemplate['category']): SampleTemplate[] {
  return jsonCleanerSamples.filter(s => s.category === category);
}

/**
 * Get sample by ID
 */
export function getSampleById(id: string): SampleTemplate | undefined {
  return jsonCleanerSamples.find(s => s.id === id);
}
