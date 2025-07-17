
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Crown, DollarSign } from 'lucide-react';

interface FeatureLockedPromptProps {
  featureName: string;
  featureDescription: string;
  onUpgrade: () => void;
  onClose: () => void;
}

const advancedFeatures = [
  'Smart Calendar Sync',
  'Payment Links',
  'Analytics Dashboard',
  'Advanced Service Filters'
];

export const FeatureLockedPrompt: React.FC<FeatureLockedPromptProps> = ({
  featureName,
  featureDescription,
  onUpgrade,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-purple-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">🔒 This feature is part of Jusbook Advanced</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <strong>{featureName}:</strong> {featureDescription}
          </div>
          
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">✅ Upgrade to unlock:</div>
            <div className="space-y-1">
              {advancedFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-purple-600 bg-purple-50 p-3 rounded-lg">
            <DollarSign className="w-4 h-4" />
            <span>starts at just <strong>$5/month</strong></span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button
              onClick={onUpgrade}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Advanced
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
