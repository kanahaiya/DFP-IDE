/**
 * Preset configurations for JSON to Python converter
 */

import type { PythonPreset } from './types';

export const PYTHON_PRESETS: PythonPreset[] = [
  {
    id: 'dataclass',
    name: 'Dataclass',
    description: 'Python dataclass with type hints',
    settings: {
      outputFormat: 'dataclass',
      includeTypeHints: true,
      includeImports: true,
      convertToSnakeCase: true,
    },
  },
  {
    id: 'pydantic-v2',
    name: 'Pydantic v2',
    description: 'Pydantic BaseModel for validation',
    settings: {
      outputFormat: 'pydantic',
      pydanticVersion: 'v2',
      includeTypeHints: true,
      includeImports: true,
      convertToSnakeCase: true,
    },
  },
  {
    id: 'pydantic-v1',
    name: 'Pydantic v1',
    description: 'Pydantic v1 compatible model',
    settings: {
      outputFormat: 'pydantic',
      pydanticVersion: 'v1',
      includeTypeHints: true,
      includeImports: true,
      convertToSnakeCase: true,
    },
  },
  {
    id: 'dict',
    name: 'Dictionary',
    description: 'Plain Python dictionary literal',
    settings: {
      outputFormat: 'dict',
      convertToSnakeCase: true,
      quoteStyle: 'double',
    },
  },
  {
    id: 'typeddict',
    name: 'TypedDict',
    description: 'TypedDict for type checking',
    settings: {
      outputFormat: 'typeddict',
      includeTypeHints: true,
      includeImports: true,
      convertToSnakeCase: true,
    },
  },
  {
    id: 'attrs',
    name: 'attrs',
    description: 'attrs library classes',
    settings: {
      outputFormat: 'attrs',
      includeTypeHints: true,
      includeImports: true,
      convertToSnakeCase: true,
    },
  },
  {
    id: 'namedtuple',
    name: 'NamedTuple',
    description: 'Typed NamedTuple',
    settings: {
      outputFormat: 'namedtuple',
      includeTypeHints: true,
      includeImports: true,
      convertToSnakeCase: true,
    },
  },
  {
    id: 'dataclass-modern',
    name: 'Dataclass (Modern)',
    description: 'Dataclass with slots (Python 3.10+)',
    settings: {
      outputFormat: 'dataclass',
      includeTypeHints: true,
      includeImports: true,
      convertToSnakeCase: true,
      dataclassSlots: true,
      useUnionSyntax: true,
    },
  },
];
