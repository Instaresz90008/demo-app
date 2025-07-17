
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, Search, Edit3, Trash2, Mail, UserPlus, Filter } from 'lucide-react';

interface OrgUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  avatar?: string;
  joinDate: string;
}

export const UserManagement: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('');

  const [users, setUsers] = useState<OrgUser[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@techcorp.com',
      role: 'Admin',
      department: 'Engineering',
      status: 'active',
      lastLogin: '2024-06-15T14:30:00Z',
      joinDate: '2024-01-15',
      avatar: null
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@techcorp.com',
      role: 'Manager',
      department: 'Product',
      status: 'active',
      lastLogin: '2024-06-14T16:20:00Z',
      joinDate: '2024-02-01',
      avatar: null
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@techcorp.com',
      role: 'Developer',
      department: 'Engineering',
      status: 'inactive',
      lastLogin: '2024-06-10T12:15:00Z',
      joinDate: '2024-03-10',
      avatar: null
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david@techcorp.com',
      role: 'Designer',
      department: 'Design',
      status: 'pending',
      lastLogin: 'Never',
      joinDate: '2024-06-15',
      avatar: null
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleInviteUser = () => {
    if (!inviteEmail || !inviteRole) {
      toast({
        title: "Missing Information",
        description: "Please provide both email and role for the invitation.",
        variant: "destructive"
      });
      return;
    }

    const newUser: OrgUser = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      department: 'Unassigned',
      status: 'pending',
      lastLogin: 'Never',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: null
    };

    setUsers(prev => [...prev, newUser]);
    setInviteEmail('');
    setInviteRole('');
    setShowInviteModal(false);
    
    toast({
      title: "Invitation Sent",
      description: `Invitation has been sent to ${inviteEmail}.`,
    });
  };

  const handleEditUser = (userId: string) => {
    toast({
      title: "Edit User",
      description: "User edit functionality would be implemented here.",
    });
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (window.confirm(`Are you sure you want to remove ${user.name} from the organization?`)) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast({
        title: "User Removed",
        description: `${user.name} has been removed from the organization.`,
      });
    }
  };

  const handleResendInvite = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      toast({
        title: "Invitation Resent",
        description: `Invitation has been resent to ${user.email}.`,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastLogin = (lastLogin: string) => {
    if (lastLogin === 'Never') return 'Never';
    const date = new Date(lastLogin);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </h3>
          <p className="text-muted-foreground">Manage organization members and their access</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Invite User
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Filter className="h-4 w-4" />
                <span>Filters:</span>
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Organization Members ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{user.name}</h4>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{user.role} • {user.department}</span>
                      <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
                      <span>Last login: {formatLastLogin(user.lastLogin)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResendInvite(user.id)}
                      className="gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Resend
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditUser(user.id)}
                    className="gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No users found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Invite New User
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Designer">Designer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleInviteUser} className="flex-1">
                  Send Invitation
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowInviteModal(false)}
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
