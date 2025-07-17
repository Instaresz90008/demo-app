
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Shield, AlertTriangle, Lock, Eye, Search, Ban } from 'lucide-react';
import RequireRole from '@/components/auth/RequireRole';
import { useToast } from '@/hooks/use-toast';

const SecurityMonitor: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const securityIncidents = [
    {
      id: 1,
      type: 'Failed Login Attempts',
      severity: 'medium',
      count: 15,
      userEmail: 'suspicious@example.com',
      timestamp: '2 hours ago',
      ipAddress: '192.168.1.100',
      status: 'monitoring'
    },
    {
      id: 2,
      type: 'Unusual API Usage',
      severity: 'high',
      count: 1,
      userEmail: 'api.user@company.com',
      timestamp: '30 minutes ago',
      ipAddress: '10.0.0.50',
      status: 'investigating'
    },
    {
      id: 3,
      type: 'Multiple Device Logins',
      severity: 'low',
      count: 3,
      userEmail: 'john.doe@example.com',
      timestamp: '1 hour ago',
      ipAddress: 'Multiple IPs',
      status: 'resolved'
    }
  ];

  const suspiciousUsers = [
    {
      id: 'user_123',
      email: 'fake.user@domain.com',
      risk: 'high',
      reasons: ['Proxy usage', 'Rapid account creation', 'Suspicious email pattern'],
      joinDate: '2 days ago',
      lastActivity: '1 hour ago'
    },
    {
      id: 'user_456',
      email: 'test.account@temp.com',
      risk: 'medium',
      reasons: ['Temporary email domain', 'No profile completion'],
      joinDate: '1 week ago',
      lastActivity: '3 hours ago'
    }
  ];

  const handleBlockUser = (userId: string) => {
    toast({
      title: 'User Blocked',
      description: `User ${userId} has been temporarily suspended`,
    });
  };

  const handleInvestigate = (incidentId: number) => {
    toast({
      title: 'Investigation Started',
      description: `Security incident #${incidentId} is being investigated`,
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <RequireRole role="platform_admin" showUI>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Security Monitor</h1>
            <p className="text-muted-foreground">Security incidents and threat detection</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">System Secure</Badge>
          </div>
        </div>

        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">High priority incidents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blocked IPs</CardTitle>
              <Ban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">Automatically blocked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>
        </div>

        {/* Security Incidents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Security Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityIncidents.map((incident) => (
                <div key={incident.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className={`h-5 w-5 ${
                      incident.severity === 'high' ? 'text-red-500' :
                      incident.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{incident.type}</span>
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        User: {incident.userEmail} • IP: {incident.ipAddress}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {incident.count} occurrences • {incident.timestamp}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{incident.status}</Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleInvestigate(incident.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Investigate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Suspicious Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Suspicious Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {suspiciousUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.email}</span>
                        <Badge variant={getRiskColor(user.risk)}>
                          {user.risk} risk
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ID: {user.id} • Joined: {user.joinDate} • Last seen: {user.lastActivity}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Flags: {user.reasons.join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleBlockUser(user.id)}
                    >
                      <Ban className="h-4 w-4 mr-1" />
                      Block
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Profile
                    </Button>
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

export default SecurityMonitor;
