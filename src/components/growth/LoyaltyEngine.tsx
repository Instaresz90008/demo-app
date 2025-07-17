import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Trophy, Star, Users, TrendingUp, Lock, Crown } from 'lucide-react';
import { useFeatureContext } from '@/context/FeatureContext';
import { RootState } from '@/store';
import { 
  addLoyaltyClient, 
  updateClientSessions, 
  unlockTier,
  calculateAnalytics
} from '@/store/slices/loyaltySlice';

const LoyaltyEngine: React.FC = () => {
  const dispatch = useDispatch();
  const { isFeatureEnabled } = useFeatureContext();
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);

  const { tiers, clients, analytics, isLoading } = useSelector(
    (state: RootState) => state.loyalty
  );

  const hasBasicFeature = isFeatureEnabled('loyalty_engine_basic');
  const hasProFeature = isFeatureEnabled('loyalty_engine_pro');

  const currentTier = hasProFeature ? 'professional' : hasBasicFeature ? 'advanced' : 'freemium';
  const activeTiers = tiers.filter(t => t.isActive);
  const bronzeTier = tiers.find(t => t.name === 'Bronze');
  const returningClients = clients.filter(c => c.isReturningClient);

  useEffect(() => {
    dispatch(calculateAnalytics());
  }, [dispatch, clients]);

  useEffect(() => {
    // Demo: Add some sample clients for demonstration
    if (clients.length === 0 && hasBasicFeature) {
      // Add sample clients to show loyalty in action
      setTimeout(() => {
        dispatch(addLoyaltyClient({
          clientName: 'Sarah Johnson',
          clientEmail: 'sarah@email.com',
          sessionsCompleted: 5,
          lastActivity: new Date().toISOString(),
          lifetimeValue: 2500
        }));
        dispatch(addLoyaltyClient({
          clientName: 'Mike Chen',
          clientEmail: 'mike@email.com',
          sessionsCompleted: 8,
          lastActivity: new Date().toISOString(),
          lifetimeValue: 4000
        }));
      }, 1000);
    }
  }, [dispatch, clients.length, hasBasicFeature]);

  const handleUnlockTiers = () => {
    toast({
      title: 'Upgrade to Pro',
      description: 'Unlock custom tiers, automated rewards, and public leaderboards'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            🏆 Loyalty Engine
            <Badge variant={hasProFeature ? "default" : "secondary"}>
              {hasProFeature ? 'Pro (All Features)' : 'Advanced (Limited)'}
            </Badge>
          </h2>
          <p className="text-muted-foreground">
            {hasBasicFeature ? 'Build client loyalty with tiered rewards' : 'Upgrade to access loyalty features'}
          </p>
        </div>
        {returningClients.length >= 1 && currentTier === 'advanced' && (
          <Button variant="outline" className="bg-gradient-to-r from-primary/10 to-primary/5" onClick={handleUnlockTiers}>
            Unlock Tier-Based Rewards
          </Button>
        )}
      </div>

      {!hasBasicFeature ? (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="pt-6 text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Loyalty Engine Locked</h3>
            <p className="text-muted-foreground mb-4">
              Upgrade to Advanced plan to start building client loyalty
            </p>
            <Button>Upgrade to Advanced</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Loyalty Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiers.map((tier, index) => (
              <Card key={tier.id} className={`relative ${tier.isActive ? '' : 'opacity-60'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2" style={{ color: tier.color }}>
                      {tier.name === 'Bronze' && <Star className="h-5 w-5" />}
                      {tier.name === 'Silver' && <Trophy className="h-5 w-5" />}
                      {tier.name === 'Gold' && <Crown className="h-5 w-5" />}
                      {tier.name}
                    </span>
                    {!tier.isActive && (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                    <div className="text-lg font-bold">{tier.threshold}+ sessions</div>
                    <div className="space-y-1">
                      {tier.benefits.map((benefit, idx) => (
                        <div key={idx} className="text-sm flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                    {!tier.isActive && currentTier === 'advanced' && (
                      <div className="pt-2 border-t">
                        <Badge variant="outline" className="text-xs">
                          Locked in Advanced
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
                {tier.isActive && index === 0 && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Loyalty Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium ml-2">Loyal Clients</span>
                </div>
                <div className="text-2xl font-bold">{analytics.totalLoyaltyClients}</div>
                <p className="text-xs text-muted-foreground">Total enrolled</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium ml-2">Retention</span>
                </div>
                <div className="text-2xl font-bold">{Math.round(analytics.averageRetentionRate)}%</div>
                <p className="text-xs text-muted-foreground">Average retention rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium ml-2">LTV</span>
                </div>
                <div className="text-2xl font-bold">₹{Math.round(analytics.averageLifetimeValue)}</div>
                <p className="text-xs text-muted-foreground">Avg lifetime value</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium ml-2">Redemption</span>
                </div>
                <div className="text-2xl font-bold">{Math.round(analytics.rewardRedemptionRate)}%</div>
                <p className="text-xs text-muted-foreground">Reward redemption rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Returning Clients */}
          <Card>
            <CardHeader>
              <CardTitle>Returning Clients</CardTitle>
            </CardHeader>
            <CardContent>
              {returningClients.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">No Returning Clients Yet</h3>
                  <p className="text-muted-foreground">
                    Clients with 3+ sessions will appear here with their loyalty status
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {returningClients.map((client) => {
                    const clientTier = tiers.find(t => t.id === client.currentTier);
                    return (
                      <div key={client.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{client.clientName}</span>
                              <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                                Returning Client
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{client.clientEmail}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            {clientTier && (
                              <Badge style={{ backgroundColor: `${clientTier.color}20`, color: clientTier.color, borderColor: `${clientTier.color}40` }}>
                                {clientTier.name}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {client.sessionsCompleted} sessions • ₹{client.lifetimeValue} LTV
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LoyaltyEngine;