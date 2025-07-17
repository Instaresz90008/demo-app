
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EnhancedCalendar } from '../components/ui/enhanced-calendar';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('EnhancedCalendar', () => {
  it('renders calendar with current month', () => {
    render(<EnhancedCalendar />);
    
    // Check if calendar is rendered
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('handles date selection', () => {
    const mockOnDayClick = vi.fn();
    render(
      <EnhancedCalendar
        mode="single"
        onDayClick={mockOnDayClick}
      />
    );

    // Find and click a date
    const dateButtons = screen.getAllByRole('button');
    const dateButton = dateButtons.find(btn => 
      btn.textContent && /^\d+$/.test(btn.textContent) && !btn.hasAttribute('disabled')
    );
    
    if (dateButton) {
      fireEvent.click(dateButton);
      expect(mockOnDayClick).toHaveBeenCalled();
    }
  });

  it('applies selected styles correctly', () => {
    const selectedDate = new Date();
    render(
      <EnhancedCalendar
        mode="single"
        selected={selectedDate}
      />
    );

    // Check if selected date has proper styling
    const dateButton = screen.getByText(selectedDate.getDate().toString());
    expect(dateButton).toHaveClass('bg-blue-600');
  });
});
