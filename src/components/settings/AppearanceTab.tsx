import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Save, CircleCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const AppearanceTab = () => {
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    toast.success("Settings saved successfully!");
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Appearance Settings</h2>
        <p className="text-muted-foreground">
          Customize the visual appearance of your workspace
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Theme</h3>
                <ThemeToggle />
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Ultra-simplified dual theme system</strong>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Zero animations • WCAG AAA compliant • Maximum performance
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Display Options</h3>
              <p className="text-sm text-muted-foreground">
                Additional display customizations will be available in future updates.
              </p>
            </div>
          </div>

          {hasChanges && (
            <div className="flex items-center justify-end gap-2 mt-6 pt-6 border-t">
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceTab;