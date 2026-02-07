/**
 * Sample encoded strings for the JSON Decoder tool
 */

export interface DecoderSample {
  id: string;
  name: string;
  description: string;
  content: string;
}

export const DECODER_SAMPLES: DecoderSample[] = [
  {
    id: 'url-encoded',
    name: 'URL Encoded JSON',
    description: 'Standard URL/percent encoded JSON',
    content: '%7B%22name%22%3A%22John%20Doe%22%2C%22email%22%3A%22john%40example.com%22%2C%22age%22%3A30%7D',
  },
  {
    id: 'url-double',
    name: 'Double URL Encoded',
    description: 'JSON encoded twice with URL encoding',
    content: '%257B%2522name%2522%253A%2522test%2522%257D',
  },
  {
    id: 'base64-standard',
    name: 'Base64 Encoded',
    description: 'Standard Base64 encoded JSON',
    content: 'eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJhZ2UiOjMwfQ==',
  },
  {
    id: 'base64-urlsafe',
    name: 'Base64 URL-Safe',
    description: 'URL-safe Base64 without padding (JWT style)',
    content: 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
  },
  {
    id: 'hex-encoded',
    name: 'Hex Encoded',
    description: 'Hexadecimal byte representation',
    content: '7b226e616d65223a224a6f686e222c2261676522 3a33307d',
  },
  {
    id: 'hex-prefixed',
    name: 'Hex with 0x Prefix',
    description: 'Hex encoded with 0x prefix per byte',
    content: '0x7b 0x22 0x6e 0x61 0x6d 0x65 0x22 0x3a 0x22 0x41 0x22 0x7d',
  },
  {
    id: 'escaped-json',
    name: 'Escaped JSON String',
    description: 'Double-escaped JSON string',
    content: '"{\\\"name\\\":\\\"John Doe\\\",\\\"email\\\":\\\"john@example.com\\\"}"',
  },
  {
    id: 'triple-escaped',
    name: 'Triple Escaped',
    description: 'Triple-escaped JSON string from logs',
    content: '\\"\\\\\\"name\\\\\\":\\\\\\"test\\\\\\"\\"',
  },
  {
    id: 'html-entities',
    name: 'HTML Entity Encoded',
    description: 'JSON with HTML numeric entities',
    content: '&#123;&#34;name&#34;&#58;&#34;John&#34;&#44;&#34;value&#34;&#58;&#60;test&#62;&#125;',
  },
  {
    id: 'unicode-escaped',
    name: 'Unicode Escaped',
    description: 'JSON with Unicode escape sequences',
    content: '{"name":"\\u004a\\u006f\\u0068\\u006e","city":"\\u4e1c\\u4eac"}',
  },
  {
    id: 'mixed-encoding',
    name: 'Mixed Encoding',
    description: 'URL encoded containing Unicode escapes',
    content: '%7B%22message%22%3A%22%5Cu0048%5Cu0065%5Cu006C%5Cu006C%5Cu006F%22%7D',
  },
  {
    id: 'api-response',
    name: 'Encoded API Response',
    description: 'URL encoded API response with nested data',
    content: '%7B%22status%22%3A%22success%22%2C%22data%22%3A%7B%22users%22%3A%5B%7B%22id%22%3A1%2C%22name%22%3A%22Alice%22%7D%2C%7B%22id%22%3A2%2C%22name%22%3A%22Bob%22%7D%5D%7D%7D',
  },
];
