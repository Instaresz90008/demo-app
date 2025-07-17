
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  ArrowLeft,
  Globe,
  MapPin,
  Video
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface BookingSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isRecurring: boolean;
}

interface ServiceConfig {
  id: string;
  serviceName: string;
  duration: number;
  price: number;
  maxParticipants: number;
  category: string;
  description: string;
  bookingType: string;
  pricingModel: string;
  slots: BookingSlot[];
  hostTimezone: string;
  hostInfo: {
    name: string;
    email: string;
    company?: string;
  };
}

interface BookingFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  selectedSlot: string;
  participants: number;
  notes: string;
}

const PublicBookingInterface: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  
  const [serviceConfig, setServiceConfig] = useState<ServiceConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<BookingFormData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    selectedSlot: '',
    participants: 1,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  useEffect(() => {
    loadServiceConfig();
  }, [serviceId]);

  const loadServiceConfig = async () => {
    setLoading(true);
    
    try {
      // Try to load from localStorage first (onboarding services)
      let services = [];
      const onboardingServices = localStorage.getItem('onboarding-services');
      const managedServices = localStorage.getItem('managed-services');
      
      if (onboardingServices) {
        services = [...services, ...JSON.parse(onboardingServices)];
      }
      if (managedServices) {
        services = [...services, ...JSON.parse(managedServices)];
      }

      const service = services.find((s: any) => s.id === serviceId || s.createdServiceId === serviceId);
      
      if (service) {
        const config: ServiceConfig = {
          id: service.id || service.createdServiceId,
          serviceName: service.name || service.serviceDetails?.name || 'Service',
          duration: service.duration || service.serviceDetails?.duration || 60,
          price: service.price || service.serviceDetails?.price || 100,
          maxParticipants: service.maxParticipants || service.serviceDetails?.maxParticipants || 1,
          category: service.category || service.serviceDetails?.category || 'consultation',
          description: service.description || service.serviceDetails?.description || 'Professional service consultation',
          bookingType: service.bookingType || 'one-to-one',
          pricingModel: service.pricingModel || 'per-session',
          slots: (service.slots || service.serviceDetails?.slots || []).map((slot: any) => ({
            id: slot.id,
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isAvailable: true,
            isRecurring: slot.isRecurring || false
          })),
          hostTimezone: service.hostTimezone || 'America/New_York',
          hostInfo: {
            name: service.provider?.name || service.providerInfo?.firstName + ' ' + service.providerInfo?.lastName || 'Service Provider',
            email: service.provider?.email || service.providerInfo?.email || 'provider@example.com',
            company: service.provider?.company || 'Professional Services'
          }
        };
        
        setServiceConfig(config);
      } else {
        // Fallback mock service
        setServiceConfig({
          id: serviceId || 'demo',
          serviceName: "Business Strategy Consultation",
          duration: 60,
          price: 150,
          maxParticipants: 1,
          category: "consulting",
          description: "Get expert guidance on your business strategy and growth plans. We'll discuss your challenges, opportunities, and create actionable next steps.",
          bookingType: "one-to-one",
          pricingModel: "per-session",
          slots: [
            {
              id: "1",
              date: format(new Date(Date.now() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
              startTime: "10:00",
              endTime: "11:00",
              isAvailable: true,
              isRecurring: false
            },
            {
              id: "2", 
              date: format(new Date(Date.now() + 48 * 60 * 60 * 1000), 'yyyy-MM-dd'),
              startTime: "14:00",
              endTime: "15:00",
              isAvailable: true,
              isRecurring: false
            }
          ],
          hostTimezone: "America/New_York",
          hostInfo: {
            name: "Professional Consultant",
            email: "consultant@example.com",
            company: "Strategy Consulting LLC"
          }
        });
      }
    } catch (error) {
      console.error('Error loading service config:', error);
      toast.error('Failed to load service information');
    } finally {
      setLoading(false);
    }
  };

  const formatSlotTime = (slot: BookingSlot) => {
    try {
      const date = parseISO(slot.date);
      return {
        date: format(date, 'EEEE, MMMM d, yyyy'),
        time: `${slot.startTime} - ${slot.endTime}`
      };
    } catch (error) {
      return {
        date: slot.date,
        time: `${slot.startTime} - ${slot.endTime}`
      };
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotalPrice = () => {
    if (!serviceConfig) return 0;
    
    if (serviceConfig.pricingModel === 'per-person') {
      return serviceConfig.price * formData.participants;
    }
    return serviceConfig.price;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientName || !formData.clientEmail || !formData.selectedSlot) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate booking submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save booking to localStorage
      const booking = {
        id: `booking-${Date.now()}`,
        serviceId: serviceConfig?.id,
        serviceName: serviceConfig?.serviceName,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        selectedSlot: formData.selectedSlot,
        participants: formData.participants,
        notes: formData.notes,
        totalPrice: calculateTotalPrice(),
        status: 'confirmed',
        bookedAt: new Date().toISOString()
      };
      
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      localStorage.setItem('bookings', JSON.stringify([...existingBookings, booking]));
      
      setBookingComplete(true);
      toast.success('Booking confirmed successfully! 🎉');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <h3 className="text-lg font-semibold">Loading booking page...</h3>
          <p className="text-gray-600">Please wait while we prepare your booking</p>
        </motion.div>
      </div>
    );
  }

  if (!serviceConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Booking Not Found</h3>
            <p className="text-gray-600 mb-4">The booking link you're looking for doesn't exist or has expired.</p>
            <Button onClick={() => window.history.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <Card className="border-2 border-green-200">
            <CardContent className="text-center p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-4">
                Your booking for "{serviceConfig.serviceName}" has been confirmed.
              </p>
              <div className="bg-green-50 p-4 rounded-lg text-sm text-left space-y-2">
                <p><strong>Service:</strong> {serviceConfig.serviceName}</p>
                <p><strong>Host:</strong> {serviceConfig.hostInfo.name}</p>
                <p><strong>Total:</strong> ${calculateTotalPrice()}</p>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Check your email for booking details and meeting information.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {serviceConfig.serviceName}
              </h1>
              <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                <User className="w-4 h-4" />
                <span>with {serviceConfig.hostInfo.name}</span>
                {serviceConfig.hostInfo.company && (
                  <>
                    <span>•</span>
                    <span>{serviceConfig.hostInfo.company}</span>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Service Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    {serviceConfig.description}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-sm font-medium text-blue-700">Duration</p>
                      <p className="text-blue-900 font-semibold">{serviceConfig.duration} min</p>
                    </div>
                    
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <p className="text-sm font-medium text-green-700">Price</p>
                      <p className="text-green-900 font-semibold">
                        ${serviceConfig.price}
                        {serviceConfig.pricingModel === 'per-person' && (
                          <span className="text-xs">/person</span>
                        )}
                      </p>
                    </div>

                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Users className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-sm font-medium text-purple-700">Type</p>
                      <p className="text-purple-900 font-semibold capitalize">
                        {serviceConfig.bookingType.replace('-', ' ')}
                      </p>
                    </div>

                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <Video className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                      <p className="text-sm font-medium text-orange-700">Format</p>
                      <p className="text-orange-900 font-semibold">Online</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Book Your Session
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="clientName">Full Name *</Label>
                        <Input
                          id="clientName"
                          value={formData.clientName}
                          onChange={(e) => handleInputChange('clientName', e.target.value)}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientEmail">Email *</Label>
                        <Input
                          id="clientEmail"
                          type="email"
                          value={formData.clientEmail}
                          onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="clientPhone">Phone (Optional)</Label>
                      <Input
                        id="clientPhone"
                        type="tel"
                        value={formData.clientPhone}
                        onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <Label>Select Time Slot *</Label>
                      <div className="grid gap-2 mt-2">
                        {serviceConfig.slots.filter(slot => slot.isAvailable).map(slot => {
                          const { date, time } = formatSlotTime(slot);
                          return (
                            <label key={slot.id} className="cursor-pointer">
                              <div className={`p-3 border rounded-lg transition-colors ${
                                formData.selectedSlot === slot.id 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}>
                                <input
                                  type="radio"
                                  name="selectedSlot"
                                  value={slot.id}
                                  checked={formData.selectedSlot === slot.id}
                                  onChange={(e) => handleInputChange('selectedSlot', e.target.value)}
                                  className="sr-only"
                                />
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">{date}</p>
                                    <p className="text-sm text-gray-600">{time}</p>
                                  </div>
                                  <Badge variant={formData.selectedSlot === slot.id ? 'default' : 'outline'}>
                                    Available
                                  </Badge>
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {serviceConfig.pricingModel === 'per-person' && serviceConfig.maxParticipants > 1 && (
                      <div>
                        <Label htmlFor="participants">Number of Participants</Label>
                        <Input
                          id="participants"
                          type="number"
                          min="1"
                          max={serviceConfig.maxParticipants}
                          value={formData.participants}
                          onChange={(e) => handleInputChange('participants', parseInt(e.target.value) || 1)}
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Any specific topics you'd like to discuss or questions you have..."
                        rows={3}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !formData.clientName || !formData.clientEmail || !formData.selectedSlot}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <Calendar className="w-4 h-4" />
                          </motion.div>
                          Confirming Booking...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirm Booking (${calculateTotalPrice()})
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Summary */}
            <div className="space-y-6">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{serviceConfig.serviceName}</h4>
                    <p className="text-sm text-gray-600">with {serviceConfig.hostInfo.name}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{serviceConfig.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price per {serviceConfig.pricingModel === 'per-person' ? 'person' : 'session'}:</span>
                      <span className="font-medium">${serviceConfig.price}</span>
                    </div>
                    {serviceConfig.pricingModel === 'per-person' && formData.participants > 1 && (
                      <div className="flex justify-between">
                        <span>Participants:</span>
                        <span className="font-medium">{formData.participants}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${calculateTotalPrice()}</span>
                  </div>

                  {formData.selectedSlot && (
                    <>
                      <Separator />
                      <div className="text-sm">
                        <p className="font-medium text-gray-900 mb-1">Selected Time:</p>
                        {(() => {
                          const slot = serviceConfig.slots.find(s => s.id === formData.selectedSlot);
                          if (slot) {
                            const { date, time } = formatSlotTime(slot);
                            return (
                              <div className="text-gray-600">
                                <p>{date}</p>
                                <p>{time}</p>
                                <p className="text-xs mt-1">({serviceConfig.hostTimezone})</p>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicBookingInterface;
