
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Organization } from '@/services/platformDataService';
import { AppDispatch } from '@/store';
import { updateOrganization, deleteOrganization } from '@/store/slices/platformAdminSlice';
import { useToast } from '@/hooks/use-toast';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldOff, 
  Settings, 
  Eye, 
  AlertTriangle,
  Building,
  Users,
  Calendar,
  Crown,
  Pause,
  Play,
  RefreshCw
} from 'lucide-react';

interface OrganizationManagementTableProps {
  organizations: Organization[];
  loading: boolean;
  onEditOrganization: (org: Organization) => void;
}

export const OrganizationManagementTable: React.FC<OrganizationManagementTableProps> = ({
  organizations,
  loading,
  onEditOrganization
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState<Organization | null>(null);

  const handleOrgAction = async (orgId: string, action: string, updates?: Partial<Organization>) => {
    try {
      switch (action) {
        case 'suspend':
          dispatch(updateOrganization({ id: orgId, data: { isActive: false } }));
          toast({ title: "Organization suspended successfully" });
          break;
        case 'activate':
          dispatch(updateOrganization({ id: orgId, data: { isActive: true } }));
          toast({ title: "Organization activated successfully" });
          break;
        case 'upgrade-plan':
          // In real implementation, this would handle plan upgrades
          toast({ title: "Plan upgrade initiated" });
          break;
        case 'sync-billing':
          // In real implementation, this would sync with billing provider
          toast({ title: "Billing sync completed" });
          break;
        case 'view-details':
          // In real implementation, this would navigate to org details
          toast({ title: "Opening organization details" });
          break;
        default:
          if (updates) {
            dispatch(updateOrganization({ id: orgId, data: updates }));
            toast({ title: "Organization updated successfully" });
          }
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

  const handleDeleteOrganization = async () => {
    if (!orgToDelete) return;
    
    try {
      dispatch(deleteOrganization(orgToDelete.id));
      toast({ title: "Organization deleted successfully" });
      setDeleteDialogOpen(false);
      setOrgToDelete(null);
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to delete organization. Please try again.",
        variant: "destructive" 
      });
    }
  };

  const columns: ColumnDef<Organization>[] = [
    {
      accessorKey: "name",
      header: "Organization",
      cell: ({ row }) => {
        const org = row.original;
        return (
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">{org.name}</div>
              <div className="text-sm text-muted-foreground">{org.domain}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => {
        const plan = row.getValue("plan") as string;
        const planColors = {
          free: "bg-gray-100 text-gray-800",
          starter: "bg-blue-100 text-blue-800",
          professional: "bg-green-100 text-green-800",
          advanced: "bg-purple-100 text-purple-800",
          enterprise: "bg-red-100 text-red-800"
        };
        
        const planIcons = {
          free: null,
          starter: <Crown className="h-3 w-3 mr-1" />,
          professional: <Crown className="h-3 w-3 mr-1" />,
          advanced: <Crown className="h-3 w-3 mr-1" />,
          enterprise: <Crown className="h-3 w-3 mr-1" />
        };
        
        return (
          <Badge className={planColors[plan as keyof typeof planColors] || "bg-gray-100 text-gray-800"}>
            {planIcons[plan as keyof typeof planIcons]}
            {plan.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: "users",
      header: "Users",
      cell: ({ row }) => {
        const userCount = row.getValue("users") as number;
        return (
          <div className="flex items-center gap-2 min-w-[80px]">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{userCount}</span>
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
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string;
        const lastModified = row.original.lastModified;
        
        return (
          <div className="min-w-[120px]">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{new Date(createdAt).toLocaleDateString()}</span>
            </div>
            {lastModified && (
              <div className="text-xs text-muted-foreground">
                Modified: {new Date(lastModified).toLocaleDateString()}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const org = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Organization Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => onEditOrganization(org)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Organization
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => handleOrgAction(org.id, 'view-details')}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => handleOrgAction(org.id, 'sync-billing')}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Billing
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => handleOrgAction(org.id, 'upgrade-plan')}>
                <Crown className="mr-2 h-4 w-4" />
                Manage Plan
              </DropdownMenuItem>
              
              {org.isActive ? (
                <DropdownMenuItem 
                  onClick={() => handleOrgAction(org.id, 'suspend')}
                  className="text-yellow-600"
                >
                  <Pause className="mr-2 h-4 w-4" />
                  Suspend Organization
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  onClick={() => handleOrgAction(org.id, 'activate')}
                  className="text-green-600"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Activate Organization
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem 
                onClick={() => handleOrgAction(org.id, 'update', { 
                  lastModified: new Date().toISOString().split('T')[0] 
                })}
                className="text-orange-600"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Flag for Review
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => {
                  setOrgToDelete(org);
                  setDeleteDialogOpen(true);
                }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Organization
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filterableColumns = [
    {
      id: "plan",
      title: "Plan",
      options: [
        { value: "free", label: "Free" },
        { value: "starter", label: "Starter" },
        { value: "professional", label: "Professional" },
        { value: "advanced", label: "Advanced" },
        { value: "enterprise", label: "Enterprise" }
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
    { id: "name", title: "Organization Name" },
    { id: "domain", title: "Domain" }
  ];

  return (
    <>
      <GlobalDataTable
        data={organizations}
        columns={columns}
        loading={loading}
        filterableColumns={filterableColumns}
        searchableColumns={searchableColumns}
        searchPlaceholder="Search organizations by name or domain..."
        className="border rounded-lg"
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Organization</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {orgToDelete?.name}? This action cannot be undone 
              and will permanently remove the organization and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOrganization} className="bg-red-600 hover:bg-red-700">
              Delete Organization
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
