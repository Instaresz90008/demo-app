
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, Clock, Users, DollarSign, Calendar, 
  ArrowRight, ArrowLeft, Edit, ExternalLink, Bot, 
  Shield, Star, Eye, Share2, Rocket, Zap,
  Video, Phone, MapPin, Bell, Settings2
} from 'lucide-react';
import { BookingType, PricingModel } from '@/types/smartService';

interface ServiceSummaryStepProps {
  bookingType: BookingType;
  pricingModel: PricingModel;
  serviceConfig: any;
  availabilityData: any;
  advancedConfig: any;
  onSubmit: () => void;
  onBack: () => void;
  onEdit: (step: string) => void;
}

const ServiceSummaryStep: React.FC<ServiceSummaryStepProps> = ({
  bookingType,
  pricingModel,
  serviceConfig,
  availabilityData,
  advancedConfig,
  onSubmit,
  onBack,
  onEdit
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    onSubmit();
  };

  const calculateCompletionScore = () => {
    let score = 0;
    const maxScore = 100;
    
    // Basic service config (40 points)
    if (serviceConfig.name) score += 10;
    if (serviceConfig.description) score += 10;
    if (serviceConfig.duration > 0) score += 10;
    if (serviceConfig.price > 0) score += 10;
    
    // Availability (30 points)
    if (availabilityData?.slots?.length > 0) score += 30;
    
    // Advanced config (30 points)
    if (advancedConfig.bufferTime) score += 5;
    if (advancedConfig.autoConfirm !== undefined) score += 5;
    if (advancedConfig.reminderSettings?.email) score += 5;
    if (advancedConfig.meetingPreferences?.video || advancedConfig.meetingPreferences?.phone) score += 5;
    if (advancedConfig.cancellationPolicy) score += 5;
    if (advancedConfig.loyaltyProgram?.enabled) score += 5;
    
    return Math.min(score, maxScore);
  };

  const completionScore = calculateCompletionScore();

  const estimateEarnings = () => {
    const price = serviceConfig.price || 0;
    const capacity = serviceConfig.capacity || 1;
    const slots = availabilityData?.slots?.length || 0;
    
    return {
      perSession: price * capacity,
      weekly: price * capacity * Math.min(slots, 35), // Max 5 sessions per day
      monthly: price * capacity * Math.min(slots * 4, 140)
    };
  };

  const earnings = estimateEarnings();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Service Ready to Launch! 🚀</h1>
            <p className="text-muted-foreground text-lg">Review your configuration and publish your service</p>
          </div>
        </div>

        {/* Completion Score */}
        <Card className={`w-fit mx-auto ${completionScore >= 80 ? 'border-green-200 bg-green-50/50' : 'border-amber-200 bg-amber-50/50'}`}>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${completionScore >= 80 ? 'text-green-600' : 'text-amber-600'}`}>
                  {completionScore}%
                </div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
              <div className="flex-1 min-w-32">
                <Progress value={completionScore} className="h-2" />
              </div>
              <Badge variant={completionScore >= 80 ? 'default' : 'secondary'}>
                {completionScore >= 80 ? 'Ready to Launch' : 'Almost Ready'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-primary" />
                    Service Overview
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => onEdit('service-setup')}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{serviceConfig.name}</h3>
                  <p className="text-muted-foreground mt-1">{serviceConfig.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Badge variant="outline">{bookingType.icon}</Badge>
                    <div className="text-sm">
                      <div className="font-medium">{bookingType.name}</div>
                      <div className="text-muted-foreground text-xs">Type</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <div className="text-sm">
                      <div className="font-medium">${serviceConfig.price}</div>
                      <div className="text-muted-foreground text-xs">{pricingModel.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <div className="text-sm">
                      <div className="font-medium">{serviceConfig.duration} min</div>
                      <div className="text-muted-foreground text-xs">Duration</div>
                    </div>
                  </div>

                  {serviceConfig.capacity && (
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <Users className="h-4 w-4 text-purple-500" />
                      <div className="text-sm">
                        <div className="font-medium">{serviceConfig.capacity}</div>
                        <div className="text-muted-foreground text-xs">Max capacity</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Availability Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-500" />
                    Availability
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => onEdit('availability')}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Available time slots</span>
                  <Badge variant="secondary">
                    {availabilityData?.slots?.length || 0} slots configured
                  </Badge>
                </div>
                
                {availabilityData?.slots?.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availabilityData.slots.slice(0, 6).map((slot: any, index: number) => (
                      <div key={index} className="p-2 bg-primary/5 border border-primary/20 rounded text-xs text-center">
                        {new Date(slot.date).toLocaleDateString()} {slot.startTime}
                      </div>
                    ))}
                    {availabilityData.slots.length > 6 && (
                      <div className="p-2 bg-muted rounded text-xs text-center text-muted-foreground">
                        +{availabilityData.slots.length - 6} more
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No availability slots configured</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Advanced Settings Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Advanced Configuration
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => onEdit('advanced')}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>{advancedConfig.bufferTime || 15}min buffer</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>{advancedConfig.autoConfirm ? 'Auto-confirm' : 'Manual approval'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-purple-500" />
                    <span>
                      {advancedConfig.reminderSettings?.email ? 'Email' : ''}
                      {advancedConfig.reminderSettings?.email && advancedConfig.reminderSettings?.sms ? ' & ' : ''}
                      {advancedConfig.reminderSettings?.sms ? 'SMS' : ''}
                      {!advancedConfig.reminderSettings?.email && !advancedConfig.reminderSettings?.sms ? 'No' : ''} reminders
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {advancedConfig.meetingPreferences?.video && <Video className="h-4 w-4 text-indigo-500" />}
                    {advancedConfig.meetingPreferences?.phone && <Phone className="h-4 w-4 text-green-500" />}
                    {advancedConfig.meetingPreferences?.inPerson && <MapPin className="h-4 w-4 text-red-500" />}
                    <span>Meeting options</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span>{advancedConfig.requireDeposit ? `${advancedConfig.depositAmount}% deposit` : 'No deposit'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{advancedConfig.loyaltyProgram?.enabled ? 'Loyalty program' : 'No loyalty program'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Earnings Forecast */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <DollarSign className="h-5 w-5" />
                  Earnings Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">${earnings.perSession}</div>
                  <div className="text-sm text-muted-foreground">per session</div>
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Weekly potential:</span>
                    <span className="font-semibold">${earnings.weekly.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly potential:</span>
                    <span className="font-semibold text-green-600">${earnings.monthly.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Bot className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {completionScore < 80 && (
                  <div className="flex items-start gap-2 p-2 bg-amber-50 rounded border border-amber-200">
                    <div className="text-amber-500 mt-0.5">⚠️</div>
                    <div>
                      <strong>Complete your setup:</strong> Add more availability slots to maximize bookings
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-2 p-2 bg-green-50 rounded border border-green-200">
                  <div className="text-green-500 mt-0.5">✅</div>
                  <div>
                    <strong>Competitive pricing:</strong> Your ${serviceConfig.price} rate is market-appropriate
                  </div>
                </div>
                
                {!advancedConfig.loyaltyProgram?.enabled && (
                  <div className="flex items-start gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                    <div className="text-blue-500 mt-0.5">💡</div>
                    <div>
                      <strong>Boost retention:</strong> Enable loyalty program to increase repeat bookings
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => onEdit('service-setup')}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Booking Page
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Share2 className="h-4 w-4 mr-2" />
                  Get Shareable Link
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Test Booking Flow
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex justify-between items-center pt-6"
      >
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Configuration
        </Button>
        
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 h-auto"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Publishing Service...
            </>
          ) : (
            <>
              <Rocket className="h-5 w-5" />
              Publish Service
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default ServiceSummaryStep;
