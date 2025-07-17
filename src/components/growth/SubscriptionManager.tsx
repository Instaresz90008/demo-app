import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Calendar, DollarSign, Users, TrendingUp, Plus, Settings, Pause, Play, X } from 'lucide-react';
import { useFeatureContext } from '@/context/FeatureContext';
import { RootState } from '@/store';
import { 
  addSubscriber, 
  addSubscriptionPlan, 
  updateSubscriber, 
  calculateMRR,
  pauseSubscription,
  cancelSubscription,
  recordSessionUsage
} from '@/store/slices/subscriptionSlice';

const SubscriptionManager: React.FC = () => {
  const dispatch = useDispatch();
  const { isFeatureEnabled } = useFeatureContext();
  const [isAddSubscriberOpen, setIsAddSubscriberOpen] = useState(false);
  const [isPlanConfigOpen, setIsPlanConfigOpen] = useState(false);
  const [newSubscriberData, setNewSubscriberData] = useState({
    clientName: '',
    clientEmail: '',
    planId: ''
  });

  const { plans, subscribers, analytics, isLoading } = useSelector(
    (state: RootState) => state.subscription
  );

  const hasBasicFeature = isFeatureEnabled('subscription_manager_basic');
  const hasProFeature = isFeatureEnabled('subscription_manager_pro');

  const currentTier = hasProFeature ? 'professional' : hasBasicFeature ? 'advanced' : 'freemium';
  const maxSubscribers = currentTier === 'advanced' ? 1 : 50;
  const maxPlans = currentTier === 'advanced' ? 1 : 10;

  const activeSubscribers = subscribers.filter(s => s.status === 'active');
  const defaultPlan = plans.find(p => p.isDefault);

  useEffect(() => {
    dispatch(calculateMRR());
  }, [dispatch, subscribers, plans]);

  const handleAddSubscriber = () => {
    if (!newSubscriberData.clientName || !newSubscriberData.clientEmail) {
      toast({
        title: 'Missing Information',
        description: 'Please provide client name and email.',
        variant: 'destructive'
      });
      return;
    }

    if (activeSubscribers.length >= maxSubscribers) {
      toast({
        title: 'Subscriber Limit Reached',
        description: `You can track up to ${maxSubscribers} subscriber(s) in your current plan. Upgrade to Pro for unlimited tracking!`,
        variant: 'destructive'
      });
      return;
    }

    const planId = newSubscriberData.planId || defaultPlan?.id;
    if (!planId) {
      toast({
        title: 'No Plan Selected',
        description: 'Please select a subscription plan.',
        variant: 'destructive'
      });
      return;
    }

    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    dispatch(addSubscriber({
      ...newSubscriberData,
      planId,
      status: 'active',
      startDate: new Date().toISOString(),
      nextBillingDate: nextBillingDate.toISOString(),
      autoRenew: true
    }));

    setNewSubscriberData({ clientName: '', clientEmail: '', planId: '' });
    setIsAddSubscriberOpen(false);

    toast({
      title: 'Subscriber Added',
      description: `${newSubscriberData.clientName} has been added to your subscription tracking.`
    });

    // Show upgrade prompt if this is the second subscriber
    if (activeSubscribers.length + 1 >= 2 && currentTier === 'advanced') {
      setTimeout(() => {
        toast({
          title: '🚀 Recurring revenue detected!',
          description: 'Unlock automation with Pro plan to streamline your billing.'
        });
      }, 1000);
    }
  };

  const handlePauseSubscription = (subscriberId: string) => {
    dispatch(pauseSubscription(subscriberId));
    toast({
      title: 'Subscription Paused',
      description: 'The subscription has been paused successfully.'
    });
  };

  const handleCancelSubscription = (subscriberId: string) => {
    dispatch(cancelSubscription(subscriberId));
    toast({
      title: 'Subscription Cancelled',
      description: 'The subscription has been cancelled.'
    });
  };

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            💳 Subscription Manager
            <Badge variant={hasProFeature ? "default" : "secondary"}>
              {hasProFeature ? 'Pro (All Features)' : 'Advanced (Limited)'}
            </Badge>
          </h2>
          <p className="text-muted-foreground">
            {hasBasicFeature ? 'Track and manage recurring client subscriptions' : 'Upgrade to manage subscriptions'}
          </p>
        </div>
        {activeSubscribers.length >= 2 && currentTier === 'advanced' && (
          <Button variant="outline" className="bg-gradient-to-r from-primary/10 to-primary/5">
            Unlock Automation
          </Button>
        )}
      </div>

      {!hasBasicFeature ? (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="pt-6 text-center">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Subscription Manager Locked</h3>
            <p className="text-muted-foreground mb-4">
              Upgrade to Advanced plan to start tracking subscriptions
            </p>
            <Button>Upgrade to Advanced</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Revenue Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium ml-2">MRR</span>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(analytics.monthlyRecurringRevenue)}</div>
                <p className="text-xs text-muted-foreground">Monthly Recurring Revenue</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium ml-2">Active</span>
                </div>
                <div className="text-2xl font-bold">{analytics.totalActiveSubscribers}</div>
                <p className="text-xs text-muted-foreground">Active Subscribers</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium ml-2">ARPU</span>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(Math.round(analytics.averageRevenuePerUser))}</div>
                <p className="text-xs text-muted-foreground">Avg Revenue Per User</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium ml-2">ARR</span>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(analytics.annualRecurringRevenue)}</div>
                <p className="text-xs text-muted-foreground">Annual Recurring Revenue</p>
              </CardContent>
            </Card>
          </div>

          {/* Default Plan Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Active Subscription Plan</span>
                <Dialog open={isPlanConfigOpen} onOpenChange={setIsPlanConfigOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" disabled={!hasProFeature}>
                      <Settings className="h-4 w-4 mr-2" />
                      {hasProFeature ? 'Configure Plans' : 'Locked in Advanced'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Plan Configuration</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Pro features: Multiple plans, automated billing, usage metering
                      </p>
                      <Button>Upgrade to Pro</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {defaultPlan && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium">{defaultPlan.name}</h4>
                    <p className="text-sm text-muted-foreground">{defaultPlan.description}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{formatCurrency(defaultPlan.price)}</p>
                    <p className="text-sm text-muted-foreground">per {defaultPlan.billingCycle}</p>
                  </div>
                  <div>
                    <Badge variant={defaultPlan.isActive ? "default" : "secondary"}>
                      {defaultPlan.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {defaultPlan.sessionLimit && (
                      <p className="text-sm text-muted-foreground">
                        {defaultPlan.sessionLimit} sessions included
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscribers List */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active Subscribers</h3>
            <Dialog open={isAddSubscriberOpen} onOpenChange={setIsAddSubscriberOpen}>
              <DialogTrigger asChild>
                <Button disabled={activeSubscribers.length >= maxSubscribers}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subscriber ({activeSubscribers.length}/{maxSubscribers})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Subscriber</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      value={newSubscriberData.clientName}
                      onChange={(e) => setNewSubscriberData(prev => ({ ...prev, clientName: e.target.value }))}
                      placeholder="Enter client name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientEmail">Client Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={newSubscriberData.clientEmail}
                      onChange={(e) => setNewSubscriberData(prev => ({ ...prev, clientEmail: e.target.value }))}
                      placeholder="Enter client email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="plan">Subscription Plan</Label>
                    <Select value={newSubscriberData.planId} onValueChange={(value) => setNewSubscriberData(prev => ({ ...prev, planId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map(plan => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name} - {formatCurrency(plan.price)}/{plan.billingCycle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddSubscriber} className="w-full">
                    Add Subscriber
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {activeSubscribers.length === 0 ? (
              <Card className="border-dashed border-2 border-muted">
                <CardContent className="pt-6 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">No Active Subscribers</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first recurring client to start tracking subscription revenue
                  </p>
                </CardContent>
              </Card>
            ) : (
              activeSubscribers.map((subscriber) => {
                const plan = plans.find(p => p.id === subscriber.planId);
                return (
                  <Card key={subscriber.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div>
                              <h4 className="font-medium">{subscriber.clientName}</h4>
                              <p className="text-sm text-muted-foreground">{subscriber.clientEmail}</p>
                            </div>
                            <Badge variant={
                              subscriber.status === 'active' ? 'default' :
                              subscriber.status === 'paused' ? 'secondary' :
                              'destructive'
                            }>
                              {subscriber.status}
                            </Badge>
                          </div>
                          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Plan:</span>
                              <div className="font-medium">{plan?.name}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Next Billing:</span>
                              <div className="font-medium">{formatDate(subscriber.nextBillingDate)}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Revenue:</span>
                              <div className="font-medium">{formatCurrency(subscriber.totalRevenue)}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Sessions:</span>
                              <div className="font-medium">
                                {subscriber.sessionsUsed}
                                {subscriber.sessionsRemaining !== undefined && `/${subscriber.sessionsUsed + subscriber.sessionsRemaining}`}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {subscriber.status === 'active' ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handlePauseSubscription(subscriber.id)}
                              disabled={!hasProFeature}
                            >
                              <Pause className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              disabled={!hasProFeature}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCancelSubscription(subscriber.id)}
                            disabled={!hasProFeature}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {!hasProFeature && activeSubscribers.length > 0 && (
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Unlock Pro Automation</h4>
                    <p className="text-sm text-muted-foreground">
                      Automate billing, add multiple plans, track usage, and get advanced analytics
                    </p>
                  </div>
                  <Button>Upgrade to Pro</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;