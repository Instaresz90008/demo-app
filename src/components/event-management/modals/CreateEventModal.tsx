
import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EnhancedCalendar } from "@/components/ui/enhanced-calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateEvent: (eventData: any) => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  open,
  onOpenChange,
  onCreateEvent,
}) => {
  const [formData, setFormData] = useState({
    serviceName: "",
    clientName: "",
    contactNumber: "",
    email: "",
    appointmentDate: undefined as Date | undefined,
    startTime: "",
    endTime: "",
    meetingType: "",
    clientTimeZone: "",
    description: "",
    location: "",
    maxAttendees: "1",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent = {
      id: `event-${Date.now()}`,
      ...formData,
      appointmentDate: formData.appointmentDate ? format(formData.appointmentDate, "yyyy-MM-dd") : "",
      status: "Scheduled",
      createdAt: new Date().toISOString(),
    };

    onCreateEvent(newEvent);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      serviceName: "",
      clientName: "",
      contactNumber: "",
      email: "",
      appointmentDate: undefined,
      startTime: "",
      endTime: "",
      meetingType: "",
      clientTimeZone: "",
      description: "",
      location: "",
      maxAttendees: "1",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto z-[9999] bg-popover border-2 border-border shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-primary/10 to-primary/5 -m-6 mb-6 p-6 border-b border-border">
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Create New Event
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in the details to create a new event. All required fields are marked with an asterisk.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Service Name */}
            <div className="space-y-2">
              <Label htmlFor="serviceName" className="text-foreground font-medium">Service Name *</Label>
              <Input
                id="serviceName"
                value={formData.serviceName}
                onChange={(e) => setFormData(prev => ({ ...prev, serviceName: e.target.value }))}
                placeholder="e.g., Business Consultation"
                className="bg-input border-2 border-border text-foreground focus:border-primary focus:ring-primary/20"
                required
              />
            </div>

            {/* Client Name */}
            <div className="space-y-2">
              <Label htmlFor="clientName" className="text-foreground font-medium">Client Name *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                placeholder="e.g., John Doe"
                className="bg-input border-2 border-border text-foreground focus:border-primary focus:ring-primary/20"
                required
              />
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <Label htmlFor="contactNumber" className="text-foreground font-medium">Contact Number *</Label>
              <Input
                id="contactNumber"
                value={formData.contactNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                placeholder="e.g., +1 (555) 123-4567"
                className="bg-input border-2 border-border text-foreground focus:border-primary focus:ring-primary/20"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="e.g., john@example.com"
                className="bg-input border-2 border-border text-foreground focus:border-primary focus:ring-primary/20"
              />
            </div>

            {/* Appointment Date */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Appointment Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-input border-2 border-border text-foreground hover:bg-accent hover:text-accent-foreground",
                      !formData.appointmentDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.appointmentDate ? format(formData.appointmentDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[10000] bg-popover border-2 border-border shadow-xl">
                  <EnhancedCalendar
                    mode="single"
                    selected={formData.appointmentDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, appointmentDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Zone */}
            <div className="space-y-2">
              <Label htmlFor="clientTimeZone" className="text-foreground font-medium">Time Zone</Label>
              <Select value={formData.clientTimeZone} onValueChange={(value) => setFormData(prev => ({ ...prev, clientTimeZone: value }))}>
                <SelectTrigger className="bg-input border-2 border-border text-foreground focus:border-primary">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="z-[10000] bg-popover border-2 border-border shadow-xl">
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">Eastern Time</SelectItem>
                  <SelectItem value="PST">Pacific Time</SelectItem>
                  <SelectItem value="CST">Central Time</SelectItem>
                  <SelectItem value="MST">Mountain Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-foreground font-medium">Start Time *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="pl-10 bg-input border-2 border-border text-foreground focus:border-primary focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-foreground font-medium">End Time *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="pl-10 bg-input border-2 border-border text-foreground focus:border-primary focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            {/* Meeting Type */}
            <div className="space-y-2">
              <Label htmlFor="meetingType" className="text-foreground font-medium">Meeting Type *</Label>
              <Select value={formData.meetingType} onValueChange={(value) => setFormData(prev => ({ ...prev, meetingType: value }))}>
                <SelectTrigger className="bg-input border-2 border-border text-foreground focus:border-primary">
                  <SelectValue placeholder="Select meeting type" />
                </SelectTrigger>
                <SelectContent className="z-[10000] bg-popover border-2 border-border shadow-xl">
                  <SelectItem value="Video Call">Video Call</SelectItem>
                  <SelectItem value="Phone Call">Phone Call</SelectItem>
                  <SelectItem value="In-Person">In-Person</SelectItem>
                  <SelectItem value="Webinar">Webinar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Max Attendees */}
            <div className="space-y-2">
              <Label htmlFor="maxAttendees" className="text-foreground font-medium">Max Attendees</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="maxAttendees"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.maxAttendees}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxAttendees: e.target.value }))}
                  className="pl-10 bg-input border-2 border-border text-foreground focus:border-primary focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-foreground font-medium">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Conference Room A, Zoom Link, or Address"
                className="pl-10 bg-input border-2 border-border text-foreground focus:border-primary focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground font-medium">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Additional notes or agenda for the event..."
              rows={3}
              className="bg-input border-2 border-border text-foreground focus:border-primary focus:ring-primary/20"
            />
          </div>

          <DialogFooter className="gap-2 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-2">
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              Create Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;
