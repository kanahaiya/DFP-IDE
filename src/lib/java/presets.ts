/**
 * Preset configurations for JSON to Java converter
 */

import type { JavaPreset } from './types';

export const JAVA_PRESETS: JavaPreset[] = [
  {
    id: 'plain-java',
    name: 'Plain Java',
    description: 'Basic POJO with getters/setters',
    settings: {
      annotationStyle: 'none',
      useLombok: false,
      generateGetters: true,
      generateSetters: true,
      generateConstructors: true,
      generateAllArgsConstructor: false,
      generateToString: false,
      generateHashCodeEquals: false,
    },
  },
  {
    id: 'jackson',
    name: 'Jackson',
    description: 'Jackson annotations for JSON serialization',
    settings: {
      annotationStyle: 'jackson',
      useLombok: false,
      generateGetters: true,
      generateSetters: true,
      generateConstructors: true,
    },
  },
  {
    id: 'gson',
    name: 'Gson',
    description: 'Gson annotations for JSON serialization',
    settings: {
      annotationStyle: 'gson',
      useLombok: false,
      generateGetters: true,
      generateSetters: true,
      generateConstructors: true,
    },
  },
  {
    id: 'lombok-data',
    name: 'Lombok @Data',
    description: 'Lombok annotations for boilerplate reduction',
    settings: {
      annotationStyle: 'none',
      useLombok: true,
      generateGetters: true,
      generateSetters: true,
      generateConstructors: true,
      generateAllArgsConstructor: true,
    },
  },
  {
    id: 'lombok-builder',
    name: 'Lombok Builder',
    description: 'Lombok with Builder pattern',
    settings: {
      annotationStyle: 'jackson',
      useLombok: true,
      generateGetters: true,
      generateSetters: true,
      generateConstructors: true,
      generateAllArgsConstructor: true,
      generateBuilder: true,
    },
  },
  {
    id: 'immutable',
    name: 'Immutable',
    description: 'Final fields, no setters',
    settings: {
      annotationStyle: 'jackson',
      useLombok: false,
      makeFinal: true,
      generateGetters: true,
      generateSetters: false,
      generateConstructors: true,
      generateAllArgsConstructor: true,
    },
  },
  {
    id: 'full-featured',
    name: 'Full Featured',
    description: 'All methods including toString, hashCode, equals',
    settings: {
      annotationStyle: 'jackson',
      useLombok: false,
      generateGetters: true,
      generateSetters: true,
      generateConstructors: true,
      generateAllArgsConstructor: true,
      generateToString: true,
      generateHashCodeEquals: true,
    },
  },
];
