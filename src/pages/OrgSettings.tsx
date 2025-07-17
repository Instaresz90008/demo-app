
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Users, Shield, Settings, Palette, Globe } from 'lucide-react';
import { OrganizationProfile } from '@/components/settings/organization/OrganizationProfile';
import { UserManagement } from '@/components/settings/organization/UserManagement';
import { RolePermissions } from '@/components/settings/organization/RolePermissions';
import { SecurityPolicies } from '@/components/settings/organization/SecurityPolicies';
import { BrandingSettings } from '@/components/settings/organization/BrandingSettings';
import { IntegrationSettings } from '@/components/settings/organization/IntegrationSettings';

const OrgSettings = () => {
  const [activeSection, setActiveSection] = useState('profile');

  return (
    <Layout title="Organization Settings">
      <div className="space-y-6 animate-fade-in">
        {/* Header Section */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              <div className="p-2 bg-gradient-to-tr from-orange-500 to-red-500 rounded-lg shadow-lg">
                <Building className="h-6 w-6 text-white" />
              </div>
              Organization Settings
            </h1>
            <p className="text-muted-foreground mt-1">Manage your organization configuration and policies</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-lg border border-orange-200 bg-gradient-to-tr from-white to-orange-50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-lg font-bold text-gray-900">248</p>
                </div>
                <div className="p-2 bg-orange-100 rounded-full">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs text-green-700 border-green-200 bg-green-50">
                  +15 this month
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border border-purple-200 bg-gradient-to-tr from-white to-purple-50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Roles</p>
                  <p className="text-lg font-bold text-gray-900">12</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs text-blue-700 border-blue-200 bg-blue-50">
                  Custom roles
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border border-blue-200 bg-gradient-to-tr from-white to-blue-50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Departments</p>
                  <p className="text-lg font-bold text-gray-900">8</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs text-green-700 border-green-200 bg-green-50">
                  Well organized
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border border-green-200 bg-gradient-to-tr from-white to-green-50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Security Score</p>
                  <p className="text-lg font-bold text-gray-900">95%</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs text-green-700 border-green-200 bg-green-50">
                  Excellent
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Settings Tabs */}
        <Card className="shadow-xl border border-orange-200 bg-gradient-to-tr from-white to-orange-50">
          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <div className="border-b border-orange-100 bg-white/80 backdrop-blur-sm">
              <TabsList className="grid w-full grid-cols-6 bg-transparent p-6">
                <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-orange-100">
                  <Building className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-blue-100">
                  <Users className="h-4 w-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="roles" className="gap-2 data-[state=active]:bg-purple-100">
                  <Shield className="h-4 w-4" />
                  Roles
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-red-100">
                  <Shield className="h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="branding" className="gap-2 data-[state=active]:bg-green-100">
                  <Palette className="h-4 w-4" />
                  Branding
                </TabsTrigger>
                <TabsTrigger value="integrations" className="gap-2 data-[state=active]:bg-cyan-100">
                  <Globe className="h-4 w-4" />
                  Integrations
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile" className="p-6">
              <OrganizationProfile />
            </TabsContent>

            <TabsContent value="users" className="p-6">
              <UserManagement />
            </TabsContent>

            <TabsContent value="roles" className="p-6">
              <RolePermissions />
            </TabsContent>

            <TabsContent value="security" className="p-6">
              <SecurityPolicies />
            </TabsContent>

            <TabsContent value="branding" className="p-6">
              <BrandingSettings />
            </TabsContent>

            <TabsContent value="integrations" className="p-6">
              <IntegrationSettings />
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        .animate-fade-in {
          animation: fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fade-in {
          from { 
            opacity: 0; 
            transform: translateY(20px);
          } 
          to {
            opacity: 1; 
            transform: none;
          }
        }
      `}</style>
    </Layout>
  );
};

export default OrgSettings;
