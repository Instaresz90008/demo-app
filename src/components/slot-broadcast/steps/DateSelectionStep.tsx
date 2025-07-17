import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EnhancedCalendar } from "@/components/ui/enhanced-calendar";
import { CheckCircle2, Calendar as CalendarIcon, Clock, Repeat, Users, Coffee, Briefcase, Sun, Moon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { SlotBroadcastFormValues } from "../SlotBroadcastWorkflow";
import { addDays, addWeeks, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, format } from "date-fns";

interface Props {
  values: SlotBroadcastFormValues;
  onChange: (fields: Partial<SlotBroadcastFormValues>) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const dateTemplates = [
  {
    id: "alternate",
    label: "Alternate Days",
    icon: Repeat,
    description: "Every other day for 2 weeks",
    getDates: () => {
      const dates = [];
      const today = new Date();
      for (let i = 0; i < 14; i += 2) {
        dates.push(addDays(today, i));
      }
      return dates;
    }
  },
  {
    id: "weekdays",
    label: "All Weekdays",
    icon: Briefcase,
    description: "Monday to Friday for 2 weeks",
    getDates: () => {
      const dates = [];
      const today = new Date();
      for (let i = 0; i < 14; i++) {
        const date = addDays(today, i);
        const day = date.getDay();
        if (day >= 1 && day <= 5) {
          dates.push(date);
        }
      }
      return dates;
    }
  },
  {
    id: "weekends",
    label: "Weekends",
    icon: Sun,
    description: "Saturday & Sunday for 4 weeks",
    getDates: () => {
      const dates = [];
      const today = new Date();
      for (let i = 0; i < 28; i++) {
        const date = addDays(today, i);
        const day = date.getDay();
        if (day === 0 || day === 6) {
          dates.push(date);
        }
      }
      return dates;
    }
  },
  {
    id: "mon-wed-fri",
    label: "Mon, Wed, Fri",
    icon: CalendarIcon,
    description: "Three times a week for 3 weeks",
    getDates: () => {
      const dates = [];
      const today = new Date();
      for (let i = 0; i < 21; i++) {
        const date = addDays(today, i);
        const day = date.getDay();
        if (day === 1 || day === 3 || day === 5) {
          dates.push(date);
        }
      }
      return dates;
    }
  },
  {
    id: "tue-thu",
    label: "Tue & Thu",
    icon: Users,
    description: "Twice a week for 4 weeks",
    getDates: () => {
      const dates = [];
      const today = new Date();
      for (let i = 0; i < 28; i++) {
        const date = addDays(today, i);
        const day = date.getDay();
        if (day === 2 || day === 4) {
          dates.push(date);
        }
      }
      return dates;
    }
  }
];

const timeTemplates = [
  {
    id: "morning",
    label: "Morning",
    icon: Coffee,
    times: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"]
  },
  {
    id: "afternoon", 
    label: "Afternoon",
    icon: Sun,
    times: ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30"]
  },
  {
    id: "evening",
    label: "Evening", 
    icon: Moon,
    times: ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30"]
  },
  {
    id: "business",
    label: "Business Hours",
    icon: Briefcase,
    times: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
  }
];

const individualTimeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30"
];

const DateSelectionStep: React.FC<Props> = ({ values, onChange, onPrevious, onNext }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (values.selectedDates.length === 0) {
      newErrors.selectedDates = "Please select at least one date";
    }
    
    if (values.timeSlots.length === 0) {
      newErrors.timeSlots = "Please select at least one time slot";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const applyDateTemplate = (templateId: string) => {
    const template = dateTemplates.find(t => t.id === templateId);
    if (template) {
      const dates = template.getDates();
      onChange({ 
        selectedDates: dates,
        dateTemplate: templateId
      });
      if (errors.selectedDates) {
        setErrors(prev => ({ ...prev, selectedDates: "" }));
      }
    }
  };

  const applyTimeTemplate = (templateId: string) => {
    const template = timeTemplates.find(t => t.id === templateId);
    if (template) {
      onChange({ timeSlots: template.times });
      if (errors.timeSlots) {
        setErrors(prev => ({ ...prev, timeSlots: "" }));
      }
    }
  };

  const toggleTimeSlot = (time: string) => {
    const updatedSlots = values.timeSlots.includes(time)
      ? values.timeSlots.filter(t => t !== time)
      : [...values.timeSlots, time];
    
    onChange({ timeSlots: updatedSlots });
    if (errors.timeSlots && updatedSlots.length > 0) {
      setErrors(prev => ({ ...prev, timeSlots: "" }));
    }
  };

  const totalSlots = values.selectedDates.length * values.timeSlots.length;

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
            <CalendarIcon className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Select Dates & Times</h1>
            <p className="text-muted-foreground">Choose your availability with smart templates</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column - Date Selection */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Date Templates
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dateTemplates.map((template) => {
                const isSelected = values.dateTemplate === template.id;
                const TemplateIcon = template.icon;
                
                return (
                  <Card
                    key={template.id}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:scale-[1.02] border-2",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => applyDateTemplate(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}>
                          <TemplateIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{template.label}</h3>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                          </div>
                          <p className="text-xs text-muted-foreground">{template.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Manual Date Selection</h3>
            <Card className="border-2 border-border">
              <CardContent className="p-6">
                <EnhancedCalendar
                  mode="multiple"
                  selected={values.selectedDates}
                  onSelect={(dates) => {
                    onChange({ selectedDates: dates || [], dateTemplate: "" });
                    if (errors.selectedDates && dates && dates.length > 0) {
                      setErrors(prev => ({ ...prev, selectedDates: "" }));
                    }
                  }}
                  className="w-full"
                  disabled={(date) => date < new Date()}
                />
              </CardContent>
            </Card>
            {errors.selectedDates && (
              <p className="text-destructive text-sm mt-2">{errors.selectedDates}</p>
            )}
          </div>
        </div>

        {/* Right Column - Time Selection */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Time Templates
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {timeTemplates.map((template) => {
                const TemplateIcon = template.icon;
                const isSelected = values.timeSlots.every(slot => template.times.includes(slot)) && 
                                 template.times.every(time => values.timeSlots.includes(time));
                
                return (
                  <Card
                    key={template.id}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:scale-[1.02] border-2",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => applyTimeTemplate(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}>
                          <TemplateIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{template.label}</h3>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                          </div>
                          <p className="text-xs text-muted-foreground">{template.times.length} slots</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Individual Time Slots</h3>
            <Card className="border-2 border-border">
              <CardContent className="p-6">
                <div className="grid grid-cols-4 gap-2 max-h-80 overflow-y-auto">
                  {individualTimeSlots.map((time) => {
                    const isSelected = values.timeSlots.includes(time);
                    
                    return (
                      <button
                        key={time}
                        onClick={() => toggleTimeSlot(time)}
                        className={cn(
                          "p-3 rounded-lg text-sm font-medium transition-all duration-200 border-2",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                            : "bg-background border-border hover:border-primary/50 hover:bg-accent"
                        )}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            {errors.timeSlots && (
              <p className="text-destructive text-sm mt-2">{errors.timeSlots}</p>
            )}
          </div>

          {/* Summary */}
          {totalSlots > 0 && (
            <Card className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                    {totalSlots} Total Slots
                  </h3>
                </div>
                <div className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <p>{values.selectedDates.length} dates × {values.timeSlots.length} time slots</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {values.selectedDates.slice(0, 3).map((date) => (
                      <Badge key={date.toISOString()} variant="secondary" className="text-xs">
                        {format(date, "MMM dd")}
                      </Badge>
                    ))}
                    {values.selectedDates.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{values.selectedDates.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between pt-8 border-t border-border">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="px-8 py-3 h-auto font-medium hover:scale-[1.02] transition-all duration-200"
        >
          ← Previous Step
        </Button>
        <Button
          onClick={handleNext}
          disabled={totalSlots === 0}
          className={cn(
            "px-8 py-3 h-auto font-semibold text-base rounded-xl transition-all duration-300",
            totalSlots > 0
              ? "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02]"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          Next: Configuration →
        </Button>
      </div>
    </div>
  );
};

export default DateSelectionStep;