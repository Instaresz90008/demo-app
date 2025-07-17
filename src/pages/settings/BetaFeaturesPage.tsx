
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, TestTube, Zap, Brain, Calendar, MessageSquare, BarChart3, Lock, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BetaFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'available' | 'coming-soon' | 'early-access';
  enabled: boolean;
  category: 'ai' | 'automation' | 'analytics' | 'integration' | 'ui';
  releaseDate?: string;
  feedback: {
    rating: number;
    count: number;
  };
  risks: string[];
  benefits: string[];
}

interface Experiment {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  participants: number;
  results?: {
    improvement: string;
    confidence: number;
  };
}

const BetaFeaturesPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [betaFeatures, setBetaFeatures] = useState<BetaFeature[]>([
    {
      id: 'ai-assistant-v2',
      name: 'AI Assistant V2',
      description: 'Enhanced AI with better context understanding and multilingual support',
      icon: <Brain className="h-5 w-5" />,
      status: 'early-access',
      enabled: false,
      category: 'ai',
      releaseDate: '2024-03-01',
      feedback: { rating: 4.2, count: 23 },
      risks: ['May provide inconsistent responses', 'Higher API costs'],
      benefits: ['Better conversation flow', 'Support for 20+ languages', 'Improved accuracy']
    },
    {
      id: 'smart-scheduling',
      name: 'Smart Scheduling AI',
      description: 'AI that automatically suggests optimal booking times based on patterns',
      icon: <Calendar className="h-5 w-5" />,
      status: 'available',
      enabled: true,
      category: 'ai',
      feedback: { rating: 4.7, count: 156 },
      risks: ['May suggest suboptimal times initially'],
      benefits: ['Increased booking efficiency', 'Reduced no-shows', 'Better time utilization']
    },
    {
      id: 'voice-booking',
      name: 'Voice Booking Interface',
      description: 'Allow customers to make bookings using voice commands',
      icon: <MessageSquare className="h-5 w-5" />,
      status: 'coming-soon',
      enabled: false,
      category: 'ui',
      releaseDate: '2024-04-15',
      feedback: { rating: 0, count: 0 },
      risks: ['Voice recognition accuracy issues', 'Privacy concerns'],
      benefits: ['Accessibility improvement', 'Hands-free booking', 'Modern user experience']
    },
    {
      id: 'predictive-analytics',
      name: 'Predictive Analytics Dashboard',
      description: 'AI-powered insights to predict booking trends and revenue',
      icon: <BarChart3 className="h-5 w-5" />,
      status: 'early-access',
      enabled: false,
      category: 'analytics',
      feedback: { rating: 3.9, count: 45 },
      risks: ['Predictions may be inaccurate initially', 'Requires historical data'],
      benefits: ['Better business planning', 'Revenue optimization', 'Trend identification']
    },
    {
      id: 'auto-workflow',
      name: 'Automated Workflow Builder',
      description: 'Visual workflow builder for complex automation scenarios',
      icon: <Zap className="h-5 w-5" />,
      status: 'available',
      enabled: false,
      category: 'automation',
      feedback: { rating: 4.1, count: 89 },
      risks: ['Complex setup required', 'May affect system performance'],
      benefits: ['Reduced manual work', 'Complex automation possible', 'Custom business logic']
    }
  ]);

  const [experiments, setExperiments] = useState<Experiment[]>([
    {
      id: 'booking-flow-optimization',
      name: 'Booking Flow Optimization',
      description: 'Testing different booking flow designs to improve conversion rates',
      status: 'active',
      progress: 65,
      participants: 1250
    },
    {
      id: 'ai-response-timing',
      name: 'AI Response Timing',
      description: 'Optimizing AI response delays for better user experience',
      status: 'completed',
      progress: 100,
      participants: 890,
      results: {
        improvement: '+12% user satisfaction',
        confidence: 95
      }
    },
    {
      id: 'mobile-ui-refresh',
      name: 'Mobile UI Refresh',
      description: 'Testing new mobile interface design patterns',
      status: 'paused',
      progress: 30,
      participants: 445
    }
  ]);

  const handleToggleFeature = (featureId: string) => {
    setBetaFeatures(prev => prev.map(feature => 
      feature.id === featureId 
        ? { ...feature, enabled: !feature.enabled }
        : feature
    ));

    const feature = betaFeatures.find(f => f.id === featureId);
    toast({
      title: feature?.enabled ? "Beta Feature Disabled" : "Beta Feature Enabled",
      description: `${feature?.name} has been ${feature?.enabled ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleProvideFeedback = (featureId: string) => {
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback! It helps us improve our beta features.",
    });
  };

  const categories = [
    { id: 'all', name: 'All Features', count: betaFeatures.length },
    { id: 'ai', name: 'AI Features', count: betaFeatures.filter(f => f.category === 'ai').length },
    { id: 'automation', name: 'Automation', count: betaFeatures.filter(f => f.category === 'automation').length },
    { id: 'analytics', name: 'Analytics', count: betaFeatures.filter(f => f.category === 'analytics').length },
    { id: 'ui', name: 'UI/UX', count: betaFeatures.filter(f => f.category === 'ui').length }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFeatures = selectedCategory === 'all' 
    ? betaFeatures 
    : betaFeatures.filter(feature => feature.category === selectedCategory);

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
            🧪 Beta Features / Labs
          </h1>
          <p className="text-muted-foreground">Try experimental features and upcoming functionality</p>
        </div>
      </div>

      {/* Upgrade Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="font-medium text-yellow-800">Professional Plan Required</h3>
              <p className="text-sm text-yellow-700">
                Beta features and labs are available with Professional plan and above. 
                <Button variant="link" className="p-0 h-auto text-yellow-700 underline ml-1">
                  Upgrade now
                </Button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList>
          <TabsTrigger value="features">Beta Features</TabsTrigger>
          <TabsTrigger value="experiments">Experiments</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="features">
          <div className="space-y-6">
            {/* Category Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name} ({category.count})
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Beta Features */}
            <div className="grid gap-6 md:grid-cols-2">
              {filteredFeatures.map((feature) => (
                <Card key={feature.id} className={feature.enabled ? 'border-blue-200' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {feature.icon}
                        <div>
                          <CardTitle className="text-lg">{feature.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={
                              feature.status === 'available' ? 'default' :
                              feature.status === 'early-access' ? 'secondary' : 'outline'
                            }>
                              {feature.status === 'available' ? 'Available' :
                               feature.status === 'early-access' ? 'Early Access' : 'Coming Soon'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {feature.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {feature.status !== 'coming-soon' && (
                        <Switch
                          checked={feature.enabled}
                          onCheckedChange={() => handleToggleFeature(feature.id)}
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{feature.description}</p>

                    {feature.feedback.count > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{feature.feedback.rating}</span>
                        </div>
                        <span className="text-muted-foreground">
                          ({feature.feedback.count} reviews)
                        </span>
                      </div>
                    )}

                    {feature.releaseDate && feature.status === 'coming-soon' && (
                      <p className="text-xs text-muted-foreground">
                        Expected release: {new Date(feature.releaseDate).toLocaleDateString()}
                      </p>
                    )}

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-green-700 mb-1">Benefits:</h4>
                        <ul className="text-xs text-green-600 space-y-1">
                          {feature.benefits.map((benefit, index) => (
                            <li key={index}>• {benefit}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-orange-700 mb-1">Risks:</h4>
                        <ul className="text-xs text-orange-600 space-y-1">
                          {feature.risks.map((risk, index) => (
                            <li key={index}>• {risk}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {feature.enabled && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleProvideFeedback(feature.id)}
                      >
                        Provide Feedback
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="experiments">
          <div className="space-y-4">
            {experiments.map((experiment) => (
              <Card key={experiment.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{experiment.name}</h3>
                        <p className="text-sm text-muted-foreground">{experiment.description}</p>
                      </div>
                      <Badge variant={
                        experiment.status === 'active' ? 'default' :
                        experiment.status === 'completed' ? 'secondary' : 'outline'
                      }>
                        {experiment.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{experiment.progress}%</span>
                      </div>
                      <Progress value={experiment.progress} className="h-2" />
                    </div>

                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Participants: {experiment.participants.toLocaleString()}</span>
                      {experiment.results && (
                        <span className="text-green-600">
                          {experiment.results.improvement} (
                          {experiment.results.confidence}% confidence)
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Beta Feedback Portal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <TestTube className="h-4 w-4" />
                <AlertDescription>
                  Your feedback is invaluable! Help us improve beta features by sharing your experience.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="font-medium">How to Provide Feedback:</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>1. Enable a beta feature from the Beta Features tab</p>
                  <p>2. Use the feature in your daily workflow</p>
                  <p>3. Click "Provide Feedback" on the feature card</p>
                  <p>4. Share your experience, bugs, and suggestions</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Active Beta Programs:</h3>
                <div className="grid gap-3">
                  {betaFeatures
                    .filter(f => f.enabled)
                    .map((feature) => (
                      <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {feature.icon}
                          <span className="font-medium">{feature.name}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Give Feedback
                        </Button>
                      </div>
                    ))}
                </div>
                {betaFeatures.filter(f => f.enabled).length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No beta features currently enabled. Enable some features to provide feedback!
                  </p>
                )}
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Feedback Guidelines:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Be specific about issues or suggestions</li>
                  <li>• Include steps to reproduce bugs</li>
                  <li>• Mention your use case and workflow</li>
                  <li>• Rate the overall experience (1-5 stars)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BetaFeaturesPage;
