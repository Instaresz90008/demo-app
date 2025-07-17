
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Copy, ExternalLink, CheckCircle, Star, Calendar, DollarSign, Users, ArrowRight } from 'lucide-react';
import { OnboardingData } from '@/store/slices/onboarding/types';

interface Props {
  values: OnboardingData;
  onComplete: () => void;
  onPrevious: () => void;
}

const CompletionStep: React.FC<Props> = ({ values, onComplete, onPrevious }) => {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector(state => state.onboarding);

  // Generate the booking link
  const serviceId = data.createdServiceId || `service-${Date.now()}`;
  const bookingLink = `${window.location.origin}/book/${serviceId}`;
  
  const embedCode = `<iframe src="${bookingLink}" width="100%" height="600" frameborder="0" style="border-radius: 8px;"></iframe>`;

  useEffect(() => {
    // Sync the created service to managed services
    syncServiceToManaged();
  }, []);

  const syncServiceToManaged = () => {
    try {
      // Create the service object for managed services
      const serviceData = {
        id: serviceId,
        name: data.serviceDetails.name,
        description: data.serviceDetails.description,
        duration: data.serviceDetails.duration,
        price: data.serviceDetails.price,
        maxParticipants: data.serviceDetails.maxParticipants,
        category: data.serviceDetails.category,
        bookingType: data.bookingType,
        pricingModel: data.pricingModel,
        slots: data.serviceDetails.slots || [],
        provider: data.providerInfo || {
          name: 'Service Provider',
          email: '',
          phone: '',
          timezone: 'America/New_York',
          bio: 'Professional service provider',
          website: ''
        },
        bookingLink,
        embedCode,
        isActive: true,
        createdAt: new Date().toISOString(),
        stats: {
          totalBookings: 0,
          totalRevenue: 0,
          averageRating: 0
        }
      };

      // Save to managed services
      const existingManagedServices = JSON.parse(localStorage.getItem('managed-services') || '[]');
      const updatedManagedServices = [...existingManagedServices.filter((s: any) => s.id !== serviceData.id), serviceData];
      localStorage.setItem('managed-services', JSON.stringify(updatedManagedServices));

      // Also save to onboarding services for backward compatibility
      const existingOnboardingServices = JSON.parse(localStorage.getItem('onboarding-services') || '[]');
      const updatedOnboardingServices = [...existingOnboardingServices.filter((s: any) => s.id !== serviceData.id), serviceData];
      localStorage.setItem('onboarding-services', JSON.stringify(updatedOnboardingServices));

      // Save booking link separately
      const bookingLinkData = {
        id: serviceId,
        serviceName: data.serviceDetails.name,
        bookingUrl: bookingLink,
        embedCode,
        createdAt: new Date().toISOString(),
        isActive: true,
        clicks: 0,
        conversions: 0
      };

      const existingBookingLinks = JSON.parse(localStorage.getItem('booking-links') || '[]');
      const updatedBookingLinks = [...existingBookingLinks.filter((l: any) => l.id !== bookingLinkData.id), bookingLinkData];
      localStorage.setItem('booking-links', JSON.stringify(updatedBookingLinks));

      console.log('Service synced to managed services:', serviceData);
      console.log('Booking link saved:', bookingLinkData);
      toast.success('Service successfully added to your portfolio!');
    } catch (error) {
      console.error('Error syncing service:', error);
      toast.error('Failed to sync service to portfolio');
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} copied to clipboard!`);
    });
  };

  const handlePreviewBooking = () => {
    window.open(bookingLink, '_blank');
  };

  const getServiceIcon = () => {
    switch (data.bookingType) {
      case 'one-to-one': return <Users className="w-8 h-8" />;
      case 'group': return <Users className="w-8 h-8" />;
      case 'webinar': return <Calendar className="w-8 h-8" />;
      default: return <Calendar className="w-8 h-8" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4">🎉 Congratulations!</h1>
        <p className="text-xl text-muted-foreground mb-2">
          Your service <span className="font-semibold text-primary">"{data.serviceDetails.name}"</span> is now live!
        </p>
        <p className="text-muted-foreground">
          Share your booking link with clients and start accepting appointments immediately.
        </p>
      </motion.div>

      {/* Service Summary Card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Card className="border-2 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {getServiceIcon()}
              </div>
              <div>
                <h3 className="text-xl">{data.serviceDetails.name}</h3>
                <Badge variant="outline" className="capitalize mt-1">
                  {data.bookingType?.replace('-', ' ')} • {data.pricingModel?.replace('-', ' ')}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-lg">${data.serviceDetails.price}</div>
                <div className="text-sm text-blue-600">per session</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="font-semibold text-lg">{data.serviceDetails.duration}min</div>
                <div className="text-sm text-green-600">duration</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="font-semibold text-lg">{data.serviceDetails.maxParticipants}</div>
                <div className="text-sm text-purple-600">max capacity</div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Available Slots:</strong> {data.serviceDetails.slots?.length || 0}</p>
                <p><strong>Category:</strong> {data.serviceDetails.category}</p>
              </div>
              <div>
                <p><strong>Provider:</strong> {data.providerInfo ? `${data.providerInfo.firstName} ${data.providerInfo.lastName}` : 'Service Provider'}</p>
                <p><strong>Status:</strong> <Badge variant="secondary" className="text-xs">Active & Synced</Badge></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Booking Link Section */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Your Public Booking Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <input
                type="text"
                value={bookingLink}
                readOnly
                className="flex-1 bg-transparent border-none outline-none text-sm"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(bookingLink, 'Booking link')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handlePreviewBooking} className="flex-1">
                <ExternalLink className="w-4 h-4 mr-2" />
                Preview Booking Page
              </Button>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(bookingLink, 'Booking link')}
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Embed Code Section */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Embed on Your Website</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Copy this code to embed the booking widget directly on your website:
            </p>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                <code>{embedCode}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(embedCode, 'Embed code')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Success Stats */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-green-600">✅</div>
          <div className="font-semibold">Service Published</div>
          <div className="text-xs text-muted-foreground">Ready for bookings</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-blue-600">🔗</div>
          <div className="font-semibold">Link Generated</div>
          <div className="text-xs text-muted-foreground">Synced to Manage Services</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-purple-600">📊</div>
          <div className="font-semibold">Analytics Ready</div>
          <div className="text-xs text-muted-foreground">Track performance</div>
        </Card>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="flex justify-between items-center pt-6"
      >
        <Button variant="outline" onClick={onPrevious}>
          Back to Preview
        </Button>
        <Button onClick={onComplete} size="lg" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
          Complete Setup
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
};

export default CompletionStep;
