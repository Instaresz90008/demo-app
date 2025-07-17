import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Copy, Users, Trophy, TrendingUp, Plus, Eye, EyeOff } from 'lucide-react';
import { useFeatureContext } from '@/context/FeatureContext';
import { RootState } from '@/store';
import { 
  generateReferralCode, 
  addReferredClient, 
  updateReferralStatus,
  setLeaderboard
} from '@/store/slices/referralSlice';

const ReferralEngine: React.FC = () => {
  const dispatch = useDispatch();
  const { isFeatureEnabled } = useFeatureContext();
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);

  const { codes, referredClients, analytics, leaderboard, isLoading } = useSelector(
    (state: RootState) => state.referral
  );

  const hasBasicFeature = isFeatureEnabled('referral_engine_basic');
  const hasProFeature = isFeatureEnabled('referral_engine_pro');

  // Simulate user subscription tier for demo
  const currentTier = hasProFeature ? 'professional' : hasBasicFeature ? 'advanced' : 'freemium';
  const maxReferrals = currentTier === 'advanced' ? 2 : 10;
  const maxCodes = currentTier === 'advanced' ? 1 : currentTier === 'professional' ? 10 : 0;

  const currentCode = codes.find(c => c.isActive) || null;
  const successfulReferrals = referredClients.filter(c => c.status === 'completed').length;

  useEffect(() => {
    // Simulate leaderboard data
    const mockLeaderboard = [
      { rank: 1, userName: 'Sarah Chen', referrals: 12, rewards: 600, isCurrentUser: false },
      { rank: 2, userName: 'You', referrals: successfulReferrals, rewards: successfulReferrals * 50, isCurrentUser: true },
      { rank: 3, userName: 'Mike Johnson', referrals: 8, rewards: 400, isCurrentUser: false },
      { rank: 4, userName: 'Lisa Park', referrals: 6, rewards: 300, isCurrentUser: false },
      { rank: 5, userName: 'David Brown', referrals: 4, rewards: 200, isCurrentUser: false }
    ];
    dispatch(setLeaderboard(mockLeaderboard));
  }, [dispatch, successfulReferrals]);

  const handleGenerateCode = () => {
    if (codes.length >= maxCodes) {
      toast({
        title: 'Limit Reached',
        description: `You can only have ${maxCodes} referral code(s) in your current plan.`,
        variant: 'destructive'
      });
      return;
    }

    dispatch(generateReferralCode({ name: 'Primary Referral Code' }));
    toast({
      title: 'Referral Code Generated',
      description: 'Your new referral code is ready to share!'
    });
  };

  const handleCopyCode = () => {
    if (currentCode) {
      navigator.clipboard.writeText(`https://jusbook.app/ref/${currentCode.code}`);
      toast({
        title: 'Copied to Clipboard',
        description: 'Your referral link has been copied!'
      });
    }
  };

  const handleAddReferral = () => {
    if (!newClientEmail || !newClientName) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both client name and email.',
        variant: 'destructive'
      });
      return;
    }

    if (referredClients.length >= maxReferrals) {
      toast({
        title: 'Referral Limit Reached',
        description: `You can track up to ${maxReferrals} referrals in your current plan. Upgrade to Pro for unlimited tracking!`,
        variant: 'destructive'
      });
      return;
    }

    if (currentCode) {
      dispatch(addReferredClient({
        referralCode: currentCode.code,
        clientEmail: newClientEmail,
        clientName: newClientName,
        status: 'pending'
      }));

      setNewClientEmail('');
      setNewClientName('');
      
      toast({
        title: 'Referral Added',
        description: `${newClientName} has been added to your referral tracking.`
      });

      // Simulate conversion after a delay (for demo purposes)
      setTimeout(() => {
        const newReferral = referredClients[referredClients.length - 1];
        if (newReferral) {
          dispatch(updateReferralStatus({
            clientId: newReferral.id,
            status: 'completed',
            rewardEarned: 50
          }));
          
          toast({
            title: 'Referral Converted!',
            description: `${newClientName} completed their first session. You earned ₹50!`
          });
        }
      }, 3000);
    }
  };

  const progressPercentage = Math.min((successfulReferrals / maxReferrals) * 100, 100);
  const shouldShowUpgradePrompt = successfulReferrals >= 2 && currentTier === 'advanced';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            🔁 Referral Engine
            <Badge variant={hasProFeature ? "default" : "secondary"}>
              {hasProFeature ? 'Pro (All Features)' : 'Advanced (Limited)'}
            </Badge>
          </h2>
          <p className="text-muted-foreground">
            {hasBasicFeature ? 'Grow your business through referrals' : 'Upgrade to access referral features'}
          </p>
        </div>
        {shouldShowUpgradePrompt && (
          <Button variant="outline" className="bg-gradient-to-r from-primary/10 to-primary/5">
            Unlock Pro Campaigns
          </Button>
        )}
      </div>

      {!hasBasicFeature ? (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="pt-6 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Referral Engine Locked</h3>
            <p className="text-muted-foreground mb-4">
              Upgrade to Advanced plan to start tracking referrals
            </p>
            <Button>Upgrade to Advanced</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Referral Code Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Copy className="h-5 w-5" />
                Your Referral Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentCode ? (
                <div className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <code className="font-mono text-lg font-bold">
                        {currentCode.code}
                      </code>
                      <Button size="sm" variant="outline" onClick={handleCopyCode}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Share: https://jusbook.app/ref/{currentCode.code}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Created on {new Date(currentCode.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Button onClick={handleGenerateCode} disabled={isLoading}>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Your First Code
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Referral Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Successful Referrals</span>
                  <span>{successfulReferrals}/{maxReferrals}</span>
                </div>
                <Progress value={progressPercentage} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{referredClients.length}</div>
                  <div className="text-sm text-muted-foreground">Total Referred</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">₹{analytics.totalRewardsEarned}</div>
                  <div className="text-sm text-muted-foreground">Rewards Earned</div>
                </div>
              </div>

              {shouldShowUpgradePrompt && (
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-3 rounded-lg">
                  <p className="text-sm font-medium">🎉 Great progress!</p>
                  <p className="text-xs text-muted-foreground">
                    Upgrade to Pro for tiered rewards and unlimited tracking
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Add Referral */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Track New Referral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="Enter client email"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddReferral} className="w-full">
                    Add Referral
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral Stats Modal */}
          <Dialog open={isStatsModalOpen} onOpenChange={setIsStatsModalOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Leaderboard
                    {!hasProFeature && <Badge variant="outline">Limited View</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {leaderboard.slice(0, 3).map((entry, index) => (
                      <div 
                        key={entry.rank}
                        className={`flex items-center justify-between p-2 rounded ${
                          entry.isCurrentUser ? 'bg-primary/10' : 'bg-muted/50'
                        } ${!hasProFeature && index > 0 ? 'blur-sm' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold">#{entry.rank}</span>
                          <span className={entry.isCurrentUser ? 'font-medium' : ''}>
                            {entry.userName}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {entry.referrals} referrals
                        </span>
                      </div>
                    ))}
                    {!hasProFeature && (
                      <div className="text-center py-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setShowFullLeaderboard(!showFullLeaderboard)}
                        >
                          {showFullLeaderboard ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                          {showFullLeaderboard ? 'Hide' : 'View'} Full Leaderboard
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Referral Leaderboard</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div 
                    key={entry.rank}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
                    } ${!hasProFeature && !entry.isCurrentUser && index > 0 ? 'blur-sm opacity-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        entry.rank === 1 ? 'bg-yellow-500 text-white' :
                        entry.rank === 2 ? 'bg-gray-400 text-white' :
                        entry.rank === 3 ? 'bg-amber-600 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {entry.rank}
                      </div>
                      <div>
                        <div className={`font-medium ${entry.isCurrentUser ? 'text-primary' : ''}`}>
                          {entry.userName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {entry.referrals} referrals • ₹{entry.rewards} earned
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {!hasProFeature && (
                  <div className="text-center py-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">
                      Upgrade to Pro to see full analytics
                    </p>
                    <Button size="sm">
                      Unlock Pro Features
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default ReferralEngine;