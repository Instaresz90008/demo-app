
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Shield, Bell, CreditCard, Palette, Globe } from 'lucide-react';
import { ProfileManagement } from '@/components/settings/personal/ProfileManagement';
import { SecurityManagement } from '@/components/settings/personal/SecurityManagement';
import { NotificationManagement } from '@/components/settings/personal/NotificationManagement';
import { BillingManagement } from '@/components/settings/personal/BillingManagement';
import { PreferencesManagement } from '@/components/settings/personal/PreferencesManagement';
import { IntegrationManagement } from '@/components/settings/personal/IntegrationManagement';

const PersonalSettings = () => {
  const [activeSection, setActiveSection] = useState('profile');

  return (
    <Layout title="Personal Settings">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
        <div className="content-container px-6 py-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  Personal Settings
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">Manage your personal account settings and preferences</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="shadow-lg border border-blue-200 bg-gradient-to-tr from-white to-blue-50 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Profile</p>
                      <p className="text-2xl font-bold text-gray-900">Active</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Badge variant="outline" className="text-xs text-green-700 border-green-200 bg-green-50">
                      Verified
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border border-purple-200 bg-gradient-to-tr from-white to-purple-50 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Security</p>
                      <p className="text-2xl font-bold text-gray-900">Strong</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Badge variant="outline" className="text-xs text-green-700 border-green-200 bg-green-50">
                      2FA Enabled
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border border-orange-200 bg-gradient-to-tr from-white to-orange-50 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Notifications</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Bell className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Badge variant="outline" className="text-xs text-blue-700 border-blue-200 bg-blue-50">
                      Configured
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border border-green-200 bg-gradient-to-tr from-white to-green-50 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Subscription</p>
                      <p className="text-2xl font-bold text-gray-900">Pro</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <CreditCard className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Badge variant="outline" className="text-xs text-green-700 border-green-200 bg-green-50">
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Settings Tabs */}
            <Card className="shadow-xl border border-blue-200 bg-gradient-to-tr from-white to-blue-50">
              <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
                <div className="sticky top-0 z-10 border-b border-blue-100 bg-white/90 backdrop-blur-sm">
                  <TabsList className="grid w-full grid-cols-6 bg-transparent p-6 gap-2">
                    <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-blue-100 px-4 py-3">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">Profile</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-purple-100 px-4 py-3">
                      <Shield className="h-4 w-4" />
                      <span className="hidden sm:inline">Security</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2 data-[state=active]:bg-orange-100 px-4 py-3">
                      <Bell className="h-4 w-4" />
                      <span className="hidden sm:inline">Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="gap-2 data-[state=active]:bg-green-100 px-4 py-3">
                      <CreditCard className="h-4 w-4" />
                      <span className="hidden sm:inline">Billing</span>
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="gap-2 data-[state=active]:bg-indigo-100 px-4 py-3">
                      <Palette className="h-4 w-4" />
                      <span className="hidden sm:inline">Preferences</span>
                    </TabsTrigger>
                    <TabsTrigger value="integrations" className="gap-2 data-[state=active]:bg-cyan-100 px-4 py-3">
                      <Globe className="h-4 w-4" />
                      <span className="hidden sm:inline">Integrations</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="max-h-[70vh] overflow-y-auto">
                  <TabsContent value="profile" className="p-6 m-0">
                    <ProfileManagement />
                  </TabsContent>

                  <TabsContent value="security" className="p-6 m-0">
                    <SecurityManagement />
                  </TabsContent>

                  <TabsContent value="notifications" className="p-6 m-0">
                    <NotificationManagement />
                  </TabsContent>

                  <TabsContent value="billing" className="p-6 m-0">
                    <BillingManagement />
                  </TabsContent>

                  <TabsContent value="preferences" className="p-6 m-0">
                    <PreferencesManagement />
                  </TabsContent>

                  <TabsContent value="integrations" className="p-6 m-0">
                    <IntegrationManagement />
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PersonalSettings;
