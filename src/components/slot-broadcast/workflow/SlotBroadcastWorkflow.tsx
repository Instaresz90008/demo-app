import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, Copy, QrCode, Share2, Eye, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SlotBroadcastWorkflowProps {
  onComplete: (data: any) => void;
}

const SlotBroadcastWorkflow: React.FC<SlotBroadcastWorkflowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [slotData, setSlotData] = useState({
    title: '',
    duration: '30',
    date: '',
    time: '',
    capacity: '1',
    description: ''
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setSlotData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const completedSlot = {
      ...slotData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'active',
      bookingLink: `https://cal.example.com/book/${slotData.title.toLowerCase().replace(/\s+/g, '-')}`
    };
    
    onComplete(completedSlot);
    toast({
      title: "Slot Created Successfully!",
      description: "Your booking slot is now live and ready for appointments.",
    });
  };

  const copyBookingLink = () => {
    const link = `https://cal.example.com/book/${slotData.title.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied!",
      description: "Booking link has been copied to your clipboard.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`w-16 h-0.5 mx-2 ${
                step < currentStep ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      <Tabs value={`step-${currentStep}`} className="w-full">
        {/* Step 1: Basic Info */}
        <TabsContent value="step-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Basic Slot Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Slot Title</label>
                  <Input
                    placeholder="e.g., 30-min Consultation"
                    value={slotData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={slotData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <Input
                    type="date"
                    value={slotData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time</label>
                  <Input
                    type="time"
                    value={slotData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description (optional)</label>
                <textarea
                  className="w-full p-3 border rounded-lg"
                  rows={3}
                  placeholder="Describe what this appointment is for..."
                  value={slotData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 2: Capacity & Settings */}
        <TabsContent value="step-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Capacity & Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Maximum Attendees</label>
                <Input
                  type="number"
                  min="1"
                  value={slotData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                />
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Notification Settings</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Email confirmation to attendee</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">SMS reminder 24 hours before</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Calendar invite</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 3: Review & Publish */}
        <TabsContent value="step-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Review & Publish
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <h4 className="font-semibold text-lg">{slotData.title}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{slotData.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Max {slotData.capacity} attendees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{slotData.date} at {slotData.time}</span>
                  </div>
                </div>
                {slotData.description && (
                  <p className="text-sm text-muted-foreground">{slotData.description}</p>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">Your Booking Link</h5>
                <div className="flex items-center gap-2">
                  <code className="bg-white px-2 py-1 rounded text-sm flex-1">
                    https://cal.example.com/book/{slotData.title.toLowerCase().replace(/\s+/g, '-')}
                  </code>
                  <Button size="sm" variant="outline" onClick={copyBookingLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button onClick={handleNext}>
          {currentStep === 3 ? 'Publish Slot' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default SlotBroadcastWorkflow;