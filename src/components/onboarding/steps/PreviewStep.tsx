import React from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Users, 
  DollarSign, 
  Tag, 
  Calendar,
  MapPin,
  Phone,
  Video,
  Globe,
  CheckCircle,
  Info
} from 'lucide-react';

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

const PreviewStep: React.FC<Props> = ({ onNext, onPrevious }) => {
  const { data } = useAppSelector(state => state.onboarding);

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'in-person': return <MapPin className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const formatSlotTime = (slot: any) => {
    try {
      // Handle different date formats
      let startDate, endDate;
      
      if (slot.date && slot.startTime && slot.endTime) {
        // Create proper date objects
        const dateStr = slot.date;
        startDate = new Date(`${dateStr}T${slot.startTime}`);
        endDate = new Date(`${dateStr}T${slot.endTime}`);
      } else if (slot.startTime && slot.endTime) {
        // Fallback to time-only format
        const today = new Date().toISOString().split('T')[0];
        startDate = new Date(`${today}T${slot.startTime}`);
        endDate = new Date(`${today}T${slot.endTime}`);
      } else {
        return 'Invalid time';
      }

      // Check if dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return `${slot.startTime || 'N/A'} - ${slot.endTime || 'N/A'}`;
      }

      return `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch (error) {
      console.error('Error formatting slot time:', error, slot);
      return `${slot.startTime || 'N/A'} - ${slot.endTime || 'N/A'}`;
    }
  };

  const groupSlotsByDate = (slots: any[]) => {
    if (!slots || slots.length === 0) return {};
    
    return slots.reduce((acc, slot) => {
      try {
        let dateStr;
        
        if (slot.date) {
          // Use the existing date
          dateStr = slot.date;
        } else if (slot.startTime) {
          // Fallback to today's date
          dateStr = new Date().toISOString().split('T')[0];
        } else {
          return acc;
        }

        // Create a proper date object to format
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          console.error('Invalid date:', dateStr);
          return acc;
        }

        const formattedDate = date.toDateString();
        if (!acc[formattedDate]) acc[formattedDate] = [];
        acc[formattedDate].push(slot);
        return acc;
      } catch (error) {
        console.error('Error grouping slot:', error, slot);
        return acc;
      }
    }, {} as Record<string, any[]>);
  };

  const groupedSlots = groupSlotsByDate(data.serviceDetails.slots || []);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Preview Your Service
        </h2>
        <p className="text-lg text-gray-600">
          Review your complete service configuration before finalizing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Service Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-xl">{data.serviceDetails.name || 'Untitled Service'}</span>
                <Badge variant="outline" className="capitalize">
                  {data.bookingType?.replace('-', ' ')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {data.serviceDetails.description && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {data.serviceDetails.description}
                  </p>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-700">Duration</p>
                    <p className="text-blue-900 font-semibold">{data.serviceDetails.duration} min</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-700">Price</p>
                    <p className="text-green-900 font-semibold">
                      ${data.serviceDetails.price}
                      {data.pricingModel === 'per-person' && (
                        <span className="text-xs ml-1">/person</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-700">Capacity</p>
                    <p className="text-purple-900 font-semibold">{data.serviceDetails.maxParticipants}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <Tag className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-orange-700">Category</p>
                    <p className="text-orange-900 font-semibold capitalize">{data.serviceDetails.category}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Configuration Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p><span className="font-medium">User Type:</span> <span className="capitalize">{data.userType}</span></p>
                    <p><span className="font-medium">Booking Type:</span> <span className="capitalize">{data.bookingType?.replace('-', ' ')}</span></p>
                    <p><span className="font-medium">Pricing Model:</span> <span className="capitalize">{data.pricingModel?.replace('-', ' ')}</span></p>
                  </div>
                  <div className="space-y-2">
                    <p><span className="font-medium">Event Type:</span> <span className="capitalize">{data.eventType || 'One-time'}</span></p>
                    <p><span className="font-medium">Template Used:</span> {data.templateId ? 'Yes' : 'Custom'}</p>
                    <p><span className="font-medium">Total Slots:</span> {data.serviceDetails.slots?.length || 0}</p>
                  </div>
                </div>
              </div>

              {data.userType === 'business' && data.businessCompliance && (
                <>
                  <Separator />
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Business Information
                    </h4>
                    <div className="text-sm text-green-700 space-y-1">
                      <p><span className="font-medium">Business Name:</span> {data.businessCompliance.businessName}</p>
                      <p><span className="font-medium">Business Type:</span> {data.businessCompliance.businessType}</p>
                      <p><span className="font-medium">Status:</span> <Badge variant="secondary" className="text-xs">Verified</Badge></p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Slots and Additional Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5" />
                Available Slots
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(groupedSlots).length > 0 ? (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {Object.entries(groupedSlots).map(([date, slots]) => {
                    try {
                      const dateObj = new Date(date);
                      const isValidDate = !isNaN(dateObj.getTime());
                      
                      return (
                        <div key={date} className="space-y-2">
                          <h5 className="font-medium text-sm text-gray-700 border-b pb-1">
                            {isValidDate ? dateObj.toLocaleDateString([], { 
                              weekday: 'short',
                              month: 'short', 
                              day: 'numeric'
                            }) : date}
                          </h5>
                          <div className="space-y-1">
                            {(slots as any[] || []).map((slot, index) => (
                              <div key={index} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                                <span>{formatSlotTime(slot)}</span>
                                <Badge variant="outline" className="text-xs">
                                  {slot.isRecurring ? 'Recurring' : 'One-time'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    } catch (error) {
                      console.error('Error rendering date group:', error, date, slots);
                      return null;
                    }
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No slots configured</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="w-5 h-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Setup Time:</span>
                <span className="font-medium">~2 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ready for Bookings:</span>
                <span className="font-medium text-green-600">Yes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Configuration Complete:</span>
                <span className="font-medium text-green-600">100%</span>
              </div>
              <Separator />
              <div className="text-xs text-gray-500 text-center">
                Next: Generate your unique booking link
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t">
        <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        <Button onClick={onNext} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
          Generate Booking Link
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default PreviewStep;
