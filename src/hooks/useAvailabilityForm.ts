
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useAvailabilityForm = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [service, setService] = useState<string | undefined>(undefined);
  const [startTime, setStartTime] = useState<string | undefined>(undefined);
  const [endTime, setEndTime] = useState<string | undefined>(undefined);
  const [showWeekend, setShowWeekend] = useState(false);
  
  const handleReset = () => {
    setDate(undefined);
    setService(undefined);
    setStartTime(undefined);
    setEndTime(undefined);
    setShowWeekend(false);
    
    toast({
      description: "Form has been reset",
    });
  };
  
  const handleSaveSlots = () => {
    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive"
      });
      return;
    }
    
    if (!service) {
      toast({
        title: "Error",
        description: "Please select a service",
        variant: "destructive"
      });
      return;
    }
    
    if (!startTime || !endTime) {
      toast({
        title: "Error",
        description: "Please select both start and end times",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Success!",
      description: "Your slots have been saved successfully.",
    });
  };

  return {
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
  };
};
