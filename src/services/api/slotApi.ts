import { API_URL, handleSlotApiError, handleBooleanApiError } from './utils';

// Define slot types
export interface Slot {
  id: string;
  service_id: string;
  user_id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  booking_link?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSlotBatchRequest {
  service_id: string;
  slots: Omit<Slot, 'id' | 'user_id' | 'booking_link' | 'created_at' | 'updated_at'>[];
}

// Slot API functions
const slotApi = {
  // Create multiple slots for a service
  createSlots: async (data: CreateSlotBatchRequest): Promise<Slot[]> => {
    try {
      const response = await fetch(`${API_URL}/slots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create slots');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      return handleSlotApiError(error, true) as any;
    }
  },
  
  // Get slots for a service
  getServiceSlots: async (serviceId: string): Promise<Slot[]> => {
    try {
      const response = await fetch(`${API_URL}/slots/service/${serviceId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch service slots');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      return handleSlotApiError(error, true) as any;
    }
  },
  
  // Get slots by date range
  getSlotsByDateRange: async (startDate: string, endDate: string): Promise<Slot[]> => {
    try {
      const response = await fetch(`${API_URL}/slots/daterange?startDate=${startDate}&endDate=${endDate}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch slots by date range');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      return handleSlotApiError(error, true) as any;
    }
  },
  
  // Update slot availability
  updateSlotAvailability: async (slotId: string, isAvailable: boolean): Promise<Slot> => {
    try {
      const response = await fetch(`${API_URL}/slots/${slotId}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ is_available: isAvailable })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update slot availability');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      return handleSlotApiError(error, false) as any;
    }
  },
  
  // Delete slots for a service
  deleteServiceSlots: async (serviceId: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/slots/service/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete service slots');
      }
      
      return true;
    } catch (error) {
      return handleBooleanApiError(error);
    }
  },
  
  // Get public slots for a service
  getPublicServiceSlots: async (serviceId: string): Promise<Slot[]> => {
    try {
      const response = await fetch(`${API_URL}/slots/public/service/${serviceId}`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch public service slots');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      return handleSlotApiError(error, true) as any;
    }
  },
  
  // Get slot by booking link
  getSlotByBookingLink: async (bookingLink: string): Promise<Slot> => {
    try {
      const response = await fetch(`${API_URL}/slots/public/booking/${bookingLink}`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch slot by booking link');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      return handleSlotApiError(error, false) as any;
    }
  }
};

export default slotApi;
