
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Plus, Trash2 } from 'lucide-react';

interface AvailabilitySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity?: number;
  isAvailable: boolean;
}

interface TimeSlotManagerProps {
  slots: AvailabilitySlot[];
  onSlotAdd: (slot: Omit<AvailabilitySlot, 'id'>) => void;
  onSlotRemove: (slotId: string) => void;
  maxCapacity: number;
}

const TimeSlotManager: React.FC<TimeSlotManagerProps> = ({
  slots,
  onSlotAdd,
  onSlotRemove,
  maxCapacity
}) => {
  const [newSlot, setNewSlot] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00'
  });

  const handleAddSlot = () => {
    onSlotAdd({
      date: newSlot.date,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      capacity: maxCapacity,
      isAvailable: true
    });
  };

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Time Slot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                value={newSlot.date}
                onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Start Time</label>
              <input
                type="time"
                value={newSlot.startTime}
                onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Time</label>
              <input
                type="time"
                value={newSlot.endTime}
                onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
          </div>
          <Button onClick={handleAddSlot} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Time Slot
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Configured Time Slots ({slots.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedSlots).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No time slots configured yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {Object.entries(groupedSlots).map(([date, dateSlots]) => (
                  <motion.div
                    key={date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border rounded-lg p-4"
                  >
                    <h4 className="font-medium mb-3">{new Date(date).toLocaleDateString()}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {dateSlots.map((slot) => (
                        <motion.div
                          key={slot.id}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium">
                                {slot.startTime} - {slot.endTime}
                              </p>
                              {slot.capacity && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  Up to {slot.capacity} people
                                </p>
                              )}
                            </div>
                            <Badge variant={slot.isAvailable ? "default" : "secondary"}>
                              {slot.isAvailable ? "Available" : "Unavailable"}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onSlotRemove(slot.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeSlotManager;
