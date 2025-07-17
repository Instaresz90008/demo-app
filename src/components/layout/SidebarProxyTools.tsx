import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

interface SidebarProxyToolsProps {
  collapsed: boolean;
}

export const SidebarProxyTools: React.FC<SidebarProxyToolsProps> = ({ collapsed }) => {
  if (collapsed) return null;

  return (
    <div className="p-3 border-t border-border">
      <Card className="bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs flex items-center gap-2">
            <Shield className="h-3 w-3" />
            Proxy Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Badge variant="secondary" className="text-xs">
            Simplified System
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default SidebarProxyTools;