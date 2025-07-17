
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Zap, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';

interface AvailabilitySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity?: number;
  isAvailable: boolean;
}

interface AvailabilityPreviewProps {
  slots: AvailabilitySlot[];
  mode: 'slot-selection' | 'recurring-calendar' | 'auto-scheduling' | 'collective-sync' | 'custom-mapping';
  bookingType: string;
}

const AvailabilityPreview: React.FC<AvailabilityPreviewProps> = ({
  slots,
  mode,
  bookingType
}) => {
  const groupSlotsByDate = (slots: AvailabilitySlot[]) => {
    return slots.reduce((acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = [];
      }
      acc[slot.date].push(slot);
      return acc;
    }, {} as Record<string, AvailabilitySlot[]>);
  };

  const groupedSlots = groupSlotsByDate(slots);
  const dateEntries = Object.entries(groupedSlots).sort(([a], [b]) => a.localeCompare(b));

  const getModeDisplay = () => {
    switch (mode) {
      case 'slot-selection':
        return 'Fixed Time Slots';
      case 'recurring-calendar':
        return 'Recurring Schedule';
      case 'auto-scheduling':
        return 'Auto Scheduling';
      case 'collective-sync':
        return 'Team Synchronization';
      case 'custom-mapping':
        return 'Custom Mapping';
      default:
        return 'Custom Schedule';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Availability Summary
          </h3>
          <p className="text-sm text-muted-foreground">
            {slots.length} time slot{slots.length !== 1 ? 's' : ''} configured
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">{getModeDisplay()}</Badge>
          <Badge variant="secondary">{bookingType}</Badge>
        </div>
      </div>

      {dateEntries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 mb-4 text-muted-foreground/50" />
            <h4 className="font-medium text-muted-foreground mb-2">No availability set</h4>
            <p className="text-sm text-muted-foreground text-center">
              Configure your time slots using the Calendar or Time Slots tabs
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {dateEntries.slice(0, 10).map(([date, dateSlots], index) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {dateSlots.map((slot) => (
                      <motion.div
                        key={slot.id}
                        whileHover={{ scale: 1.02 }}
                        className={`
                          p-3 rounded-lg border transition-colors
                          ${slot.isAvailable 
                            ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                            : 'bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                          <Badge 
                            variant={slot.isAvailable ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {slot.isAvailable ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                        {slot.capacity && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>Capacity: {slot.capacity}</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {dateEntries.length > 10 && (
            <Card>
              <CardContent className="text-center py-6">
                <p className="text-muted-foreground">
                  +{dateEntries.length - 10} more dates with availability configured
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AvailabilityPreview;
