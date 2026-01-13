import {
  isNumber,
  isBoolean,
  isNull,
  isDateTime,
  isDate,
  isEmail,
  isUUID,
  isURL,
  parseBoolean,
  parseNumber,
  inferAndConvertValue,
  detectFormat,
  analyzeColumn,
} from '../typeInference';
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

describe('isNumber', () => {
  it('should detect integers', () => {
    expect(isNumber('123')).toBe(true);
    expect(isNumber('0')).toBe(true);
    expect(isNumber('-456')).toBe(true);
  });

  it('should detect floats', () => {
    expect(isNumber('123.45')).toBe(true);
    expect(isNumber('0.123')).toBe(true);
    expect(isNumber('-456.789')).toBe(true);
  });

  it('should detect scientific notation', () => {
    expect(isNumber('1e10')).toBe(true);
    expect(isNumber('1.5E-3')).toBe(true);
    expect(isNumber('-2.5e+10')).toBe(true);
  });

  it('should reject non-numbers', () => {
    expect(isNumber('abc')).toBe(false);
    expect(isNumber('123abc')).toBe(false);
    expect(isNumber('')).toBe(false);
  });
});

describe('isBoolean', () => {
  it('should detect true/false', () => {
    expect(isBoolean('true')).toBe(true);
    expect(isBoolean('false')).toBe(true);
    expect(isBoolean('True')).toBe(true);
    expect(isBoolean('FALSE')).toBe(true);
  });

  it('should detect yes/no', () => {
    expect(isBoolean('yes')).toBe(true);
    expect(isBoolean('no')).toBe(true);
    expect(isBoolean('Yes')).toBe(true);
    expect(isBoolean('NO')).toBe(true);
  });

  it('should detect 1/0', () => {
    expect(isBoolean('1')).toBe(true);
    expect(isBoolean('0')).toBe(true);
  });

  it('should reject non-booleans', () => {
    expect(isBoolean('maybe')).toBe(false);
    expect(isBoolean('2')).toBe(false);
    expect(isBoolean('')).toBe(false);
  });
});

describe('isNull', () => {
  it('should detect empty strings', () => {
    expect(isNull('')).toBe(true);
    expect(isNull('   ')).toBe(true);
  });

  it('should detect null keywords', () => {
    expect(isNull('null')).toBe(true);
    expect(isNull('NULL')).toBe(true);
    expect(isNull('nil')).toBe(true);
    expect(isNull('none')).toBe(true);
  });

  it('should detect actual null/undefined', () => {
    expect(isNull(null as unknown as string)).toBe(true);
    expect(isNull(undefined as unknown as string)).toBe(true);
  });

  it('should reject non-null values', () => {
    expect(isNull('value')).toBe(false);
    expect(isNull('0')).toBe(false);
  });
});

describe('isDateTime', () => {
  it('should detect ISO 8601 date-times', () => {
    expect(isDateTime('2024-01-15T10:30:00Z')).toBe(true);
    expect(isDateTime('2024-01-15T10:30:00.123Z')).toBe(true);
    expect(isDateTime('2024-01-15T10:30:00+05:30')).toBe(true);
  });

  it('should reject invalid date-times', () => {
    expect(isDateTime('2024-13-01T10:30:00Z')).toBe(false);
    expect(isDateTime('not-a-date')).toBe(false);
    expect(isDateTime('2024-01-15')).toBe(false); // Date but not datetime
  });
});

describe('isDate', () => {
  it('should detect YYYY-MM-DD dates', () => {
    expect(isDate('2024-01-15')).toBe(true);
    expect(isDate('2000-12-31')).toBe(true);
  });

  it('should reject invalid dates', () => {
    expect(isDate('2024-13-01')).toBe(false); // Invalid month
    expect(isDate('2024-01-32')).toBe(false); // Invalid day
    expect(isDate('not-a-date')).toBe(false);
  });
});

