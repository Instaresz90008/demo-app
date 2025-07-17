
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle, Copy, ExternalLink, Calendar, Clock, Users, Settings, Link2, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SlotBroadcastFormValues } from "../SlotBroadcastWorkflow";

interface Props {
  values: SlotBroadcastFormValues;
  onPrevious: () => void;
  onSubmit: () => void;
}

const ConfirmationStep: React.FC<Props> = ({ values, onPrevious, onSubmit }) => {
  const { toast } = useToast();
  const [generatedLink, setGeneratedLink] = useState(`https://bookings.app/s/${Date.now()}`);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      toast({
        title: "Link Copied!",
        description: "Booking link has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the link manually",
        variant: "destructive"
      });
    }
  };

  const handleOpenLink = () => {
    window.open(generatedLink, '_blank');
  };

  const handleGenerateQR = () => {
    toast({
      title: "QR Code Generated",
      description: "QR code generation will be available soon",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Review & Confirm</h1>
            <p className="text-muted-foreground">Review your slot broadcast configuration</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Summary */}
        <div className="space-y-6">
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Slot Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Service</label>
                  <p className="text-foreground font-medium">{values.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Duration</label>
                  <p className="text-foreground font-medium">{values.duration} minutes</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Selected Dates</label>
                  <p className="text-foreground font-medium">{values.selectedDates.length} dates</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Time Slots</label>
                  <p className="text-foreground font-medium">{values.timeSlots.length} slots per day</p>
                </div>
              </div>
              
              {values.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-foreground text-sm">{values.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Settings Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Reminders</span>
                <Badge variant={values.reminderSettings.enabled ? "default" : "secondary"}>
                  {values.reminderSettings.enabled ? `${values.reminderSettings.reminderTime}min before` : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email Notifications</span>
                <Badge variant={values.notificationSettings.email ? "default" : "secondary"}>
                  {values.notificationSettings.email ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Calendar Integration</span>
                <Badge variant={values.notificationSettings.calendar ? "default" : "secondary"}>
                  {values.notificationSettings.calendar ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Link Generation */}
        <div className="space-y-6">
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                Booking Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Your Booking Link
                </label>
                <div className="flex gap-2">
                  <Input
                    value={generatedLink}
                    readOnly
                    className="bg-background font-mono text-sm"
                  />
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleOpenLink}
                  variant="outline"
                  className="flex-1 font-medium"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview Booking Page
                </Button>
                <Button
                  onClick={handleGenerateQR}
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                >
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>

              <div className="bg-background rounded-lg p-4 border border-border">
                <h4 className="font-medium text-foreground mb-2">Booking Page Preview:</h4>
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Service:</span>
                    <span className="text-foreground font-medium">{values.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="text-foreground font-medium">{values.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Available slots:</span>
                    <span className="text-foreground font-medium">
                      {values.selectedDates.length * values.timeSlots.length} total
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-border">
                  <a
                    href={generatedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors duration-200 underline decoration-primary/30 hover:decoration-primary/60 underline-offset-4"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Booking Page
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="text-lg">Total Slots Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {values.selectedDates.length * values.timeSlots.length}
                </div>
                <p className="text-muted-foreground">
                  slots will be created across {values.selectedDates.length} dates
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
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
          onClick={onSubmit}
          className="px-8 py-3 h-auto font-semibold text-base rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
        >
          Create Slot Broadcast
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
