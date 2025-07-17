
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { timezones } from "@/constants/bookingConstants";

export interface BookingState {
  currentStep: number;
  selectedDate: Date | undefined;
  selectedTime: string | null;
  name: string;
  email: string;
  purpose: string;
  phoneNumber: string;
  countryCode: string;
  timezone: string;
  serviceDetails: {
    serviceName: string;
    description: string;
  };
}

export function useBookingState() {
  const { bookingId } = useParams();
  const { toast } = useToast();

  // Initialize state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [serviceDetails, setServiceDetails] = useState({
    serviceName: "Initial Consultation",
    description: "A 30-minute discussion to understand your needs and how we can help."
  });
  const [timezone, setTimezone] = useState(() => {
    try {
      // Try to get user's timezone
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return timezones.includes(userTimezone) ? userTimezone : "America/Los_Angeles";
    } catch (e) {
      return "America/Los_Angeles";
    }
  });

  // Define step navigation functions
  const handleNextStep = () => {
    if (currentStep === 1 && !selectedTime) {
      toast({
        title: "Please select a time",
        description: "You need to select a time slot to continue",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep === 2) {
      // Validate form fields
      if (!name || !email) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address",
          variant: "destructive"
        });
        return;
      }
    }
    
    // Scroll to top when changing steps
    window.scrollTo(0, 0);
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      // Scroll to top when changing steps
      window.scrollTo(0, 0);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitBooking = () => {
    // In a real app, you would submit the booking data to your backend
    toast({
      title: "Booking Confirmed!",
      description: `Your booking has been scheduled for ${format(selectedDate!, 'MMM dd, yyyy')} at ${selectedTime}`,
    });
    
    // Show final confirmation screen
    window.scrollTo(0, 0);
    setCurrentStep(4);
  };

  // Get the title for the current step
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Select Date and Time';
      case 2:
        return 'Enter Your Details';
      case 3:
        return 'Additional Information';
      case 4:
        return 'Booking Confirmed';
      default:
        return '';
    }
  };

  // Get step labels for the indicator
  const getStepLabels = () => {
    return ['Details', 'Information', 'Questions'];
  };

  return {
    bookingId,
    currentStep,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    name,
    setName,
    email,
    setEmail,
    purpose,
    setPurpose,
    phoneNumber,
    setPhoneNumber,
    countryCode,
    setCountryCode,
    timezone,
    setTimezone,
    serviceDetails,
    setServiceDetails,
    handleNextStep,
    handlePreviousStep,
    handleSubmitBooking,
    getStepTitle,
    getStepLabels
  };
}
