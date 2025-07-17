
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { AuthProvider } from '@/contexts/AuthContext';
import SmartServiceCreator from '@/components/smart-service/SmartServiceCreator';
import smartServiceReducer from '@/store/slices/smartServiceSlice';
import '@testing-library/jest-dom';

// Mock the unified access control hook
jest.mock('@/hooks/useUnifiedAccessControl', () => ({
  useUnifiedAccessControl: () => ({
    capabilities: {
      smartServiceAccess: true,
      smartServiceTemplates: 5
    },
    user: {
      planType: 'freemium'
    }
  })
}));

// Create a test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      smartService: smartServiceReducer,
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          {component}
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe('SmartServiceCreator Component', () => {
  test('renders Smart Service Creator heading', () => {
    renderWithProviders(<SmartServiceCreator />);
    expect(screen.getByText('Smart Service Creator')).toBeInTheDocument();
  });

  test('shows booking type cards', () => {
    renderWithProviders(<SmartServiceCreator />);
    expect(screen.getByText('1-Jan')).toBeInTheDocument();
    expect(screen.getByText('1–Many (Broadcast)')).toBeInTheDocument();
    expect(screen.getByText('Group (Interactive)')).toBeInTheDocument();
  });

  test('navigates to templates when booking type is selected', async () => {
    renderWithProviders(<SmartServiceCreator />);
    
    const bookingTypeCard = screen.getByText('1–Many (Broadcast)').closest('.cursor-pointer');
    if (bookingTypeCard) {
      fireEvent.click(bookingTypeCard);
    }
    
    await waitFor(() => {
      expect(screen.getByText('Choose a Template')).toBeInTheDocument();
    });
  });

  test('shows plan indicator for freemium users', () => {
    renderWithProviders(<SmartServiceCreator />);
    expect(screen.getByText('Freemium Plan')).toBeInTheDocument();
    expect(screen.getByText('Templates available: 5')).toBeInTheDocument();
  });

  test('can navigate through the complete flow', async () => {
    renderWithProviders(<SmartServiceCreator />);
    
    // Select booking type
    const bookingTypeCard = screen.getByText('1-Jan').closest('.cursor-pointer');
    if (bookingTypeCard) {
      fireEvent.click(bookingTypeCard);
    }
    
    // Wait for templates to load
    await waitFor(() => {
      expect(screen.getByText('Choose a Template')).toBeInTheDocument();
    });
    
    // Select template
    const templateButton = screen.getAllByText('Use Template')[0];
    fireEvent.click(templateButton);
    
    // Should show form
    expect(screen.getByText('Customize Your Service')).toBeInTheDocument();
    
    // Create service
    const createButton = screen.getByText('Create Service & Publish');
    fireEvent.click(createButton);
    
    // Should show success
    await waitFor(() => {
      expect(screen.getByText('Service Created Successfully! 🎉')).toBeInTheDocument();
    });
  });
});
