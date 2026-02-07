/**
 * Sample templates for JSON Merge tool
 * Each template includes multiple JSON inputs for demonstrating merge functionality
 */

export interface MergeSampleTemplate {
  id: string;
  name: string;
  description: string;
  category: 'api' | 'config' | 'data' | 'array';
  icon: string;
  inputs: {
    name: string;
    content: string;
  }[];
  recommendedStrategy: 'simple' | 'deep' | 'arrayConcatenation' | 'arrayUnion' | 'nestedArrayMerge';
}

export const mergeSampleTemplates: MergeSampleTemplate[] = [
  {
    id: 'api-response-merge',
    name: 'API Response Merge',
    description: 'Merge user data from multiple API endpoints',
    category: 'api',
    icon: 'fas fa-server',
    recommendedStrategy: 'deep',
    inputs: [
      {
        name: 'User Profile API',
        content: `{
  "user": {
    "id": "usr_12345",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "meta": {
    "source": "profile-service",
    "version": "2.1"
  }
}`,
      },
      {
        name: 'User Preferences API',
        content: `{
  "user": {
    "id": "usr_12345",
    "preferences": {
      "theme": "dark",
      "language": "en-US",
      "notifications": {
        "email": true,
        "push": false
      }
    }
  },
  "meta": {
    "source": "preferences-service",
    "lastUpdated": "2024-03-10T08:00:00Z"
  }
}`,
      },
    ],
  },
  {
    id: 'config-merge',
    name: 'Configuration Merge',
    description: 'Merge base config with environment overrides',
    category: 'config',
    icon: 'fas fa-cog',
    recommendedStrategy: 'deep',
    inputs: [
      {
        name: 'Base Config',
        content: `{
  "app": {
    "name": "MyApplication",
    "version": "1.0.0",
    "debug": false
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "myapp_db",
    "pool": {
      "min": 2,
      "max": 10
    }
  },
  "cache": {
    "enabled": true,
    "ttl": 3600
  },
  "logging": {
    "level": "info",
    "format": "json"
  }
}`,
      },
      {
        name: 'Production Overrides',
        content: `{
  "app": {
    "debug": false
  },
  "database": {
    "host": "prod-db.example.com",
    "pool": {
      "min": 10,
      "max": 50
    }
  },
  "cache": {
    "ttl": 7200
  },
  "logging": {
    "level": "warn"
  },
  "monitoring": {
    "enabled": true,
    "endpoint": "https://metrics.example.com"
  }
}`,
      },
    ],
  },
  {
    id: 'user-data-merge',
    name: 'User Data Consolidation',
    description: 'Merge user records from multiple sources',
    category: 'data',
    icon: 'fas fa-users',
    recommendedStrategy: 'nestedArrayMerge',
    inputs: [
      {
        name: 'CRM Database',
        content: `{
  "users": [
    {
      "id": "u001",
      "name": "Alice Johnson",
      "email": "alice@company.com",
      "department": "Engineering"
    },
    {
      "id": "u002",
      "name": "Bob Williams",
      "email": "bob@company.com",
      "department": "Marketing"
    }
  ],
  "lastSync": "2024-03-01"
}`,
      },
      {
        name: 'HR System',
        content: `{
  "users": [
    {
      "id": "u001",
      "title": "Senior Developer",
      "startDate": "2022-03-15",
      "manager": "u003"
    },
    {
      "id": "u002",
      "title": "Marketing Lead",
      "startDate": "2021-06-01",
      "manager": "u004"
    },
    {
      "id": "u003",
      "name": "Carol Davis",
      "title": "Engineering Manager",
      "startDate": "2020-01-10"
    }
  ],
  "lastSync": "2024-03-10"
}`,
      },
    ],
  },
  {
    id: 'array-concatenation',
    name: 'Log Entries Merge',
    description: 'Concatenate log entries from multiple sources',
    category: 'array',
    icon: 'fas fa-list',
    recommendedStrategy: 'arrayConcatenation',
    inputs: [
      {
        name: 'Server 1 Logs',
        content: `{
  "logs": [
    {
      "timestamp": "2024-03-10T10:00:00Z",
      "level": "INFO",
      "message": "Application started",
      "server": "server-1"
    },
    {
      "timestamp": "2024-03-10T10:05:00Z",
      "level": "WARN",
      "message": "High memory usage detected",
      "server": "server-1"
    }
  ],
  "server": "server-1",
  "region": "us-east"
}`,
      },
      {
        name: 'Server 2 Logs',
        content: `{
  "logs": [
    {
      "timestamp": "2024-03-10T10:02:00Z",
      "level": "INFO",
      "message": "Application started",
      "server": "server-2"
    },
    {
      "timestamp": "2024-03-10T10:08:00Z",
      "level": "ERROR",
      "message": "Database connection failed",
      "server": "server-2"
    }
  ],
  "server": "server-2",
  "region": "us-west"
}`,
      },
    ],
  },
  {
    id: 'tags-union',
    name: 'Tags Union',
    description: 'Combine unique tags from multiple articles',
    category: 'array',
    icon: 'fas fa-tags',
    recommendedStrategy: 'arrayUnion',
    inputs: [
      {
        name: 'Article 1',
        content: `{
  "title": "Getting Started with React",
  "tags": ["react", "javascript", "frontend", "tutorial"],
  "category": "development",
  "author": "Jane Doe"
}`,
      },
      {
        name: 'Article 2',
        content: `{
  "title": "Advanced React Patterns",
  "tags": ["react", "patterns", "advanced", "javascript"],
  "category": "development",
  "author": "John Smith"
}`,
      },
      {
        name: 'Article 3',
        content: `{
  "title": "React Performance Tips",
  "tags": ["react", "performance", "optimization", "frontend"],
  "category": "performance",
  "author": "Jane Doe"
}`,
      },
    ],
  },
  {
    id: 'package-json-merge',
    name: 'package.json Merge',
    description: 'Merge dependencies from multiple package.json files',
    category: 'config',
    icon: 'fas fa-box',
    recommendedStrategy: 'deep',
    inputs: [
      {
        name: 'Core Dependencies',
        content: `{
  "name": "my-project",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "eslint": "^8.56.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}`,
      },
      {
        name: 'Additional Features',
        content: `{
  "dependencies": {
    "zustand": "^4.5.0",
    "react-query": "^5.17.0",
    "date-fns": "^3.3.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "@testing-library/react": "^14.1.0",
    "prettier": "^3.2.0"
  },
  "scripts": {
    "test": "jest",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  }
}`,
      },
    ],
  },
];

export const templateCategories = {
  api: { name: 'API & Services', icon: 'fas fa-server' },
  config: { name: 'Configuration', icon: 'fas fa-cog' },
  data: { name: 'Data Merge', icon: 'fas fa-database' },
  array: { name: 'Array Operations', icon: 'fas fa-list' },
};

export function getSampleById(id: string): MergeSampleTemplate | undefined {
  return mergeSampleTemplates.find((t) => t.id === id);
}

export function getSamplesByCategory(category: MergeSampleTemplate['category']): MergeSampleTemplate[] {
  return mergeSampleTemplates.filter((t) => t.category === category);
}
