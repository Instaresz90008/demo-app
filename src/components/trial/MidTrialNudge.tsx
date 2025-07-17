
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Zap, ArrowRight } from 'lucide-react';

interface MidTrialNudgeProps {
  userFirstName: string;
  daysLeft: number;
  onUpgrade: () => void;
  onDismiss: () => void;
}

export const MidTrialNudge: React.FC<MidTrialNudgeProps> = ({
  userFirstName,
  daysLeft,
  onUpgrade,
  onDismiss
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 right-4 z-50 w-96"
    >
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
            <Clock className="w-5 h-5" />
            ⏳ {userFirstName}, your Advanced trial ends in {daysLeft} days!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-amber-700">
            <p className="mb-3">You're currently enjoying:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Custom Branding</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Multiple Calendar Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Smart Availability Logic</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Payment Links & Reminders</span>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-100 p-3 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800 font-medium">
              💡 Users who upgrade now retain full access without any disruption.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDismiss}
              className="flex-1"
            >
              Later
            </Button>
            <Button
              onClick={onUpgrade}
              className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
