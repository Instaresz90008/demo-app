import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  ExternalLink, 
  Copy, 
  QrCode,
  Calendar,
  Clock,
  Users,
  Settings,
  Link2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BookingLinksWorkflowProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

const BookingLinksWorkflow: React.FC<BookingLinksWorkflowProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const steps: WorkflowStep[] = [
    {
      id: 1,
      title: 'Review Links',
      description: 'Review your active booking links',
      icon: <Link2 className="h-5 w-5" />,
      completed: currentStep > 1
    },
    {
      id: 2,
      title: 'Configure Settings',
      description: 'Customize link settings and options',
      icon: <Settings className="h-5 w-5" />,
      completed: currentStep > 2
    },
    {
      id: 3,
      title: 'Generate QR Codes',
      description: 'Create QR codes for easy sharing',
      icon: <QrCode className="h-5 w-5" />,
      completed: currentStep > 3
    },
    {
      id: 4,
      title: 'Share & Deploy',
      description: 'Share links and deploy to your channels',
      icon: <ExternalLink className="h-5 w-5" />,
      completed: currentStep > 4
    }
  ];

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied!",
      description: "Booking link copied to clipboard."
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review Active Booking Links</h3>
            <div className="space-y-3">
              {[
                { name: '30-min Business Consultation', url: 'business-consultation-dec2024', status: 'active', bookings: 8 },
                { name: 'Product Strategy Session', url: 'strategy-session-dec2024', status: 'active', bookings: 15 }
              ].map((link, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{link.name}</h4>
                      <p className="text-sm text-muted-foreground">{link.bookings} bookings</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configure Link Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-blue-500" />
                  <div>
                    <h4 className="font-medium">Availability Windows</h4>
                    <p className="text-sm text-muted-foreground">Set booking time limits</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-green-500" />
                  <div>
                    <h4 className="font-medium">Access Controls</h4>
                    <p className="text-sm text-muted-foreground">Manage who can book</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Generate QR Codes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: '30-min Business Consultation', url: 'business-consultation-dec2024' },
                { name: 'Product Strategy Session', url: 'strategy-session-dec2024' }
              ].map((link, index) => (
                <Card key={index} className="p-4 text-center">
                  <div className="w-32 h-32 bg-muted rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <h4 className="font-medium">{link.name}</h4>
                  <Button variant="outline" size="sm" className="mt-2">
                    Download QR
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Share & Deploy Links</h3>
            <div className="space-y-3">
              {[
                { name: '30-min Business Consultation', url: `${window.location.origin}/public-booking/business-consultation-dec2024` },
                { name: 'Product Strategy Session', url: `${window.location.origin}/public-booking/strategy-session-dec2024` }
              ].map((link, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{link.name}</h4>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyLink(link.url)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(link.url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Open
                        </Button>
                      </div>
                    </div>
                    <div className="bg-muted p-2 rounded text-sm font-mono truncate">
                      {link.url}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Booking Links Workflow</CardTitle>
              <p className="text-muted-foreground mt-1">
                Manage and configure your booking links
              </p>
            </div>
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {steps.length}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between mt-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step.completed
                      ? 'bg-primary text-primary-foreground border-primary'
                      : currentStep === step.id
                      ? 'border-primary text-primary'
                      : 'border-muted-foreground text-muted-foreground'
                  }`}
                >
                  {step.completed ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="text-center mt-2">
                  <p className={`text-sm font-medium ${
                    currentStep === step.id ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="mt-6">
          {renderStepContent()}
        </CardContent>

        <div className="flex justify-between items-center p-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Button onClick={handleNext}>
            {currentStep === steps.length ? 'Complete' : 'Next'}
            {currentStep < steps.length && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BookingLinksWorkflow;