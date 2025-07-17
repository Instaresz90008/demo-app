
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Key, Copy, Eye, EyeOff, Trash2, Activity, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  rateLimits: {
    requests: number;
    period: 'minute' | 'hour' | 'day';
  };
  lastUsed?: string;
  created: string;
  expiresAt?: string;
  active: boolean;
  usage: {
    total: number;
    today: number;
    thisMonth: number;
  };
}

interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  permissions: string[];
  rateLimit: string;
}

const ApiManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Main API Key',
      key: 'jb_live_1234567890abcdef',
      permissions: ['read:bookings', 'write:bookings', 'read:services'],
      rateLimits: { requests: 1000, period: 'hour' },
      lastUsed: '2024-01-15T10:30:00Z',
      created: '2024-01-01T00:00:00Z',
      active: true,
      usage: { total: 15847, today: 23, thisMonth: 1247 }
    },
    {
      id: '2',
      name: 'Integration Key',
      key: 'jb_live_abcdef1234567890',
      permissions: ['read:bookings', 'read:services'],
      rateLimits: { requests: 500, period: 'hour' },
      lastUsed: '2024-01-14T16:45:00Z',
      created: '2024-01-10T00:00:00Z',
      expiresAt: '2024-12-31T23:59:59Z',
      active: true,
      usage: { total: 5234, today: 12, thisMonth: 456 }
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const availablePermissions = [
    'read:bookings',
    'write:bookings',
    'delete:bookings',
    'read:services',
    'write:services',
    'delete:services',
    'read:customers',
    'write:customers',
    'read:analytics',
    'admin:all'
  ];

  const apiEndpoints: APIEndpoint[] = [
    {
      method: 'GET',
      path: '/api/bookings',
      description: 'List all bookings',
      permissions: ['read:bookings'],
      rateLimit: '100/hour'
    },
    {
      method: 'POST',
      path: '/api/bookings',
      description: 'Create a new booking',
      permissions: ['write:bookings'],
      rateLimit: '50/hour'
    },
    {
      method: 'GET',
      path: '/api/services',
      description: 'List all services',
      permissions: ['read:services'],
      rateLimit: '200/hour'
    },
    {
      method: 'PUT',
      path: '/api/bookings/{id}',
      description: 'Update a booking',
      permissions: ['write:bookings'],
      rateLimit: '50/hour'
    },
    {
      method: 'DELETE',
      path: '/api/bookings/{id}',
      description: 'Cancel a booking',
      permissions: ['delete:bookings'],
      rateLimit: '20/hour'
    }
  ];

  const handleCreateAPIKey = (keyData: Partial<APIKey>) => {
    const newKey: APIKey = {
      id: Date.now().toString(),
      name: keyData.name || '',
      key: `jb_live_${Math.random().toString(36).substring(2, 18)}`,
      permissions: keyData.permissions || [],
      rateLimits: keyData.rateLimits || { requests: 100, period: 'hour' },
      created: new Date().toISOString(),
      expiresAt: keyData.expiresAt,
      active: true,
      usage: { total: 0, today: 0, thisMonth: 0 }
    };

    setApiKeys(prev => [...prev, newKey]);
    toast({
      title: "API Key Created",
      description: "New API key has been generated successfully.",
    });
    setIsModalOpen(false);
  };

  const handleRevokeKey = (keyId: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === keyId ? { ...key, active: false } : key
    ));
    toast({
      title: "API Key Revoked",
      description: "API key has been deactivated.",
      variant: "destructive"
    });
  };

  const handleDeleteKey = (keyId: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== keyId));
    toast({
      title: "API Key Deleted",
      description: "API key has been permanently deleted.",
      variant: "destructive"
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard.",
    });
  };

  const maskApiKey = (key: string) => {
    return key.substring(0, 8) + '...' + key.substring(key.length - 4);
  };

  const APIKeyForm: React.FC<{ onSave: (data: Partial<APIKey>) => void }> = ({ onSave }) => {
    const [formData, setFormData] = useState<Partial<APIKey>>({
      name: '',
      permissions: [],
      rateLimits: { requests: 100, period: 'hour' }
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    const togglePermission = (permission: string) => {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions?.includes(permission)
          ? prev.permissions.filter(p => p !== permission)
          : [...(prev.permissions || []), permission]
      }));
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">API Key Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Integration Key, Mobile App Key"
            required
          />
        </div>

        <div>
          <Label>Permissions</Label>
          <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
            {availablePermissions.map((permission) => (
              <div key={permission} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={permission}
                  checked={formData.permissions?.includes(permission) || false}
                  onChange={() => togglePermission(permission)}
                />
                <Label htmlFor={permission} className="text-sm">{permission}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="requests">Rate Limit (Requests)</Label>
            <Input
              id="requests"
              type="number"
              value={formData.rateLimits?.requests || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                rateLimits: { 
                  ...prev.rateLimits!, 
                  requests: parseInt(e.target.value) 
                }
              }))}
              min={1}
              required
            />
          </div>
          <div>
            <Label htmlFor="period">Period</Label>
            <Select 
              value={formData.rateLimits?.period} 
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                rateLimits: { 
                  ...prev.rateLimits!, 
                  period: value as 'minute' | 'hour' | 'day' 
                }
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minute">Per Minute</SelectItem>
                <SelectItem value="hour">Per Hour</SelectItem>
                <SelectItem value="day">Per Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
          <Input
            id="expiresAt"
            type="datetime-local"
            value={formData.expiresAt ? formData.expiresAt.slice(0, 16) : ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              expiresAt: e.target.value ? new Date(e.target.value).toISOString() : undefined 
            }))}
          />
        </div>

        <Button type="submit" className="w-full">
          Generate API Key
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
            🔑 API Key Management
          </h1>
          <p className="text-muted-foreground">Generate and manage API keys for integrations</p>
        </div>
      </div>

      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="keys">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate New Key
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Generate New API Key</DialogTitle>
                  </DialogHeader>
                  <APIKeyForm onSave={handleCreateAPIKey} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <Card key={apiKey.id} className={`${!apiKey.active ? 'opacity-60' : ''}`}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{apiKey.name}</h3>
                              <Badge variant={apiKey.active ? "default" : "secondary"}>
                                {apiKey.active ? 'Active' : 'Revoked'}
                              </Badge>
                              {apiKey.expiresAt && (
                                <Badge variant="outline">
                                  Expires {new Date(apiKey.expiresAt).toLocaleDateString()}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="text-sm bg-muted px-2 py-1 rounded">
                                {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleKeyVisibility(apiKey.id)}
                              >
                                {visibleKeys.has(apiKey.id) ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(apiKey.key)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {apiKey.active && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRevokeKey(apiKey.id)}
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Revoke
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteKey(apiKey.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Total Requests</div>
                            <div className="font-medium">{apiKey.usage.total.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Today</div>
                            <div className="font-medium">{apiKey.usage.today}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">This Month</div>
                            <div className="font-medium">{apiKey.usage.thisMonth.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Rate Limit</div>
                            <div className="font-medium">
                              {apiKey.rateLimits.requests}/{apiKey.rateLimits.period}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground mb-2">Permissions:</div>
                          <div className="flex flex-wrap gap-1">
                            {apiKey.permissions.map((permission, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Created: {new Date(apiKey.created).toLocaleDateString()} | 
                          Last used: {apiKey.lastUsed 
                            ? new Date(apiKey.lastUsed).toLocaleDateString() 
                            : 'Never'
                          }
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                API Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant={
                          endpoint.method === 'GET' ? 'default' :
                          endpoint.method === 'POST' ? 'secondary' :
                          endpoint.method === 'PUT' ? 'outline' : 'destructive'
                        }>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm">{endpoint.path}</code>
                      </div>
                      <Badge variant="outline">{endpoint.rateLimit}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{endpoint.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {endpoint.permissions.map((permission, permIndex) => (
                        <Badge key={permIndex} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <h3>Authentication</h3>
                <p>Include your API key in the Authorization header:</p>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
{`Authorization: Bearer YOUR_API_KEY`}
                  </pre>
                </div>

                <h3>Base URL</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
{`https://api.jusbook.com/v1`}
                  </pre>
                </div>

                <h3>Example Request</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
{`curl -X GET "https://api.jusbook.com/v1/bookings" \\
  -H "Authorization: Bearer jb_live_1234567890abcdef" \\
  -H "Content-Type: application/json"`}
                  </pre>
                </div>

                <h3>Response Format</h3>
                <p>All API responses follow this format:</p>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
{`{
  "success": true,
  "data": { ... },
  "message": "Success",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}`}
                  </pre>
                </div>

                <h3>Rate Limiting</h3>
                <p>API requests are rate limited based on your key configuration. Exceeded limits return HTTP 429.</p>
                
                <h3>Error Codes</h3>
                <ul>
                  <li><code>400</code> - Bad Request</li>
                  <li><code>401</code> - Unauthorized</li>
                  <li><code>403</code> - Forbidden</li>
                  <li><code>404</code> - Not Found</li>
                  <li><code>429</code> - Too Many Requests</li>
                  <li><code>500</code> - Internal Server Error</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiManagementPage;
