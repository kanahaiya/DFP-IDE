'use client';

import { useState, useEffect, useMemo } from 'react';
import type { ValidationResult, ValidationError } from '@/types';

/**
 * Custom hook for JSON validation with debouncing
 * Provides real-time validation feedback for JSON input
 */
export function useJSONValidation(
  jsonString: string,
  debounceMs: number = 500
): ValidationResult {
  const [debouncedJSON, setDebouncedJSON] = useState(jsonString);

  // Debounce the JSON string to avoid excessive validation
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedJSON(jsonString);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [jsonString, debounceMs]);

  // Perform validation on debounced value
  const validationResult = useMemo((): ValidationResult => {
    // Empty string is considered valid (no errors to show)
    if (!debouncedJSON || debouncedJSON.trim().length === 0) {
      return {
        isValid: true,
        errors: [],
        warnings: [],
      };
    }

    const errors: ValidationError[] = [];

    try {
      // Attempt to parse JSON
      JSON.parse(debouncedJSON);

      // If parsing succeeds, JSON is valid
      // NOTE: Avoid naive "comment/trailing comma" regex warnings here because they can
      // false-positive on content inside JSON strings (e.g. "https://example.com").
      // JSON.parse() already handles all validation properly.

      return {
        isValid: true,
        errors: [],
        warnings: [],
      };
    } catch (error) {
      // Parse the error message to extract line and column information
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
      
      // Try to extract line/column from error message
      // Common patterns: "at position X", "line Y column Z", etc.
      const positionMatch = errorMessage.match(/position\s+(\d+)/i);
      const lineColMatch = errorMessage.match(/line\s+(\d+)\s+column\s+(\d+)/i);
      const unexpectedTokenMatch = errorMessage.match(/Unexpected token (.) in JSON at position (\d+)/i);
      
      let line = 1;
      let column = 1;
      let message = errorMessage;

      if (lineColMatch) {
        line = parseInt(lineColMatch[1], 10);
        column = parseInt(lineColMatch[2], 10);
      } else if (positionMatch || unexpectedTokenMatch) {
        // Calculate line and column from position
        const position = positionMatch 
          ? parseInt(positionMatch[1], 10)
          : (unexpectedTokenMatch ? parseInt(unexpectedTokenMatch[2], 10) : 0);
        
        const textBeforeError = debouncedJSON.substring(0, position);
        const lines = textBeforeError.split('\n');
        line = lines.length;
        column = lines[lines.length - 1].length + 1;
        
        if (unexpectedTokenMatch) {
          const token = unexpectedTokenMatch[1];
          message = `Unexpected token '${token}' at line ${line}, column ${column}`;
        }
      }

      // Provide helpful error messages
      if (message.includes('Unexpected token')) {
        const token = message.match(/Unexpected token (.)/)?.[1];
        if (token === '{' || token === '[') {
          message = `${message}. Check for missing quotes around property names or values.`;
        } else if (token === '}' || token === ']') {
          message = `${message}. Check for trailing commas or extra closing brackets.`;
        } else if (token === ',') {
          message = `${message}. Check for trailing commas or missing values.`;
        }
      } else if (message.includes('Unexpected end of JSON input')) {
        message = 'Unexpected end of JSON. Check for unclosed brackets, braces, or quotes.';
      } else if (message.includes('Unexpected string') || message.includes('Expected property name')) {
        message = `${message}. Property names must be enclosed in double quotes.`;
      }

      errors.push({
        line,
        column,
        message,
        severity: 'error',
      });

      return {
        isValid: false,
        errors,
        warnings: [],
      };
    }
  }, [debouncedJSON]);

  return validationResult;
}
