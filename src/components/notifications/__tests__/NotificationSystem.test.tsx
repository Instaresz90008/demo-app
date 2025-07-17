
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NotificationsProvider, useNotifications } from '@/context/NotificationsContext';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { Button } from '@/components/ui/button';
import { ToastProvider } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

// Mock toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn().mockReturnValue({
    toast: vi.fn(),
  }),
}));

// Test component to trigger notifications
const TestComponent = () => {
  const { addNotification, notifications } = useNotifications();
  
  const createNotification = (type) => {
    addNotification({
      title: `Test ${type} notification`,
      message: `This is a test ${type} notification message`,
      type,
    });
  };
  
  return (
    <div>
      <p data-testid="notification-count">{notifications.length}</p>
      <Button onClick={() => createNotification('info')}>Add Info</Button>
      <Button onClick={() => createNotification('success')}>Add Success</Button>
      <Button onClick={() => createNotification('warning')}>Add Warning</Button>
      <Button onClick={() => createNotification('error')}>Add Error</Button>
    </div>
  );
};

describe('Notification System', () => {
  it('renders notification bell with correct unread count', () => {
    render(
      <NotificationsProvider>
        <ToastProvider>
          <NotificationDropdown />
        </ToastProvider>
      </NotificationsProvider>
    );
    
    // Initial state should have 2 unread notifications from the initial data
    const badge = screen.queryByText('2');
    expect(badge).toBeInTheDocument();
  });

  it('allows adding a new notification and shows toast', async () => {
    const mockToast = vi.fn();
    (useToast as any).mockReturnValue({ toast: mockToast });
    
    render(
      <NotificationsProvider>
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      </NotificationsProvider>
    );
    
    // Check initial count (3 from initial data)
    expect(screen.getByTestId('notification-count').textContent).toBe('3');
    
    // Add a notification
    fireEvent.click(screen.getByText('Add Success'));
    
    // Count should increase
    await waitFor(() => {
      expect(screen.getByTestId('notification-count').textContent).toBe('4');
    });
    
    // Toast should be triggered
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Test success notification',
      description: 'This is a test success notification message'
    }));
  });
});
