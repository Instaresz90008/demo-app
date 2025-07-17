
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EnhancedCalendar } from "@/components/ui/enhanced-calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface CreateBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const services = [
  { id: "1", name: "Business Consultation", duration: "60 min" },
  { id: "2", name: "Legal Advice", duration: "45 min" },
  { id: "3", name: "Financial Planning", duration: "30 min" },
  { id: "4", name: "Strategy Session", duration: "90 min" },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30"
];

const CreateBookingModal = ({ open, onOpenChange }: CreateBookingModalProps) => {
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const handleBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime || !clientName || (!clientEmail && !clientPhone)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Booking Created",
      description: `Booking created successfully for ${clientName} on ${format(selectedDate, "PPP")} at ${selectedTime}`,
    });
    
    // Reset form
    setSelectedService("");
    setSelectedDate(undefined);
    setSelectedTime("");
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    onOpenChange(false);
  };

  const isFormValid = () => {
    return selectedService !== "" && 
           selectedDate !== undefined && 
           selectedTime !== "" && 
           clientName !== "" && 
           (clientEmail !== "" || clientPhone !== "");
  };

  const resetModal = () => {
    setSelectedService("");
    setSelectedDate(undefined);
    setSelectedTime("");
    setClientName("");
    setClientEmail("");
    setClientPhone("");
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetModal();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-lg bg-background border border-border shadow-lg">
        <DialogHeader>
          <DialogTitle>Create Booking</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Service Selection */}
          <div className="space-y-2">
            <Label>Service *</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} ({service.duration})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background border-border",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "MMM dd") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background border border-border shadow-lg" align="start">
                  <EnhancedCalendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="p-3 pointer-events-auto bg-background"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Time *</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Client Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name"
                className="bg-background border-border"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@email.com"
                  className="bg-background border-border"
                />
              </div>
              <div>
                <Label htmlFor="clientPhone">Phone Number</Label>
                <Input
                  id="clientPhone"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+1-555-000-0000"
                  className="bg-background border-border"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              * At least email or phone number is required
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleBooking} disabled={!isFormValid()}>
              Create Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBookingModal;
