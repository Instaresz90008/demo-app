
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  orgName: string;
  orgId: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  plan: string;
  users: number;
  isActive: boolean;
  createdAt: string;
  lastModified?: string;
}

// Mock data
let mockUsers: User[] = [
  {
    id: '1',
    name: 'Platform Administrator',
    email: 'admin@platform.com',
    role: 'platform_admin',
    orgName: 'Platform Organization',
    orgId: '1',
    isActive: true,
    lastLogin: '2025-01-10',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'org_admin',
    orgName: 'Company Organization',
    orgId: '2',
    isActive: true,
    lastLogin: '2025-01-09',
    createdAt: '2024-02-15'
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane.smith@startup.com',
    role: 'team_admin',
    orgName: 'Startup Inc',
    orgId: '3',
    isActive: true,
    lastLogin: '2025-01-08',
    createdAt: '2024-03-10'
  }
];

let mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Platform Organization',
    domain: 'platform.com',
    plan: 'enterprise',
    users: 1,
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Company Organization',
    domain: 'company.com',
    plan: 'professional',
    users: 45,
    isActive: true,
    createdAt: '2024-02-15'
  },
  {
    id: '3',
    name: 'Startup Inc',
    domain: 'startup.com',
    plan: 'advanced',
    users: 12,
    isActive: true,
    createdAt: '2024-03-10'
  }
];

export const platformDataService = {
  // User management
  getUsers: (): User[] => {
    return [...mockUsers];
  },

  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): User => {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    };
    mockUsers.push(newUser);
    return newUser;
  },

  updateUser: (userId: string, updates: Partial<User>): User | null => {
    const index = mockUsers.findIndex(user => user.id === userId);
    if (index === -1) return null;
    
    mockUsers[index] = { ...mockUsers[index], ...updates };
    return mockUsers[index];
  },

  deleteUser: (userId: string): boolean => {
    const index = mockUsers.findIndex(user => user.id === userId);
    if (index === -1) return false;
    
    mockUsers.splice(index, 1);
    return true;
  },

  // Organization management
  getOrganizations: (): Organization[] => {
    return [...mockOrganizations];
  },

  createOrganization: (orgData: Omit<Organization, 'id' | 'createdAt' | 'users'>): Organization => {
    const newOrg: Organization = {
      ...orgData,
      id: `org_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      users: 0
    };
    mockOrganizations.push(newOrg);
    return newOrg;
  },

  updateOrganization: (orgId: string, updates: Partial<Organization>): Organization | null => {
    const index = mockOrganizations.findIndex(org => org.id === orgId);
    if (index === -1) return null;
    
    mockOrganizations[index] = { ...mockOrganizations[index], ...updates };
    return mockOrganizations[index];
  },

  deleteOrganization: (orgId: string): boolean => {
    const index = mockOrganizations.findIndex(org => org.id === orgId);
    if (index === -1) return false;
    
    // Check if organization has users
    const hasUsers = mockUsers.some(user => user.orgId === orgId);
    if (hasUsers) {
      throw new Error('Cannot delete organization with active users');
    }
    
    mockOrganizations.splice(index, 1);
    return true;
  },

  // Statistics
  getStats: () => {
    return {
      totalUsers: mockUsers.length,
      totalOrganizations: mockOrganizations.length,
      activeUsers: mockUsers.filter(u => u.isActive).length,
      activeOrganizations: mockOrganizations.filter(o => o.isActive).length
    };
  }
};

export default platformDataService;
