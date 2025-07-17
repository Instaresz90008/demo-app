
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Clock, Users, DollarSign, Info, Calculator, 
  ArrowRight, ArrowLeft, TrendingUp, AlertCircle 
} from 'lucide-react';
import { updateServiceDetails, nextStep, previousStep } from '@/store/slices/onboardingSlice';

const VisualConfiguratorStep: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(state => state.onboarding);
  const [localDetails, setLocalDetails] = useState(data.serviceDetails);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Industry benchmarks based on booking type
  const benchmarks = {
    'one-to-one': { min: 500, max: 2000, avg: 1000 },
    'group': { min: 200, max: 500, avg: 300 },
    'webinar': { min: 99, max: 299, avg: 199 }
  };

  const currentBenchmark = benchmarks[data.bookingType || 'one-to-one'];

  useEffect(() => {
    setLocalDetails(data.serviceDetails);
  }, [data.serviceDetails]);

  const handleInputChange = (field: string, value: any) => {
    const updated = { ...localDetails, [field]: value };
    setLocalDetails(updated);
    dispatch(updateServiceDetails({ [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const calculateEarnings = () => {
    const price = localDetails.price || 0;
    const participants = data.pricingModel === 'per-person' ? localDetails.maxParticipants : 1;
    return price * participants;
  };

  const validateAndContinue = () => {
    const newErrors: Record<string, string> = {};

    if (!localDetails.name.trim()) {
      newErrors.name = 'Service name is required';
    }
    if (!localDetails.price || localDetails.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (!localDetails.duration || localDetails.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      dispatch(nextStep());
    }
  };

  const getPricingLabel = () => {
    if (data.pricingModel === 'per-person') return 'Price per person';
    if (data.pricingModel === 'donation') return 'Suggested donation';
    return 'Price per session';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold mb-3">Configure Your Service</h2>
        <p className="text-muted-foreground text-lg">
          Fine-tune the details and see your earnings potential
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2 text-primary" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Name */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Label htmlFor="serviceName">Service Name *</Label>
                <Input
                  id="serviceName"
                  value={localDetails.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Business Strategy Session"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={localDetails.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of what you offer..."
                  rows={3}
                />
              </motion.div>

              {/* Duration */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Label htmlFor="duration">Session Duration (minutes) *</Label>
                <div className="space-y-3">
                  <Slider
                    value={[localDetails.duration]}
                    onValueChange={([value]) => handleInputChange('duration', value)}
                    max={180}
                    min={15}
                    step={15}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>15 min</span>
                    <Badge variant="outline" className="font-medium">
                      <Clock className="w-3 h-3 mr-1" />
                      {localDetails.duration} minutes
                    </Badge>
                    <span>3 hours</span>
                  </div>
                </div>
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.duration}
                  </p>
                )}
              </motion.div>

              {/* Price */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Label htmlFor="price">{getPricingLabel()} *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    value={localDetails.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className={`pl-10 ${errors.price ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.price}
                  </p>
                )}
                
                {/* Price Benchmark */}
                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span className="font-medium">Industry Benchmark:</span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    Similar {data.bookingType?.replace('-', ' ')} services charge ₹{currentBenchmark.min}–₹{currentBenchmark.max}
                    <br />
                    <span className="font-medium">Average: ₹{currentBenchmark.avg}</span>
                  </p>
                </div>
              </motion.div>

              {/* Max Participants (for group/webinar) */}
              {data.bookingType !== 'one-to-one' && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Label htmlFor="maxParticipants">Maximum Participants</Label>
                  <div className="space-y-3">
                    <Slider
                      value={[localDetails.maxParticipants]}
                      onValueChange={([value]) => handleInputChange('maxParticipants', value)}
                      max={data.bookingType === 'webinar' ? 500 : 50}
                      min={2}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>2 people</span>
                      <Badge variant="outline" className="font-medium">
                        <Users className="w-3 h-3 mr-1" />
                        {localDetails.maxParticipants} max
                      </Badge>
                      <span>{data.bookingType === 'webinar' ? '500' : '50'} people</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Live Preview & Calculations */}
        <div className="space-y-6">
          {/* Earnings Calculator */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-green-700 dark:text-green-300">
                  <Calculator className="w-5 h-5 mr-2" />
                  Earnings Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      ₹{calculateEarnings().toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {data.pricingModel === 'per-person' 
                        ? `With ${localDetails.maxParticipants} participants at ₹${localDetails.price} each`
                        : 'Per session'
                      }
                    </p>
                  </div>

                  {data.pricingModel === 'per-person' && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Price per person:</span>
                        <span className="font-medium">₹{localDetails.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max participants:</span>
                        <span className="font-medium">{localDetails.maxParticipants}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Maximum earnings:</span>
                        <span className="text-green-600">₹{calculateEarnings()}</span>
                      </div>
                    </div>
                  )}

                  {/* Weekly/Monthly Projections */}
                  <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-green-200/50">
                    <h4 className="font-medium text-sm mb-2">Potential Earnings</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>5 sessions/week:</span>
                        <span className="font-medium">₹{(calculateEarnings() * 5).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly (20 sessions):</span>
                        <span className="font-medium text-green-600">₹{(calculateEarnings() * 20).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Service Summary */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Service Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="outline">
                    {data.bookingType?.replace('-', ' ')} + {data.pricingModel?.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{localDetails.duration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pricing:</span>
                  <span className="font-medium">₹{localDetails.price}</span>
                </div>
                {data.bookingType !== 'one-to-one' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max people:</span>
                    <span className="font-medium">{localDetails.maxParticipants}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <h4 className="font-medium text-sm mb-2 text-blue-700 dark:text-blue-300">
                  💡 Pro Tips
                </h4>
                <ul className="space-y-1 text-xs text-blue-600 dark:text-blue-400">
                  <li>• Pricing too low? You might be undervaluing yourself</li>
                  <li>• Add a service description to boost bookings</li>
                  <li>• 60-90 min sessions often have higher perceived value</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex justify-between mt-8"
      >
        <Button
          variant="outline"
          onClick={() => dispatch(previousStep())}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Templates
        </Button>

        <Button
          onClick={validateAndContinue}
          className="flex items-center bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          Preview & Confirm
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
};

export default VisualConfiguratorStep;
