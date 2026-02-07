import type { SchemaField } from '@/lib/json-generator/types';

export interface GeneratorTemplate {
  id: string;
  name: string;
  description: string;
  category: 'common' | 'business' | 'ecommerce' | 'social' | 'api';
  icon: string;
  schema: SchemaField[];
}

export const generatorTemplates: GeneratorTemplate[] = [
  {
    id: 'user-profile',
    name: 'User Profile',
    description: 'Complete user profile with personal info, contact details, and address',
    category: 'common',
    icon: 'fas fa-user',
    schema: [
      { id: 'id', name: 'id', type: 'uuid', options: { unique: true } },
      { id: 'username', name: 'username', type: 'username', options: { unique: true } },
      { id: 'email', name: 'email', type: 'email', options: { unique: true } },
      { id: 'firstName', name: 'firstName', type: 'firstName', options: {} },
      { id: 'lastName', name: 'lastName', type: 'lastName', options: {} },
      { id: 'avatar', name: 'avatar', type: 'avatar', options: {} },
      { id: 'phone', name: 'phone', type: 'phone', options: {} },
      { id: 'birthDate', name: 'birthDate', type: 'date', options: { min: '1950-01-01', max: '2005-12-31' } },
      {
        id: 'address',
        name: 'address',
        type: 'object',
        options: {},
        children: [
          { id: 'street', name: 'street', type: 'streetAddress', options: {} },
          { id: 'city', name: 'city', type: 'city', options: {} },
          { id: 'state', name: 'state', type: 'state', options: {} },
          { id: 'zipCode', name: 'zipCode', type: 'zipCode', options: {} },
          { id: 'country', name: 'country', type: 'country', options: {} }
        ]
      },
      { id: 'isActive', name: 'isActive', type: 'boolean', options: {} },
      { id: 'createdAt', name: 'createdAt', type: 'datetime', options: { min: '2020-01-01' } },
      { id: 'lastLogin', name: 'lastLogin', type: 'recent', options: {} }
    ]
  },
  {
    id: 'ecommerce-product',
    name: 'E-commerce Product',
    description: 'Product listing with pricing, inventory, categories, and images',
    category: 'ecommerce',
    icon: 'fas fa-shopping-cart',
    schema: [
      { id: 'id', name: 'id', type: 'uuid', options: { unique: true } },
      { id: 'sku', name: 'sku', type: 'alphanumeric', options: { length: 8, unique: true } },
      { id: 'name', name: 'name', type: 'productName', options: {} },
      { id: 'description', name: 'description', type: 'paragraph', options: {} },
      { id: 'price', name: 'price', type: 'price', options: { min: 9.99, max: 999.99 } },
      { id: 'compareAtPrice', name: 'compareAtPrice', type: 'price', options: { min: 19.99, max: 1299.99, nullable: 30 } },
      { id: 'currency', name: 'currency', type: 'constant', options: { value: 'USD' } },
      { id: 'category', name: 'category', type: 'enum', options: { values: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Health', 'Automotive'] } },
      { id: 'tags', name: 'tags', type: 'array', options: { count: { min: 2, max: 5 } }, children: [
        { id: 'tag', name: 'tag', type: 'word', options: {} }
      ]},
      { id: 'images', name: 'images', type: 'array', options: { count: { min: 1, max: 4 } }, children: [
        { id: 'image', name: 'image', type: 'imageUrl', options: {} }
      ]},
      { id: 'inStock', name: 'inStock', type: 'boolean', options: {} },
      { id: 'quantity', name: 'quantity', type: 'number', options: { min: 0, max: 500, integer: true } },
      { id: 'rating', name: 'rating', type: 'number', options: { min: 1, max: 5, precision: 1 } },
      { id: 'reviewCount', name: 'reviewCount', type: 'number', options: { min: 0, max: 2000, integer: true } },
      {
        id: 'vendor',
        name: 'vendor',
        type: 'object',
        options: {},
        children: [
          { id: 'name', name: 'name', type: 'company', options: {} },
          { id: 'verified', name: 'verified', type: 'boolean', options: {} }
        ]
      },
      { id: 'createdAt', name: 'createdAt', type: 'datetime', options: { min: '2022-01-01' } }
    ]
  },
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Blog article with author, content, tags, and engagement metrics',
    category: 'social',
    icon: 'fas fa-newspaper',
    schema: [
      { id: 'id', name: 'id', type: 'uuid', options: { unique: true } },
      { id: 'slug', name: 'slug', type: 'slug', options: { unique: true } },
      { id: 'title', name: 'title', type: 'sentence', options: { min: 5, max: 12 } },
      { id: 'excerpt', name: 'excerpt', type: 'sentences', options: { count: 2 } },
      { id: 'content', name: 'content', type: 'paragraphs', options: { count: { min: 3, max: 6 } } },
      { id: 'featuredImage', name: 'featuredImage', type: 'imageUrl', options: {} },
      {
        id: 'author',
        name: 'author',
        type: 'object',
        options: {},
        children: [
          { id: 'id', name: 'id', type: 'uuid', options: {} },
          { id: 'name', name: 'name', type: 'fullName', options: {} },
          { id: 'avatar', name: 'avatar', type: 'avatar', options: {} },
          { id: 'bio', name: 'bio', type: 'sentence', options: {} }
        ]
      },
      { id: 'category', name: 'category', type: 'enum', options: { values: ['Technology', 'Business', 'Lifestyle', 'Travel', 'Food', 'Health', 'Science', 'Entertainment'] } },
      { id: 'tags', name: 'tags', type: 'array', options: { count: { min: 3, max: 6 } }, children: [
        { id: 'tag', name: 'tag', type: 'word', options: {} }
      ]},
      { id: 'publishedAt', name: 'publishedAt', type: 'past', options: { years: 2 } },
      { id: 'updatedAt', name: 'updatedAt', type: 'recent', options: {} },
      { id: 'readTime', name: 'readTime', type: 'number', options: { min: 2, max: 15, integer: true } },
      { id: 'views', name: 'views', type: 'number', options: { min: 100, max: 50000, integer: true } },
      { id: 'likes', name: 'likes', type: 'number', options: { min: 5, max: 2000, integer: true } },
      { id: 'commentsCount', name: 'commentsCount', type: 'number', options: { min: 0, max: 200, integer: true } },
      { id: 'isPublished', name: 'isPublished', type: 'boolean', options: {} },
      { id: 'isFeatured', name: 'isFeatured', type: 'boolean', options: {} }
    ]
  },
  {
    id: 'api-response',
    name: 'API Response',
    description: 'REST API response with pagination, metadata, and data array',
    category: 'api',
    icon: 'fas fa-code',
    schema: [
      { id: 'success', name: 'success', type: 'constant', options: { value: true } },
      { id: 'statusCode', name: 'statusCode', type: 'constant', options: { value: 200 } },
      { id: 'message', name: 'message', type: 'constant', options: { value: 'Data retrieved successfully' } },
      {
        id: 'meta',
        name: 'meta',
        type: 'object',
        options: {},
        children: [
          { id: 'timestamp', name: 'timestamp', type: 'datetime', options: {} },
          { id: 'requestId', name: 'requestId', type: 'uuid', options: {} },
          { id: 'version', name: 'version', type: 'constant', options: { value: 'v1' } }
        ]
      },
      {
        id: 'pagination',
        name: 'pagination',
        type: 'object',
        options: {},
        children: [
          { id: 'page', name: 'page', type: 'constant', options: { value: 1 } },
          { id: 'perPage', name: 'perPage', type: 'constant', options: { value: 20 } },
          { id: 'total', name: 'total', type: 'number', options: { min: 50, max: 500, integer: true } },
          { id: 'totalPages', name: 'totalPages', type: 'number', options: { min: 3, max: 25, integer: true } },
          { id: 'hasMore', name: 'hasMore', type: 'boolean', options: {} }
        ]
      },
      {
        id: 'data',
        name: 'data',
        type: 'array',
        options: { count: 20 },
        children: [
          {
            id: 'item',
            name: 'item',
            type: 'object',
            options: {},
            children: [
              { id: 'id', name: 'id', type: 'uuid', options: { unique: true } },
              { id: 'name', name: 'name', type: 'fullName', options: {} },
              { id: 'email', name: 'email', type: 'email', options: { unique: true } },
              { id: 'status', name: 'status', type: 'enum', options: { values: ['active', 'inactive', 'pending'] } },
              { id: 'createdAt', name: 'createdAt', type: 'datetime', options: {} }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'order-transaction',
    name: 'Order Transaction',
    description: 'E-commerce order with line items, shipping, and payment details',
    category: 'ecommerce',
    icon: 'fas fa-receipt',
    schema: [
      { id: 'orderId', name: 'orderId', type: 'alphanumeric', options: { length: 10, prefix: 'ORD-', unique: true } },
      { id: 'orderNumber', name: 'orderNumber', type: 'sequentialId', options: { start: 1001 } },
      { id: 'status', name: 'status', type: 'enum', options: { values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] } },
      {
        id: 'customer',
        name: 'customer',
        type: 'object',
        options: {},
        children: [
          { id: 'id', name: 'id', type: 'uuid', options: {} },
          { id: 'name', name: 'name', type: 'fullName', options: {} },
          { id: 'email', name: 'email', type: 'email', options: {} },
          { id: 'phone', name: 'phone', type: 'phone', options: {} }
        ]
      },
      {
        id: 'items',
        name: 'items',
        type: 'array',
        options: { count: { min: 1, max: 5 } },
        children: [
          {
            id: 'lineItem',
            name: 'lineItem',
            type: 'object',
            options: {},
            children: [
              { id: 'productId', name: 'productId', type: 'uuid', options: {} },
              { id: 'name', name: 'name', type: 'productName', options: {} },
              { id: 'sku', name: 'sku', type: 'alphanumeric', options: { length: 8 } },
              { id: 'quantity', name: 'quantity', type: 'number', options: { min: 1, max: 5, integer: true } },
              { id: 'unitPrice', name: 'unitPrice', type: 'price', options: { min: 9.99, max: 299.99 } },
              { id: 'totalPrice', name: 'totalPrice', type: 'price', options: { min: 9.99, max: 1499.95 } }
            ]
          }
        ]
      },
      {
        id: 'shipping',
        name: 'shipping',
        type: 'object',
        options: {},
        children: [
          { id: 'method', name: 'method', type: 'enum', options: { values: ['standard', 'express', 'overnight', 'pickup'] } },
          { id: 'cost', name: 'cost', type: 'price', options: { min: 0, max: 29.99 } },
          { id: 'estimatedDelivery', name: 'estimatedDelivery', type: 'future', options: { days: 14 } },
          {
            id: 'address',
            name: 'address',
            type: 'object',
            options: {},
            children: [
              { id: 'street', name: 'street', type: 'streetAddress', options: {} },
              { id: 'city', name: 'city', type: 'city', options: {} },
              { id: 'state', name: 'state', type: 'state', options: {} },
              { id: 'zipCode', name: 'zipCode', type: 'zipCode', options: {} },
              { id: 'country', name: 'country', type: 'country', options: {} }
            ]
          }
        ]
      },
      {
        id: 'payment',
        name: 'payment',
        type: 'object',
        options: {},
        children: [
          { id: 'method', name: 'method', type: 'enum', options: { values: ['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay'] } },
          { id: 'cardLast4', name: 'cardLast4', type: 'number', options: { min: 1000, max: 9999, integer: true } },
          { id: 'transactionId', name: 'transactionId', type: 'uuid', options: {} },
          { id: 'status', name: 'status', type: 'enum', options: { values: ['pending', 'completed', 'failed', 'refunded'] } }
        ]
      },
      { id: 'subtotal', name: 'subtotal', type: 'price', options: { min: 19.99, max: 999.99 } },
      { id: 'tax', name: 'tax', type: 'price', options: { min: 0, max: 99.99 } },
      { id: 'total', name: 'total', type: 'price', options: { min: 29.99, max: 1199.99 } },
      { id: 'currency', name: 'currency', type: 'constant', options: { value: 'USD' } },
      { id: 'createdAt', name: 'createdAt', type: 'past', options: { days: 30 } },
      { id: 'updatedAt', name: 'updatedAt', type: 'recent', options: {} }
    ]
  },
  {
    id: 'employee-record',
    name: 'Employee Record',
    description: 'HR employee data with department, salary, and management hierarchy',
    category: 'business',
    icon: 'fas fa-id-badge',
    schema: [
      { id: 'employeeId', name: 'employeeId', type: 'alphanumeric', options: { length: 6, prefix: 'EMP', unique: true } },
      { id: 'firstName', name: 'firstName', type: 'firstName', options: {} },
      { id: 'lastName', name: 'lastName', type: 'lastName', options: {} },
      { id: 'email', name: 'email', type: 'email', options: { unique: true } },
      { id: 'phone', name: 'phone', type: 'phone', options: {} },
      { id: 'avatar', name: 'avatar', type: 'avatar', options: {} },
      { id: 'department', name: 'department', type: 'enum', options: { values: ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Legal', 'Customer Support'] } },
      { id: 'jobTitle', name: 'jobTitle', type: 'jobTitle', options: {} },
      { id: 'level', name: 'level', type: 'enum', options: { values: ['Junior', 'Mid', 'Senior', 'Lead', 'Manager', 'Director', 'VP', 'C-Level'] } },
      {
        id: 'manager',
        name: 'manager',
        type: 'object',
        options: { nullable: 20 },
        children: [
          { id: 'id', name: 'id', type: 'uuid', options: {} },
          { id: 'name', name: 'name', type: 'fullName', options: {} },
          { id: 'email', name: 'email', type: 'email', options: {} }
        ]
      },
      {
        id: 'compensation',
        name: 'compensation',
        type: 'object',
        options: {},
        children: [
          { id: 'salary', name: 'salary', type: 'number', options: { min: 45000, max: 250000, integer: true } },
          { id: 'currency', name: 'currency', type: 'constant', options: { value: 'USD' } },
          { id: 'bonus', name: 'bonus', type: 'number', options: { min: 0, max: 50000, integer: true, nullable: 30 } },
          { id: 'equity', name: 'equity', type: 'number', options: { min: 0, max: 100000, integer: true, nullable: 50 } }
        ]
      },
      { id: 'hireDate', name: 'hireDate', type: 'past', options: { years: 10 } },
      { id: 'startDate', name: 'startDate', type: 'past', options: { years: 10 } },
      {
        id: 'location',
        name: 'location',
        type: 'object',
        options: {},
        children: [
          { id: 'office', name: 'office', type: 'enum', options: { values: ['New York', 'San Francisco', 'London', 'Berlin', 'Tokyo', 'Remote'] } },
          { id: 'timezone', name: 'timezone', type: 'timezone', options: {} }
        ]
      },
      { id: 'isRemote', name: 'isRemote', type: 'boolean', options: {} },
      { id: 'isActive', name: 'isActive', type: 'boolean', options: {} },
      { id: 'skills', name: 'skills', type: 'array', options: { count: { min: 3, max: 8 } }, children: [
        { id: 'skill', name: 'skill', type: 'word', options: {} }
      ]}
    ]
  }
];

// Quick access templates for common scenarios
export const quickTemplates = [
  { id: 'simple-user', name: 'Simple User', fields: ['id', 'name', 'email'] },
  { id: 'simple-product', name: 'Simple Product', fields: ['id', 'name', 'price', 'inStock'] },
  { id: 'simple-post', name: 'Simple Post', fields: ['id', 'title', 'content', 'author'] },
  { id: 'id-only', name: 'ID List', fields: ['id'] },
  { id: 'name-email', name: 'Name & Email', fields: ['name', 'email'] }
];

// Category metadata for UI grouping
export const templateCategories = {
  common: { name: 'Common', icon: 'fas fa-star', description: 'Most frequently used templates' },
  business: { name: 'Business', icon: 'fas fa-briefcase', description: 'HR, employee, and business data' },
  ecommerce: { name: 'E-commerce', icon: 'fas fa-shopping-bag', description: 'Products, orders, and transactions' },
  social: { name: 'Social', icon: 'fas fa-users', description: 'Blog posts, comments, and social content' },
  api: { name: 'API', icon: 'fas fa-server', description: 'API responses and data structures' }
};
