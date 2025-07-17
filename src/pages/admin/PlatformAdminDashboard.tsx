
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Building, Activity, TrendingUp, AlertTriangle, Plus, Shield, FileText, Settings } from 'lucide-react';
import { RootState, AppDispatch } from '@/store';
import { fetchStats } from '@/store/slices/platformAdminSlice';
import { Link } from 'react-router-dom';
import RequireRole from '@/components/auth/RequireRole';

const PlatformAdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stats } = useSelector((state: RootState) => state.platformAdmin);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  const systemStatus = [
    { name: 'API Health', status: 'healthy', color: 'bg-green-500' },
    { name: 'Background Jobs', status: 'running', color: 'bg-blue-500' },
    { name: 'Email Service', status: 'healthy', color: 'bg-green-500' },
    { name: 'Database', status: 'healthy', color: 'bg-green-500' }
  ];

  const quickActions = [
    { label: 'Add New Organization', href: '/admin/organizations', icon: Plus },
    { label: 'View Audit Logs', href: '/admin/audit-logs', icon: FileText },
    { label: 'System Settings', href: '/admin/settings', icon: Settings },
    { label: 'Security Monitor', href: '/admin/security', icon: Shield }
  ];

  const flaggedAlerts = [
    { type: 'Failed Login', count: 3, severity: 'medium' },
    { type: 'Suspicious Activity', count: 1, severity: 'high' },
    { type: 'API Errors', count: 7, severity: 'low' }
  ];

  return (
    <RequireRole role="platform_admin" showUI>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Platform Admin Dashboard</h1>
            <p className="text-muted-foreground">System overview and management</p>
          </div>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            PLATFORM ADMIN
          </Badge>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Organizations</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeOrganizations}</div>
              <p className="text-xs text-muted-foreground">+3 new this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">92% of total users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Signups</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">+23% from last week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemStatus.map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{service.name}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${service.color}`} />
                      <span className="text-sm capitalize">{service.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <Button key={index} variant="outline" asChild className="justify-start">
                    <Link to={action.href} className="flex items-center gap-2">
                      <action.icon className="h-4 w-4" />
                      <span className="text-xs">{action.label}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Flagged Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Flagged Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {flaggedAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`h-4 w-4 ${
                      alert.severity === 'high' ? 'text-red-500' : 
                      alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                    }`} />
                    <span className="font-medium">{alert.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                      {alert.count} incidents
                    </Badge>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </RequireRole>
  );
};

export default PlatformAdminDashboard;
