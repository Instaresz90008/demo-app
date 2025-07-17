
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addLoyaltyTier, updateLoyaltyTier, addLoyaltyClient, addLoyaltyReward, unlockTier } from '@/store/slices/loyaltySlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trophy, Users, Star, Crown, Award, Unlock } from 'lucide-react';

const LoyaltySystemPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { tiers, clients, rewards, analytics } = useAppSelector(state => state.loyalty);
  
  const [isCreateTierModalOpen, setIsCreateTierModalOpen] = useState(false);
  const [isCreateRewardModalOpen, setIsCreateRewardModalOpen] = useState(false);
  const [tierFormData, setTierFormData] = useState({
    name: '',
    description: '',
    color: '#FFD700',
    threshold: 0,
    benefits: [''],
    discountPercentage: 0,
    freeSessionsEarned: 0,
    order: 1
  });
  const [rewardFormData, setRewardFormData] = useState({
    type: 'discount' as 'discount' | 'free_session' | 'upgrade' | 'custom',
    title: '',
    description: '',
    pointsCost: 0,
    value: 0
  });

  const handleCreateTier = () => {
    dispatch(addLoyaltyTier({
      ...tierFormData,
      benefits: tierFormData.benefits.filter(b => b.trim()),
      isActive: true
    }));
    setIsCreateTierModalOpen(false);
    setTierFormData({
      name: '',
      description: '',
      color: '#FFD700',
      threshold: 0,
      benefits: [''],
      discountPercentage: 0,
      freeSessionsEarned: 0,
      order: 1
    });
    
    toast({
      title: "Tier Created",
      description: "New loyalty tier has been created successfully."
    });
  };

  const handleCreateReward = () => {
    dispatch(addLoyaltyReward({
      ...rewardFormData,
      isActive: true
    }));
    setIsCreateRewardModalOpen(false);
    setRewardFormData({
      type: 'discount',
      title: '',
      description: '',
      pointsCost: 0,
      value: 0
    });
    
    toast({
      title: "Reward Created",
      description: "New loyalty reward has been created successfully."
    });
  };

  const handleUnlockTier = (tierId: string) => {
    dispatch(unlockTier({ clientId: 'current-client', tier: tierId }));
    toast({
      title: "Tier Unlocked",
      description: "Loyalty tier has been unlocked and activated."
    });
  };

  const addBenefit = () => {
    setTierFormData(prev => ({ ...prev, benefits: [...prev.benefits, ''] }));
  };

  const updateBenefit = (index: number, value: string) => {
    setTierFormData(prev => ({
      ...prev,
      benefits: prev.benefits.map((b, i) => i === index ? value : b)
    }));
  };

  const removeBenefit = (index: number) => {
    setTierFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const getTierIcon = (tierName: string) => {
    const name = tierName.toLowerCase();
    if (name.includes('bronze')) return <Award className="h-5 w-5" style={{ color: '#CD7F32' }} />;
    if (name.includes('silver')) return <Star className="h-5 w-5" style={{ color: '#C0C0C0' }} />;
    if (name.includes('gold')) return <Crown className="h-5 w-5" style={{ color: '#FFD700' }} />;
    return <Trophy className="h-5 w-5" />;
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
              🏆 Loyalty System
            </h1>
            <p className="text-muted-foreground">Configure customer loyalty rewards and tiers</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateTierModalOpen} onOpenChange={setIsCreateTierModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Tier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Loyalty Tier</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tier-name">Tier Name</Label>
                    <Input
                      id="tier-name"
                      placeholder="e.g., Gold"
                      value={tierFormData.name}
                      onChange={(e) => setTierFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="threshold">Sessions Required</Label>
                    <Input
                      id="threshold"
                      type="number"
                      placeholder="0"
                      value={tierFormData.threshold}
                      onChange={(e) => setTierFormData(prev => ({ ...prev, threshold: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe this tier"
                    value={tierFormData.description}
                    onChange={(e) => setTierFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount Percentage</Label>
                    <Input
                      id="discount"
                      type="number"
                      placeholder="0"
                      value={tierFormData.discountPercentage}
                      onChange={(e) => setTierFormData(prev => ({ ...prev, discountPercentage: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="free-sessions">Free Sessions</Label>
                    <Input
                      id="free-sessions"
                      type="number"
                      placeholder="0"
                      value={tierFormData.freeSessionsEarned}
                      onChange={(e) => setTierFormData(prev => ({ ...prev, freeSessionsEarned: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Benefits</Label>
                  {tierFormData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="Enter benefit"
                        value={benefit}
                        onChange={(e) => updateBenefit(index, e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeBenefit(index)}
                        disabled={tierFormData.benefits.length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addBenefit}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Benefit
                  </Button>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateTierModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTier}>
                    Create Tier
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateRewardModalOpen} onOpenChange={setIsCreateRewardModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Reward
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Reward</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reward-title">Title</Label>
                  <Input
                    id="reward-title"
                    placeholder="e.g., 20% Discount"
                    value={rewardFormData.title}
                    onChange={(e) => setRewardFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reward-description">Description</Label>
                  <Textarea
                    id="reward-description"
                    placeholder="Describe the reward"
                    value={rewardFormData.description}
                    onChange={(e) => setRewardFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="points-cost">Points Cost</Label>
                    <Input
                      id="points-cost"
                      type="number"
                      placeholder="0"
                      value={rewardFormData.pointsCost}
                      onChange={(e) => setRewardFormData(prev => ({ ...prev, pointsCost: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reward-value">Value</Label>
                    <Input
                      id="reward-value"
                      type="number"
                      placeholder="0"
                      value={rewardFormData.value}
                      onChange={(e) => setRewardFormData(prev => ({ ...prev, value: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateRewardModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateReward}>
                    Create Reward
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics.totalLoyaltyClients}</p>
                <p className="text-sm text-muted-foreground">Loyalty Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-500/10 rounded-full">
                <Trophy className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics.averageRetentionRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Retention Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-500/10 rounded-full">
                <Award className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics.rewardRedemptionRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Redemption Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-500/10 rounded-full">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">${analytics.averageLifetimeValue.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">Avg. LTV</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loyalty Tiers */}
      <Card>
        <CardHeader>
          <CardTitle>Loyalty Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiers.map((tier) => (
              <Card key={tier.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getTierIcon(tier.name)}
                      {tier.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={tier.isActive ? 'default' : 'secondary'}>
                        {tier.isActive ? 'Active' : 'Locked'}
                      </Badge>
                      {!tier.isActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnlockTier(tier.id)}
                        >
                          <Unlock className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                  <div className="space-y-2">
                    <p className="font-semibold text-sm">Requires: {tier.threshold} sessions</p>
                    <div className="space-y-1">
                      {tier.benefits.map((benefit, index) => (
                        <p key={index} className="text-sm flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          {benefit}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {tier.discountPercentage > 0 && <span>{tier.discountPercentage}% discount • </span>}
                    {tier.freeSessionsEarned > 0 && <span>{tier.freeSessionsEarned} free sessions</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <Card>
        <CardHeader>
          <CardTitle>Available Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map((reward) => (
              <Card key={reward.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{reward.title}</h3>
                    <Badge variant={reward.isActive ? 'default' : 'secondary'}>
                      {reward.pointsCost} points
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{reward.description}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Type: {reward.type} • Value: {reward.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltySystemPage;
