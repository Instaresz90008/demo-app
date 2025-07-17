
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign,
  CheckCircle,
  Users,
  Globe,
  Video,
  ArrowRight,
  Star,
  Shield
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ServiceSlot } from '@/store/slices/onboarding/types';

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  timezone: string;
  notes: string;
  selectedSlot: any;
}

const PublicBookingPage: React.FC = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'details' | 'slots' | 'form' | 'confirmation'>('details');
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notes: '',
    selectedSlot: null
  });

  useEffect(() => {
    // Load service data from localStorage or API
    loadServiceData();
  }, [serviceId]);

  const loadServiceData = () => {
    try {
      // First try to get from localStorage (for demo purposes)
      const savedServices = localStorage.getItem('onboarding-services');
      if (savedServices) {
        const services = JSON.parse(savedServices);
        const service = services.find((s: any) => s.id === serviceId);
        if (service) {
          setServiceData(service);
          setLoading(false);
          return;
        }
      }

      // Fallback: Mock service data for demo
      const mockService = {
        id: serviceId,
        name: 'Sample Service',
        description: 'This is a sample service for demonstration purposes.',
        duration: 60,
        price: 100,
        maxParticipants: 1,
        category: 'consultation',
        bookingType: 'one-to-one',
        pricingModel: 'per-session',
        provider: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1 (555) 123-4567',
          timezone: 'America/New_York',
          bio: 'Professional consultant with 10+ years of experience.',
          website: 'https://johndoe.com'
        },
        slots: [
          {
            id: '1',
            date: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
            startTime: '10:00',
            endTime: '11:00'
          },
          {
            id: '2',
            date: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
            startTime: '14:00',
            endTime: '15:00'
          }
        ]
      };
      
      setServiceData(mockService);
      setLoading(false);
    } catch (error) {
      console.error('Error loading service data:', error);
      toast.error('Failed to load service information');
      setLoading(false);
    }
  };

  const handleSlotSelection = (slot: any) => {
    setSelectedSlot(slot);
    setFormData(prev => ({ ...prev, selectedSlot: slot }));
    setStep('form');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }

    try {
      // Here you would typically make an API call to book the appointment
      const bookingData = {
        serviceId,
        slot: selectedSlot,
        customer: formData,
        timestamp: new Date().toISOString()
      };

      // Save booking to localStorage for demo
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      existingBookings.push({
        id: `booking-${Date.now()}`,
        ...bookingData
      });
      localStorage.setItem('bookings', JSON.stringify(existingBookings));

      setStep('confirmation');
      toast.success('Booking confirmed successfully!');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book appointment. Please try again.');
    }
  };

  const groupSlotsByDate = (slots: any[]) => {
    if (!slots) return {};
    
    return slots.reduce((acc, slot) => {
      const date = slot.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(slot);
      return acc;
    }, {} as Record<string, any[]>);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h3 className="text-lg font-semibold">Loading service...</h3>
        </div>
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-6">
            <h3 className="text-lg font-semibold mb-2">Service Not Found</h3>
            <p className="text-muted-foreground mb-4">The requested service could not be found.</p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">{serviceData.name}</h1>
            <p className="text-lg text-muted-foreground mb-6">{serviceData.description}</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {serviceData.duration} minutes
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                ${serviceData.price}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                Max {serviceData.maxParticipants} participants
              </Badge>
            </div>
          </div>

          {/* Provider Info */}
          {serviceData.provider && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Meet Your Provider
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{serviceData.provider.name}</h4>
                    <p className="text-muted-foreground mb-2">{serviceData.provider.bio}</p>
                    <div className="flex gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {serviceData.provider.email}
                      </span>
                      {serviceData.provider.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {serviceData.provider.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step Content */}
          {step === 'details' && (
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">What's Included</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {serviceData.duration}-minute session
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Professional consultation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Follow-up recommendations
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Meeting Details</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Video call via secure platform
                      </p>
                      <p className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        100% confidential
                      </p>
                      <p className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Available in {serviceData.provider?.timezone || 'EST'}
                      </p>
                    </div>
                  </div>
                </div>
                <Separator />
                <Button onClick={() => setStep('slots')} className="w-full" size="lg">
                  Choose Available Time
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 'slots' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Select Your Preferred Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(groupSlotsByDate(serviceData.slots)).length > 0 ? (
                  <div className="space-y-6">
                    {Object.entries(groupSlotsByDate(serviceData.slots)).map(([date, slots]) => (
                      <div key={date} className="space-y-3">
                        <h4 className="font-medium text-lg">
                          {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                        </h4>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                           {(slots as ServiceSlot[]).map((slot) => (
                            <Button
                              key={slot.id}
                              variant="outline"
                              onClick={() => handleSlotSelection(slot)}
                              className="p-4 h-auto flex flex-col items-center justify-center hover:bg-primary hover:text-primary-foreground"
                            >
                              <Clock className="w-4 h-4 mb-1" />
                              <span className="font-medium">
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h4 className="font-medium mb-2">No Available Slots</h4>
                    <p className="text-muted-foreground">Please check back later for available times.</p>
                  </div>
                )}
                <div className="mt-6">
                  <Button variant="outline" onClick={() => setStep('details')} className="w-full">
                    Back to Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 'form' && selectedSlot && (
            <Card>
              <CardHeader>
                <CardTitle>Booking Information</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Selected: {format(parseISO(selectedSlot.date), 'EEEE, MMMM d, yyyy')} at {selectedSlot.startTime} - {selectedSlot.endTime}
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={formData.timezone} onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any specific questions or topics you'd like to discuss?"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Booking Summary</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Service:</strong> {serviceData.name}</p>
                      <p><strong>Date:</strong> {format(parseISO(selectedSlot.date), 'EEEE, MMMM d, yyyy')}</p>
                      <p><strong>Time:</strong> {selectedSlot.startTime} - {selectedSlot.endTime}</p>
                      <p><strong>Duration:</strong> {serviceData.duration} minutes</p>
                      <p><strong>Price:</strong> ${serviceData.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep('slots')} className="flex-1">
                      Back
                    </Button>
                    <Button type="submit" className="flex-1">
                      Confirm Booking
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 'confirmation' && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Booking Confirmed!</h2>
                <p className="text-muted-foreground mb-6">
                  Your appointment has been successfully booked. You'll receive a confirmation email shortly.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg mb-6 text-left max-w-md mx-auto">
                  <h4 className="font-semibold mb-2">Appointment Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Service:</strong> {serviceData.name}</p>
                    <p><strong>Date:</strong> {selectedSlot && format(parseISO(selectedSlot.date), 'EEEE, MMMM d, yyyy')}</p>
                    <p><strong>Time:</strong> {selectedSlot && `${selectedSlot.startTime} - ${selectedSlot.endTime}`}</p>
                    <p><strong>Provider:</strong> {serviceData.provider?.name}</p>
                  </div>
                </div>
                <Button onClick={() => navigate('/')} size="lg">
                  Return Home
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PublicBookingPage;
