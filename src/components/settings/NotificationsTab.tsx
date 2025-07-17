
import React, { useState } from "react";
import DeliveryMethodsCard from "./notifications/DeliveryMethodsCard";
import NotificationCategoriesCard from "./notifications/NotificationCategoriesCard";
import NotificationFormActions from "./notifications/NotificationFormActions";
import { useNotificationSettings } from "./notifications/useNotificationSettings";
import { Form } from "@/components/ui/form";

const NotificationsTab = () => {
  const { form, handleSubmit, resetDefaults } = useNotificationSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    await handleSubmit();
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Notification Settings</h2>
      <p className="text-gray-500 mb-6">Configure how and when you receive notifications</p>
      
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          <DeliveryMethodsCard form={form} />
          <NotificationCategoriesCard form={form} />
          <NotificationFormActions 
            form={form} 
            onSubmit={onSubmit}
            onReset={resetDefaults}
            isSubmitting={isSubmitting}
          />
        </form>
      </Form>
    </div>
  );
};

export default NotificationsTab;
