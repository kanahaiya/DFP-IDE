export interface XMLSampleTemplate {
  name: string;
  description: string;
  json: string;
}

export const XML_SAMPLES: XMLSampleTemplate[] = [
  {
    name: 'Simple Object',
    description: 'Basic JSON object with string, number, and boolean values',
    json: `{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "active": true,
  "email": "john@example.com"
}`,
  },
  {
    name: 'Nested Objects',
    description: 'Complex structure with nested objects and arrays',
    json: `{
  "user": {
    "id": 12345,
    "name": "Alice Smith",
    "email": "alice@example.com",
    "address": {
      "street": "123 Main St",
      "city": "Boston",
      "zipCode": "02101"
    }
  },
  "tags": ["developer", "javascript", "nodejs"],
  "preferences": {
    "theme": "dark",
    "notifications": {
      "email": true,
      "push": false
    }
  }
}`,
  },
  {
    name: 'RSS Feed Data',
    description: 'JSON data suitable for RSS feed conversion',
    json: `{
  "channel": {
    "title": "Tech News Daily",
    "link": "https://technews.example.com",
    "description": "Latest technology news and updates",
    "language": "en-us",
    "lastBuildDate": "2026-01-15T10:00:00Z"
  },
  "items": [
    {
      "title": "AI Breakthrough Announced",
      "link": "https://technews.example.com/ai-breakthrough",
      "description": "Scientists announce major AI advancement",
      "pubDate": "2026-01-15T09:30:00Z",
      "author": "tech@example.com"
    },
    {
      "title": "New Programming Language Released",
      "link": "https://technews.example.com/new-language",
      "description": "A revolutionary new programming language hits the market",
      "pubDate": "2026-01-14T14:00:00Z",
      "author": "dev@example.com"
    }
  ]
}`,
  },
  {
    name: 'XML Sitemap Data',
    description: 'JSON data for generating XML sitemaps',
    json: `{
  "urls": [
    {
      "loc": "https://example.com/",
      "lastmod": "2026-01-15",
      "changefreq": "daily",
      "priority": "1.0"
    },
    {
      "loc": "https://example.com/about",
      "lastmod": "2026-01-10",
      "changefreq": "monthly",
      "priority": "0.8"
    },
    {
      "loc": "https://example.com/products",
      "lastmod": "2026-01-14",
      "changefreq": "weekly",
      "priority": "0.9"
    },
    {
      "loc": "https://example.com/contact",
      "lastmod": "2026-01-01",
      "changefreq": "yearly",
      "priority": "0.5"
    }
  ]
}`,
  },
  {
    name: 'Configuration File',
    description: 'Application configuration data for XML config files',
    json: `{
  "application": {
    "name": "MyApp",
    "version": "2.1.0",
    "environment": "production"
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "myapp_db",
    "pool": {
      "min": 5,
      "max": 20,
      "idleTimeout": 30000
    }
  },
  "logging": {
    "level": "info",
    "format": "json",
    "outputs": ["console", "file"],
    "file": {
      "path": "/var/log/myapp/",
      "maxSize": "10MB",
      "maxFiles": 5
    }
  },
  "features": {
    "darkMode": true,
    "analytics": true,
    "betaFeatures": false
  }
}`,
  },
  {
    name: 'SOAP Message Data',
    description: 'JSON data for SOAP web service messages',
    json: `{
  "envelope": {
    "header": {
      "security": {
        "username": "api_user",
        "timestamp": "2026-01-15T12:00:00Z"
      }
    },
    "body": {
      "request": {
        "operation": "GetUserDetails",
        "parameters": {
          "userId": "USR-12345",
          "includeProfile": true,
          "fields": ["name", "email", "phone", "address"]
        }
      }
    }
  }
}`,
  },
  {
    name: 'Android Resources',
    description: 'JSON data for Android string resources',
    json: `{
  "strings": [
    {
      "name": "app_name",
      "value": "My Application"
    },
    {
      "name": "welcome_message",
      "value": "Welcome to the app!"
    },
    {
      "name": "button_submit",
      "value": "Submit"
    },
    {
      "name": "button_cancel",
      "value": "Cancel"
    },
    {
      "name": "error_network",
      "value": "Network error. Please try again."
    }
  ],
  "colors": [
    {
      "name": "primary",
      "value": "#6200EE"
    },
    {
      "name": "secondary",
      "value": "#03DAC6"
    }
  ]
}`,
  },
  {
    name: 'API Response with Special Characters',
    description: 'JSON with special characters requiring CDATA or encoding',
    json: `{
  "article": {
    "title": "Understanding XML & JSON",
    "content": "When working with data formats, it's important to understand how <tags> and \"quotes\" are handled. The expression 5 > 3 && 2 < 4 demonstrates comparison operators.",
    "code": "function example() { return a < b && c > d; }",
    "htmlPreview": "<div class='container'><p>Hello <strong>World</strong></p></div>",
    "author": "Jane O'Connor",
    "publishDate": "2026-01-15"
  }
}`,
  },
];
