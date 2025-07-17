
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Edit, Trash2, Users, DollarSign, Calendar } from 'lucide-react';

interface Subscription {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  subscribers: number;
  status: 'active' | 'inactive';
}

const ClientSubscriptionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: '1',
      name: 'Basic Plan',
      price: 29,
      interval: 'monthly',
      features: ['Up to 5 bookings/month', 'Email support', 'Basic analytics'],
      subscribers: 15,
      status: 'active'
    },
    {
      id: '2',
      name: 'Pro Plan',
      price: 99,
      interval: 'monthly',
      features: ['Unlimited bookings', 'Priority support', 'Advanced analytics', 'Custom branding'],
      subscribers: 8,
      status: 'active'
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    interval: 'monthly' as 'monthly' | 'yearly',
    features: ['']
  });

  const handleCreate = () => {
    const newSubscription: Subscription = {
      id: Date.now().toString(),
      name: formData.name,
      price: formData.price,
      interval: formData.interval,
      features: formData.features.filter(f => f.trim()),
      subscribers: 0,
      status: 'active'
    };

    setSubscriptions(prev => [...prev, newSubscription]);
    setIsCreateModalOpen(false);
    setFormData({ name: '', price: 0, interval: 'monthly', features: [''] });
    
    toast({
      title: "Subscription Created",
      description: `${formData.name} has been created successfully.`
    });
  };

  const handleDelete = (id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    toast({
      title: "Subscription Deleted",
      description: "The subscription plan has been removed."
    });
  };

  const handleToggleStatus = (id: string) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === id 
        ? { ...sub, status: sub.status === 'active' ? 'inactive' : 'active' }
        : sub
    ));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
              📦 Client Subscriptions Manager
            </h1>
            <p className="text-muted-foreground">Create and manage recurring subscription plans for your clients</p>
          </div>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Subscription Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plan-name">Plan Name</Label>
                  <Input
                    id="plan-name"
                    placeholder="e.g., Premium Plan"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Billing Interval</Label>
                <Select value={formData.interval} onValueChange={(value: 'monthly' | 'yearly') => setFormData(prev => ({ ...prev, interval: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Features</Label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Enter feature"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      disabled={formData.features.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>
                  Create Plan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {subscriptions.map((subscription) => (
          <Card key={subscription.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {subscription.name}
                  <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                    {subscription.status}
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('Edit', subscription.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(subscription.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <div className="text-3xl font-bold">${subscription.price}</div>
                <div className="text-sm text-muted-foreground">per {subscription.interval}</div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Features:</h4>
                <ul className="space-y-1">
                  {subscription.features.map((feature, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {subscription.subscribers} subscribers
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleStatus(subscription.id)}
                >
                  {subscription.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  ${subscriptions.reduce((sum, sub) => sum + (sub.price * sub.subscribers), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {subscriptions.reduce((sum, sub) => sum + sub.subscribers, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-500/10 rounded-full">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{subscriptions.filter(s => s.status === 'active').length}</p>
                <p className="text-sm text-muted-foreground">Active Plans</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientSubscriptionsPage;
