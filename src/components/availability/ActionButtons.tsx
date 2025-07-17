
import React from "react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onReset: () => void;
  onSave: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onReset, onSave }) => {
  return (
    <div className="mt-8 flex justify-between">
      <Button variant="outline" onClick={onReset}>
        Reset Form
      </Button>
      
      <Button onClick={onSave}>
        SAVE SLOTS
      </Button>
    </div>
  );
};

export default ActionButtons;
