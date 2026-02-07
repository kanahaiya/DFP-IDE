/**
 * JSON Fixer Sample Templates
 * Example broken JSON for testing fixer functionality
 */

export interface SampleTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  content: string;
  errorCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const jsonFixerSamples: SampleTemplate[] = [
  {
    id: 'simple-quotes',
    name: 'Quote Errors',
    description: 'Simple quote issues - single quotes and unquoted keys',
    icon: 'fas fa-quote-right',
    difficulty: 'easy',
    errorCount: 4,
    content: `{
  'name': 'Alice',
  'email': 'alice@example.com',
  age: 25
}`,
  },
  {
    id: 'comma-errors',
    name: 'Comma Issues',
    description: 'Missing and trailing commas',
    icon: 'fas fa-comma',
    difficulty: 'easy',
    errorCount: 3,
    content: `{
  "firstName": "John"
  "lastName": "Doe"
  "items": [1, 2, 3,]
}`,
  },
  {
    id: 'boolean-null',
    name: 'Values Errors',
    description: 'Wrong boolean and null values',
    icon: 'fas fa-toggle-on',
    difficulty: 'easy',
    errorCount: 4,
    content: `{
  "active": True,
  "verified": FALSE,
  "data": None,
  "error": NULL
}`,
  },
  {
    id: 'bracket-errors',
    name: 'Bracket Issues',
    description: 'Unclosed and mismatched brackets',
    icon: 'fas fa-code',
    difficulty: 'medium',
    errorCount: 2,
    content: `{
  "users": [
    {"name": "Alice", "role": "admin"
    {"name": "Bob", "role": "user"}
  ],
  "count": 2
}`,
  },
  {
    id: 'comments',
    name: 'JavaScript Style',
    description: 'Comments and JS-style syntax',
    icon: 'fas fa-comment-slash',
    difficulty: 'medium',
    errorCount: 4,
    content: `{
  // User configuration
  name: "Config",
  /* Settings for the application */
  settings: {
    theme: 'dark',
    debug: true
  }
}`,
  },
  {
    id: 'mixed-medium',
    name: 'Mixed Errors',
    description: 'Various error types combined',
    icon: 'fas fa-random',
    difficulty: 'medium',
    errorCount: 6,
    content: `{
  'user': {
    name: "John Doe"
    "email": 'john@example.com',
    "active": True,
  },
  "tags": ["a", "b", "c",]
}`,
  },
  {
    id: 'api-response',
    name: 'API Response',
    description: 'Typical broken API response',
    icon: 'fas fa-server',
    difficulty: 'medium',
    errorCount: 5,
    content: `{
  'status': 'success',
  'data': {
    id: 12345
    "timestamp": "2024-01-15T10:30:00Z",
    "user": {
      "name": "Alice"
      'role': 'admin',
    },
  },
  'message': None
}`,
  },
  {
    id: 'complex',
    name: 'Complex JSON',
    description: 'Many errors across a larger structure',
    icon: 'fas fa-project-diagram',
    difficulty: 'hard',
    errorCount: 10,
    content: `{
  // Application config
  'app': {
    name: "MyApp",
    version: '1.0.0'
    "debug": True,
    "features": {
      'auth': {
        enabled: TRUE,
        "provider": None,
        "timeout": 3000,
      },
      "logging": {
        level: "info"
        "output": ['console', 'file',]
      }
    },
  },
  "database": {
    host: 'localhost'
    "port": 5432,
    "credentials": undefined
  }
}`,
  },
  {
    id: 'llm-output',
    name: 'AI Generated',
    description: 'Typical broken JSON from AI tools',
    icon: 'fas fa-robot',
    difficulty: 'hard',
    errorCount: 8,
    content: `Here's the JSON configuration:

\`\`\`json
{
  'model': 'gpt-4',
  'parameters': {
    temperature: 0.7,
    'max_tokens': 2000
    "top_p": 0.9,
  },
  "messages": [
    {role: "system", content: "You are a helpful assistant."},
    {role: "user", "content": 'Hello!',}
  ],
  // Stream the response
  "stream": True
}
\`\`\``,
  },
];

/**
 * Get samples by difficulty
 */
export function getSamplesByDifficulty(difficulty: SampleTemplate['difficulty']): SampleTemplate[] {
  return jsonFixerSamples.filter(s => s.difficulty === difficulty);
}

/**
 * Get sample by ID
 */
export function getSampleById(id: string): SampleTemplate | undefined {
  return jsonFixerSamples.find(s => s.id === id);
}
