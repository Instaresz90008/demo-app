
import React from "react";
import { Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Time slots from the original component
const timeSlots = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
  "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"
];

interface TimeSelectorProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  disabledOptions?: string[];
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ 
  label, 
  value, 
  onChange, 
  disabledOptions = [] 
}) => {
  return (
    <div className="relative">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {timeSlots.map((time) => (
            <SelectItem 
              key={time} 
              value={time}
              disabled={disabledOptions.includes(time)}
            >
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Clock className="absolute -mt-[38px] left-3 h-4 w-4 text-gray-400" />
    </div>
  );
};

export default TimeSelector;
