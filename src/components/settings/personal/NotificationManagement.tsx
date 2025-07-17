
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Bell, Mail, Smartphone, Settings } from 'lucide-react';

interface NotificationSettings {
  email: {
    bookings: boolean;
    reminders: boolean;
    updates: boolean;
    marketing: boolean;
  };
  push: {
    bookings: boolean;
    reminders: boolean;
    updates: boolean;
  };
  sms: {
    bookings: boolean;
    reminders: boolean;
  };
}

export const NotificationManagement: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      bookings: true,
      reminders: true,
      updates: false,
      marketing: false
    },
    push: {
      bookings: true,
      reminders: true,
      updates: false
    },
    sms: {
      bookings: false,
      reminders: true
    }
  });

  const handleSettingChange = (category: keyof NotificationSettings, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Management
        </h3>
        <p className="text-muted-foreground">Control how and when you receive notifications</p>
      </div>

      {/* Email Notifications */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(settings.email).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                <p className="text-sm text-muted-foreground">
                  {key === 'bookings' && 'Get notified about new bookings and cancellations'}
                  {key === 'reminders' && 'Receive reminders before your appointments'}
                  {key === 'updates' && 'Product updates and new features'}
                  {key === 'marketing' && 'Marketing emails and promotions'}
                </p>
              </div>
              <Switch
                checked={value}
                onCheckedChange={(checked) => handleSettingChange('email', key, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(settings.push).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                <p className="text-sm text-muted-foreground">
                  {key === 'bookings' && 'Push notifications for new bookings'}
                  {key === 'reminders' && 'Push reminders before appointments'}
                  {key === 'updates' && 'App updates and announcements'}
                </p>
              </div>
              <Switch
                checked={value}
                onCheckedChange={(checked) => handleSettingChange('push', key, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            SMS Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(settings.sms).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                <p className="text-sm text-muted-foreground">
                  {key === 'bookings' && 'SMS notifications for bookings'}
                  {key === 'reminders' && 'SMS reminders before appointments'}
                </p>
              </div>
              <Switch
                checked={value}
                onCheckedChange={(checked) => handleSettingChange('sms', key, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="px-8">
          Save Settings
        </Button>
      </div>
    </div>
  );
};
