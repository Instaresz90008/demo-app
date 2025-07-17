
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateServiceDetails } from '@/store/slices/onboardingSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  ArrowRight, 
  Link2, 
  Copy, 
  ExternalLink,
  Globe,
  User,
  Clock,
  Settings,
  Sparkles,
  CheckCircle,
  Eye
} from 'lucide-react';

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

interface UserBookingInfo {
  firstName: string;
  lastName: string;
  email: string;
  timezone: string;
  phone?: string;
  company?: string;
}

const BookingLinkStep: React.FC<Props> = ({ onNext, onPrevious }) => {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(state => state.onboarding);
  const { toast } = useToast();
  
  const [userInfo, setUserInfo] = useState<UserBookingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    phone: '',
    company: ''
  });
  
  const [bookingLink, setBookingLink] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(false);

  // Common timezones for quick selection
  const commonTimezones = [
    'America/New_York',
    'America/Chicago', 
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney',
    'Pacific/Auckland'
  ];

  const generateBookingLink = async () => {
    if (!userInfo.firstName || !userInfo.lastName || !userInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate link generation with service details
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate unique link based on service name and user info
    const serviceName = data.serviceDetails.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'service';
    const userHash = btoa(`${userInfo.firstName}-${userInfo.lastName}`).slice(0, 8);
    const timeStamp = Date.now().toString().slice(-6);
    const generatedLink = `${serviceName}-${userHash}-${timeStamp}`;
    
    setBookingLink(generatedLink);
    
    // Save the booking configuration to Redux
    dispatch(updateServiceDetails({
      bookingLink: generatedLink,
      hostInfo: userInfo,
      linkGeneratedAt: new Date().toISOString(),
      publicBookingConfig: {
        serviceName: data.serviceDetails.name,
        duration: data.serviceDetails.duration,
        price: data.serviceDetails.price,
        maxParticipants: data.serviceDetails.maxParticipants,
        category: data.serviceDetails.category,
        description: data.serviceDetails.description,
        bookingType: data.bookingType,
        pricingModel: data.pricingModel,
        slots: data.serviceDetails.slots,
        hostTimezone: userInfo.timezone,
        hostInfo: {
          name: `${userInfo.firstName} ${userInfo.lastName}`,
          email: userInfo.email,
          company: userInfo.company
        }
      }
    }));
    
    setIsGenerating(false);
    setLinkGenerated(true);
    
    toast({
      title: "Booking Link Generated! 🎉",
      description: "Your unique booking link is ready to share",
    });
  };

  const copyLink = async () => {
    const fullUrl = `${window.location.origin}/public-booking/${bookingLink}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast({
        title: "Link Copied! 📋",
        description: "Booking link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the link manually",
        variant: "destructive"
      });
    }
  };

  const previewBooking = () => {
    const fullUrl = `${window.location.origin}/public-booking/${bookingLink}`;
    window.open(fullUrl, '_blank');
  };

  const handleInputChange = (field: keyof UserBookingInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Link2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Generate Booking Link
            </h2>
            <p className="text-lg text-gray-600">Create your unique public booking link</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Information Form */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Host Information
            </CardTitle>
            <p className="text-sm text-gray-600">This information will be visible to your clients</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={userInfo.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="John"
                  disabled={linkGenerated}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={userInfo.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Doe"
                  disabled={linkGenerated}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@example.com"
                disabled={linkGenerated}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={userInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                disabled={linkGenerated}
              />
            </div>

            <div>
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                id="company"
                value={userInfo.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Acme Corp"
                disabled={linkGenerated}
              />
            </div>

            <div>
              <Label htmlFor="timezone">Timezone *</Label>
              <Select 
                value={userInfo.timezone} 
                onValueChange={(value) => handleInputChange('timezone', value)}
                disabled={linkGenerated}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {commonTimezones.map(tz => (
                    <SelectItem key={tz} value={tz}>
                      {tz.replace('_', ' ')} ({new Date().toLocaleTimeString([], { 
                        timeZone: tz, 
                        timeZoneName: 'short' 
                      }).split(' ')[1]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!linkGenerated && (
              <Button 
                onClick={generateBookingLink} 
                disabled={isGenerating || !userInfo.firstName || !userInfo.lastName || !userInfo.email}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                    Generating Link...
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 mr-2" />
                    Generate Booking Link
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Service Summary & Generated Link */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Service Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{data.serviceDetails.name}</span>
                <Badge variant="secondary">{data.bookingType?.replace('-', ' ')}</Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Duration</p>
                  <p className="font-medium">{data.serviceDetails.duration} minutes</p>
                </div>
                <div>
                  <p className="text-gray-600">Price</p>
                  <p className="font-medium">${data.serviceDetails.price}</p>
                </div>
                <div>
                  <p className="text-gray-600">Capacity</p>
                  <p className="font-medium">{data.serviceDetails.maxParticipants} people</p>
                </div>
                <div>
                  <p className="text-gray-600">Slots</p>
                  <p className="font-medium">{data.serviceDetails.slots?.length || 0} available</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {linkGenerated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    Booking Link Generated!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-green-700">Your Public Booking Link</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={`${window.location.origin}/public-booking/${bookingLink}`}
                        readOnly
                        className="bg-white font-mono text-xs"
                      />
                      <Button onClick={copyLink} variant="outline" size="icon">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={previewBooking} variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button onClick={copyLink} variant="outline" className="flex-1">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  <div className="text-xs text-green-700 bg-white p-3 rounded border">
                    <p className="font-medium mb-1">Link Configuration:</p>
                    <p>• Host: {userInfo.firstName} {userInfo.lastName}</p>
                    <p>• Timezone: {userInfo.timezone}</p>
                    <p>• Generated: {new Date().toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t">
        <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!linkGenerated}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          Complete Setup
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default BookingLinkStep;
