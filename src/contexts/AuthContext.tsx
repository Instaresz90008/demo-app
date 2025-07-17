
// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { User, LoginCredentials, authService } from '@/services/authService';

// interface AuthContextType {
//   user: User | null;
//   login: (credentials: LoginCredentials) => Promise<void>;
//   logout: () => void;
//   register: (data: RegisterData) => Promise<void>;
//   isLoading: boolean;
//   isAuthenticated: boolean;
// }

// interface RegisterData {
//   email: string;
//   password: string;
//   name: string;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Check for existing authentication on app start
//     const currentUser = authService.getCurrentUser();
//     setUser(currentUser);
//     setIsLoading(false);
//   }, []);

//   const login = async (credentials: LoginCredentials): Promise<void> => {
//     setIsLoading(true);
//     try {
//       const user = await authService.login(credentials);
//       setUser(user);
//        setIsAuthenticated(true);
//     } catch (error) {
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const register = async (data: RegisterData): Promise<void> => {
//     setIsLoading(true);
//     try {
//       // For demo purposes, create a new user and set as current
//       const newUser: User = {
//         id: Date.now().toString(),
//         email: data.email,
//         name: data.name,
//         roles: ['end_user'],
//         subscriptionTier: 'free',
//         planType: 'freemium',
//         features: ['calendar', 'basic_booking'],
//         tenant_id: 'org_' + Date.now(),
//         segment: 'individual',
//         primaryRole: 'end_user',
//         avatar: undefined
//       };
      
//       // Simulate registration API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Store user
//       localStorage.setItem('demo_auth_user', JSON.stringify(newUser));
//       setUser(newUser);
      
//       // Trigger onboarding for new users
//       // This will be handled by the component that calls register
//     } catch (error) {
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = (): void => {
//     authService.logout();
//     setUser(null);
//   };

//   const value: AuthContextType = {
//     user,
//     login,
//     logout,
//     register,
//     isLoading,
//     isAuthenticated: user !== null
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };




import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to fetch current user:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const user = await authService.login(credentials);
      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    // Optional: implement if you expose a register endpoint
    throw new Error('Register method not implemented in backend');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isLoading,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
