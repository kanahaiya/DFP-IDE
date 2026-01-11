/**
 * Sample JSON templates for OpenAPI tool
 */

export const SampleTemplates = {
  user: {
    id: 12345,
    username: "alice_johnson",
    email: "alice@example.com",
    firstName: "Alice",
    lastName: "Johnson",
    age: 28,
    isActive: true,
    roles: ["user", "admin"],
    createdAt: "2024-01-15T10:30:00Z",
    profile: {
      bio: "Full-stack developer",
      website: "https://alice.dev",
      location: "San Francisco, CA"
    }
  },
  
  product: {
    id: "prod_001",
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones",
    price: 299.99,
    currency: "USD",
    inStock: true,
    quantity: 50,
    categories: ["electronics", "audio"],
    specifications: {
      brand: "AudioTech",
      model: "WH-1000XM5",
      color: "Black",
      weight: "250g"
    },
    ratings: {
      average: 4.8,
      count: 1250
    }
  },
  
  blog: {
    id: "post_789",
    title: "Getting Started with OpenAPI",
    slug: "getting-started-with-openapi",
    content: "OpenAPI Specification is a powerful tool for API documentation...",
    excerpt: "Learn how to document your APIs with OpenAPI",
    author: {
      id: 42,
      name: "Jane Doe",
      email: "jane@example.com"
    },
    published: true,
    publishedAt: "2024-03-01T14:00:00Z",
    tags: ["openapi", "api", "documentation"],
    views: 5432,
    comments: 28
  },
  
  order: {
    orderId: "ORD-2024-001234",
    customerId: "cust_5678",
    orderDate: "2024-03-15T12:00:00Z",
    status: "processing",
    total: 159.97,
    currency: "USD",
    items: [
      {
        productId: "prod_001",
        name: "Wireless Mouse",
        quantity: 2,
        price: 29.99
      },
      {
        productId: "prod_002",
        name: "USB-C Cable",
        quantity: 3,
        price: 9.99
      }
    ],
    shipping: {
      method: "standard",
      address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "USA"
      },
      trackingNumber: "1Z999AA10123456784"
    },
    payment: {
      method: "credit_card",
      last4: "4242",
      status: "paid"
    }
  },
  
  error: {
    error: {
      code: "VALIDATION_ERROR",
      message: "Invalid request parameters",
      status: 400,
      timestamp: "2024-03-15T10:30:00Z",
      path: "/api/users",
      details: [
        {
          field: "email",
          message: "Invalid email format"
        },
        {
          field: "age",
          message: "Must be at least 18"
        }
      ]
    }
  },
  
  paginated: {
    data: [
      {
        id: 1,
        name: "Item 1",
        description: "First item"
      },
      {
        id: 2,
        name: "Item 2",
        description: "Second item"
      },
      {
        id: 3,
        name: "Item 3",
        description: "Third item"
      }
    ],
    pagination: {
      page: 1,
      pageSize: 10,
      totalPages: 5,
      totalItems: 50,
      hasNextPage: true,
      hasPreviousPage: false
    },
    links: {
      self: "/api/items?page=1",
      next: "/api/items?page=2",
      last: "/api/items?page=5"
    }
  }
};

export type SampleTemplateName = keyof typeof SampleTemplates;
