
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Plus } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';

interface AvailabilitySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity?: number;
  isAvailable: boolean;
}

interface CalendarViewProps {
  mode: 'slot-selection' | 'recurring-calendar' | 'auto-scheduling' | 'collective-sync' | 'custom-mapping';
  selectedSlots: AvailabilitySlot[];
  onSlotAdd: (slot: Omit<AvailabilitySlot, 'id'>) => void;
  onSlotRemove: (slotId: string) => void;
  maxCapacity: number;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  mode,
  selectedSlots,
  onSlotAdd,
  onSlotRemove,
  maxCapacity
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  const handleAddSlot = () => {
    onSlotAdd({
      date: selectedDate,
      startTime,
      endTime,
      capacity: maxCapacity,
      isAvailable: true
    });
  };

  const getWeekDays = () => {
    const start = startOfWeek(new Date());
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getSlotsForDate = (date: string) => {
    return selectedSlots.filter(slot => slot.date === date);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-2 font-medium text-center text-muted-foreground">
            {day}
          </div>
        ))}
        {getWeekDays().map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const slots = getSlotsForDate(dateStr);
          const isSelected = selectedDate === dateStr;
          
          return (
            <motion.div
              key={dateStr}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                p-3 border rounded-lg cursor-pointer transition-colors
                ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                ${slots.length > 0 ? 'ring-2 ring-primary/20' : ''}
              `}
              onClick={() => setSelectedDate(dateStr)}
            >
              <div className="text-center">
                <div className="font-medium">{format(date, 'd')}</div>
                {slots.length > 0 && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    {slots.length}
                  </Badge>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Add Time Slot for {format(new Date(selectedDate), 'MMM d')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
          </div>
          
          <Button onClick={handleAddSlot} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Time Slot
          </Button>

          {getSlotsForDate(selectedDate).length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Existing Slots</h4>
              <div className="space-y-2">
                {getSlotsForDate(selectedDate).map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <span className="text-sm">
                      {slot.startTime} - {slot.endTime}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSlotRemove(slot.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
