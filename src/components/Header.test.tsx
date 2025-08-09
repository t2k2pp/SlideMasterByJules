import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from './Header';

describe('<Header />', () => {
  const mockOnOpenSettings = jest.fn();
  const mockOnOpenAiAssistant = jest.fn();
  const mockOnOpenExportManager = jest.fn();

  beforeEach(() => {
    // Clear mock history before each test
    jest.clearAllMocks();
    render(
      <Header
        onOpenSettings={mockOnOpenSettings}
        onOpenAiAssistant={mockOnOpenAiAssistant}
        onOpenExportManager={mockOnOpenExportManager}
      />
    );
  });

  it('renders the title correctly', () => {
    expect(screen.getByText('SlideMaster')).toBeInTheDocument();
  });

  it('calls the correct handler when the settings button is clicked', () => {
    const settingsButton = screen.getByTitle('Settings');
    fireEvent.click(settingsButton);
    expect(mockOnOpenSettings).toHaveBeenCalledTimes(1);
    expect(mockOnOpenAiAssistant).not.toHaveBeenCalled();
    expect(mockOnOpenExportManager).not.toHaveBeenCalled();
  });

  it('calls the correct handler when the AI assistant button is clicked', () => {
    const aiButton = screen.getByTitle('AI Assistant');
    fireEvent.click(aiButton);
    expect(mockOnOpenAiAssistant).toHaveBeenCalledTimes(1);
    expect(mockOnOpenSettings).not.toHaveBeenCalled();
    expect(mockOnOpenExportManager).not.toHaveBeenCalled();
  });

  it('calls the correct handler when the export button is clicked', () => {
    const exportButton = screen.getByTitle('Export');
    fireEvent.click(exportButton);
    expect(mockOnOpenExportManager).toHaveBeenCalledTimes(1);
    expect(mockOnOpenSettings).not.toHaveBeenCalled();
    expect(mockOnOpenAiAssistant).not.toHaveBeenCalled();
  });
});
