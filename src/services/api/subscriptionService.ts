
import { API_URL, handleApiError } from './utils';
import { UserSubscription, BillingPeriod } from '@/types/subscription';

// Subscription API service
const subscriptionService = {
  // Get current user subscription
  getCurrentSubscription: async (): Promise<UserSubscription | null> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
      
      const response = await fetch(`${API_URL}/subscriptions/active`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch subscription');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  },
  
  // Create Stripe checkout session
  createCheckoutSession: async (planId: string, billingPeriod: BillingPeriod): Promise<string | null> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('User not authenticated');
      
      const response = await fetch(`${API_URL}/subscriptions/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ planId, billingPeriod }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create checkout session');
      }
      
      const data = await response.json();
      return data.checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return null;
    }
  },
  
  // Create customer portal session for managing subscriptions
  createCustomerPortal: async (): Promise<string | null> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('User not authenticated');
      
      const response = await fetch(`${API_URL}/subscriptions/portal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create customer portal');
      }
      
      const data = await response.json();
      return data.portalUrl;
    } catch (error) {
      console.error('Error creating customer portal:', error);
      return null;
    }
  },
  
  // Cancel subscription
  cancelSubscription: async (subscriptionId: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('User not authenticated');
      
      const response = await fetch(`${API_URL}/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to cancel subscription');
      }
      
      return true;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return false;
    }
  },
  
  // Check if subscription has expired and downgrade if necessary
  checkSubscriptionStatus: async (): Promise<boolean> => {
    try {
      const subscription = await subscriptionService.getCurrentSubscription();
      
      if (!subscription) return false;
      
      // Check if subscription has expired
      const now = new Date();
      const endDate = new Date(subscription.currentPeriodEnd);
      
      if (now > endDate && subscription.status !== 'expired') {
        // Call API to mark subscription as expired
        const token = localStorage.getItem('auth_token');
        if (!token) return false;
        
        await fetch(`${API_URL}/subscriptions/${subscription.id}/expire`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        return true; // Subscription was expired
      }
      
      return false; // No expiration necessary
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }
};

export default subscriptionService;
