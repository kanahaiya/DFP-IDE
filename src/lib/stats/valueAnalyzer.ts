/**
 * Value analysis for JSON Stats tool
 */

import type {
  ValueAnalysis,
  StringStats,
  NumberStats,
  ArrayStats,
  JsonValue,
} from './types';
import { isPlainObject, isArray } from './types';

/**
 * Analyze values in JSON data
 */
export function analyzeValues(data: JsonValue): ValueAnalysis {
  const context = {
    strings: [] as string[],
    numbers: [] as number[],
    arrays: [] as JsonValue[][],
    booleans: { trueCount: 0, falseCount: 0 },
    nullCount: 0,
  };
  
  // Collect all values
  collectValues(data, context);
  
  return {
    strings: analyzeStrings(context.strings),
    numbers: analyzeNumbers(context.numbers),
    arrays: analyzeArrays(context.arrays),
    booleans: {
      count: context.booleans.trueCount + context.booleans.falseCount,
      trueCount: context.booleans.trueCount,
      falseCount: context.booleans.falseCount,
    },
    nulls: {
      count: context.nullCount,
    },
  };
}

/**
 * Recursively collect all values
 */
function collectValues(
  value: JsonValue,
  context: {
    strings: string[];
    numbers: number[];
    arrays: JsonValue[][];
    booleans: { trueCount: number; falseCount: number };
    nullCount: number;
  }
): void {
  if (value === null) {
    context.nullCount++;
    return;
  }
  
  if (typeof value === 'string') {
    context.strings.push(value);
    return;
  }
  
  if (typeof value === 'number') {
    context.numbers.push(value);
    return;
  }
  
  if (typeof value === 'boolean') {
    if (value) {
      context.booleans.trueCount++;
    } else {
      context.booleans.falseCount++;
    }
    return;
  }
  
  if (isArray(value)) {
    context.arrays.push(value);
    for (const item of value) {
      collectValues(item, context);
    }
    return;
  }
  
  if (isPlainObject(value)) {
    for (const val of Object.values(value)) {
      collectValues(val, context);
    }
  }
}

/**
 * Analyze string values
 */
function analyzeStrings(strings: string[]): StringStats {
  if (strings.length === 0) {
    return {
      count: 0,
      minLength: 0,
      maxLength: 0,
      averageLength: 0,
      emptyCount: 0,
      urlCount: 0,
      emailCount: 0,
      dateCount: 0,
    };
  }
  
  const lengths = strings.map(s => s.length);
  const urlRegex = /^https?:\/\//i;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/;
  
  return {
    count: strings.length,
    minLength: Math.min(...lengths),
    maxLength: Math.max(...lengths),
    averageLength: Math.round((lengths.reduce((a, b) => a + b, 0) / lengths.length) * 10) / 10,
    emptyCount: strings.filter(s => s === '').length,
    urlCount: strings.filter(s => urlRegex.test(s)).length,
    emailCount: strings.filter(s => emailRegex.test(s)).length,
    dateCount: strings.filter(s => dateRegex.test(s)).length,
  };
}

/**
 * Analyze number values
 */
function analyzeNumbers(numbers: number[]): NumberStats {
  if (numbers.length === 0) {
    return {
      count: 0,
      min: 0,
      max: 0,
      average: 0,
      sum: 0,
      integerCount: 0,
      floatCount: 0,
      negativeCount: 0,
    };
  }
  
  const sum = numbers.reduce((a, b) => a + b, 0);
  
  return {
    count: numbers.length,
    min: Math.min(...numbers),
    max: Math.max(...numbers),
    average: Math.round((sum / numbers.length) * 100) / 100,
    sum: Math.round(sum * 100) / 100,
    integerCount: numbers.filter(n => Number.isInteger(n)).length,
    floatCount: numbers.filter(n => !Number.isInteger(n)).length,
    negativeCount: numbers.filter(n => n < 0).length,
  };
}

/**
 * Analyze array values
 */
function analyzeArrays(arrays: JsonValue[][]): ArrayStats {
  if (arrays.length === 0) {
    return {
      count: 0,
      minLength: 0,
      maxLength: 0,
      averageLength: 0,
      emptyCount: 0,
      totalElements: 0,
    };
  }
  
  const lengths = arrays.map(a => a.length);
  const totalElements = lengths.reduce((a, b) => a + b, 0);
  
  return {
    count: arrays.length,
    minLength: Math.min(...lengths),
    maxLength: Math.max(...lengths),
    averageLength: Math.round((totalElements / arrays.length) * 10) / 10,
    emptyCount: arrays.filter(a => a.length === 0).length,
    totalElements,
  };
}

/**
 * Get all unique string values
 */
export function getUniqueStrings(data: JsonValue): string[] {
  const strings = new Set<string>();
  
  function collect(value: JsonValue): void {
    if (typeof value === 'string') {
      strings.add(value);
    } else if (isArray(value)) {
      value.forEach(collect);
    } else if (isPlainObject(value)) {
      Object.values(value).forEach(collect);
    }
  }
  
  collect(data);
  return Array.from(strings);
}

/**
 * Get number range information
 */
export function getNumberRange(data: JsonValue): { min: number; max: number; range: number } | null {
  const numbers: number[] = [];
  
  function collect(value: JsonValue): void {
    if (typeof value === 'number') {
      numbers.push(value);
    } else if (isArray(value)) {
      value.forEach(collect);
    } else if (isPlainObject(value)) {
      Object.values(value).forEach(collect);
    }
  }
  
  collect(data);
  
  if (numbers.length === 0) return null;
  
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  
  return {
    min,
    max,
    range: max - min,
  };
}

/**
 * Find values at specific paths
 */
export function getValuesAtPath(data: JsonValue, pathPattern: string): JsonValue[] {
  const values: JsonValue[] = [];
  const pathParts = pathPattern.split('.');
  
  function traverse(value: JsonValue, pathIndex: number): void {
    if (pathIndex >= pathParts.length) {
      values.push(value);
      return;
    }
    
    const part = pathParts[pathIndex];
    
    if (part === '*') {
      if (isArray(value)) {
        value.forEach(item => traverse(item, pathIndex + 1));
      } else if (isPlainObject(value)) {
        Object.values(value).forEach(v => traverse(v, pathIndex + 1));
      }
    } else if (isPlainObject(value) && part in value) {
      traverse(value[part], pathIndex + 1);
    } else if (isArray(value)) {
      const index = parseInt(part, 10);
      if (!isNaN(index) && index >= 0 && index < value.length) {
        traverse(value[index], pathIndex + 1);
      }
    }
  }
  
  traverse(data, 0);
  return values;
}
