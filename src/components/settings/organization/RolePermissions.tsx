
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, Plus, Edit3, Trash2, Save, Users } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
}

export const RolePermissions: React.FC = () => {
  const { toast } = useToast();
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  const [permissions] = useState<Permission[]>([
    { id: 'users_read', name: 'View Users', description: 'View user profiles and information', category: 'User Management' },
    { id: 'users_write', name: 'Manage Users', description: 'Create, edit, and manage users', category: 'User Management' },
    { id: 'users_delete', name: 'Delete Users', description: 'Remove users from organization', category: 'User Management' },
    { id: 'events_read', name: 'View Events', description: 'View all events and calendar', category: 'Event Management' },
    { id: 'events_write', name: 'Manage Events', description: 'Create and edit events', category: 'Event Management' },
    { id: 'events_delete', name: 'Delete Events', description: 'Remove events and cancel bookings', category: 'Event Management' },
    { id: 'settings_read', name: 'View Settings', description: 'View organization settings', category: 'Settings' },
    { id: 'settings_write', name: 'Manage Settings', description: 'Modify organization configuration', category: 'Settings' },
    { id: 'billing_read', name: 'View Billing', description: 'View billing and subscription info', category: 'Billing' },
    { id: 'billing_write', name: 'Manage Billing', description: 'Manage billing and subscriptions', category: 'Billing' },
    { id: 'reports_read', name: 'View Reports', description: 'Access analytics and reports', category: 'Analytics' },
    { id: 'integrations_write', name: 'Manage Integrations', description: 'Configure third-party integrations', category: 'Integrations' }
  ]);

  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Organization Admin',
      description: 'Full access to all organization features and settings',
      permissions: permissions.map(p => p.id),
      userCount: 3,
      isSystem: true
    },
    {
      id: '2',
      name: 'Manager',
      description: 'Manage team members and events within department',
      permissions: ['users_read', 'users_write', 'events_read', 'events_write', 'reports_read'],
      userCount: 8,
      isSystem: false
    },
    {
      id: '3',
      name: 'Team Member',
      description: 'Basic access to view and manage own events',
      permissions: ['events_read', 'events_write', 'users_read'],
      userCount: 45,
      isSystem: true
    },
    {
      id: '4',
      name: 'Viewer',
      description: 'Read-only access to events and basic information',
      permissions: ['events_read', 'users_read'],
      userCount: 12,
      isSystem: false
    }
  ]);

  const handleCreateRole = () => {
    if (!newRole.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a role name.",
        variant: "destructive"
      });
      return;
    }

    const role: Role = {
      id: Date.now().toString(),
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      userCount: 0,
      isSystem: false
    };

    setRoles(prev => [...prev, role]);
    setNewRole({ name: '', description: '', permissions: [] });
    setShowCreateModal(false);
    
    toast({
      title: "Role Created",
      description: `"${role.name}" role has been created successfully.`,
    });
  };

  const handleEditRole = (role: Role) => {
    if (role.isSystem) {
      toast({
        title: "Cannot Edit",
        description: "System roles cannot be modified.",
        variant: "destructive"
      });
      return;
    }
    setEditingRole({ ...role });
  };

  const handleSaveRole = () => {
    if (!editingRole) return;

    setRoles(prev => prev.map(role => 
      role.id === editingRole.id ? editingRole : role
    ));
    setEditingRole(null);
    
    toast({
      title: "Role Updated",
      description: `"${editingRole.name}" role has been updated successfully.`,
    });
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    if (role.isSystem) {
      toast({
        title: "Cannot Delete",
        description: "System roles cannot be deleted.",
        variant: "destructive"
      });
      return;
    }

    if (role.userCount > 0) {
      toast({
        title: "Cannot Delete",
        description: "Cannot delete role that is assigned to users.",
        variant: "destructive"
      });
      return;
    }

    if (window.confirm(`Are you sure you want to delete the "${role.name}" role?`)) {
      setRoles(prev => prev.filter(r => r.id !== roleId));
      toast({
        title: "Role Deleted",
        description: `"${role.name}" role has been deleted.`,
      });
    }
  };

  const togglePermission = (permissionId: string, target: 'new' | 'edit') => {
    if (target === 'new') {
      setNewRole(prev => ({
        ...prev,
        permissions: prev.permissions.includes(permissionId)
          ? prev.permissions.filter(p => p !== permissionId)
          : [...prev.permissions, permissionId]
      }));
    } else if (editingRole) {
      setEditingRole(prev => prev ? {
        ...prev,
        permissions: prev.permissions.includes(permissionId)
          ? prev.permissions.filter(p => p !== permissionId)
          : [...prev.permissions, permissionId]
      } : null);
    }
  };

  const getPermissionsByCategory = () => {
    const categories: { [key: string]: Permission[] } = {};
    permissions.forEach(permission => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });
    return categories;
  };

  const permissionCategories = getPermissionsByCategory();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Roles & Permissions
          </h3>
          <p className="text-muted-foreground">Manage user roles and their permissions</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Role
        </Button>
      </div>

      {/* Roles List */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Organization Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {roles.map((role) => (
              <div key={role.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{role.name}</h4>
                    {role.isSystem && (
                      <Badge variant="secondary">System Role</Badge>
                    )}
                    <Badge variant="outline" className="gap-1">
                      <Users className="h-3 w-3" />
                      {role.userCount} users
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{role.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 3).map(permissionId => {
                      const permission = permissions.find(p => p.id === permissionId);
                      return permission ? (
                        <Badge key={permissionId} variant="outline" className="text-xs">
                          {permission.name}
                        </Badge>
                      ) : null;
                    })}
                    {role.permissions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{role.permissions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditRole(role)}
                    className="gap-2"
                    disabled={role.isSystem}
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteRole(role.id)}
                    className="gap-2 text-destructive hover:text-destructive"
                    disabled={role.isSystem || role.userCount > 0}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Role
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role Name</label>
                <Input
                  placeholder="Enter role name"
                  value={newRole.name}
                  onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Enter role description"
                  value={newRole.description}
                  onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>
              
              <div className="space-y-4">
                <label className="text-sm font-medium">Permissions</label>
                {Object.entries(permissionCategories).map(([category, categoryPermissions]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">{category}</h4>
                    <div className="grid grid-cols-1 gap-2 pl-4">
                      {categoryPermissions.map(permission => (
                        <div key={permission.id} className="flex items-start space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={newRole.permissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id, 'new')}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                              {permission.name}
                            </label>
                            <p className="text-xs text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateRole} className="flex-1">
                  Create Role
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Edit Role: {editingRole.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role Name</label>
                <Input
                  value={editingRole.name}
                  onChange={(e) => setEditingRole(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editingRole.description}
                  onChange={(e) => setEditingRole(prev => prev ? { ...prev, description: e.target.value } : null)}
                  rows={2}
                />
              </div>
              
              <div className="space-y-4">
                <label className="text-sm font-medium">Permissions</label>
                {Object.entries(permissionCategories).map(([category, categoryPermissions]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">{category}</h4>
                    <div className="grid grid-cols-1 gap-2 pl-4">
                      {categoryPermissions.map(permission => (
                        <div key={permission.id} className="flex items-start space-x-2">
                          <Checkbox
                            id={`edit-${permission.id}`}
                            checked={editingRole.permissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id, 'edit')}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label htmlFor={`edit-${permission.id}`} className="text-sm font-medium cursor-pointer">
                              {permission.name}
                            </label>
                            <p className="text-xs text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveRole} className="flex-1 gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setEditingRole(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
