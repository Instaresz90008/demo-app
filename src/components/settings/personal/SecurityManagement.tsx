
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, Key, Smartphone, AlertTriangle, Trash2, Plus } from 'lucide-react';

export const SecurityManagement: React.FC = () => {
  const { toast } = useToast();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [devices, setDevices] = useState([
    { id: '1', name: 'MacBook Pro', location: 'San Francisco, CA', lastActive: 'Active now', current: true },
    { id: '2', name: 'iPhone 14', location: 'San Francisco, CA', lastActive: '2 hours ago', current: false },
    { id: '3', name: 'Windows PC', location: 'New York, NY', lastActive: 'Yesterday', current: false }
  ]);

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Password Updated",
      description: "Your password has been successfully updated.",
    });
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast({
      title: twoFactorEnabled ? "2FA Disabled" : "2FA Enabled",
      description: twoFactorEnabled ? "Two-factor authentication has been disabled." : "Two-factor authentication has been enabled.",
    });
  };

  const handleLogoutDevice = (deviceId: string) => {
    setDevices(devices.filter(device => device.id !== deviceId));
    toast({
      title: "Device Logged Out",
      description: "The device has been successfully logged out.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Management
        </h3>
        <p className="text-muted-foreground">Manage your account security settings</p>
      </div>

      {/* Password Change */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="password"
            placeholder="Current Password"
            value={passwords.current}
            onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
          />
          <Input
            type="password"
            placeholder="New Password"
            value={passwords.new}
            onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={passwords.confirm}
            onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
          />
          <Button onClick={handlePasswordChange} className="w-full">
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-semibold">2FA Status</h4>
              <p className="text-sm text-muted-foreground">
                {twoFactorEnabled ? 'Two-factor authentication is enabled' : 'Two-factor authentication is disabled'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={twoFactorEnabled ? "default" : "outline"}>
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
              <Button onClick={handleTwoFactorToggle}>
                {twoFactorEnabled ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Devices */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Active Devices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {devices.map(device => (
            <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-full">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{device.name}</h4>
                    {device.current && (
                      <Badge variant="outline" className="text-xs">Current</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{device.location}</p>
                  <p className="text-xs text-muted-foreground">{device.lastActive}</p>
                </div>
              </div>
              {!device.current && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleLogoutDevice(device.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
