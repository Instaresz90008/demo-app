
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3 } from 'lucide-react';

const UsageBilling = () => {
  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Usage & Billing</h1>
        <Badge variant="outline">Org Admin+</Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Usage Reports & Billing Information</CardTitle>
        </CardHeader>
        <div className="p-4">
          <p className="text-muted-foreground">
            View usage statistics, billing information, and subscription details.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default UsageBilling;
