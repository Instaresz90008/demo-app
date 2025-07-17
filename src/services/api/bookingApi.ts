
import { API_URL, handleBookingApiError } from './utils';

// Define booking types
export interface Booking {
  id: string;
  slot_id: string;
  service_id: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  meeting_purpose?: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';
  timezone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBookingRequest {
  slot_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  meeting_purpose?: string;
  timezone?: string;
}

// Booking API functions
const bookingApi = {
  // Create a new booking
  createBooking: async (bookingData: CreateBookingRequest): Promise<Booking> => {
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : undefined
        },
        body: JSON.stringify(bookingData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      return handleBookingApiError(error, false) as Booking;
    }
  },
  
  // Get all bookings for the authenticated user (as service provider)
  getProviderBookings: async (): Promise<Booking[]> => {
    try {
      const response = await fetch(`${API_URL}/bookings/provider`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch provider bookings');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      return handleBookingApiError(error, true) as Booking[];
    }
  },
  
  // Get bookings for a customer by email
  getCustomerBookings: async (email?: string): Promise<Booking[]> => {
    try {
      const endpoint = email 
        ? `${API_URL}/bookings/customer?email=${encodeURIComponent(email)}`
        : `${API_URL}/bookings/customer`;
        
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : undefined
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch customer bookings');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      return handleBookingApiError(error, true) as Booking[];
    }
  },
  
  // Update booking status
  updateBookingStatus: async (bookingId: string, status: Booking['status']): Promise<Booking> => {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update booking status');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      return handleBookingApiError(error, false) as Booking;
    }
  },
  
  // Cancel a booking
  cancelBooking: async (bookingId: string, email?: string): Promise<Booking> => {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : undefined
        },
        body: email ? JSON.stringify({ email }) : undefined
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel booking');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      return handleBookingApiError(error, false) as Booking;
    }
  },
  
  // Get booking details by ID
  getBookingDetails: async (bookingId: string, email?: string): Promise<Booking> => {
    try {
      const endpoint = email 
        ? `${API_URL}/bookings/${bookingId}?email=${encodeURIComponent(email)}`
        : `${API_URL}/bookings/${bookingId}`;
        
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : undefined
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch booking details');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      return handleBookingApiError(error, false) as Booking;
    }
  }
};

export default bookingApi;
