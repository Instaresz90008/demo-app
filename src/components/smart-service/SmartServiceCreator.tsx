import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useUnifiedAccessControl } from '@/hooks/useUnifiedAccessControl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { resetSmartService } from '@/store/slices/smartServiceSlice';
import { resetServiceCreation, setCreationStep } from '@/store/slices/serviceCreationSlice';
import { BOOKING_TYPES } from '@/data/smartServiceData';
import { BookingType, PricingModel } from '@/types/smartService';
import PricingModelSelector from './PricingModelSelector';
import TemplateSelector from './TemplateSelector';
import WorkflowRenderer from './workflows/WorkflowRenderer';
import ServiceCompletion from './ServiceCompletion';
import { ServiceTemplate } from '@/services/api/serviceTemplateApi';
import { PRICING_MODELS } from '@/data/smartServiceData';

type Step = 'booking-types' | 'templates' | 'pricing-models' | 'workflow' | 'completion';

const SmartServiceCreator: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { capabilities, user } = useUnifiedAccessControl();
  
  const { createdServices } = useAppSelector((state) => state.smartService);
  const { creationStep, publishedService } = useAppSelector((state) => state.serviceCreation);

  const [currentStep, setStep] = useState<Step>('booking-types');
  const [selectedBookingType, setBookingType] = useState<BookingType | null>(null);
  const [selectedTemplate, setTemplate] = useState<ServiceTemplate | null>(null);
  const [selectedPricingModel, setPricingModel] = useState<PricingModel | null>(null);
  
  // Store user context for template filtering
  const [userContext, setUserContext] = useState<{
    industry?: string;
    subcategory?: string;
  }>({});

  const maxTemplates = capabilities?.smartServiceTemplates || 3;
  const userPlan = user?.planType || 'freemium';

  const handleBookingTypeSelect = (bookingType: BookingType) => {
    setBookingType(bookingType);
    setStep('templates');
  };

  const handleTemplateSelect = (template: ServiceTemplate) => {
    setTemplate(template);
    // If template has pricing config, try to match it to a pricing model
    const config = template.default_config?.pricing_config;
    let matchedPricingModel = null;
    
    // Convert PRICING_MODELS Record to array for searching
    const pricingModelsArray = Object.values(PRICING_MODELS);
    
    if (config?.price) {
      matchedPricingModel = pricingModelsArray.find(pm => pm.id === 'fixed');
    } else if (config?.hourly_rate) {
      matchedPricingModel = pricingModelsArray.find(pm => pm.id === 'time-based');
    } else if (config?.monthly_price) {
      matchedPricingModel = pricingModelsArray.find(pm => pm.id === 'subscription');
    } else if (config?.price_per_person) {
      matchedPricingModel = pricingModelsArray.find(pm => pm.id === 'per-participant');
    }
    
    if (matchedPricingModel) {
      setPricingModel(matchedPricingModel);
      setStep('workflow');
    } else {
      setStep('pricing-models');
    }
  };

  const handleSkipTemplates = () => {
    setTemplate(null);
    setStep('pricing-models');
  };

  const handlePricingModelSelect = (pricingModel: PricingModel) => {
    setPricingModel(pricingModel);
    setStep('workflow');
  };

  const handleWorkflowComplete = (workflowData: any) => {
    // The workflow completion now triggers the service creation process
    // which is handled by the ServiceCompletion component
    setStep('completion');
    toast.success('Service configuration completed! 🎉');
  };

  const handleCreateAnother = () => {
    dispatch(resetSmartService());
    dispatch(resetServiceCreation());
    setStep('booking-types');
    setBookingType(null);
    setTemplate(null);
    setPricingModel(null);
    setUserContext({});
  };

  const handleManageServices = () => {
    navigate('/manage-services');
  };

  const renderBookingTypes = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Smart Service Creator
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Choose your service type and we'll guide you through creating the perfect service with pricing and availability
        </p>
        
        <div className="flex items-center justify-center gap-2">
          <Badge variant={userPlan === 'freemium' ? 'secondary' : 'default'}>
            {userPlan === 'freemium' && <Crown className="h-3 w-3 mr-1" />}
            {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan
          </Badge>
          <span className="text-sm text-muted-foreground">
            Templates available: {typeof maxTemplates === 'number' ? maxTemplates : 'Unlimited'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {BOOKING_TYPES.map((type) => (
          <Card 
            key={type.id}
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary/30"
            onClick={() => handleBookingTypeSelect(type)}
          >
            <CardHeader className="text-center pb-4">
              <div className="text-4xl mb-2">{type.icon}</div>
              <CardTitle className="text-lg">{type.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-sm leading-relaxed">
                {type.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-background via-background to-muted/10 min-h-screen">
      <div className="container mx-auto py-8">
        {currentStep === 'booking-types' && renderBookingTypes()}
        
        {currentStep === 'templates' && selectedBookingType && (
          <TemplateSelector
            bookingType={selectedBookingType}
            industry={userContext.industry}
            subcategory={userContext.subcategory}
            onTemplateSelect={handleTemplateSelect}
            onSkip={handleSkipTemplates}
            onBack={() => setStep('booking-types')}
          />
        )}
        
        {currentStep === 'pricing-models' && selectedBookingType && (
          <PricingModelSelector
            supportedModels={selectedBookingType.supportedPricingModels}
            selectedModel={selectedPricingModel}
            onModelSelect={handlePricingModelSelect}
            onBack={() => setStep('templates')}
          />
        )}

        {currentStep === 'workflow' && selectedBookingType && selectedPricingModel && (
          <WorkflowRenderer
            bookingType={selectedBookingType}
            pricingModel={selectedPricingModel}
            onComplete={handleWorkflowComplete}
            onBack={() => selectedTemplate ? setStep('templates') : setStep('pricing-models')}
          />
        )}

        {currentStep === 'completion' && (
          <ServiceCompletion
            onCreateAnother={handleCreateAnother}
            onManageServices={handleManageServices}
          />
        )}
      </div>
    </div>
  );
};

export default SmartServiceCreator;
