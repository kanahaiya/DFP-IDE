import type { YAMLSettings } from '@/store/yaml';

export interface YAMLPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<YAMLSettings>;
}

export const YAML_PRESETS: YAMLPreset[] = [
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    description: 'Kubernetes manifest formatting (2 spaces, no quotes, block style)',
    icon: 'fas fa-dharmachakra',
    settings: {
      indentation: 2,
      flowStyle: 'block',
      quoteStyle: 'none',
      lineWidth: -1,
      sortKeys: false,
      noRefs: true,
      forceQuotes: false,
      condenseFlow: false,
      quotingType: '"',
      skipInvalid: false,
      noCompatMode: false,
      arrayFormat: 'hyphen',
    }
  },
  {
    id: 'docker-compose',
    name: 'Docker Compose',
    description: 'Docker Compose file formatting (2 spaces, double quotes)',
    icon: 'fab fa-docker',
    settings: {
      indentation: 2,
      flowStyle: 'block',
      quoteStyle: 'double',
      lineWidth: -1,
      sortKeys: false,
      noRefs: true,
      forceQuotes: false,
      condenseFlow: false,
      quotingType: '"',
      skipInvalid: false,
      noCompatMode: false,
      arrayFormat: 'hyphen',
    }
  },
  {
    id: 'ansible',
    name: 'Ansible',
    description: 'Ansible playbook formatting (2 spaces, single quotes)',
    icon: 'fas fa-server',
    settings: {
      indentation: 2,
      flowStyle: 'block',
      quoteStyle: 'single',
      lineWidth: -1,
      sortKeys: false,
      noRefs: true,
      forceQuotes: false,
      condenseFlow: false,
      quotingType: "'",
      skipInvalid: false,
      noCompatMode: false,
      arrayFormat: 'hyphen',
    }
  },
  {
    id: 'openapi',
    name: 'OpenAPI',
    description: 'OpenAPI/Swagger specification (2 spaces, sorted keys)',
    icon: 'fas fa-file-code',
    settings: {
      indentation: 2,
      flowStyle: 'block',
      quoteStyle: 'auto',
      lineWidth: -1,
      sortKeys: true,
      noRefs: true,
      forceQuotes: false,
      condenseFlow: false,
      quotingType: '"',
      skipInvalid: false,
      noCompatMode: false,
      arrayFormat: 'hyphen',
    }
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    description: 'GitHub Actions workflow (2 spaces, auto quotes)',
    icon: 'fab fa-github',
    settings: {
      indentation: 2,
      flowStyle: 'block',
      quoteStyle: 'auto',
      lineWidth: -1,
      sortKeys: false,
      noRefs: true,
      forceQuotes: false,
      condenseFlow: false,
      quotingType: '"',
      skipInvalid: false,
      noCompatMode: false,
      arrayFormat: 'hyphen',
    }
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Compact formatting with flow style (inline arrays/objects)',
    icon: 'fas fa-compress',
    settings: {
      indentation: 2,
      flowStyle: 'flow',
      quoteStyle: 'auto',
      lineWidth: 80,
      sortKeys: false,
      noRefs: true,
      condenseFlow: true,
      forceQuotes: false,
      quotingType: '"',
      skipInvalid: false,
      noCompatMode: false,
      arrayFormat: 'flow',
    }
  },
  {
    id: 'sorted',
    name: 'Sorted Keys',
    description: 'Alphabetically sorted keys (4 spaces)',
    icon: 'fas fa-sort-alpha-down',
    settings: {
      indentation: 4,
      flowStyle: 'block',
      quoteStyle: 'auto',
      lineWidth: -1,
      sortKeys: true,
      noRefs: true,
      forceQuotes: false,
      condenseFlow: false,
      quotingType: '"',
      skipInvalid: false,
      noCompatMode: false,
      arrayFormat: 'hyphen',
    }
  }
];

export function getPresetById(id: string): YAMLPreset | undefined {
  return YAML_PRESETS.find(preset => preset.id === id);
}

export function applyPreset(id: string, currentSettings: YAMLSettings): YAMLSettings {
  const preset = getPresetById(id);
  if (!preset) return currentSettings;
  
  return {
    ...currentSettings,
    ...preset.settings
  };
}
