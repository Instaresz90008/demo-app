
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Settings, Link, Webhook, Calendar, Mail, MessageSquare, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'calendar' | 'communication' | 'crm' | 'payment' | 'automation';
  icon: React.ReactNode;
  connected: boolean;
  settings?: {
    [key: string]: any;
  };
  features: string[];
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  secret?: string;
  lastTrigger?: string;
  deliveryCount: number;
  failureCount: number;
}

const IntegrationsWebhooksPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync appointments with Google Calendar',
      category: 'calendar',
      icon: <Calendar className="h-5 w-5" />,
      connected: true,
      settings: {
        calendarId: 'primary',
        syncEvents: true,
        createMeetLinks: false
      },
      features: ['Two-way sync', 'Automatic updates', 'Meeting links']
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get notifications in your Slack workspace',
      category: 'communication',
      icon: <MessageSquare className="h-5 w-5" />,
      connected: false,
      features: ['Booking notifications', 'Custom channels', 'Team alerts']
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Sync contacts with Mailchimp lists',
      category: 'communication',
      icon: <Mail className="h-5 w-5" />,
      connected: false,
      features: ['Contact sync', 'Email campaigns', 'Segmentation']
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect with 3000+ apps via Zapier',
      category: 'automation',
      icon: <Zap className="h-5 w-5" />,
      connected: true,
      features: ['Custom workflows', 'Multi-step automation', 'Data mapping']
    }
  ]);

  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: '1',
      name: 'Booking Created',
      url: 'https://api.example.com/webhooks/booking-created',
      events: ['booking.created', 'booking.updated'],
      active: true,
      deliveryCount: 247,
      failureCount: 2,
      lastTrigger: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Payment Webhook',
      url: 'https://payments.example.com/webhook',
      events: ['payment.completed', 'payment.failed'],
      active: false,
      deliveryCount: 0,
      failureCount: 0
    }
  ]);

  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);

  const availableEvents = [
    'booking.created',
    'booking.updated',
    'booking.cancelled',
    'payment.completed',
    'payment.failed',
    'user.registered',
    'service.created'
  ];

  const handleConnectIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, connected: !integration.connected }
        : integration
    ));
    
    const integration = integrations.find(i => i.id === integrationId);
    toast({
      title: integration?.connected ? "Integration Disconnected" : "Integration Connected",
      description: `${integration?.name} has been ${integration?.connected ? 'disconnected' : 'connected'}.`,
    });
  };

  const handleSaveWebhook = (webhookData: Partial<Webhook>) => {
    if (editingWebhook) {
      setWebhooks(prev => prev.map(webhook => 
        webhook.id === editingWebhook.id ? { ...webhook, ...webhookData } : webhook
      ));
      toast({
        title: "Webhook Updated",
        description: "Webhook configuration has been updated.",
      });
    } else {
      const newWebhook: Webhook = {
        id: Date.now().toString(),
        name: webhookData.name || '',
        url: webhookData.url || '',
        events: webhookData.events || [],
        active: true,
        deliveryCount: 0,
        failureCount: 0
      };
      setWebhooks(prev => [...prev, newWebhook]);
      toast({
        title: "Webhook Created",
        description: "New webhook has been successfully created.",
      });
    }
    setIsWebhookModalOpen(false);
    setEditingWebhook(null);
  };

  const handleTestWebhook = (webhookId: string) => {
    toast({
      title: "Webhook Test",
      description: "Test payload sent to webhook endpoint.",
    });
  };

  const WebhookForm: React.FC<{ webhook?: Webhook; onSave: (data: Partial<Webhook>) => void }> = ({ 
    webhook, 
    onSave 
  }) => {
    const [formData, setFormData] = useState<Partial<Webhook>>(webhook || {
      name: '',
      url: '',
      events: [],
      active: true
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    const toggleEvent = (event: string) => {
      setFormData(prev => ({
        ...prev,
        events: prev.events?.includes(event)
          ? prev.events.filter(e => e !== event)
          : [...(prev.events || []), event]
      }));
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Webhook Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter webhook name..."
            required
          />
        </div>

        <div>
          <Label htmlFor="url">Endpoint URL</Label>
          <Input
            id="url"
            type="url"
            value={formData.url || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://your-app.com/webhook"
            required
          />
        </div>

        <div>
          <Label>Events to Listen For</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {availableEvents.map((event) => (
              <div key={event} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={event}
                  checked={formData.events?.includes(event) || false}
                  onChange={() => toggleEvent(event)}
                />
                <Label htmlFor={event} className="text-sm">{event}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={formData.active || false}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
          />
          <Label htmlFor="active">Active</Label>
        </div>

        <Button type="submit" className="w-full">
          {webhook ? 'Update Webhook' : 'Create Webhook'}
        </Button>
      </form>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🧩 Integrations & Webhooks
          </h1>
          <p className="text-muted-foreground">Connect external services and configure webhooks</p>
        </div>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="api-docs">API Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations">
          <div className="grid gap-6 md:grid-cols-2">
            {integrations.map((integration) => (
              <Card key={integration.id} className={integration.connected ? 'border-green-200' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {integration.icon}
                      <div>
                        <h3 className="font-semibold">{integration.name}</h3>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>
                    <Badge variant={integration.connected ? "default" : "outline"}>
                      {integration.connected ? 'Connected' : 'Available'}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {integration.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant={integration.connected ? "outline" : "default"}
                        onClick={() => handleConnectIntegration(integration.id)}
                        className="flex-1"
                      >
                        {integration.connected ? (
                          <>
                            <Link className="h-4 w-4 mr-2" />
                            Connected
                          </>
                        ) : (
                          'Connect'
                        )}
                      </Button>
                      {integration.connected && (
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhooks
              </CardTitle>
              <Dialog open={isWebhookModalOpen} onOpenChange={setIsWebhookModalOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingWebhook(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Webhook
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingWebhook ? 'Edit Webhook' : 'Create New Webhook'}
                    </DialogTitle>
                  </DialogHeader>
                  <WebhookForm 
                    webhook={editingWebhook || undefined} 
                    onSave={handleSaveWebhook} 
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{webhook.name}</h3>
                        <Badge variant={webhook.active ? "default" : "secondary"}>
                          {webhook.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{webhook.url}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Events: {webhook.events.length}</span>
                        <span>Delivered: {webhook.deliveryCount}</span>
                        <span>Failed: {webhook.failureCount}</span>
                        {webhook.lastTrigger && (
                          <span>Last: {new Date(webhook.lastTrigger).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestWebhook(webhook.id)}
                      >
                        Test
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingWebhook(webhook);
                          setIsWebhookModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-docs">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none">
                <h3>Webhook Events</h3>
                <p>Your webhooks will receive POST requests with the following structure:</p>
                
                <div className="bg-muted p-4 rounded-lg mt-4">
                  <pre className="text-sm">
{`{
  "event": "booking.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "id": "booking_123",
    "customer_name": "John Doe",
    "service": "Consultation",
    "date": "2024-01-20T14:00:00Z"
  }
}`}
                  </pre>
                </div>

                <h3 className="mt-6">Authentication</h3>
                <p>Each webhook request includes a signature header for verification:</p>
                
                <div className="bg-muted p-4 rounded-lg mt-4">
                  <pre className="text-sm">
{`X-JusBook-Signature: sha256=<signature>
X-JusBook-Timestamp: 1642239000`}
                  </pre>
                </div>

                <h3 className="mt-6">Event Types</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><code>booking.created</code> - New booking created</li>
                  <li><code>booking.updated</code> - Booking details modified</li>
                  <li><code>booking.cancelled</code> - Booking cancelled</li>
                  <li><code>payment.completed</code> - Payment successful</li>
                  <li><code>payment.failed</code> - Payment failed</li>
                  <li><code>user.registered</code> - New user registration</li>
                  <li><code>service.created</code> - New service added</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationsWebhooksPage;
