
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreateServiceFormValues } from "../CreateServiceWorkflow";
import { Info, Clock, CalendarCheck, Sparkles } from "lucide-react";
import QuestionManager from "./QuestionManager";
import { ServiceQuestion } from "../types/meetingTypes";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface Props {
  values: CreateServiceFormValues;
  onChange: (fields: Partial<CreateServiceFormValues>) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const AdditionalSettingsStep: React.FC<Props> = ({
  values,
  onChange,
  onPrevious,
  onNext,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { bufferTime, maxAdvanceBooking } = values.additionalSettings;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (bufferTime && (parseInt(bufferTime) < 0 || parseInt(bufferTime) > 120)) {
      newErrors.bufferTime = "Buffer time must be between 0 and 120 minutes";
    }
    
    if (maxAdvanceBooking && (parseInt(maxAdvanceBooking) < 1 || parseInt(maxAdvanceBooking) > 365)) {
      newErrors.maxAdvanceBooking = "Max advance booking must be between 1 and 365 days";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleBufferTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange({ 
      additionalSettings: { 
        ...values.additionalSettings, 
        bufferTime: value 
      } 
    });
    if (errors.bufferTime) {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 120) {
        setErrors(prev => ({ ...prev, bufferTime: "" }));
      }
    }
  };

  const handleMaxAdvanceBookingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange({ 
      additionalSettings: { 
        ...values.additionalSettings, 
        maxAdvanceBooking: value 
      } 
    });
    if (errors.maxAdvanceBooking) {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 1 && numValue <= 365) {
        setErrors(prev => ({ ...prev, maxAdvanceBooking: "" }));
      }
    }
  };

  const isFormValid = (!bufferTime || (parseInt(bufferTime) >= 0 && parseInt(bufferTime) <= 120)) &&
                     (!maxAdvanceBooking || (parseInt(maxAdvanceBooking) >= 1 && parseInt(maxAdvanceBooking) <= 365));

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8 flex items-center gap-3">
        <Sparkles className="w-7 h-7 text-primary" />
        <h1 className="text-3xl font-semibold text-foreground mb-0">Additional Settings</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-block ml-1">
                <Info className="w-5 h-5 text-muted-foreground" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <span>
                Set buffer time between bookings and limit how far in advance clients can book.
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="text-muted-foreground mb-8">Configure advanced booking options for your service.</p>

      <div className="space-y-8">
        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Buffer Time */}
          <div className="space-y-4 p-6 bg-card rounded-xl border border-border shadow animate-fade-in">
            <div className="flex items-center space-x-3 mb-2">
              <Clock className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-foreground mb-0">Buffer Time</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>
                      Time (in minutes) between consecutive bookings to allow for preparation, travel, or breaks.
                    </span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Add time between meetings for a smoother schedule.
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Minutes
              </label>
              <Input
                type="number"
                value={bufferTime}
                onChange={handleBufferTimeChange}
                placeholder="15"
                min="0"
                max="120"
                className={cn(
                  "h-12 text-base bg-background text-foreground",
                  errors.bufferTime ? "border-destructive focus:border-destructive" : ""
                )}
              />
              {errors.bufferTime && (
                <p className="text-sm text-destructive animate-fade-in">{errors.bufferTime}</p>
              )}
              <p className="text-xs text-muted-foreground">0-120 minutes allowed</p>
            </div>
          </div>

          {/* Max Advance Booking */}
          <div className="space-y-4 p-6 bg-card rounded-xl border border-border shadow animate-fade-in">
            <div className="flex items-center space-x-3 mb-2">
              <CalendarCheck className="w-6 h-6 text-green-500 dark:text-green-400" />
              <h3 className="text-lg font-semibold text-foreground mb-0">Advance Booking</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>
                      Set the max number of days before a session when new bookings are allowed.
                    </span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              How far in advance can clients book appointments?
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Days
              </label>
              <Input
                type="number"
                value={maxAdvanceBooking}
                onChange={handleMaxAdvanceBookingChange}
                placeholder="30"
                min="1"
                max="365"
                className={cn(
                  "h-12 text-base bg-background text-foreground",
                  errors.maxAdvanceBooking ? "border-destructive focus:border-destructive" : ""
                )}
              />
              {errors.maxAdvanceBooking && (
                <p className="text-sm text-destructive animate-fade-in">{errors.maxAdvanceBooking}</p>
              )}
              <p className="text-xs text-muted-foreground">1-365 days allowed</p>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="p-6 bg-primary/5 rounded-xl border border-primary/20 shadow-md animate-fade-in flex items-start gap-4">
          <Sparkles className="w-7 h-7 text-primary shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Settings Preview</h3>
            <div className="space-y-2 text-base">
              <p className="text-foreground flex items-center gap-2">
                <Clock className="inline w-4 h-4 text-primary" />
                <span>
                  <span className="font-medium">Buffer time:</span> {bufferTime || '15'} minutes between bookings
                </span>
              </p>
              <p className="text-foreground flex items-center gap-2">
                <CalendarCheck className="inline w-4 h-4 text-green-500 dark:text-green-400" />
                <span>
                  <span className="font-medium">Advance booking:</span> Up to {maxAdvanceBooking || '30'} days in advance
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Question Management Section */}
        <div className="mt-12">
          <QuestionManager
            questions={values.additionalSettings?.questions || []}
            onChange={(questions) => onChange({
              additionalSettings: {
                ...values.additionalSettings,
                questions
              }
            })}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-12 pt-8 border-t border-border">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="px-8 py-3 h-auto font-medium hover:scale-[1.02] transition-all duration-200"
        >
          ← Previous Step
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isFormValid}
          className={cn(
            "px-8 py-3 h-auto font-medium transition-all duration-200",
            isFormValid
              ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02]"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          Next Step →
        </Button>
      </div>
    </div>
  );
};

export default AdditionalSettingsStep;
