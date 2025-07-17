
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Settings, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const AvailabilityToggle = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [availabilityMode, setAvailabilityMode] = useState<'auto' | 'manual'>('auto');
  const { toast } = useToast();

  const handleToggle = (checked: boolean) => {
    setIsAvailable(checked);
    toast({
      title: checked ? "You're now available" : "You're now unavailable",
      description: checked 
        ? "New bookings can be scheduled with you" 
        : "New bookings are temporarily paused",
    });
  };

  const handleModeChange = (mode: 'auto' | 'manual') => {
    setAvailabilityMode(mode);
    toast({
      title: `Availability mode changed to ${mode}`,
      description: mode === 'auto' 
        ? "Your availability will be managed automatically based on your calendar"
        : "You'll manually control your availability status",
    });
  };

  const handleQuickSettings = () => {
    toast({
      title: "Quick Settings",
      description: "Opening availability settings...",
    });
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Available</span>
        <Switch
          checked={isAvailable}
          onCheckedChange={handleToggle}
          className="data-[state=checked]:bg-green-500"
        />
      </div>
      
      <Badge 
        variant={isAvailable ? "default" : "secondary"}
        className={`text-xs ${
          isAvailable 
            ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300' 
            : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/20 dark:text-gray-300'
        }`}
      >
        {isAvailable ? 'Online' : 'Offline'}
      </Badge>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3" align="end">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm mb-2">Availability Mode</h4>
              <div className="space-y-2">
                <div 
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                    availabilityMode === 'auto' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                  }`}
                  onClick={() => handleModeChange('auto')}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Automatic</span>
                  </div>
                  {availabilityMode === 'auto' && <div className="w-2 h-2 bg-primary rounded-full" />}
                </div>
                
                <div 
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                    availabilityMode === 'manual' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                  }`}
                  onClick={() => handleModeChange('manual')}
                >
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Manual</span>
                  </div>
                  {availabilityMode === 'manual' && <div className="w-2 h-2 bg-primary rounded-full" />}
                </div>
              </div>
            </div>
            
            <hr />
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleQuickSettings}
            >
              <Settings className="h-4 w-4 mr-2" />
              More Settings
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AvailabilityToggle;
