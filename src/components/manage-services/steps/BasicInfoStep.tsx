
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, Users, Building, Sparkles, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateServiceFormValues } from "../CreateServiceWorkflow";

interface Props {
  values: CreateServiceFormValues;
  onChange: (fields: Partial<CreateServiceFormValues>) => void;
  onNext: () => void;
  onBackToServices?: () => void;
}

const serviceTypes = [
  {
    value: "one-to-one",
    label: "1-on-1",
    subtitle: "Individual Sessions",
    description: "Personal one-on-one consultation",
    icon: User,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    borderColor: "border-blue-200",
    selectedBorder: "border-blue-500",
    iconColor: "text-blue-600",
  },
  {
    value: "one-to-many",
    label: "1-to-Many",
    subtitle: "Group Sessions",
    description: "One provider to multiple participants",
    icon: Users,
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
    borderColor: "border-purple-200",
    selectedBorder: "border-purple-500",
    iconColor: "text-purple-600",
  },
  {
    value: "group",
    label: "Group Based",
    subtitle: "Team Sessions",
    description: "Multiple providers to multiple participants",
    icon: Building,
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
    borderColor: "border-emerald-200",
    selectedBorder: "border-emerald-500",
    iconColor: "text-emerald-600",
  },
];

const BasicInfoStep: React.FC<Props> = ({ values, onChange, onNext, onBackToServices }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Make sure values are always safe (never undefined)
  const serviceName = values.serviceName ?? "";
  const description = values.description ?? "";
  const serviceType = values.serviceType ?? "one-to-one";

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!serviceName.trim()) {
      newErrors.serviceName = "Service name is required";
    } else if (serviceName.length < 3) {
      newErrors.serviceName = "Must be at least 3 characters";
    }
    
    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length < 10) {
      newErrors.description = "Must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleServiceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsTyping(true);
    onChange({ serviceName: value });
    
    if (errors.serviceName && value.trim() && value.length >= 3) {
      setErrors(prev => ({ ...prev, serviceName: "" }));
    }
    
    setTimeout(() => setIsTyping(false), 300);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    onChange({ description: value });
    
    if (errors.description && value.trim() && value.length >= 10) {
      setErrors(prev => ({ ...prev, description: "" }));
    }
  };

  const isFormValid = serviceName.trim().length >= 3 && description.trim().length >= 10;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Top Navigation Bar */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBackToServices}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Manage Services
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="text-right">
            <h1 className="text-lg font-semibold text-foreground">Create Service</h1>
            <p className="text-sm text-muted-foreground">Step 1 of 4</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-6xl mx-auto px-6 py-8">
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column - Form Fields */}
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Define Your Service</h2>
                <p className="text-muted-foreground">Create something extraordinary for your clients</p>
              </div>

              {/* Service Name */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  Service Name
                  <span className="text-destructive">*</span>
                  {serviceName.length >= 3 && (
                    <CheckCircle2 className="w-4 h-4 text-green-500 animate-scale-in" />
                  )}
                </label>
                <div className="relative">
                  <Input
                    ref={nameInputRef}
                    value={serviceName}
                    onChange={handleServiceNameChange}
                    onFocus={() => setFocusedField('serviceName')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your service name..."
                    className={cn(
                      "h-12 text-base transition-all duration-300 rounded-xl border-2 bg-background text-foreground",
                      "w-full max-w-[480px]", // Width to fit ~60 characters
                      focusedField === 'serviceName' 
                        ? "border-primary/40 shadow-lg shadow-primary/10 bg-primary/5" 
                        : "border-border hover:border-border/80",
                      errors.serviceName && "border-destructive/40 bg-destructive/5",
                      isTyping && "animate-pulse"
                    )}
                    maxLength={60}
                  />
                  {serviceName && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                      {serviceName.length}/60
                    </div>
                  )}
                </div>
                {errors.serviceName && (
                  <div className="flex items-center gap-2 text-destructive text-sm animate-fade-in">
                    <AlertCircle className="w-4 h-4" />
                    {errors.serviceName}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  Description
                  <span className="text-destructive">*</span>
                  {description.length >= 10 && (
                    <CheckCircle2 className="w-4 h-4 text-green-500 animate-scale-in" />
                  )}
                </label>
                <div className="relative">
                  <Textarea
                    value={description}
                    onChange={handleDescriptionChange}
                    onFocus={() => setFocusedField('description')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Describe what makes your service special..."
                    className={cn(
                      "min-h-[120px] text-base transition-all duration-300 rounded-xl border-2 resize-none bg-background text-foreground",
                      "w-full max-w-[640px]", // Width to fit ~208 characters across multiple lines
                      focusedField === 'description' 
                        ? "border-primary/40 shadow-lg shadow-primary/10 bg-primary/5" 
                        : "border-border hover:border-border/80",
                      errors.description && "border-destructive/40 bg-destructive/5"
                    )}
                    maxLength={250}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-muted-foreground font-medium">
                    {description.length}/250
                  </div>
                </div>
                {errors.description && (
                  <div className="flex items-center gap-2 text-destructive text-sm animate-fade-in">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </div>
                )}
              </div>

              {/* Next Button */}
              <div className="pt-4">
                <Button
                  onClick={handleNext}
                  disabled={!isFormValid}
                  className={cn(
                    "px-8 py-3 h-auto font-semibold text-base rounded-xl transition-all duration-300",
                    isFormValid
                      ? "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02] transform"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  Next Step →
                </Button>
              </div>
            </div>

            {/* Right Column - Service Type Selection */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">
                  Service Type
                </label>
                <div className="space-y-3">
                  {serviceTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = serviceType === type.value;
                    
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => onChange({ serviceType: type.value as any })}
                        className={cn(
                          "w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left group hover:scale-[1.02] relative overflow-hidden",
                          isSelected
                            ? "border-primary bg-primary/10 shadow-lg"
                            : "border-border bg-card hover:bg-accent hover:shadow-md"
                        )}
                      >
                        <div className="flex items-start gap-4 relative z-10">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                            isSelected 
                              ? "bg-primary shadow-lg" 
                              : "bg-muted group-hover:bg-muted/80"
                          )}>
                            <Icon
                              className={cn(
                                "w-6 h-6 transition-all duration-300",
                                isSelected ? "text-primary-foreground" : "text-muted-foreground"
                              )}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={cn(
                                "font-bold text-base transition-colors duration-300",
                                isSelected ? "text-foreground" : "text-foreground/80"
                              )}>
                                {type.label}
                              </h3>
                              {isSelected && (
                                <CheckCircle2 className="w-5 h-5 text-green-500 animate-scale-in" />
                              )}
                            </div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              {type.subtitle}
                            </p>
                            <p className="text-xs text-muted-foreground/80">
                              {type.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/5 animate-fade-in" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    {[serviceName.length >= 3, description.length >= 10].map((valid, index) => (
                      <div
                        key={index}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300",
                          valid ? "bg-green-500" : "bg-muted"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {isFormValid ? "Ready to continue" : "Complete all fields"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
