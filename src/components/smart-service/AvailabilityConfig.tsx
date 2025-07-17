
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedCalendar } from '@/components/ui/enhanced-calendar';
import { BookingType, AvailabilityBlock } from '@/types/smartService';
import { format } from 'date-fns';

interface AvailabilityConfigProps {
  bookingType: BookingType;
  availabilityBlocks: AvailabilityBlock[];
  onAvailabilityChange: (blocks: AvailabilityBlock[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const AvailabilityConfig: React.FC<AvailabilityConfigProps> = ({
  bookingType,
  availabilityBlocks,
  onAvailabilityChange,
  onNext,
  onBack
}) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri

  const getAvailabilityInstructions = () => {
    switch (bookingType.availabilityType) {
      case 'slot-selection':
        return 'Select specific dates and times when you\'re available for bookings.';
      case 'auto-scheduling':
        return 'Set your general availability hours for automatic scheduling.';
      case 'recurring-calendar':
        return 'Define recurring weekly availability for your program or series.';
      case 'collective-sync':
        return 'Coordinate availability with your team members.';
      case 'custom-mapping':
        return 'Map availability for different services in your bundle.';
      default:
        return 'Configure when you\'re available for this service.';
    }
  };

  const handleAddAvailability = () => {
    const newBlock: AvailabilityBlock = {
      type: bookingType.availabilityType === 'recurring-calendar' ? 'recurring' : 'specific',
      startDate: selectedDates[0] ? format(selectedDates[0], 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      timeSlots: bookingType.availabilityType === 'recurring-calendar' 
        ? selectedDays.map(day => ({
            dayOfWeek: day,
            startTime,
            endTime
          }))
        : [{
            startTime,
            endTime
          }]
    };

    onAvailabilityChange([...availabilityBlocks, newBlock]);
  };

  const renderAvailabilityConfig = () => {
    switch (bookingType.availabilityType) {
      case 'slot-selection':
        return (
          <div className="space-y-4">
            <div>
              <Label>Select Available Dates</Label>
              <div className="mt-2">
                <EnhancedCalendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={(dates) => setSelectedDates(dates || [])}
                  className="border rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 'recurring-calendar':
        return (
          <div className="space-y-4">
            <div>
              <Label>Select Weekly Days</Label>
              <div className="grid grid-cols-7 gap-2 mt-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <Button
                    key={day}
                    variant={selectedDays.includes(index) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (selectedDays.includes(index)) {
                        setSelectedDays(selectedDays.filter(d => d !== index));
                      } else {
                        setSelectedDays([...selectedDays, index]);
                      }
                    }}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 'auto-scheduling':
        return (
          <div className="space-y-4">
            <div>
              <Label>Operating Hours</Label>
              <p className="text-sm text-muted-foreground">
                Set your general availability for automatic scheduling
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Opens At</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endTime">Closes At</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Availability configuration for this booking type will be implemented soon.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Configure Availability</h2>
          <p className="text-muted-foreground">
            {getAvailabilityInstructions()}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {bookingType.icon} Availability for {bookingType.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderAvailabilityConfig()}

          <div className="flex gap-2">
            <Button onClick={handleAddAvailability} variant="outline">
              Add Availability Block
            </Button>
          </div>

          {availabilityBlocks.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Current Availability</h4>
              <div className="space-y-2">
                {availabilityBlocks.map((block, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg text-sm">
                    {block.type === 'recurring' ? 'Weekly: ' : 'Specific: '}
                    {block.timeSlots.map((slot, slotIndex) => (
                      <span key={slotIndex}>
                        {slot.dayOfWeek !== undefined ? 
                          ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][slot.dayOfWeek] + ' ' : ''}
                        {slot.startTime} - {slot.endTime}
                        {slotIndex < block.timeSlots.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button 
            className="w-full" 
            onClick={onNext}
            disabled={availabilityBlocks.length === 0}
          >
            Continue to Preview
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityConfig;
