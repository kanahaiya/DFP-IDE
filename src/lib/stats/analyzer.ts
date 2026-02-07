/**
 * Main JSON analyzer that combines all analysis modules
 */

import type { JsonStats, JsonValue, SizeMetrics } from './types';
import { analyzeStructure } from './structureAnalyzer';
import { analyzeTypes } from './typeAnalyzer';
import { analyzeKeys } from './keyAnalyzer';
import { analyzeValues } from './valueAnalyzer';
import { analyzeQuality } from './qualityAnalyzer';

/**
 * Get byte size of string (UTF-8)
 */
function getByteSize(input: string): number {
  return new Blob([input]).size;
}

/**
 * Format byte size to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  if (i === 0) return `${bytes} B`;
  
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${units[i]}`;
}

/**
 * Calculate size metrics for JSON string
 */
function calculateSizeMetrics(input: string, minifiedInput: string): SizeMetrics {
  const bytes = getByteSize(input);
  const minifiedBytes = getByteSize(minifiedInput);
  
  return {
    bytes,
    characters: input.length,
    lines: input.split('\n').length,
    bytesFormatted: formatBytes(bytes),
    minifiedBytes,
    minifiedFormatted: formatBytes(minifiedBytes),
  };
}

/**
 * Analyze JSON string and return complete statistics
 */
export function analyzeJSON(input: string): JsonStats {
  const startTime = performance.now();
  
  // Handle empty input
  if (!input || input.trim() === '') {
    return createEmptyStats('Input is empty');
  }
  
  // Parse JSON
  let data: JsonValue;
  try {
    data = JSON.parse(input);
  } catch (error) {
    return createEmptyStats((error as Error).message);
  }
  
  // Get minified version for size comparison
  const minifiedInput = JSON.stringify(data);
  
  // Run all analyzers
  const size = calculateSizeMetrics(input, minifiedInput);
  const structure = analyzeStructure(data);
  const types = analyzeTypes(data);
  const keys = analyzeKeys(data);
  const values = analyzeValues(data);
  const quality = analyzeQuality(data);
  
  const processingTime = performance.now() - startTime;
  
  return {
    size,
    structure,
    types,
    keys,
    values,
    quality,
    processingTime: Math.round(processingTime * 100) / 100,
    isValid: true,
  };
}

/**
 * Create empty stats object for error cases
 */
function createEmptyStats(error: string): JsonStats {
  return {
    size: {
      bytes: 0,
      characters: 0,
      lines: 0,
      bytesFormatted: '0 B',
      minifiedBytes: 0,
      minifiedFormatted: '0 B',
    },
    structure: {
      maxDepth: 0,
      totalObjects: 0,
      totalArrays: 0,
      totalKeys: 0,
      totalValues: 0,
      rootType: 'object',
      isHomogeneous: false,
    },
    types: {
      counts: [],
      totalValues: 0,
      mostCommon: 'object',
      leastCommon: 'object',
    },
    keys: {
      uniqueKeys: 0,
      totalKeyInstances: 0,
      duplicateKeys: [],
      longestKey: '',
      shortestKey: '',
      averageKeyLength: 0,
      topKeys: [],
      caseVariations: [],
    },
    values: {
      strings: {
        count: 0,
        minLength: 0,
        maxLength: 0,
        averageLength: 0,
        emptyCount: 0,
        urlCount: 0,
        emailCount: 0,
        dateCount: 0,
      },
      numbers: {
        count: 0,
        min: 0,
        max: 0,
        average: 0,
        sum: 0,
        integerCount: 0,
        floatCount: 0,
        negativeCount: 0,
      },
      arrays: {
        count: 0,
        minLength: 0,
        maxLength: 0,
        averageLength: 0,
        emptyCount: 0,
        totalElements: 0,
      },
      booleans: {
        count: 0,
        trueCount: 0,
        falseCount: 0,
      },
      nulls: {
        count: 0,
      },
    },
    quality: {
      score: 0,
      issues: [],
      nullCount: 0,
      emptyStringCount: 0,
      emptyArrayCount: 0,
      emptyObjectCount: 0,
      inconsistentTypes: [],
      suggestions: ['Please provide valid JSON to analyze.'],
    },
    processingTime: 0,
    isValid: false,
    error,
  };
}

/**
 * Quick validation check without full analysis
 */
export function validateJSON(input: string): { isValid: boolean; error?: string } {
  if (!input || input.trim() === '') {
    return { isValid: false, error: 'Input is empty' };
  }
  
  try {
    JSON.parse(input);
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: (error as Error).message };
  }
}

/**
 * Analyze only specific aspects for performance
 */
export function analyzePartial(
  input: string,
  aspects: ('size' | 'structure' | 'types' | 'keys' | 'values' | 'quality')[]
): Partial<JsonStats> {
  // Parse JSON
  let data: JsonValue;
  try {
    data = JSON.parse(input);
  } catch {
    return { isValid: false };
  }
  
  const result: Partial<JsonStats> = { isValid: true };
  const minifiedInput = JSON.stringify(data);
  
  if (aspects.includes('size')) {
    result.size = calculateSizeMetrics(input, minifiedInput);
  }
  
  if (aspects.includes('structure')) {
    result.structure = analyzeStructure(data);
  }
  
  if (aspects.includes('types')) {
    result.types = analyzeTypes(data);
  }
  
  if (aspects.includes('keys')) {
    result.keys = analyzeKeys(data);
  }
  
  if (aspects.includes('values')) {
    result.values = analyzeValues(data);
  }
  
  if (aspects.includes('quality')) {
    result.quality = analyzeQuality(data);
  }
  
  return result;
}
