
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateServiceDetails, nextStep, previousStep } from '@/store/slices/onboardingSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Plus, Trash2, ArrowRight, ArrowLeft, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { ServiceSlot } from '@/store/slices/onboarding/types';
import { format, addDays, addWeeks, startOfWeek, isBefore, isAfter, setHours, setMinutes } from 'date-fns';

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurrencePattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: string;
  };
}

const SlotCreationStep: React.FC<Props> = ({ onNext, onPrevious }) => {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(state => state.onboarding);
  
  const [slots, setSlots] = useState<TimeSlot[]>(
    data.serviceDetails.slots?.map(slot => ({
      id: slot.id || `slot-${Date.now()}`,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isRecurring: slot.isRecurring || false,
      recurrencePattern: slot.recurrencePattern
    })) || []
  );

  // Smart generation settings
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [numberOfWeeks, setNumberOfWeeks] = useState(2);
  const [slotDuration, setSlotDuration] = useState(data.serviceDetails.duration || 60);

  const daysOfWeek = [
    { id: 0, name: 'Sunday', short: 'Sun' },
    { id: 1, name: 'Monday', short: 'Mon' },
    { id: 2, name: 'Tuesday', short: 'Tue' },
    { id: 3, name: 'Wednesday', short: 'Wed' },
    { id: 4, name: 'Thursday', short: 'Thu' },
    { id: 5, name: 'Friday', short: 'Fri' },
    { id: 6, name: 'Saturday', short: 'Sat' }
  ];

  const toggleDay = (dayId: number) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(id => id !== dayId)
        : [...prev, dayId]
    );
  };

  const generateSmartSlots = () => {
    if (selectedDays.length === 0) {
      toast.error('Please select at least one day of the week');
      return;
    }

    const newSlots: TimeSlot[] = [];
    const today = new Date();
    const currentTime = new Date();

    // Parse start and end times
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    for (let week = 0; week < numberOfWeeks; week++) {
      for (const dayOfWeek of selectedDays) {
        // Calculate the target date
        const weekStart = addWeeks(startOfWeek(today), week);
        const targetDate = addDays(weekStart, dayOfWeek);

        // Skip dates that are in the past
        if (isBefore(targetDate, today)) {
          continue;
        }

        // If it's today, check if the start time hasn't passed
        if (format(targetDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
          const startDateTime = setMinutes(setHours(targetDate, startHour), startMinute);
          if (isBefore(startDateTime, currentTime)) {
            continue; // Skip this slot as the time has already passed
          }
        }

        // Generate time slots for this day
        let currentSlotStart = setMinutes(setHours(targetDate, startHour), startMinute);
        const dayEnd = setMinutes(setHours(targetDate, endHour), endMinute);

        while (isBefore(currentSlotStart, dayEnd)) {
          const slotEnd = addMinutes(currentSlotStart, slotDuration);
          
          if (isAfter(slotEnd, dayEnd)) {
            break; // Don't create slots that extend beyond the end time
          }

          newSlots.push({
            id: `slot-${Date.now()}-${newSlots.length}`,
            date: format(targetDate, 'yyyy-MM-dd'),
            startTime: format(currentSlotStart, 'HH:mm'),
            endTime: format(slotEnd, 'HH:mm'),
            isRecurring: false
          });

          currentSlotStart = slotEnd;
        }
      }
    }

    if (newSlots.length === 0) {
      toast.error('No available slots could be generated for the selected criteria');
      return;
    }

    setSlots(prev => [...prev, ...newSlots]);
    toast.success(`Generated ${newSlots.length} time slots!`);
  };

  // Helper function to add minutes to a date
  const addMinutes = (date: Date, minutes: number) => {
    return new Date(date.getTime() + minutes * 60000);
  };

  const addManualSlot = () => {
    const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}`,
      date: tomorrow,
      startTime: '09:00',
      endTime: '10:00',
      isRecurring: false
    };
    setSlots(prev => [...prev, newSlot]);
  };

  const updateSlot = (id: string, field: keyof TimeSlot, value: any) => {
    setSlots(prev => prev.map(slot => 
      slot.id === id ? { ...slot, [field]: value } : slot
    ));
  };

  const removeSlot = (id: string) => {
    setSlots(prev => prev.filter(slot => slot.id !== id));
  };

  const handleSubmit = () => {
    if (slots.length === 0) {
      toast.error('Please add at least one time slot');
      return;
    }

    // Validate slots
    for (const slot of slots) {
      if (!slot.date || !slot.startTime || !slot.endTime) {
        toast.error('All slots must have a date, start time, and end time');
        return;
      }
      
      if (slot.startTime >= slot.endTime) {
        toast.error('Start time must be before end time for all slots');
        return;
      }
    }

    // Convert to ServiceSlot format and update Redux
    const serviceSlots: ServiceSlot[] = slots.map(slot => ({
      id: slot.id,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isRecurring: slot.isRecurring,
      recurrencePattern: slot.recurrencePattern
    }));

    dispatch(updateServiceDetails({
      ...data.serviceDetails,
      slots: serviceSlots
    }));

    toast.success('Time slots saved successfully!');
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-4">Set Your Availability</h1>
        <p className="text-muted-foreground text-lg">
          Create time slots when clients can book your service
        </p>
      </motion.div>

      {/* Smart Slot Generator */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Smart Slot Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Select Days of the Week
            </Label>
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day) => (
                <div key={day.id} className="text-center">
                  <Checkbox
                    id={`day-${day.id}`}
                    checked={selectedDays.includes(day.id)}
                    onCheckedChange={() => toggleDay(day.id)}
                    className="mb-2"
                  />
                  <Label
                    htmlFor={`day-${day.id}`}
                    className={`text-xs font-medium cursor-pointer block p-2 rounded-md transition-colors ${
                      selectedDays.includes(day.id)
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {day.short}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="startTime" className="text-sm font-medium">
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="endTime" className="text-sm font-medium">
                End Time
              </Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="weeks" className="text-sm font-medium">
                Number of Weeks
              </Label>
              <Input
                id="weeks"
                type="number"
                min="1"
                max="12"
                value={numberOfWeeks}
                onChange={(e) => setNumberOfWeeks(parseInt(e.target.value) || 1)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="slotDuration" className="text-sm font-medium">
              Slot Duration (minutes)
            </Label>
            <Input
              id="slotDuration"
              type="number"
              min="15"
              max="480"
              value={slotDuration}
              onChange={(e) => setSlotDuration(parseInt(e.target.value) || 60)}
              className="mt-1 max-w-xs"
            />
          </div>

          <Button onClick={generateSmartSlots} className="w-full" size="lg">
            <Zap className="w-4 h-4 mr-2" />
            Generate Smart Slots
          </Button>
        </CardContent>
      </Card>

      {/* Manual Slot Creation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Time Slots ({slots.length})
            </div>
            <Button onClick={addManualSlot} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Slot
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {slots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No time slots created yet</p>
              <p className="text-sm">Use the smart generator above or add slots manually</p>
            </div>
          ) : (
            <div className="space-y-4">
              {slots.map((slot) => (
                <div key={slot.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Date</Label>
                      <Input
                        type="date"
                        value={slot.date}
                        onChange={(e) => updateSlot(slot.id, 'date', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Start Time</Label>
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateSlot(slot.id, 'startTime', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">End Time</Label>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateSlot(slot.id, 'endTime', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => removeSlot(slot.id)}
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {slots.length > 0 && (
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <h4 className="font-semibold mb-2">Availability Summary</h4>
              <div className="flex justify-center gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Slots:</span>
                  <Badge variant="secondary" className="ml-2">{slots.length}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <Badge variant="secondary" className="ml-2">{slotDuration} min</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={slots.length === 0}>
          Continue to Preview
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default SlotCreationStep;
