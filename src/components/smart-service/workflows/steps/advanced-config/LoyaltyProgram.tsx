
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface LoyaltyProgramProps {
  config: any;
  onUpdate: (parent: string, field: string, value: any) => void;
}

const LoyaltyProgram: React.FC<LoyaltyProgramProps> = ({
  config,
  onUpdate
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Loyalty Program
            <Badge variant="secondary" className="ml-2">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Enable loyalty program</Label>
              <p className="text-xs text-muted-foreground">Reward repeat clients with points and discounts</p>
            </div>
            <Switch
              checked={config.loyaltyProgram.enabled}
              onCheckedChange={(checked) => 
                onUpdate('loyaltyProgram', 'enabled', checked)
              }
            />
          </div>

          {config.loyaltyProgram.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <Label className="text-sm font-medium">Points per booking</Label>
                <Input
                  type="number"
                  value={config.loyaltyProgram.pointsPerBooking}
                  onChange={(e) => 
                    onUpdate('loyaltyProgram', 'pointsPerBooking', parseInt(e.target.value))
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Discount threshold (points)</Label>
                <Input
                  type="number"
                  value={config.loyaltyProgram.discountThreshold}
                  onChange={(e) => 
                    onUpdate('loyaltyProgram', 'discountThreshold', parseInt(e.target.value))
                  }
                  className="mt-2"
                />
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LoyaltyProgram;
