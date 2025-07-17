
import React from "react";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";

interface NotificationFormActionsProps {
  form: UseFormReturn<any>;
  onSubmit: () => void;
  onReset: () => void;
  isSubmitting?: boolean;
}

const NotificationFormActions: React.FC<NotificationFormActionsProps> = ({ 
  form, 
  onSubmit,
  onReset,
  isSubmitting = false
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline" 
        type="button" 
        onClick={onReset}
        disabled={isSubmitting}
      >
        Reset to Defaults
      </Button>
      <Button 
        onClick={onSubmit}
        disabled={!form.formState.isDirty || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Notification Settings"
        )}
      </Button>
    </div>
  );
};

export default NotificationFormActions;
