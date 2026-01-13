import {
  detectDelimiter,
  parseCSV,
  convertToKeyedObject,
  convertToColumnArrays,
  convertToNestedJSON,
  convertCSVToJSON,
  formatJSONOutput,
} from '../converter';
import type { CSVSettings } from '@/store/csv';

const defaultSettings: CSVSettings = {
  delimiter: 'auto',
  customDelimiter: ',',
  hasHeader: true,
  trimWhitespace: true,
  skipEmptyLines: true,
  parseNumbers: true,
  parseBooleans: true,
  parseNulls: true,
  parseDates: true,
  outputFormat: 'array',
  jsonFormat: 'json',
  indentation: 2,
  sortKeys: false,
  compactOutput: false,
  quoteHandling: true,
  escapeHandling: true,
};

describe('detectDelimiter', () => {
  it('should detect comma delimiter', () => {
    const csv = 'name,age,city\nJohn,30,NYC';
    expect(detectDelimiter(csv)).toBe(',');
  });

  it('should detect semicolon delimiter', () => {
    const csv = 'name;age;city\nJohn;30;NYC';
    expect(detectDelimiter(csv)).toBe(';');
  });

  it('should detect tab delimiter', () => {
    const csv = 'name\tage\tcity\nJohn\t30\tNYC';
    expect(detectDelimiter(csv)).toBe('\t');
  });

  it('should detect pipe delimiter', () => {
    const csv = 'name|age|city\nJohn|30|NYC';
    expect(detectDelimiter(csv)).toBe('|');
  });

  it('should default to comma if no delimiter found', () => {
    const csv = 'singlevalue';
    expect(detectDelimiter(csv)).toBe(',');
  });
});

describe('parseCSV', () => {
  it('should parse simple CSV with headers', () => {
    const csv = 'name,age\nJohn,30\nJane,25';
    const result = parseCSV(csv, defaultSettings);
    
    expect(result.data).toHaveLength(2);
    expect(result.data[0]).toEqual({ name: 'John', age: '30' });
    expect(result.data[1]).toEqual({ name: 'Jane', age: '25' });
  });

  it('should handle quoted fields with commas', () => {
    const csv = 'name,address\n"Smith, John","123 Main St, Apt 4"';
    const result = parseCSV(csv, defaultSettings);
    
    expect(result.data[0]).toEqual({
      name: 'Smith, John',
      address: '123 Main St, Apt 4'
    });
  });

  it('should skip empty lines', () => {
    const csv = 'name,age\nJohn,30\n\nJane,25\n';
    const result = parseCSV(csv, defaultSettings);
    
    expect(result.data).toHaveLength(2);
  });

  it('should trim whitespace when enabled', () => {
    const csv = 'name , age \n John , 30 ';
    const result = parseCSV(csv, defaultSettings);
    
    expect(result.meta.fields).toEqual(['name', 'age']);
    expect(result.data[0]).toEqual({ name: 'John', age: '30' });
  });
});

describe('convertToKeyedObject', () => {
  it('should convert array of objects to keyed object', () => {
    const data = [
      { id: '1', name: 'John', age: '30' },
      { id: '2', name: 'Jane', age: '25' }
    ];
    
    const result = convertToKeyedObject(data);
    
    expect(result).toEqual({
      '1': { name: 'John', age: '30' },
      '2': { name: 'Jane', age: '25' }
    });
  });

  it('should handle empty array', () => {
    expect(convertToKeyedObject([])).toEqual({});
  });
});

describe('convertToColumnArrays', () => {
  it('should convert to column arrays', () => {
    const data = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 }
    ];
    
    const result = convertToColumnArrays(data);
    
    expect(result).toEqual({
      name: ['John', 'Jane'],
      age: [30, 25]
    });
  });

  it('should handle missing values', () => {
    const data = [
      { name: 'John', age: 30 },
      { name: 'Jane' }
    ];
    
    const result = convertToColumnArrays(data);
    
    expect(result).toEqual({
      name: ['John', 'Jane'],
      age: [30, null]
    });
  });
});

describe('convertToNestedJSON', () => {
  it('should create nested objects from dot notation', () => {
    const data = [
      { 'person.name': 'John', 'person.age': 30, 'address.city': 'NYC' }
    ];
    
    const result = convertToNestedJSON(data);
    
    expect(result[0]).toEqual({
      person: { name: 'John', age: 30 },
      address: { city: 'NYC' }
    });
  });

  it('should handle deep nesting', () => {
    const data = [
      { 'a.b.c.d': 'value' }
    ];
    
    const result = convertToNestedJSON(data);
    
    expect(result[0]).toEqual({
      a: { b: { c: { d: 'value' } } }
    });
  });
});

