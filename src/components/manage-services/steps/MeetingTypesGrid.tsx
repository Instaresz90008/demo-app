import React from 'react';
import { Button } from '@/components/ui/button';
import { Video, Phone, MapPin, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MeetingTypeConfig } from '../types/meetingTypes';

interface Props {
  meetingTypes: MeetingTypeConfig[];
  onToggleMeetingType: (typeId: string) => void;
  onConfigureType: (typeId: string) => void;
}

const meetingTypeOptions = [
  { 
    id: "video", 
    label: "Video Meeting", 
    icon: Video, 
    description: "High-quality video conferencing",
    color: "blue"
  },
  { 
    id: "phone", 
    label: "Audio Call", 
    icon: Phone, 
    description: "Crystal clear voice communication",
    color: "emerald"
  },
  { 
    id: "in-person", 
    label: "In-Person Meeting", 
    icon: MapPin, 
    description: "Face-to-face interaction",
    color: "purple"
  },
];

const MeetingTypesGrid: React.FC<Props> = ({
  meetingTypes,
  onToggleMeetingType,
  onConfigureType
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {meetingTypeOptions.map(option => {
        const MeetingIcon = option.icon;
        const typeConfig = meetingTypes.find(t => t.id === option.id);
        const isEnabled = !!typeConfig?.enabled;

        return (
          <div
            key={option.id}
            className={cn(
              "group relative transition-all hover:scale-105 duration-300 border rounded-2xl p-6 shadow-lg",
              isEnabled
                ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-500"
                : "border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
            )}
          >
            <div className="flex flex-col items-center gap-4">
              <div 
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-2 cursor-pointer",
                  isEnabled
                    ? "bg-gradient-to-br from-blue-500 to-blue-700 shadow-md"
                    : "bg-gray-100 dark:bg-gray-700"
                )}
                onClick={() => onToggleMeetingType(option.id)}
              >
                <MeetingIcon className={cn("w-7 h-7", isEnabled ? "text-white" : "text-blue-600 dark:text-blue-400")} />
              </div>
              
              <div className="text-center">
                <div className={cn(
                  "font-bold text-lg mb-1",
                  isEnabled ? "text-blue-900 dark:text-blue-100" : "text-gray-800 dark:text-gray-200"
                )}>
                  {option.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">{option.description}</div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={isEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => onToggleMeetingType(option.id)}
                  className={cn(
                    isEnabled ? "bg-blue-600 hover:bg-blue-700" : ""
                  )}
                >
                  {isEnabled ? "Enabled" : "Enable"}
                </Button>
                
                {isEnabled && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onConfigureType(option.id)}
                    className="border-blue-300 hover:bg-blue-50 dark:border-blue-600 dark:hover:bg-blue-950/30"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Configure
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MeetingTypesGrid;
