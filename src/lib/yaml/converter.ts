import yaml from 'js-yaml';
import type { YAMLSettings, ValidationError } from '@/store/yaml';

export interface ConversionResult {
  success: boolean;
  output?: string;
  errors?: ValidationError[];
}

export function convertJSONToYAML(
  jsonString: string, 
  settings: YAMLSettings
): ConversionResult {
  if (!jsonString.trim()) {
    return { success: true, output: '' };
  }

  try {
    const jsonObject = JSON.parse(jsonString);
    
    // Map quoteStyle to js-yaml options
    let quotingType: '"' | "'" = '"';
    let forceQuotes = settings.forceQuotes;
    
    if (settings.quoteStyle === 'single') {
      quotingType = "'";
      forceQuotes = true;
    } else if (settings.quoteStyle === 'double') {
      quotingType = '"';
      forceQuotes = true;
    } else if (settings.quoteStyle === 'none') {
      forceQuotes = false;
    }
    // 'auto' uses default behavior
    
    const yamlOptions: yaml.DumpOptions = {
      indent: settings.indentation === 'tab' ? 1 : settings.indentation,
      lineWidth: settings.lineWidth,
      noRefs: settings.noRefs,
      sortKeys: settings.sortKeys,
      quotingType: quotingType,
      forceQuotes: forceQuotes,
      noCompatMode: settings.noCompatMode,
      condenseFlow: settings.condenseFlow,
      flowLevel: settings.flowStyle === 'block' ? -1 : 
                 settings.flowStyle === 'flow' ? 0 : 2,
    };
    
    let yamlString = yaml.dump(jsonObject, yamlOptions);
    
    // Handle tab indentation
    if (settings.indentation === 'tab') {
      yamlString = yamlString.replace(/^( {2})+/gm, (match) => {
        return '\t'.repeat(match.length / 2);
      });
    }
    
    return { success: true, output: yamlString };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      errors: [{ 
        message: err.message, 
        line: 0, 
        column: 0,
        type: 'syntax'
      }]
    };
  }
}

export function convertYAMLToJSON(
  yamlString: string,
  // Settings parameter reserved for future use (indentation options, etc.)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  settings?: YAMLSettings
): ConversionResult {
  if (!yamlString.trim()) {
    return { success: true, output: '' };
  }

  try {
    const jsonObject = yaml.load(yamlString, { 
      json: true,
      onWarning: (warning: yaml.YAMLException) => console.warn(warning)
    });
    
    // Default to 2-space indentation for JSON output
    const jsonString = JSON.stringify(jsonObject, null, 2);
    
    return { success: true, output: jsonString };
  } catch (error: unknown) {
    const err = error as yaml.YAMLException;
    return {
      success: false,
      errors: [{ 
        message: err.message, 
        line: err.mark?.line || 0,
        column: err.mark?.column || 0,
        type: 'syntax'
      }]
    };
  }
}
