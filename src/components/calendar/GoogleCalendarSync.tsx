
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, CheckCircle, AlertCircle, Calendar, Loader2 } from "lucide-react";

interface GoogleCalendarSyncProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSync: () => void;
}

const GoogleCalendarSync: React.FC<GoogleCalendarSyncProps> = ({
  open,
  onOpenChange,
  onSync
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate Google OAuth flow
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnected(true);
    setIsConnecting(false);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncProgress(0);
    
    // Simulate sync progress
    const intervals = [20, 40, 60, 80, 100];
    for (const progress of intervals) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSyncProgress(progress);
    }
    
    onSync();
    setIsSyncing(false);
    setSyncProgress(0);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Google Calendar Integration
          </DialogTitle>
          <DialogDescription>
            Sync your slots with Google Calendar for better organization.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="font-medium">
                {isConnected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {/* Sync Features */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Sync Features:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                One-way sync to Google Calendar
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Automatic slot updates
              </li>
              <li className="flex items-center gap-2">
                <AlertCircle className="h-3 w-3 text-orange-500" />
                Real-time notifications (Coming soon)
              </li>
            </ul>
          </div>

          {/* Sync Progress */}
          {isSyncing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Syncing slots...</span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isConnecting || isSyncing}
          >
            Close
          </Button>
          
          {!isConnected ? (
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-2"
            >
              {isConnecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
              {isConnecting ? 'Connecting...' : 'Connect Google'}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleDisconnect}
                size="sm"
              >
                Disconnect
              </Button>
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="flex items-center gap-2"
                size="sm"
              >
                {isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleCalendarSync;
