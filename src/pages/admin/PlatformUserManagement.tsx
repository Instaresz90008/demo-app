import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Download, Upload } from 'lucide-react';
import { RootState, AppDispatch } from '@/store';
import { fetchUsers, createUser, updateUser, clearErrors } from '@/store/slices/platformAdminSlice';
import RequireRole from '@/components/auth/RequireRole';
import { User } from '@/services/platformDataService';
import { UserManagementTable } from '@/components/admin/UserManagementTable';

const PlatformUserManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { users } = useSelector((state: RootState) => state.platformAdmin);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    orgName: '',
    orgId: '',
    isActive: true
  });

  useEffect(() => {
    dispatch(fetchUsers());
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  const handleCreateUser = async () => {
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      await dispatch(createUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        orgName: formData.orgName || 'Platform Organization',
        orgId: formData.orgId || '1',
        isActive: formData.isActive,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isPlatformUser: true
      }));

      setIsCreateModalOpen(false);
      resetForm();
      toast({
        title: "User Created",
        description: `User ${formData.name} has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      orgName: user.orgName,
      orgId: user.orgId,
      isActive: user.isActive
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      await dispatch(updateUser({
        id: selectedUser.id,
        data: {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          orgName: formData.orgName,
          orgId: formData.orgId,
          isActive: formData.isActive
        }
      }));

      setIsEditModalOpen(false);
      setSelectedUser(null);
      resetForm();
      toast({
        title: "User Updated",
        description: `User ${formData.name} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: '',
      orgName: '',
      orgId: '',
      isActive: true
    });
  };

  const handleExportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Organization', 'Status', 'Last Login', 'Created'],
      ...users.map(user => [
        user.name,
        user.email,
        user.role,
        user.orgName,
        user.isActive ? 'Active' : 'Suspended',
        user.lastLogin,
        user.createdAt
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'platform-users.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <RequireRole role="platform_admin" showUI>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" />
              Platform User Management
            </h3>
            <p className="text-muted-foreground">
              Comprehensive user management with advanced filtering and actions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportUsers}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="platform_admin">Platform Admin</SelectItem>
                        <SelectItem value="org_admin">Organization Admin</SelectItem>
                        <SelectItem value="team_admin">Team Admin</SelectItem>
                        <SelectItem value="end_user">End User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input
                      id="orgName"
                      value={formData.orgName}
                      onChange={(e) => setFormData({...formData, orgName: e.target.value})}
                      placeholder="Enter organization name"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateUser} className="flex-1">
                      Create User
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsCreateModalOpen(false);
                        resetForm();
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter(u => u.isActive).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Admins</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter(u => u.role === 'platform_admin').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Org Admins</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter(u => u.role === 'org_admin').length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced User Management Table */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <UserManagementTable
              users={users}
              loading={false}
              onEditUser={handleEditUser}
            />
          </CardContent>
        </Card>

        {/* Edit User Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="platform_admin">Platform Admin</SelectItem>
                    <SelectItem value="org_admin">Organization Admin</SelectItem>
                    <SelectItem value="team_admin">Team Admin</SelectItem>
                    <SelectItem value="end_user">End User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-orgName">Organization Name</Label>
                <Input
                  id="edit-orgName"
                  value={formData.orgName}
                  onChange={(e) => setFormData({...formData, orgName: e.target.value})}
                  placeholder="Enter organization name"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="edit-isActive">Active User</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleUpdateUser} className="flex-1">
                  Update User
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </RequireRole>
  );
};

export default PlatformUserManagement;
