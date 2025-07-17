
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Globe, Key, Settings, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  type: 'sso' | 'calendar' | 'communication' | 'storage' | 'analytics';
  config: Record<string, any>;
  lastSync?: string;
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
  expiresAt?: string;
}

export const IntegrationSettings: React.FC = () => {
  const { toast } = useToast();
  const [newKeyName, setNewKeyName] = useState('');
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'google-sso',
      name: 'Google SSO',
      description: 'Single Sign-On with Google Workspace',
      status: 'connected',
      type: 'sso',
      config: { domain: 'techcorp.com' },
      lastSync: '2024-06-15T10:30:00Z'
    },
    {
      id: 'outlook-calendar',
      name: 'Outlook Calendar',
      description: 'Sync events with Microsoft Outlook',
      status: 'connected',
      type: 'calendar',
      config: { syncDirection: 'bidirectional' },
      lastSync: '2024-06-15T09:15:00Z'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team notifications and updates',
      status: 'disconnected',
      type: 'communication',
      config: {}
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Track user engagement and usage',
      status: 'error',
      type: 'analytics',
      config: { trackingId: 'GA-123456789' }
    },
    {
      id: 'aws-s3',
      name: 'AWS S3',
      description: 'File storage and backup',
      status: 'disconnected',
      type: 'storage',
      config: {}
    }
  ]);

  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Mobile App Integration',
      key: 'sk_live_*************XYZP',
      permissions: ['read_events', 'write_events', 'read_users'],
      createdAt: '2024-01-15',
      lastUsed: '2024-06-10',
      expiresAt: '2025-01-15'
    },
    {
      id: '2',
      name: 'Third-party Calendar Sync',
      key: 'sk_test_*************ABCD',
      permissions: ['read_events', 'write_events'],
      createdAt: '2024-03-01',
      lastUsed: '2024-06-09'
    }
  ]);

  const handleToggleIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => {
      if (integration.id === integrationId) {
        const newStatus = integration.status === 'connected' ? 'disconnected' : 'connected';
        
        toast({
          title: newStatus === 'connected' ? "Integration Connected" : "Integration Disconnected",
          description: `${integration.name} has been ${newStatus}.`,
        });

        return {
          ...integration,
          status: newStatus as any,
          lastSync: newStatus === 'connected' ? new Date().toISOString() : undefined
        };
      }
      return integration;
    }));
  };

  const handleConfigureIntegration = (integrationId: string) => {
    toast({
      title: "Configuration",
      description: "Integration configuration modal would open here.",
    });
  };

  const handleCreateAPIKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for the API key.",
        variant: "destructive"
      });
      return;
    }

    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `sk_${Date.now()}_${'x'.repeat(20)}`,
      permissions: ['read_events'],
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setApiKeys(prev => [...prev, newKey]);
    setNewKeyName('');
    setShowNewKeyModal(false);
    
    toast({
      title: "API Key Created",
      description: `"${newKey.name}" API key has been created successfully.`,
    });
  };

  const handleRevokeAPIKey = (keyId: string) => {
    const key = apiKeys.find(k => k.id === keyId);
    if (!key) return;

    if (window.confirm(`Are you sure you want to revoke the "${key.name}" API key?`)) {
      setApiKeys(prev => prev.filter(k => k.id !== keyId));
      toast({
        title: "API Key Revoked",
        description: `"${key.name}" API key has been revoked.`,
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastSync = (lastSync?: string) => {
    if (!lastSync) return 'Never';
    const date = new Date(lastSync);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Integration Settings
        </h3>
        <p className="text-muted-foreground">Manage third-party integrations and API access</p>
      </div>

      {/* Active Integrations */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Active Integrations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrations.filter(i => i.status === 'connected').map((integration) => (
            <div key={integration.id} className="flex items-start justify-between p-4 border rounded-lg bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  {getStatusIcon(integration.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{integration.name}</h4>
                    <Badge className={getStatusColor(integration.status)}>
                      {integration.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {integration.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{integration.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Last sync: {formatLastSync(integration.lastSync)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleConfigureIntegration(integration.id)}
                  className="gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Configure
                </Button>
                <Switch
                  checked={integration.status === 'connected'}
                  onCheckedChange={() => handleToggleIntegration(integration.id)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Available Integrations */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Available Integrations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrations.filter(i => i.status !== 'connected').map((integration) => (
            <div key={integration.id} className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getStatusIcon(integration.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{integration.name}</h4>
                    <Badge className={getStatusColor(integration.status)}>
                      {integration.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {integration.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                  {integration.status === 'error' && (
                    <p className="text-xs text-red-600 mt-1">
                      Configuration error - please reconfigure
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleConfigureIntegration(integration.id)}
                  className="gap-2"
                >
                  <Settings className="h-4 w-4" />
                  {integration.status === 'error' ? 'Fix' : 'Setup'}
                </Button>
                <Switch
                  checked={false}
                  onCheckedChange={() => handleToggleIntegration(integration.id)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Keys
            </CardTitle>
            <Button onClick={() => setShowNewKeyModal(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create API Key
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">{apiKey.name}</h4>
                  <div className="flex gap-1">
                    {apiKey.permissions.map(permission => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="font-mono text-sm bg-secondary px-2 py-1 rounded mb-2">
                  {apiKey.key}
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Created: {new Date(apiKey.createdAt).toLocaleDateString()}</div>
                  <div>Last used: {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : 'Never'}</div>
                  {apiKey.expiresAt && (
                    <div>Expires: {new Date(apiKey.expiresAt).toLocaleDateString()}</div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(apiKey.key);
                    toast({ title: "Copied", description: "API key copied to clipboard." });
                  }}
                >
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRevokeAPIKey(apiKey.id)}
                  className="text-destructive hover:text-destructive gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Revoke
                </Button>
              </div>
            </div>
          ))}

          {apiKeys.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No API keys created yet.</p>
              <p className="text-sm">Create API keys to enable third-party access to your organization.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create API Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Create API Key
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Key Name</label>
                <Input
                  placeholder="Enter a descriptive name"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Permissions</label>
                <Select defaultValue="read_events">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read_events">Read Events</SelectItem>
                    <SelectItem value="write_events">Write Events</SelectItem>
                    <SelectItem value="read_users">Read Users</SelectItem>
                    <SelectItem value="admin">Full Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateAPIKey} className="flex-1">
                  Create Key
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewKeyModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
