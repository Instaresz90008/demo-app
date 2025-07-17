
import { eventBus, EVENT_NAMES } from '@/lib/eventBus';

export interface Department {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  managerId?: string;
  orgId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
  category: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  orgId: string;
  permissions: string[];
  isSystemRole: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrgUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  departmentId?: string;
  departmentName?: string;
  roleIds: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationContext {
  id: string;
  name: string;
  logo?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
  };
  welcomeMessage: string;
  settings: {
    allowDepartmentCreation: boolean;
    requireApprovalForRoles: boolean;
    maxUsersPerDepartment: number;
  };
}

class OrganizationDataService {
  private departments: Map<string, Department[]> = new Map();
  private users: Map<string, OrgUser[]> = new Map();
  private roles: Map<string, Role[]> = new Map();
  private organizationContexts: Map<string, OrganizationContext> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock permissions
    const permissions: Permission[] = [
      { id: 'users_read', name: 'View Users', resource: 'users', action: 'read', description: 'View user information', category: 'User Management' },
      { id: 'users_write', name: 'Manage Users', resource: 'users', action: 'write', description: 'Create and edit users', category: 'User Management' },
      { id: 'users_delete', name: 'Delete Users', resource: 'users', action: 'delete', description: 'Delete user accounts', category: 'User Management' },
      { id: 'departments_read', name: 'View Departments', resource: 'departments', action: 'read', description: 'View department structure', category: 'Department Management' },
      { id: 'departments_write', name: 'Manage Departments', resource: 'departments', action: 'write', description: 'Create and edit departments', category: 'Department Management' },
      { id: 'roles_read', name: 'View Roles', resource: 'roles', action: 'read', description: 'View role configurations', category: 'Role Management' },
      { id: 'roles_write', name: 'Manage Roles', resource: 'roles', action: 'write', description: 'Create and edit roles', category: 'Role Management' },
      { id: 'settings_read', name: 'View Settings', resource: 'settings', action: 'read', description: 'View organization settings', category: 'Settings' },
      { id: 'settings_write', name: 'Manage Settings', resource: 'settings', action: 'write', description: 'Modify organization settings', category: 'Settings' }
    ];
    
    // Mock organization contexts
    this.organizationContexts.set('company-org', {
      id: 'company-org',
      name: 'TechCorp Solutions',
      logo: '🏢',
      theme: {
        primaryColor: '#3b82f6',
        secondaryColor: '#1e40af',
        logoUrl: undefined
      },
      welcomeMessage: 'Welcome to TechCorp Solutions',
      settings: {
        allowDepartmentCreation: true,
        requireApprovalForRoles: false,
        maxUsersPerDepartment: 50
      }
    });

    this.organizationContexts.set('startup-org', {
      id: 'startup-org',
      name: 'Startup Innovations',
      logo: '🚀',
      theme: {
        primaryColor: '#10b981',
        secondaryColor: '#059669'
      },
      welcomeMessage: 'Innovation starts here!',
      settings: {
        allowDepartmentCreation: true,
        requireApprovalForRoles: true,
        maxUsersPerDepartment: 20
      }
    });

    // Mock departments for company-org
    this.departments.set('company-org', [
      {
        id: 'dept-eng',
        name: 'Engineering',
        description: 'Software development and technical operations',
        orgId: 'company-org',
        managerId: 'user-1',
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'dept-product',
        name: 'Product',
        description: 'Product management and strategy',
        orgId: 'company-org',
        managerId: 'user-2',
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'dept-sales',
        name: 'Sales',
        description: 'Sales and business development',
        orgId: 'company-org',
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      }
    ]);

    // Mock roles for company-org
    this.roles.set('company-org', [
      {
        id: 'role-admin',
        name: 'Department Admin',
        description: 'Full access to department management',
        orgId: 'company-org',
        permissions: ['users_read', 'users_write', 'departments_read', 'departments_write', 'roles_read'],
        isSystemRole: false,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'role-manager',
        name: 'Team Manager',
        description: 'Manage team members and basic operations',
        orgId: 'company-org',
        permissions: ['users_read', 'users_write', 'departments_read'],
        isSystemRole: false,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'role-member',
        name: 'Team Member',
        description: 'Basic access to organizational resources',
        orgId: 'company-org',
        permissions: ['users_read', 'departments_read'],
        isSystemRole: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      }
    ]);

