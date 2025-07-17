
import { useForm } from "react-hook-form";
import { useToast } from "./use-toast";
import { useState, useEffect } from "react";
import { notificationsApi } from "@/services/api";
import { NotificationSettings } from "@/services/api/types";

export const useNotificationSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: NotificationSettings = {
    user_id: "",
    email_enabled: true,
    push_enabled: false,
    sms_enabled: false,
    booking_notifications: true,
    reminder_notifications: true,
    marketing_notifications: false,
    update_notifications: true
  };

  const form = useForm<NotificationSettings>({
    defaultValues
  });

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await notificationsApi.getSettings();
      if (response.success && response.data) {
        form.reset(response.data);
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
      toast({
        title: "Error",
        description: "Failed to load notification settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSubmit = async () => {
    try {
      const values = form.getValues();
      const response = await notificationsApi.updateSettings(values);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Notification settings updated successfully",
        });
      } else {
        throw new Error(response.error || "Failed to update notification settings");
      }
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive"
      });
    }
  };

  const resetDefaults = () => {
    form.reset(defaultValues);
  };

  return {
    form,
    handleSubmit,
    resetDefaults,
    isLoading
  };
};
