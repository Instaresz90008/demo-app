
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Globe, Calendar, Mail, MessageSquare, FileText, Settings, Plus, Trash2 } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  connected: boolean;
  lastSync?: string;
  features: string[];
  permissions: string[];
}

export const IntegrationManagement: React.FC = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync events with your Google Calendar',
      icon: Calendar,
      connected: true,
      lastSync: '2024-06-15T10:30:00Z',
      features: ['Event sync', 'Two-way sync', 'Conflict detection'],
      permissions: ['Read calendar', 'Write events', 'Manage invitations']
    },
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Send email notifications through Gmail',
      icon: Mail,
      connected: true,
      lastSync: '2024-06-15T09:15:00Z',
      features: ['Email notifications', 'Template customization', 'Tracking'],
      permissions: ['Send emails', 'Read contact list']
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get notifications in your Slack workspace',
      icon: MessageSquare,
      connected: false,
      features: ['Team notifications', 'Custom channels', 'Bot integration'],
      permissions: ['Post messages', 'Read channels', 'Bot scope']
    },
    {
      id: 'zoom',
      name: 'Zoom',
      description: 'Create and manage Zoom meetings automatically',
      icon: Globe,
      connected: false,
      features: ['Auto meeting creation', 'Recording management', 'Participant tracking'],
      permissions: ['Create meetings', 'Manage recordings', 'Access participant data']
    },
    {
      id: 'microsoft-office',
      name: 'Microsoft Office 365',
      description: 'Integrate with Outlook and Teams',
      icon: FileText,
      connected: false,
      features: ['Outlook sync', 'Teams integration', 'OneDrive storage'],
      permissions: ['Calendar access', 'Email access', 'File storage']
    }
  ]);

  const handleToggleIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => {
      if (integration.id === integrationId) {
        const newConnected = !integration.connected;
        
        toast({
          title: newConnected ? "Integration Connected" : "Integration Disconnected",
          description: `${integration.name} has been ${newConnected ? 'connected' : 'disconnected'} successfully.`,
        });

        return {
          ...integration,
          connected: newConnected,
          lastSync: newConnected ? new Date().toISOString() : undefined
        };
      }
      return integration;
    }));
  };

  const handleConfigureIntegration = (integrationId: string) => {
    toast({
      title: "Configuration",
      description: `Opening configuration for ${integrations.find(i => i.id === integrationId)?.name}...`,
    });
  };

  const handleRefreshSync = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration?.connected) return;

    setIntegrations(prev => prev.map(int => 
      int.id === integrationId 
        ? { ...int, lastSync: new Date().toISOString() }
        : int
    ));

    toast({
      title: "Sync Refreshed",
      description: `${integration.name} has been synced successfully.`,
    });
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
          Integrations
        </h3>
        <p className="text-muted-foreground">Connect your favorite tools and services</p>
      </div>

      {/* Connected Integrations */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Connected Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrations.filter(i => i.connected).map((integration) => (
            <div key={integration.id} className="flex items-start justify-between p-4 border rounded-lg bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <integration.icon className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{integration.name}</h4>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{integration.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Last sync: {formatLastSync(integration.lastSync)}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {integration.features.slice(0, 2).map(feature => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {integration.features.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{integration.features.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRefreshSync(integration.id)}
                  className="gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Sync
                </Button>
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
                  checked={integration.connected}
                  onCheckedChange={() => handleToggleIntegration(integration.id)}
                />
              </div>
            </div>
          ))}
          
          {integrations.filter(i => i.connected).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No connected integrations yet.</p>
              <p className="text-sm">Connect your favorite services below to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Integrations */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Available Integrations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrations.filter(i => !i.connected).map((integration) => (
            <div key={integration.id} className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <integration.icon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{integration.name}</h4>
                    <Badge variant="outline">Available</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{integration.description}</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Features:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {integration.features.map(feature => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Permissions required:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {integration.permissions.map(permission => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleToggleIntegration(integration.id)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Connect
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Integration Tips */}
      <Card className="shadow-lg border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Integration Tips</h4>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• Connect your calendar for automatic event syncing</li>
                <li>• Set up email integration for seamless notifications</li>
                <li>• Use Slack integration to keep your team updated</li>
                <li>• All integrations can be disconnected at any time</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
