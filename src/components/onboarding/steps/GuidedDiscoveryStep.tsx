
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateServiceDetails, nextStep, setBookingType, setPricingModel } from '@/store/slices/onboardingSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowRight, Building2, Users, MapPin, Briefcase } from 'lucide-react';

// Enhanced industry options with smart questions
const INDUSTRIES = {
  'fitness-wellness': {
    label: 'Fitness & Wellness',
    smartQuestions: {
      bookingType: 'one-to-one' as const,
      pricingModel: 'per-session' as const,
      suggestedDuration: 60,
      suggestedPrice: 500
    }
  },
  'business-consulting': {
    label: 'Business Consulting',
    smartQuestions: {
      bookingType: 'one-to-one' as const,
      pricingModel: 'per-session' as const,
      suggestedDuration: 90,
      suggestedPrice: 2000
    }
  },
  'education': {
    label: 'Education',
    smartQuestions: {
      bookingType: 'webinar' as const,
      pricingModel: 'per-person' as const,
      suggestedDuration: 60,
      suggestedPrice: 99
    }
  },
  'healthcare-therapy': {
    label: 'HealthCare & Therapy',
    smartQuestions: {
      bookingType: 'one-to-one' as const,
      pricingModel: 'per-session' as const,
      suggestedDuration: 60,
      suggestedPrice: 1000
    }
  },
  'creative-services': {
    label: 'Creative Services',
    smartQuestions: {
      bookingType: 'one-to-one' as const,
      pricingModel: 'per-session' as const,
      suggestedDuration: 60,
      suggestedPrice: 700
    }
  },
  'technology-it': {
    label: 'Technology & IT',
    smartQuestions: {
      bookingType: 'one-to-one' as const,
      pricingModel: 'per-session' as const,
      suggestedDuration: 60,
      suggestedPrice: 1000
    }
  },
  'legal-compliance': {
    label: 'Legal & Compliance',
    smartQuestions: {
      bookingType: 'one-to-one' as const,
      pricingModel: 'per-session' as const,
      suggestedDuration: 60,
      suggestedPrice: 1500
    }
  },
  'coaching-personal-growth': {
    label: 'Coaching & Personal Growth',
    smartQuestions: {
      bookingType: 'one-to-one' as const,
      pricingModel: 'per-session' as const,
      suggestedDuration: 60,
      suggestedPrice: 700
    }
  },
  'spiritual-services': {
    label: 'Spiritual Services',
    smartQuestions: {
      bookingType: 'one-to-one' as const,
      pricingModel: 'per-session' as const,
      suggestedDuration: 60,
      suggestedPrice: 999
    }
  },
  'something-else': {
    label: 'Something Else',
    smartQuestions: {
      bookingType: 'one-to-one' as const,
      pricingModel: 'per-session' as const,
      suggestedDuration: 60,
      suggestedPrice: 699
    }
  }
};

const TEAM_SIZES = [
  { value: '1', label: 'Just me (Solo)' },
  { value: '2-5', label: '2-5 people' },
  { value: '6-15', label: '6-15 people' },
  { value: '16-50', label: '16-50 people' },
  { value: '50+', label: '50+ people' }
];

const SERVICE_LOCATIONS = [
  { value: 'global', label: 'Global (Serve anywhere)' },
  { value: 'specific-country', label: 'Specific Country' },
  { value: 'specific-city', label: 'Specific City/Region' },
  { value: 'local-only', label: 'Local/In-person only' }
];