    // Mock users for company-org
    this.users.set('company-org', [
      {
        id: 'user-1',
        name: 'Alice Johnson',
        email: 'alice@techcorp.com',
        departmentId: 'dept-eng',
        departmentName: 'Engineering',
        roleIds: ['role-admin'],
        isActive: true,
        lastLogin: '2024-06-10T14:30:00Z',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-06-10T14:30:00Z'
      },
      {
        id: 'user-2',
        name: 'Bob Smith',
        email: 'bob@techcorp.com',
        departmentId: 'dept-product',
        departmentName: 'Product',
        roleIds: ['role-manager'],
        isActive: true,
        lastLogin: '2024-06-09T16:20:00Z',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-06-09T16:20:00Z'
      },
      {
        id: 'user-3',
        name: 'Carol Davis',
        email: 'carol@techcorp.com',
        departmentId: 'dept-eng',
        departmentName: 'Engineering',
        roleIds: ['role-member'],
        isActive: true,
        lastLogin: '2024-06-08T12:15:00Z',
        createdAt: '2024-02-01T10:00:00Z',
        updatedAt: '2024-06-08T12:15:00Z'
      }
    ]);
  }

  // Organization Context Methods
  getOrganizationContext(orgId: string): OrganizationContext | null {
    return this.organizationContexts.get(orgId) || null;
  }

  updateOrganizationContext(orgId: string, updates: Partial<OrganizationContext>): boolean {
    const existing = this.organizationContexts.get(orgId);
    if (!existing) return false;

    this.organizationContexts.set(orgId, { ...existing, ...updates });
    eventBus.emit('organization_context_updated', { orgId, context: this.organizationContexts.get(orgId) });
    return true;
  }

  // Department Methods
  getDepartments(orgId: string): Department[] {
    return this.departments.get(orgId) || [];
  }

  createDepartment(orgId: string, departmentData: Omit<Department, 'id' | 'orgId' | 'createdAt' | 'updatedAt'>): Department {
    const newDepartment: Department = {
      ...departmentData,
      id: `dept-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      orgId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const departments = this.getDepartments(orgId);
    departments.push(newDepartment);
    this.departments.set(orgId, departments);

    console.log(`🏢 Created department: ${newDepartment.name} in org ${orgId}`);
    return newDepartment;
  }

  updateDepartment(orgId: string, departmentId: string, updates: Partial<Department>): boolean {
    const departments = this.getDepartments(orgId);
    const index = departments.findIndex(d => d.id === departmentId);
    
    if (index === -1) return false;

    departments[index] = {
      ...departments[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.departments.set(orgId, departments);
    console.log(`🏢 Updated department: ${departmentId} in org ${orgId}`);
    return true;
  }

  deleteDepartment(orgId: string, departmentId: string): boolean {
    const departments = this.getDepartments(orgId);
    const filtered = departments.filter(d => d.id !== departmentId);
    
    if (filtered.length === departments.length) return false;

    this.departments.set(orgId, filtered);
    console.log(`🗑️ Deleted department: ${departmentId} from org ${orgId}`);
    return true;
  }

  // User Methods
  getUsers(orgId: string): OrgUser[] {
    return this.users.get(orgId) || [];
  }

  createUser(orgId: string, userData: Omit<OrgUser, 'id' | 'createdAt' | 'updatedAt'>): OrgUser {
    const newUser: OrgUser = {
      ...userData,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const users = this.getUsers(orgId);
    users.push(newUser);
    this.users.set(orgId, users);

    console.log(`👤 Created user: ${newUser.name} in org ${orgId}`);
    return newUser;
  }

  updateUser(orgId: string, userId: string, updates: Partial<OrgUser>): boolean {
    const users = this.getUsers(orgId);
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) return false;

    users[index] = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.users.set(orgId, users);
    console.log(`👤 Updated user: ${userId} in org ${orgId}`);
    return true;
  }

  deleteUser(orgId: string, userId: string): boolean {
    const users = this.getUsers(orgId);
    const filtered = users.filter(u => u.id !== userId);
    
    if (filtered.length === users.length) return false;

    this.users.set(orgId, filtered);
    console.log(`🗑️ Deleted user: ${userId} from org ${orgId}`);
    return true;
  }

  // Role Methods
  getRoles(orgId: string): Role[] {
    return this.roles.get(orgId) || [];
  }

  getAvailablePermissions(): Permission[] {
    return [
      { id: 'users_read', name: 'View Users', resource: 'users', action: 'read', description: 'View user information', category: 'User Management' },
      { id: 'users_write', name: 'Manage Users', resource: 'users', action: 'write', description: 'Create and edit users', category: 'User Management' },
      { id: 'users_delete', name: 'Delete Users', resource: 'users', action: 'delete', description: 'Delete user accounts', category: 'User Management' },
      { id: 'departments_read', name: 'View Departments', resource: 'departments', action: 'read', description: 'View department structure', category: 'Department Management' },
      { id: 'departments_write', name: 'Manage Departments', resource: 'departments', action: 'write', description: 'Create and edit departments', category: 'Department Management' },
      { id: 'roles_read', name: 'View Roles', resource: 'roles', action: 'read', description: 'View role configurations', category: 'Role Management' },
      { id: 'roles_write', name: 'Manage Roles', resource: 'roles', action: 'write', description: 'Create and edit roles', category: 'Role Management' },
      { id: 'settings_read', name: 'View Settings', resource: 'settings', action: 'read', description: 'View organization settings', category: 'Settings' },
      { id: 'settings_write', name: 'Manage Settings', resource: 'settings', action: 'write', description: 'Modify organization settings', category: 'Settings' }
    ];
  }

  createRole(orgId: string, roleData: Omit<Role, 'id' | 'orgId' | 'createdAt' | 'updatedAt'>): Role {
    const newRole: Role = {
      ...roleData,
      id: `role-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      orgId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const roles = this.getRoles(orgId);
    roles.push(newRole);
    this.roles.set(orgId, roles);

    console.log(`🛡️ Created role: ${newRole.name} in org ${orgId}`);
    return newRole;
  }

  updateRole(orgId: string, roleId: string, updates: Partial<Role>): boolean {
    const roles = this.getRoles(orgId);
    const index = roles.findIndex(r => r.id === roleId);
    
    if (index === -1) return false;

    roles[index] = {
      ...roles[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.roles.set(orgId, roles);
    console.log(`🛡️ Updated role: ${roleId} in org ${orgId}`);
    return true;
  }

  deleteRole(orgId: string, roleId: string): boolean {
    const roles = this.getRoles(orgId);
    const role = roles.find(r => r.id === roleId);
    
    if (!role || role.isSystemRole) return false;

    const filtered = roles.filter(r => r.id !== roleId);
    this.roles.set(orgId, filtered);
    console.log(`🗑️ Deleted role: ${roleId} from org ${orgId}`);
    return true;
  }
}

export const organizationDataService = new OrganizationDataService();
