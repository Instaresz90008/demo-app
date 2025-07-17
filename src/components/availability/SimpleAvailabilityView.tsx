import React from "react";
import { useAvailabilityForm } from "@/hooks/useAvailabilityForm";
import ApiStatusIndicator from "./ApiStatusIndicator";
import DateSelector from "./DateSelector";
import ServiceSelector from "./ServiceSelector";
import TimeSelector from "./TimeSelector";
import WeekendToggle from "./WeekendToggle";
import ActionButtons from "./ActionButtons";

const SimpleAvailabilityView = () => {
  const {
    date,
    setDate,
    service,
    setService,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    showWeekend,
    setShowWeekend,
    handleReset,
    handleSaveSlots
  } = useAvailabilityForm();
  
  return (
    <div className="bg-card shadow-sm rounded-lg p-6 border border-border">
      <h2 className="text-xl font-bold mb-6">Slot Booking</h2>
      
      <ApiStatusIndicator status="connected" />
      
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <DateSelector 
            date={date} 
            onDateChange={setDate} 
          />
        </div>
        
        <div>
          <ServiceSelector 
            value={service} 
            onChange={setService} 
          />
        </div>
        
        <div>
          <TimeSelector 
            label="Start Time" 
            value={startTime} 
            onChange={setStartTime} 
          />
        </div>
        
        <div>
          <TimeSelector 
            label="End Time" 
            value={endTime} 
            onChange={setEndTime} 
            disabledOptions={startTime ? [startTime] : []}
          />
        </div>
      </div>
      
      <WeekendToggle 
        checked={showWeekend} 
        onChange={setShowWeekend} 
      />
      
      <div className="mt-8 text-center text-gray-400 dark:text-gray-300">
        {!date ? (
          <p>Please select a date to view available slots for the current or next week</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-7">
            {/* Placeholder for slot visualization that would appear after date selection */}
          </div>
        )}
      </div>
      
      <ActionButtons 
        onReset={handleReset} 
        onSave={handleSaveSlots} 
      />
    </div>
  );
};

export default SimpleAvailabilityView;
