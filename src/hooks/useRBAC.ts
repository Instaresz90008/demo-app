import { useSelector } from 'react-redux';
import { useAuth } from '@/contexts/AuthContext';
import { RootState } from '@/store';

export const useRBAC = () => {
  const { user } = useAuth();
  const { roles, permissions, userRoles } = useSelector((state: RootState) => state.rbac);

  const hasPermission = (permissionId: string): boolean => {
    if (!user) return false;

    // Platform admin has all permissions
    if (user.roles?.includes('platform_admin')) return true;

    // Get user's roles
    const userRoleIds = user.roles || [];
    
    // Check if any of user's roles have the required permission
    return userRoleIds.some(roleId => {
      const role = roles.find(r => r.id === roleId);
      return role?.permissions.includes(permissionId) || role?.permissions.includes('*');
    });
  };

  const hasRole = (roleId: string): boolean => {
    if (!user) return false;
    return user.roles?.includes(roleId) || false;
  };

  const hasAnyRole = (roleIds: string[]): boolean => {
    if (!user) return false;
    return roleIds.some(roleId => user.roles?.includes(roleId));
  };

  const canAccess = (resource: string, action: string): boolean => {
    const permissionId = `${resource}:${action}`;
    return hasPermission(permissionId);
  };

  const getUserPermissions = (): string[] => {
    if (!user) return [];
    
    // Platform admin has all permissions
    if (user.roles?.includes('platform_admin')) {
      return permissions.map(p => p.id);
    }

    const userRoleIds = user.roles || [];
    const userPermissions = new Set<string>();

    userRoleIds.forEach(roleId => {
      const role = roles.find(r => r.id === roleId);
      if (role) {
        role.permissions.forEach(permission => {
          if (permission === '*') {
            // Add all permissions
            permissions.forEach(p => userPermissions.add(p.id));
          } else {
            userPermissions.add(permission);
          }
        });
      }
    });

    return Array.from(userPermissions);
  };

  const getUserRoles = () => {
    if (!user) return [];
    return user.roles?.map(roleId => roles.find(r => r.id === roleId)).filter(Boolean) || [];
  };

  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    canAccess,
    getUserPermissions,
    getUserRoles,
    roles,
    permissions
  };
};