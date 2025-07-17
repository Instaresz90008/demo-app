
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Activity, 
  Settings,
  Search,
  Ban,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

interface PlatformStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  trialUsers: number;
  suspendedUsers: number;
  planDistribution: Record<string, number>;
}

const PlatformAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    trialUsers: 0,
    suspendedUsers: 0,
    planDistribution: {}
  });

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      totalUsers: 1247,
      activeSubscriptions: 892,
      totalRevenue: 45670,
      trialUsers: 156,
      suspendedUsers: 12,
      planDistribution: {
        freemium: 645,
        advanced_trial: 156,
        advanced: 234,
        professional: 167,
        enterprise: 45
      }
    });
  }, []);

  const handleUserAction = (action: string, userId?: string) => {
    console.log(`Platform Admin Action: ${action}`, userId);
    // Implement actual user management actions
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Platform Admin Dashboard</h1>
        <Badge variant="destructive" className="text-sm">
          <Shield className="h-3 w-3 mr-1" />
          SUPER ADMIN
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.suspendedUsers}</div>
            <p className="text-xs text-muted-foreground">Suspended accounts</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="plans">Plan Analytics</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Plan Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(stats.planDistribution).map(([plan, count]) => (
                  <div key={plan} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {plan.replace('_', ' ')}
                      </Badge>
                    </div>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleUserAction('search')}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Users
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleUserAction('impersonate')}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Impersonate User
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleUserAction('suspend')}
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Suspend Account
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleUserAction('settings')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Platform Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Advanced user management tools for platform administrators.
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm">View All Users</Button>
                <Button variant="outline" size="sm">Export User Data</Button>
                <Button variant="outline" size="sm">Bulk Actions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plan Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Detailed analytics and insights about subscription plans and revenue.
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm">Revenue Reports</Button>
                <Button variant="outline" size="sm">Conversion Analytics</Button>
                <Button variant="outline" size="sm">Churn Analysis</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Complete audit trail of all platform activities and user actions.
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm">View Recent Activity</Button>
                <Button variant="outline" size="sm">Security Events</Button>
                <Button variant="outline" size="sm">Export Logs</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlatformAdminDashboard;
