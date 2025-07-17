
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { AccessControlProvider } from '@/context/AccessControlContext';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

// Simplified query client - removed battle-grade complexity
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AccessControlProvider>
            <NotificationsProvider>
              <TooltipProvider>
                {children}
                <Toaster />
              </TooltipProvider>
            </NotificationsProvider>
          </AccessControlProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
};
