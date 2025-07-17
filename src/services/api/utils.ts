
export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com' 
  : 'http://localhost:3001';

// Generic API request function
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(localStorage.getItem('token') && {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  return {
    success: false,
    error: error.message || 'An unexpected error occurred'
  };
};

// Specific error handler for access control APIs
export const handleAccessControlError = (error: any) => {
  console.error('Access Control API Error:', error);
  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
    accessMap: {}
  };
};

// Specific error handler for data APIs that need data property
export const handleDataApiError = <T>(error: any, defaultData: T) => {
  console.error('Data API Error:', error);
  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
    data: defaultData
  };
};

// Specific error handler for user APIs
export const handleUserApiError = (error: any) => {
  console.error('User API Error:', error);
  return {
    id: 'error',
    username: 'error',
    email: 'error@example.com',
    created_at: new Date().toISOString()
  };
};

// Specific error handler for booking APIs
export const handleBookingApiError = (error: any, isArray: boolean = false) => {
  console.error('Booking API Error:', error);
  if (isArray) {
    return [];
  }
  return {
    id: 'error',
    slot_id: 'error',
    service_id: 'error',
    customer_name: 'Error',
    customer_email: 'error@example.com',
    status: 'confirmed' as any
  };
};

// Specific error handler for slot APIs
export const handleSlotApiError = (error: any, isArray: boolean = false) => {
  console.error('Slot API Error:', error);
  if (isArray) {
    return [];
  }
  return {
    id: 'error',
    service_id: 'error',
    user_id: 'error',
    slot_date: new Date().toISOString().split('T')[0],
    start_time: '00:00',
    end_time: '00:00',
    is_available: false
  };
};

// For APIs that return boolean
export const handleBooleanApiError = (error: any) => {
  console.error('Boolean API Error:', error);
  return false;
};

// For conversation APIs
export const handleConversationApiError = (error: any, isArray: boolean = false) => {
  console.error('Conversation API Error:', error);
  if (isArray) {
    return [];
  }
  return {
    id: 0,
    user_id: 'error',
    user_query: 'Error occurred',
    response: 'Error occurred',
    created_at: new Date().toISOString()
  };
};

// For billing APIs
export const handleBillingApiError = <T>(error: any, defaultData: T) => {
  console.error('Billing API Error:', error);
  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
    data: defaultData
  };
};

// For payment APIs
export const handlePaymentApiError = <T>(error: any, defaultData: T) => {
  console.error('Payment API Error:', error);
  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
    data: defaultData
  };
};

// For policy APIs
export const handlePolicyApiError = <T>(error: any, defaultData: T) => {
  console.error('Policy API Error:', error);
  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
    data: defaultData
  };
};

// For security APIs
export const handleSecurityApiError = <T>(error: any, defaultData: T) => {
  console.error('Security API Error:', error);
  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
    data: defaultData
  };
};

// For team APIs
export const handleTeamApiError = <T>(error: any, defaultData: T) => {
  console.error('Team API Error:', error);
  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
    data: defaultData
  };
};
