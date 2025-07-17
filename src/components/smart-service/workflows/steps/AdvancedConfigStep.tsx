
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings2, Clock, Users, DollarSign, Shield, 
  Bell, Calendar, MapPin, Phone, Video, Mail,
  Zap, Star, Gift, ArrowRight, ArrowLeft
} from 'lucide-react';
import { BookingType, PricingModel } from '@/types/smartService';

interface AdvancedConfigStepProps {
  bookingType: BookingType;
  pricingModel: PricingModel;
  config: any;
  onConfigChange: (config: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const AdvancedConfigStep: React.FC<AdvancedConfigStepProps> = ({
  bookingType,
  pricingModel,
  config,
  onConfigChange,
  onNext,
  onBack
}) => {
  const [advancedConfig, setAdvancedConfig] = useState({
    bufferTime: config.bufferTime || 15,
    maxAdvanceBooking: config.maxAdvanceBooking || 30,
    minNoticeTime: config.minNoticeTime || 2,
    autoConfirm: config.autoConfirm || true,
    allowRescheduling: config.allowRescheduling || true,
    requireDeposit: config.requireDeposit || false,
    depositAmount: config.depositAmount || 25,
    cancellationPolicy: config.cancellationPolicy || '24-hour',
    reminderSettings: config.reminderSettings || {
      email: true,
      sms: false,
      timing: [24, 2] // hours before
    },
    meetingPreferences: config.meetingPreferences || {
      video: true,
      phone: true,
      inPerson: false,
      location: ''
    },
    customFields: config.customFields || [],
    loyaltyProgram: config.loyaltyProgram || {
      enabled: false,
      pointsPerBooking: 10,
      discountThreshold: 100
    },
    ...config
  });

  const updateConfig = (field: string, value: any) => {
    const updated = { ...advancedConfig, [field]: value };
    setAdvancedConfig(updated);
    onConfigChange(updated);
  };

  const updateNestedConfig = (parent: string, field: string, value: any) => {
    const updated = {
      ...advancedConfig,
      [parent]: {
        ...advancedConfig[parent as keyof typeof advancedConfig],
        [field]: value
      }
    };
    setAdvancedConfig(updated);
    onConfigChange(updated);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold mb-2">Advanced Configuration</h2>
        <p className="text-muted-foreground">
          Fine-tune your {bookingType.name} service with {pricingModel.name} pricing
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Management */}
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
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Buffer Time (minutes)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[advancedConfig.bufferTime]}
                      onValueChange={([value]) => updateConfig('bufferTime', value)}
                      min={0}
                      max={60}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0 min</span>
                      <span className="font-medium">{advancedConfig.bufferTime} min</span>
                      <span>60 min</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Maximum Advance Booking (days)</Label>
                  <Input
                    type="number"
                    value={advancedConfig.maxAdvanceBooking}
                    onChange={(e) => updateConfig('maxAdvanceBooking', parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Minimum Notice Time (hours)</Label>
                  <Input
                    type="number"
                    value={advancedConfig.minNoticeTime}
                    onChange={(e) => updateConfig('minNoticeTime', parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Auto-confirm bookings</Label>
                    <p className="text-xs text-muted-foreground">Automatically accept new bookings</p>
                  </div>
                  <Switch
                    checked={advancedConfig.autoConfirm}
                    onCheckedChange={(checked) => updateConfig('autoConfirm', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Allow rescheduling</Label>
                    <p className="text-xs text-muted-foreground">Let clients reschedule their bookings</p>
                  </div>
                  <Switch
                    checked={advancedConfig.allowRescheduling}
                    onCheckedChange={(checked) => updateConfig('allowRescheduling', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment & Deposits */}
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
                  checked={advancedConfig.requireDeposit}
                  onCheckedChange={(checked) => updateConfig('requireDeposit', checked)}
                />
              </div>

              {advancedConfig.requireDeposit && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <div>
                    <Label className="text-sm font-medium">Deposit Amount (%)</Label>
                    <div className="mt-2">
                      <Slider
                        value={[advancedConfig.depositAmount]}
                        onValueChange={([value]) => updateConfig('depositAmount', value)}
                        min={10}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>10%</span>
                        <span className="font-medium">{advancedConfig.depositAmount}%</span>
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
                      variant={advancedConfig.cancellationPolicy === policy ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateConfig('cancellationPolicy', policy)}
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

        {/* Communication Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-500" />
                Communication & Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <Label className="text-sm font-medium">Email reminders</Label>
                  </div>
                  <Switch
                    checked={advancedConfig.reminderSettings.email}
                    onCheckedChange={(checked) => 
                      updateNestedConfig('reminderSettings', 'email', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <Label className="text-sm font-medium">SMS reminders</Label>
                  </div>
                  <Switch
                    checked={advancedConfig.reminderSettings.sms}
                    onCheckedChange={(checked) => 
                      updateNestedConfig('reminderSettings', 'sms', checked)
                    }
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Reminder timing (hours before)</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="number"
                      placeholder="24"
                      value={advancedConfig.reminderSettings.timing[0]}
                      onChange={(e) => {
                        const timing = [...advancedConfig.reminderSettings.timing];
                        timing[0] = parseInt(e.target.value);
                        updateNestedConfig('reminderSettings', 'timing', timing);
                      }}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="2"
                      value={advancedConfig.reminderSettings.timing[1]}
                      onChange={(e) => {
                        const timing = [...advancedConfig.reminderSettings.timing];
                        timing[1] = parseInt(e.target.value);
                        updateNestedConfig('reminderSettings', 'timing', timing);
                      }}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Meeting Preferences */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-indigo-500" />
                Meeting Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    <Label className="text-sm font-medium">Video calls</Label>
                  </div>
                  <Switch
                    checked={advancedConfig.meetingPreferences.video}
                    onCheckedChange={(checked) => 
                      updateNestedConfig('meetingPreferences', 'video', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <Label className="text-sm font-medium">Phone calls</Label>
                  </div>
                  <Switch
                    checked={advancedConfig.meetingPreferences.phone}
                    onCheckedChange={(checked) => 
                      updateNestedConfig('meetingPreferences', 'phone', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <Label className="text-sm font-medium">In-person meetings</Label>
                  </div>
                  <Switch
                    checked={advancedConfig.meetingPreferences.inPerson}
                    onCheckedChange={(checked) => 
                      updateNestedConfig('meetingPreferences', 'inPerson', checked)
                    }
                  />
                </div>

                {advancedConfig.meetingPreferences.inPerson && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <Label className="text-sm font-medium">Meeting location</Label>
                    <Input
                      placeholder="Enter your office address..."
                      value={advancedConfig.meetingPreferences.location}
                      onChange={(e) => 
                        updateNestedConfig('meetingPreferences', 'location', e.target.value)
                      }
                      className="mt-2"
                    />
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Loyalty Program */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
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
                  checked={advancedConfig.loyaltyProgram.enabled}
                  onCheckedChange={(checked) => 
                    updateNestedConfig('loyaltyProgram', 'enabled', checked)
                  }
                />
              </div>

              {advancedConfig.loyaltyProgram.enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <Label className="text-sm font-medium">Points per booking</Label>
                    <Input
                      type="number"
                      value={advancedConfig.loyaltyProgram.pointsPerBooking}
                      onChange={(e) => 
                        updateNestedConfig('loyaltyProgram', 'pointsPerBooking', parseInt(e.target.value))
                      }
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Discount threshold (points)</Label>
                    <Input
                      type="number"
                      value={advancedConfig.loyaltyProgram.discountThreshold}
                      onChange={(e) => 
                        updateNestedConfig('loyaltyProgram', 'discountThreshold', parseInt(e.target.value))
                      }
                      className="mt-2"
                    />
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-between items-center pt-6"
      >
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Availability
        </Button>
        
        <Button onClick={onNext} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          Continue to Summary
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
};

export default AdvancedConfigStep;
