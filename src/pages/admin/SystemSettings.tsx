
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Mail, RefreshCw, Flag, Globe, AlertTriangle } from 'lucide-react';
import RequireRole from '@/components/auth/RequireRole';
import { useToast } from '@/hooks/use-toast';

const SystemSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    newUserRegistration: true,
    emailNotifications: true,
    auditLogging: true,
    featureFlagBeta: false,
    autoBackup: true
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: 'Setting Updated',
      description: `${key} has been ${value ? 'enabled' : 'disabled'}`,
    });
  };

  const handleManualSync = () => {
    toast({
      title: 'Sync Triggered',
      description: 'Background sync has been initiated',
    });
  };

  const backgroundJobs = [
    { name: 'Daily Cleanup', status: 'completed', lastRun: '2 hours ago' },
    { name: 'Database Backup', status: 'running', lastRun: '30 minutes ago' },
    { name: 'Email Queue', status: 'completed', lastRun: '5 minutes ago' },
    { name: 'Analytics Sync', status: 'failed', lastRun: '1 hour ago' }
  ];

  const emailStats = [
    { type: 'Welcome Emails', sent: 142, delivered: 140, failed: 2 },
    { type: 'OTP Messages', sent: 89, delivered: 87, failed: 2 },
    { type: 'Password Reset', sent: 23, delivered: 23, failed: 0 },
    { type: 'Notifications', sent: 456, delivered: 451, failed: 5 }
  ];

  return (
    <RequireRole role="platform_admin" showUI>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Settings</h1>
            <p className="text-muted-foreground">Platform configuration and controls</p>
          </div>
          <Button onClick={handleManualSync} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Trigger Sync
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Disable all user access</p>
                </div>
                <Switch
                  id="maintenance"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(value) => handleSettingChange('maintenanceMode', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="registration">New User Registration</Label>
                  <p className="text-sm text-muted-foreground">Allow new user signups</p>
                </div>
                <Switch
                  id="registration"
                  checked={settings.newUserRegistration}
                  onCheckedChange={(value) => handleSettingChange('newUserRegistration', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emails">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">System email delivery</p>
                </div>
                <Switch
                  id="emails"
                  checked={settings.emailNotifications}
                  onCheckedChange={(value) => handleSettingChange('emailNotifications', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="audit">Audit Logging</Label>
                  <p className="text-sm text-muted-foreground">Track all admin actions</p>
                </div>
                <Switch
                  id="audit"
                  checked={settings.auditLogging}
                  onCheckedChange={(value) => handleSettingChange('auditLogging', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Feature Flags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Feature Flags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="beta">Beta Features</Label>
                  <p className="text-sm text-muted-foreground">Enable experimental features</p>
                </div>
                <Switch
                  id="beta"
                  checked={settings.featureFlagBeta}
                  onCheckedChange={(value) => handleSettingChange('featureFlagBeta', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="backup">Auto Backup</Label>
                  <p className="text-sm text-muted-foreground">Automated daily backups</p>
                </div>
                <Switch
                  id="backup"
                  checked={settings.autoBackup}
                  onCheckedChange={(value) => handleSettingChange('autoBackup', value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Background Jobs Monitor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Background Jobs Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {backgroundJobs.map((job, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      job.status === 'completed' ? 'bg-green-500' :
                      job.status === 'running' ? 'bg-blue-500' : 'bg-red-500'
                    }`} />
                    <span className="font-medium">{job.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      job.status === 'completed' ? 'default' :
                      job.status === 'running' ? 'secondary' : 'destructive'
                    }>
                      {job.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Last run: {job.lastRun}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Email Delivery Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Delivery Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emailStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{stat.type}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span>Sent: {stat.sent}</span>
                    <span className="text-green-600">Delivered: {stat.delivered}</span>
                    <span className="text-red-600">Failed: {stat.failed}</span>
                    <span className="text-muted-foreground">
                      {((stat.delivered / stat.sent) * 100).toFixed(1)}% success
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </RequireRole>
  );
};

export default SystemSettings;
