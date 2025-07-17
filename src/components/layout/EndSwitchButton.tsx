
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const EndSwitchButton: React.FC = () => {
  const { user } = useAuth();
  
  // Simplified - proxy session removed
  if (!user?.roles.includes('platform_admin')) return null;

  const handleEndProxySession = () => {
    // Simplified proxy session functionality
  };

  return (
    <div className="p-3 border-t border-border bg-muted/30">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Eye className="h-3 w-3" />
          <span>Viewing as: {user?.name}</span>
        </div>
        <Button 
          onClick={handleEndProxySession}
          variant="outline" 
          size="sm" 
          className="w-full gap-2 text-xs"
        >
          <ArrowLeft className="h-3 w-3" />
          Switch Back to Platform Admin
        </Button>
      </div>
    </div>
  );
};
