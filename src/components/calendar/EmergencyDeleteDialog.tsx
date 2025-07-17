
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Clock, Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO, differenceInHours } from "date-fns";

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

interface EmergencyDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSlots: SlotData[];
  onConfirm: (reason: string) => void;
}

const EmergencyDeleteDialog: React.FC<EmergencyDeleteDialogProps> = ({
  open,
  onOpenChange,
  selectedSlots,
  onConfirm
}) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason('');
    }
  };

  const urgentSlots = selectedSlots.filter(slot => {
    if (slot.status === 'scheduled' && slot.attendeeName) {
      const hoursUntilAppointment = differenceInHours(parseISO(slot.start), new Date());
      return hoursUntilAppointment < 24;
    }
    return false;
  });

  const bookedSlots = selectedSlots.filter(slot => slot.attendeeName);
  const openSlots = selectedSlots.filter(slot => !slot.attendeeName);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Emergency Slot Deletion
          </DialogTitle>
          <DialogDescription>
            You are about to delete {selectedSlots.length} slot(s). This action cannot be undone.
            {urgentSlots.length > 0 && (
              <span className="text-red-600 font-medium">
                {" "}⚠️ {urgentSlots.length} slot(s) are within 24 hours and will require immediate client notification.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Slot Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Booked Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{bookedSlots.length}</div>
                <p className="text-xs text-muted-foreground">
                  Clients will be notified immediately
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Open Slots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{openSlots.length}</div>
                <p className="text-xs text-muted-foreground">
                  Available time slots
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Urgent Slots Warning */}
          {urgentSlots.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="h-4 w-4" />
                  Urgent Appointments ({urgentSlots.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {urgentSlots.map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between text-xs bg-white p-2 rounded border">
                      <div>
                        <div className="font-medium">{slot.attendeeName}</div>
                        <div className="text-muted-foreground">{slot.serviceName}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{format(parseISO(slot.start), 'MMM dd, HH:mm')}</div>
                        <Badge variant="destructive" className="text-xs">
                          {Math.max(0, differenceInHours(parseISO(slot.start), new Date()))}h remaining
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Slots List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">All Selected Slots</h3>
            <div className="grid gap-2 max-h-64 overflow-y-auto">
              {selectedSlots.map((slot) => (
                <div key={slot.id} className="flex items-center justify-between text-sm p-3 border rounded-lg bg-card">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{slot.serviceName}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(parseISO(slot.start), 'MMM dd, yyyy HH:mm')} - {format(parseISO(slot.end), 'HH:mm')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {slot.attendeeName && (
                      <div className="font-medium text-sm">{slot.attendeeName}</div>
                    )}
                    <Badge variant={slot.attendeeName ? 'default' : 'secondary'} className="text-xs">
                      {slot.attendeeName ? 'Booked' : 'Open'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Reason for Emergency Deletion <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for this emergency deletion. This will be included in client notifications."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-20"
            />
            <p className="text-xs text-muted-foreground">
              This reason will be included in all client notifications and logged for audit purposes.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="bg-red-600 hover:bg-red-700"
          >
            Confirm Emergency Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyDeleteDialog;
