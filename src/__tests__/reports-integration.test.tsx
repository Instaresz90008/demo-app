
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Reports from '@/pages/Reports';
import ReportView from '@/pages/reports/ReportView';
import reportsReducer from '@/store/slices/reportsSlice';

// Mock store with test data
const createTestStore = () =>
  configureStore({
    reducer: {
      reports: reportsReducer,
    },
    preloadedState: {
      reports: {
        reports: [
          {
            id: 'test-report',
            name: 'Test Report',
            description: 'Test Description',
            category: 'basic' as const,
            type: 'analytics' as const,
            status: 'active' as const,
            data: [{ period: 'Test', bookings: 10, revenue: 1000 }],
            lastGenerated: new Date().toISOString(),
            columns: [
              { key: 'period', label: 'Period', type: 'text' },
              { key: 'bookings', label: 'Bookings', type: 'number' },
              { key: 'revenue', label: 'Revenue', type: 'number' }
            ],
            filters: [
              { label: 'Date Range', type: 'date', placeholder: 'Select date range' }
            ],
            createdAt: new Date().toISOString(),
            lastRun: new Date().toISOString(),
          },
        ],
        activeReport: null,
        loading: false,
        error: null,
      },
    },
  });

const renderWithProviders = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('Reports Integration', () => {
  test('renders reports list correctly', () => {
    renderWithProviders(<Reports />);
    
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Test Report')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('shows action buttons for reports', () => {
    renderWithProviders(<Reports />);
    
    // Using more specific selectors since the button text might be icons
    expect(screen.getByRole('button', { name: /create report/i })).toBeInTheDocument();
  });

  test('displays metrics cards', () => {
    renderWithProviders(<Reports />);
    
    expect(screen.getByText('Total Reports')).toBeInTheDocument();
    expect(screen.getByText('Active Reports')).toBeInTheDocument();
    expect(screen.getByText('This Month')).toBeInTheDocument();
  });
});

describe('Slot Broadcast Integration', () => {
  test('can import SlotBroadcast without errors', async () => {
    const SlotBroadcast = (await import('@/pages/SlotBroadcast')).default;
    expect(SlotBroadcast).toBeDefined();
  });
});
