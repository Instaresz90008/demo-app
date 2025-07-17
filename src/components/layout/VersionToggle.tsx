
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Beaker } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const VersionToggle: React.FC = () => {
  const { toast } = useToast();

  const handleVersionChange = () => {
    toast({
      title: "Version Toggle",
      description: "This feature is coming soon!"
    });
  };

  return (
    <Button
      variant="ghost" 
      size="sm"
      onClick={handleVersionChange}
      className="gap-2"
    >
      <Beaker className="h-4 w-4" />
      <Badge variant="outline">v1.0</Badge>
    </Button>
  );
};
