
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { AlertTriangle, X, Crown } from 'lucide-react';

interface TrialExpiringBannerProps {
  onUpgrade: () => void;
  onDismiss: () => void;
}

export const TrialExpiringBanner: React.FC<TrialExpiringBannerProps> = ({
  onUpgrade,
  onDismiss
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <Alert className="bg-gradient-to-r from-red-600 to-red-700 text-white border-none rounded-none">
        <AlertTriangle className="h-5 w-5" />
        <AlertDescription className="flex items-center justify-between w-full">
          <div className="flex-1">
            <div className="font-semibold mb-1">🚨 Last day of your free Advanced trial!</div>
            <div className="text-sm opacity-90">
              From tomorrow, Calendar Sync, Payment Collection, Custom Branding & Priority Support will be turned off.
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onUpgrade}
              className="bg-white text-red-600 hover:bg-gray-100 font-semibold"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-white hover:bg-red-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};
