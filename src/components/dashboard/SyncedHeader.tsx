
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Settings, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const SyncedHeader = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate sync operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast({
      title: "Sync Complete",
      description: "Your data has been synchronized successfully.",
    });
  };

  const handleSyncSettings = () => {
    toast({
      title: "Sync Settings",
      description: "Sync configuration will be available in the beta release.",
    });
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Zap className={`h-4 w-4 ${isConnected ? 'text-green-500' : 'text-gray-400'}`} />
          {isConnected && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>
        <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
          {isConnected ? 'Synced' : 'Offline'}
        </span>
      </div>
      
      <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300">
        Coming Soon - Beta
      </Badge>
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSyncSettings}
          className="h-8 w-8 p-0"
        >
          <Settings className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default SyncedHeader;
