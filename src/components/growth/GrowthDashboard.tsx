import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReferralEngine from './ReferralEngine';
import SubscriptionManager from './SubscriptionManager';
import LoyaltyEngine from './LoyaltyEngine';

const GrowthDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Growth Engine</h1>
        <p className="text-muted-foreground">
          Manage referrals, subscriptions, and loyalty programs to grow your business
        </p>
      </div>

      <Tabs defaultValue="referrals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="referrals" className="flex items-center gap-2">
            🔁 Referrals
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="flex items-center gap-2">
            💳 Subscriptions
          </TabsTrigger>
          <TabsTrigger value="loyalty" className="flex items-center gap-2">
            🏆 Loyalty
          </TabsTrigger>
        </TabsList>

        <TabsContent value="referrals">
          <ReferralEngine />
        </TabsContent>

        <TabsContent value="subscriptions">
          <SubscriptionManager />
        </TabsContent>

        <TabsContent value="loyalty">
          <LoyaltyEngine />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GrowthDashboard;