
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NotificationPreferences, NotificationPreview as PreviewType } from '@/types/notificationPreferences';
import { Bell, Mail, MessageSquare, Smartphone, Send, Play, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreviewProps {
  preferences: NotificationPreferences;
  onClose: () => void;
}

const sampleNotifications: PreviewType[] = [
  {
    id: '1',
    type: 'booking_confirmation',
    title: 'New Booking Request',
    message: 'John Doe has requested a 30-minute consultation for tomorrow at 2:00 PM',
    priority: 'high',
    channels: ['in_app', 'email', 'push']
  },
  {
    id: '2',
    type: 'booking_reminder',
    title: 'Upcoming Appointment',
    message: 'You have an appointment with Sarah Smith in 1 hour',
    priority: 'normal',
    channels: ['in_app', 'push']
  },
  {
    id: '3',
    type: 'payment_received',
    title: 'Payment Received',
    message: 'You received $150.00 for consultation with Mike Johnson',
    priority: 'high',
    channels: ['in_app', 'email']
  },
  {
    id: '4',
    type: 'system_update',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight from 2-4 AM',
    priority: 'low',
    channels: ['in_app']
  }
];

export const NotificationPreview: React.FC<NotificationPreviewProps> = ({ preferences, onClose }) => {
  const { toast } = useToast();
  const [selectedNotification, setSelectedNotification] = useState<string>(sampleNotifications[0].id);
  const [previewSent, setPreviewSent] = useState(false);

  const getChannelIcon = (channelId: string) => {
    const icons = {
      in_app: <Bell className="h-3 w-3" />,
      email: <Mail className="h-3 w-3" />,
      sms: <MessageSquare className="h-3 w-3" />,
      push: <Smartphone className="h-3 w-3" />,
      whatsapp: <Send className="h-3 w-3" />
    };
    return icons[channelId as keyof typeof icons] || <Bell className="h-3 w-3" />;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'bg-red-500',
      high: 'bg-orange-500',
      normal: 'bg-blue-500',
      low: 'bg-gray-500'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-500';
  };

  const selectedNotif = sampleNotifications.find(n => n.id === selectedNotification);
  const enabledChannels = preferences.channels.filter(c => c.enabled).map(c => c.id);
  const filteredChannels = selectedNotif?.channels.filter(c => 
    enabledChannels.includes(c as typeof enabledChannels[number])
  ) || [];
  const notificationPriority = preferences.prioritySettings[selectedNotif?.type || ''] || 'normal';

  const isQuietHoursActive = () => {
    if (!preferences.quietHours.enabled) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const startTime = parseInt(preferences.quietHours.startTime.replace(':', ''));
    const endTime = parseInt(preferences.quietHours.endTime.replace(':', ''));
    
    if (startTime > endTime) {
      // Overnight quiet hours (e.g., 22:00 to 08:00)
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      // Same day quiet hours
      return currentTime >= startTime && currentTime <= endTime;
    }
  };

  const handleSendPreview = async () => {
    if (!selectedNotif) return;

    try {
      // Simulate sending preview notification
      setPreviewSent(true);
      
      toast({
        title: "Preview Sent!",
        description: `Test notification sent to ${filteredChannels.length} channel(s)`,
      });

      // Reset after 3 seconds
      setTimeout(() => {
        setPreviewSent(false);
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send preview notification",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Preview Notification Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Notification Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select notification to preview:</label>
            <Select value={selectedNotification} onValueChange={setSelectedNotification}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sampleNotifications.map((notif) => (
                  <SelectItem key={notif.id} value={notif.id}>
                    {notif.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedNotif && (
            <>
              {/* Notification Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{selectedNotif.title}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(notificationPriority)}`} />
                      <Badge variant="outline" className="capitalize">
                        {notificationPriority}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{selectedNotif.message}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Will be sent via:</h4>
                      <div className="flex flex-wrap gap-2">
                        {filteredChannels.map((channelId) => (
                          <Badge key={channelId} variant="secondary" className="gap-1">
                            {getChannelIcon(channelId)}
                            {preferences.channels.find(c => c.id === channelId)?.name}
                          </Badge>
                        ))}
                        {filteredChannels.length === 0 && (
                          <Badge variant="destructive">No channels enabled</Badge>
                        )}
                      </div>
                    </div>

                    {/* Quiet Hours Warning */}
                    {isQuietHoursActive() && notificationPriority !== 'critical' && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          ⚠️ This notification would be delayed due to quiet hours
                          ({preferences.quietHours.startTime} - {preferences.quietHours.endTime})
                        </p>
                      </div>
                    )}

                    {/* Rate Limiting Info */}
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Rate limits: Max {preferences.frequencyLimits.maxPerHour}/hour, {preferences.frequencyLimits.maxPerDay}/day</p>
                      <p>Channel limits apply per delivery method</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Send Preview Button */}
              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button 
                  onClick={handleSendPreview}
                  disabled={filteredChannels.length === 0 || previewSent}
                  className="gap-2"
                >
                  {previewSent ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Sent!
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Send Test Notification
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
