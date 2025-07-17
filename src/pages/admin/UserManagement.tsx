
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Settings, TrendingUp, ArrowRight } from 'lucide-react';
import RequireRole from '@/components/auth/RequireRole';
import { RootState, AppDispatch } from '@/store';
import { fetchStats } from '@/store/slices/platformAdminSlice';
import { useNavigate } from 'react-router-dom';

const UserManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { stats } = useSelector((state: RootState) => state.platformAdmin);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  const managementCards = [
    {
      title: 'User Management',
      description: 'Manage individual users, roles, and permissions across the platform.',
      icon: Users,
      href: '/admin/users',
      stats: `${stats.totalUsers} total users`,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'Organization Management',
      description: 'Manage organizations, subscription plans, and organizational settings.',
      icon: Shield,
      href: '/admin/organizations',
      stats: `${stats.totalOrganizations} organizations`,
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      title: 'System Settings',
      description: 'Configure platform-wide settings, feature flags, and system controls.',
      icon: Settings,
      href: '/admin/settings',
      stats: 'Platform configuration',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  return (
    <RequireRole role="platform_admin" showUI>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Platform Administration</h1>
            <p className="text-muted-foreground">Central hub for platform management and oversight</p>
          </div>
        </div>
        
        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Across all organizations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">{Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organizations</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrganizations}</div>
              <p className="text-xs text-muted-foreground">Total organizations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orgs</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeOrganizations}</div>
              <p className="text-xs text-muted-foreground">{Math.round((stats.activeOrganizations / stats.totalOrganizations) * 100)}% active</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Management Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managementCards.map((card) => (
            <Card key={card.href} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${card.color}`}>
                    <card.icon className="h-5 w-5" />
                  </div>
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {card.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {card.stats}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(card.href)}
                    className="flex items-center gap-2"
                  >
                    Access
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Platform Administration Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Administration Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                This administrative interface is only accessible to platform administrators. 
                You have full access to manage users, organizations, and system-wide settings.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Full User Access
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Organization Management
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  System Administration
                </Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  Security & Audit
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <Button variant="ghost" asChild className="h-auto p-4 flex-col">
                  <a href="/admin/security" className="text-center">
                    <Shield className="h-6 w-6 mb-2 mx-auto" />
                    <span className="text-sm">Security Monitor</span>
                  </a>
                </Button>
                <Button variant="ghost" asChild className="h-auto p-4 flex-col">
                  <a href="/admin/audit-logs" className="text-center">
                    <Settings className="h-6 w-6 mb-2 mx-auto" />
                    <span className="text-sm">Audit Logs</span>
                  </a>
                </Button>
                <Button variant="ghost" asChild className="h-auto p-4 flex-col">
                  <a href="/cleanup" className="text-center">
                    <TrendingUp className="h-6 w-6 mb-2 mx-auto" />
                    <span className="text-sm">Cleanup Center</span>
                  </a>
                </Button>
                <Button variant="ghost" asChild className="h-auto p-4 flex-col">
                  <a href="/subscription-management" className="text-center">
                    <Users className="h-6 w-6 mb-2 mx-auto" />
                    <span className="text-sm">Subscriptions</span>
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </RequireRole>
  );
};

export default UserManagement;
