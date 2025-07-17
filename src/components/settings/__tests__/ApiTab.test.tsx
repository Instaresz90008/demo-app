
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ApiTab from '../ApiTab';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockImplementation(() => Promise.resolve()),
  },
});

describe('ApiTab', () => {
  it('renders the Coming Soon overlay', () => {
    render(<ApiTab />);
    
    // Check if the Coming Soon text is present
    expect(screen.getByText(/API Access Coming Soon/i)).toBeInTheDocument();
    expect(screen.getByText(/Our API integration features are currently under development/i)).toBeInTheDocument();
  });

  it('renders the correct API endpoints', () => {
    render(<ApiTab />);
    
    // List of expected endpoints
    const endpoints = [
      "List Events",
      "Create Event",
      "Get Event",
      "Update Event",
      "Delete Event"
    ];
    
    // Check if all endpoints are rendered
    endpoints.forEach(endpoint => {
      expect(screen.getByText(endpoint)).toBeInTheDocument();
    });
  });

  it('shows code samples with N9IZ-API comments', () => {
    render(<ApiTab />);
    
    // The code samples should be present but might be hidden in tabs
    const allPreContent = document.querySelectorAll('pre');
    
    // Check if at least one code block contains the N9IZ-API comment
    let hasN9IZComment = false;
    allPreContent.forEach(pre => {
      if (pre.textContent && pre.textContent.includes('N9IZ-API')) {
        hasN9IZComment = true;
      }
    });
    
    expect(hasN9IZComment).toBe(true);
  });

  it('switches between code tabs', async () => {
    render(<ApiTab />);
    
    // Click on the Python tab
    const pythonTab = screen.getByText('Python');
    fireEvent.click(pythonTab);
    
    // Check if the Python code content is now visible
    const allPreContent = document.querySelectorAll('pre');
    let pythonContentVisible = false;
    
    allPreContent.forEach(pre => {
      if (pre.textContent && pre.textContent.includes('import requests')) {
        pythonContentVisible = true;
      }
    });
    
    expect(pythonContentVisible).toBe(true);
  });
});
