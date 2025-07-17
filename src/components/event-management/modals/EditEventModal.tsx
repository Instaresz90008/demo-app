
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Event } from "../data/mockData";
import { Pencil, Save, X, User, Calendar, Phone, Clock, MapPin } from "lucide-react";

interface EditEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  onSubmit: (data: Event) => void;
  loading?: boolean;
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  open,
  onOpenChange,
  event,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState<Event | null>(event);

  useEffect(() => {
    setFormData(event);
  }, [event]);

  if (!formData) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f!, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Event);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl z-[9999] bg-popover border-2 border-border shadow-2xl p-0 overflow-visible">
        <form onSubmit={handleSubmit} className="w-full" autoComplete="off">
          {/* HEADER */}
          <DialogHeader className="p-7 pb-2 flex flex-col gap-1 items-center bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
            <div className="flex justify-center items-center gap-2">
              <Pencil className="h-7 w-7 text-primary" />
              <DialogTitle className="text-2xl font-bold text-foreground">
                Edit Event
              </DialogTitle>
            </div>
            <DialogDescription>
              <span className="text-base font-medium text-muted-foreground">
                Update event details below.
              </span>
            </DialogDescription>
            <Badge variant="outline" className="mt-4 text-sm rounded-xl px-3 py-1 bg-primary/10 text-primary border-primary/20">
              Event ID: {formData?.id}
            </Badge>
          </DialogHeader>
          
          <div className="px-8 py-7 space-y-6 grid grid-cols-1 md:grid-cols-2 gap-7">
            <div className="space-y-7">
              {/* Client Name */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="clientName" className="font-medium text-foreground flex items-center gap-1">
                  <User size={18} className="text-primary" />
                  Client Name
                </Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                  className="bg-input border-2 border-border text-foreground focus:border-primary focus:ring-primary/20"
                  placeholder="Client name"
                />
              </div>
              
              {/* Contact Number */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="contactNumber" className="font-medium text-foreground flex items-center gap-1">
                  <Phone size={17} className="text-primary" />
                  Contact Number
                </Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="bg-input border-2 border-border text-foreground focus:border-primary focus:ring-primary/20"
                  placeholder="Contact"
                />
              </div>
              
              {/* Meeting Type */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="meetingType" className="font-medium text-foreground">
                  Meeting Type
                </Label>
                <Input
                  id="meetingType"
                  name="meetingType"
                  value={formData.meetingType}
                  onChange={handleChange}
                  className="bg-input border-2 border-border text-foreground focus:border-primary focus:ring-primary/20"
                  placeholder="Meeting type"
                />
              </div>
              
              {/* Time Zone */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="clientTimeZone" className="font-medium text-foreground flex items-center gap-1">
                  <MapPin size={15} className="text-primary" />
                  Time Zone
                </Label>
                <Input
                  id="clientTimeZone"
                  name="clientTimeZone"
                  value={formData.clientTimeZone}
                  onChange={handleChange}
                  className="bg-input border-2 border-border text-foreground focus:border-primary focus:ring-primary/20"
                  placeholder="e.g. GMT+2, EST"
                />
              </div>
            </div>
            
            <div className="space-y-7">
              {/* Service Name */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="serviceName" className="font-medium text-foreground">
                  Service Name
                </Label>
                <Input
                  id="serviceName"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  required
                  className="bg-input border-2 border-border text-foreground focus:border-primary focus:ring-primary/20"
                  placeholder="Service"
                />
              </div>
              
              {/* Date */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="appointmentDate" className="font-medium text-foreground flex items-center gap-1">
                  <Calendar size={18} className="text-primary" />
                  Date
                </Label>
                <Input
                  id="appointmentDate"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  className="bg-input border-2 border-border text-foreground focus:border-primary focus:ring-primary/20"
                />
              </div>
              
              {/* Start Time */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="startTime" className="font-medium text-foreground flex items-center gap-1">
                  <Clock size={16} className="text-primary" /> Start Time
                </Label>
                <Input
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="bg-input border-2 border-border text-foreground focus:border-primary focus:ring-primary/20"
                  placeholder="09:00 AM"
                />
              </div>
              
              {/* End Time */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="endTime" className="font-medium text-foreground">
                  End Time
                </Label>
                <Input
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="bg-input border-2 border-border text-foreground focus:border-primary focus:ring-primary/20"
                  placeholder="10:00 AM"
                />
              </div>
              
              {/* Status */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="status" className="font-medium text-foreground">
                  Status
                </Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="bg-input border-2 border-border text-foreground focus:border-primary focus:ring-primary/20 rounded-md px-3 py-2 text-base"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Completed">Completed</option>
                  <option value="No-Show">No-Show</option>
                </select>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end items-center gap-5 px-8 pb-7 pt-3 border-t border-border bg-muted/30">
            <Button
              type="submit"
              disabled={!!loading}
              className="rounded-xl px-8 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg"
            >
              <Save className="mr-2" size={18} /> {loading ? "Saving..." : "Save"}
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl px-5 py-2 font-medium border-2"
              >
                <X className="mr-2" size={17} /> Cancel
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventModal;
