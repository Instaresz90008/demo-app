import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  MessageSquare,
  Save,
  Loader2
} from 'lucide-react';
import settingsApi, { NotificationSettings } from '@/services/api/settingsApi';

const NotificationManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, setValue, watch } = useForm<NotificationSettings>();
  const watchedValues = watch();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await settingsApi.getSettings();
      
      if (settings.notifications) {
        Object.entries(settings.notifications).forEach(([key, value]) => {
          setValue(key as keyof NotificationSettings, value);
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load notification settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: NotificationSettings) => {
    try {
      setSaving(true);
      await settingsApi.updateNotifications(data);
      
      toast({
        title: 'Success',
        description: 'Notification preferences updated successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update notification settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Booking Confirmations</h4>
                <p className="text-sm text-muted-foreground">Receive emails when bookings are confirmed</p>
              </div>
              <Switch
                checked={watchedValues.email?.bookingConfirmations || false}
                onCheckedChange={(checked) => setValue('email.bookingConfirmations', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Reminder Emails</h4>
                <p className="text-sm text-muted-foreground">Get reminders before upcoming appointments</p>
              </div>
              <Switch
                checked={watchedValues.email?.reminderEmails || false}
                onCheckedChange={(checked) => setValue('email.reminderEmails', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Promotional Emails</h4>
                <p className="text-sm text-muted-foreground">Receive updates about new features and offers</p>
              </div>
              <Switch
                checked={watchedValues.email?.promotionalEmails || false}
                onCheckedChange={(checked) => setValue('email.promotionalEmails', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">System Updates</h4>
                <p className="text-sm text-muted-foreground">Important system notifications and maintenance alerts</p>
              </div>
              <Switch
                checked={watchedValues.email?.systemUpdates || false}
                onCheckedChange={(checked) => setValue('email.systemUpdates', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Push Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Push Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Booking Reminders</h4>
                <p className="text-sm text-muted-foreground">Browser notifications for upcoming appointments</p>
              </div>
              <Switch
                checked={watchedValues.push?.bookingReminders || false}
                onCheckedChange={(checked) => setValue('push.bookingReminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">New Bookings</h4>
                <p className="text-sm text-muted-foreground">Instant notifications for new booking requests</p>
              </div>
              <Switch
                checked={watchedValues.push?.newBookings || false}
                onCheckedChange={(checked) => setValue('push.newBookings', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Cancellations</h4>
                <p className="text-sm text-muted-foreground">Notifications when bookings are cancelled</p>
              </div>
              <Switch
                checked={watchedValues.push?.cancellations || false}
                onCheckedChange={(checked) => setValue('push.cancellations', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">System Alerts</h4>
                <p className="text-sm text-muted-foreground">Critical system notifications</p>
              </div>
              <Switch
                checked={watchedValues.push?.systemAlerts || false}
                onCheckedChange={(checked) => setValue('push.systemAlerts', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* SMS Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              SMS Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Urgent Notifications</h4>
                <p className="text-sm text-muted-foreground">SMS for critical alerts and emergencies</p>
              </div>
              <Switch
                checked={watchedValues.sms?.urgentNotifications || false}
                onCheckedChange={(checked) => setValue('sms.urgentNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Booking Reminders</h4>
                <p className="text-sm text-muted-foreground">SMS reminders for upcoming appointments</p>
              </div>
              <Switch
                checked={watchedValues.sms?.bookingReminders || false}
                onCheckedChange={(checked) => setValue('sms.bookingReminders', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="min-w-32">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NotificationManagement;