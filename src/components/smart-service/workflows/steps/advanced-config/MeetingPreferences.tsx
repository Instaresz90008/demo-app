
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Video, Phone, MapPin } from 'lucide-react';

interface MeetingPreferencesProps {
  config: any;
  onUpdate: (parent: string, field: string, value: any) => void;
}

const MeetingPreferences: React.FC<MeetingPreferencesProps> = ({
  config,
  onUpdate
}) => {
  return (
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <Label className="text-sm font-medium">Video calls</Label>
            </div>
            <Switch
              checked={config.meetingPreferences.video}
              onCheckedChange={(checked) => 
                onUpdate('meetingPreferences', 'video', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <Label className="text-sm font-medium">Phone calls</Label>
            </div>
            <Switch
              checked={config.meetingPreferences.phone}
              onCheckedChange={(checked) => 
                onUpdate('meetingPreferences', 'phone', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <Label className="text-sm font-medium">In-person meetings</Label>
            </div>
            <Switch
              checked={config.meetingPreferences.inPerson}
              onCheckedChange={(checked) => 
                onUpdate('meetingPreferences', 'inPerson', checked)
              }
            />
          </div>

          {config.meetingPreferences.inPerson && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <Label className="text-sm font-medium">Meeting location</Label>
              <Input
                placeholder="Enter your office address..."
                value={config.meetingPreferences.location}
                onChange={(e) => 
                  onUpdate('meetingPreferences', 'location', e.target.value)
                }
                className="mt-2"
              />
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MeetingPreferences;
