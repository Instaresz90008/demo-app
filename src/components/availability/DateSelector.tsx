
import React from "react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EnhancedCalendar } from "@/components/ui/enhanced-calendar";

interface DateSelectorProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ date, onDateChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full flex justify-between">
          {date ? format(date, "MMM dd, yyyy") : "Select date"}
          <Calendar className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <EnhancedCalendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateSelector;
