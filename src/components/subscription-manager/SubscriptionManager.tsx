
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { RootState, AppDispatch } from '@/store';
import { 
  fetchPlans, 
  fetchSubscriptions, 
  fetchAnalytics,
  setCurrentTenantId 
} from '@/store/slices/subscriptionManagerSlice';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Crown, 
  Users, 
  DollarSign, 
  TrendingUp,
  Settings,
  Plus,
  BarChart3,
  CreditCard
} from 'lucide-react';
import PlansManager from './PlansManager';
import SubscriptionsManager from './SubscriptionsManager';
import AnalyticsView from './AnalyticsView';

interface SubscriptionManagerProps {
  tenantId?: string;
  embedded?: boolean;
  className?: string;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ 
  tenantId, 
  embedded = false, 
  className 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const {
    plans,
    subscriptions,
    analytics,
    currentTenantId,
    loading,
    error
  } = useSelector((state: RootState) => state.subscriptionManager);

  const [activeTab, setActiveTab] = useState('plans');
  const effectiveTenantId = tenantId || user?.tenant_id || 'platform';

  useEffect(() => {
    if (effectiveTenantId !== currentTenantId) {
      dispatch(setCurrentTenantId(effectiveTenantId));
    }
  }, [effectiveTenantId, currentTenantId, dispatch]);

  useEffect(() => {
    // Load initial data
    dispatch(fetchPlans({ 
      tenantId: effectiveTenantId, 
      includeTemplates: user?.roles?.includes('org_admin') 
    }));
    dispatch(fetchSubscriptions({ tenantId: effectiveTenantId }));
    dispatch(fetchAnalytics({ tenantId: effectiveTenantId }));
  }, [dispatch, effectiveTenantId, user?.roles]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const isPlatformAdmin = user?.roles?.includes('platform_admin');
  const isOrgAdmin = user?.roles?.includes('org_admin');

  if (!isPlatformAdmin && !isOrgAdmin) {
    return (
      <Card className="p-8 text-center">
        <CardContent>
          <Crown className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            This subscription management interface is only available to platform and organization administrators.
          </p>
        </CardContent>
      </Card>
    );
  }

  const QuickStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Crown className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Plans</p>
              <p className="text-xl font-bold">{plans.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Subscriptions</p>
              <p className="text-xl font-bold">{analytics?.active_subscriptions || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="text-xl font-bold">${analytics?.mrr?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Revenue/User</p>
              <p className="text-xl font-bold">${analytics?.avg_revenue_per_user?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {!embedded && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Crown className="h-6 w-6 text-primary" />
              Subscription Manager
            </h1>
            <p className="text-muted-foreground">
              Manage subscription plans, subscribers, and billing across your platform
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">
                Tenant: {effectiveTenantId}
              </Badge>
              {isPlatformAdmin && (
                <Badge variant="outline">Platform Admin</Badge>
              )}
              {isOrgAdmin && (
                <Badge variant="outline">Org Admin</Badge>
              )}
            </div>
          </div>
        </div>
      )}

      <QuickStats />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Plans
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Subscriptions
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <PlansManager tenantId={effectiveTenantId} />
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <SubscriptionsManager tenantId={effectiveTenantId} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsView tenantId={effectiveTenantId} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Settings and configuration options will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionManager;
