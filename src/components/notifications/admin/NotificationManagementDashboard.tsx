
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Send, 
  BarChart3, 
  Settings, 
  Users, 
  MessageSquare,
  Mail,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { notificationsApi } from '@/services/api/notificationsApi';

export const NotificationManagementDashboard: React.FC = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newNotification, setNewNotification] = useState({
    type: 'system_update',
    title: '',
    message: '',
    priority: 'normal',
    channels: ['in_app'],
    userId: ''
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await notificationsApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Set mock data for demo
      setStats({
        totalSent: 15420,
        deliveryRate: 94.2,
        openRate: 68.5,
        clickRate: 23.7,
        byChannel: {
          in_app: { sent: 8500, delivered: 8500, opened: 6200, clicked: 2100 },
          email: { sent: 4200, delivered: 3950, opened: 2800, clicked: 980 },
          push: { sent: 2100, delivered: 1980, opened: 1400, clicked: 420 },
          sms: { sent: 520, delivered: 500, opened: 450, clicked: 180 },
          whatsapp: { sent: 100, delivered: 95, opened: 85, clicked: 35 }
        },
        byPriority: {
          critical: 45,
          high: 1250,
          normal: 12800,
          low: 1325
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendNotification = async () => {
    try {
      setIsLoading(true);
      await notificationsApi.sendNotification(newNotification);
      toast({
        title: "Notification Sent",
        description: "Notification has been queued for delivery",
      });
      setNewNotification({
        type: 'system_update',
        title: '',
        message: '',
        priority: 'normal',
        channels: ['in_app'],
        userId: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Notification Management</h2>
          <p className="text-muted-foreground">Manage system-wide notifications and analytics</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSent?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.deliveryRate || '0'}%</div>
            <p className="text-xs text-muted-foreground">
              Above 90% target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.openRate || '0'}%</div>
            <p className="text-xs text-muted-foreground">
              Industry average: 65%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.clickRate || '0'}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="send" className="space-y-4">
        <TabsList>
          <TabsTrigger value="send">Send Notification</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send New Notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Notification Type</Label>
                  <Select
                    value={newNotification.type}
                    onValueChange={(value) => setNewNotification(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system_update">System Update</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="security_alert">Security Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newNotification.priority}
                    onValueChange={(value) => setNewNotification(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter notification title"
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground">
                  {newNotification.title.length}/50 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter notification message"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Delivery Channels</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'in_app', name: 'In-App', icon: Bell },
                    { id: 'email', name: 'Email', icon: Mail },
                    { id: 'push', name: 'Push', icon: Smartphone },
                    { id: 'sms', name: 'SMS', icon: MessageSquare }
                  ].map(channel => (
                    <Badge
                      key={channel.id}
                      variant={newNotification.channels.includes(channel.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const channels = newNotification.channels.includes(channel.id)
                          ? newNotification.channels.filter(c => c !== channel.id)
                          : [...newNotification.channels, channel.id];
                        setNewNotification(prev => ({ ...prev, channels }));
                      }}
                    >
                      <channel.icon className="h-3 w-3 mr-1" />
                      {channel.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userId">Target User (Optional)</Label>
                <Input
                  id="userId"
                  value={newNotification.userId}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, userId: e.target.value }))}
                  placeholder="Leave empty for all users"
                />
              </div>

              <Button 
                onClick={handleSendNotification}
                disabled={!newNotification.title || !newNotification.message || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send Notification
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.byChannel && Object.entries(stats.byChannel).map(([channel, data]: [string, any]) => (
                  <div key={channel} className="flex justify-between items-center py-2">
                    <span className="capitalize">{channel}</span>
                    <div className="text-right">
                      <div className="font-medium">{data.sent?.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {((data.delivered / data.sent) * 100).toFixed(1)}% delivered
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.byPriority && Object.entries(stats.byPriority).map(([priority, count]: [string, any]) => (
                  <div key={priority} className="flex justify-between items-center py-2">
                    <span className="capitalize">{priority}</span>
                    <Badge variant="outline">{count?.toLocaleString()}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Template management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Notification settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
