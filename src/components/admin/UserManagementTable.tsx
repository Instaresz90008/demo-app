
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { GlobalDataTable } from '@/components/global/GlobalDataTable';
import { User } from '@/services/platformDataService';
import { AppDispatch } from '@/store';
import { updateUser, deleteUser } from '@/store/slices/platformAdminSlice';
import { useToast } from '@/hooks/use-toast';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldOff, 
  Key, 
  Eye, 
  AlertTriangle,
  UserX,
  Mail,
  Clock
} from 'lucide-react';

interface UserManagementTableProps {
  users: User[];
  loading: boolean;
  onEditUser: (user: User) => void;
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  loading,
  onEditUser
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleUserAction = async (userId: string, action: string, updates?: Partial<User>) => {
    try {
      switch (action) {
        case 'suspend':
          await dispatch(updateUser({ id: userId, data: { isActive: false } }));
          toast({ title: "User suspended successfully" });
          break;
        case 'activate':
          await dispatch(updateUser({ id: userId, data: { isActive: true } }));
          toast({ title: "User activated successfully" });
          break;
        case 'reset-password':
          // In real implementation, this would trigger a password reset email
          toast({ title: "Password reset email sent" });
          break;
        case 'impersonate':
          // In real implementation, this would start impersonation session
          toast({ title: "Impersonation session started", description: "You are now viewing as this user" });
          break;
        case 'flag-suspicious':
          await dispatch(updateUser({ id: userId, data: { ...updates, role: 'flagged_user' } }));
          toast({ title: "User flagged as suspicious" });
          break;
        default:
          break;
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to perform action. Please try again.",
        variant: "destructive" 
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await dispatch(deleteUser(userToDelete.id));
      toast({ title: "User deleted successfully" });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to delete user. Please try again.",
        variant: "destructive" 
      });
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3 min-w-[200px]">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        const roleColors = {
          platform_admin: "bg-red-100 text-red-800",
          org_admin: "bg-blue-100 text-blue-800",
          team_admin: "bg-green-100 text-green-800",
          end_user: "bg-gray-100 text-gray-800",
          flagged_user: "bg-yellow-100 text-yellow-800"
        };
        return (
          <Badge className={roleColors[role as keyof typeof roleColors] || "bg-gray-100 text-gray-800"}>
            {role.replace('_', ' ').toUpperCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: "orgName",
      header: "Organization",
      cell: ({ row }) => {
        const orgName = row.getValue("orgName") as string;
        return (
          <div className="min-w-[150px]">
            <div className="font-medium">{orgName}</div>
            <div className="text-xs text-muted-foreground">ID: {row.original.orgId}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Suspended"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "lastLogin",
      header: "Last Login",
      cell: ({ row }) => {
        const lastLogin = row.getValue("lastLogin") as string;
        const isRecent = lastLogin !== 'Never' && 
          new Date(lastLogin) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        return (
          <div className="flex items-center gap-2 min-w-[120px]">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className={isRecent ? "text-green-600" : "text-muted-foreground"}>
              {lastLogin === 'Never' ? 'Never' : new Date(lastLogin).toLocaleDateString()}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string;
        return (
          <div className="text-sm text-muted-foreground min-w-[100px]">
            {new Date(createdAt).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>User Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => onEditUser(user)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'impersonate')}>
                <Eye className="mr-2 h-4 w-4" />
                Impersonate User
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'reset-password')}>
                <Key className="mr-2 h-4 w-4" />
                Reset Password
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => {
                const recipient = `mailto:${user.email}`;
                window.open(recipient, '_blank');
              }}>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {user.isActive ? (
                <DropdownMenuItem 
                  onClick={() => handleUserAction(user.id, 'suspend')}
                  className="text-yellow-600"
                >
                  <UserX className="mr-2 h-4 w-4" />
                  Suspend User
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  onClick={() => handleUserAction(user.id, 'activate')}
                  className="text-green-600"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Activate User
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem 
                onClick={() => handleUserAction(user.id, 'flag-suspicious')}
                className="text-orange-600"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Flag Suspicious
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => {
                  setUserToDelete(user);
                  setDeleteDialogOpen(true);
                }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filterableColumns = [
    {
      id: "role",
      title: "Role",
      options: [
        { value: "platform_admin", label: "Platform Admin" },
        { value: "org_admin", label: "Org Admin" },
        { value: "team_admin", label: "Team Admin" },
        { value: "end_user", label: "End User" },
        { value: "flagged_user", label: "Flagged User" }
      ]
    },
    {
      id: "isActive",
      title: "Status",
      options: [
        { value: "true", label: "Active" },
        { value: "false", label: "Suspended" }
      ]
    }
  ];

  const searchableColumns = [
    { id: "name", title: "Name" },
    { id: "email", title: "Email" }
  ];

  return (
    <>
      <GlobalDataTable
        data={users}
        columns={columns}
        loading={loading}
        filterableColumns={filterableColumns}
        searchableColumns={searchableColumns}
        searchPlaceholder="Search users by name or email..."
        className="border rounded-lg"
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {userToDelete?.name}? This action cannot be undone 
              and will permanently remove all user data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
