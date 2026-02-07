import { JSONPATH_SAMPLES } from '@/data/jsonpath-tester-samples';
import { jsonpathTesterContent } from '@/data/jsonpath-tester-seo';
import { jsonpathTesterHelp } from '@/data/jsonpath-tester-help';
import type { ToolConfig } from '@/components/common/UniversalTool';

export const toolsConfig: Record<string, ToolConfig> = {
  jsonpathTester: {
    name: 'JSONPath Tester',
    storageKey: 'jsonpath-tester',
    samples: JSONPATH_SAMPLES,
    processorType: 'jsonpath', // Use string instead of function
    inputLanguage: 'json',
    outputLanguage: 'json',
    seoContent: {
      title: jsonpathTesterContent.title,
      description: jsonpathTesterContent.description,
      keywords: ['jsonpath', 'json', 'query', 'tester'],
    },
    helpContent: {
      sections: jsonpathTesterHelp.sections,
    },
    defaultSettings: {
      query: '$.store.book[*].author',
    },
    inputPlaceholder: 'Paste your JSON data here...',
    outputPlaceholder: 'JSONPath results will appear here...',
  },
};
