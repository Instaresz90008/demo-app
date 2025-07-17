
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Mail, Bell } from "lucide-react";

interface DeliveryMethodsCardProps {
  form: UseFormReturn<{
    emailNotifications: boolean;
    pushNotifications: boolean;
    newBookings: boolean;
    bookingChanges: boolean;
    reminders: boolean;
    marketing: boolean;
  }>;
}

const DeliveryMethodsCard: React.FC<DeliveryMethodsCardProps> = ({ form }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Delivery Methods</h3>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(() => {})}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <FormLabel>Email Notifications</FormLabel>
                </div>
                <FormField
                  control={form.control}
                  name="emailNotifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <FormLabel>Push Notifications</FormLabel>
                </div>
                <FormField
                  control={form.control}
                  name="pushNotifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DeliveryMethodsCard;
