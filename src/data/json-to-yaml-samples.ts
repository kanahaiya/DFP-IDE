export interface SampleTemplate {
  name: string;
  description: string;
  json: string;
  yaml: string;
}

export const YAML_SAMPLES: SampleTemplate[] = [
  {
    name: 'Simple Object',
    description: 'Basic JSON object with string, number, and boolean values',
    json: `{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "active": true
}`,
    yaml: `name: John Doe
age: 30
city: New York
active: true
`
  },
  {
    name: 'Nested Objects & Arrays',
    description: 'Complex structure with nested objects and arrays',
    json: `{
  "user": {
    "id": 12345,
    "name": "Alice Smith",
    "email": "alice@example.com"
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
    yaml: `user:
  id: 12345
  name: Alice Smith
  email: alice@example.com
tags:
  - developer
  - javascript
  - nodejs
preferences:
  theme: dark
  notifications:
    email: true
    push: false
`
  },
  {
    name: 'API Response Example',
    description: 'Typical REST API response structure',
    json: `{
  "status": "success",
  "data": {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "role": "admin"
      },
      {
        "id": 2,
        "name": "Jane Smith",
        "role": "user"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2
    }
  },
  "timestamp": "2026-01-13T12:00:00Z"
}`,
    yaml: `status: success
data:
  users:
    - id: 1
      name: John Doe
      role: admin
    - id: 2
      name: Jane Smith
      role: user
  pagination:
    page: 1
    limit: 10
    total: 2
timestamp: '2026-01-13T12:00:00Z'
`
  },
  {
    name: 'Kubernetes Deployment',
    description: 'Kubernetes deployment configuration',
    json: `{
  "apiVersion": "apps/v1",
  "kind": "Deployment",
  "metadata": {
    "name": "nginx-deployment",
    "labels": {
      "app": "nginx"
    }
  },
  "spec": {
    "replicas": 3,
    "selector": {
      "matchLabels": {
        "app": "nginx"
      }
    },
    "template": {
      "metadata": {
        "labels": {
          "app": "nginx"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "nginx",
            "image": "nginx:1.14.2",
            "ports": [
              {
                "containerPort": 80
              }
            ]
          }
        ]
      }
    }
  }
}`,
    yaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.14.2
          ports:
            - containerPort: 80
`
  },
  {
    name: 'Docker Compose',
    description: 'Docker Compose service configuration',
    json: `{
  "version": "3.8",
  "services": {
    "web": {
      "image": "nginx:latest",
      "ports": [
        "80:80",
        "443:443"
      ],
      "volumes": [
        "./html:/usr/share/nginx/html"
      ],
      "environment": {
        "NGINX_HOST": "example.com",
        "NGINX_PORT": "80"
      }
    },
    "db": {
      "image": "postgres:13",
      "environment": {
        "POSTGRES_DB": "myapp",
        "POSTGRES_USER": "user",
        "POSTGRES_PASSWORD": "password"
      },
      "volumes": [
        "db-data:/var/lib/postgresql/data"
      ]
    }
  },
  "volumes": {
    "db-data": {}
  }
}`,
    yaml: `version: '3.8'
services:
  web:
    image: nginx:latest
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./html:/usr/share/nginx/html
    environment:
      NGINX_HOST: example.com
      NGINX_PORT: '80'
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - db-data:/var/lib/postgresql/data
volumes:
  db-data: {}
`
  }
];
