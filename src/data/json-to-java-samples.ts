/**
 * Sample templates for JSON to Java converter
 */

export interface SampleTemplate {
  name: string;
  description: string;
  content: string;
}

export const jsonToJavaSamples: SampleTemplate[] = [
  {
    name: 'User Model',
    description: 'Simple user with profile data',
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
    name: 'API Response',
    description: 'REST API response with pagination',
    content: JSON.stringify({
      "success": true,
      "message": "Data retrieved successfully",
      "data": {
        "items": [
          { "id": 1, "name": "Item 1", "price": 19.99 },
          { "id": 2, "name": "Item 2", "price": 29.99 }
        ],
        "total": 100,
        "page": 1,
        "pageSize": 10
      }
    }, null, 2)
  },
  {
    name: 'Order',
    description: 'E-commerce order with line items',
    content: JSON.stringify({
      "orderId": "ORD-12345",
      "customerId": 456,
      "orderDate": "2024-01-15",
      "status": "shipped",
      "lineItems": [
        {
          "productId": 101,
          "productName": "Widget",
          "quantity": 2,
          "unitPrice": 15.99
        }
      ],
      "shippingAddress": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001"
      },
      "total": 31.98
    }, null, 2)
  },
  {
    name: 'Configuration',
    description: 'Application configuration settings',
    content: JSON.stringify({
      "appName": "MyApp",
      "version": "1.0.0",
      "database": {
        "host": "localhost",
        "port": 5432,
        "name": "mydb",
        "maxConnections": 10
      },
      "features": {
        "enableCache": true,
        "enableLogging": true,
        "logLevel": "INFO"
      }
    }, null, 2)
  },
  {
    name: 'Employee',
    description: 'Employee with department info',
    content: JSON.stringify({
      "employeeId": "EMP001",
      "name": "Jane Smith",
      "email": "jane.smith@company.com",
      "salary": 75000.00,
      "department": {
        "id": 10,
        "name": "Engineering",
        "manager": "Bob Johnson"
      },
      "skills": ["Java", "Spring Boot", "PostgreSQL"],
      "hireDate": "2022-03-15"
    }, null, 2)
  },
];
