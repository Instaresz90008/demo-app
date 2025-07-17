
import React from 'react';
import { useComponentAccessControl } from '@/hooks/useComponentAccessControl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Eye, 
  Shield,
  Lock,
  AlertTriangle,
  Activity
} from 'lucide-react';

const ProxySessions = () => {
  const { 
    loading, 
    hasRequiredAccess, 
    trackComponentFeatureUsage 
  } = useComponentAccessControl({
    requiredFeatures: ['proxy_session_access'],
    componentName: 'ProxySessions',
    trackUsage: true
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasRequiredAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-center space-y-2">
          <Lock className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground max-w-md">
            You don't have permission to access Proxy Sessions. 
            This feature requires special privileges.
          </p>
        </div>
        <Badge variant="destructive" className="gap-2">
          <AlertTriangle className="h-3 w-3" />
          Proxy Session Access Required
        </Badge>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Proxy Sessions
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage user proxy sessions
          </p>
        </div>
        
        <Badge variant="secondary" className="gap-1">
          <Eye className="h-3 w-3" />
          Session Monitor
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Security alerts
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Proxy Session Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Proxy session management functionality is being loaded...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProxySessions;
