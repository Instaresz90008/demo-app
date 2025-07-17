
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { updateServiceDetails, setPricingModel } from '@/store/slices/onboardingSlice';
import { ArrowLeft, ArrowRight, DollarSign, Calculator, TrendingUp, Users, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

interface PricingErrors {
  price?: string;
}

const PricingStep: React.FC<Props> = ({ onNext, onPrevious }) => {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(state => state.onboarding);
  const [errors, setErrors] = useState<PricingErrors>({});
  const [touched, setTouched] = useState(false);

  const validatePrice = (value: number, model: string): string | undefined => {
    if (model === 'donation') return undefined; // Donation can be 0
    
    if (!value || value <= 0) return 'Price must be greater than 0';
    if (value > 10000) return 'Maximum price is $10,000';
    if (value < 1) return 'Minimum price is $1';
    
    // Industry-specific recommendations
    const category = data.serviceDetails.category;
    const duration = data.serviceDetails.duration || 60;
    
    if (category === 'consultation' && value < 50) {
      return 'Professional consultations typically start at $50+';
    }
    if (category === 'coaching' && value < 30) {
      return 'Coaching sessions typically start at $30+';
    }
    if (category === 'therapy' && value < 75) {
      return 'Therapy sessions typically start at $75+';
    }
    
    return undefined;
  };

  const handlePriceChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    dispatch(updateServiceDetails({ price: numValue }));
    setTouched(true);
    
    const error = validatePrice(numValue, data.pricingModel || 'per-session');
    setErrors({ price: error });
  };

  const handlePricingModelChange = (model: 'per-person' | 'per-session' | 'donation') => {
    dispatch(setPricingModel(model));
    
    // Re-validate price with new model
    if (touched) {
      const error = validatePrice(data.serviceDetails.price, model);
      setErrors({ price: error });
    }
  };

  const calculatePotentialEarnings = () => {
    const price = data.serviceDetails.price || 0;
    const maxParticipants = data.serviceDetails.maxParticipants || 1;
    const pricingModel = data.pricingModel || 'per-session';
    
    if (pricingModel === 'per-person') {
      return price * maxParticipants;
    }
    return price;
  };

  const getPricingRecommendation = () => {
    const category = data.serviceDetails.category;
    const duration = data.serviceDetails.duration || 60;
    const maxParticipants = data.serviceDetails.maxParticipants || 1;
    
    const recommendations: Record<string, { min: number; max: number; note: string }> = {
      consultation: { min: 75, max: 250, note: 'Based on professional consulting rates' },
      coaching: { min: 50, max: 150, note: 'Typical coaching session rates' },
      therapy: { min: 100, max: 200, note: 'Professional therapy session rates' },
      training: { min: 40, max: 120, note: 'Training and workshop rates' },
      fitness: { min: 30, max: 80, note: 'Personal training session rates' },
      workshop: { min: 25, max: 100, note: 'Group workshop rates' },
    };
    
    const rec = recommendations[category || 'consultation'];
    if (rec) {
      // Adjust for duration
      const durationMultiplier = duration / 60;
      return {
        min: Math.round(rec.min * durationMultiplier),
        max: Math.round(rec.max * durationMultiplier),
        note: rec.note
      };
    }
    
    return { min: 25, max: 100, note: 'General service rates' };
  };

  const isFormValid = () => {
    if (data.pricingModel === 'donation') return true;
    return !errors.price && data.serviceDetails.price > 0;
  };

  const recommendation = getPricingRecommendation();

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
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mb-4">
            Set Your Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Configure how you want to charge for your service and maximize your earnings
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Pricing Card */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="border-2 border-border/50 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-muted/50 to-background">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                Pricing Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              {/* Pricing Model Selection */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Pricing Model</Label>
                <RadioGroup
                  value={data.pricingModel || 'per-session'}
                  onValueChange={handlePricingModelChange}
                  className="grid grid-cols-1 gap-4"
                >
                  <motion.div 
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                      data.pricingModel === 'per-session' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RadioGroupItem value="per-session" id="per-session" />
                    <div className="flex-1">
                      <Label htmlFor="per-session" className="font-medium cursor-pointer">
                        Per Session Pricing
                      </Label>
                      <p className="text-sm text-muted-foreground">Charge a fixed rate per session regardless of participants</p>
                    </div>
                    <Badge variant="secondary">Most Popular</Badge>
                  </motion.div>
                  
                  <motion.div 
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                      data.pricingModel === 'per-person' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RadioGroupItem value="per-person" id="per-person" />
                    <div className="flex-1">
                      <Label htmlFor="per-person" className="font-medium cursor-pointer">
                        Per Person Pricing
                      </Label>
                      <p className="text-sm text-muted-foreground">Charge per participant - great for group sessions</p>
                    </div>
                    {data.serviceDetails.maxParticipants > 1 && <Badge variant="outline">Recommended</Badge>}
                  </motion.div>
                  
                  <motion.div 
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                      data.pricingModel === 'donation' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RadioGroupItem value="donation" id="donation" />
                    <div className="flex-1">
                      <Label htmlFor="donation" className="font-medium cursor-pointer">
                        Donation Based
                      </Label>
                      <p className="text-sm text-muted-foreground">Let clients pay what they can afford</p>
                    </div>
                    <Badge variant="outline">Flexible</Badge>
                  </motion.div>
                </RadioGroup>
              </div>

              {/* Price Input */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="price" className="text-base font-semibold flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    {data.pricingModel === 'donation' ? 'Suggested Amount ($)' : 'Price ($)'}
                    {data.pricingModel !== 'donation' && <span className="text-destructive">*</span>}
                  </Label>
                  {!errors.price && data.serviceDetails.price > 0 && touched && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10000"
                    value={data.serviceDetails.price || ''}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder="0.00"
                    className={`pl-10 h-12 text-lg font-semibold ${
                      errors.price && touched ? 'border-destructive focus:border-destructive' : ''
                    }`}
                  />
                </div>
                
                {errors.price && touched && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{errors.price}</AlertDescription>
                  </Alert>
                )}

                {/* Pricing Recommendation */}
                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700 dark:text-blue-300">
                    <strong>Recommended range:</strong> ${recommendation.min} - ${recommendation.max} 
                    <br />
                    <span className="text-sm">{recommendation.note}</span>
                  </AlertDescription>
                </Alert>
              </div>

              {/* Per-Person Calculation */}
              {data.pricingModel === 'per-person' && data.serviceDetails.price > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-700 dark:text-green-300">Potential Earnings</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Price per person:</span>
                      <span className="font-semibold">${data.serviceDetails.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Max participants:</span>
                      <span className="font-semibold">{data.serviceDetails.maxParticipants}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center text-lg font-bold text-green-700 dark:text-green-300">
                        <span>Maximum per session:</span>
                        <span>${calculatePotentialEarnings().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Donation Message */}
              {data.pricingModel === 'donation' && (
                <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                  <Info className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-purple-700 dark:text-purple-300">
                    With donation-based pricing, clients can pay any amount they choose. 
                    The suggested amount helps guide their decision.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pricing Summary Sidebar */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-4"
        >
          <Card className="border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Pricing Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Service:</span>
                  <span className="text-sm font-medium">{data.serviceDetails.name || 'Untitled'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Duration:</span>
                  <span className="text-sm font-medium">{data.serviceDetails.duration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Model:</span>
                  <Badge variant="outline" className="text-xs">
                    {data.pricingModel?.replace('-', ' ') || 'per-session'}
                  </Badge>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Price:</span>
                    <span className="text-lg font-bold text-green-600">
                      ${data.serviceDetails.price || 0}
                      {data.pricingModel === 'per-person' && (
                        <span className="text-sm text-muted-foreground ml-1">
                          /person
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {isFormValid() && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
            >
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300 font-medium text-sm">
                <CheckCircle className="w-4 h-4" />
                Pricing configured successfully!
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex justify-between mt-8"
      >
        <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2 h-12 px-6">
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!isFormValid()}
          className="flex items-center gap-2 h-12 px-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
        >
          Next: Create Availability
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PricingStep;
