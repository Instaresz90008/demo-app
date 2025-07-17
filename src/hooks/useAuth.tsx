
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  planType: string;
  avatar?: string;
  tenant_id?: string;
  segment?: 'individual' | 'team_admin' | 'org_admin' | 'sub_team_admin' | 'team_member';
  primaryRole?: 'end_user' | 'admin' | 'org_admin' | 'platform_admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register?: (email: string, password: string, userData?: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Use the same users as authService for consistency
const DEFAULT_USERS = [
  {
    id: '1',
    name: 'Platform Admin',
    email: 'admin@platform.com',
    roles: ['platform_admin'],
    planType: 'enterprise',
    tenant_id: 'platform',
    segment: 'org_admin' as const,
    primaryRole: 'platform_admin' as const,
    avatar: undefined
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'admin@techcorp.com',
    roles: ['org_admin'],
    planType: 'professional',
    tenant_id: 'techcorp',
    segment: 'org_admin' as const,
    primaryRole: 'org_admin' as const,
    avatar: undefined
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'owner@startup.io',
    roles: ['org_admin'],
    planType: 'advanced',
    tenant_id: 'startup_io',
    segment: 'org_admin' as const,
    primaryRole: 'org_admin' as const,
    avatar: undefined
  },
  {
    id: '4',
    name: 'Alex Rodriguez',
    email: 'teamlead@techcorp.com',
    roles: ['team_admin'],
    planType: 'professional',
    tenant_id: 'techcorp',
    segment: 'team_admin' as const,
    primaryRole: 'admin' as const,
    avatar: undefined
  },
  {
    id: '5',
    name: 'Emma Wilson',
    email: 'manager@consulting.biz',
    roles: ['team_admin'],
    planType: 'advanced',
    tenant_id: 'consulting_biz',
    segment: 'team_admin' as const,
    primaryRole: 'admin' as const,
    avatar: undefined
  },
  {
    id: '6',
    name: 'James Park',
    email: 'developer@techcorp.com',
    roles: ['team_member'],
    planType: 'professional',
    tenant_id: 'techcorp',
    segment: 'team_member' as const,
    primaryRole: 'end_user' as const,
    avatar: undefined
  },
  {
    id: '7',
    name: 'Lisa Zhang',
    email: 'designer@startup.io',
    roles: ['team_member'],
    planType: 'advanced',
    tenant_id: 'startup_io',
    segment: 'team_member' as const,
    primaryRole: 'end_user' as const,
    avatar: undefined
  },
  {
    id: '8',
    name: 'David Smith',
    email: 'freelancer@gmail.com',
    roles: ['end_user'],
    planType: 'advanced',
    tenant_id: 'freelancer_david',
    segment: 'individual' as const,
    primaryRole: 'end_user' as const,
    avatar: undefined
  },
  {
    id: '9',
    name: 'Maria Garcia',
    email: 'consultant@outlook.com',
    roles: ['end_user'],
    planType: 'professional',
    tenant_id: 'consultant_maria',
    segment: 'individual' as const,
    primaryRole: 'end_user' as const,
    avatar: undefined
  },
  {
    id: '10',
    name: 'Tom Anderson',
    email: 'student@university.edu',
    roles: ['end_user'],
    planType: 'freemium',
    tenant_id: 'student_tom',
    segment: 'individual' as const,
    primaryRole: 'end_user' as const,
    avatar: undefined
  },
  {
    id: '11',
    name: 'Jennifer Lee',
    email: 'trial@newcompany.com',
    roles: ['org_admin'],
    planType: 'trial',
    tenant_id: 'newcompany_trial',
    segment: 'org_admin' as const,
    primaryRole: 'org_admin' as const,
    avatar: undefined
  },
  {
    id: '12',
    name: 'Demo User',
    email: 'demo@example.com',
    roles: ['end_user'],
    planType: 'freemium',
    tenant_id: 'demo_tenant',
    segment: 'individual' as const,
    primaryRole: 'end_user' as const,
    avatar: undefined
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user from AuthContext
    const storedUser = localStorage.getItem('demo_auth_user') || localStorage.getItem('current_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('Loading stored user:', userData.name);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('demo_auth_user');
        localStorage.removeItem('current_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('useAuth login attempt for:', email);
    // Find user by email
    const foundUser = DEFAULT_USERS.find(u => u.email === email);
    if (foundUser) {
      console.log('useAuth login successful for:', foundUser.name);
      setUser(foundUser);
      localStorage.setItem('current_user', JSON.stringify(foundUser));
      localStorage.setItem('demo_auth_user', JSON.stringify(foundUser));
      return true;
    }
    console.error('useAuth login failed - user not found:', email);
    return false;
  };

  const logout = () => {
    console.log('useAuth logout');
    setUser(null);
    localStorage.removeItem('current_user');
    localStorage.removeItem('demo_auth_user');
  };

  const register = async (email: string, password: string, userData?: any): Promise<boolean> => {
    // Simple demo registration
    const newUser = {
      id: Date.now().toString(),
      name: userData?.name || 'New User',
      email,
      roles: ['end_user'],
      planType: 'freemium',
      tenant_id: 'org_' + Date.now(),
      segment: 'individual' as const,
      primaryRole: 'end_user' as const,
      avatar: undefined
    };
    setUser(newUser);
    localStorage.setItem('current_user', JSON.stringify(newUser));
    localStorage.setItem('demo_auth_user', JSON.stringify(newUser));
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
