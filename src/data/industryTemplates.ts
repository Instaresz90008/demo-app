
export interface IndustryTemplate {
  id: string;
  name: string;
  industry: string;
  category: string;
  bookingType: 'one-to-one' | 'group' | 'webinar';
  duration: number;
  suggestedPrice: number;
  pricing: string;
  maxParticipants: number;
  description: string;
  features: string[];
  popularity: number;
  tags: string[];
}

export const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
  // Healthcare Industry Templates
  {
    id: 'telemedicine-consultation',
    name: 'Telemedicine Consultation',
    industry: 'healthcare',
    category: 'consultation',
    bookingType: 'one-to-one',
    duration: 30,
    suggestedPrice: 150,
    pricing: '₹150/session',
    maxParticipants: 1,
    description: 'Remote medical consultation via video call',
    features: ['HIPAA Compliant', 'Prescription Notes', 'Medical Records', 'Follow-up Scheduling'],
    popularity: 95,
    tags: ['telemedicine', 'consultation', 'medical', 'remote']
  },
  {
    id: 'therapy-session',
    name: 'Mental Health Therapy',
    industry: 'healthcare',
    category: 'therapy',
    bookingType: 'one-to-one',
    duration: 60,
    suggestedPrice: 200,
    pricing: '₹200/session',
    maxParticipants: 1,
    description: 'Professional mental health counseling session',
    features: ['Confidential', 'Progress Tracking', 'Crisis Support', 'Session Notes'],
    popularity: 92,
    tags: ['therapy', 'mental health', 'counseling', 'psychology']
  },
  {
    id: 'nutrition-consultation',
    name: 'Nutrition Consultation',
    industry: 'healthcare',
    category: 'consultation',
    bookingType: 'one-to-one',
    duration: 45,
    suggestedPrice: 120,
    pricing: '₹120/session',
    maxParticipants: 1,
    description: 'Personalized nutrition and diet planning session',
    features: ['Meal Planning', 'Diet Charts', 'Progress Monitoring', 'Recipe Suggestions'],
    popularity: 88,
    tags: ['nutrition', 'diet', 'health', 'wellness']
  },
  {
    id: 'fitness-training',
    name: 'Personal Fitness Training',
    industry: 'healthcare',
    category: 'fitness',
    bookingType: 'one-to-one',
    duration: 60,
    suggestedPrice: 100,
    pricing: '₹100/session',
    maxParticipants: 1,
    description: 'One-on-one fitness coaching and training',
    features: ['Custom Workouts', 'Progress Tracking', 'Nutrition Advice', 'Equipment Guidance'],
    popularity: 90,
    tags: ['fitness', 'training', 'exercise', 'health']
  },
  {
    id: 'group-therapy',
    name: 'Group Therapy Session',
    industry: 'healthcare',
    category: 'therapy',
    bookingType: 'group',
    duration: 90,
    suggestedPrice: 75,
    pricing: '₹75/person',
    maxParticipants: 8,
    description: 'Supportive group therapy sessions',
    features: ['Group Support', 'Peer Learning', 'Moderated Discussion', 'Resource Sharing'],
    popularity: 85,
    tags: ['group therapy', 'support group', 'mental health', 'community']
  },

  // Business Consulting Industry Templates
  {
    id: 'business-strategy-consultation',
    name: 'Business Strategy Consultation',
    industry: 'business-consulting',
    category: 'consultation',
    bookingType: 'one-to-one',
    duration: 90,
    suggestedPrice: 300,
    pricing: '₹300/session',
    maxParticipants: 1,
    description: 'Strategic business planning and growth consultation',
    features: ['Market Analysis', 'Growth Strategy', 'Financial Planning', 'Action Plans'],
    popularity: 96,
    tags: ['strategy', 'business', 'consulting', 'growth']
  },
  {
    id: 'startup-mentorship',
    name: 'Startup Mentorship',
    industry: 'business-consulting',
    category: 'mentorship',
    bookingType: 'one-to-one',
    duration: 60,
    suggestedPrice: 250,
    pricing: '₹250/session',
    maxParticipants: 1,
    description: 'Guidance for entrepreneurs and startup founders',
    features: ['Pitch Review', 'Funding Guidance', 'Network Access', 'Industry Insights'],
    popularity: 94,
    tags: ['startup', 'mentorship', 'entrepreneurship', 'funding']
  },
  {
    id: 'digital-transformation',
    name: 'Digital Transformation Consulting',
    industry: 'business-consulting',
    category: 'consultation',
    bookingType: 'one-to-one',
    duration: 120,
    suggestedPrice: 400,
    pricing: '₹400/session',
    maxParticipants: 1,
    description: 'Help businesses navigate digital transformation',
    features: ['Technology Assessment', 'Process Optimization', 'Change Management', 'ROI Analysis'],
    popularity: 89,
    tags: ['digital transformation', 'technology', 'process improvement', 'innovation']
  },
  {
    id: 'leadership-coaching',
    name: 'Executive Leadership Coaching',
    industry: 'business-consulting',
    category: 'coaching',
    bookingType: 'one-to-one',
    duration: 75,
    suggestedPrice: 350,
    pricing: '₹350/session',
    maxParticipants: 1,
    description: 'Leadership development for executives and managers',
    features: ['360 Feedback', 'Leadership Assessment', 'Skill Development', 'Performance Coaching'],
    popularity: 91,
    tags: ['leadership', 'coaching', 'executive', 'management']
  },
  {
    id: 'team-workshop',
    name: 'Team Building Workshop',
    industry: 'business-consulting',
    category: 'workshop',
    bookingType: 'group',
    duration: 180,
    suggestedPrice: 150,
    pricing: '₹150/person',
    maxParticipants: 20,
    description: 'Interactive team building and collaboration workshop',
    features: ['Team Activities', 'Communication Skills', 'Conflict Resolution', 'Goal Setting'],
    popularity: 87,
    tags: ['team building', 'workshop', 'collaboration', 'communication']
  }
];

export const getTemplatesByIndustry = (industry: string): IndustryTemplate[] => {
  return INDUSTRY_TEMPLATES.filter(template => template.industry === industry);
};

export const getTemplatesByCategory = (category: string): IndustryTemplate[] => {
  return INDUSTRY_TEMPLATES.filter(template => template.category === category);
};

export const getAllIndustries = (): string[] => {
  return Array.from(new Set(INDUSTRY_TEMPLATES.map(template => template.industry)));
};
