
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { DollarSign } from 'lucide-react';

interface PaymentSettingsProps {
  config: any;
  onUpdate: (field: string, value: any) => void;
}

const PaymentSettings: React.FC<PaymentSettingsProps> = ({
  config,
  onUpdate
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            Payment & Deposits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Require deposit</Label>
              <p className="text-xs text-muted-foreground">Secure bookings with upfront payment</p>
            </div>
            <Switch
              checked={config.requireDeposit}
              onCheckedChange={(checked) => onUpdate('requireDeposit', checked)}
            />
          </div>

          {config.requireDeposit && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <div>
                <Label className="text-sm font-medium">Deposit Amount (%)</Label>
                <div className="mt-2">
                  <Slider
                    value={[config.depositAmount]}
                    onValueChange={([value]) => onUpdate('depositAmount', value)}
                    min={10}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>10%</span>
                    <span className="font-medium">{config.depositAmount}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div>
            <Label className="text-sm font-medium">Cancellation Policy</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['24-hour', '48-hour', '1-week', 'flexible'].map((policy) => (
                <Button
                  key={policy}
                  variant={config.cancellationPolicy === policy ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onUpdate('cancellationPolicy', policy)}
                  className="text-xs"
                >
                  {policy}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PaymentSettings;
