import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  Settings, 
  Shield, 
  CreditCard, 
  Bell, 
  Users, 
  Key, 
  Trash2, 
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  ExternalLink,
  Lock,
  Smartphone,
  Mail,
  Eye,
  EyeOff
} from 'lucide-react';

interface AccountSettings {
  security: {
    twoFactorEnabled: boolean;
    loginNotifications: boolean;
    passwordLastChanged: string;
    trustedDevices: Array<{
      id: string;
      name: string;
      lastUsed: string;
      location: string;
      current: boolean;
    }>;
    apiKeys: Array<{
      id: string;
      name: string;
      key: string;
      created: string;
      lastUsed: string;
      permissions: string[];
    }>;
  };
  billing: {
    plan: string;
    billingCycle: string;
    nextBilling: string;
    paymentMethod: {
      type: string;
      last4: string;
      expiry: string;
    };
    invoices: Array<{
      id: string;
      date: string;
      amount: number;
      status: string;
    }>;
  };
  notifications: {
    email: {
      bookings: boolean;
      reminders: boolean;
      marketing: boolean;
      security: boolean;
    };
    push: {
      bookings: boolean;
      reminders: boolean;
    };
    sms: {
      bookings: boolean;
      reminders: boolean;
    };
  };
  data: {
    exportRequests: Array<{
      id: string;
      type: string;
      requested: string;
      status: string;
    }>;
    deleteRequests: Array<{
      id: string;
      requested: string;
      status: string;
    }>;
  };
}

const AccountSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('security');
  const [showApiKey, setShowApiKey] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<AccountSettings>({
    security: {
      twoFactorEnabled: false,
      loginNotifications: true,
      passwordLastChanged: '2024-05-15',
      trustedDevices: [
        {
          id: '1',
          name: 'MacBook Pro',
          lastUsed: '2024-06-14T10:30:00Z',
          location: 'San Francisco, CA',
          current: true
        },
        {
          id: '2',
          name: 'iPhone 15',
          lastUsed: '2024-06-13T18:45:00Z',
          location: 'San Francisco, CA',
          current: false
        }
      ],
      apiKeys: [
        {
          id: '1',
          name: 'Mobile App Integration',
          key: 'ak_live_1234567890abcdef',
          created: '2024-05-01',
          lastUsed: '2024-06-14',
          permissions: ['read', 'write']
        }
      ]
    },
    billing: {
      plan: 'Professional',
      billingCycle: 'monthly',
      nextBilling: '2024-07-14',
      paymentMethod: {
        type: 'Visa',
        last4: '4242',
        expiry: '12/25'
      },
      invoices: [
        {
          id: 'INV-001',
          date: '2024-06-14',
          amount: 29.99,
          status: 'paid'
        },
        {
          id: 'INV-002',
          date: '2024-05-14',
          amount: 29.99,
          status: 'paid'
        }
      ]
    },
    notifications: {
      email: {
        bookings: true,
        reminders: true,
        marketing: false,
        security: true
      },
      push: {
        bookings: true,
        reminders: true
      },
      sms: {
        bookings: false,
        reminders: false
      }
    },
    data: {
      exportRequests: [],
      deleteRequests: []
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const savedSettings = localStorage.getItem('accountSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prevSettings => ({ ...prevSettings, ...parsedSettings }));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      localStorage.setItem('accountSettings', JSON.stringify(settings));
      toast({
        title: 'Success',
        description: 'Settings updated successfully'
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNestedChange = (section: keyof AccountSettings, subsection: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [field]: value
        }
      }
    }));
  };

  const enable2FA = async () => {
    // In a real app, this would integrate with an authenticator app
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        twoFactorEnabled: true
      }
    }));
    toast({
      title: 'Two-Factor Authentication Enabled',
      description: 'Your account is now more secure'
    });
  };

  const disable2FA = async () => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        twoFactorEnabled: false
      }
    }));
    toast({
      title: 'Two-Factor Authentication Disabled',
      description: 'Your account security has been reduced'
    });
  };

  const revokeDevice = (deviceId: string) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        trustedDevices: prev.security.trustedDevices.filter(d => d.id !== deviceId)
      }
    }));
    toast({
      title: 'Device Revoked',
      description: 'The device has been removed from your account'
    });
  };

  const generateApiKey = () => {
    const newKey = {
      id: Date.now().toString(),
      name: 'New API Key',
      key: `ak_live_${Math.random().toString(36).substr(2, 16)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      permissions: ['read']
    };
    
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        apiKeys: [...prev.security.apiKeys, newKey]
      }
    }));
    
    toast({
      title: 'API Key Generated',
      description: 'New API key has been created'
    });
  };

  const revokeApiKey = (keyId: string) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        apiKeys: prev.security.apiKeys.filter(k => k.id !== keyId)
      }
    }));
    toast({
      title: 'API Key Revoked',
      description: 'The API key has been permanently deleted'
    });
  };

  const exportData = (type: string) => {
    const newRequest = {
      id: Date.now().toString(),
      type,
      requested: new Date().toISOString(),
      status: 'processing'
    };
    
    setSettings(prev => ({
      ...prev,
      data: {
        ...prev.data,
        exportRequests: [...prev.data.exportRequests, newRequest]
      }
    }));
    
    toast({
      title: 'Export Request Submitted',
      description: `Your ${type} data export has been queued`
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="space-y-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="h-8 w-8" />
              Account Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account security, billing, and preferences
            </p>
          </div>
          
          <Button onClick={saveSettings} disabled={loading} className="btn-elegant">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="data">Data & Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="security" className="space-y-6">
            {/* Password Security */}
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Password & Authentication
                </CardTitle>
                <CardDescription>
                  Manage your password and authentication methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Last changed on {formatDate(settings.security.passwordLastChanged)}
                    </p>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {settings.security.twoFactorEnabled ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Enabled
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-600 border-orange-300">
                        <XCircle className="h-3 w-3 mr-1" />
                        Disabled
                      </Badge>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={settings.security.twoFactorEnabled ? disable2FA : enable2FA}
                    >
                      {settings.security.twoFactorEnabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Login Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone logs into your account
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.loginNotifications}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, loginNotifications: checked }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Trusted Devices */}
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Trusted Devices
                </CardTitle>
                <CardDescription>
                  Manage devices that have access to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.security.trustedDevices.map(device => (
                    <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{device.name}</h4>
                            {device.current && (
                              <Badge variant="secondary" className="text-xs">Current</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{device.location}</p>
                          <p className="text-xs text-muted-foreground">
                            Last used: {formatDateTime(device.lastUsed)}
                          </p>
                        </div>
                      </div>
                      {!device.current && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => revokeDevice(device.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* API Keys */}
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys
                </CardTitle>
                <CardDescription>
                  Manage API keys for third-party integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.security.apiKeys.map(apiKey => (
                    <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{apiKey.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {apiKey.permissions.join(', ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {showApiKey === apiKey.id ? apiKey.key : `${apiKey.key.slice(0, 12)}...`}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowApiKey(showApiKey === apiKey.id ? null : apiKey.id)}
                          >
                            {showApiKey === apiKey.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Created: {formatDate(apiKey.created)} • Last used: {apiKey.lastUsed}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => revokeApiKey(apiKey.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button onClick={generateApiKey} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate New API Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            {/* Current Plan */}
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Current Plan
                </CardTitle>
                <CardDescription>
                  Manage your subscription and billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{settings.billing.plan}</h3>
                    <p className="text-sm text-muted-foreground">
                      Billed {settings.billing.billingCycle} • Next billing: {formatDate(settings.billing.nextBilling)}
                    </p>
                  </div>
                  <Button variant="outline">Change Plan</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Payment Method</h4>
                    <p className="text-sm text-muted-foreground">
                      {settings.billing.paymentMethod.type} ending in {settings.billing.paymentMethod.last4}
                    </p>
                  </div>
                  <Button variant="outline">Update</Button>
                </div>
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  View and download your past invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {settings.billing.invoices.map(invoice => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{invoice.id}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(invoice.date)} • ${invoice.amount.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={invoice.status === 'paid' ? 'default' : 'destructive'}
                          className={invoice.status === 'paid' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {invoice.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            {/* Email Notifications */}
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Notifications
                </CardTitle>
                <CardDescription>
                  Choose what email notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.notifications.email).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {key === 'bookings' && 'New bookings and booking updates'}
                        {key === 'reminders' && 'Upcoming appointment reminders'}
                        {key === 'marketing' && 'Product updates and promotional content'}
                        {key === 'security' && 'Security alerts and login notifications'}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => 
                        handleNestedChange('notifications', 'email', key, checked)
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Push Notifications */}
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Push Notifications
                </CardTitle>
                <CardDescription>
                  Manage push notifications to your devices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.notifications.push).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {key === 'bookings' && 'Instant notifications for new bookings'}
                        {key === 'reminders' && 'Push reminders for upcoming appointments'}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => 
                        handleNestedChange('notifications', 'push', key, checked)
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* SMS Notifications */}
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  SMS Notifications
                </CardTitle>
                <CardDescription>
                  Receive important updates via text message
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.notifications.sms).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {key === 'bookings' && 'SMS alerts for new bookings'}
                        {key === 'reminders' && 'Text reminders before appointments'}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => 
                        handleNestedChange('notifications', 'sms', key, checked)
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            {/* Data Export */}
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Data Export
                </CardTitle>
                <CardDescription>
                  Download your data in a portable format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => exportData('profile')}
                    className="justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Profile Data
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => exportData('bookings')}
                    className="justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Booking Data
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => exportData('messages')}
                    className="justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Messages
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => exportData('all')}
                    className="justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                </div>

                {settings.data.exportRequests.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Export Requests</h4>
                    {settings.data.exportRequests.map(request => (
                      <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h5 className="font-medium">{request.type} Data</h5>
                          <p className="text-sm text-muted-foreground">
                            Requested: {formatDateTime(request.requested)}
                          </p>
                        </div>
                        <Badge variant="outline">{request.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Deletion */}
            <Card className="card-elegant border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Permanently delete your account and all associated data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <h4 className="font-medium text-red-800 dark:text-red-400 mb-2">
                      Account Deletion
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                      This action cannot be undone. All your data, bookings, and settings will be permanently deleted.
                    </p>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AccountSettings;
