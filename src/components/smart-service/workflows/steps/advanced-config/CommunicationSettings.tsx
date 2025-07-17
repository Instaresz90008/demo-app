
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, Phone } from 'lucide-react';

interface CommunicationSettingsProps {
  config: any;
  onUpdate: (parent: string, field: string, value: any) => void;
}

const CommunicationSettings: React.FC<CommunicationSettingsProps> = ({
  config,
  onUpdate
}) => {
  return (
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <Label className="text-sm font-medium">Email reminders</Label>
            </div>
            <Switch
              checked={config.reminderSettings.email}
              onCheckedChange={(checked) => 
                onUpdate('reminderSettings', 'email', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <Label className="text-sm font-medium">SMS reminders</Label>
            </div>
            <Switch
              checked={config.reminderSettings.sms}
              onCheckedChange={(checked) => 
                onUpdate('reminderSettings', 'sms', checked)
              }
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Reminder timing (hours before)</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="number"
                placeholder="24"
                value={config.reminderSettings.timing[0]}
                onChange={(e) => {
                  const timing = [...config.reminderSettings.timing];
                  timing[0] = parseInt(e.target.value);
                  onUpdate('reminderSettings', 'timing', timing);
                }}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="2"
                value={config.reminderSettings.timing[1]}
                onChange={(e) => {
                  const timing = [...config.reminderSettings.timing];
                  timing[1] = parseInt(e.target.value);
                  onUpdate('reminderSettings', 'timing', timing);
                }}
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CommunicationSettings;
