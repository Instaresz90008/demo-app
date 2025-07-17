
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface WeekendToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const WeekendToggle: React.FC<WeekendToggleProps> = ({ checked, onChange }) => {
  return (
    <div className="mt-4">
      <Label className="flex items-center space-x-2 cursor-pointer">
        <Checkbox 
          checked={checked}
          onCheckedChange={() => onChange(!checked)}
          id="show-weekend"
        />
        <span>Show Weekend</span>
      </Label>
    </div>
  );
};

export default WeekendToggle;
