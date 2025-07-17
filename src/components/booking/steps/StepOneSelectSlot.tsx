
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, Video, Phone, MapPin, Check } from 'lucide-react';
import { format } from 'date-fns';
import { EnhancedCalendar } from '@/components/ui/enhanced-calendar';

interface StepOneSelectSlotProps {
  selectedDate: string | null;
  selectedTime: string | null;
  selectedMeetingType: 'video' | 'phone' | 'in-person';
  availableDates: Array<{ date: string; label: string }>;
  availableTimes: string[];
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  onMeetingTypeSelect: (type: 'video' | 'phone' | 'in-person') => void;
  onNext: () => void;
  isValid: boolean;
  slot: {
    serviceName: string;
    duration: number;
  };
}

const StepOneSelectSlot: React.FC<StepOneSelectSlotProps> = ({
  selectedDate,
  selectedTime,
  selectedMeetingType,
  availableDates,
  availableTimes,
  onDateSelect,
  onTimeSelect,
  onMeetingTypeSelect,
  onNext,
  isValid,
  slot
}) => {
  const handleCalendarDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateSelect(format(date, 'yyyy-MM-dd'));
    }
  };

  const meetingTypes = [
    { type: 'video' as const, icon: Video, label: 'Video Call' },
    { type: 'phone' as const, icon: Phone, label: 'Audio Call' },
    { type: 'in-person' as const, icon: MapPin, label: 'In-Person' }
  ];

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-6xl mx-auto h-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        <div className="lg:col-span-2 space-y-4">
          {/* Meeting Type Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Video className="h-4 w-4 text-primary" />
                Meeting Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {meetingTypes.map(({ type, icon: Icon, label }) => (
                  <motion.div
                    key={type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className={`w-full h-auto p-3 flex flex-col items-center gap-2 relative ${
                        selectedMeetingType === type
                          ? 'border-green-500 bg-green-50'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => onMeetingTypeSelect(type)}
                      aria-label={`Select ${label} meeting type`}
                    >
                      {selectedMeetingType === type && (
                        <div className="absolute top-2 right-2">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        </div>
                      )}
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{label}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4 text-primary" />
                Select a date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <EnhancedCalendar
                  mode="single"
                  selected={selectedDate ? new Date(selectedDate) : undefined}
                  onSelect={handleCalendarDateSelect}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  className="rounded-md border"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                {selectedDate ? format(new Date(selectedDate), 'EEEE, MMM d') : 'Available Times'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableTimes.slice(0, 9).map((time) => (
                  <motion.div
                    key={time}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      className={`w-full ${
                        selectedTime === time 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-primary/5'
                      }`}
                      onClick={() => onTimeSelect(time)}
                      aria-label={`Select ${time} time slot`}
                    >
                      {time}
                    </Button>
                  </motion.div>
                ))}
                {availableTimes.length > 9 && (
                  <Button variant="ghost" size="sm" className="w-full">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Show {availableTimes.length - 9} more slots
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {selectedDate && selectedTime && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <span className="font-bold text-primary text-sm">JusBook</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Booking Summary</h3>
                      <p className="text-xs text-muted-foreground">AI optimized time slot</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">{selectedDate && format(new Date(selectedDate), 'MMM d, yyyy')}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">{selectedTime} • {slot.duration} min</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service:</span>
                      <span className="font-medium text-xs">{slot.serviceName}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-4 gap-2"
                    size="sm"
                    onClick={onNext}
                    disabled={!isValid}
                    aria-label="Continue to next step"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StepOneSelectSlot;
