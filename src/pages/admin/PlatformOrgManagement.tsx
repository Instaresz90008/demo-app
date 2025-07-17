import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Building, Plus, Download } from 'lucide-react';
import { RootState, AppDispatch } from '@/store';
import { fetchOrganizations, createOrganization, updateOrganization, clearErrors } from '@/store/slices/platformAdminSlice';
import RequireRole from '@/components/auth/RequireRole';
import { Organization } from '@/services/platformDataService';
import { OrganizationManagementTable } from '@/components/admin/OrganizationManagementTable';

type PlanType = 'free' | 'starter' | 'professional' | 'advanced' | 'enterprise';

const PlatformOrgManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { organizations } = useSelector((state: RootState) => state.platformAdmin);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    plan: 'free' as PlanType,
    isActive: true
  });

  useEffect(() => {
    dispatch(fetchOrganizations());
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  const handleCreateOrganization = async () => {
    if (!formData.name || !formData.domain) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      await dispatch(createOrganization({
        name: formData.name,
        domain: formData.domain,
        plan: formData.plan,
        isActive: formData.isActive,
        users: 0,
        createdAt: new Date().toISOString()
      }));

      setIsCreateModalOpen(false);
      resetForm();
      toast({
        title: "Organization Created",
        description: `Organization ${formData.name} has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create organization. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditOrganization = (org: Organization) => {
    setSelectedOrg(org);
    setFormData({
      name: org.name,
      domain: org.domain,
      plan: org.plan as PlanType,
      isActive: org.isActive
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateOrganization = async () => {
    if (!selectedOrg) return;

    try {
      await dispatch(updateOrganization({
        id: selectedOrg.id,
        data: {
          name: formData.name,
          domain: formData.domain,
          plan: formData.plan,
          isActive: formData.isActive
        }
      }));

      setIsEditModalOpen(false);
      setSelectedOrg(null);
      resetForm();
      toast({
        title: "Organization Updated",
        description: `Organization ${formData.name} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update organization. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      domain: '',
      plan: 'free',
      isActive: true
    });
  };

  const handleExportOrganizations = () => {
    const csvContent = [
      ['Name', 'Domain', 'Plan', 'Users', 'Status', 'Created'],
      ...organizations.map(org => [
        org.name,
        org.domain,
        org.plan,
        org.users.toString(),
        org.isActive ? 'Active' : 'Suspended',
        org.createdAt
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'platform-organizations.csv';
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
              <Building className="h-6 w-6" />
              Platform Organization Management
            </h3>
            <p className="text-muted-foreground">
              Comprehensive organization management with advanced controls
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportOrganizations}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Organization
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Organization</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Organization Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter organization name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain *</Label>
                    <Input
                      id="domain"
                      value={formData.domain}
                      onChange={(e) => setFormData({...formData, domain: e.target.value})}
                      placeholder="Enter domain (e.g., company.com)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plan">Subscription Plan</Label>
                    <Select value={formData.plan} onValueChange={(value: PlanType) => setFormData({...formData, plan: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="starter">Starter</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateOrganization} className="flex-1">
                      Create Organization
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
              <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{organizations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Organizations</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{organizations.filter(o => o.isActive).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enterprise Plans</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{organizations.filter(o => o.plan === 'enterprise').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{organizations.reduce((sum, org) => sum + org.users, 0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Organization Management Table */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Management</CardTitle>
          </CardHeader>
          <CardContent>
            <OrganizationManagementTable
              organizations={organizations}
              loading={false}
              onEditOrganization={handleEditOrganization}
            />
          </CardContent>
        </Card>

        {/* Edit Organization Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Organization</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Organization Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter organization name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-domain">Domain *</Label>
                <Input
                  id="edit-domain"
                  value={formData.domain}
                  onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  placeholder="Enter domain"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-plan">Subscription Plan</Label>
                <Select value={formData.plan} onValueChange={(value: PlanType) => setFormData({...formData, plan: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="edit-isActive">Active Organization</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleUpdateOrganization} className="flex-1">
                  Update Organization
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedOrg(null);
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

export default PlatformOrgManagement;
