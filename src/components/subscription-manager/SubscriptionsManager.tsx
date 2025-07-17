
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { RootState, AppDispatch } from '@/store';
import { 
  fetchSubscriptions,
  updateSubscription,
  TenantSubscription 
} from '@/store/slices/subscriptionManagerSlice';
import { Users, Search, Calendar, DollarSign } from 'lucide-react';

interface SubscriptionsManagerProps {
  tenantId: string;
}

const SubscriptionsManager: React.FC<SubscriptionsManagerProps> = ({ tenantId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  
  const { subscriptions, loading } = useSelector((state: RootState) => state.subscriptionManager);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (subscriptionId: string, newStatus: string) => {
    try {
      await dispatch(updateSubscription({ 
        id: subscriptionId, 
        updates: { status: newStatus as any } 
      })).unwrap();
      toast({
        title: 'Subscription Updated',
        description: `Status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error as string,
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'past_due': return 'bg-yellow-500';
      case 'trialing': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Subscriptions</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
            <option value="past_due">Past Due</option>
            <option value="trialing">Trialing</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredSubscriptions.map((subscription) => (
          <Card key={subscription.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{subscription.user_email}</p>
                      <p className="text-sm text-muted-foreground">
                        Plan: {subscription.plan_name}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold">
                        ${(subscription.amount || subscription.base_price || 0)}/mo
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Next: {subscription.next_billing_date ? new Date(subscription.next_billing_date).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(subscription.status)} text-white`}
                  >
                    {subscription.status}
                  </Badge>
                  
                  <select
                    value={subscription.status}
                    onChange={(e) => handleStatusChange(subscription.id, e.target.value)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="past_due">Past Due</option>
                    <option value="trialing">Trialing</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredSubscriptions.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Subscriptions Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No active subscriptions for this tenant.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsManager;
