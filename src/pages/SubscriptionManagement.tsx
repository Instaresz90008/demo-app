
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Crown, Calendar, CreditCard, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SubscriptionManagement = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'freemium',
      name: 'Freemium',
      price: 0,
      period: 'forever',
      features: [
        'Basic booking system',
        'Up to 10 bookings/month',
        'Email notifications',
        'Basic calendar integration'
      ],
      current: user?.planType === 'freemium'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 29,
      period: 'month',
      features: [
        'Unlimited bookings',
        'Advanced calendar sync',
        'Custom branding',
        'Analytics & reporting',
        'Smart Service Creator',
        'Priority support'
      ],
      current: user?.planType === 'professional',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      period: 'month',
      features: [
        'Everything in Professional',
        'Team management',
        'API access',
        'White-label solution',
        'Advanced integrations',
        'Dedicated support'
      ],
      current: user?.planType === 'enterprise'
    }
  ];

  const currentPlan = plans.find(plan => plan.current);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    // Here you would integrate with your payment processor
    console.log('Selected plan:', planId);
  };

  const handleDowngrade = () => {
    // Handle downgrade logic
    console.log('Downgrading plan');
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Crown className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Subscription Management</h1>
        </div>

        {/* Current Plan Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Plan</span>
              <Badge variant={currentPlan?.current ? "default" : "secondary"} className="capitalize">
                {currentPlan?.name || 'No Plan'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {currentPlan?.price === 0 ? 'Free forever' : `$${currentPlan?.price}/${currentPlan?.period}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {currentPlan?.price === 0 ? 'No payment required' : 'Next billing: Jan 15, 2025'}
                </span>
              </div>
            </div>
            
            {currentPlan && (
              <div className="space-y-2">
                <p className="text-sm font-medium mb-2">Plan Features:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`${plan.current ? 'ring-2 ring-primary' : ''} ${plan.popular ? 'border-primary' : ''} relative`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  {plan.name}
                  {plan.current && <Badge variant="outline">Current</Badge>}
                </CardTitle>
                <div className="text-3xl font-bold">
                  ${plan.price}
                  <span className="text-lg font-normal text-muted-foreground">
                    /{plan.period}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  {plan.current ? (
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                      {plan.id !== 'freemium' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full text-red-600 hover:text-red-700"
                          onClick={handleDowngrade}
                        >
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Downgrade Plan
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => handlePlanSelect(plan.id)}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.price > (currentPlan?.price || 0) ? 'Upgrade' : 'Downgrade'} to {plan.name}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No billing history available</p>
              <p className="text-sm">Your billing history will appear here once you subscribe to a paid plan</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SubscriptionManagement;
