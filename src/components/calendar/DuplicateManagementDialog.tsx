
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, Users, AlertTriangle, Trash2, RefreshCw, Plus } from "lucide-react";
import { format, parseISO, addMinutes } from "date-fns";

interface SlotData {
  id: string;
  title: string;
  start: string;
  end: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  attendeeName?: string;
  attendeeEmail?: string;
  serviceName?: string;
  type: 'booking' | 'slot';
  slotDuration: number;
}

interface DuplicateGroup {
  timeSlot: string;
  slots: SlotData[];
}

interface DuplicateManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  duplicateGroups: DuplicateGroup[];
  onResolve: (action: 'delete-extras' | 'reschedule-smart' | 'merge-slots', groupIndex?: number) => void;
}

const DuplicateManagementDialog: React.FC<DuplicateManagementDialogProps> = ({
  open,
  onOpenChange,
  duplicateGroups,
  onResolve
}) => {
  const [selectedAction, setSelectedAction] = useState<'delete-extras' | 'reschedule-smart' | 'merge-slots'>('delete-extras');
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  const handleResolve = () => {
    onResolve(selectedAction, selectedGroup || undefined);
    onOpenChange(false);
  };

  const totalDuplicates = duplicateGroups.reduce((sum, group) => sum + group.slots.length, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            Duplicate Slot Management
          </DialogTitle>
          <DialogDescription>
            Found {duplicateGroups.length} time slots with duplicates ({totalDuplicates} total slots affected).
            Choose how to resolve these conflicts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Duplicate Groups Overview */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Affected Time Slots</h3>
            <div className="grid gap-3 max-h-64 overflow-y-auto">
              {duplicateGroups.map((group, index) => (
                <Card key={index} className="border-orange-200 bg-orange-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {group.timeSlot}
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        {group.slots.length} duplicates
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {group.slots.map((slot) => (
                        <div key={slot.id} className="flex items-center justify-between text-xs bg-white p-2 rounded border">
                          <div>
                            <span className="font-medium">{slot.serviceName}</span>
                            {slot.attendeeName && (
                              <div className="flex items-center gap-1 text-muted-foreground mt-1">
                                <Users className="h-3 w-3" />
                                {slot.attendeeName}
                              </div>
                            )}
                          </div>
                          <Badge variant={slot.status === 'scheduled' ? 'default' : 'secondary'} className="text-xs">
                            {slot.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Resolution Options */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Resolution Options</h3>
            <RadioGroup value={selectedAction} onValueChange={(value) => setSelectedAction(value as any)}>
              <div className="space-y-4">
                {/* Option 1: Delete Extras */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="delete-extras" id="delete-extras" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="delete-extras" className="font-medium flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-red-500" />
                      Delete Extra Slots (Keep First One)
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Keep the first slot in each time period and delete the rest. This preserves the earliest booking and removes conflicts.
                    </p>
                    <div className="mt-2 text-xs text-orange-600">
                      ⚠️ This will permanently delete {totalDuplicates - duplicateGroups.length} slots
                    </div>
                  </div>
                </div>

                {/* Option 2: Smart Reschedule */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="reschedule-smart" id="reschedule-smart" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="reschedule-smart" className="font-medium flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-blue-500" />
                      Smart Reschedule Duplicates
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Automatically reschedule duplicate slots to the next available time slots. Maintains all bookings by finding new times.
                    </p>
                    <div className="mt-2 text-xs text-blue-600">
                      ℹ️ Will suggest new times within the same day, +15min intervals
                    </div>
                  </div>
                </div>

                {/* Option 3: Merge Compatible Slots */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="merge-slots" id="merge-slots" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="merge-slots" className="font-medium flex items-center gap-2">
                      <Plus className="h-4 w-4 text-green-500" />
                      Merge Compatible Slots
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Combine open slots into single slots and keep booked appointments separate. Only merges empty/available slots.
                    </p>
                    <div className="mt-2 text-xs text-green-600">
                      ✓ Safe option - only affects unbooked slots
                    </div>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleResolve} className="bg-orange-600 hover:bg-orange-700">
            Resolve Duplicates
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateManagementDialog;
