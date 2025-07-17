
import { useForm } from "react-hook-form";
import { useNotifications } from "@/context/NotificationsContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  newBookings: boolean;
  bookingChanges: boolean;
  reminders: boolean;
  marketing: boolean;
}

export const useNotificationSettings = () => {
  const { addNotification } = useNotifications();
  const { toast } = useToast();
  
  const form = useForm<NotificationSettings>({
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      newBookings: true,
      bookingChanges: true,
      reminders: true,
      marketing: false
    }
  });

  const handleSubmit = (data: NotificationSettings) => {
    // Save notification settings
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated.",
    });

    // Demonstrate the notification system by sending a confirmation notification
    addNotification({
      title: "Settings updated",
      message: "Your notification preferences have been saved successfully",
      type: "success"
    });
  };

  const resetDefaults = () => {
    form.reset({
      emailNotifications: true,
      pushNotifications: true,
      newBookings: true,
      bookingChanges: true,
      reminders: true,
      marketing: false
    });
    
    toast({
      title: "Default settings restored",
      description: "Your notification settings have been reset to defaults.",
    });
  };

  return { 
    form, 
    handleSubmit: form.handleSubmit(handleSubmit),
    resetDefaults
  };
};
