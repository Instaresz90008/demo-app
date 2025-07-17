
import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Bell, Calendar, Mail, MessageSquare, Shield } from "lucide-react";
import { SlotBroadcastFormValues } from "../SlotBroadcastWorkflow";

interface Props {
  values: SlotBroadcastFormValues;
  onChange: (fields: Partial<SlotBroadcastFormValues>) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const AdvancedConfigStep: React.FC<Props> = ({ values, onChange, onPrevious, onNext }) => {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
            <Settings className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Advanced Configuration</h1>
            <p className="text-muted-foreground">Configure notifications and advanced settings</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reminder Settings */}
        <Card className="border-2 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Reminder Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-foreground">Enable Reminders</label>
                <p className="text-xs text-muted-foreground">Send automatic reminders to attendees</p>
              </div>
              <Switch
                checked={values.reminderSettings.enabled}
                onCheckedChange={(checked) => 
                  onChange({
                    reminderSettings: {
                      ...values.reminderSettings,
                      enabled: checked
                    }
                  })
                }
              />
            </div>
            
            {values.reminderSettings.enabled && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Reminder Time
                </label>
                <Select
                  value={values.reminderSettings.reminderTime}
                  onValueChange={(value) =>
                    onChange({
                      reminderSettings: {
                        ...values.reminderSettings,
                        reminderTime: value
                      }
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes before</SelectItem>
                    <SelectItem value="30">30 minutes before</SelectItem>
                    <SelectItem value="60">1 hour before</SelectItem>
                    <SelectItem value="1440">1 day before</SelectItem>
                    <SelectItem value="2880">2 days before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-2 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <div>
                  <label className="text-sm font-medium text-foreground">Email Notifications</label>
                  <p className="text-xs text-muted-foreground">Send booking confirmations via email</p>
                </div>
              </div>
              <Switch
                checked={values.notificationSettings.email}
                onCheckedChange={(checked) =>
                  onChange({
                    notificationSettings: {
                      ...values.notificationSettings,
                      email: checked
                    }
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <div>
                  <label className="text-sm font-medium text-foreground">SMS Notifications</label>
                  <p className="text-xs text-muted-foreground">Send booking confirmations via SMS</p>
                </div>
                <Badge variant="outline" className="text-xs">Coming Soon</Badge>
              </div>
              <Switch
                checked={false}
                disabled={true}
                onCheckedChange={() => {}}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <div>
                  <label className="text-sm font-medium text-foreground">Calendar Integration</label>
                  <p className="text-xs text-muted-foreground">Add bookings to calendar automatically</p>
                </div>
              </div>
              <Switch
                checked={values.notificationSettings.calendar}
                onCheckedChange={(checked) =>
                  onChange({
                    notificationSettings: {
                      ...values.notificationSettings,
                      calendar: checked
                    }
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-2 border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security Settings
              <Badge variant="outline" className="text-xs">Coming Soon</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Advanced security features will be available soon</p>
              <p className="text-sm mt-2">Including booking approval workflows, access controls, and more</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="flex justify-between pt-8 border-t border-border">
        <Button
          onClick={onPrevious}
          variant="outline"
          className="px-8 py-3 h-auto font-semibold text-base rounded-xl"
        >
          ← Previous
        </Button>
        <Button
          onClick={onNext}
          className="px-8 py-3 h-auto font-semibold text-base rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
        >
          Next: Review & Confirm →
        </Button>
      </div>
    </div>
  );
};

export default AdvancedConfigStep;
