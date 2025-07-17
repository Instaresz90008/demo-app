
import React from "react";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";

interface NotificationCategoryItemProps {
  form: UseFormReturn<any>;
  fieldName: string;
  title: string;
  description: string;
}

const NotificationCategoryItem: React.FC<NotificationCategoryItemProps> = ({
  form,
  fieldName,
  title,
  description
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <FormField
        control={form.control}
        name={fieldName}
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
  );
};

export default NotificationCategoryItem;
