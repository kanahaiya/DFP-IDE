/**
 * Color scheme definitions for light and dark modes
 */

export interface ColorSet {
  bg: string;
  text: string;
}

export interface DiffColors {
  added: ColorSet;
  removed: ColorSet;
  modified: ColorSet;
  moved: ColorSet;
  typeChanged: ColorSet;
  baseText: string;
  background: string;
  gutter: string;
}

export const LIGHT_COLORS: DiffColors = {
  added: { bg: '#c3e9c9', text: '#0d7377' },
  removed: { bg: '#ffc5c5', text: '#a71c1c' },
  modified: { bg: '#fff4c5', text: '#8b6f00' },
  moved: { bg: '#d4e5ff', text: '#003f87' },
  typeChanged: { bg: '#e8d4ff', text: '#6b2d7f' },
  baseText: '#1e1e1e',
  background: '#ffffff',
  gutter: '#f5f5f5',
};

export const DARK_COLORS: DiffColors = {
  added: { bg: '#164b35', text: '#7eebe7' },
  removed: { bg: '#42221f', text: '#f87171' },
  modified: { bg: '#332701', text: '#fcd34d' },
  moved: { bg: '#1e3a8a', text: '#93c5fd' },
  typeChanged: { bg: '#3f0f5c', text: '#d8b4fe' },
  baseText: '#e5e7eb',
  background: '#1f2937',
  gutter: '#374151',
};

export const getColorsByTheme = (theme: 'light' | 'dark'): DiffColors => {
  return theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
};
