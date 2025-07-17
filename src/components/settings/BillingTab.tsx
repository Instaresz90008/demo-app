import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { BillingPlan } from './BillingPlan';

const BillingTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Billing & Subscription</h2>
        <p className="text-muted-foreground">Manage your subscription and payment methods</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Current Plan
            <Badge variant="secondary">Freemium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground">
                You're currently on the freemium plan with basic features.
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <span>No payment method required</span>
            </div>
            
            <Button variant="outline">
              Upgrade Plan
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <BillingPlan />
    </div>
  );
};

export default BillingTab;