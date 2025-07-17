
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
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Mail, Clock } from "lucide-react";

interface SlotDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSlots: Array<{
    id: string;
    title: string;
    start: string;
    end: string;
    attendeeName?: string;
    attendeeEmail?: string;
  }>;
  onConfirm: (reason: string) => void;
}

const SlotDeleteDialog: React.FC<SlotDeleteDialogProps> = ({
  open,
  onOpenChange,
  selectedSlots,
  onConfirm
}) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!reason.trim()) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    onConfirm(reason);
    setReason('');
    setIsSubmitting(false);
  };

  const affectedUsers = selectedSlots.filter(slot => slot.attendeeEmail).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete {selectedSlots.length} Slot{selectedSlots.length !== 1 ? 's' : ''}
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. The selected slots will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Affected Users Warning */}
          {affectedUsers > 0 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 text-orange-800 font-medium mb-2">
                <Mail className="h-4 w-4" />
                Email Notifications
              </div>
              <p className="text-sm text-orange-700">
                {affectedUsers} user{affectedUsers !== 1 ? 's' : ''} will be notified about the cancellation.
              </p>
            </div>
          )}

          {/* Slots to Delete */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <Label className="text-sm font-medium">Slots to be deleted:</Label>
            {selectedSlots.map((slot) => (
              <div key={slot.id} className="p-3 border rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{slot.title}</span>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {slot.start.slice(11, 16)} - {slot.end.slice(11, 16)}
                  </Badge>
                </div>
                {slot.attendeeName && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {slot.attendeeName} ({slot.attendeeEmail})
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason for deletion <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for deleting these slots. This will be included in the notification email."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim() || isSubmitting}
          >
            {isSubmitting ? 'Deleting...' : `Delete ${selectedSlots.length} Slot${selectedSlots.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SlotDeleteDialog;
