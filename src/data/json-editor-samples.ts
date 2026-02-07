/**
 * JSON Editor Sample Data
 * Sample JSON templates for the editor
 */

import type { JsonValue } from '@/lib/json-editor/types';

/**
 * Sample template interface
 */
export interface EditorSampleTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  data: JsonValue;
}

/**
 * Sample templates
 */
export const JSON_EDITOR_SAMPLES: EditorSampleTemplate[] = [
  {
    id: 'simple-object',
    name: 'Simple Object',
    description: 'A basic JSON object with primitive values',
    icon: 'fas fa-cube',
    iconColor: '#3B82F6',
    data: {
      name: 'John Doe',
      age: 30,
      email: 'john@example.com',
      active: true,
      balance: 1250.50,
    },
  },
  {
    id: 'nested-object',
    name: 'Nested Object',
    description: 'An object with nested structures',
    icon: 'fas fa-cubes',
    iconColor: '#10B981',
    data: {
      user: {
        profile: {
          firstName: 'Jane',
          lastName: 'Smith',
          avatar: null,
        },
        settings: {
          theme: 'dark',
          notifications: true,
          language: 'en',
        },
      },
      metadata: {
        createdAt: '2026-01-17T10:30:00Z',
        updatedAt: '2026-01-17T15:45:00Z',
      },
    },
  },
  {
    id: 'array-data',
    name: 'Array of Objects',
    description: 'An array containing multiple objects',
    icon: 'fas fa-list',
    iconColor: '#F59E0B',
    data: {
      products: [
        { id: 1, name: 'Laptop', price: 999.99, inStock: true },
        { id: 2, name: 'Mouse', price: 29.99, inStock: true },
        { id: 3, name: 'Keyboard', price: 79.99, inStock: false },
        { id: 4, name: 'Monitor', price: 349.99, inStock: true },
      ],
      totalItems: 4,
      lastUpdated: '2026-01-17',
    },
  },
  {
    id: 'config-file',
    name: 'Configuration File',
    description: 'A typical application configuration structure',
    icon: 'fas fa-cog',
    iconColor: '#6366F1',
    data: {
      app: {
        name: 'MyApplication',
        version: '2.0.0',
        environment: 'development',
      },
      server: {
        host: 'localhost',
        port: 3000,
        ssl: false,
      },
      database: {
        type: 'postgresql',
        host: 'db.example.com',
        port: 5432,
        name: 'myapp_dev',
        pool: {
          min: 2,
          max: 10,
        },
      },
      logging: {
        level: 'debug',
        format: 'json',
        outputs: ['console', 'file'],
      },
      features: {
        enableCache: true,
        enableMetrics: false,
        experimental: {
          newUI: false,
          betaFeatures: [],
        },
      },
    },
  },
  {
    id: 'api-response',
    name: 'API Response',
    description: 'A typical REST API response structure',
    icon: 'fas fa-cloud',
    iconColor: '#EC4899',
    data: {
      success: true,
      data: {
        users: [
          {
            id: 'usr_001',
            name: 'Alice Johnson',
            email: 'alice@example.com',
            roles: ['admin', 'editor'],
            lastLogin: '2026-01-17T08:00:00Z',
          },
          {
            id: 'usr_002',
            name: 'Bob Wilson',
            email: 'bob@example.com',
            roles: ['viewer'],
            lastLogin: '2026-01-16T14:30:00Z',
          },
        ],
        pagination: {
          page: 1,
          perPage: 10,
          total: 2,
          totalPages: 1,
        },
      },
      meta: {
        requestId: 'req_abc123',
        timestamp: '2026-01-17T10:00:00Z',
        version: 'v2',
      },
    },
  },
  {
    id: 'package-json',
    name: 'package.json',
    description: 'Node.js package.json structure',
    icon: 'fab fa-npm',
    iconColor: '#CB3837',
    data: {
      name: 'my-awesome-package',
      version: '1.0.0',
      description: 'An awesome package for doing awesome things',
      main: 'dist/index.js',
      types: 'dist/index.d.ts',
      scripts: {
        build: 'tsc',
        test: 'jest',
        lint: 'eslint src/',
        start: 'node dist/index.js',
      },
      keywords: ['awesome', 'package', 'typescript'],
      author: {
        name: 'Your Name',
        email: 'you@example.com',
      },
      license: 'MIT',
      dependencies: {
        lodash: '^4.17.21',
        axios: '^1.6.0',
      },
      devDependencies: {
        typescript: '^5.3.0',
        jest: '^29.7.0',
        eslint: '^8.55.0',
      },
      repository: {
        type: 'git',
        url: 'https://github.com/username/repo',
      },
    },
  },
  {
    id: 'geojson',
    name: 'GeoJSON',
    description: 'Geographic data in GeoJSON format',
    icon: 'fas fa-map-marker-alt',
    iconColor: '#059669',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            name: 'Central Park',
            city: 'New York',
            type: 'park',
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[[-73.958, 40.8], [-73.949, 40.8], [-73.949, 40.764], [-73.958, 40.764], [-73.958, 40.8]]],
          },
        },
        {
          type: 'Feature',
          properties: {
            name: 'Times Square',
            city: 'New York',
            type: 'landmark',
          },
          geometry: {
            type: 'Point',
            coordinates: [-73.9855, 40.758],
          },
        },
      ],
    },
  },
  {
    id: 'all-types',
    name: 'All Data Types',
    description: 'Example showcasing all JSON data types',
    icon: 'fas fa-database',
    iconColor: '#8B5CF6',
    data: {
      stringValue: 'Hello, World!',
      numberInteger: 42,
      numberFloat: 3.14159,
      numberNegative: -273.15,
      booleanTrue: true,
      booleanFalse: false,
      nullValue: null,
      emptyObject: {},
      emptyArray: [],
      simpleArray: [1, 2, 3, 4, 5],
      mixedArray: ['text', 123, true, null, { nested: 'object' }],
      nestedObject: {
        level1: {
          level2: {
            level3: {
              deepValue: 'Found me!',
            },
          },
        },
      },
    },
  },
];

/**
 * Get sample by ID
 */
export function getSample(id: string): EditorSampleTemplate | undefined {
  return JSON_EDITOR_SAMPLES.find((sample) => sample.id === id);
}

/**
 * Get sample data by ID (returns just the data)
 */
export function getSampleData(id: string): JsonValue | undefined {
  const sample = getSample(id);
  return sample?.data;
}
