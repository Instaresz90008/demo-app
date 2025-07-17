
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateServiceConfig, setError } from '@/store/slices/serviceCreationSlice';
import { ServiceConfig, PricingModel, BookingType } from '@/types/smartService';
import { Service } from '@/services/api/serviceApi';
import { Save, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ServiceConfigFormProps {
  bookingType: BookingType;
  pricingModel: PricingModel;
  config: Partial<Service>;
  onConfigChange: (config: Partial<Service>) => void;
  onNext: () => void;
  onBack: () => void;
  isValidating?: boolean;
}

const ServiceConfigForm: React.FC<ServiceConfigFormProps> = ({
  bookingType,
  pricingModel,
  config,
  onConfigChange,
  onNext,
  onBack,
  isValidating = false
}) => {
  const dispatch = useAppDispatch();
  const { currentService, error } = useAppSelector((state) => state.serviceCreation);
  
  const [formData, setFormData] = useState<Partial<Service>>(() => ({
    name: '',
    description: '',
    duration_mins: 60,
    cost_factor: 0,
    serviceType: bookingType.key as any,
    meetingType: 'video',
    is_active: true,
    ...config,
    ...currentService
  }));

  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(setError(null));
    }
  }, [error, dispatch]);

  // Update form data when config changes, but prevent infinite loops
  useEffect(() => {
    if (config && Object.keys(config).length > 0) {
      setFormData(prev => {
        const newData = { ...prev, ...config };
        // Only update if data actually changed
        if (JSON.stringify(prev) !== JSON.stringify(newData)) {
          return newData;
        }
        return prev;
      });
    }
  }, [config]);

  // Validation logic - memoized to prevent unnecessary recalculations
  const validation = useMemo(() => {
    const errors: Record<string, string> = {};
    
    if (!formData.name || formData.name.trim().length < 3) {
      errors.name = 'Service name must be at least 3 characters';
    }
    
    if (!formData.description || formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.duration_mins || formData.duration_mins < 5) {
      errors.duration_mins = 'Duration must be at least 5 minutes';
    }
    
    if (pricingModel.configFields.includes('price') && (!formData.cost_factor || formData.cost_factor <= 0)) {
      errors.cost_factor = 'Price must be greater than 0';
    }
    
    return {
      errors,
      isValid: Object.keys(errors).length === 0 && hasUserInteracted
    };
  }, [formData.name, formData.description, formData.duration_mins, formData.cost_factor, pricingModel.configFields, hasUserInteracted]);

  const updateField = useCallback((field: keyof Service, value: any) => {
    console.log('ServiceConfigForm: Updating field', field, 'with value', value);
    setHasUserInteracted(true);
    
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Debounce Redux updates to prevent excessive state changes
      setTimeout(() => {
        dispatch(updateServiceConfig(updated));
        onConfigChange(updated);
      }, 0);
      
      return updated;
    });
  }, [dispatch, onConfigChange]);

  const handleSave = useCallback(() => {
    if (validation.isValid) {
      dispatch(updateServiceConfig(formData));
      toast.success('Service configuration saved');
    } else {
      toast.error('Please fix the validation errors before saving');
    }
  }, [validation.isValid, formData, dispatch]);

  const handleNext = useCallback(() => {
    console.log('ServiceConfigForm: handleNext called');
    console.log('ServiceConfigForm: Form data:', formData);
    console.log('ServiceConfigForm: Has user interacted:', hasUserInteracted);
    
    if (!hasUserInteracted) {
      toast.error('Please fill in the service details before continuing');
      return;
    }
    
    if (validation.isValid) {
      console.log('ServiceConfigForm: Form is valid, proceeding to next step');
      dispatch(updateServiceConfig(formData));
      onNext();
    } else {
      console.log('ServiceConfigForm: Form validation failed:', validation.errors);
      toast.error('Please fill in all required fields correctly');
    }
  }, [hasUserInteracted, validation.isValid, validation.errors, formData, dispatch, onNext]);

  const renderPricingFields = () => {
    return pricingModel.configFields.map((field) => {
      switch (field) {
        case 'price':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor="cost_factor">Price ($) *</Label>
              <Input
                id="cost_factor"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.cost_factor || ''}
                onChange={(e) => updateField('cost_factor', parseFloat(e.target.value) || 0)}
                className={validation.errors.cost_factor ? 'border-red-500' : ''}
              />
              {validation.errors.cost_factor && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validation.errors.cost_factor}
                </p>
              )}
            </div>
          );

        case 'hourlyRate':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor="hourly_rate">Hourly Rate ($) *</Label>
              <Input
                id="hourly_rate"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.cost_factor || ''}
                onChange={(e) => updateField('cost_factor', parseFloat(e.target.value) || 0)}
              />
            </div>
          );

        case 'minimumDuration':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor="min_duration">Minimum Duration (minutes)</Label>
              <Input
                id="min_duration"
                type="number"
                placeholder="30"
                min="5"
                value={formData.duration_mins || ''}
                onChange={(e) => updateField('duration_mins', parseInt(e.target.value) || 30)}
              />
            </div>
          );

        default:
          return null;
      }
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Back
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Configure Service Details</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">
              {bookingType.icon} {bookingType.name}
            </Badge>
            <Badge variant="outline">
              {pricingModel.icon} {pricingModel.name}
            </Badge>
          </div>
        </div>
        <Button variant="outline" onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Draft
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              placeholder="Enter a clear, descriptive service name"
              value={formData.name || ''}
              onChange={(e) => updateField('name', e.target.value)}
              className={validation.errors.name ? 'border-red-500' : ''}
            />
            {validation.errors.name && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {validation.errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what clients can expect from this service"
              className={`h-24 ${validation.errors.description ? 'border-red-500' : ''}`}
              value={formData.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
            />
            {validation.errors.description && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {validation.errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                placeholder="60"
                min="5"
                step="5"
                value={formData.duration_mins || ''}
                onChange={(e) => updateField('duration_mins', parseInt(e.target.value) || 60)}
                className={validation.errors.duration_mins ? 'border-red-500' : ''}
              />
              {validation.errors.duration_mins && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validation.errors.duration_mins}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting_type">Meeting Type</Label>
              <Select value={formData.meetingType || 'video'} onValueChange={(value) => updateField('meetingType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select meeting type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video Call</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="in-person">In Person</SelectItem>
                  <SelectItem value="online">Online Platform</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {pricingModel.configFields.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                {pricingModel.icon} Pricing Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderPricingFields()}
              </div>
            </div>
          )}

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Service Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="is_active">Active Service</Label>
                  <p className="text-sm text-muted-foreground">Make this service available for booking</p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => updateField('is_active', checked)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
            <Button 
              onClick={handleNext} 
              className="flex-1" 
              disabled={!validation.isValid || isValidating}
            >
              {isValidating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Continue to Availability
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceConfigForm;
