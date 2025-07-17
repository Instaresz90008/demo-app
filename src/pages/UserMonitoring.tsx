
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

const UserMonitoring = () => {
  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <AlertTriangle className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">User Monitoring</h1>
        <Badge variant="outline">Org Admin+</Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Session Monitoring</CardTitle>
        </CardHeader>
        <div className="p-4">
          <p className="text-muted-foreground">
            Monitor user sessions, activity logs, and security events.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default UserMonitoring;
