
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Users, DollarSign, Video, Phone, MapPin, Sparkles } from 'lucide-react';

interface ServiceTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number;
  price: number;
  serviceType: 'one-to-one' | 'one-to-many' | 'group';
  meetingType: 'video' | 'phone' | 'in-person';
  maxParticipants: number;
  features: string[];
  popular?: boolean;
}

const SERVICE_TEMPLATES: ServiceTemplate[] = [
  {
    id: 'consultation',
    name: 'Business Consultation',
    description: 'Professional business advice and strategy sessions',
    category: 'Consulting',
    duration: 60,
    price: 150,
    serviceType: 'one-to-one',
    meetingType: 'video',
    maxParticipants: 1,
    features: ['Screen sharing', 'Recording', 'Follow-up notes'],
    popular: true
  },
  {
    id: 'coaching',
    name: 'Life Coaching Session',
    description: 'Personal development and goal-setting sessions',
    category: 'Coaching',
    duration: 45,
    price: 100,
    serviceType: 'one-to-one',
    meetingType: 'video',
    maxParticipants: 1,
    features: ['Goal tracking', 'Action plans', 'Progress monitoring']
  },
  {
    id: 'webinar',
    name: 'Educational Webinar',
    description: 'Group learning sessions and workshops',
    category: 'Education',
    duration: 90,
    price: 50,
    serviceType: 'one-to-many',
    meetingType: 'video',
    maxParticipants: 50,
    features: ['Q&A session', 'Breakout rooms', 'Resource sharing'],
    popular: true
  },
  {
    id: 'fitness',
    name: 'Personal Training',
    description: 'One-on-one fitness coaching sessions',
    category: 'Health & Fitness',
    duration: 60,
    price: 80,
    serviceType: 'one-to-one',
    meetingType: 'in-person',
    maxParticipants: 1,
    features: ['Workout plans', 'Progress tracking', 'Nutrition advice']
  },
  {
    id: 'therapy',
    name: 'Therapy Session',
    description: 'Mental health and wellness support',
    category: 'Healthcare',
    duration: 50,
    price: 120,
    serviceType: 'one-to-one',
    meetingType: 'video',
    maxParticipants: 1,
    features: ['Confidential', 'HIPAA compliant', 'Session notes']
  },
  {
    id: 'tutoring',
    name: 'Academic Tutoring',
    description: 'Subject-specific learning support',
    category: 'Education',
    duration: 60,
    price: 75,
    serviceType: 'one-to-one',
    meetingType: 'video',
    maxParticipants: 1,
    features: ['Whiteboard', 'File sharing', 'Homework help']
  },
  {
    id: 'group-fitness',
    name: 'Group Fitness Class',
    description: 'Small group workout sessions',
    category: 'Health & Fitness',
    duration: 45,
    price: 25,
    serviceType: 'group',
    meetingType: 'in-person',
    maxParticipants: 8,
    features: ['Equipment provided', 'All levels welcome', 'Community support']
  },
  {
    id: 'legal',
    name: 'Legal Consultation',
    description: 'Professional legal advice and support',
    category: 'Legal',
    duration: 30,
    price: 200,
    serviceType: 'one-to-one',
    meetingType: 'video',
    maxParticipants: 1,
    features: ['Confidential', 'Document review', 'Legal strategy']
  }
];

interface ServiceTemplatesProps {
  onSelectTemplate: (template: ServiceTemplate) => void;
}

const ServiceTemplates: React.FC<ServiceTemplatesProps> = ({ onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = ['all', ...Array.from(new Set(SERVICE_TEMPLATES.map(t => t.category)))];
  
  const filteredTemplates = selectedCategory === 'all' 
    ? SERVICE_TEMPLATES 
    : SERVICE_TEMPLATES.filter(t => t.category === selectedCategory);

  const getMeetingIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'phone': return Phone;
      case 'in-person': return MapPin;
      default: return Video;
    }
  };

  const getServiceTypeBadge = (type: string) => {
    switch (type) {
      case 'one-to-one': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'one-to-many': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'group': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Use Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Service Templates
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => {
              const MeetingIcon = getMeetingIcon(template.meetingType);
              
              return (
                <Card key={template.id} className="relative hover:shadow-lg transition-shadow">
                  {template.popular && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge className="bg-orange-500 text-white">Popular</Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge className={getServiceTypeBadge(template.serviceType)}>
                          {template.serviceType}
                        </Badge>
                      </div>
                      <MeetingIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{template.duration} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>${template.price}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Max {template.maxParticipants}</span>
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {template.category}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {template.features.map(feature => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => onSelectTemplate(template)}
                      className="w-full"
                    >
                      Use This Template
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceTemplates;
