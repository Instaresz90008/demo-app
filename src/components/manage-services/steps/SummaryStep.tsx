
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Check, 
  Clock, 
  DollarSign, 
  Users, 
  Video, 
  Phone, 
  MapPin, 
  Settings,
  CheckCircle2
} from 'lucide-react';
import { CreateServiceFormValues } from '../CreateServiceWorkflow';
import { MeetingTypeConfig } from '../types/meetingTypes';

interface Props {
  values: CreateServiceFormValues;
  onPrevious: () => void;
  onSubmit: () => void;
}

const SummaryStep: React.FC<Props> = ({ values, onPrevious, onSubmit }) => {
  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'in-person': return <MapPin className="w-4 h-4" />;
      default: return <Video className="w-4 h-4" />;
    }
  };

  const getMeetingTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return 'Video Meeting';
      case 'phone': return 'Audio Call';
      case 'in-person': return 'In-Person Meeting';
      default: return type;
    }
  };

  const enabledMeetingTypes = (values.additionalSettings?.meetingTypesConfig?.filter(mt => mt.enabled) || []) as MeetingTypeConfig[];
  const collectPayment = values.additionalSettings?.collectPayment ?? false;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
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
            Review & Create Service
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Review your service configuration</p>
        </div>
        <div className="w-20" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Success Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200 px-6 py-3 rounded-full border border-green-200 dark:border-green-800">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Configuration Complete</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card className="shadow-lg border-0 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-500" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Service Name</label>
                  <p className="text-lg font-semibold text-foreground">{values.serviceName}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-foreground">{values.description}</p>
                </div>
                
                <div className="flex gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Service Type</label>
                    <Badge variant="outline" className="mt-1 block w-fit">
                      {values.serviceType.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Duration</label>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{values.duration} minutes</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meeting Types */}
            <Card className="shadow-lg border-0 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple-500" />
                  Meeting Types ({enabledMeetingTypes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enabledMeetingTypes.length > 0 ? (
                  <div className="space-y-4">
                    {enabledMeetingTypes.map((meetingType, index) => (
                      <div key={meetingType.id} className="flex items-center justify-between p-4 bg-muted/50 dark:bg-gray-700/50 rounded-lg border border-border dark:border-gray-600">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                            {getMeetingTypeIcon(meetingType.id)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {getMeetingTypeLabel(meetingType.id)}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {collectPayment && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  ${meetingType.price}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                Max {meetingType.maxParticipants}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          <Check className="w-3 h-3 mr-1" />
                          Enabled
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No meeting types configured</p>
                )}
              </CardContent>
            </Card>

            {/* Payment & Settings */}
            <Card className="shadow-lg border-0 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  Payment & Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Payment Collection</span>
                  <Badge variant={collectPayment ? "default" : "secondary"}>
                    {collectPayment ? "Enabled" : "Free Service"}
                  </Badge>
                </div>
                
                {collectPayment && enabledMeetingTypes.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Pricing by Meeting Type</label>
                    <div className="space-y-2">
                      {enabledMeetingTypes.map(meetingType => (
                        <div key={meetingType.id} className="flex justify-between items-center text-sm">
                          <span className="text-foreground">{getMeetingTypeLabel(meetingType.id)}</span>
                          <span className="font-medium text-foreground">${meetingType.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Settings */}
            <Card className="shadow-lg border-0 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-500" />
                  Additional Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-foreground">Buffer Time</span>
                  <span className="font-medium text-foreground">
                    {values.additionalSettings?.bufferTime || 15} minutes
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-foreground">Max Advance Booking</span>
                  <span className="font-medium text-foreground">
                    {values.additionalSettings?.maxAdvanceBooking || 30} days
                  </span>
                </div>

                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Meeting Features</h4>
                  {enabledMeetingTypes.map(meetingType => (
                    <div key={meetingType.id} className="text-sm">
                      <p className="font-medium text-foreground mb-1">{getMeetingTypeLabel(meetingType.id)}</p>
                      <div className="ml-4 space-y-1 text-muted-foreground">
                        {meetingType.id === 'in-person' && meetingType.parkingAvailable && (
                          <p>• Parking available</p>
                        )}
                        {meetingType.meetingLink && (
                          <p>• Custom meeting link configured</p>
                        )}
                        {meetingType.location && (
                          <p>• Location: {meetingType.location}</p>
                        )}
                        {meetingType.phoneNumber && (
                          <p>• Phone: {meetingType.phoneNumber}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-8 pb-4">
            <Button variant="outline" onClick={onPrevious} className="px-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Settings
            </Button>
            
            <Button 
              onClick={onSubmit}
              className="px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Check className="w-4 h-4 mr-2" />
              Create Service
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStep;
