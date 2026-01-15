import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsPanel } from '../SettingsPanel';
import { useCSVStore } from '@/store/csv';

// Mock the store
jest.mock('@/store/csv');

const mockUpdateSettings = jest.fn();
const mockSettings = {
  delimiter: 'auto' as const,
  customDelimiter: ',',
  hasHeader: true,
  trimWhitespace: true,
  skipEmptyLines: true,
  parseNumbers: true,
  parseBooleans: true,
  parseNulls: true,
  parseDates: true,
  outputFormat: 'array' as const,
  jsonFormat: 'json' as const,
  indentation: 2 as const,
  sortKeys: false,
  compactOutput: false,
  quoteHandling: true,
  escapeHandling: true,
};

describe('SettingsPanel', () => {
  beforeEach(() => {
    (useCSVStore as unknown as jest.Mock).mockReturnValue({
      settings: mockSettings,
      updateSettings: mockUpdateSettings,
    });
    jest.clearAllMocks();
  });

  it('renders delimiter options', () => {
    render(<SettingsPanel />);
    expect(screen.getByText('Delimiter Type')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /delimiter type/i })).toBeInTheDocument();
  });

  it('renders CSV structure options', () => {
    render(<SettingsPanel />);
    expect(screen.getByText('First row as header')).toBeInTheDocument();
    expect(screen.getByText('Trim whitespace')).toBeInTheDocument();
    expect(screen.getByText('Skip empty lines')).toBeInTheDocument();
  });

  it('renders data type parsing options', () => {
    render(<SettingsPanel />);
    expect(screen.getByText('Parse numbers')).toBeInTheDocument();
    expect(screen.getByText('Parse booleans')).toBeInTheDocument();
    expect(screen.getByText('Parse null values')).toBeInTheDocument();
    expect(screen.getByText(/Parse dates/i)).toBeInTheDocument();
  });

  it('toggles hasHeader when checkbox clicked', () => {
    render(<SettingsPanel />);
    const checkbox = screen.getByRole('checkbox', { name: /first row as header/i });
    fireEvent.click(checkbox);
    expect(mockUpdateSettings).toHaveBeenCalledWith({ hasHeader: false });
  });

  it('changes delimiter selection', () => {
    render(<SettingsPanel />);
    const select = screen.getByRole('combobox', { name: /delimiter type/i });
    fireEvent.change(select, { target: { value: ';' } });
    expect(mockUpdateSettings).toHaveBeenCalledWith({ delimiter: ';' });
  });

  it('shows custom delimiter input when custom selected', () => {
    (useCSVStore as unknown as jest.Mock).mockReturnValue({
      settings: { ...mockSettings, delimiter: 'custom' },
      updateSettings: mockUpdateSettings,
    });
    
    render(<SettingsPanel />);
    expect(screen.getByLabelText('Custom Delimiter')).toBeInTheDocument();
  });

  it('toggles data type parsing options', () => {
    render(<SettingsPanel />);
    const numberCheckbox = screen.getByRole('checkbox', { name: /parse numbers/i });
    fireEvent.click(numberCheckbox);
    expect(mockUpdateSettings).toHaveBeenCalledWith({ parseNumbers: false });
  });
});
