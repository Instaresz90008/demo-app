
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

const PlatformSettings = () => {
  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Platform Settings</h1>
        <Badge variant="outline">Platform Admin Only</Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Platform Configuration</CardTitle>
        </CardHeader>
        <div className="p-4">
          <p className="text-muted-foreground">
            Configure platform-wide settings, security policies, and system preferences.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PlatformSettings;
