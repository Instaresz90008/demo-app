
export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  subscriptionTier: string;
  planType: string;
  features: string[];
  tenant_id?: string;
  segment?: 'individual' | 'team_admin' | 'org_admin' | 'sub_team_admin' | 'team_member';
  primaryRole?: 'end_user' | 'admin' | 'org_admin' | 'platform_admin';
  avatar?: string;
}
 const API_URL = import.meta.env.VITE_API_URL;
export interface LoginCredentials {
  email: string;
  password: string;
}

// Comprehensive demo users for testing different scenarios
// const DEMO_USERS: User[] = [
//   // Platform Admin - Full system access
//   {
//     id: '1',
//     email: 'admin@platform.com',
//     name: 'Platform Admin',
//     roles: ['platform_admin'],
//     subscriptionTier: 'enterprise',
//     planType: 'enterprise',
//     features: ['all'],
//     tenant_id: 'platform',
//     segment: 'org_admin',
//     primaryRole: 'platform_admin',
//     avatar: undefined
//   },
  
//   // Organization Admins
//   {
//     id: '2',
//     email: 'admin@techcorp.com',
//     name: 'Sarah Johnson',
//     roles: ['org_admin'],
//     subscriptionTier: 'professional',
//     planType: 'professional',
//     features: ['calendar', 'booking', 'analytics', 'subscription_management', 'team_management'],
//     tenant_id: 'techcorp',
//     segment: 'org_admin',
//     primaryRole: 'org_admin',
//     avatar: undefined
//   },
//   {
//     id: '3',
//     email: 'owner@startup.io',
//     name: 'Mike Chen',
//     roles: ['org_admin'],
//     subscriptionTier: 'advanced',
//     planType: 'advanced',
//     features: ['calendar', 'booking', 'basic_analytics', 'team_management'],
//     tenant_id: 'startup_io',
//     segment: 'org_admin',
//     primaryRole: 'org_admin',
//     avatar: undefined
//   },
  
//   // Team Admins
//   {
//     id: '4',
//     email: 'teamlead@techcorp.com',
//     name: 'Alex Rodriguez',
//     roles: ['team_admin'],
//     subscriptionTier: 'professional',
//     planType: 'professional',
//     features: ['calendar', 'booking', 'analytics', 'team_management'],
//     tenant_id: 'techcorp',
//     segment: 'team_admin',
//     primaryRole: 'admin',
//     avatar: undefined
//   },
//   {
//     id: '5',
//     email: 'manager@consulting.biz',
//     name: 'Emma Wilson',
//     roles: ['team_admin'],
//     subscriptionTier: 'advanced',
//     planType: 'advanced',
//     features: ['calendar', 'booking', 'basic_analytics'],
//     tenant_id: 'consulting_biz',
//     segment: 'team_admin',
//     primaryRole: 'admin',
//     avatar: undefined
//   },
  
//   // Team Members
//   {
//     id: '6',
//     email: 'developer@techcorp.com',
//     name: 'James Park',
//     roles: ['team_member'],
//     subscriptionTier: 'professional',
//     planType: 'professional',
//     features: ['calendar', 'booking'],
//     tenant_id: 'techcorp',
//     segment: 'team_member',
//     primaryRole: 'end_user',
//     avatar: undefined
//   },
//   {
//     id: '7',
//     email: 'designer@startup.io',
//     name: 'Lisa Zhang',
//     roles: ['team_member'],
//     subscriptionTier: 'advanced',
//     planType: 'advanced',
//     features: ['calendar', 'booking'],
//     tenant_id: 'startup_io',
//     segment: 'team_member',
//     primaryRole: 'end_user',
//     avatar: undefined
//   },
  
//   // Individual Users
//   {
//     id: '8',
//     email: 'freelancer@gmail.com',
//     name: 'David Smith',
//     roles: ['end_user'],
//     subscriptionTier: 'advanced',
//     planType: 'advanced',
//     features: ['calendar', 'booking', 'basic_analytics'],
//     tenant_id: 'freelancer_david',
//     segment: 'individual',
//     primaryRole: 'end_user',
//     avatar: undefined
//   },
//   {
//     id: '9',
//     email: 'consultant@outlook.com',
//     name: 'Maria Garcia',
//     roles: ['end_user'],
//     subscriptionTier: 'professional',
//     planType: 'professional',
//     features: ['calendar', 'booking', 'analytics'],
//     tenant_id: 'consultant_maria',
//     segment: 'individual',
//     primaryRole: 'end_user',
//     avatar: undefined
//   },
//   {
//     id: '10',
//     email: 'student@university.edu',
//     name: 'Tom Anderson',
//     roles: ['end_user'],
//     subscriptionTier: 'free',
//     planType: 'freemium',
//     features: ['calendar', 'basic_booking'],
//     tenant_id: 'student_tom',
//     segment: 'individual',
//     primaryRole: 'end_user',
//     avatar: undefined
//   },
  
//   // Trial Users
//   {
//     id: '11',
//     email: 'trial@newcompany.com',
//     name: 'Jennifer Lee',
//     roles: ['org_admin'],
//     subscriptionTier: 'trial',
//     planType: 'trial',
//     features: ['calendar', 'booking', 'analytics'],
//     tenant_id: 'newcompany_trial',
//     segment: 'org_admin',
//     primaryRole: 'org_admin',
//     avatar: undefined
//   },
//   {
//     id: '12',
//     email: 'demo@example.com',
//     name: 'Demo User',
//     roles: ['end_user'],
//     subscriptionTier: 'free',
//     planType: 'freemium',
//     features: ['calendar', 'basic_booking'],
//     tenant_id: 'demo_tenant',
//     segment: 'individual',
//     primaryRole: 'end_user',
//     avatar: undefined
//   }
// ];

// export const authService = {
//   login: async (credentials: LoginCredentials): Promise<User> => {
//     console.log('Attempting login with:', credentials.email);
    
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     const user = DEMO_USERS.find(u => u.email === credentials.email);
//     if (!user) {
//       console.error('User not found for email:', credentials.email);
//       throw new Error('Invalid credentials');
//     }
    
//     console.log('Login successful for user:', user.name);
//     // Store user in localStorage for demo
//     localStorage.setItem('demo_auth_user', JSON.stringify(user));
//     return user;
//   },

//   logout: (): void => {
//     localStorage.removeItem('demo_auth_user');
//     console.log('User logged out');
//   },

//   getCurrentUser: (): User | null => {
//     const stored = localStorage.getItem('demo_auth_user');
//     if (!stored) return null;
    
//     try {
//       return JSON.parse(stored);
//     } catch {
//       return null;
//     }
//   },

//   // Helper method to get all demo users for testing
//   getDemoUsers: (): User[] => {
//     return DEMO_USERS;
//   }
// };






export const authService = {
 

  login: async (credentials: LoginCredentials): Promise<User> => {
    console.log('Attempting login with:', API_URL);
    const response = await fetch(`${API_URL}/api/authD/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials)
    });

    if (!response.ok) throw new Error('Login failed');

    const { user } = await response.json();
    return user;
  },

  logout: async (): Promise<void> => {
    await fetch(`${API_URL}/api/authD/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  },

  getCurrentUser: async (): Promise<User | null> => {
    const res = await fetch(`${API_URL}/api/authD/me`, {
      credentials: 'include'
    });
    if (!res.ok) return null;
    const { user } = await res.json();
    return user;
  }
};
