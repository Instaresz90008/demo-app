
import React from 'react';
import { useComponentAccessControl } from '@/hooks/useComponentAccessControl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  Settings, 
  Shield,
  Lock,
  AlertTriangle,
  Volume2
} from 'lucide-react';

const VoiceAssistant = () => {
  const { 
    loading, 
    hasRequiredAccess, 
    trackComponentFeatureUsage 
  } = useComponentAccessControl({
    requiredFeatures: ['voice_assistant'],
    componentName: 'VoiceAssistant',
    trackUsage: true
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasRequiredAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-center space-y-2">
          <Lock className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground max-w-md">
            You don't have permission to access Voice Assistant. 
            This feature requires special privileges.
          </p>
        </div>
        <Badge variant="destructive" className="gap-2">
          <AlertTriangle className="h-3 w-3" />
          Voice Assistant Access Required
        </Badge>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Volume2 className="h-8 w-8" />
            Voice Assistant
          </h1>
          <p className="text-muted-foreground">
            Manage and configure voice interactions
          </p>
        </div>
        
        <Badge variant="secondary" className="gap-1">
          <Mic className="h-3 w-3" />
          Voice Enabled
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voice Commands</CardTitle>
            <Mic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Active commands
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              Recognition rate
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Voice Assistant Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Voice assistant functionality is being loaded...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceAssistant;
