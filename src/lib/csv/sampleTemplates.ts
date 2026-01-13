/**
 * Sample CSV templates for users to try
 * Based on PRD Appendix test cases
 */

export interface CSVTemplate {
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  content: string;
}

export const csvSampleTemplates: CSVTemplate[] = [
  {
    name: 'Simple CSV',
    description: 'Basic CSV with headers and common data types',
    icon: 'fas fa-table',
    iconColor: '#58A6FF',
    content: `name,age,city
John Doe,30,New York
Jane Smith,25,Los Angeles
Bob Johnson,35,Chicago`,
  },
  {
    name: 'CSV with Quotes',
    description: 'CSV handling quotes and commas within values',
    icon: 'fas fa-quote-right',
    iconColor: '#3FB950',
    content: `name,address,phone
"Smith, John","123 Main St, Apt 4","555-1234"
"Doe, Jane","456 Oak Ave","555-5678"
"Johnson, Bob","789 Pine Rd, Suite 10","555-9012"`,
  },
  {
    name: 'Product Catalog',
    description: 'E-commerce product data with pricing and inventory',
    icon: 'fas fa-shopping-bag',
    iconColor: '#D29922',
    content: `product_id,name,price,in_stock,quantity,category
PROD-001,Wireless Mouse,29.99,true,150,Electronics
PROD-002,USB Cable,9.99,true,500,Accessories
PROD-003,Laptop Stand,49.99,false,0,Office
PROD-004,Keyboard,79.99,true,75,Electronics`,
  },
  {
    name: 'User Data',
    description: 'User information with emails and dates',
    icon: 'fas fa-users',
    iconColor: '#A371F7',
    content: `user_id,name,email,signup_date,is_active
1001,Alice Wonder,alice@example.com,2024-01-15,true
1002,Bob Builder,bob@example.com,2024-02-20,true
1003,Charlie Brown,charlie@example.com,2024-03-10,false
1004,Diana Prince,diana@example.com,2024-04-05,true`,
  },
  {
    name: 'Nested Structure',
    description: 'CSV with dot notation for nested JSON objects',
    icon: 'fas fa-sitemap',
    iconColor: '#F85149',
    content: `person.name,person.age,address.city,address.zip,address.country
John Smith,30,New York,10001,USA
Jane Doe,25,Los Angeles,90001,USA
Bob Wilson,35,Chicago,60601,USA`,
  },
  {
    name: 'Sales Data',
    description: 'Transaction records with amounts and dates',
    icon: 'fas fa-chart-line',
    iconColor: '#3FB950',
    content: `transaction_id,date,customer,product,amount,quantity,status
TXN-001,2024-01-15T10:30:00Z,Alice,Laptop,1299.99,1,completed
TXN-002,2024-01-16T14:20:00Z,Bob,Mouse,29.99,2,completed
TXN-003,2024-01-17T09:15:00Z,Charlie,Keyboard,79.99,1,pending
TXN-004,2024-01-18T16:45:00Z,Diana,Monitor,399.99,1,completed`,
  },
  {
    name: 'CSV without Headers',
    description: 'Data rows without header row (headerless CSV)',
    icon: 'fas fa-file-alt',
    iconColor: '#58A6FF',
    content: `John,30,Developer,New York
Jane,25,Designer,Los Angeles
Mike,35,Manager,Chicago
Sarah,28,Analyst,Boston`,
  },
  {
    name: 'Mixed Data Types',
    description: 'CSV with various data types and null values',
    icon: 'fas fa-database',
    iconColor: '#D29922',
    content: `id,name,value,flag,notes,url
1,Item A,123.45,true,Sample note,https://example.com
2,Item B,null,false,,https://example.org
3,Item C,0,yes,Another note,
4,Item D,999.99,no,Final item,https://example.net`,
  },
  {
    name: 'Semicolon Delimited',
    description: 'CSV using semicolon as delimiter (European format)',
    icon: 'fas fa-globe',
    iconColor: '#A371F7',
    content: `name;country;population;capital;language
France;Europe;67000000;Paris;French
Germany;Europe;83000000;Berlin;German
Italy;Europe;60000000;Rome;Italian
Spain;Europe;47000000;Madrid;Spanish`,
  },
  {
    name: 'Tab Delimited (TSV)',
    description: 'Tab-separated values format',
    icon: 'fas fa-indent',
    iconColor: '#F85149',
    content: `name\tage\tdepartment\tsalary
Alice Johnson\t28\tEngineering\t95000
Bob Smith\t35\tMarketing\t85000
Carol White\t42\tManagement\t120000
David Lee\t31\tDesign\t78000`,
  },
];

/**
 * Get sample template by name
 */
export function getSampleByName(name: string): CSVTemplate | undefined {
  return csvSampleTemplates.find(template => template.name === name);
}

/**
 * Get default sample template
 */
export function getDefaultSample(): CSVTemplate {
  return csvSampleTemplates[0];
}
