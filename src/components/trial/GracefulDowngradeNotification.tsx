
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { CheckCircle, Lock, ArrowRight, Percent } from 'lucide-react';

interface GracefulDowngradeNotificationProps {
  onUpgrade: () => void;
  onDismiss: () => void;
  showDiscount?: boolean;
}

export const GracefulDowngradeNotification: React.FC<GracefulDowngradeNotificationProps> = ({
  onUpgrade,
  onDismiss,
  showDiscount = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-gray-900">🧾 Trial Ended - Now on Basic Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Your booking page and services remain live</span>
            </div>
            
            <div className="text-gray-700 font-medium mb-2">🔒 Some features are now disabled:</div>
            <div className="space-y-1 ml-6">
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-gray-400" />
                <span className="text-gray-500">Calendar Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-gray-400" />
                <span className="text-gray-500">Payment Features</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-gray-400" />
                <span className="text-gray-500">Custom Branding</span>
              </div>
            </div>
          </div>

          {showDiscount && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-700">
                <Percent className="w-4 h-4" />
                <span className="font-medium">Limited Time: 30% off this week!</span>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-gray-600 mb-4">
            💡 You can upgrade any time to regain full access
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onDismiss}
              className="flex-1"
            >
              Continue with Basic
            </Button>
            <Button
              onClick={onUpgrade}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700"
            >
              Upgrade to Advanced
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
