
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateServiceDetails, nextStep, previousStep } from '@/store/slices/onboardingSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, ArrowLeft, Clock, Users, Tag } from 'lucide-react';
import PriceIcon from '@/components/ui/PriceIcon';
import { toast } from 'sonner';

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

const ServiceDetailsStep: React.FC<Props> = ({ onNext, onPrevious }) => {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(state => state.onboarding);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 60,
    price: 0,
    maxParticipants: 1,
    category: 'consultation'
  });

  // Initialize form data from state or template
  useEffect(() => {
    const serviceDetails = data.serviceDetails;
    const selectedTemplate = data.selectedTemplate;
    
    setFormData({
      name: serviceDetails.name || selectedTemplate?.name || '',
      description: serviceDetails.description || selectedTemplate?.description || '',
      duration: serviceDetails.duration || selectedTemplate?.duration || 60,
      price: serviceDetails.price || selectedTemplate?.suggestedPrice || 0,
      maxParticipants: serviceDetails.maxParticipants || selectedTemplate?.maxParticipants || 1,
      category: serviceDetails.category || selectedTemplate?.category || 'consultation'
    });
  }, [data.serviceDetails, data.selectedTemplate]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Service name is required');
      return;
    }

    if (formData.duration < 15 || formData.duration > 480) {
      toast.error('Duration must be between 15 and 480 minutes');
      return;
    }

    if (formData.price < 0) {
      toast.error('Price cannot be negative');
      return;
    }

    dispatch(updateServiceDetails(formData));
    toast.success('Service details saved!');
    onNext();
  };

  const categories = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'coaching', label: 'Coaching' },
    { value: 'training', label: 'Training' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'therapy', label: 'Therapy' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'tutoring', label: 'Tutoring' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-4">Service Details</h1>
        <p className="text-muted-foreground text-lg">
          {data.selectedTemplate ? 
            `Customize your ${data.selectedTemplate.name} service` : 
            'Define the specifics of your service offering'
          }
        </p>
        {data.selectedTemplate && (
          <Badge variant="outline" className="mt-2">
            Using template: {data.selectedTemplate.name}
          </Badge>
        )}
      </motion.div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Service Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-base font-semibold">
                  Service Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Business Strategy Consultation"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-base font-semibold">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what clients can expect from this service..."
                  className="mt-2 min-h-[100px]"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="duration" className="text-base font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Duration (minutes) *
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                    min="15"
                    max="480"
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price" className="text-base font-semibold flex items-center gap-2">
                    <PriceIcon className="w-4 h-4" />
                    Price *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className="mt-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="maxParticipants" className="text-base font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Max Participants
                  </Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value) || 1)}
                    min="1"
                    max="100"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-base font-semibold">
                    Category
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Service Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <p className="font-medium">{formData.duration} min</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Price:</span>
                  <p className="font-medium">${formData.price}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Capacity:</span>
                  <p className="font-medium">{formData.maxParticipants} people</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="outline" className="capitalize">
                    {data.bookingType?.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6">
              <Button type="button" variant="outline" onClick={onPrevious}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button type="submit">
                Continue to Pricing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceDetailsStep;
