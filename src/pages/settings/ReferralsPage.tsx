
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { generateReferralCode, addReferredClient, updateReferralStatus } from '@/store/slices/referralSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Copy, Share, Users, TrendingUp, DollarSign, Target } from 'lucide-react';

const ReferralsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { codes, referredClients, analytics } = useAppSelector(state => state.referral);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    campaign: ''
  });

  const handleCreateCode = () => {
    dispatch(generateReferralCode(formData));
    setIsCreateModalOpen(false);
    setFormData({ name: '', campaign: '' });
    
    toast({
      title: "Referral Code Generated",
      description: "Your new referral code has been created successfully."
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard."
    });
  };

  const handleShareCode = (code: string) => {
    const shareUrl = `${window.location.origin}/referral/${code}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Share Link Copied",
      description: "Referral link copied to clipboard."
    });
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
              🔁 Referrals
            </h1>
            <p className="text-muted-foreground">Create referral codes and manage reward programs</p>
          </div>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Referral Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Referral Code</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Code Name (Optional)</Label>
                <Input
                  id="name"
                  placeholder="e.g., Holiday Campaign"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaign">Campaign (Optional)</Label>
                <Input
                  id="campaign"
                  placeholder="e.g., December 2024"
                  value={formData.campaign}
                  onChange={(e) => setFormData(prev => ({ ...prev, campaign: e.target.value }))}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCode}>
                  Generate Code
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics.totalReferrals}</p>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-500/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics.successfulReferrals}</p>
                <p className="text-sm text-muted-foreground">Successful</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-500/10 rounded-full">
                <Target className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-500/10 rounded-full">
                <DollarSign className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">${analytics.totalRewardsEarned}</p>
                <p className="text-sm text-muted-foreground">Rewards Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Codes */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {codes.map((code) => (
              <div key={code.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-lg">{code.code}</span>
                    <Badge variant={code.isActive ? 'default' : 'secondary'}>
                      {code.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  {code.name && <p className="text-sm text-muted-foreground mt-1">{code.name}</p>}
                  {code.campaign && <p className="text-xs text-muted-foreground">Campaign: {code.campaign}</p>}
                  <p className="text-xs text-muted-foreground">Created: {new Date(code.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyCode(code.code)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShareCode(code.code)}
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {codes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No referral codes yet. Create your first one to get started!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Referred Clients */}
      <Card>
        <CardHeader>
          <CardTitle>Referred Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {referredClients.map((client) => (
              <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{client.clientEmail}</span>
                    <Badge variant={
                      client.status === 'completed' ? 'default' : 
                      client.status === 'pending' ? 'secondary' : 'destructive'
                    }>
                      {client.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Referred via: {client.referralCode}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(client.referredAt).toLocaleDateString()}
                  </p>
                  {client.rewardEarned && (
                    <p className="text-xs text-green-600">
                      Reward earned: ${client.rewardEarned}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {referredClients.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No referred clients yet. Share your referral codes to get started!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralsPage;
