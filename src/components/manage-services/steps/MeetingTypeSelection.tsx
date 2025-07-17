
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Clock, ArrowLeft, Settings, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import MeetingTypesGrid from "./MeetingTypesGrid";
import { MeetingTypeConfig } from "../types/meetingTypes";
import MeetingTypeConfigTabs from "./MeetingTypeConfigTabs";
import MeetingTypeDetailedConfig from "./MeetingTypeDetailedConfig";

export const durationOptions = [
  { value: "15", label: "15m" },
  { value: "30", label: "30m" },
  { value: "45", label: "45m" },
  { value: "60", label: "1h" },
  { value: "90", label: "1h 30m" },
  { value: "120", label: "2h" },
];

interface Props {
  duration: string;
  collectPayment: boolean;
  meetingTypes: MeetingTypeConfig[];
  errors: Record<string, string>;
  values: any;
  onDurationChange: (duration: string) => void;
  onPaymentToggle: (enabled: boolean) => void;
  onToggleMeetingType: (typeId: string) => void;
  onConfigureType: (typeId: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const MeetingTypeSelection: React.FC<Props> = ({
  duration,
  collectPayment,
  meetingTypes,
  errors,
  values,
  onDurationChange,
  onPaymentToggle,
  onToggleMeetingType,
  onConfigureType,
  onPrevious,
  onNext
}) => {
  const [currentView, setCurrentView] = useState<'selection' | 'config'>('selection');
  const [configuringType, setConfiguringType] = useState<string | null>(null);
  const [localMeetingTypes, setLocalMeetingTypes] = useState<MeetingTypeConfig[]>(meetingTypes);

  // Initialize meeting types with no auto-selection
  useEffect(() => {
    if (meetingTypes.length === 0) {
      const initialTypes: MeetingTypeConfig[] = [
        { 
          id: "video", 
          enabled: false, 
          price: "", 
          meetingLink: "", 
          location: "", 
          phoneNumber: "", 
          maxParticipants: "10", 
          parkingAvailable: false,
          meetingPasscode: "",
          bridgeNumber: "",
          refreshments: ""
        },
        { 
          id: "phone", 
          enabled: false, 
          price: "", 
          meetingLink: "", 
          location: "", 
          phoneNumber: "", 
          maxParticipants: "5", 
          parkingAvailable: false,
          meetingPasscode: "",
          bridgeNumber: "",
          refreshments: ""
        },
        { 
          id: "in-person", 
          enabled: false, 
          price: "", 
          meetingLink: "", 
          location: "", 
          phoneNumber: "", 
          maxParticipants: "8", 
          parkingAvailable: true,
          meetingPasscode: "",
          bridgeNumber: "",
          refreshments: ""
        },
      ];
      setLocalMeetingTypes(initialTypes);
    } else {
      setLocalMeetingTypes(meetingTypes);
    }
  }, [meetingTypes]);

  const enabledCount = localMeetingTypes.filter(type => type.enabled).length;
  const isFormValid = duration && parseInt(duration) >= 5 && enabledCount > 0;
  const enabledTypes = localMeetingTypes.filter(type => type.enabled);

  const handleToggleMeetingType = (typeId: string) => {
    const updatedTypes = localMeetingTypes.map(type => 
      type.id === typeId ? { ...type, enabled: !type.enabled } : type
    );
    setLocalMeetingTypes(updatedTypes);
    onToggleMeetingType(typeId);
  };

  const handleConfigureType = (typeId: string) => {
    setConfiguringType(typeId);
    setCurrentView('config');
  };

  const handleBackToSelection = () => {
    setCurrentView('selection');
    setConfiguringType(null);
  };

  const handleUpdateTypeConfig = (typeId: string, field: string, value: string | boolean) => {
    const updatedTypes = localMeetingTypes.map(type => 
      type.id === typeId ? { ...type, [field]: value } : type
    );
    setLocalMeetingTypes(updatedTypes);
  };

  const handleNext = () => {
    const enabledTypes = localMeetingTypes.filter(type => type.enabled);
    if (enabledTypes.length === 0) {
      return;
    }

    // Validate pricing for enabled types if payment is collected
    if (collectPayment) {
      for (const type of enabledTypes) {
        if (!type.price || parseFloat(type.price) <= 0 || parseFloat(type.price) > 10000) {
          return; // Don't proceed if pricing is not set properly
        }
      }
    }

    const primaryType = enabledTypes[0];
    
    // Pass data to parent form
    const updateData = {
      meetingType: primaryType?.id || "video",
      price: collectPayment ? primaryType?.price || "0" : "0",
      meetingLink: primaryType?.meetingLink || "",
      additionalSettings: {
        ...values.additionalSettings,
        collectPayment,
        meetingTypesConfig: enabledTypes
      }
    };

    // Call onChange first to update parent state
    onNext();
  };

  if (currentView === 'config' && configuringType) {
    const typeConfig = localMeetingTypes.find(t => t.id === configuringType);
    if (!typeConfig) return null;

    return (
      <div className="h-screen flex flex-col bg-background dark:bg-gray-900">
        {/* Header with Back Button */}
        <div className="bg-background dark:bg-gray-800 border-b border-border dark:border-gray-700 px-8 py-4 flex items-center gap-4 shrink-0 shadow-sm">
          <Button
            variant="ghost"
            onClick={handleBackToSelection}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Selection
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <MeetingTypeDetailedConfig
            typeId={configuringType}
            config={typeConfig}
            collectPayment={collectPayment}
            serviceType={values.serviceType}
            onUpdate={handleUpdateTypeConfig}
            errors={errors}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative overflow-x-hidden">
      {/* Header */}
      <div className="bg-background/95 dark:bg-gray-800/95 backdrop-blur-xl border-b border-border dark:border-gray-700 px-8 py-4 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onPrevious}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back</span>
          </Button>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Meeting Configuration
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Choose how clients connect with you</p>
        </div>
        <div className="w-20" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Payment and Duration */}
        <div className="w-full max-w-[1100px] mx-auto px-4 pt-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Payment Collection */}
            <div className="w-full md:w-1/2 max-w-[440px] flex-shrink-0 space-y-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-6 border border-green-100 dark:border-green-800/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Payment Collection</h3>
                      <p className="text-sm text-muted-foreground">Enable pricing for services</p>
                    </div>
                  </div>
                  <Switch
                    checked={collectPayment}
                    onCheckedChange={onPaymentToggle}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Session Duration */}
            <div className="w-full md:w-1/2 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Session Duration</h3>
                    <p className="text-sm text-muted-foreground">How long will sessions last?</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {durationOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onDurationChange(option.value)}
                      className={cn(
                        "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 border",
                        duration === option.value
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg border-blue-200 dark:border-blue-800"
                          : "bg-background text-foreground hover:bg-muted border-border hover:border-border/80"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-foreground mb-2 block">Custom Duration</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={duration}
                      onChange={(e) => onDurationChange(e.target.value)}
                      placeholder="60"
                      min="5"
                      max="480"
                      className="h-10 text-sm bg-background dark:bg-gray-800"
                    />
                    <span className="text-sm text-muted-foreground">minutes</span>
                  </div>
                </div>
                {errors.duration && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    {errors.duration}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Meeting Types Selection */}
        <section className="w-full mt-12 px-4 max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-foreground mb-2">Select Meeting Types</h2>
          <p className="text-muted-foreground mb-2">Configure how clients can connect with you. Select at least one type.</p>
          {errors.meetingTypes && (
            <p className="text-sm text-destructive mt-2 flex items-center gap-1">
              {errors.meetingTypes}
            </p>
          )}
          {errors.pricing && (
            <p className="text-sm text-destructive mt-2 flex items-center gap-1">
              {errors.pricing}
            </p>
          )}
          
          <div className="mt-6">
            <MeetingTypesGrid
              meetingTypes={localMeetingTypes}
              onToggleMeetingType={handleToggleMeetingType}
              onConfigureType={handleConfigureType}
            />
          </div>

          {enabledTypes.length > 0 && (
            <div className="mt-10">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-500" />
                  <h3 className="text-2xl font-extrabold tracking-tight text-foreground mb-0">
                    Configure Meeting Types
                  </h3>
                  <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg text-xs font-semibold ml-2">
                    Only enabled types will be shown here
                  </span>
                </div>
              </div>
              <MeetingTypeConfigTabs
                enabledTypes={enabledTypes}
                collectPayment={collectPayment}
                serviceType={values.serviceType}
                handleUpdateTypeConfig={handleUpdateTypeConfig}
              />
            </div>
          )}
        </section>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-background/95 dark:bg-gray-800/95 backdrop-blur-xl border-t border-border dark:border-gray-700 px-8 py-6 shrink-0 z-50 w-full fixed left-0 bottom-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Duration:</span>
              <span className="text-sm font-medium text-foreground">{duration || '30'} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Meeting Types:</span>
              <span className="text-sm font-medium text-foreground">{enabledCount} selected</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Payment:</span>
              <span className="text-sm font-medium text-foreground">{collectPayment ? 'Enabled' : 'Free'}</span>
            </div>
          </div>
          <Button
            onClick={handleNext}
            disabled={!isFormValid}
            className={cn(
              "px-8 py-3 h-auto font-semibold rounded-xl transition-all duration-300",
              isFormValid
                ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transform"
                : "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
            )}
          >
            Continue to Settings →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MeetingTypeSelection;
