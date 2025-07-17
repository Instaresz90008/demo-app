
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, CreditCard, Download, Eye, Zap, Users, Calendar, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  billing: 'monthly' | 'yearly';
  features: PlanFeature[];
  popular?: boolean;
}

interface Usage {
  feature: string;
  used: number;
  limit: number;
  unit: string;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  plan: string;
  period: string;
}

const PlatformBillingPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentPlan] = useState<Plan>({
    id: 'advanced',
    name: 'Advanced',
    price: 29,
    billing: 'monthly',
    features: [
      { name: 'Unlimited bookings', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Custom branding', included: true },
      { name: 'API access', included: false },
      { name: 'Priority support', included: true }
    ]
  });

  const [usage] = useState<Usage[]>([
    { feature: 'Bookings', used: 245, limit: 1000, unit: 'bookings' },
    { feature: 'Storage', used: 2.3, limit: 10, unit: 'GB' },
    { feature: 'API Calls', used: 1250, limit: 5000, unit: 'calls' },
    { feature: 'Team Members', used: 3, limit: 10, unit: 'members' }
  ]);

  const [invoices] = useState<Invoice[]>([
    {
      id: 'INV-001',
      date: '2024-01-15',
      amount: 29,
      status: 'paid',
      plan: 'Advanced Plan',
      period: 'Jan 2024'
    },
    {
      id: 'INV-002',
      date: '2024-02-15',
      amount: 29,
      status: 'paid',
      plan: 'Advanced Plan',
      period: 'Feb 2024'
    },
    {
      id: 'INV-003',
      date: '2024-03-15',
      amount: 29,
      status: 'pending',
      plan: 'Advanced Plan',
      period: 'Mar 2024'
    }
  ]);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      billing: 'monthly',
      features: [
        { name: 'Up to 50 bookings/month', included: true },
        { name: 'Basic scheduling', included: true },
        { name: 'Email notifications', included: true },
        { name: 'Basic support', included: true },
        { name: 'Custom branding', included: false }
      ]
    },
    {
      id: 'advanced',
      name: 'Advanced',
      price: 29,
      billing: 'monthly',
      popular: true,
      features: [
        { name: 'Unlimited bookings', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Custom branding', included: true },
        { name: 'Integrations', included: true },
        { name: 'Priority support', included: true }
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 79,
      billing: 'monthly',
      features: [
        { name: 'Everything in Advanced', included: true },
        { name: 'API access', included: true },
        { name: 'White-label solution', included: true },
        { name: 'Advanced automations', included: true },
        { name: 'Dedicated support', included: true }
      ]
    }
  ];

  const handlePlanChange = (planId: string) => {
    toast({
      title: "Plan Change Requested",
      description: `You've requested to change to the ${plans.find(p => p.id === planId)?.name} plan.`,
    });
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Download Started",
      description: `Downloading invoice ${invoiceId}...`,
    });
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            💳 Platform Plan & Billing
          </h1>
          <p className="text-muted-foreground">View your JusBook subscription, plan, usage</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{currentPlan.name} Plan</h3>
                      <p className="text-muted-foreground">
                        ${currentPlan.price}/{currentPlan.billing === 'monthly' ? 'month' : 'year'}
                      </p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="space-y-2">
                    {currentPlan.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${feature.included ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="text-sm">{feature.name}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">
                    Manage Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Usage Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usage.slice(0, 3).map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.feature}</span>
                        <span className={getUsageColor(getUsagePercentage(item.used, item.limit))}>
                          {item.used}/{item.limit} {item.unit}
                        </span>
                      </div>
                      <Progress value={getUsagePercentage(item.used, item.limit)} className="h-2" />
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4">
                    View Detailed Usage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plans">
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    {plan.id === currentPlan.id && <Badge variant="outline">Current</Badge>}
                  </CardTitle>
                  <div className="text-2xl font-bold">
                    ${plan.price}
                    <span className="text-sm text-muted-foreground">/{plan.billing === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${feature.included ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className={`text-sm ${!feature.included ? 'text-muted-foreground line-through' : ''}`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant={plan.id === currentPlan.id ? "outline" : "default"} 
                    className="w-full"
                    onClick={() => handlePlanChange(plan.id)}
                    disabled={plan.id === currentPlan.id}
                  >
                    {plan.id === currentPlan.id ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Detailed Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {usage.map((item, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{item.feature}</h3>
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${getUsageColor(getUsagePercentage(item.used, item.limit))}`}>
                          {item.used} / {item.limit}
                        </div>
                        <div className="text-sm text-muted-foreground">{item.unit}</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress value={getUsagePercentage(item.used, item.limit)} className="h-3" />
                      <div className="text-xs text-muted-foreground">
                        {getUsagePercentage(item.used, item.limit).toFixed(1)}% used
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{invoice.id}</span>
                        <Badge variant={
                          invoice.status === 'paid' ? 'default' : 
                          invoice.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {invoice.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {invoice.plan} - {invoice.period}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(invoice.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">${invoice.amount}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlatformBillingPage;
