
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { RootState, AppDispatch } from '@/store';
import { 
  createPlan, 
  updatePlan, 
  deletePlan,
  SubscriptionPlan 
} from '@/store/slices/subscriptionManagerSlice';
import PriceIcon from '@/components/ui/PriceIcon';
import { Plus, Edit, Trash2, Crown, Check, X } from 'lucide-react';

interface PlansManagerProps {
  tenantId: string;
}

const PlansManager: React.FC<PlansManagerProps> = ({ tenantId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  
  const { plans, loading } = useSelector((state: RootState) => state.subscriptionManager);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    features: [''],
    limits: {} as Record<string, number>,
    billing_cycle: 'monthly' as 'monthly' | 'yearly' | 'one-time',
    base_price: 0,
    trial_period_days: 0,
    status: 'active' as 'active' | 'inactive' | 'draft'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      features: [''],
      limits: {},
      billing_cycle: 'monthly',
      base_price: 0,
      trial_period_days: 0,
      status: 'active'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const planData = {
      ...formData,
      features: formData.features.filter(f => f.trim()),
      tenant_id: tenantId
    };

    try {
      if (editingPlan) {
        await dispatch(updatePlan({ id: editingPlan.id, updates: planData })).unwrap();
        toast({
          title: 'Plan Updated',
          description: `${planData.name} has been updated successfully.`
        });
        setEditingPlan(null);
      } else {
        await dispatch(createPlan(planData)).unwrap();
        toast({
          title: 'Plan Created',
          description: `${planData.name} has been created successfully.`
        });
        setIsCreateModalOpen(false);
      }
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: error as string,
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (plan: SubscriptionPlan) => {
    if (window.confirm(`Are you sure you want to delete the plan "${plan.name}"?`)) {
      try {
        await dispatch(deletePlan(plan.id)).unwrap();
        toast({
          title: 'Plan Deleted',
          description: `${plan.name} has been deleted successfully.`
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error as string,
          variant: 'destructive'
        });
      }
    }
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || '',
      features: plan.features.length > 0 ? plan.features : [''],
      limits: plan.limits,
      billing_cycle: plan.billing_cycle,
      base_price: plan.base_price,
      trial_period_days: plan.trial_period_days,
      status: plan.status
    });
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

  const PlanForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Plan Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'draft') => 
            setFormData(prev => ({ ...prev, status: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.base_price}
            onChange={(e) => setFormData(prev => ({ ...prev, base_price: parseFloat(e.target.value) || 0 }))}
          />
        </div>
        <div>
          <Label htmlFor="billing_cycle">Billing Cycle</Label>
          <Select value={formData.billing_cycle} onValueChange={(value: 'monthly' | 'yearly' | 'one-time') => 
            setFormData(prev => ({ ...prev, billing_cycle: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="one-time">One-time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="trial">Trial Period (Days)</Label>
          <Input
            id="trial"
            type="number"
            value={formData.trial_period_days}
            onChange={(e) => setFormData(prev => ({ ...prev, trial_period_days: parseInt(e.target.value) || 0 }))}
          />
        </div>
      </div>

      <div>
        <Label>Features</Label>
        {formData.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 mt-2">
            <Input
              value={feature}
              onChange={(e) => updateFeature(index, e.target.value)}
              placeholder="Enter feature"
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
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Feature
        </Button>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsCreateModalOpen(false);
            setEditingPlan(null);
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading.plans}>
          {editingPlan ? 'Update Plan' : 'Create Plan'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Subscription Plans</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Plan</DialogTitle>
            </DialogHeader>
            <PlanForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {plan.is_template && <Crown className="h-4 w-4 text-yellow-500" />}
                  {plan.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                    {plan.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(plan)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(plan)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-2">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                  <PriceIcon className="h-5 w-5" />
                  {plan.base_price}
                </div>
                <div className="text-sm text-muted-foreground">
                  per {plan.billing_cycle === 'one-time' ? 'purchase' : plan.billing_cycle.slice(0, -2)}
                </div>
              </div>

              {plan.description && (
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              )}

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Features:</h4>
                <ul className="space-y-1">
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <Check className="h-3 w-3 text-green-500" />
                      {feature}
                    </li>
                  ))}
                  {plan.features.length > 4 && (
                    <li className="text-sm text-muted-foreground">
                      +{plan.features.length - 4} more features
                    </li>
                  )}
                </ul>
              </div>

              {plan.trial_period_days > 0 && (
                <Badge variant="outline" className="w-fit">
                  {plan.trial_period_days} day trial
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Plan Dialog */}
      <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
          </DialogHeader>
          <PlanForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlansManager;