const GuidedDiscoveryStep: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, templates } = useAppSelector(state => state.onboarding);
  
  const [formData, setFormData] = useState({
    industry: '',
    teamSize: '',
    serviceLocation: ''
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const showTeamFields = data.userType === 'team' || data.userType === 'business';

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    
    if (!formData.industry) newErrors.industry = true;
    if (showTeamFields && !formData.teamSize) newErrors.teamSize = true;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Get random template from the 6 available templates for the selected industry
  const getRandomSmartSuggestion = (industry: string) => {
    const industryTemplates = templates.filter(template => template.category === industry);
    const genericTemplates = templates.filter(template => template.category === 'something-else');
    
    // Get 6 templates (3 from industry + 2 more from industry + 1 generic)
    const availableTemplates = [
      ...industryTemplates.slice(0, 5), // First 5 from industry
      ...genericTemplates.slice(0, 1)   // 1 generic
    ].filter(Boolean);

    if (availableTemplates.length > 0) {
      const randomTemplate = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
      return {
        bookingType: randomTemplate.bookingType,
        pricingModel: 'per-session' as const, // Default to per-session for consistency
        suggestedDuration: randomTemplate.duration,
        suggestedPrice: randomTemplate.suggestedPrice
      };
    }
    
    // Fallback to industry default
    return INDUSTRIES[industry as keyof typeof INDUSTRIES]?.smartQuestions;
  };

  const handleContinue = () => {
    if (!validateForm()) return;

    // Get random smart suggestion from available templates
    const smartSuggestion = getRandomSmartSuggestion(formData.industry);
    
    if (smartSuggestion) {
      dispatch(updateServiceDetails({
        category: formData.industry,
        duration: smartSuggestion.suggestedDuration,
        price: smartSuggestion.suggestedPrice
      }));
      
      // Set booking type and pricing model with proper typing
      dispatch(setBookingType(smartSuggestion.bookingType));
      dispatch(setPricingModel(smartSuggestion.pricingModel));
    }

    // Store additional metadata
    dispatch(updateServiceDetails({
      teamSize: formData.teamSize,
      serviceLocation: formData.serviceLocation
    }));

    dispatch(nextStep());
  };

  // Get display values for smart suggestion preview
  const getDisplaySmartSuggestion = () => {
    if (!formData.industry) return null;
    return getRandomSmartSuggestion(formData.industry);
  };

  const displaySuggestion = getDisplaySmartSuggestion();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl font-bold text-foreground">Tell us about your service</h2>
        <p className="text-lg text-muted-foreground">
          Help us customize your booking experience with a few quick questions
        </p>
      </motion.div>

      <div className="grid gap-6">
        {/* Industry Selection - Mandatory for All */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`p-6 transition-colors ${errors.industry ? 'border-red-300' : ''}`}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <Label className="text-base font-semibold">Industry *</Label>
                  <p className="text-sm text-muted-foreground">
                    This helps us suggest the right booking type and pricing
                  </p>
                </div>
              </div>
              
              <Select
                value={formData.industry}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, industry: value }));
                  setErrors(prev => ({ ...prev, industry: false }));
                }}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(INDUSTRIES).map(([key, industry]) => (
                    <SelectItem key={key} value={key}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        </motion.div>

        {/* Team Size - Mandatory for Team/Business */}
        {showTeamFields && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className={`p-6 transition-colors ${errors.teamSize ? 'border-red-300' : ''}`}>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <Label className="text-base font-semibold">Team Size *</Label>
                    <p className="text-sm text-muted-foreground">
                      Needed for team routing and collaboration features
                    </p>
                  </div>
                </div>
                
                <Select
                  value={formData.teamSize}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, teamSize: value }));
                    setErrors(prev => ({ ...prev, teamSize: false }));
                  }}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="How many people in your team?" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAM_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Service Location - Optional for Team/Business */}
        {showTeamFields && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <Label className="text-base font-semibold">Service Location</Label>
                    <p className="text-sm text-muted-foreground">
                      Helps with time zones, language, and compliance settings
                    </p>
                  </div>
                </div>
                
                <Select
                  value={formData.serviceLocation}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, serviceLocation: value }))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Where do you serve clients?" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_LOCATIONS.map((location) => (
                      <SelectItem key={location.value} value={location.value}>
                        {location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Industry Preview - Show smart suggestions */}
        {formData.industry && displaySuggestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">Smart Suggestions Based on Your Industry</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Booking Type:</span>
                  <p className="text-blue-600 capitalize">
                    {displaySuggestion.bookingType.replace('-', ' ')}
                  </p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Pricing:</span>
                  <p className="text-blue-600 capitalize">
                    {displaySuggestion.pricingModel.replace('-', ' ')}
                  </p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Duration:</span>
                  <p className="text-blue-600">
                    {displaySuggestion.suggestedDuration} mins
                  </p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Price:</span>
                  <p className="text-blue-600">
                    ₹{displaySuggestion.suggestedPrice}
                  </p>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Don't worry, you can customize these in the next steps!
              </p>
            </Card>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <Button
          onClick={handleContinue}
          size="lg"
          className="flex items-center gap-2 px-8"
          disabled={!formData.industry || (showTeamFields && !formData.teamSize)}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
};

export default GuidedDiscoveryStep;
