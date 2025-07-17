import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Key, 
  Smartphone, 
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Save,
  Loader2
} from 'lucide-react';

interface SecurityFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
}

const SecurityManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<SecurityFormData>();
  const newPassword = watch('newPassword');

  const [trustedDevices] = useState([
    {
      id: '1',
      name: 'MacBook Pro',
      location: 'San Francisco, CA',
      lastAccess: '2024-01-15T10:30:00Z',
      current: true
    },
    {
      id: '2', 
      name: 'iPhone 15 Pro',
      location: 'San Francisco, CA',
      lastAccess: '2024-01-14T18:45:00Z',
      current: false
    }
  ]);

  const onSubmit = async (data: SecurityFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive'
      });
      return;
    }

    try {
      setSaving(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Success',
        description: 'Security settings updated successfully'
      });
      
      reset();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update security settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTwoFactorEnabled(!twoFactorEnabled);
      
      toast({
        title: 'Success',
        description: `Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'}`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update two-factor authentication',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const removeTrustedDevice = async (deviceId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: 'Success',
        description: 'Device removed from trusted devices'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove device',
        variant: 'destructive'
      });
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: 'Enter password', color: 'gray' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score < 2) return { strength: 1, label: 'Weak', color: 'red' };
    if (score < 4) return { strength: 2, label: 'Medium', color: 'yellow' };
    return { strength: 3, label: 'Strong', color: 'green' };
  };

  const passwordStrength = getPasswordStrength(newPassword || '');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Password Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Password Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  {...register('currentPassword', { required: 'Current password is required' })}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  {...register('newPassword', { 
                    required: 'New password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' }
                  })}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {newPassword && (
                <div className="flex items-center gap-2">
                  <div className={`h-2 flex-1 rounded-full bg-${passwordStrength.color}-200`}>
                    <div 
                      className={`h-full rounded-full bg-${passwordStrength.color}-500 transition-all`}
                      style={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
                    />
                  </div>
                  <span className={`text-sm text-${passwordStrength.color}-600`}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
              {errors.newPassword && (
                <p className="text-sm text-destructive">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', { required: 'Please confirm your password' })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Password
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <div className="flex items-center gap-2">
              {twoFactorEnabled ? (
                <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Enabled
                </Badge>
              ) : (
                <Badge variant="outline" className="text-yellow-700 border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Disabled
                </Badge>
              )}
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={handleToggle2FA}
                disabled={loading}
              />
            </div>
          </div>

          {twoFactorEnabled && (
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                Two-factor authentication is active. You'll need to enter a code from your authenticator app when logging in.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Login Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Login Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email notifications for new logins</h4>
              <p className="text-sm text-muted-foreground">
                Get notified when someone logs into your account from a new device
              </p>
            </div>
            <Switch
              checked={loginNotifications}
              onCheckedChange={setLoginNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Trusted Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Trusted Devices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trustedDevices.map(device => (
            <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{device.name}</h4>
                    {device.current && (
                      <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{device.location}</p>
                  <p className="text-xs text-muted-foreground">
                    Last accessed: {new Date(device.lastAccess).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {!device.current && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => removeTrustedDevice(device.id)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityManagement;