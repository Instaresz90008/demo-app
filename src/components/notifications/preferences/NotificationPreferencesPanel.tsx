import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { NotificationChannel, NotificationPreferences, QuietHours, FrequencyLimits, NotificationPriority } from '@/types/notificationPreferences';
import { Bell, Mail, MessageSquare, Smartphone, Send, Clock, Volume2, VolumeX, Play } from 'lucide-react';
import { NotificationPreview } from './NotificationPreview';

const defaultChannels: NotificationChannel[] = [
  { id: 'in_app', name: 'In-App', enabled: true, icon: 'Bell' },
  { id: 'email', name: 'Email', enabled: true, icon: 'Mail' },
  { id: 'sms', name: 'SMS', enabled: false, icon: 'MessageSquare' },
  { id: 'push', name: 'Push', enabled: true, icon: 'Smartphone' },
  { id: 'whatsapp', name: 'WhatsApp', enabled: false, icon: 'Send' }
];

const notificationTypes = [
  'booking_confirmation',
  'booking_reminder', 
  'payment_received',
  'cancellation',
  'system_update'
];

const priorityLevels = [
  { id: 'critical', name: 'Critical', color: 'bg-red-500' },
  { id: 'high', name: 'High', color: 'bg-orange-500' },
  { id: 'normal', name: 'Normal', color: 'bg-blue-500' },
  { id: 'low', name: 'Low', color: 'bg-gray-500' }
] as const;

export const NotificationPreferencesPanel: React.FC = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    userId: 'current-user',
    channels: defaultChannels,
    prioritySettings: {
      booking_confirmation: 'high',
      booking_reminder: 'normal',
      payment_received: 'high',
      cancellation: 'critical',
      system_update: 'low'
    },
    quietHours: {
      enabled: true,
      startTime: '22:00',
      endTime: '08:00',
      timezone: 'America/Los_Angeles'
    },
    frequencyLimits: {
      maxPerHour: 10,
      maxPerDay: 50,
      perChannelLimits: {
        sms: 5,
        email: 20,
        whatsapp: 10,
        push: 30,
        in_app: 50
      }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const [showPreview, setShowPreview] = useState(false);

  const getChannelIcon = (iconName: string) => {
    const icons = {
      Bell: <Bell className="h-4 w-4" />,
      Mail: <Mail className="h-4 w-4" />,
      MessageSquare: <MessageSquare className="h-4 w-4" />,
      Smartphone: <Smartphone className="h-4 w-4" />,
      Send: <Send className="h-4 w-4" />
    };
    return icons[iconName as keyof typeof icons] || <Bell className="h-4 w-4" />;
  };

  const updateChannelEnabled = (channelId: string, enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      channels: prev.channels.map(channel =>
        channel.id === channelId ? { ...channel, enabled } : channel
      ),
      updatedAt: new Date()
    }));
  };

  const updatePrioritySettings = (notificationType: string, priority: string) => {
    setPreferences(prev => ({
      ...prev,
      prioritySettings: {
        ...prev.prioritySettings,
        [notificationType]: priority as NotificationPriority['id']
      },
      updatedAt: new Date()
    }));
  };

  const updateQuietHours = (updates: Partial<QuietHours>) => {
    setPreferences(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        ...updates
      },
      updatedAt: new Date()
    }));
  };

  const updateFrequencyLimits = (updates: Partial<FrequencyLimits>) => {
    setPreferences(prev => ({
      ...prev,
      frequencyLimits: {
        ...prev.frequencyLimits,
        ...updates
      },
      updatedAt: new Date()
    }));
  };

  const handleSave = async () => {
    try {
      // API call to save preferences
      console.log('Saving notification preferences:', preferences);
      toast({
        title: "Preferences Saved",
        description: "Your notification preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification preferences.",
        variant: "destructive",
      });
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Notification Preferences</h2>
          <p className="text-muted-foreground">Configure how and when you receive notifications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview} className="gap-2">
            <Play className="h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>

      {/* Channel Toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Channels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {preferences.channels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getChannelIcon(channel.icon)}
                  <div>
                    <h4 className="font-medium">{channel.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Max {preferences.frequencyLimits.perChannelLimits[channel.id] || 'Unlimited'}/day
                    </p>
                  </div>
                </div>
                <Switch
                  checked={channel.enabled}
                  onCheckedChange={(enabled) => updateChannelEnabled(channel.id, enabled)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Level Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notificationTypes.map((type) => (
              <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium capitalize">{type.replace('_', ' ')}</h4>
                  <p className="text-sm text-muted-foreground">
                    Set priority level for this notification type
                  </p>
                </div>
                <Select
                  value={preferences.prioritySettings[type]}
                  onValueChange={(value) => updatePrioritySettings(type, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityLevels.map((priority) => (
                      <SelectItem key={priority.id} value={priority.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${priority.color}`} />
                          {priority.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {preferences.quietHours.enabled ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            Quiet Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable Quiet Hours</h4>
              <p className="text-sm text-muted-foreground">
                Pause non-critical notifications during these hours
              </p>
            </div>
            <Switch
              checked={preferences.quietHours.enabled}
              onCheckedChange={(enabled) => updateQuietHours({ enabled })}
            />
          </div>
          
          {preferences.quietHours.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={preferences.quietHours.startTime}
                  onChange={(e) => updateQuietHours({ startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={preferences.quietHours.endTime}
                  onChange={(e) => updateQuietHours({ endTime: e.target.value })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Frequency Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Frequency Limits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Maximum notifications per hour: {preferences.frequencyLimits.maxPerHour}</Label>
              <Slider
                value={[preferences.frequencyLimits.maxPerHour]}
                onValueChange={([value]) => updateFrequencyLimits({ maxPerHour: value })}
                max={50}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label>Maximum notifications per day: {preferences.frequencyLimits.maxPerDay}</Label>
              <Slider
                value={[preferences.frequencyLimits.maxPerDay]}
                onValueChange={([value]) => updateFrequencyLimits({ maxPerDay: value })}
                max={200}
                min={10}
                step={5}
                className="mt-2"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Per-Channel Daily Limits</h4>
            {preferences.channels.filter(c => c.enabled).map((channel) => (
              <div key={channel.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getChannelIcon(channel.icon)}
                  <span className="text-sm">{channel.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="w-20 h-8"
                    value={preferences.frequencyLimits.perChannelLimits[channel.id] || 0}
                    onChange={(e) => updateFrequencyLimits({
                      perChannelLimits: {
                        ...preferences.frequencyLimits.perChannelLimits,
                        [channel.id]: parseInt(e.target.value) || 0
                      }
                    })}
                    min={0}
                    max={100}
                  />
                  <span className="text-sm text-muted-foreground">/day</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showPreview && (
        <NotificationPreview
          preferences={preferences}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};
