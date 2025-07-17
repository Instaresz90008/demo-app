
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Sparkles, MessageSquare, Calendar } from 'lucide-react';
import { useEnhancedAccessControl } from '@/hooks/useEnhancedAccessControl';

interface TaraAIGateProps {
  children: React.ReactNode;
  aiFeature: 'booking_only' | 'full';
  fallback?: React.ReactNode;
}

const TaraAIGate: React.FC<TaraAIGateProps> = ({
  children,
  aiFeature,
  fallback
}) => {
  const { capabilities, getUpgradeNudge } = useEnhancedAccessControl();
  
  const checkAIAccess = () => {
    const aiAccess = capabilities?.aiAccess;
    
    // If aiAccess is true (boolean), allow booking_only but not full
    if (aiAccess === true) {
      return aiFeature === 'booking_only';
    }
    
    // If aiAccess is a string, check exact match or if user has 'full' access
    if (typeof aiAccess === 'string') {
      return aiAccess === aiFeature || aiAccess === 'full';
    }
    
    // If aiAccess is false or undefined, deny access
    return false;
  };
  
  const hasAccess = checkAIAccess();
  
  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const nudge = getUpgradeNudge();

  return (
    <Card className="border-dashed border-2 border-purple-200 bg-purple-50 dark:bg-purple-950/20">
      <CardHeader className="text-center pb-3">
        <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-2">
          <Bot className="h-6 w-6 text-purple-600" />
        </div>
        <CardTitle className="text-lg text-purple-800 dark:text-purple-200">
          Meet Tara AI Assistant
        </CardTitle>
        <Badge variant="secondary" className="w-fit mx-auto">
          {aiFeature === 'booking_only' ? 'Booking AI' : 'Full AI Suite'}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span>Smart booking management</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MessageSquare className="h-4 w-4 text-purple-600" />
            <span>Customer service automation</span>
          </div>
          {aiFeature === 'full' && (
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span>Advanced AI prompts & insights</span>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <p className="text-purple-700 dark:text-purple-300 text-sm mb-3">
            Tara AI is available in Professional & Enterprise plans
          </p>
          <Button className="w-full">
            <Bot className="w-4 h-4 mr-2" />
            {nudge?.ctaText || 'Unlock Tara AI'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaraAIGate;
