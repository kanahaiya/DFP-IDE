/**
 * JSON Unflattener Sample Templates
 */

export interface UnflattenerSample {
  id: string;
  name: string;
  description: string;
  content: string;
}

export const UNFLATTENER_SAMPLES: UnflattenerSample[] = [
  {
    id: 'simple-dot',
    name: 'Simple Dot Notation',
    description: 'Basic flattened object with dot separators',
    content: JSON.stringify({
      "name": "John Doe",
      "age": 30,
      "address.street": "123 Main St",
      "address.city": "New York",
      "address.zipcode": "10001"
    }, null, 2),
  },
  {
    id: 'array-notation',
    name: 'Array Notation',
    description: 'Flattened object with bracket array indices',
    content: JSON.stringify({
      "users[0].name": "Alice",
      "users[0].email": "alice@example.com",
      "users[1].name": "Bob",
      "users[1].email": "bob@example.com",
      "users[2].name": "Charlie",
      "users[2].email": "charlie@example.com"
    }, null, 2),
  },
  {
    id: 'mixed-complex',
    name: 'Mixed Complex',
    description: 'Complex flattened structure with mixed notation',
    content: JSON.stringify({
      "company.name": "TechCorp",
      "company.employees[0].id": 1,
      "company.employees[0].name": "Alice",
      "company.employees[0].skills[0]": "JavaScript",
      "company.employees[0].skills[1]": "React",
      "company.employees[1].id": 2,
      "company.employees[1].name": "Bob",
      "company.departments.engineering.budget": 1000000,
      "company.departments.engineering.headcount": 50
    }, null, 2),
  },
  {
    id: 'underscore-notation',
    name: 'Underscore Notation',
    description: 'Flattened with underscore separators',
    content: JSON.stringify({
      "user_profile_firstName": "Jane",
      "user_profile_lastName": "Smith",
      "user_profile_age": 28,
      "user_settings_darkMode": "true",
      "user_settings_notifications_email": "true",
      "user_settings_notifications_push": "false"
    }, null, 2),
  },
  {
    id: 'database-export',
    name: 'Database Export',
    description: 'Typical ORM/database flattened output',
    content: JSON.stringify({
      "id": 1,
      "created_at": "2024-01-15T10:30:00Z",
      "user.id": 42,
      "user.email": "john@example.com",
      "user.profile.avatar_url": "https://example.com/avatar.jpg",
      "order.items[0].product_id": 101,
      "order.items[0].quantity": 2,
      "order.items[0].price": 29.99,
      "order.items[1].product_id": 102,
      "order.items[1].quantity": 1,
      "order.items[1].price": 49.99,
      "order.total": 109.97
    }, null, 2),
  },
  {
    id: 'form-data',
    name: 'Form Data',
    description: 'HTML form serialization format',
    content: JSON.stringify({
      "user[name]": "John Doe",
      "user[email]": "john@example.com",
      "user[addresses][0][type]": "home",
      "user[addresses][0][street]": "123 Main St",
      "user[addresses][0][city]": "Boston",
      "user[addresses][1][type]": "work",
      "user[addresses][1][street]": "456 Office Ave",
      "user[addresses][1][city]": "Cambridge",
      "user[preferences][theme]": "dark",
      "user[preferences][language]": "en"
    }, null, 2),
  },
];
