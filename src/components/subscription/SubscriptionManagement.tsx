
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Crown, 
  Check, 
  Zap, 
  Shield, 
  CreditCard,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Loader2,
  X,
  ExternalLink
} from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billing: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
  current?: boolean;
}

const plans: SubscriptionPlan[] = [
  {
    id: 'freemium',
    name: 'Freemium',
    price: 0,
    billing: 'monthly',
    current: true,
    features: [
      'Up to 5 services',
      '50 bookings per month',
      'Basic calendar view',
      'Email notifications',
      'Standard support'
    ]
  },
  {
    id: 'advanced',
    name: 'Advanced',
    price: 29,
    billing: 'monthly',
    features: [
      'Up to 25 services',
      '500 bookings per month',
      'Advanced calendar features',
      'SMS notifications',
      'Team collaboration (3 members)',
      'Priority support',
      'Basic analytics'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 59,
    billing: 'monthly',
    popular: true,
    features: [
      'Unlimited services',
      'Unlimited bookings',
      'Advanced calendar features',
      'SMS & Email notifications',
      'Team collaboration (10 members)',
      'Priority support',
      'Custom branding',
      'Advanced analytics'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    billing: 'monthly',
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'API access',
      'SSO integration',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'White-label solution'
    ]
  }
];

const SubscriptionManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showFeatureComparison, setShowFeatureComparison] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(
    plans.find(p => p.current) || null
  );
  const { toast } = useToast();

  const handlePlanSelection = async (planId: string) => {
    setLoading(true);
    try {
      // Simulate API call for plan selection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const plan = plans.find(p => p.id === planId);
      if (plan) {
        // Update current plan
        const updatedPlans = plans.map(p => ({ ...p, current: p.id === planId }));
        setCurrentPlan(plan);
        
        toast({
          title: 'Plan Selected',
          description: `Successfully selected ${plan.name} plan! Redirecting to checkout...`
        });
        
        // Simulate redirect to Stripe checkout
        setTimeout(() => {
          window.open('https://checkout.stripe.com/demo', '_blank');
        }, 1000);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to select plan',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = () => {
    toast({
      title: 'Redirecting',
      description: 'Opening billing portal...'
    });
    // Redirect to billing portal
    window.open('https://billing.stripe.com/p/login/demo', '_blank');
  };

  const getYearlyPrice = (monthlyPrice: number) => Math.round(monthlyPrice * 12 * 0.8);

  const FeatureComparisonChart = () => (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Feature Comparison</CardTitle>
          <Button 
            variant="ghost" 
            onClick={() => setShowFeatureComparison(!showFeatureComparison)}
            className="text-sm"
          >
            {showFeatureComparison ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>
      </CardHeader>
      {showFeatureComparison && (
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Features</th>
                  {plans.map(plan => (
                    <th key={plan.id} className="text-center py-3 px-4 font-medium">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Services', values: ['5', '25', 'Unlimited', 'Unlimited'] },
                  { feature: 'Monthly Bookings', values: ['50', '500', 'Unlimited', 'Unlimited'] },
                  { feature: 'Calendar Integration', values: ['Basic', 'Advanced', 'Advanced', 'Advanced'] },
                  { feature: 'Notifications', values: ['Email', 'Email + SMS', 'Email + SMS', 'Email + SMS'] },
                  { feature: 'Team Members', values: ['1', '3', '10', 'Unlimited'] },
                  { feature: 'Analytics', values: ['Basic', 'Basic', 'Advanced', 'Advanced'] },
                  { feature: 'API Access', values: ['✗', '✗', '✗', '✓'] },
                  { feature: 'Priority Support', values: ['✗', '✓', '✓', '✓'] },
                  { feature: 'Custom Branding', values: ['✗', '✗', '✓', '✓'] },
                  { feature: 'SSO Integration', values: ['✗', '✗', '✗', '✓'] },
                  { feature: 'White-label', values: ['✗', '✗', '✗', '✓'] }
                ].map((row, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{row.feature}</td>
                    {row.values.map((value, idx) => (
                      <td key={idx} className="text-center py-3 px-4">
                        {value === '✓' ? (
                          <Check className="h-4 w-4 text-green-600 mx-auto" />
                        ) : value === '✗' ? (
                          <X className="h-4 w-4 text-red-500 mx-auto" />
                        ) : (
                          <span>{value}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      )}
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Billing Period Toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-4 p-1 bg-muted rounded-lg">
          <Button
            variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setBillingPeriod('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={billingPeriod === 'yearly' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setBillingPeriod('yearly')}
          >
            Annual <Badge variant="secondary" className="ml-1">20% off</Badge>
          </Button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {plans.map((plan) => {
          const displayPrice = billingPeriod === 'yearly' ? getYearlyPrice(plan.price) : plan.price;
          const billingText = billingPeriod === 'yearly' ? '/year' : '/month';
          
          return (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'border-primary ring-2 ring-primary/20' : ''} ${plan.current ? 'bg-primary/5' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                {plan.current && (
                  <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 w-fit mx-auto">
                    Current Plan
                  </Badge>
                )}
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold">${displayPrice}</span>
                  <span className="text-muted-foreground">{billingText}</span>
                </div>
                {billingPeriod === 'yearly' && plan.price > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Save ${(plan.price * 12) - displayPrice} per year
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 4 && (
                    <li className="text-sm text-muted-foreground">
                      +{plan.features.length - 4} more features
                    </li>
                  )}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plan.current ? "outline" : "default"}
                  disabled={plan.current || loading}
                  onClick={() => handlePlanSelection(plan.id)}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : plan.current ? (
                    'Current Plan'
                  ) : plan.price > (currentPlan?.price || 0) ? (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Upgrade Now
                    </>
                  ) : (
                    'Select Plan'
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Comparison Chart */}
      <FeatureComparisonChart />

      {/* Current Plan Status */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Current Plan</h3>
                <p className="text-muted-foreground">
                  {currentPlan?.name || 'No active plan'} - ${currentPlan?.price || 0}/month
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleManageBilling} variant="outline">
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Billing
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;
