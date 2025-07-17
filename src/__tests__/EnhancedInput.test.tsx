
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EnhancedInput from '../components/booking/forms/EnhancedInput';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('EnhancedInput', () => {
  it('renders input with label', () => {
    const mockOnChange = vi.fn();
    render(
      <EnhancedInput
        label="Test Label"
        value=""
        onChange={mockOnChange}
        placeholder="Test placeholder"
      />
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  it('shows validation error when required field is invalid', () => {
    const mockOnChange = vi.fn();
    render(
      <EnhancedInput
        label="Email"
        type="email"
        value="invalid-email"
        onChange={mockOnChange}
        required
        validation={(value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
        errorMessage="Please enter a valid email"
      />
    );

    const input = screen.getByDisplayValue('invalid-email');
    fireEvent.blur(input);

    expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
  });

  it('shows success state when validation passes', () => {
    const mockOnChange = vi.fn();
    render(
      <EnhancedInput
        label="Email"
        type="email"
        value="test@example.com"
        onChange={mockOnChange}
        required
        validation={(value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
      />
    );

    const input = screen.getByDisplayValue('test@example.com');
    fireEvent.blur(input);

    // Check for success indicator (green check mark)
    expect(document.querySelector('.bg-green-500')).toBeInTheDocument();
  });
});
