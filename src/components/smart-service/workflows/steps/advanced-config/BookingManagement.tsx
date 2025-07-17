
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Calendar } from 'lucide-react';

interface BookingManagementProps {
  config: any;
  onUpdate: (field: string, value: any) => void;
}

const BookingManagement: React.FC<BookingManagementProps> = ({
  config,
  onUpdate
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Booking Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium">Buffer Time (minutes)</Label>
            <div className="mt-2">
              <Slider
                value={[config.bufferTime]}
                onValueChange={([value]) => onUpdate('bufferTime', value)}
                min={0}
                max={60}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0 min</span>
                <span className="font-medium">{config.bufferTime} min</span>
                <span>60 min</span>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Maximum Advance Booking (days)</Label>
            <Input
              type="number"
              value={config.maxAdvanceBooking}
              onChange={(e) => onUpdate('maxAdvanceBooking', parseInt(e.target.value))}
              className="mt-2"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Minimum Notice Time (hours)</Label>
            <Input
              type="number"
              value={config.minNoticeTime}
              onChange={(e) => onUpdate('minNoticeTime', parseInt(e.target.value))}
              className="mt-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Auto-confirm bookings</Label>
              <p className="text-xs text-muted-foreground">Automatically accept new bookings</p>
            </div>
            <Switch
              checked={config.autoConfirm}
              onCheckedChange={(checked) => onUpdate('autoConfirm', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Allow rescheduling</Label>
              <p className="text-xs text-muted-foreground">Let clients reschedule their bookings</p>
            </div>
            <Switch
              checked={config.allowRescheduling}
              onCheckedChange={(checked) => onUpdate('allowRescheduling', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BookingManagement;
