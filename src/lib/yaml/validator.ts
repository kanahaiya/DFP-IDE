import yaml from 'js-yaml';
import type { ValidationError } from '@/store/yaml';

export function validateJSON(input: string): ValidationError[] {
  if (!input.trim()) return [];
  
  try {
    JSON.parse(input);
    return [];
  } catch (error: unknown) {
    const err = error as SyntaxError & { position?: number };
    // Extract line/column from error
    const position = err.position || 0;
    const lines = input.substring(0, position).split('\n');
    return [{
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
      message: err.message,
      type: 'syntax'
    }];
  }
}

export function validateYAML(input: string): ValidationError[] {
  if (!input.trim()) return [];
  
  try {
    yaml.load(input);
    return [];
  } catch (error: unknown) {
    const err = error as yaml.YAMLException;
    return [{
      line: err.mark?.line ? err.mark.line + 1 : 0,
      column: err.mark?.column ? err.mark.column + 1 : 0,
      message: err.message,
      type: 'syntax'
    }];
  }
}