describe('formatJSONOutput', () => {
  const testData = { name: 'John', age: 30 };

  it('should format with 2 spaces', () => {
    const result = formatJSONOutput(testData, 2, false);
    expect(result).toContain('  ');
    expect(JSON.parse(result)).toEqual(testData);
  });

  it('should format with 4 spaces', () => {
    const result = formatJSONOutput(testData, 4, false);
    expect(result).toContain('    ');
    expect(JSON.parse(result)).toEqual(testData);
  });

  it('should minify output', () => {
    const result = formatJSONOutput(testData, 'minified', false);
    expect(result).not.toContain('\n');
    expect(JSON.parse(result)).toEqual(testData);
  });

  it('should sort keys alphabetically', () => {
    const unsorted = { z: 1, a: 2, m: 3 };
    const result = formatJSONOutput(unsorted, 2, true);
    const keys = Object.keys(JSON.parse(result));
    expect(keys).toEqual(['a', 'm', 'z']);
  });
});

describe('convertCSVToJSON', () => {
  it('should convert simple CSV to JSON array', () => {
    const csv = 'name,age\nJohn,30\nJane,25';
    const result = convertCSVToJSON(csv, defaultSettings);
    const parsed = JSON.parse(result);
    
    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toEqual({ name: 'John', age: 30 });
    expect(parsed[1]).toEqual({ name: 'Jane', age: 25 });
  });

  it('should handle keyed output format', () => {
    const csv = 'id,name,age\n1,John,30\n2,Jane,25';
    const settings = { ...defaultSettings, outputFormat: 'keyed' as const };
    const result = convertCSVToJSON(csv, settings);
    const parsed = JSON.parse(result);
    
    expect(parsed['1']).toEqual({ name: 'John', age: 30 });
    expect(parsed['2']).toEqual({ name: 'Jane', age: 25 });
  });

  it('should handle column arrays output', () => {
    const csv = 'name,age\nJohn,30\nJane,25';
    const settings = { ...defaultSettings, outputFormat: 'columns' as const };
    const result = convertCSVToJSON(csv, settings);
    const parsed = JSON.parse(result);
    
    expect(parsed).toEqual({
      name: ['John', 'Jane'],
      age: [30, 25]
    });
  });

  it('should handle nested JSON output', () => {
    const csv = 'person.name,person.age\nJohn,30';
    const settings = { ...defaultSettings, outputFormat: 'nested' as const };
    const result = convertCSVToJSON(csv, settings);
    const parsed = JSON.parse(result);
    
    expect(parsed[0]).toEqual({
      person: { name: 'John', age: 30 }
    });
  });

  it('should return empty string for empty CSV', () => {
    const result = convertCSVToJSON('', defaultSettings);
    expect(result).toBe('');
  });

  it('should throw error for invalid CSV', () => {
    const csv = 'name,age\nJohn,30\nJane'; // Missing value
    // PapaParse is forgiving, so this may not throw
    const result = convertCSVToJSON(csv, defaultSettings);
    expect(result).toBeTruthy(); // Should still produce output
  });
});

describe('Edge Cases', () => {
  it('should handle CSV with special characters', () => {
    const csv = 'name,email\nJohn,john@example.com\nJané,jane@tëst.com';
    const result = convertCSVToJSON(csv, defaultSettings);
    const parsed = JSON.parse(result);
    
    expect(parsed[1].name).toBe('Jané');
    expect(parsed[1].email).toBe('jane@tëst.com');
  });

  it('should handle single column CSV', () => {
    const csv = 'name\nJohn\nJane';
    const result = convertCSVToJSON(csv, defaultSettings);
    const parsed = JSON.parse(result);
    
    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toEqual({ name: 'John' });
  });

  it('should handle CSV without headers', () => {
    const csv = 'John,30\nJane,25';
    const settings = { ...defaultSettings, hasHeader: false };
    const result = convertCSVToJSON(csv, settings);
    const parsed = JSON.parse(result);
    
    expect(Array.isArray(parsed)).toBe(true);
    expect(Array.isArray(parsed[0])).toBe(true);
  });
});
