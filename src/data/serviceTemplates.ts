
import { BookingType, PricingModel, ServiceConfig } from '@/types/smartService';

export interface ServiceTemplate {
  id: string;
  name: string;
  description: string;
  bookingTypeKey: string;
  pricingModelId: string;
  config: Partial<ServiceConfig>;
  tags: string[];
  popularity: number;
}

export const SERVICE_TEMPLATES: ServiceTemplate[] = [
  // 1-One Templates
  {
    id: 'one-on-one-consultation',
    name: 'Business Consultation',
    description: 'Strategic 1-on-1 business advice session',
    bookingTypeKey: '1-one',
    pricingModelId: 'fixed',
    config: {
      title: 'Business Consultation',
      description: 'Get personalized business advice and strategic guidance in a private 1-on-1 session.',
      duration: 60,
      capacity: 1,
      pricingConfig: { price: 150 },
      visibility: 'public'
    },
    tags: ['consulting', 'business', 'strategy'],
    popularity: 95
  },
  {
    id: 'one-on-one-coaching',
    name: 'Personal Coaching',
    description: 'Hourly personal development coaching',
    bookingTypeKey: '1-one',
    pricingModelId: 'time-based',
    config: {
      title: 'Personal Development Coaching',
      description: 'Transform your life with personalized coaching sessions tailored to your goals.',
      duration: 45,
      capacity: 1,
      pricingConfig: { hourlyRate: 120, minimumDuration: 30 },
      visibility: 'public'
    },
    tags: ['coaching', 'personal development', 'life coaching'],
    popularity: 88
  },
  {
    id: 'one-on-one-mentorship',
    name: 'Monthly Mentorship',
    description: 'Ongoing mentorship with monthly sessions',
    bookingTypeKey: '1-one',
    pricingModelId: 'subscription',
    config: {
      title: 'Monthly Mentorship Program',
      description: 'Get consistent guidance with monthly 1-on-1 mentorship sessions.',
      duration: 60,
      capacity: 1,
      pricingConfig: { monthlyPrice: 300, sessionsPerMonth: 2 },
      visibility: 'public'
    },
    tags: ['mentorship', 'ongoing', 'monthly'],
    popularity: 82
  },

  // 1-Many Templates
  {
    id: 'webinar-free',
    name: 'Educational Webinar',
    description: 'Free educational webinar with RSVP',
    bookingTypeKey: '1-many',
    pricingModelId: 'free-rsvp',
    config: {
      title: 'Digital Marketing Masterclass',
      description: 'Learn the latest digital marketing strategies in this comprehensive webinar.',
      duration: 90,
      capacity: 500,
      pricingConfig: {},
      visibility: 'public'
    },
    tags: ['webinar', 'education', 'marketing', 'free'],
    popularity: 92
  },
  {
    id: 'workshop-per-participant',
    name: 'Skills Workshop',
    description: 'Paid workshop with per-participant pricing',
    bookingTypeKey: '1-many',
    pricingModelId: 'per-participant',
    config: {
      title: 'Design Thinking Workshop',
      description: 'Interactive workshop teaching design thinking methodologies.',
      duration: 180,
      capacity: 50,
      pricingConfig: { pricePerPerson: 75, maxParticipants: 50 },
      visibility: 'public'
    },
    tags: ['workshop', 'design', 'interactive'],
    popularity: 85
  },
  {
    id: 'masterclass-tiered',
    name: 'Premium Masterclass',
    description: 'Tiered access masterclass with different benefits',
    bookingTypeKey: '1-many',
    pricingModelId: 'tiered-access',
    config: {
      title: 'Photography Masterclass',
      description: 'Advanced photography techniques with tiered access levels.',
      duration: 120,
      capacity: 100,
      pricingConfig: {
        accessTiers: [
          { name: 'Basic', price: 49, features: ['Live session', 'Recording access'] },
          { name: 'Premium', price: 99, features: ['Live session', 'Recording access', 'Q&A session', 'Course materials'] },
          { name: 'VIP', price: 199, features: ['All Premium features', '1-on-1 follow-up', 'Signed materials'] }
        ]
      },
      visibility: 'public'
    },
    tags: ['masterclass', 'photography', 'premium'],
    popularity: 78
  },

  // Group Interactive Templates
  {
    id: 'group-brainstorm',
    name: 'Strategy Brainstorm',
    description: 'Collaborative strategy session with per-person pricing',
    bookingTypeKey: 'group-interactive',
    pricingModelId: 'per-participant',
    config: {
      title: 'Strategic Planning Session',
      description: 'Collaborative brainstorming session for strategic planning and problem-solving.',
      duration: 120,
      capacity: 12,
      pricingConfig: { pricePerPerson: 85, maxParticipants: 12 },
      visibility: 'public'
    },
    tags: ['strategy', 'brainstorm', 'collaborative'],
    popularity: 89
  },
  {
    id: 'group-training-hybrid',
    name: 'Team Training',
    description: 'Team training with base fee plus per-person charge',
    bookingTypeKey: 'group-interactive',
    pricingModelId: 'hybrid',
    config: {
      title: 'Leadership Development Training',
      description: 'Interactive leadership training for teams with engaging exercises and discussions.',
      duration: 240,
      capacity: 20,
      pricingConfig: { basePrice: 500, pricePerPerson: 50 },
      visibility: 'public'
    },
    tags: ['training', 'leadership', 'team building'],
    popularity: 83
  },
  {
    id: 'group-workshop-fixed',
    name: 'Innovation Workshop',
    description: 'Fixed-price group workshop regardless of size',
    bookingTypeKey: 'group-interactive',
    pricingModelId: 'group-fixed',
    config: {
      title: 'Innovation & Creativity Workshop',
      description: 'Hands-on workshop fostering innovation and creative thinking in teams.',
      duration: 180,
      capacity: 15,
      pricingConfig: { groupPrice: 1200, maxGroupSize: 15 },
      visibility: 'public'
    },
    tags: ['innovation', 'creativity', 'workshop'],
    popularity: 76
  },

  // Round Robin Templates
  {
    id: 'round-robin-consultation',
    name: 'Expert Consultation Pool',
    description: 'Consultation distributed among expert team',
    bookingTypeKey: 'round-robin',
    pricingModelId: 'fixed',
    config: {
      title: 'Legal Consultation',
      description: 'Get expert legal advice from our team of qualified attorneys.',
      duration: 30,
      capacity: 1,
      pricingConfig: { price: 200 },
      visibility: 'public'
    },
    tags: ['legal', 'consultation', 'expert team'],
    popularity: 87
  },
  {
    id: 'round-robin-therapy',
    name: 'Therapy Sessions',
    description: 'Therapy sessions with available therapists',
    bookingTypeKey: 'round-robin',
    pricingModelId: 'time-based',
    config: {
      title: 'Mental Health Therapy',
      description: 'Professional therapy sessions with licensed mental health professionals.',
      duration: 50,
      capacity: 1,
      pricingConfig: { hourlyRate: 180, minimumDuration: 50 },
      visibility: 'public'
    },
    tags: ['therapy', 'mental health', 'counseling'],
    popularity: 91
  },
  {
    id: 'round-robin-fitness',
    name: 'Personal Training',
    description: 'Personal training with available trainers',
    bookingTypeKey: 'round-robin',
    pricingModelId: 'fixed',
    config: {
      title: 'Personal Fitness Training',
      description: 'One-on-one fitness training with certified personal trainers.',
      duration: 60,
      capacity: 1,
      pricingConfig: { price: 95 },
      visibility: 'public'
    },
    tags: ['fitness', 'personal training', 'health'],
    popularity: 84
  },

  // Collective Availability Templates
  {
    id: 'collective-meeting',
    name: 'Team Decision Meeting',
    description: 'Meeting requiring all team members',
    bookingTypeKey: 'collective-availability',
    pricingModelId: 'fixed',
    config: {
      title: 'Executive Decision Session',
      description: 'Critical decision-making session requiring all key stakeholders.',
      duration: 90,
      capacity: 8,
      pricingConfig: { price: 800 },
      visibility: 'private'
    },
    tags: ['executive', 'decision making', 'team'],
    popularity: 79
  },
  {
    id: 'collective-project',
    name: 'Project Kick-off',
    description: 'Project initiation with entire team',
    bookingTypeKey: 'collective-availability',
    pricingModelId: 'group-fixed',
    config: {
      title: 'Project Launch Session',
      description: 'Comprehensive project kick-off with all team members and stakeholders.',
      duration: 180,
      capacity: 12,
      pricingConfig: { groupPrice: 1500, maxGroupSize: 12 },
      visibility: 'private'
    },
    tags: ['project management', 'kick-off', 'team'],
    popularity: 73
  },
  {
    id: 'collective-retreat',
    name: 'Team Retreat Planning',
    description: 'Strategic planning session with full team',
    bookingTypeKey: 'collective-availability',
    pricingModelId: 'fixed',
    config: {
      title: 'Annual Strategic Retreat',
      description: 'Full-day strategic planning and team building retreat.',
      duration: 480,
      capacity: 15,
      pricingConfig: { price: 3000 },
      visibility: 'private'
    },
    tags: ['retreat', 'strategic planning', 'annual'],
    popularity: 71
  },

  // Multi-Service Bundle Templates
  {
    id: 'bundle-comprehensive',
    name: 'Business Setup Package',
    description: 'Complete business setup with multiple services',
    bookingTypeKey: 'multi-service-bundle',
    pricingModelId: 'bundled-price',
    config: {
      title: 'Complete Business Launch Package',
      description: 'Everything you need to launch your business: consultation, planning, legal setup, and marketing strategy.',
      duration: 0, // Bundle doesn't have single duration
      pricingConfig: {
        bundlePrice: 2500,
        individualServices: [
          { name: 'Business Consultation', duration: 90, price: 300 },
          { name: 'Business Plan Creation', duration: 240, price: 800 },
          { name: 'Legal Structure Setup', duration: 120, price: 600 },
          { name: 'Marketing Strategy', duration: 180, price: 500 },
          { name: 'Brand Identity Design', duration: 300, price: 700 }
        ]
      },
      visibility: 'public'
    },
    tags: ['business setup', 'comprehensive', 'bundle'],
    popularity: 86
  },
  {
    id: 'bundle-wellness',
    name: 'Wellness Package',
    description: 'Tiered wellness packages with different service levels',
    bookingTypeKey: 'multi-service-bundle',
    pricingModelId: 'tiered-package',
    config: {
      title: 'Holistic Wellness Program',
      description: 'Comprehensive wellness program with fitness, nutrition, and mental health components.',
      duration: 0,
      pricingConfig: {
        packages: [
          {
            name: 'Essential',
            price: 199,
            services: ['Fitness Assessment', 'Nutrition Consultation', 'Wellness Plan']
          },
          {
            name: 'Premium',
            price: 399,
            services: ['All Essential services', 'Personal Training (3 sessions)', 'Meal Planning', 'Stress Management Workshop']
          },
          {
            name: 'Ultimate',
            price: 699,
            services: ['All Premium services', 'Personal Training (6 sessions)', 'Mental Health Counseling', 'Spa Treatment', 'Monthly Check-ins']
          }
        ]
      },
      visibility: 'public'
    },
    tags: ['wellness', 'fitness', 'holistic'],
    popularity: 81
  },
  {
    id: 'bundle-marketing',
    name: 'Digital Marketing Bundle',
    description: 'Complete digital marketing service package',
    bookingTypeKey: 'multi-service-bundle',
    pricingModelId: 'bundled-price',
    config: {
      title: 'Digital Marketing Transformation',
      description: 'Complete digital marketing overhaul including strategy, content, and advertising setup.',
      duration: 0,
      pricingConfig: {
        bundlePrice: 1800,
        individualServices: [
          { name: 'Marketing Audit', duration: 120, price: 400 },
          { name: 'Strategy Development', duration: 180, price: 600 },
          { name: 'Content Creation', duration: 240, price: 500 },
          { name: 'Ad Campaign Setup', duration: 150, price: 450 },
          { name: 'Analytics Setup', duration: 90, price: 250 }
        ]
      },
      visibility: 'public'
    },
    tags: ['digital marketing', 'strategy', 'advertising'],
    popularity: 77
  },

  // Program/Series Templates
  {
    id: 'program-course',
    name: 'Professional Course',
    description: 'Multi-week professional development course',
    bookingTypeKey: 'program-series',
    pricingModelId: 'full-program-fee',
    config: {
      title: 'Project Management Certification Course',
      description: '8-week comprehensive project management course leading to certification.',
      duration: 120, // Per session
      pricingConfig: { programPrice: 1200, sessionCount: 8 },
      visibility: 'public'
    },
    tags: ['certification', 'project management', 'professional development'],
    popularity: 88
  },
  {
    id: 'program-bootcamp',
    name: 'Skills Bootcamp',
    description: 'Intensive skills bootcamp with tiered access',
    bookingTypeKey: 'program-series',
    pricingModelId: 'tiered-access',
    config: {
      title: 'Data Science Bootcamp',
      description: '12-week intensive data science bootcamp with hands-on projects.',
      duration: 180,
      pricingConfig: {
        accessTiers: [
          { name: 'Basic', price: 2999, features: ['All live sessions', 'Course materials', 'Community access'] },
          { name: 'Pro', price: 4999, features: ['All Basic features', 'Mentorship', 'Career support', 'Portfolio review'] },
          { name: 'Elite', price: 7999, features: ['All Pro features', 'Job placement assistance', 'Premium projects', '1-on-1 coaching'] }
        ]
      },
      visibility: 'public'
    },
    tags: ['bootcamp', 'data science', 'intensive'],
    popularity: 82
  },
  {
    id: 'program-masterclass-series',
    name: 'Masterclass Series',
    description: 'Expert-led masterclass series',
    bookingTypeKey: 'program-series',
    pricingModelId: 'full-program-fee',
    config: {
      title: 'Leadership Excellence Masterclass Series',
      description: '6-session masterclass series on advanced leadership techniques.',
      duration: 90,
      pricingConfig: { programPrice: 897, sessionCount: 6 },
      visibility: 'public'
    },
    tags: ['masterclass', 'leadership', 'excellence'],
    popularity: 85
  },

  // Drop-in/Queue Templates
  {
    id: 'queue-office-hours',
    name: 'Office Hours',
    description: 'Drop-in office hours with entry fee',
    bookingTypeKey: 'drop-in-queue',
    pricingModelId: 'entry-fee',
    config: {
      title: 'Professor Office Hours',
      description: 'Drop-in office hours for students and professionals seeking quick guidance.',
      duration: 15, // Per interaction
      pricingConfig: { entryPrice: 25 },
      visibility: 'public'
    },
    tags: ['office hours', 'drop-in', 'quick help'],
    popularity: 74
  },
  {
    id: 'queue-support',
    name: 'Technical Support',
    description: 'Free technical support queue',
    bookingTypeKey: 'drop-in-queue',
    pricingModelId: 'free',
    config: {
      title: 'Free Technical Support',
      description: 'Get help with technical issues in our open support queue.',
      duration: 20,
      pricingConfig: {},
      visibility: 'public'
    },
    tags: ['technical support', 'free', 'help'],
    popularity: 79
  },
  {
    id: 'queue-consultation',
    name: 'Quick Consultation',
    description: 'Fast consultation with entry fee',
    bookingTypeKey: 'drop-in-queue',
    pricingModelId: 'entry-fee',
    config: {
      title: 'Quick Business Questions',
      description: 'Get quick answers to your business questions in our express consultation queue.',
      duration: 10,
      pricingConfig: { entryPrice: 15 },
      visibility: 'public'
    },
    tags: ['quick consultation', 'business', 'express'],
    popularity: 76
  },

  // On-Demand Expert Match Templates
  {
    id: 'expert-match-legal',
    name: 'Legal Expert Match',
    description: 'AI-matched legal consultation',
    bookingTypeKey: 'on-demand-expert',
    pricingModelId: 'fixed',
    config: {
      title: 'Instant Legal Consultation',
      description: 'Get matched with the right legal expert for your specific needs using AI.',
      duration: 45,
      capacity: 1,
      pricingConfig: { price: 275 },
      visibility: 'public'
    },
    tags: ['legal', 'expert matching', 'AI-powered'],
    popularity: 83
  },
  {
    id: 'expert-match-tech',
    name: 'Technical Expert Match',
    description: 'AI-matched technical consultation',
    bookingTypeKey: 'on-demand-expert',
    pricingModelId: 'fixed',
    config: {
      title: 'Tech Problem Solver',
      description: 'Get connected with the perfect technical expert for your specific challenge.',
      duration: 60,
      capacity: 1,
      pricingConfig: { price: 195 },
      visibility: 'public'
    },
    tags: ['technical', 'problem solving', 'expert'],
    popularity: 80
  },
  {
    id: 'expert-match-business',
    name: 'Business Expert Match',
    description: 'AI-matched business strategy consultation',
    bookingTypeKey: 'on-demand-expert',
    pricingModelId: 'fixed',
    config: {
      title: 'Strategic Business Consultation',
      description: 'AI matches you with the ideal business strategist based on your industry and challenges.',
      duration: 75,
      capacity: 1,
      pricingConfig: { price: 320 },
      visibility: 'public'
    },
    tags: ['business strategy', 'expert matching', 'consultation'],
    popularity: 87
  }
];

// Helper function to get templates by booking type
export const getTemplatesByBookingType = (bookingTypeKey: string): ServiceTemplate[] => {
  return SERVICE_TEMPLATES.filter(template => template.bookingTypeKey === bookingTypeKey)
    .sort((a, b) => b.popularity - a.popularity);
};

// Helper function to get template by ID
export const getTemplateById = (id: string): ServiceTemplate | undefined => {
  return SERVICE_TEMPLATES.find(template => template.id === id);
};