describe('isEmail', () => {
  it('should detect valid emails', () => {
    expect(isEmail('user@example.com')).toBe(true);
    expect(isEmail('test.user@example.co.uk')).toBe(true);
    expect(isEmail('user+tag@example.com')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(isEmail('not-an-email')).toBe(false);
    expect(isEmail('@example.com')).toBe(false);
    expect(isEmail('user@')).toBe(false);
  });
});

describe('isUUID', () => {
  it('should detect valid UUIDs', () => {
    expect(isUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    expect(isUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('should reject invalid UUIDs', () => {
    expect(isUUID('not-a-uuid')).toBe(false);
    expect(isUUID('123e4567-e89b-12d3-a456')).toBe(false); // Too short
  });
});

describe('isURL', () => {
  it('should detect valid URLs', () => {
    expect(isURL('https://example.com')).toBe(true);
    expect(isURL('http://example.com/path')).toBe(true);
    expect(isURL('https://example.com/path?query=value')).toBe(true);
  });

  it('should reject invalid URLs', () => {
    expect(isURL('not-a-url')).toBe(false);
    expect(isURL('ftp://example.com')).toBe(false); // Not http(s)
    expect(isURL('example.com')).toBe(false); // No protocol
  });
});

describe('parseBoolean', () => {
  it('should parse to true', () => {
    expect(parseBoolean('true')).toBe(true);
    expect(parseBoolean('yes')).toBe(true);
    expect(parseBoolean('1')).toBe(true);
  });

  it('should parse to false', () => {
    expect(parseBoolean('false')).toBe(false);
    expect(parseBoolean('no')).toBe(false);
    expect(parseBoolean('0')).toBe(false);
  });
});

describe('parseNumber', () => {
  it('should parse integers', () => {
    expect(parseNumber('123')).toBe(123);
    expect(parseNumber('-456')).toBe(-456);
  });

  it('should parse floats', () => {
    expect(parseNumber('123.45')).toBe(123.45);
    expect(parseNumber('-456.789')).toBe(-456.789);
  });

  it('should parse scientific notation', () => {
    expect(parseNumber('1e10')).toBe(1e10);
    expect(parseNumber('1.5E-3')).toBe(1.5e-3);
  });
});

describe('inferAndConvertValue', () => {
  it('should convert numbers when enabled', () => {
    expect(inferAndConvertValue('123', defaultSettings)).toBe(123);
    expect(inferAndConvertValue('45.67', defaultSettings)).toBe(45.67);
  });

  it('should keep numbers as strings when disabled', () => {
    const settings = { ...defaultSettings, parseNumbers: false };
    expect(inferAndConvertValue('123', settings)).toBe('123');
  });

  it('should convert booleans when enabled', () => {
    expect(inferAndConvertValue('true', defaultSettings)).toBe(true);
    expect(inferAndConvertValue('false', defaultSettings)).toBe(false);
  });

  it('should convert null when enabled', () => {
    expect(inferAndConvertValue('', defaultSettings)).toBe(null);
    expect(inferAndConvertValue('null', defaultSettings)).toBe(null);
  });

  it('should preserve dates as ISO strings', () => {
    expect(inferAndConvertValue('2024-01-15', defaultSettings)).toBe('2024-01-15');
    expect(inferAndConvertValue('2024-01-15T10:30:00Z', defaultSettings)).toBe('2024-01-15T10:30:00Z');
  });

  it('should return non-string values as-is', () => {
    expect(inferAndConvertValue(123, defaultSettings)).toBe(123);
    expect(inferAndConvertValue(true, defaultSettings)).toBe(true);
  });
});

describe('detectFormat', () => {
  it('should detect email format', () => {
    expect(detectFormat('user@example.com')).toBe('email');
  });

  it('should detect UUID format', () => {
    expect(detectFormat('123e4567-e89b-12d3-a456-426614174000')).toBe('uuid');
  });

  it('should detect URL format', () => {
    expect(detectFormat('https://example.com')).toBe('uri');
  });

  it('should detect date-time format', () => {
    expect(detectFormat('2024-01-15T10:30:00Z')).toBe('date-time');
  });

  it('should detect date format', () => {
    expect(detectFormat('2024-01-15')).toBe('date');
  });

  it('should return undefined for no format', () => {
    expect(detectFormat('regular string')).toBeUndefined();
  });
});

describe('analyzeColumn', () => {
  it('should identify number column', () => {
    const result = analyzeColumn(['123', '456', '789']);
    expect(result.type).toBe('number');
  });

  it('should identify boolean column', () => {
    const result = analyzeColumn(['true', 'false', 'yes', 'no']);
    expect(result.type).toBe('boolean');
  });

  it('should identify null column', () => {
    const result = analyzeColumn(['', 'null', '', 'NULL']);
    expect(result.type).toBe('null');
    expect(result.nullable).toBe(true);
  });

  it('should identify mixed column', () => {
    const result = analyzeColumn(['123', 'abc', 'true']);
    expect(result.type).toBe('mixed');
  });

  it('should detect email format in column', () => {
    const result = analyzeColumn(['user1@example.com', 'user2@example.com']);
    expect(result.format).toBe('email');
  });

  it('should handle nullable columns', () => {
    const result = analyzeColumn(['123', '456', null, '789']);
    expect(result.nullable).toBe(true);
  });
});
