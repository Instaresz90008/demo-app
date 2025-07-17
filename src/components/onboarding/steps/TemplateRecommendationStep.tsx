
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Users, Clock, DollarSign, ArrowRight, ArrowLeft, Sparkles, Wand2, Loader2 } from 'lucide-react';
import { selectTemplate, nextStep, previousStep } from '@/store/slices/onboardingSlice';
import { useServiceTemplates } from '@/hooks/useServiceTemplates';

const TemplateRecommendationStep: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(state => state.onboarding);
  const [isLoading, setIsLoading] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);

  // Get the selected industry from guided discovery
  const discoveredIndustry = data.serviceDetails.category;
  // Use category as subcategory for now since subcategory doesn't exist in the data structure
  const discoveredSubcategory = data.serviceDetails.category;

  // Fetch templates from backend based on discovered intent
  const { 
    data: templates = [], 
    isLoading: templatesLoading, 
    error: templatesError 
  } = useServiceTemplates({
    industry: discoveredIndustry,
    subcategory: discoveredSubcategory,
  });

  useEffect(() => {
    // Show loading for 3 seconds, then show templates
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowTemplates(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleUseTemplate = (templateId: string) => {
    dispatch(selectTemplate(templateId));
    setTimeout(() => {
      dispatch(nextStep());
    }, 500);
  };

  const handleCustomize = () => {
    dispatch(nextStep());
  };

  const formatPrice = (template: any) => {
    // Use dynamic price if available (from backend with location overlay)
    if (template.display_price) {
      return template.display_price.label;
    }

    // Fallback to config price
    const config = template.default_config?.pricing_config;
    if (!config) return 'Free';
    
    if (config.price) return `$${config.price}`;
    if (config.hourly_rate) return `$${config.hourly_rate}/hour`;
    if (config.monthly_price) return `$${config.monthly_price}/month`;
    if (config.price_per_person) return `$${config.price_per_person}/person`;
    if (config.bundle_price) return `$${config.bundle_price} bundle`;
    return 'Free';
  };

  const formatDuration = (duration?: number) => {
    if (!duration || duration === 0) return 'Variable';
    return `${duration} minutes`;
  };

  const formatCapacity = (capacity?: number) => {
    if (!capacity || capacity === 1) return '1-on-1 sessions';
    return `Up to ${capacity} people`;
  };

  // Show loading animation
  if (isLoading || templatesLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold mb-3">AI-Powered Template Recommendations</h2>
          <p className="text-muted-foreground text-lg">
            Finding the perfect templates for your {discoveredIndustry || 'business'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="relative mb-6">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Wand2 className="w-12 h-12 text-primary" />
            </motion.div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </motion.div>
          </div>
          
          <motion.h3
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-xl font-semibold mb-2"
          >
            Analyzing {discoveredIndustry} templates...
          </motion.h3>
          
          <motion.p
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="text-muted-foreground"
          >
            Creating personalized recommendations based on industry best practices
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Handle API error
  if (templatesError) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">Template Recommendations</h2>
          <p className="text-muted-foreground text-lg">
            Unable to load templates at this time
          </p>
        </div>
        
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            We're having trouble loading templates. You can still continue with a custom setup.
          </p>
          <Button onClick={handleCustomize}>
            Continue with Custom Setup
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => dispatch(previousStep())}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Questions
          </Button>
        </div>
      </div>
    );
  }

  // Split templates into recommended and popular
  const recommendedTemplates = templates
    .filter(t => t.tags.includes('recommended') || t.popularity_score >= 85)
    .slice(0, 3);
  
  const popularTemplates = templates
    .filter(t => !recommendedTemplates.includes(t))
    .slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold mb-3">
          Perfect Templates for {discoveredIndustry}
        </h2>
        <p className="text-muted-foreground text-lg">
          Industry-specific templates proven to work great for your business
        </p>
      </motion.div>

      {/* Recommended Templates */}
      {recommendedTemplates.length > 0 && (
        <div className="mb-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center mb-4"
          >
            <Crown className="w-5 h-5 text-yellow-500 mr-2" />
            <h3 className="text-xl font-semibold">Top Recommendations</h3>
            <Badge className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-200">
              Best Match
            </Badge>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {recommendedTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="cursor-pointer transition-all duration-200 relative overflow-hidden border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg">
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-primary/80 text-primary-foreground px-3 py-1 text-xs font-medium">
                    Recommended
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-1">{template.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {template.subcategory || template.booking_type_name}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      {template.description}
                    </p>

                    {/* Template Stats */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                        <span className="font-medium">{formatPrice(template)}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2 text-blue-500" />
                        <span>{formatDuration(template.default_config?.duration_mins)}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-2 text-purple-500" />
                        <span>{formatCapacity(template.default_config?.capacity)}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.tags.length - 2}
                        </Badge>
                      )}
                    </div>

                    <Button
                      onClick={() => handleUseTemplate(template.id)}
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Use This Template
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Templates */}
      {popularTemplates.length > 0 && (
        <div className="mb-8">
          <motion.h3
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg font-semibold mb-4 text-muted-foreground"
          >
            More {discoveredIndustry} Templates
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
              >
                <Card className="cursor-pointer hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-1">{template.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{formatPrice(template)}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUseTemplate(template.id)}
                      >
                        Use This
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* No Templates Message */}
      {templates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No templates available for {discoveredIndustry} yet.
          </p>
          <Button onClick={handleCustomize}>
            Create Custom Service
          </Button>
        </div>
      )}

      {/* Custom Setup Option */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl p-6 border border-border/50"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Want Something Different?</h3>
          <p className="text-muted-foreground mb-4">
            Skip templates and create your own custom configuration
          </p>
          <Button
            variant="outline"
            onClick={handleCustomize}
            className="hover:bg-primary hover:text-primary-foreground"
          >
            Build Custom Service
          </Button>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="flex justify-between mt-8"
      >
        <Button
          variant="outline"
          onClick={() => dispatch(previousStep())}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 w-4 mr-2" />
          Back to Questions
        </Button>

        <Button
          variant="ghost"
          onClick={handleCustomize}
          className="flex items-center text-muted-foreground"
        >
          Skip Templates
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
};

export default TemplateRecommendationStep;
