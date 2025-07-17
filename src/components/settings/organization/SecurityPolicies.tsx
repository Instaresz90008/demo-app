
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Shield, Lock, Key, AlertTriangle, Save, Clock } from 'lucide-react';

interface SecurityPolicies {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expirationDays: number;
    preventReuse: number;
  };
  sessionPolicy: {
    maxSessionDuration: number;
    idleTimeout: number;
    maxConcurrentSessions: number;
    requireReauth: boolean;
  };
  accessControl: {
    twoFactorRequired: boolean;
    ipRestrictions: boolean;
    allowedIPs: string[];
    deviceTrust: boolean;
    ssoRequired: boolean;
  };
  auditSettings: {
    logFailedLogins: boolean;
    logSuccessfulLogins: boolean;
    logDataAccess: boolean;
    logConfigChanges: boolean;
    retentionDays: number;
  };
}

export const SecurityPolicies: React.FC = () => {
  const { toast } = useToast();
  const [policies, setPolicies] = useState<SecurityPolicies>({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expirationDays: 90,
      preventReuse: 5
    },
    sessionPolicy: {
      maxSessionDuration: 8,
      idleTimeout: 30,
      maxConcurrentSessions: 3,
      requireReauth: true
    },
    accessControl: {
      twoFactorRequired: true,
      ipRestrictions: false,
      allowedIPs: [],
      deviceTrust: true,
      ssoRequired: false
    },
    auditSettings: {
      logFailedLogins: true,
      logSuccessfulLogins: true,
      logDataAccess: true,
      logConfigChanges: true,
      retentionDays: 365
    }
  });

  const [newIP, setNewIP] = useState('');

  const handleSave = () => {
    console.log('Saving security policies:', policies);
    toast({
      title: "Security Policies Updated",
      description: "Security policies have been successfully updated.",
    });
  };

  const updatePasswordPolicy = (key: keyof typeof policies.passwordPolicy, value: any) => {
    setPolicies(prev => ({
      ...prev,
      passwordPolicy: { ...prev.passwordPolicy, [key]: value }
    }));
  };

  const updateSessionPolicy = (key: keyof typeof policies.sessionPolicy, value: any) => {
    setPolicies(prev => ({
      ...prev,
      sessionPolicy: { ...prev.sessionPolicy, [key]: value }
    }));
  };

  const updateAccessControl = (key: keyof typeof policies.accessControl, value: any) => {
    setPolicies(prev => ({
      ...prev,
      accessControl: { ...prev.accessControl, [key]: value }
    }));
  };

  const updateAuditSettings = (key: keyof typeof policies.auditSettings, value: any) => {
    setPolicies(prev => ({
      ...prev,
      auditSettings: { ...prev.auditSettings, [key]: value }
    }));
  };

  const addIPAddress = () => {
    if (!newIP.trim()) return;
    
    // Basic IP validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(newIP)) {
      toast({
        title: "Invalid IP Address",
        description: "Please enter a valid IP address.",
        variant: "destructive"
      });
      return;
    }

    updateAccessControl('allowedIPs', [...policies.accessControl.allowedIPs, newIP]);
    setNewIP('');
    toast({
      title: "IP Address Added",
      description: `${newIP} has been added to allowed IPs.`,
    });
  };

  const removeIPAddress = (ip: string) => {
    updateAccessControl('allowedIPs', policies.accessControl.allowedIPs.filter(addr => addr !== ip));
    toast({
      title: "IP Address Removed",
      description: `${ip} has been removed from allowed IPs.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Policies
          </h3>
          <p className="text-muted-foreground">Configure organization-wide security settings and policies</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save Policies
        </Button>
      </div>

      {/* Password Policy */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-5 w-5" />
            Password Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Length</label>
              <div className="px-3">
                <Slider
                  value={[policies.passwordPolicy.minLength]}
                  onValueChange={([value]) => updatePasswordPolicy('minLength', value)}
                  max={20}
                  min={6}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>6</span>
                  <span>{policies.passwordPolicy.minLength} characters</span>
                  <span>20</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password Expiration</label>
              <Select
                value={policies.passwordPolicy.expirationDays.toString()}
                onValueChange={(value) => updatePasswordPolicy('expirationDays', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="0">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Require Uppercase Letters</h4>
                <p className="text-sm text-muted-foreground">At least one uppercase letter (A-Z)</p>
              </div>
              <Switch
                checked={policies.passwordPolicy.requireUppercase}
                onCheckedChange={(value) => updatePasswordPolicy('requireUppercase', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Require Lowercase Letters</h4>
                <p className="text-sm text-muted-foreground">At least one lowercase letter (a-z)</p>
              </div>
              <Switch
                checked={policies.passwordPolicy.requireLowercase}
                onCheckedChange={(value) => updatePasswordPolicy('requireLowercase', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Require Numbers</h4>
                <p className="text-sm text-muted-foreground">At least one numeric digit (0-9)</p>
              </div>
              <Switch
                checked={policies.passwordPolicy.requireNumbers}
                onCheckedChange={(value) => updatePasswordPolicy('requireNumbers', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Require Special Characters</h4>
                <p className="text-sm text-muted-foreground">At least one special character (!@#$%)</p>
              </div>
              <Switch
                checked={policies.passwordPolicy.requireSpecialChars}
                onCheckedChange={(value) => updatePasswordPolicy('requireSpecialChars', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Policy */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Session Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Session Duration (hours)</label>
              <Select
                value={policies.sessionPolicy.maxSessionDuration.toString()}
                onValueChange={(value) => updateSessionPolicy('maxSessionDuration', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Idle Timeout (minutes)</label>
              <Select
                value={policies.sessionPolicy.idleTimeout.toString()}
                onValueChange={(value) => updateSessionPolicy('idleTimeout', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Concurrent Sessions</label>
              <Select
                value={policies.sessionPolicy.maxConcurrentSessions.toString()}
                onValueChange={(value) => updateSessionPolicy('maxConcurrentSessions', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 session</SelectItem>
                  <SelectItem value="2">2 sessions</SelectItem>
                  <SelectItem value="3">3 sessions</SelectItem>
                  <SelectItem value="5">5 sessions</SelectItem>
                  <SelectItem value="0">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Require Re-authentication</h4>
              <p className="text-sm text-muted-foreground">Require password for sensitive actions</p>
            </div>
            <Switch
              checked={policies.sessionPolicy.requireReauth}
              onCheckedChange={(value) => updateSessionPolicy('requireReauth', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Access Control */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Access Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Require Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">Mandatory 2FA for all users</p>
              </div>
              <Switch
                checked={policies.accessControl.twoFactorRequired}
                onCheckedChange={(value) => updateAccessControl('twoFactorRequired', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Device Trust</h4>
                <p className="text-sm text-muted-foreground">Remember trusted devices</p>
              </div>
              <Switch
                checked={policies.accessControl.deviceTrust}
                onCheckedChange={(value) => updateAccessControl('deviceTrust', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Single Sign-On Required</h4>
                <p className="text-sm text-muted-foreground">Force SSO authentication</p>
              </div>
              <Switch
                checked={policies.accessControl.ssoRequired}
                onCheckedChange={(value) => updateAccessControl('ssoRequired', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">IP Address Restrictions</h4>
                <p className="text-sm text-muted-foreground">Limit access to specific IP addresses</p>
              </div>
              <Switch
                checked={policies.accessControl.ipRestrictions}
                onCheckedChange={(value) => updateAccessControl('ipRestrictions', value)}
              />
            </div>
          </div>

          {policies.accessControl.ipRestrictions && (
            <div className="space-y-3 p-4 bg-blue-50 rounded-lg border">
              <h4 className="font-medium">Allowed IP Addresses</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter IP address (e.g., 192.168.1.1)"
                  value={newIP}
                  onChange={(e) => setNewIP(e.target.value)}
                />
                <Button onClick={addIPAddress}>Add</Button>
              </div>
              {policies.accessControl.allowedIPs.length > 0 && (
                <div className="space-y-2">
                  {policies.accessControl.allowedIPs.map((ip, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      <span className="font-mono text-sm">{ip}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeIPAddress(ip)}
                        className="text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Audit & Logging
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Log Failed Login Attempts</h4>
                <p className="text-sm text-muted-foreground">Track unsuccessful authentication attempts</p>
              </div>
              <Switch
                checked={policies.auditSettings.logFailedLogins}
                onCheckedChange={(value) => updateAuditSettings('logFailedLogins', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Log Successful Logins</h4>
                <p className="text-sm text-muted-foreground">Track successful authentication attempts</p>
              </div>
              <Switch
                checked={policies.auditSettings.logSuccessfulLogins}
                onCheckedChange={(value) => updateAuditSettings('logSuccessfulLogins', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Log Data Access</h4>
                <p className="text-sm text-muted-foreground">Track data viewing and modifications</p>
              </div>
              <Switch
                checked={policies.auditSettings.logDataAccess}
                onCheckedChange={(value) => updateAuditSettings('logDataAccess', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Log Configuration Changes</h4>
                <p className="text-sm text-muted-foreground">Track changes to system settings</p>
              </div>
              <Switch
                checked={policies.auditSettings.logConfigChanges}
                onCheckedChange={(value) => updateAuditSettings('logConfigChanges', value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Log Retention Period</label>
            <Select
              value={policies.auditSettings.retentionDays.toString()}
              onValueChange={(value) => updateAuditSettings('retentionDays', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">6 months</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
                <SelectItem value="1095">3 years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
