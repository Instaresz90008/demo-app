
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Filter, CheckCircle, Circle, X, AlertTriangle, RotateCcw } from "lucide-react";

interface SlotStatusFilterProps {
  selectedStatuses: string[];
  onStatusChange: (statuses: string[]) => void;
}

const STATUS_OPTIONS = [
  { value: "booked", label: "Booked", icon: CheckCircle, color: "text-green-600" },
  { value: "open", label: "Open", icon: Circle, color: "text-blue-600" },
  { value: "cancelled", label: "Cancelled", icon: X, color: "text-red-600" },
  { value: "no-show", label: "No-show", icon: AlertTriangle, color: "text-orange-600" },
  { value: "completed", label: "Completed", icon: CheckCircle, color: "text-green-700" }
];

const SlotStatusFilter: React.FC<SlotStatusFilterProps> = ({ 
  selectedStatuses, 
  onStatusChange 
}) => {
  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter(s => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  const clearAll = () => {
    onStatusChange([]);
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Status
            {selectedStatuses.length > 0 && (
              <span className="ml-1 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {selectedStatuses.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          {STATUS_OPTIONS.map((option) => {
            const IconComponent = option.icon;
            return (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedStatuses.includes(option.value)}
                onCheckedChange={() => toggleStatus(option.value)}
                className="flex items-center gap-2"
              >
                <IconComponent className={`h-4 w-4 ${option.color}`} />
                {option.label}
              </DropdownMenuCheckboxItem>
            );
          })}
          {selectedStatuses.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={clearAll} className="text-muted-foreground">
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear All
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Clear Selection Button - Always visible when filters are applied */}
      {selectedStatuses.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Clear Selection
        </Button>
      )}
    </div>
  );
};

export default SlotStatusFilter;
