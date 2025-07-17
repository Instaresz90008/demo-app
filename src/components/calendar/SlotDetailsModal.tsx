
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Mail, Phone, Edit3, Save, X } from "lucide-react";
import { format, parseISO } from "date-fns";

interface SlotData {
  id: string;
  title: string;
  start: string;
  end: string;
  status: string;
  attendeeName?: string;
  attendeeEmail?: string;
  serviceName?: string;
  description?: string;
  slotDuration: number;
}

interface SlotDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot: SlotData | null;
  mode: 'view' | 'edit';
  onSave?: (updatedSlot: SlotData) => void;
}

const SlotDetailsModal: React.FC<SlotDetailsModalProps> = ({
  open,
  onOpenChange,
  slot,
  mode,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [formData, setFormData] = useState(slot || {} as SlotData);

  React.useEffect(() => {
    if (slot) {
      setFormData(slot);
    }
    setIsEditing(mode === 'edit');
  }, [slot, mode]);

  if (!slot) return null;

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    setIsEditing(false);
    onOpenChange(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'cancelled': return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'no-show': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-sky-100 text-sky-800 border-sky-300';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border border-gray-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {isEditing ? 'Edit Slot' : 'Slot Details'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modify the slot information below' : 'View slot information and manage booking'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status and Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {format(parseISO(slot.start), 'PPP')} at {format(parseISO(slot.start), 'p')}
              </span>
            </div>
            <Badge className={getStatusColor(slot.status)}>
              {slot.status === 'scheduled' ? 'Booked' : slot.status}
            </Badge>
          </div>

          {/* Service Information */}
          <div className="space-y-2">
            <Label htmlFor="service">Service</Label>
            {isEditing ? (
              <Input
                id="service"
                value={formData.serviceName || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, serviceName: e.target.value }))}
                className="bg-white"
              />
            ) : (
              <p className="text-sm bg-gray-50 p-2 rounded border">{slot.serviceName || 'No service specified'}</p>
            )}
          </div>

          {/* Client Information */}
          {slot.attendeeName && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Client Information
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  {isEditing ? (
                    <Input
                      value={formData.attendeeName || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, attendeeName: e.target.value }))}
                      className="bg-white"
                    />
                  ) : (
                    <p className="text-sm">{slot.attendeeName}</p>
                  )}
                </div>
                
                <div>
                  <Label>Email</Label>
                  {isEditing ? (
                    <Input
                      value={formData.attendeeEmail || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, attendeeEmail: e.target.value }))}
                      className="bg-white"
                    />
                  ) : (
                    <p className="text-sm flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {slot.attendeeEmail}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Notes</Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add notes about this slot..."
                className="min-h-[80px] bg-white"
              />
            ) : (
              <p className="text-sm bg-gray-50 p-3 rounded border min-h-[80px]">
                {slot.description || 'No notes added'}
              </p>
            )}
          </div>

          {/* Status Change */}
          {isEditing && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="scheduled">Booked</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no-show">No-show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          {!isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SlotDetailsModal;
