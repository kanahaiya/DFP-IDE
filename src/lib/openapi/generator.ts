/**
 * OpenAPI Generator - Wrapper for generating formatted output
 */

import jsYaml from 'js-yaml';
import { generateOpenAPISpec as generateSpec, type OpenAPISpec } from './converter';
import type { Endpoint, OpenAPISettings } from '@/types';

export { validateSpec } from './converter';

/**
 * Generate and format OpenAPI spec
 */
export function generateOpenAPISpec(options: {
  endpoints: Endpoint[];
  settings: OpenAPISettings;
  outputFormat: 'yaml' | 'json';
}): string {
  const { endpoints, settings, outputFormat } = options;

  // Generate the spec
  const spec: OpenAPISpec = generateSpec(endpoints, settings);

  // Format based on output format
  if (outputFormat === 'yaml') {
    return jsYaml.dump(spec, { 
      indent: 2, 
      lineWidth: -1, 
      noRefs: true,
      sortKeys: false,
    });
  } else {
    return JSON.stringify(spec, null, 2);
  }
}
