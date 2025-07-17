
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import NotificationCategoryItem from "./NotificationCategoryItem";

interface NotificationCategoriesCardProps {
  form: UseFormReturn<{
    emailNotifications: boolean;
    pushNotifications: boolean;
    newBookings: boolean;
    bookingChanges: boolean;
    reminders: boolean;
    marketing: boolean;
  }>;
}

const NotificationCategoriesCard: React.FC<NotificationCategoriesCardProps> = ({ form }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Notification Categories</h3>
        <Form {...form}>
          <form className="w-full" onSubmit={form.handleSubmit(() => {})}>
            <Accordion type="multiple" defaultValue={["bookings", "reminders"]} className="w-full">
              <AccordionItem value="bookings">
                <AccordionTrigger>Booking Notifications</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <NotificationCategoryItem
                      form={form}
                      fieldName="newBookings"
                      title="New Bookings"
                      description="Receive notifications when someone books a slot with you"
                    />
                    <NotificationCategoryItem
                      form={form}
                      fieldName="bookingChanges"
                      title="Booking Changes"
                      description="Get notified about cancellations or rescheduling"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="reminders">
                <AccordionTrigger>Reminders</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <NotificationCategoryItem
                      form={form}
                      fieldName="reminders"
                      title="Event Reminders"
                      description="Receive reminders before your scheduled events"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="marketing">
                <AccordionTrigger>Marketing & Updates</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <NotificationCategoryItem
                      form={form}
                      fieldName="marketing"
                      title="Product Updates & Tips"
                      description="Receive occasional product updates and usage tips"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NotificationCategoriesCard;
