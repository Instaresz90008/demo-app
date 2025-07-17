
import React from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Eye, Clock, Users, DollarSign, Calendar, 
  ArrowRight, ArrowLeft, Edit, ExternalLink, Bot, 
  Shield, Star, CheckCircle, AlertTriangle, User,
  Camera, FileText, Award, Globe, MapPin, Phone
} from 'lucide-react';
import { nextStep, previousStep, completeOnboarding } from '@/store/slices/onboardingSlice';

const ConfirmationPreviewStep: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector(state => state.onboarding);

  const handleLaunchService = () => {
    dispatch(completeOnboarding(data));
  };

  const calculateEarnings = () => {
    const price = data.serviceDetails.price || 0;
    const participants = data.pricingModel === 'per-person' ? data.serviceDetails.maxParticipants : 1;
    return price * participants;
  };

  const getBookingTypeLabel = () => {
    switch (data.bookingType) {
      case 'one-to-one': return 'One-on-One Session';
      case 'group': return 'Group Session';
      case 'webinar': return 'Webinar-Style Event';
      default: return 'Service';
    }
  };

  const getPricingModelLabel = () => {
    switch (data.pricingModel) {
      case 'per-session': return 'Per Session';
      case 'per-person': return 'Per Person';
      case 'donation': return 'Donation Based';
      default: return 'Custom';
    }
  };

  // Calculate profile completion
  const getProfileCompletion = () => {
    let completedItems = 0;
    const totalItems = 8;
    
    if (data.serviceDetails.name) completedItems++;
    if (data.serviceDetails.description) completedItems++;
    if (data.serviceDetails.price > 0) completedItems++;
    if (data.serviceDetails.duration > 0) completedItems++;
    if (data.serviceDetails.slots && data.serviceDetails.slots.length > 0) completedItems++;
    // Missing items that should be collected
    // if (data.profilePhoto) completedItems++;
    // if (data.bio) completedItems++;
    // if (data.credentials) completedItems++;
    
    return Math.round((completedItems / totalItems) * 100);
  };

  const profileCompletion = getProfileCompletion();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold mb-3">Almost Ready to Launch! 🚀</h2>
        <p className="text-muted-foreground text-lg">
          Review your service and complete your profile to build trust with clients
        </p>
      </motion.div>

      {/* Profile Completion Alert */}
      {profileCompletion < 80 && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-6"
        >
          <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <strong>Profile Incomplete ({profileCompletion}%)</strong> - Complete your profile to increase bookings by up to 70%. 
              Clients are more likely to book when they can see who they're working with.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Service & Profile */}
        <div className="space-y-6">
          {/* Profile Trust Score */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Card className={profileCompletion >= 80 ? "border-green-200 bg-green-50/50 dark:bg-green-900/10" : "border-amber-200 bg-amber-50/50 dark:bg-amber-900/10"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className={`w-5 h-5 ${profileCompletion >= 80 ? "text-green-600" : "text-amber-600"}`} />
                  Trust & Credibility Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Profile Completion</span>
                  <span className={`text-sm font-bold ${profileCompletion >= 80 ? "text-green-600" : "text-amber-600"}`}>
                    {profileCompletion}%
                  </span>
                </div>
                <Progress value={profileCompletion} className="h-2" />
                
                <div className="space-y-2 text-sm">
                  {/* Completed Items */}
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Service details configured</span>
                  </div>
                  {data.serviceDetails.slots && data.serviceDetails.slots.length > 0 && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Availability slots created</span>
                    </div>
                  )}
                  
                  {/* Missing Items */}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Camera className="w-4 h-4" />
                    <span>Profile photo (increases bookings by 42%)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span>Professional bio</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Award className="w-4 h-4" />
                    <span>Credentials & certifications</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Location & contact info</span>
                  </div>
                </div>

                {profileCompletion < 80 && (
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    <User className="w-4 h-4 mr-2" />
                    Complete Profile Later
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Service Configuration */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Edit className="w-5 h-5 mr-2 text-primary" />
                    Service Configuration
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dispatch(previousStep())}
                    className="text-primary hover:text-primary/80"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Service Name */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Service Name</label>
                  <p className="text-lg font-semibold">{data.serviceDetails.name}</p>
                </div>

                {/* Description */}
                {data.serviceDetails.description && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="text-sm">{data.serviceDetails.description}</p>
                  </div>
                )}

                {/* Configuration Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Service Type
                    </label>
                    <Badge variant="outline" className="w-fit">
                      {getBookingTypeLabel()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Pricing Model
                    </label>
                    <Badge variant="outline" className="w-fit">
                      {getPricingModelLabel()}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Duration
                    </label>
                    <div className="flex items-center text-sm font-medium">
                      <Clock className="w-4 h-4 mr-1 text-blue-500" />
                      {data.serviceDetails.duration} minutes
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Price
                    </label>
                    <div className="flex items-center text-sm font-medium">
                      <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                      ₹{data.serviceDetails.price}
                      {data.pricingModel === 'per-person' && '/person'}
                    </div>
                  </div>

                  {data.bookingType !== 'one-to-one' && (
                    <div className="space-y-1 col-span-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Maximum Participants
                      </label>
                      <div className="flex items-center text-sm font-medium">
                        <Users className="w-4 h-4 mr-1 text-purple-500" />
                        {data.serviceDetails.maxParticipants} people
                      </div>
                    </div>
                  )}

                  {data.serviceDetails.slots && (
                    <div className="space-y-1 col-span-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Available Slots
                      </label>
                      <div className="flex items-center text-sm font-medium">
                        <Calendar className="w-4 h-4 mr-1 text-indigo-500" />
                        {data.serviceDetails.slots.length} time slots created
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Earnings Summary */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
                    Estimated Earning Range
                  </h3>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    ₹{calculateEarnings().toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {data.pricingModel === 'per-person' ? 'at full capacity' : 'per session'}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-black/20 rounded">
                    <span>Weekly potential (5 sessions):</span>
                    <span className="font-semibold">₹{(calculateEarnings() * 5).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-black/20 rounded">
                    <span>Monthly potential (20 sessions):</span>
                    <span className="font-semibold text-green-600">₹{(calculateEarnings() * 20).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Preview & Trust Signals */}
        <div className="space-y-6">
          {/* Booking Preview */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-primary" />
                  Public Booking Preview
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  This is how your service will appear to clients
                </p>
              </CardHeader>
              <CardContent>
                {/* Mock Booking Page */}
                <div className="border rounded-lg p-4 bg-gradient-to-br from-background to-muted/20">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">{data.serviceDetails.name}</h3>
                    {data.serviceDetails.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {data.serviceDetails.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {data.serviceDetails.duration} min
                      </Badge>
                      
                      <Badge variant="secondary" className="text-xs">
                        <DollarSign className="w-3 h-3 mr-1" />
                        ₹{data.serviceDetails.price}
                        {data.pricingModel === 'per-person' && '/person'}
                      </Badge>
                      
                      {data.bookingType !== 'one-to-one' && (
                        <Badge variant="secondary" className="text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          Max {data.serviceDetails.maxParticipants}
                        </Badge>
                      )}
                    </div>

                    {/* Trust Indicators */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm font-medium">Trust & Safety</span>
                      </div>
                      <div className="space-y-1 text-xs text-blue-600 dark:text-blue-400">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified service provider</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-3 h-3 fill-current" />
                          <span>New provider - be their first review!</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-3 h-3" />
                          <span>Secure booking platform</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mock Calendar */}
                  <div className="bg-card border rounded p-3 mb-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Available Times
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {['Tomorrow 2:00 PM', 'Tomorrow 4:00 PM', 'Dec 15 10:00 AM', 'Dec 15 2:00 PM'].map((time, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="text-xs h-8"
                          disabled={i === 1}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" disabled>
                    Book This Session
                  </Button>
                </div>

                <div className="mt-4 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs flex items-center"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Preview Full Booking Page
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* JusBot Trust Assessment */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-primary mb-1">JusBot Trust Analysis:</p>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>
                        "Your {getBookingTypeLabel().toLowerCase()} looks professional with competitive pricing. 
                        However, to maximize bookings:"
                      </p>
                      <ul className="space-y-1 ml-4">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5">⚠️</span>
                          <span>Add a profile photo (increases bookings by 42%)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5">⚠️</span>
                          <span>Write a brief bio about your expertise</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5">⚠️</span>
                          <span>Add credentials to build trust</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✅</span>
                          <span>Pricing is competitive for your service type</span>
                        </li>
                      </ul>
                      <p className="text-primary font-medium">
                        Complete your profile after launch to boost conversion rates! 🎯
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Enhancement CTA */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200">
              <CardContent className="pt-6 text-center">
                <div className="mb-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300">
                    Complete Your Profile Later
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  You can launch now and enhance your profile anytime from your dashboard to increase bookings
                </p>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  Profile Enhancement Available
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="flex justify-between items-center mt-8"
      >
        <Button
          variant="outline"
          onClick={() => dispatch(previousStep())}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Edit Settings
        </Button>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            className="flex items-center"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Preview Link
          </Button>
          
          <Button
            onClick={handleLaunchService}
            disabled={loading}
            className="flex items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 h-auto"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Launching...
              </>
            ) : (
              <>
                🚀 Launch My Service
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmationPreviewStep;
